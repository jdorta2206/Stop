"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RouletteWheel } from '@/components/game/roulette-wheel';
import { GameArea } from '@/components/game/game-area';
import { StopButton } from '@/components/game/stop-button';
import { AppHeader } from '@/components/layout/header';
import { AppFooter } from '@/components/layout/footer';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/auth-context';
import { useRoomGameContext } from '@/contexts/room-game-context';
import { UI_TEXTS } from "@/constants/ui-texts";
import { useLanguage } from '@/contexts/language-context';
import { Progress } from '@/components/ui/progress';
import { ChatPanel } from '@/components/chat/chat-panel';
import { supabase } from '@/lib/supabase/client';
import { PlayerInLobby } from '@/types/player';

const ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z'
];

const ROUND_DURATION_SECONDS = 60;

type Language = 'es' | 'en' | 'fr' | 'pt';
type GameState = "IDLE" | "SPINNING" | "PLAYING" | "EVALUATING" | "RESULTS";

interface RoundResult {
  playerScore: number;
  aiScore: number;
  playerResponse: string;
  aiResponse: string;
  playerResponseIsValid?: boolean;
  playerResponseErrorReason?: "format" | "invalid_word" | "api_error" | null;
}

interface RoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

const CATEGORIES_BY_LANG: Record<Language, string[]> = {
  es: ["Nombre", "Lugar", "Animal", "Objeto", "Color", "Fruta o Verdura"],
  en: ["Name", "Place", "Animal", "Thing", "Color", "Fruit or Vegetable"],
  fr: ["Nom", "Lieu", "Animal", "Chose", "Couleur", "Fruit ou Légume"],
  pt: ["Nome", "Lugar", "Animal", "Coisa", "Cor", "Fruta ou Legume"]
};

export default function RoomGamePage({ params }: RoomPageProps) {
  const { user } = useAuth();
  const {
    activeRoomId,
    gameData,
    connectedPlayers,
    joinRoom,
    leaveRoom,
    broadcastGameState,
    isHost
  } = useRoomGameContext();
  const { language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  const [roomId, setRoomId] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<GameState>("IDLE");
  const [currentLetter, setCurrentLetter] = useState<string | null>(null);
  const [playerResponses, setPlayerResponses] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION_SECONDS);
  const [scores, setScores] = useState({
    total: 0,
    personalHigh: 0,
    round: 0
  });
  const [roundResults, setRoundResults] = useState<Record<string, RoundResult>>({});
  const [chatState, setChatState] = useState({
    isOpen: false,
    messages: []
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameStatusRef = useRef(gameStatus);

  // Resolver los parámetros de forma asíncrona
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setRoomId(resolvedParams.roomId);
      } catch (error) {
        console.error('Error resolving params:', error);
        router.push('/');
      }
    };

    resolveParams();
  }, [params, router]);

  // Inicializar scores desde localStorage después del primer render
  useEffect(() => {
    const savedHighScore = localStorage.getItem('globalStopHighScore');
    setScores(prev => ({
      ...prev,
      personalHigh: savedHighScore ? Number(savedHighScore) : 0
    }));
  }, []);

  useEffect(() => {
    gameStatusRef.current = gameStatus;
  }, [gameStatus]);

  useEffect(() => {
    if (gameData) {
      setGameStatus(gameData.current_state as GameState);
      setCurrentLetter(gameData.current_letter || null);
      setTimeLeft(gameData.time_left || ROUND_DURATION_SECONDS);
    }
  }, [gameData]);

  useEffect(() => {
    const joinGameRoom = async () => {
      if (!user || !roomId) {
        if (roomId === null) return; // Aún cargando params
        router.push('/');
        return;
      }

      try {
        const playerData: PlayerInLobby = {
          id: user.id || 'anonymous',
          name: user.user_metadata?.name || `Player${Math.floor(Math.random() * 1000)}`,
          avatar: user.user_metadata?.avatar_url || '',
          score: 0,
          isReady: false
        };

        await joinRoom(roomId, playerData);
      } catch (error) {
        toast({
          title: getGameText('errors', 'joinRoomFailed'),
          descripcion: getGameText('errors', 'tryAgainLater')
        });
        router.push('/');
      }
    };

    joinGameRoom();

    return () => {
      leaveRoom();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [user, roomId, joinRoom, leaveRoom, router, toast]);

  const getGameText = (category: string, key: string): string => {
    const categoryTexts = UI_TEXTS[category as keyof typeof UI_TEXTS];
    if (!categoryTexts) return "";

    const textEntry = categoryTexts[key as keyof typeof categoryTexts];
    if (typeof textEntry !== 'object') return "";

    return textEntry[language] || "";
  };

  const startGame = useCallback(() => {
    if (!isHost) return;

    setPlayerResponses({});
    setRoundResults({});
    setTimeLeft(ROUND_DURATION_SECONDS);
    clearInterval(timerRef.current as NodeJS.Timeout);

    setGameStatus("SPINNING");
    broadcastGameState({ current_state: "SPINNING" });
  }, [isHost, broadcastGameState]);

  const handleSpinComplete = useCallback((letter: string) => {
    if (!isHost) return;

    setCurrentLetter(letter);
    setGameStatus("PLAYING");
    broadcastGameState({
      current_state: "PLAYING",
      current_letter: letter,
      time_left: ROUND_DURATION_SECONDS
    });

    clearInterval(timerRef.current as NodeJS.Timeout);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;

        if (isHost && newTime % 5 === 0) {
          broadcastGameState({ time_left: newTime });
        }

        if (newTime <= 0) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          if (gameStatusRef.current === "PLAYING") {
            endRound();
          }
          return 0;
        }
        return newTime;
      });
    }, 1000);
  }, [isHost, broadcastGameState]);

  const evaluateAnswers = useCallback(() => {
    const results: Record<string, RoundResult> = {};
    let roundScore = 0;

    Object.entries(playerResponses).forEach(([category, answer]) => {
      const isValid = Boolean(answer && answer.toLowerCase().startsWith(currentLetter?.toLowerCase() || ''));
      results[category] = {
        playerScore: isValid ? 10 : 0,
        aiScore: 0,
        playerResponse: answer,
        aiResponse: "",
        playerResponseIsValid: isValid,
        playerResponseErrorReason: isValid ? null : "invalid_word"
      };

      if (isValid) roundScore += 10;
    });

    setRoundResults(results);
    const newTotalScore = scores.total + roundScore;

    setScores(prev => ({
      total: newTotalScore,
      personalHigh: Math.max(newTotalScore, prev.personalHigh),
      round: roundScore
    }));

    if (newTotalScore > scores.personalHigh) {
      localStorage.setItem('globalStopHighScore', newTotalScore.toString());
    }

    setGameStatus("RESULTS");
    broadcastGameState({ current_state: "RESULTS" });
  }, [playerResponses, currentLetter, scores.total, scores.personalHigh, broadcastGameState]);

  const endRound = useCallback(async () => {
    if (!isHost) return;

    try {
      setGameStatus("EVALUATING");
      await broadcastGameState({ current_state: "EVALUATING" });
      evaluateAnswers();
    } catch (error) {
      toast({
        title: getGameText('errors', 'evaluationFailed'),
        descripcion: getGameText('errors', 'tryAgainLater')
      });
    }
  }, [isHost, broadcastGameState, evaluateAnswers, toast]);

  const handleResponseChange = useCallback((category: string, value: string) => {
    setPlayerResponses(prev => ({ ...prev, [category]: value }));

    if (isHost && user?.id && activeRoomId) {
      supabase
        .from('player_responses')
        .upsert({
          room_id: activeRoomId,
          player_id: user.id,
          category,
          response: value
        });
    }
  }, [isHost, activeRoomId, user?.id]);

  // Mostrar loading mientras se resuelven los parámetros
  if (roomId === null) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <AppHeader />
        <main className="flex-grow container mx-auto p-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Cargando...</h1>
          </div>
        </main>
        <AppFooter language={language} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />

      <main className="flex-grow container mx-auto p-4">
        {gameStatus === "IDLE" && (
          <div className="flex flex-col items-center justify-center gap-8">
            <h1 className="text-4xl font-bold text-center">
              {getGameText('game', 'waitingForHost')}
            </h1>
            {isHost && (
              <Button onClick={startGame} size="lg">
                {getGameText('game', 'startGame')}
              </Button>
            )}
            <div className="text-center">
              <h3 className="text-xl font-semibold">{getGameText('game', 'playersInRoom')}:</h3>
              <ul className="space-y-2">
                {connectedPlayers.map(player => (
                  <li key={player.id}>{player.name}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {gameStatus === "SPINNING" && isHost && (
          <div className="flex justify-center">
            <RouletteWheel
              isSpinning={true}
              alphabet={ALPHABET}
              language={language}
              onSpinComplete={handleSpinComplete}
            />
          </div>
        )}

        {(gameStatus === "PLAYING" || gameStatus === "EVALUATING" || gameStatus === "RESULTS") && currentLetter && (
          <div className="space-y-6">
            {gameStatus === "PLAYING" && (
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">
                  {getGameText('game', 'currentLetter')}: {currentLetter}
                </h2>
                <Progress value={(timeLeft / ROUND_DURATION_SECONDS) * 100} />
                <p>{timeLeft}s {getGameText('game', 'timeRemaining')}</p>
              </div>
            )}

            <GameArea
              categories={[...CATEGORIES_BY_LANG[language]]}
              letter={currentLetter}
              playerResponses={playerResponses}
              onInputChange={handleResponseChange}
              isEvaluating={gameStatus === "EVALUATING"}
              showResults={gameStatus === "RESULTS"}
              roundResults={roundResults}
              language={language}
              gameMode="room"
            />

            {isHost && gameStatus === "PLAYING" && (
              <div className="flex justify-center">
                <StopButton
                  onClick={endRound}
                  disabled={Object.keys(playerResponses).length === 0}
                  language={language}
                />
              </div>
            )}
          </div>
        )}

        {gameStatus === "RESULTS" && (
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle>{getGameText('game', 'resultsTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{getGameText('game', 'roundScore')}: {scores.round}</p>
              <p>{getGameText('game', 'totalScore')}: {scores.total}</p>
              <p>{getGameText('game', 'personalBest')}: {scores.personalHigh}</p>
            </CardContent>
            {isHost && (
              <div className="flex justify-center p-4">
                <Button onClick={startGame}>
                  {getGameText('game', 'nextRound')}
                </Button>
              </div>
            )}
          </Card>
        )}
      </main>

      {activeRoomId && user && (
        <ChatPanel
          currentRoomId={activeRoomId}
          currentUserUid={user.id}
          currentUserName={user.user_metadata?.name || 'Guest'}
          messages={chatState.messages}
          isOpen={chatState.isOpen}
          setIsOpen={(open) => setChatState(prev => ({ ...prev, isOpen: open }))}
          language={language}
        />
      )}

      <AppFooter language={language} />
    </div>
  );
}
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

// Usamos el tipo generado dinámicamente por Next.js
declare global {
  namespace React {
    interface PageProps {
      params: {
        roomId: string;
      };
    }
  }
}

type Language = 'es' | 'en' | 'fr' | 'pt';

const ROUND_DURATION_SECONDS = 60;
const CATEGORIES_BY_LANG = {
  es: ["Nombre", "Lugar", "Animal", "Objeto", "Color", "Fruta o Verdura"],
  en: ["Name", "Place", "Animal", "Thing", "Color", "Fruit or Vegetable"],
  fr: ["Nom", "Lieu", "Animal", "Chose", "Couleur", "Fruit ou Légume"],
  pt: ["Nome", "Lugar", "Animal", "Coisa", "Cor", "Fruta ou Legume"]
} as const;

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

type GameState = "IDLE" | "SPINNING" | "PLAYING" | "EVALUATING" | "RESULTS";

interface RoundResult {
  playerScore: number;
  aiScore: number;
  playerResponse: string;
  aiResponse: string;
  playerResponseIsValid?: boolean;
  playerResponseErrorReason?: "format" | "invalid_word" | "api_error" | null;
}

// Solución definitiva: Usamos el tipo any para evitar conflictos con los tipos internos de Next.js
export default function RoomGamePage(props: any) {
  const { params } = props;
  const { roomId } = params as { roomId: string };

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

  const [localGameState, setLocalGameState] = useState<GameState>("IDLE");
  const [currentLetter, setCurrentLetter] = useState<string | null>(null);
  const [playerResponses, setPlayerResponses] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION_SECONDS);
  const [totalPlayerScore, setTotalPlayerScore] = useState(0);
  const [personalHighScore, setPersonalHighScore] = useState(0);
  const [roundResults, setRoundResults] = useState<Record<string, RoundResult>>({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameStateRef = useRef(localGameState);

  const getGameText = (category: string, key: string): string => {
    try {
      const categoryObj = UI_TEXTS[category as keyof typeof UI_TEXTS];
      if (!categoryObj) return "";

      const keyObj = categoryObj[key as keyof typeof categoryObj];
      if (!keyObj || typeof keyObj !== 'object') return "";

      const text = keyObj[language as Language];
      return text || "";
    } catch {
      return "";
    }
  };

  const startGame = useCallback(() => {
    if (!isHost) return;

    setPlayerResponses({});
    setRoundResults({});
    setTimeLeft(ROUND_DURATION_SECONDS);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    setLocalGameState("SPINNING");
    broadcastGameState({ current_state: "SPINNING" });
  }, [isHost, broadcastGameState]);

  const handleSpinComplete = useCallback((letter: string) => {
    if (!isHost) return;

    setCurrentLetter(letter);
    setLocalGameState("PLAYING");
    broadcastGameState({
      current_state: "PLAYING",
      current_letter: letter,
      time_left: ROUND_DURATION_SECONDS
    });

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;

        if (isHost && newTime % 5 === 0) {
          broadcastGameState({ time_left: newTime });
        }

        if (newTime <= 0) {
          clearInterval(timerIntervalRef.current as NodeJS.Timeout);
          if (gameStateRef.current === "PLAYING") {
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
      if (isValid) {
        roundScore += 10;
      }
    });

    setRoundResults(results);
    const newTotalScore = totalPlayerScore + roundScore;
    setTotalPlayerScore(newTotalScore);

    if (newTotalScore > personalHighScore) {
      setPersonalHighScore(newTotalScore);
      localStorage.setItem('globalStopHighScore', newTotalScore.toString());
    }

    setLocalGameState("RESULTS");
    broadcastGameState({ current_state: "RESULTS" });
  }, [playerResponses, currentLetter, totalPlayerScore, personalHighScore, broadcastGameState]);

  const endRound = useCallback(async () => {
    if (!isHost) return;

    try {
      setLocalGameState("EVALUATING");
      await broadcastGameState({ current_state: "EVALUATING" });
      evaluateAnswers();
    } catch (error) {
      toast({
        title: "Error",
        descripcion: "Error al evaluar las respuestas"
      });
    }
  }, [isHost, broadcastGameState, evaluateAnswers, toast]);

  useEffect(() => {
    gameStateRef.current = localGameState;
  }, [localGameState]);

  useEffect(() => {
    if (gameData) {
      setLocalGameState(gameData.current_state as GameState);
      setCurrentLetter(gameData.current_letter);
      setTimeLeft(gameData.time_left);
    }
  }, [gameData]);

  useEffect(() => {
    const storedHighScore = localStorage.getItem('globalStopHighScore');
    if (storedHighScore) {
      setPersonalHighScore(parseInt(storedHighScore, 10));
    }

    const joinGame = async () => {
      if (!user) return;

      try {
        const userMetadata = user.user_metadata as any;
        const playerData: PlayerInLobby = {
          id: user.id || userMetadata?.sub || 'anonymous',
          name: userMetadata?.name || userMetadata?.full_name || `Player${Math.floor(Math.random() * 1000)}`,
          avatar: userMetadata?.avatar_url || userMetadata?.picture || '',
          score: 0,
          isReady: false
        };

        await joinRoom(roomId, playerData);
      } catch (error) {
        toast({
          title: "Error",
          descripcion: "No se pudo unir a la sala"
        });
        router.push('/');
      }
    };

    joinGame();

    return () => {
      leaveRoom();
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [user, roomId, language, joinRoom, leaveRoom, router, toast]);

  const handleResponseChange = useCallback((category: string, value: string) => {
    setPlayerResponses(prev => ({ ...prev, [category]: value }));

    if (isHost) {
      const userMetadata = user?.user_metadata as any;
      supabase
        .from('player_responses')
        .upsert({
          room_id: activeRoomId,
          player_id: user?.id || userMetadata?.sub,
          category,
          response: value
        });
    }
  }, [isHost, activeRoomId, user?.id, user?.user_metadata]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />

      <main className="flex-grow container mx-auto p-4">
        {localGameState === "IDLE" && (
          <div className="flex flex-col items-center justify-center gap-8">
            <h1 className="text-4xl font-bold text-center">
              {getGameText('game', 'results.title')}
            </h1>
            {isHost && (
              <Button onClick={startGame} size="lg">
                {getGameText('game', 'buttons.nextRound')}
              </Button>
            )}
            <div className="text-center">
              <h3 className="text-xl font-semibold">Jugadores en sala:</h3>
              <ul>
                {connectedPlayers.map(player => (
                  <li key={player.id}>{player.name}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {localGameState === "SPINNING" && isHost && (
          <RouletteWheel
            isSpinning={true}
            alphabet={ALPHABET}
            language={language}
            onSpinComplete={handleSpinComplete}
          />
        )}

        {(localGameState === "PLAYING" || localGameState === "EVALUATING" || localGameState === "RESULTS") && currentLetter && (
          <div className="space-y-6">
            {localGameState === "PLAYING" && (
              <div className="text-center">
                <h2 className="text-2xl font-bold">
                  Letra actual: {currentLetter}
                </h2>
                <Progress value={(timeLeft / ROUND_DURATION_SECONDS) * 100} />
                <p>{timeLeft}s restantes</p>
              </div>
            )}

            <GameArea
              categories={[...CATEGORIES_BY_LANG[language as Language]]}
              letter={currentLetter}
              playerResponses={playerResponses}
              onInputChange={handleResponseChange}
              isEvaluating={localGameState === "EVALUATING"}
              showResults={localGameState === "RESULTS"}
              roundResults={roundResults}
              language={language}
              gameMode="room"
            />

            {isHost && localGameState === "PLAYING" && (
              <StopButton
                onClick={endRound}
                disabled={Object.keys(playerResponses).length === 0}
                language={language}
              />
            )}
          </div>
        )}

        {localGameState === "RESULTS" && (
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Tu puntuación: {totalPlayerScore - personalHighScore}</p>
              <p>Puntuación total: {totalPlayerScore}</p>
              <p>Récord personal: {personalHighScore}</p>
            </CardContent>
            {isHost && (
              <div className="flex justify-center p-4">
                <Button onClick={startGame}>
                  Siguiente ronda
                </Button>
              </div>
            )}
          </Card>
        )}
      </main>

      {activeRoomId && user && (
        <ChatPanel
          currentRoomId={activeRoomId}
          currentUserUid={user.id || (user.user_metadata as any)?.sub || 'anonymous'}
          currentUserName={(user.user_metadata as any)?.name || (user.user_metadata as any)?.full_name || 'Guest'}
          messages={messages}
          isOpen={isChatOpen}
          setIsOpen={setIsChatOpen}
          language={language}
        />
      )}

      <AppFooter language={language} />
    </div>
  );
}
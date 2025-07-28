import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserAccount } from "@/components/auth/UserAccount";
import MultiplayerEnhancements from "@/components/game/MultiplayerEnhancements";
import VoiceChat from "@/components/game/VoiceChat";
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { soundEffects } from "@/lib/soundEffects";

type GameState = "room" | "spinning" | "playing" | "stopped" | "results";
type Category = "país" | "animal" | "nombre" | "comida" | "color" | "objeto";
type LanguageOption = 'es' | 'en' | 'fr' | 'pt';

interface Answer {
  category: Category;
  answer: string;
  isValid: boolean | null;
  score: number;
}

interface Player {
  id: string;
  name: string;
  answers: Record<Category, Answer>;
  totalScore: number;
  isAI: boolean;
}

interface Room {
  id: string;
  code: string;
  host: string;
  players: Player[];
  maxPlayers: number;
  status: 'waiting' | 'playing' | 'finished';
}

// Lista de posibles letras para el juego
const LETTERS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

// Categorías del juego
const CATEGORIES: Category[] = ["país", "animal", "nombre", "comida", "color", "objeto"];

export default function PrivateRoom() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<LanguageOption>('es');
  const [gameState, setGameState] = useState<GameState>("room");
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [wheelRotation, setWheelRotation] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [answers, setAnswers] = useState<Record<Category, string>>({
    "país": "",
    "animal": "",
    "nombre": "",
    "comida": "",
    "color": "",
    "objeto": ""
  });

  // Contenido traducible
  const content = {
    es: {
      title: "Sala Privada",
      backToHome: "Volver al inicio",
      spinning: "Girando la ruleta...",
      categories: "Categorías",
      timeLeft: "Tiempo restante",
      stopButton: "¡STOP!",
      results: "Resultados",
      playAgain: "Jugar de nuevo",
      country: "País",
      animal: "Animal",
      name: "Nombre",
      food: "Comida",
      color: "Color",
      object: "Objeto",
      winner: "Ganador:",
      scores: "Puntuaciones:",
      selectedLetter: "Letra seleccionada:",
      signIn: "Iniciar Sesión",
      language: "Idioma",
      waitingRoom: "Sala de Espera",
      gameInProgress: "Juego en Progreso",
    },
    en: {
      title: "Private Room",
      backToHome: "Back to home",
      spinning: "Spinning the wheel...",
      categories: "Categories",
      timeLeft: "Time left",
      stopButton: "STOP!",
      results: "Results",
      playAgain: "Play again",
      country: "Country",
      animal: "Animal",
      name: "Name",
      food: "Food",
      color: "Color",
      object: "Object",
      winner: "Winner:",
      scores: "Scores:",
      selectedLetter: "Selected letter:",
      signIn: "Sign In",
      language: "Language",
      waitingRoom: "Waiting Room",
      gameInProgress: "Game in Progress",
    },
    fr: {
      title: "Salon Privé",
      backToHome: "Retour à l'accueil",
      spinning: "La roue tourne...",
      categories: "Catégories",
      timeLeft: "Temps restant",
      stopButton: "STOP!",
      results: "Résultats",
      playAgain: "Rejouer",
      country: "Pays",
      animal: "Animal",
      name: "Prénom",
      food: "Nourriture",
      color: "Couleur",
      object: "Objet",
      winner: "Gagnant:",
      scores: "Scores:",
      selectedLetter: "Lettre sélectionnée:",
      signIn: "Se connecter",
      language: "Langue",
      waitingRoom: "Salle d'attente",
      gameInProgress: "Jeu en cours",
    },
    pt: {
      title: "Sala Privada",
      backToHome: "Voltar ao início",
      spinning: "Girando a roleta...",
      categories: "Categorias",
      timeLeft: "Tempo restante",
      stopButton: "STOP!",
      results: "Resultados",
      playAgain: "Jogar novamente",
      country: "País",
      animal: "Animal",
      name: "Nome",
      food: "Comida",
      color: "Cor",
      object: "Objeto",
      winner: "Vencedor:",
      scores: "Pontuações:",
      selectedLetter: "Letra selecionada:",
      signIn: "Entrar",
      language: "Idioma",
      waitingRoom: "Sala de Espera",
      gameInProgress: "Jogo em Andamento",
    }
  };

  const t = content[language];

  // Handle room joined
  const handleRoomJoined = (room: Room) => {
    setCurrentRoom(room);
    // Convert room players to game players
    const gamePlayers = room.players.map(p => ({
      id: p.id,
      name: p.name,
      answers: createEmptyAnswers(),
      totalScore: 0,
      isAI: false
    }));
    setPlayers(gamePlayers);
    setCurrentPlayer(gamePlayers.find(p => p.id === user?.id) || gamePlayers[0]);
  };

  // Handle game start
  const handleStartGame = () => {
    if (currentRoom) {
      setGameState("spinning");
      spinWheel();
    }
  };

  // Crear respuestas vacías para un jugador
  const createEmptyAnswers = () => {
    const emptyAnswers: Record<Category, Answer> = {
      "país": { category: "país", answer: "", isValid: null, score: 0 },
      "animal": { category: "animal", answer: "", isValid: null, score: 0 },
      "nombre": { category: "nombre", answer: "", isValid: null, score: 0 },
      "comida": { category: "comida", answer: "", isValid: null, score: 0 },
      "color": { category: "color", answer: "", isValid: null, score: 0 },
      "objeto": { category: "objeto", answer: "", isValid: null, score: 0 }
    };
    return emptyAnswers;
  };

  // Girar la ruleta para seleccionar una letra
  const spinWheel = () => {
    setGameState("spinning");
    
    // Iniciar sonido de reloj
    soundEffects.startClockTicking();
    
    // Simular el giro de la ruleta
    const spinInterval = setInterval(() => {
      setWheelRotation(prev => prev + 30);
    }, 50);
    
    // Detener la ruleta después de un tiempo aleatorio
    setTimeout(() => {
      clearInterval(spinInterval);
      
      // Detener sonido de reloj
      soundEffects.stopClockTicking();
      
      // Seleccionar una letra aleatoria
      const randomLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      setSelectedLetter(randomLetter);
      
      // Reproducir sonido de letra seleccionada
      soundEffects.playLetterSelected();
      
      // Comenzar el juego
      setGameState("playing");
      startTimer();
      
      // Reproducir sonido de inicio de juego
      setTimeout(() => {
        soundEffects.playGameStart();
      }, 500);
    }, 2000);
  };

  // Iniciar el temporizador
  const startTimer = () => {
    setTimeLeft(60);
    
    // Iniciar sonido de cuenta atrás
    soundEffects.startCountdownTicking();
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Detener el juego
  const stopGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Detener sonido de cuenta atrás
    soundEffects.stopCountdownTicking();
    
    // Reproducir sonido de alarma cuando alguien presiona STOP
    soundEffects.playStopAlarm();
    
    setGameState("stopped");
    calculateScores();
  };

  // Calcular puntuaciones
  const calculateScores = () => {
    const newPlayers = [...players];
    
    // Primero, verificar respuestas válidas
    newPlayers.forEach((player, playerIndex) => {
      CATEGORIES.forEach(category => {
        const answer = player.answers[category].answer.trim();
        if (!answer) {
          newPlayers[playerIndex].answers[category].isValid = false;
          newPlayers[playerIndex].answers[category].score = 0;
        } else if (answer.toLowerCase().startsWith(selectedLetter.toLowerCase())) {
          newPlayers[playerIndex].answers[category].isValid = true;
          // Puntos se calcularán después
        } else {
          newPlayers[playerIndex].answers[category].isValid = false;
          newPlayers[playerIndex].answers[category].score = 0;
        }
      });
    });
    
    // Segundo, calcular puntos considerando respuestas duplicadas
    CATEGORIES.forEach(category => {
      const validAnswers = {};
      
      // Contar respuestas válidas idénticas
      newPlayers.forEach((player, playerIndex) => {
        if (newPlayers[playerIndex].answers[category].isValid) {
          const answer = player.answers[category].answer.trim().toLowerCase();
          if (!validAnswers[answer]) {
            validAnswers[answer] = [];
          }
          validAnswers[answer].push(playerIndex);
        }
      });
      
      // Asignar puntos según duplicados
      Object.keys(validAnswers).forEach(answer => {
        const playerIndexes = validAnswers[answer];
        const points = playerIndexes.length > 1 ? 5 : 10; // 5 puntos si hay duplicados, 10 si es único
        
        playerIndexes.forEach(playerIndex => {
          newPlayers[playerIndex].answers[category].score = points;
        });
      });
    });
    
    // Calcular puntuación total
    newPlayers.forEach((player, playerIndex) => {
      let totalScore = 0;
      CATEGORIES.forEach(category => {
        totalScore += newPlayers[playerIndex].answers[category].score;
      });
      newPlayers[playerIndex].totalScore = totalScore;
    });
    
    setPlayers(newPlayers);
    setGameState("results");
    
    // Reproducir sonido de victoria para el ganador
    setTimeout(() => {
      soundEffects.playVictorySound();
    }, 500);
  };

  // Manejar cambios en los inputs de respuestas
  const handleAnswerChange = (category: Category, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [category]: value
    }));
    
    // Actualizar las respuestas del jugador actual
    if (currentPlayer) {
      const newPlayers = [...players];
      const currentPlayerIndex = newPlayers.findIndex(p => p.id === currentPlayer.id);
      
      if (currentPlayerIndex !== -1) {
        newPlayers[currentPlayerIndex].answers[category] = {
          ...newPlayers[currentPlayerIndex].answers[category],
          answer: value
        };
        
        setPlayers(newPlayers);
      }
    }
  };

  // Reiniciar el juego
  const resetGame = () => {
    // Detener cualquier sonido que esté reproduciéndose
    soundEffects.stopClockTicking();
    soundEffects.stopCountdownTicking();
    
    setGameState("room");
    setSelectedLetter("");
    setWheelRotation(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(60);
    setAnswers({
      "país": "",
      "animal": "",
      "nombre": "",
      "comida": "",
      "color": "",
      "objeto": ""
    });
    
    // Reset player answers
    const resetPlayers = players.map(player => ({
      ...player,
      answers: createEmptyAnswers(),
      totalScore: 0
    }));
    setPlayers(resetPlayers);
  };

  // Determinar el ganador
  const getWinner = () => {
    if (players.length === 0) return null;
    
    let maxScore = -1;
    let winnerPlayer: Player | null = null;
    
    players.forEach(player => {
      if (player.totalScore > maxScore) {
        maxScore = player.totalScore;
        winnerPlayer = player;
      }
    });
    
    return winnerPlayer;
  };

  return (
    <div className="min-h-screen bg-red-600">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white hover:text-white/80">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/assets/publiclogo.png" alt="STOP Game Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <h1 className="text-2xl font-bold text-white">{t.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-red-700/50 rounded-full p-1">
            <button
              onClick={() => setLanguage('es')}
              className={`px-2 py-1 rounded-full text-xs sm:text-sm transition-all ${
                language === 'es' ? 'bg-white text-red-600' : 'text-white'
              }`}
            >
              ES
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-full text-xs sm:text-sm transition-all ${
                language === 'en' ? 'bg-white text-red-600' : 'text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 rounded-full text-xs sm:text-sm transition-all ${
                language === 'fr' ? 'bg-white text-red-600' : 'text-white'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('pt')}
              className={`px-2 py-1 rounded-full text-xs sm:text-sm transition-all ${
                language === 'pt' ? 'bg-white text-red-600' : 'text-white'
              }`}
            >
              PT
            </button>
          </div>
          
          {isAuthenticated ? (
            <UserAccount />
          ) : (
            <Button 
              variant="outline" 
              onClick={() => setAuthModalOpen(true)}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              {t.signIn}
            </Button>
          )}
        </div>
      </header>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <main className="max-w-6xl mx-auto p-4">
        {/* Room Management Phase */}
        {gameState === "room" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MultiplayerEnhancements
                roomId={currentRoom?.id || "ROOM123"}
                currentUserId={user?.id || "guest"}
                currentUsername={user?.name || "Usuario"}
                onLeaveRoom={resetGame}
                onStartGame={handleStartGame}
              />
            </div>
            
            {/* Voice Chat Panel */}
            {currentRoom && (
              <div className="space-y-4">
                <VoiceChat
                  roomId={currentRoom.id}
                  userId={user?.id || 'guest'}
                  userName={user?.name || 'Guest'}
                  language={language}
                />
                
                {/* Room Status */}
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">{t.waitingRoom}</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-white/70">
                      {language === 'es' ? 'Esperando a que todos los jugadores estén listos...' :
                       language === 'fr' ? 'En attente que tous les joueurs soient prêts...' :
                       language === 'pt' ? 'Aguardando todos os jogadores ficarem prontos...' :
                       'Waiting for all players to be ready...'}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Game States */}
        {gameState === "spinning" && (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-white mb-8">{t.spinning}</h2>
            
            <div 
              className="w-64 h-64 rounded-full bg-white flex items-center justify-center mb-8 relative"
              style={{ transform: `rotate(${wheelRotation}deg)`, transition: 'transform 0.1s ease' }}
            >
              {LETTERS.map((letter, index) => (
                <div 
                  key={letter}
                  className="absolute font-bold"
                  style={{
                    transform: `rotate(${index * (360 / LETTERS.length)}deg) translateY(-100px)`,
                    transformOrigin: 'center center',
                  }}
                >
                  {letter}
                </div>
              ))}
              <div className="w-16 h-16 rounded-full flex items-center justify-center z-10 overflow-hidden">
                <img src="/assets/publiclogo.png" alt="STOP Game Logo" className="w-full h-full object-contain rounded-full" />
              </div>
            </div>
          </div>
        )}

        {gameState === "playing" && currentPlayer && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white">{t.selectedLetter}: <span className="text-yellow-300">{selectedLetter}</span></h2>
                  <p className="text-white/80">{t.timeLeft}: <span className="font-bold">{timeLeft}s</span></p>
                </div>
                
                <Button 
                  onClick={stopGame}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-full text-xl"
                >
                  {t.stopButton}
                </Button>
              </div>
              
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white mb-8">
                <CardHeader>
                  <h3 className="text-2xl font-bold">{t.categories}</h3>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CATEGORIES.map((category) => (
                    <div key={category} className="flex flex-col">
                      <label className="block text-sm mb-1">
                        {category === "país" ? t.country :
                         category === "animal" ? t.animal :
                         category === "nombre" ? t.name :
                         category === "comida" ? t.food :
                         category === "color" ? t.color :
                         category === "objeto" ? t.object : category}
                      </label>
                      <Input
                        placeholder={`${selectedLetter}...`}
                        value={currentPlayer.answers[category].answer}
                        onChange={(e) => handleAnswerChange(category, e.target.value)}
                        className="bg-white/20 border-white/30 text-white placeholder-white/50"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            {/* Voice Chat during game */}
            {currentRoom && (
              <div>
                <VoiceChat
                  roomId={currentRoom.id}
                  userId={user?.id || 'guest'}
                  userName={user?.name || 'Guest'}
                  language={language}
                />
              </div>
            )}
          </div>
        )}

        {gameState === "results" && (
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-white mb-6">{t.results}</h2>
            
            <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg p-6 mb-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white">{t.winner} <span className="text-yellow-300">{getWinner()?.name}</span></h3>
                <p className="text-white/80 mt-2">{t.selectedLetter}: <span className="font-bold">{selectedLetter}</span></p>
              </div>
              
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-white mb-2">{t.scores}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {players.map((player) => (
                    <Card key={player.id} className="bg-white/5 backdrop-blur-sm border-white/10">
                      <CardHeader className="py-3">
                        <h5 className="text-lg font-semibold text-white">{player.name}</h5>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-300 mb-2">{player.totalScore} pts</div>
                        <div className="space-y-1 text-sm">
                          {CATEGORIES.map((category) => {
                            const answer = player.answers[category];
                            return (
                              <div key={category} className="flex justify-between text-white">
                                <span>{
                                  category === "país" ? t.country :
                                  category === "animal" ? t.animal :
                                  category === "nombre" ? t.name :
                                  category === "comida" ? t.food :
                                  category === "color" ? t.color :
                                  category === "objeto" ? t.object : category
                                }</span>
                                <div className="flex items-center">
                                  <span className={`mr-2 ${answer.isValid ? 'text-green-400' : 'text-red-400'}`}>
                                    {answer.answer || '-'}
                                  </span>
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                                    {answer.score}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={resetGame}
                  className="bg-white text-red-600 hover:bg-white/90"
                >
                  {t.playAgain}
                </Button>
                <Link to="/">
                  <Button 
                    className="bg-red-700 text-white hover:bg-red-800"
                  >
                    {t.backToHome}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
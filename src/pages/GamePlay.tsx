import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserAccount } from "@/components/auth/UserAccount";
import { soundEffects } from "@/lib/soundEffects";
import { rankingManager, type GameResult } from "@/lib/ranking";
import { validateWord, getWordSuggestions } from "@/lib/wordValidator";

type GameMode = "ai" | "multiplayer" | null;
type GameState = "setup" | "spinning" | "playing" | "stopped" | "results";
type Category = "lugar" | "animal" | "nombre" | "comida" | "color" | "objeto";
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

// Lista de posibles letras para el juego
const LETTERS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

// Categorías del juego
const CATEGORIES: Category[] = ["lugar", "animal", "nombre", "comida", "color", "objeto"];

// Datos para simulación de respuestas de la IA
const AI_ANSWERS: Record<string, Record<Category, string[]>> = {
  "A": {
    "lugar": ["Argentina", "Australia", "Alemania", "Austria", "Angola"],
    "animal": ["Araña", "Avestruz", "Águila", "Ardilla", "Alacrán"],
    "nombre": ["Ana", "Alberto", "Antonio", "Adriana", "Alejandro"],
    "comida": ["Arroz", "Aguacate", "Avena", "Ajo", "Aceitunas"],
    "color": ["Azul", "Ámbar", "Amarillo", "Anaranjado", "Aguamarina"],
    "objeto": ["Armario", "Avión", "Anillo", "Alfombra", "Abanico"]
  },
  "B": {
    "lugar": ["Bolivia", "Brasil", "Bélgica", "Bahamas", "Bulgaria"],
    "animal": ["Ballena", "Buey", "Búfalo", "Burro", "Bisonte"],
    "nombre": ["Beatriz", "Bruno", "Benjamín", "Belén", "Borja"],
    "comida": ["Berenjenas", "Bananas", "Batatas", "Boniato", "Bacalao"],
    "color": ["Blanco", "Beige", "Burdeos", "Bronce", "Bermellón"],
    "objeto": ["Bolígrafo", "Bombilla", "Balón", "Botella", "Banco"]
  },
  // Añadir más letras según sea necesario
};

export default function GamePlay() {
  const [language, setLanguage] = useState<LanguageOption>('es');
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [gameState, setGameState] = useState<GameState>("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [wheelRotation, setWheelRotation] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [numPlayers, setNumPlayers] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [answers, setAnswers] = useState<Record<Category, string>>({
    "lugar": "",
    "animal": "",
    "nombre": "",
    "comida": "",
    "color": "",
    "objeto": ""
  });
  
  // Use authenticated user's name if available
  useEffect(() => {
    if (isAuthenticated && user) {
      setPlayerName(user.name);
    }
  }, [isAuthenticated, user]);

  // Contenido traducible
  const content = {
    es: {
      title: "Stop",
      selectMode: "Selecciona un modo de juego",
      vsAI: "Jugar contra la IA",
      vsPlayers: "Jugar con amigos",
      playerName: "Tu nombre",
      startGame: "Comenzar juego",
      spinning: "Girando la ruleta...",
      categories: "Categorías",
      timeLeft: "Tiempo restante",
      stopButton: "¡STOP!",
      yourAnswers: "Tus respuestas",
      aiAnswers: "Respuestas de la IA",
      results: "Resultados",
      playAgain: "Jugar de nuevo",
      backToHome: "Volver al inicio",
      country: "País",
      animal: "Animal",
      name: "Nombre",
      food: "Comida",
      color: "Color",
      object: "Objeto",
      enterName: "Ingresa tu nombre para comenzar",
      numPlayers: "Número de jugadores:",
      waitingForPlayers: "Esperando a los jugadores...",
      nextPlayer: "Siguiente jugador:",
      invalid: "Inválido",
      valid: "Válido",
      winner: "Ganador:",
      scores: "Puntuaciones:",
      enterPlayer: "Ingresa el nombre del jugador",
      readyToStart: "Listo para comenzar",
      selectedLetter: "Letra seleccionada:",
      language: "Idioma",
    },
    en: {
      title: "Stop",
      selectMode: "Select a game mode",
      vsAI: "Play against AI",
      vsPlayers: "Play with friends",
      playerName: "Your name",
      startGame: "Start game",
      spinning: "Spinning the wheel...",
      categories: "Categories",
      timeLeft: "Time left",
      stopButton: "STOP!",
      yourAnswers: "Your answers",
      aiAnswers: "AI answers",
      results: "Results",
      playAgain: "Play again",
      backToHome: "Back to home",
      country: "Country",
      animal: "Animal",
      name: "Name",
      food: "Food",
      color: "Color",
      object: "Object",
      enterName: "Enter your name to start",
      numPlayers: "Number of players:",
      waitingForPlayers: "Waiting for players...",
      nextPlayer: "Next player:",
      invalid: "Invalid",
      valid: "Valid",
      winner: "Winner:",
      scores: "Scores:",
      enterPlayer: "Enter player name",
      readyToStart: "Ready to start",
      selectedLetter: "Selected letter:",
      language: "Language",
    },
    fr: {
      title: "Stop",
      selectMode: "Sélectionnez un mode de jeu",
      vsAI: "Jouer contre l'IA",
      vsPlayers: "Jouer avec des amis",
      playerName: "Votre nom",
      startGame: "Commencer le jeu",
      spinning: "La roue tourne...",
      categories: "Catégories",
      timeLeft: "Temps restant",
      stopButton: "STOP!",
      yourAnswers: "Vos réponses",
      aiAnswers: "Réponses de l'IA",
      results: "Résultats",
      playAgain: "Rejouer",
      backToHome: "Retour à l'accueil",
      country: "Pays",
      animal: "Animal",
      name: "Prénom",
      food: "Nourriture",
      color: "Couleur",
      object: "Objet",
      enterName: "Entrez votre nom pour commencer",
      numPlayers: "Nombre de joueurs:",
      waitingForPlayers: "En attente des joueurs...",
      nextPlayer: "Joueur suivant:",
      invalid: "Invalide",
      valid: "Valide",
      winner: "Gagnant:",
      scores: "Scores:",
      enterPlayer: "Entrez le nom du joueur",
      readyToStart: "Prêt à commencer",
      selectedLetter: "Lettre sélectionnée:",
      language: "Langue",
    },
    pt: {
      title: "Stop",
      selectMode: "Selecione um modo de jogo",
      vsAI: "Jogar contra a IA",
      vsPlayers: "Jogar com amigos",
      playerName: "Seu nome",
      startGame: "Começar jogo",
      spinning: "Girando a roleta...",
      categories: "Categorias",
      timeLeft: "Tempo restante",
      stopButton: "STOP!",
      yourAnswers: "Suas respostas",
      aiAnswers: "Respostas da IA",
      results: "Resultados",
      playAgain: "Jogar novamente",
      backToHome: "Voltar ao início",
      country: "País",
      animal: "Animal",
      name: "Nome",
      food: "Comida",
      color: "Cor",
      object: "Objeto",
      enterName: "Digite seu nome para começar",
      numPlayers: "Número de jogadores:",
      waitingForPlayers: "Aguardando jogadores...",
      nextPlayer: "Próximo jogador:",
      invalid: "Inválido",
      valid: "Válido",
      winner: "Vencedor:",
      scores: "Pontuações:",
      enterPlayer: "Digite o nome do jogador",
      readyToStart: "Pronto para começar",
      selectedLetter: "Letra selecionada:",
      language: "Idioma",
    }
  };

  const t = content[language];

  // Iniciar el juego
  const startGame = () => {
    // Usar el ID del usuario autenticado si está disponible
    const playerId = user?.id || "player1";
    const displayName = playerName || (language === 'es' ? "Jugador" : "Player");
    
    if (gameMode === "ai") {
      // Modo contra IA
      const humanPlayer: Player = {
        id: playerId,
        name: displayName,
        answers: createEmptyAnswers(),
        totalScore: 0,
        isAI: false
      };
      
      const aiPlayer: Player = {
        id: "ai",
        name: "AI",
        answers: createEmptyAnswers(),
        totalScore: 0,
        isAI: true
      };
      
      setPlayers([humanPlayer, aiPlayer]);
      setCurrentPlayer(humanPlayer);
      spinWheel();
    } else if (gameMode === "multiplayer") {
      // Modo multijugador
      const newPlayers: Player[] = [];
      
      for (let i = 0; i < numPlayers; i++) {
        newPlayers.push({
          id: i === 0 ? playerId : `player${i+1}`,
          name: i === 0 ? displayName : `${language === 'es' ? 'Jugador' : 'Player'} ${i+1}`,
          answers: createEmptyAnswers(),
          totalScore: 0,
          isAI: false
        });
      }
      
      setPlayers(newPlayers);
      setCurrentPlayer(newPlayers[0]);
      spinWheel();
    }
  };

  // Crear respuestas vacías para un jugador
  const createEmptyAnswers = () => {
    const emptyAnswers: Record<Category, Answer> = {
      "lugar": { category: "lugar", answer: "", isValid: null, score: 0 },
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
    
    // Si es modo contra IA, generar respuestas de la IA
    if (gameMode === "ai") {
      generateAIAnswers();
    }
    
    // Calcular puntuaciones
    calculateScores();
  };

  // Generar respuestas para la IA
  const generateAIAnswers = () => {
    if (!selectedLetter) return;
    
    const aiPlayer = players.find(p => p.isAI);
    if (!aiPlayer) return;
    
    const newPlayers = [...players];
    const aiIndex = newPlayers.findIndex(p => p.isAI);
    
    // Si tenemos respuestas precargadas para esta letra, usarlas
    if (AI_ANSWERS[selectedLetter]) {
      CATEGORIES.forEach(category => {
        const possibleAnswers = AI_ANSWERS[selectedLetter][category];
        const randomAnswer = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
        
        newPlayers[aiIndex].answers[category] = {
          category,
          answer: randomAnswer,
          isValid: true,
          score: 10
        };
      });
    } else {
      // Si no tenemos respuestas precargadas, generar algunas genéricas
      CATEGORIES.forEach(category => {
        newPlayers[aiIndex].answers[category] = {
          category,
          answer: `${selectedLetter}...`,
          isValid: Math.random() > 0.3, // 70% de probabilidad de que sea válida
          score: Math.random() > 0.3 ? 10 : 0
        };
      });
    }
    
    setPlayers(newPlayers);
  };

  // Calcular puntuaciones
  const calculateScores = () => {
    const newPlayers = [...players];
    
    // Primero, verificar respuestas válidas usando el validador de palabras reales
    newPlayers.forEach((player, playerIndex) => {
      if (player.isAI) return; // La IA ya tiene sus puntuaciones
      
      CATEGORIES.forEach(category => {
        const answer = player.answers[category].answer.trim();
        if (!answer) {
          newPlayers[playerIndex].answers[category].isValid = false;
          newPlayers[playerIndex].answers[category].score = 0;
        } else {
          // Usar el validador de palabras reales
          const isValid = validateWord(answer, category, selectedLetter);
          newPlayers[playerIndex].answers[category].isValid = isValid;
          
          if (!isValid) {
            newPlayers[playerIndex].answers[category].score = 0;
          }
          // Los puntos se calcularán después para las respuestas válidas
        }
      });
    });
    
    // Segundo, calcular puntos considerando respuestas duplicadas
    CATEGORIES.forEach(category => {
      const validAnswers = {};
      
      // Contar respuestas válidas idénticas
      newPlayers.forEach((player, playerIndex) => {
        if (!player.isAI && newPlayers[playerIndex].answers[category].isValid) {
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
      if (player.isAI) return; // La IA ya tiene sus puntuaciones
      
      let totalScore = 0;
      CATEGORIES.forEach(category => {
        totalScore += newPlayers[playerIndex].answers[category].score;
      });
      newPlayers[playerIndex].totalScore = totalScore;
    });
    
    // Guardar resultados en el ranking real
    saveGameResults(newPlayers);
    
    setPlayers(newPlayers);
    setGameState("results");
    
    // Reproducir sonido de victoria para el ganador
    setTimeout(() => {
      soundEffects.playVictorySound();
    }, 500);
  };

  // Guardar resultados del juego en el ranking
  const saveGameResults = (finalPlayers: Player[]) => {
    // Solo guardar para jugadores humanos autenticados
    finalPlayers.forEach(player => {
      if (!player.isAI && user && player.id === user.id) {
        // Crear categorías como objeto
        const categories: Record<string, string> = {};
        CATEGORIES.forEach(category => {
          categories[category] = player.answers[category].answer;
        });

        const gameResult: GameResult = {
          playerId: player.id,
          playerName: player.name,
          score: player.totalScore,
          categories,
          letter: selectedLetter,
          timestamp: new Date().toISOString(),
          gameMode: gameMode === 'ai' ? 'public' : 'private'
        };

        // Guardar resultado y actualizar ranking
        const updatedPlayerScore = rankingManager.saveGameResult(gameResult);

        // Si ganó el juego, registrar la victoria
        const winner = getWinner();
        if (winner && winner.id === player.id) {
          rankingManager.recordWin(player.id);
        }

        console.log('Ranking actualizado:', updatedPlayerScore);
      }
    });
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
    setGameMode(null);
    setGameState("setup");
    setPlayers([]);
    setCurrentPlayer(null);
    setSelectedLetter("");
    setWheelRotation(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimeLeft(60);
    setAnswers({
      "lugar": "",
      "animal": "",
      "nombre": "",
      "comida": "",
      "color": "",
      "objeto": ""
    });
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

  // Renderizar la página según el estado del juego
  return (
    <div className="min-h-screen bg-red-600">
      {/* Header con selector de idioma y autenticación */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/assets/publiclogo.png" alt="STOP Game Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <h1 className="text-2xl font-bold text-white">Stop</h1>
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
              {content[language].title === 'Iniciar Sesión' ? content[language].title : 'Sign In'}
            </Button>
          )}
        </div>
      </header>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <main className="max-w-4xl mx-auto p-4">
        {gameState === "setup" && (
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6 border-4 border-white overflow-hidden">
              <img src="/assets/publiclogo.png" alt="STOP Game Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-8">{t.selectMode}</h2>
            
            {!gameMode && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setGameMode("ai")}
                  className="bg-white text-red-600 hover:bg-white/90 py-6 px-8 text-lg rounded-full"
                >
                  {t.vsAI}
                </Button>
                <Button 
                  onClick={() => setGameMode("multiplayer")}
                  className="bg-white text-red-600 hover:bg-white/90 py-6 px-8 text-lg rounded-full"
                >
                  {t.vsPlayers}
                </Button>
              </div>
            )}
            
            {gameMode && (
              <div className="w-full max-w-md">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardHeader>
                    <h3 className="text-2xl font-bold text-center">
                      {gameMode === "ai" ? t.vsAI : t.vsPlayers}
                    </h3>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    {!isAuthenticated ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm mb-1">{t.playerName}</label>
                          <Input
                            placeholder={t.enterName}
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            className="bg-white/20 border-white/30 text-white placeholder-white/50"
                          />
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-sm text-white/70">{language === 'es' ? 'O juega con tu cuenta' : 'Or play with your account'}</span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setAuthModalOpen(true)}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            {language === 'es' ? 'Iniciar Sesión' : 'Sign In'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white/10 rounded-md">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            {user?.photoURL ? (
                              <img src={user.photoURL} alt={user.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              <span className="text-white font-bold">{user?.name?.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">{user?.name}</p>
                            <p className="text-xs text-white/70">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {gameMode === "multiplayer" && (
                      <div>
                        <label className="block text-sm mb-1">{t.numPlayers}</label>
                        <Input
                          type="number"
                          min="2"
                          max="8"
                          value={numPlayers}
                          onChange={(e) => setNumPlayers(parseInt(e.target.value) || 2)}
                          className="bg-white/20 border-white/30 text-white"
                        />
                      </div>
                    )}
                    
                    <Button 
                      onClick={startGame}
                      disabled={!playerName}
                      className="bg-white text-red-600 hover:bg-white/90 mt-4"
                    >
                      {t.startGame}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

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
          <div className="flex flex-col">
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
                        <h5 className="text-lg font-semibold">{player.name}</h5>
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
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="bg-red-700 text-white hover:bg-red-800"
                >
                  {t.backToHome}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
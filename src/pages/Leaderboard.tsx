import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Star, TrendingUp, Crown, Calendar, Target, Users, Share2 } from 'lucide-react';
import { rankingManager, formatScore, getLevelColor, getAchievementInfo, type PlayerScore, type GameResult } from '@/lib/ranking';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import FriendsInvite from '@/components/social/FriendsInvite';

type LanguageOption = 'es' | 'en' | 'fr' | 'pt';

export default function Leaderboard() {
  const [language, setLanguage] = useState<LanguageOption>('es');
  const [rankings, setRankings] = useState<PlayerScore[]>([]);
  const [playerRanking, setPlayerRanking] = useState<PlayerScore | null>(null);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadRankings();
  }, [selectedPeriod, user]);

  const loadRankings = () => {
    // Cargar rankings generales
    const allRankings = rankingManager.getTopRankings(50);
    setRankings(allRankings);

    // Cargar ranking del jugador actual
    if (user) {
      const playerRank = rankingManager.getPlayerRanking(user.id);
      setPlayerRanking(playerRank);
      
      // Cargar historial del jugador
      const history = rankingManager.getGameHistory(user.id);
      setGameHistory(history);
    }
  };

  const content = {
    es: {
      title: "Ranking & Amigos",
      globalLeaderboard: "Ranking Global",
      personalStats: "Estadísticas Personales",
      achievements: "Logros",
      rank: "Pos.",
      player: "Jugador",
      score: "Puntos",
      games: "Partidas",
      winRate: "% Victorias",
      level: "Nivel",
      you: "(Tú)",
      totalGames: "Total de Partidas",
      activeUsers: "Usuarios Activos",
      highestScore: "Puntuación Más Alta",
      yourPosition: "Tu Posición",
      totalScore: "puntuación total",
      bestScore: "mejor puntuación",
      averageScore: "promedio por partida",
      gamesPlayed: "partidas jugadas",
      recentGames: "Partidas Recientes",
      noGames: "No has jugado partidas aún",
      playNow: "¡Jugar Ahora!",
      shareGame: "Compartir Juego",
      backToGame: "Volver al Juego",
      mustLogin: "Debes iniciar sesión para ver el ranking completo",
      loginButton: "Iniciar Sesión",
      lastPlayed: "Última vez:",
      never: "Nunca",
      today: "Hoy",
      yesterday: "Ayer",
      daysAgo: "hace {days} días"
    },
    en: {
      title: "Leaderboard & Friends",
      globalLeaderboard: "Global Leaderboard",
      personalStats: "Personal Stats",
      achievements: "Achievements",
      rank: "Rank",
      player: "Player", 
      score: "Score",
      games: "Games",
      winRate: "Win Rate",
      level: "Level",
      you: "(You)",
      totalGames: "Total Games",
      activeUsers: "Active Users",
      highestScore: "Highest Score",
      yourPosition: "Your Position",
      totalScore: "total score",
      bestScore: "best score",
      averageScore: "average per game",
      gamesPlayed: "games played",
      recentGames: "Recent Games",
      noGames: "You haven't played any games yet",
      playNow: "Play Now!",
      shareGame: "Share Game",
      backToGame: "Back to Game",
      mustLogin: "You must log in to view full leaderboard",
      loginButton: "Sign In",
      lastPlayed: "Last played:",
      never: "Never",
      today: "Today",
      yesterday: "Yesterday",
      daysAgo: "{days} days ago"
    },
    fr: {
      title: "Classement & Amis",
      globalLeaderboard: "Classement Global",
      personalStats: "Statistiques Personnelles",
      achievements: "Succès",
      rank: "Rang",
      player: "Joueur",
      score: "Score",
      games: "Parties",
      winRate: "% Victoires",
      level: "Niveau",
      you: "(Vous)",
      totalGames: "Total des Parties",
      activeUsers: "Utilisateurs Actifs",
      highestScore: "Score le Plus Élevé",
      yourPosition: "Votre Position",
      totalScore: "score total",
      bestScore: "meilleur score",
      averageScore: "moyenne par partie",
      gamesPlayed: "parties jouées",
      recentGames: "Parties Récentes",
      noGames: "Vous n'avez pas encore joué",
      playNow: "Jouer Maintenant!",
      shareGame: "Partager le Jeu",
      backToGame: "Retour au Jeu",
      mustLogin: "Vous devez vous connecter pour voir le classement complet",
      loginButton: "Se Connecter",
      lastPlayed: "Dernier jeu:",
      never: "Jamais",
      today: "Aujourd'hui",
      yesterday: "Hier",
      daysAgo: "il y a {days} jours"
    },
    pt: {
      title: "Ranking & Amigos",
      globalLeaderboard: "Ranking Global",
      personalStats: "Estatísticas Pessoais",
      achievements: "Conquistas",
      rank: "Pos.",
      player: "Jogador",
      score: "Pontos",
      games: "Jogos",
      winRate: "% Vitórias",
      level: "Nível",
      you: "(Você)",
      totalGames: "Total de Jogos",
      activeUsers: "Usuários Ativos",
      highestScore: "Maior Pontuação",
      yourPosition: "Sua Posição",
      totalScore: "pontuação total",
      bestScore: "melhor pontuação",
      averageScore: "média por jogo",
      gamesPlayed: "jogos jogados",
      recentGames: "Jogos Recentes",
      noGames: "Você ainda não jogou",
      playNow: "Jogar Agora!",
      shareGame: "Compartilhar Jogo",
      backToGame: "Voltar ao Jogo",
      mustLogin: "Você deve fazer login para ver o ranking completo",
      loginButton: "Entrar",
      lastPlayed: "Último jogo:",
      never: "Nunca",
      today: "Hoje",
      yesterday: "Ontem",
      daysAgo: "há {days} dias"
    }
  };

  const t = content[language];

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{position}</span>;
    }
  };

  const getLevelBadgeColor = (level: string) => {
    const colors: Record<string, string> = {
      'Principiante': 'bg-slate-100 text-slate-800',
      'Novato': 'bg-blue-100 text-blue-800',
      'Intermedio': 'bg-green-100 text-green-800',
      'Avanzado': 'bg-yellow-100 text-yellow-800',
      'Experto': 'bg-red-100 text-red-800',
      'Maestro': 'bg-purple-100 text-purple-800',
      'Leyenda': 'bg-orange-100 text-orange-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getPlayerPosition = (playerId: string): number => {
    const position = rankings.findIndex(player => player.id === playerId) + 1;
    return position || 0;
  };

  const shareGameUrl = () => {
    const text = language === 'es' 
      ? "¡Ven a jugar Stop conmigo! 🎮 Compite en el ranking y demuestra tu vocabulario 🧠"
      : "Come play Stop with me! 🎮 Compete in the leaderboard and show your vocabulary 🧠";
    const url = window.location.origin;
    const shareData = `${text}\n${url}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Stop Game',
        text: shareData,
        url: url
      });
    } else {
      navigator.clipboard.writeText(shareData);
      toast.success('¡Enlace copiado al portapapeles!');
    }
  };

  const totalGamesPlayed = rankings.reduce((sum, player) => sum + player.gamesPlayed, 0);
  const activePlayersCount = rankings.filter(player => {
    if (!player.lastPlayed) return false;
    const lastPlayed = new Date(player.lastPlayed);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return lastPlayed > weekAgo;
  }).length;
  const highestScore = rankings.length > 0 ? Math.max(...rankings.map(p => p.bestScore)) : 0;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-red-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Trophy className="mx-auto mb-4 h-12 w-12 text-red-600" />
            <h2 className="text-xl font-bold mb-2">{t.mustLogin}</h2>
            <div className="space-y-4">
              <Link to="/">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  {t.loginButton}
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline">
                  {t.backToGame}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-600">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/assets/stop-logo.png" alt="STOP Game Logo" className="w-full h-full object-contain rounded-full" />
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="bg-red-700/50 rounded-full p-1">
            {(['es', 'en', 'fr', 'pt'] as LanguageOption[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded-full text-xs transition-all ${
                  language === lang ? 'bg-white text-red-600' : 'text-white'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <FriendsInvite language={language} />
            
            <Button 
              onClick={shareGameUrl}
              variant="outline" 
              size="sm"
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {t.shareGame}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <Crown className="inline-block h-10 w-10 text-yellow-500 mr-3" />
            {t.title}
          </h1>
          <div className="flex justify-center gap-6 text-white/80">
            <span>{rankings.length} jugadores</span>
            {playerRanking && <span>{t.yourPosition}: #{getPlayerPosition(user!.id)}</span>}
            <span>{activePlayersCount} activos</span>
          </div>
        </div>

        {/* Player's Current Ranking */}
        {playerRanking && (
          <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-bold">#{getPlayerPosition(user!.id)}</div>
                </div>
                <Avatar className="h-16 w-16 ring-4 ring-white/30">
                  <AvatarImage src={user?.photoURL} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{user?.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`${getLevelBadgeColor(playerRanking.level)} text-gray-800`}>
                      {playerRanking.level}
                    </Badge>
                  </div>
                  <div className="text-sm opacity-90">
                    {playerRanking.achievements.length} logros
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold mb-1">
                    {formatScore(playerRanking.totalScore)}
                  </div>
                  <div className="text-sm opacity-90 space-y-1">
                    <div>{playerRanking.gamesPlayed} partidas</div>
                    <div>{playerRanking.gamesWon > 0 ? Math.round((playerRanking.gamesWon / playerRanking.gamesPlayed) * 100) : 0}% victorias</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="global">{t.globalLeaderboard}</TabsTrigger>
            <TabsTrigger value="personal">{t.personalStats}</TabsTrigger>
            <TabsTrigger value="achievements">{t.achievements}</TabsTrigger>
          </TabsList>

          <TabsContent value="global">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  {t.globalLeaderboard}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rankings.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay rankings disponibles</h3>
                    <p className="text-gray-500 mb-4">¡Sé el primero en jugar y aparecer en la tabla de clasificación!</p>
                    <Link to="/game">
                      <Button className="bg-red-600 hover:bg-red-700">
                        {t.playNow}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rankings.map((player, index) => (
                      <Card key={player.id} className={`transition-all hover:shadow-lg ${
                        index < 3 ? 'ring-2 ring-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                      } ${user?.id === player.id ? 'ring-2 ring-blue-300 bg-blue-50' : ''}`}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-6">
                            {/* Rank */}
                            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                              {getRankIcon(index + 1)}
                            </div>

                            {/* Avatar */}
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={player.photoURL} alt={player.playerName} />
                              <AvatarFallback>{player.playerName.charAt(0)}</AvatarFallback>
                            </Avatar>

                            {/* Player Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">
                                  {player.playerName} {user?.id === player.id && t.you}
                                </h3>
                                <Badge className={getLevelBadgeColor(player.level)}>
                                  {player.level}
                                </Badge>
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mb-2">
                                {player.achievements.slice(0, 3).map((achievementId, idx) => {
                                  const achievement = getAchievementInfo(achievementId);
                                  return achievement ? (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      <span className="mr-1">{achievement.icon}</span>
                                      {achievement.name}
                                    </Badge>
                                  ) : null;
                                })}
                                {player.achievements.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{player.achievements.length - 3} más
                                  </Badge>
                                )}
                              </div>

                              <div className="text-sm text-gray-500 flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  {formatScore(player.bestScore)} mejor
                                </div>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="text-right">
                              <div className="text-3xl font-bold text-blue-600 mb-1">
                                {formatScore(player.totalScore)}
                              </div>
                              <div className="text-sm text-gray-500 space-y-1">
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {player.gamesWon > 0 ? Math.round((player.gamesWon / player.gamesPlayed) * 100) : 0}% victorias
                                </div>
                                <div>{player.gamesPlayed} partidas</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal">
            {playerRanking ? (
              <div className="space-y-6">
                {/* Personal Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        {t.totalScore}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">
                        {formatScore(playerRanking.totalScore)}
                      </div>
                      <p className="text-sm text-gray-500">{t.totalScore}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-500" />
                        {t.bestScore}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        {formatScore(playerRanking.bestScore)}
                      </div>
                      <p className="text-sm text-gray-500">{t.bestScore}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-500" />
                        {t.averageScore}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">
                        {formatScore(playerRanking.averageScore)}
                      </div>
                      <p className="text-sm text-gray-500">{t.averageScore}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-red-500" />
                        {t.gamesPlayed}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-600">
                        {playerRanking.gamesPlayed}
                      </div>
                      <p className="text-sm text-gray-500">{t.gamesPlayed}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Games */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {t.recentGames}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {gameHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">{t.noGames}</p>
                        <Link to="/game">
                          <Button className="bg-red-600 hover:bg-red-700">
                            {t.playNow}
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {gameHistory.slice(0, 5).map((game, index) => (
                          <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">
                                Letra: {game.letter} • {game.score} puntos
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(game.timestamp).toLocaleString()}
                              </div>
                            </div>
                            <Badge className={game.score >= 40 ? 'bg-green-100 text-green-800' : 
                                           game.score >= 20 ? 'bg-yellow-100 text-yellow-800' : 
                                           'bg-gray-100 text-gray-800'}>
                              {game.score >= 40 ? 'Excelente' : 
                               game.score >= 20 ? 'Bueno' : 
                               'Regular'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">{t.noGames}</h3>
                  <p className="text-gray-500 mb-4">¡Comienza a jugar para ver tus estadísticas!</p>
                  <Link to="/game">
                    <Button className="bg-red-600 hover:bg-red-700">
                      {t.playNow}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  {t.achievements}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {playerRanking && playerRanking.achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {playerRanking.achievements.map((achievementId, index) => {
                      const achievement = getAchievementInfo(achievementId);
                      return achievement ? (
                        <Card key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="text-3xl">{achievement.icon}</div>
                            <div>
                              <h4 className="font-bold text-lg">{achievement.name}</h4>
                              <p className="text-sm text-gray-600">{achievement.description}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Sin logros aún</h3>
                    <p className="text-gray-500 mb-4">¡Juega más partidas para desbloquear logros!</p>
                    <Link to="/game">
                      <Button className="bg-red-600 hover:bg-red-700">
                        {t.playNow}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                {t.totalGames}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center">{totalGamesPlayed}</div>
              <p className="text-center text-gray-500">Jugadas en la plataforma</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                {t.activeUsers}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center">{activePlayersCount}</div>
              <p className="text-center text-gray-500">En los últimos 7 días</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                <Award className="h-8 w-8 text-green-500 mx-auto mb-2" />
                {t.highestScore}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center">{highestScore}</div>
              <p className="text-center text-gray-500">Récord actual</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link to="/">
            <Button variant="outline" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
              {t.backToGame}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
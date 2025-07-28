// Sistema de ranking real para el juego STOP
export interface PlayerScore {
  id: string;
  playerName: string;
  email: string;
  photoURL?: string;
  totalScore: number;
  gamesPlayed: number;
  gamesWon: number;
  averageScore: number;
  bestScore: number;
  lastPlayed: string;
  level: string;
  achievements: string[];
}

export interface GameResult {
  playerId: string;
  playerName: string;
  score: number;
  categories: Record<string, string>;
  letter: string;
  timestamp: string;
  gameMode: 'public' | 'private';
  roomId?: string;
}

// Niveles del juego basados en puntuación total
const LEVELS = [
  { name: 'Principiante', minScore: 0, color: '#94a3b8' },
  { name: 'Novato', minScore: 100, color: '#3b82f6' },
  { name: 'Intermedio', minScore: 300, color: '#10b981' },
  { name: 'Avanzado', minScore: 600, color: '#f59e0b' },
  { name: 'Experto', minScore: 1000, color: '#ef4444' },
  { name: 'Maestro', minScore: 1500, color: '#8b5cf6' },
  { name: 'Leyenda', minScore: 2500, color: '#f97316' }
];

// Logros disponibles
const ACHIEVEMENTS = {
  'first_win': { name: 'Primera Victoria', description: 'Gana tu primer juego', icon: '🏆' },
  'perfect_game': { name: 'Juego Perfecto', description: 'Completa todas las categorías en una ronda', icon: '💯' },
  'speed_demon': { name: 'Demonio de la Velocidad', description: 'Completa un juego en menos de 2 minutos', icon: '⚡' },
  'word_master': { name: 'Maestro de Palabras', description: 'Acumula 500 puntos totales', icon: '📚' },
  'consistent_player': { name: 'Jugador Consistente', description: 'Juega 10 partidas', icon: '🎯' },
  'high_scorer': { name: 'Puntuación Alta', description: 'Obtén más de 50 puntos en una sola partida', icon: '🚀' },
  'champion': { name: 'Campeón', description: 'Gana 5 juegos consecutivos', icon: '👑' }
};

class RankingManager {
  private storageKey = 'stop_game_rankings';
  private gameHistoryKey = 'stop_game_history';

  // Obtener todos los rankings
  getAllRankings(): PlayerScore[] {
    try {
      const rankings = localStorage.getItem(this.storageKey);
      return rankings ? JSON.parse(rankings) : [];
    } catch (error) {
      console.error('Error loading rankings:', error);
      return [];
    }
  }

  // Obtener ranking de un jugador específico
  getPlayerRanking(playerId: string): PlayerScore | null {
    const rankings = this.getAllRankings();
    return rankings.find(ranking => ranking.id === playerId) || null;
  }

  // Guardar resultado de juego y actualizar ranking
  saveGameResult(gameResult: GameResult): PlayerScore {
    const rankings = this.getAllRankings();
    const existingPlayerIndex = rankings.findIndex(ranking => ranking.id === gameResult.playerId);
    
    let playerScore: PlayerScore;
    
    if (existingPlayerIndex >= 0) {
      // Actualizar jugador existente
      playerScore = rankings[existingPlayerIndex];
      playerScore.totalScore += gameResult.score;
      playerScore.gamesPlayed += 1;
      playerScore.lastPlayed = gameResult.timestamp;
      
      if (gameResult.score > playerScore.bestScore) {
        playerScore.bestScore = gameResult.score;
      }
      
      playerScore.averageScore = Math.round(playerScore.totalScore / playerScore.gamesPlayed);
      playerScore.level = this.calculateLevel(playerScore.totalScore);
      
      // Verificar logros
      playerScore.achievements = this.checkAchievements(playerScore, gameResult);
      
      rankings[existingPlayerIndex] = playerScore;
    } else {
      // Crear nuevo jugador
      playerScore = {
        id: gameResult.playerId,
        playerName: gameResult.playerName,
        email: '', // Se actualizará desde el contexto de autenticación
        totalScore: gameResult.score,
        gamesPlayed: 1,
        gamesWon: 0,
        averageScore: gameResult.score,
        bestScore: gameResult.score,
        lastPlayed: gameResult.timestamp,
        level: this.calculateLevel(gameResult.score),
        achievements: this.checkAchievements({
          id: gameResult.playerId,
          playerName: gameResult.playerName,
          email: '',
          totalScore: gameResult.score,
          gamesPlayed: 1,
          gamesWon: 0,
          averageScore: gameResult.score,
          bestScore: gameResult.score,
          lastPlayed: gameResult.timestamp,
          level: 'Principiante',
          achievements: []
        }, gameResult)
      };
      
      rankings.push(playerScore);
    }
    
    // Guardar rankings actualizados
    localStorage.setItem(this.storageKey, JSON.stringify(rankings));
    
    // Guardar en historial de juegos
    this.saveToGameHistory(gameResult);
    
    return playerScore;
  }

  // Registrar victoria
  recordWin(playerId: string) {
    const rankings = this.getAllRankings();
    const playerIndex = rankings.findIndex(ranking => ranking.id === playerId);
    
    if (playerIndex >= 0) {
      rankings[playerIndex].gamesWon += 1;
      localStorage.setItem(this.storageKey, JSON.stringify(rankings));
    }
  }

  // Calcular nivel basado en puntuación total
  private calculateLevel(totalScore: number): string {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (totalScore >= LEVELS[i].minScore) {
        return LEVELS[i].name;
      }
    }
    return LEVELS[0].name;
  }

  // Verificar logros
  private checkAchievements(playerScore: PlayerScore, gameResult: GameResult): string[] {
    const achievements = [...playerScore.achievements];
    
    // Primera victoria
    if (playerScore.gamesWon >= 1 && !achievements.includes('first_win')) {
      achievements.push('first_win');
    }
    
    // Juego perfecto (todas las categorías completadas)
    const categoriesCompleted = Object.values(gameResult.categories).filter(word => word.trim() !== '').length;
    if (categoriesCompleted >= 6 && !achievements.includes('perfect_game')) {
      achievements.push('perfect_game');
    }
    
    // Puntuación alta
    if (gameResult.score >= 50 && !achievements.includes('high_scorer')) {
      achievements.push('high_scorer');
    }
    
    // Maestro de palabras
    if (playerScore.totalScore >= 500 && !achievements.includes('word_master')) {
      achievements.push('word_master');
    }
    
    // Jugador consistente
    if (playerScore.gamesPlayed >= 10 && !achievements.includes('consistent_player')) {
      achievements.push('consistent_player');
    }
    
    return achievements;
  }

  // Guardar en historial de juegos
  private saveToGameHistory(gameResult: GameResult) {
    try {
      const history = localStorage.getItem(this.gameHistoryKey);
      const gameHistory = history ? JSON.parse(history) : [];
      
      gameHistory.unshift(gameResult); // Agregar al inicio
      
      // Mantener solo los últimos 100 juegos
      if (gameHistory.length > 100) {
        gameHistory.splice(100);
      }
      
      localStorage.setItem(this.gameHistoryKey, JSON.stringify(gameHistory));
    } catch (error) {
      console.error('Error saving game history:', error);
    }
  }

  // Obtener historial de juegos
  getGameHistory(playerId?: string): GameResult[] {
    try {
      const history = localStorage.getItem(this.gameHistoryKey);
      const gameHistory = history ? JSON.parse(history) : [];
      
      if (playerId) {
        return gameHistory.filter((game: GameResult) => game.playerId === playerId);
      }
      
      return gameHistory;
    } catch (error) {
      console.error('Error loading game history:', error);
      return [];
    }
  }

  // Obtener top rankings
  getTopRankings(limit: number = 10): PlayerScore[] {
    const rankings = this.getAllRankings();
    return rankings
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, limit);
  }

  // Obtener información de niveles
  getLevels() {
    return LEVELS;
  }

  // Obtener información de logros
  getAchievements() {
    return ACHIEVEMENTS;
  }

  // Limpiar datos (para desarrollo/testing)
  clearAllData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.gameHistoryKey);
  }

  // Exportar datos
  exportData() {
    return {
      rankings: this.getAllRankings(),
      history: this.getGameHistory()
    };
  }
}

// Instancia singleton
export const rankingManager = new RankingManager();

// Funciones de utilidad
export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

export const getLevelColor = (level: string): string => {
  const levelInfo = LEVELS.find(l => l.name === level);
  return levelInfo?.color || '#94a3b8';
};

export const getAchievementInfo = (achievementId: string) => {
  return ACHIEVEMENTS[achievementId as keyof typeof ACHIEVEMENTS];
};
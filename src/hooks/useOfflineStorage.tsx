import { useState, useEffect } from 'react';

interface OfflineGameData {
  scores: GameScore[];
  settings: GameSettings;
  progress: PlayerProgress;
}

interface GameScore {
  id: string;
  playerName: string;
  score: number;
  date: Date;
  categories: string[];
  letter: string;
  mode: 'offline' | 'online';
}

interface GameSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'es' | 'en' | 'fr' | 'pt';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

interface PlayerProgress {
  totalGames: number;
  totalScore: number;
  bestScore: number;
  averageScore: number;
  favoriteCategories: string[];
  achievements: string[];
}

export function useOfflineStorage() {
  const [offlineData, setOfflineData] = useState<OfflineGameData>({
    scores: [],
    settings: {
      difficulty: 'medium',
      language: 'es',
      soundEnabled: true,
      vibrationEnabled: true
    },
    progress: {
      totalGames: 0,
      totalScore: 0,
      bestScore: 0,
      averageScore: 0,
      favoriteCategories: [],
      achievements: []
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    loadOfflineData();
  }, []);

  const loadOfflineData = () => {
    try {
      const storedData = localStorage.getItem('stop_game_offline_data');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Convertir fechas de string a Date
        parsedData.scores = parsedData.scores.map((score: any) => ({
          ...score,
          date: new Date(score.date)
        }));
        setOfflineData(parsedData);
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveOfflineData = (data: OfflineGameData) => {
    try {
      localStorage.setItem('stop_game_offline_data', JSON.stringify(data));
      setOfflineData(data);
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  const addScore = (score: Omit<GameScore, 'id' | 'date'>) => {
    const newScore: GameScore = {
      ...score,
      id: Date.now().toString(),
      date: new Date(),
      mode: 'offline'
    };

    const updatedData = {
      ...offlineData,
      scores: [newScore, ...offlineData.scores].slice(0, 100), // Mantener solo los últimos 100 scores
      progress: {
        ...offlineData.progress,
        totalGames: offlineData.progress.totalGames + 1,
        totalScore: offlineData.progress.totalScore + score.score,
        bestScore: Math.max(offlineData.progress.bestScore, score.score),
        averageScore: Math.round((offlineData.progress.totalScore + score.score) / (offlineData.progress.totalGames + 1))
      }
    };

    saveOfflineData(updatedData);
    return newScore;
  };

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    const updatedData = {
      ...offlineData,
      settings: {
        ...offlineData.settings,
        ...newSettings
      }
    };
    saveOfflineData(updatedData);
  };

  const addAchievement = (achievement: string) => {
    if (offlineData.progress.achievements.includes(achievement)) return;

    const updatedData = {
      ...offlineData,
      progress: {
        ...offlineData.progress,
        achievements: [...offlineData.progress.achievements, achievement]
      }
    };
    saveOfflineData(updatedData);
  };

  const clearAllData = () => {
    const defaultData: OfflineGameData = {
      scores: [],
      settings: {
        difficulty: 'medium',
        language: 'es',
        soundEnabled: true,
        vibrationEnabled: true
      },
      progress: {
        totalGames: 0,
        totalScore: 0,
        bestScore: 0,
        averageScore: 0,
        favoriteCategories: [],
        achievements: []
      }
    };
    saveOfflineData(defaultData);
  };

  const getTopScores = (limit: number = 10) => {
    return offlineData.scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  };

  const getRecentScores = (limit: number = 10) => {
    return offlineData.scores
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  };

  // Funciones para sincronización con servidor (cuando hay conexión)
  const syncWithServer = async () => {
    if (!navigator.onLine) return false;

    try {
      // Aquí iría la lógica para sincronizar con el servidor
      // Por ahora, solo simulamos la sincronización
      console.log('Syncing offline data with server...');
      
      // Marcar datos como sincronizados
      const updatedScores = offlineData.scores.map(score => ({
        ...score,
        synced: true
      }));

      const updatedData = {
        ...offlineData,
        scores: updatedScores
      };

      saveOfflineData(updatedData);
      return true;
    } catch (error) {
      console.error('Error syncing with server:', error);
      return false;
    }
  };

  const getPendingSync = () => {
    return offlineData.scores.filter(score => !(score as any).synced);
  };

  return {
    offlineData,
    isLoading,
    addScore,
    updateSettings,
    addAchievement,
    clearAllData,
    getTopScores,
    getRecentScores,
    syncWithServer,
    getPendingSync,
    loadOfflineData
  };
}
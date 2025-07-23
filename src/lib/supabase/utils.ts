// Función utilitaria cn para Tailwind (NECESARIA para los componentes UI)
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Importación de Supabase
import { supabase } from './client';

// Tipos exportados (UNA SOLA VEZ)
export type User = {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
};

// Tipo final limpio para usar en tu aplicación
export type HighScore = {
  user_id: string;
  score: number;
  username: string;
  avatar_url?: string;
};

// Tipo para crear un nuevo usuario
export type CreateUserData = {
  username: string;
  avatar_url?: string;
};

// Tipo para crear un nuevo score
export type CreateScoreData = {
  user_id: string;
  score: number;
};

// Servicios de Usuario
export const UserService = {
  // Obtener usuarios con paginación
  async getUsers(page = 1, pageSize = 10): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('UserService.getUsers error:', error);
      return [];
    }
  },

  // Obtener un usuario por ID
  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching user by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('UserService.getUserById error:', error);
      return null;
    }
  },

  // Obtener un usuario por username
  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        console.error('Error fetching user by username:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('UserService.getUserByUsername error:', error);
      return null;
    }
  },

  // Crear un nuevo usuario
  async createUser(userData: CreateUserData): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            username: userData.username,
            avatar_url: userData.avatar_url,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('UserService.createUser error:', error);
      return null;
    }
  },

  // Actualizar un usuario
  async updateUser(id: string, userData: Partial<CreateUserData>): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('UserService.updateUser error:', error);
      return null;
    }
  },

  // Eliminar un usuario
  async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('UserService.deleteUser error:', error);
      return false;
    }
  }
};

// Servicios de Puntuaciones
export const ScoreService = {
  // Obtener mejores puntuaciones
  async getHighScores(limit = 10): Promise<HighScore[]> {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select(`
          user_id,
          score,
          users (
            username,
            avatar_url
          )
        `)
        .order('score', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching high scores:', error);
        throw error;
      }

      // Transformar los datos para que tengan la estructura correcta
      const transformedData: HighScore[] = (data || []).map((item: any) => {
        // Manejar tanto si users es un array como si es un objeto
        const userData = Array.isArray(item.users) ? item.users[0] : item.users;

        return {
          user_id: item.user_id,
          score: item.score,
          username: userData?.username || 'Usuario desconocido',
          avatar_url: userData?.avatar_url
        };
      });

      return transformedData;
    } catch (error) {
      console.error('ScoreService.getHighScores error:', error);
      return [];
    }
  },

  // Obtener puntuaciones de un usuario específico
  async getUserScores(userId: string, limit = 10): Promise<HighScore[]> {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select(`
          user_id,
          score,
          users (
            username,
            avatar_url
          )
        `)
        .eq('user_id', userId)
        .order('score', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user scores:', error);
        throw error;
      }

      // Transformar los datos
      const transformedData: HighScore[] = (data || []).map((item: any) => {
        const userData = Array.isArray(item.users) ? item.users[0] : item.users;

        return {
          user_id: item.user_id,
          score: item.score,
          username: userData?.username || 'Usuario desconocido',
          avatar_url: userData?.avatar_url
        };
      });

      return transformedData;
    } catch (error) {
      console.error('ScoreService.getUserScores error:', error);
      return [];
    }
  },

  // Agregar una nueva puntuación
  async addScore(scoreData: CreateScoreData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('scores')
        .insert([
          {
            user_id: scoreData.user_id,
            score: scoreData.score,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Error adding score:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('ScoreService.addScore error:', error);
      return false;
    }
  },

  // Obtener la mejor puntuación de un usuario
  async getUserBestScore(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('score')
        .eq('user_id', userId)
        .order('score', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching user best score:', error);
        return 0;
      }

      return data?.score || 0;
    } catch (error) {
      console.error('ScoreService.getUserBestScore error:', error);
      return 0;
    }
  },

  // Obtener estadísticas generales
  async getScoreStats(): Promise<{
    totalScores: number;
    averageScore: number;
    highestScore: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('score');

      if (error) {
        console.error('Error fetching score stats:', error);
        throw error;
      }

      const scores = data?.map(item => item.score) || [];
      const totalScores = scores.length;
      const averageScore = totalScores > 0 ? scores.reduce((a, b) => a + b, 0) / totalScores : 0;
      const highestScore = totalScores > 0 ? Math.max(...scores) : 0;

      return {
        totalScores,
        averageScore: Math.round(averageScore),
        highestScore
      };
    } catch (error) {
      console.error('ScoreService.getScoreStats error:', error);
      return {
        totalScores: 0,
        averageScore: 0,
        highestScore: 0
      };
    }
  }
};

// Servicios de utilidades generales
export const UtilService = {
  // Verificar conexión a Supabase
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .select('count')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  },

  // Limpiar datos de prueba (usar con cuidado)
  async clearTestData(): Promise<boolean> {
    try {
      // Solo en desarrollo
      if (process.env.NODE_ENV !== 'development') {
        console.warn('clearTestData only available in development');
        return false;
      }

      await supabase.from('scores').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('users').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      return true;
    } catch (error) {
      console.error('Error clearing test data:', error);
      return false;
    }
  }
};

// Exportar servicios agrupados
export const SupabaseServices = {
  UserService,
  ScoreService,
  UtilService
};
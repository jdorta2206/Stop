import { useState, useEffect, createContext, useContext } from 'react';

// Define user authentication types
export type Provider = 'google' | 'facebook' | 'apple' | 'email';

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  provider: Provider;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (provider: Provider, email?: string, password?: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication for now - will be replaced with real Firebase when installation works
const mockAuth = {
  signInWithPopup: async (provider: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      user: {
        uid: `${provider}_${Math.random().toString(36).substring(2, 9)}`,
        email: `usuario@${provider === 'google' ? 'gmail' : provider}.com`,
        displayName: `Usuario ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
        photoURL: `https://ui-avatars.com/api/?name=Usuario+${provider}&size=128`,
        providerData: [{ providerId: `${provider}.com` }]
      }
    };
  },
  signInWithEmailAndPassword: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'test@test.com' && password === 'password') {
      return {
        user: {
          uid: `email_${Math.random().toString(36).substring(2, 9)}`,
          email,
          displayName: email.split('@')[0],
          photoURL: null,
          providerData: [{ providerId: 'password' }]
        }
      };
    }
    throw new Error('Credenciales incorrectas');
  },
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      user: {
        uid: `email_${Math.random().toString(36).substring(2, 9)}`,
        email,
        displayName: email.split('@')[0],
        photoURL: null,
        providerData: [{ providerId: 'password' }]
      }
    };
  }
};

// Helper function to convert mock user to our User interface
const convertFirebaseUser = (firebaseUser: any): User => {
  const providerId = firebaseUser.providerData[0]?.providerId;
  let provider: Provider = 'email';
  
  if (providerId === 'google.com') provider = 'google';
  else if (providerId === 'facebook.com') provider = 'facebook';
  else if (providerId === 'apple.com') provider = 'apple';

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
    email: firebaseUser.email || '',
    photoURL: firebaseUser.photoURL || undefined,
    provider
  };
};

// Authentication provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Monitor authentication state changes
  useEffect(() => {
    // Check localStorage for existing user
    const savedUser = localStorage.getItem('stop_game_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('stop_game_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Authentication methods
  const login = async (provider: Provider, email?: string, password?: string) => {
    setIsLoading(true);
    
    try {
      let result;
      
      switch (provider) {
        case 'google':
          result = await mockAuth.signInWithPopup('google');
          break;
        case 'facebook':
          result = await mockAuth.signInWithPopup('facebook');
          break;
        case 'apple':
          throw new Error('Apple Sign In requiere configuración adicional para web. Use Google o Facebook por ahora.');
        case 'email':
          if (!email || !password) {
            throw new Error('Email y contraseña son requeridos');
          }
          result = await mockAuth.signInWithEmailAndPassword(email, password);
          break;
        default:
          throw new Error('Proveedor no soportado');
      }
      
      const convertedUser = convertFirebaseUser(result.user);
      setUser(convertedUser);
      localStorage.setItem('stop_game_user', JSON.stringify(convertedUser));
      
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      const result = await mockAuth.createUserWithEmailAndPassword(email, password);
      const convertedUser = convertFirebaseUser({
        ...result.user,
        displayName: name
      });
      setUser(convertedUser);
      localStorage.setItem('stop_game_user', JSON.stringify(convertedUser));
      
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('stop_game_user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use authentication context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export auth functions for direct use
export const authService = {
  getCurrentUser: () => {
    const savedUser = localStorage.getItem('stop_game_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('stop_game_user');
      }
    }
    return null;
  },
  
  isAuthenticated: () => {
    return !!authService.getCurrentUser();
  }
};
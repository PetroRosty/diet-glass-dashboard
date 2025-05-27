
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginCredentials, TelegramUser } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithTelegram: (telegramUser: TelegramUser) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return { 
        isAuthenticated: true, 
        user: action.payload, 
        isLoading: false 
      };
    case 'LOGIN_ERROR':
      return { 
        isAuthenticated: false, 
        user: null, 
        isLoading: false 
      };
    case 'LOGOUT':
      return { 
        isAuthenticated: false, 
        user: null, 
        isLoading: false 
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('diet-diary-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('diet-diary-user');
      }
    }
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Mock authentication - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.email === 'anna@example.com' && credentials.password === 'password') {
        // Используем реальный chat_id из базы данных для тестирования
        const user: User = {
          id: '5841281611', // Реальный chat_id из вашей базы
          name: 'Анна',
          email: credentials.email,
          isPro: false,
          loginMethod: 'email'
        };
        
        if (credentials.rememberMe) {
          localStorage.setItem('diet-diary-user', JSON.stringify(user));
        }
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR' });
      throw error;
    }
  };

  const loginWithTelegram = async (telegramUser: TelegramUser) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Mock Telegram authentication
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user: User = {
        id: telegramUser.id.toString(),
        name: telegramUser.first_name + (telegramUser.last_name ? ` ${telegramUser.last_name}` : ''),
        email: `${telegramUser.username || telegramUser.id}@telegram.user`,
        avatar: telegramUser.photo_url,
        isPro: false,
        loginMethod: 'telegram'
      };
      
      localStorage.setItem('diet-diary-user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('diet-diary-user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      loginWithTelegram,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, TelegramUser } from '@/types/auth';
import { supabase } from '@/lib/supabase';

interface AuthContextType extends AuthState {
  logout: () => void;
  setAuthenticatedUser: (user: User) => void;
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

  const setAuthenticatedUser = (user: User) => {
    localStorage.setItem('diet-diary-user', JSON.stringify(user));
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    console.log('Authentication state updated with user:', user);
  };

  const logout = () => {
    localStorage.removeItem('diet-diary-user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      logout,
      setAuthenticatedUser
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

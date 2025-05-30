import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, TelegramUser } from '@/types/auth';
import { supabase } from '@/lib/supabase';

interface AuthContextType extends AuthState {
  loginWithTelegram: (telegramUser: TelegramUser) => Promise<void>;
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

  const loginWithTelegram = async (telegramUser: TelegramUser) => {
    dispatch({ type: 'LOGIN_START' });
    console.log('Starting Telegram login for user:', telegramUser);
    
    try {
      // Проверяем существование пользователя
      const telegramId = telegramUser.id_str || telegramUser.id.toString();
      console.log('Checking for existing profile with telegram_id:', telegramId);
      
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('telegram_id', telegramId)
        .single();

      console.log('Profile fetch result:', { existingProfile, fetchError });

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 - not found
        console.error('Error fetching profile:', fetchError);
        throw fetchError;
      }

      let profile = existingProfile;

      // Если пользователь не существует, создаем его
      if (!existingProfile) {
        console.log('Profile not found, creating new profile');
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              telegram_id: telegramId,
              first_name: telegramUser.first_name,
              last_name: telegramUser.last_name,
              username: telegramUser.username,
              photo_url: telegramUser.photo_url,
              locale: telegramUser.language_code,
              auth_date: telegramUser.auth_date,
              hash: telegramUser.hash
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw insertError;
        }
        console.log('New profile created:', newProfile);
        profile = newProfile;
      }

      const user: User = {
        id: telegramId,
        name: `${telegramUser.first_name}${telegramUser.last_name ? ' ' + telegramUser.last_name : ''}`,
        email: `${telegramUser.username || telegramId}@telegram.user`,
        avatar: telegramUser.photo_url,
        isPro: profile.is_pro || false,
        loginMethod: 'telegram'
      };
      
      console.log('Created user object:', user);
      localStorage.setItem('diet-diary-user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      console.log('Login successful, user state updated');
    } catch (error) {
      console.error('Telegram login error:', error);
      dispatch({ type: 'LOGIN_ERROR' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('diet-diary-user');
    dispatch({ type: 'LOGOUT' });
  };

  const setAuthenticatedUser = (user: User) => {
    localStorage.setItem('diet-diary-user', JSON.stringify(user));
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    console.log('Authentication state updated with user:', user);
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      loginWithTelegram,
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

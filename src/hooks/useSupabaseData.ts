
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

// Типы для данных из Supabase
export interface Meal {
  id: string;
  chat_id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  eaten_at: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface Profile {
  id: string;
  chat_id: string;
  name: string;
  daily_calories_goal: number;
  daily_protein_goal: number;
  daily_fat_goal: number;
  daily_carbs_goal: number;
  is_pro: boolean;
  created_at: string;
}

export interface Digest {
  id: string;
  chat_id: string;
  summary: string;
  recommendation: string;
  date: string;
  created_at: string;
}

export interface WaterIntake {
  id: string;
  chat_id: string;
  amount: number;
  date: string;
  created_at: string;
}

// Базовый URL для API (замените на ваш Supabase URL)
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Функция для выполнения запросов к Supabase
const supabaseRequest = async (endpoint: string) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Ошибка загрузки данных: ${response.statusText}`);
  }
  
  return response.json();
};

// Хуки для получения данных
export const useUserProfile = () => {
  const { user } = useAuth();
  const chatId = user?.id || '';

  return useQuery({
    queryKey: ['profile', chatId],
    queryFn: () => supabaseRequest(`profiles?chat_id=eq.${chatId}`),
    enabled: !!chatId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

export const useUserMeals = (days: number = 7) => {
  const { user } = useAuth();
  const chatId = user?.id || '';
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const dateStr = startDate.toISOString().split('T')[0];

  return useQuery({
    queryKey: ['meals', chatId, days],
    queryFn: () => supabaseRequest(`meals?chat_id=eq.${chatId}&eaten_at=gte.${dateStr}&order=eaten_at.desc`),
    enabled: !!chatId,
    staleTime: 2 * 60 * 1000, // 2 минуты
  });
};

export const useTodayMeals = () => {
  const { user } = useAuth();
  const chatId = user?.id || '';
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['todayMeals', chatId, today],
    queryFn: () => supabaseRequest(`meals?chat_id=eq.${chatId}&eaten_at=gte.${today}&eaten_at=lt.${today}T23:59:59`),
    enabled: !!chatId,
    staleTime: 1 * 60 * 1000, // 1 минута
  });
};

export const useLatestDigest = () => {
  const { user } = useAuth();
  const chatId = user?.id || '';

  return useQuery({
    queryKey: ['latestDigest', chatId],
    queryFn: () => supabaseRequest(`digests?chat_id=eq.${chatId}&order=date.desc&limit=1`),
    enabled: !!chatId,
    staleTime: 10 * 60 * 1000, // 10 минут
  });
};

export const useTodayWater = () => {
  const { user } = useAuth();
  const chatId = user?.id || '';
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['todayWater', chatId, today],
    queryFn: () => supabaseRequest(`water_intake?chat_id=eq.${chatId}&date=eq.${today}`),
    enabled: !!chatId,
    staleTime: 2 * 60 * 1000, // 2 минуты
  });
};

// Вспомогательные функции для обработки данных
export const calculateTodayTotals = (meals: Meal[]) => {
  return meals.reduce((totals, meal) => ({
    calories: totals.calories + (meal.calories || 0),
    protein: totals.protein + (meal.protein || 0),
    fat: totals.fat + (meal.fat || 0),
    carbs: totals.carbs + (meal.carbs || 0),
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
};

export const getWeeklyCalorieData = (meals: Meal[]) => {
  const weekData = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayMeals = meals.filter(meal => 
      meal.eaten_at.startsWith(dateStr)
    );
    
    const totalCalories = dayMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    
    weekData.push({
      day: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
      calories: totalCalories,
      date: dateStr
    });
  }
  
  return weekData;
};

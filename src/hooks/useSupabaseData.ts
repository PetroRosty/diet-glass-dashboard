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

// Прямая конфигурация Supabase
const SUPABASE_URL = "https://eopdbgulvmunmykoyaha.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcGRiZ3Vsdm11bm15a295YWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk2ODQsImV4cCI6MjA2MzgyNTY4NH0.WpOVQpr3vyWIWtfPk6prz-80KzncZLuWumIVQIsEsvw";

// Проверяем наличие конфигурации Supabase
export const isSupabaseConfigured = () => {
  const isConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.trim() !== '' && SUPABASE_ANON_KEY.trim() !== '');
  
  console.log('Supabase configured:', isConfigured);
  console.log('Supabase URL:', SUPABASE_URL);
  console.log('Supabase Key length:', SUPABASE_ANON_KEY.length);
  return isConfigured;
};

// Функция для выполнения запросов к Supabase
const supabaseRequest = async (endpoint: string) => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase не настроен. URL и ключ не найдены');
  }

  try {
    console.log(`Выполняется запрос к Supabase: ${endpoint}`);
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });
    
    console.log(`Ответ от Supabase для ${endpoint}:`, response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ошибка Supabase: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Данные получены для ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error('Supabase request error:', error);
    throw error;
  }
};

// Хуки для получения данных
export const useUserProfile = () => {
  const { user } = useAuth();
  const chatId = user?.id || '';

  return useQuery({
    queryKey: ['profile', chatId],
    queryFn: () => {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase не настроен');
      }
      console.log(`Запрос профиля для chat_id: ${chatId}`);
      return supabaseRequest(`profiles?telegram_id=eq.${chatId}`);
    },
    enabled: !!chatId && isSupabaseConfigured(),
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: false,
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
    queryFn: () => {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase не настроен');
      }
      console.log(`Запрос питания для chat_id: ${chatId}, дней: ${days}`);
      return supabaseRequest(`meals?chat_id=eq.${chatId}&eaten_at=gte.${dateStr}&order=eaten_at.desc`);
    },
    enabled: !!chatId && isSupabaseConfigured(),
    staleTime: 2 * 60 * 1000, // 2 минуты
    retry: false,
  });
};

export const useTodayMeals = () => {
  const { user } = useAuth();
  const chatId = user?.id || '';
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['todayMeals', chatId, today],
    queryFn: () => {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase не настроен');
      }
      console.log(`Запрос сегодняшнего питания для chat_id: ${chatId}, дата: ${today}`);
      return supabaseRequest(`meals?chat_id=eq.${chatId}&eaten_day=eq.${today}`);
    },
    enabled: !!chatId && isSupabaseConfigured(),
    staleTime: 1 * 60 * 1000, // 1 минута
    retry: false,
  });
};

export const useLatestDigest = () => {
  const { user } = useAuth();
  const chatId = user?.id || '';

  return useQuery({
    queryKey: ['latestDigest', chatId],
    queryFn: () => {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase не настроен');
      }
      console.log(`Запрос дайджеста для chat_id: ${chatId}`);
      return supabaseRequest(`digests?chat_id=eq.${chatId}&order=for_date.desc&limit=1`);
    },
    enabled: !!chatId && isSupabaseConfigured(),
    staleTime: 10 * 60 * 1000, // 10 минут
    retry: false,
  });
};

export const useTodayWater = () => {
  const { user } = useAuth();
  const chatId = user?.id || '';
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['todayWater', chatId, today],
    queryFn: () => {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase не настроен');
      }
      console.log(`Запрос воды для chat_id: ${chatId}, дата: ${today}`);
      return supabaseRequest(`water_intake?chat_id=eq.${chatId}&date=eq.${today}`);
    },
    enabled: !!chatId && isSupabaseConfigured(),
    staleTime: 2 * 60 * 1000, // 2 минуты
    retry: false,
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

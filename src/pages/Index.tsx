import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useSupabaseData';
import CalorieChart from '@/components/CalorieChart';
import MacroCards from '@/components/MacroCards';
import LastMealCard from '@/components/LastMealCard';
import WaterIntake from '@/components/WaterIntake';
import WeeklyChart from '@/components/WeeklyChart';
import AIRecommendation from '@/components/AIRecommendation';
import MealHistory from '@/components/MealHistory';
import ActionCards from '@/components/ActionCards';
import ProAnalytics from '@/components/ProAnalytics';
import ProReports from '@/components/ProReports';
import DatabaseStatus from '@/components/DatabaseStatus';
import ProBlock from '@/components/ProBlock';
import { MessageSquare } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { data: profileData, isLoading: profileLoading } = useUserProfile();
  
  const getUserName = () => {
    if (profileData && profileData.length > 0) {
      const profile = profileData[0];
      return profile.first_name || user?.name || 'Пользователь';
    }
    return user?.name || 'Пользователь';
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Статус подключения к базе данных */}
        <DatabaseStatus />

        {/* Приветствие */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Добро пожаловать, {profileLoading ? 'Загрузка...' : getUserName()}!
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">Отслеживайте свой прогресс и достигайте целей</p>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Левая колонка */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Обзор дня */}
            <section id="overview">
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Обзор дня</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <CalorieChart />
                <LastMealCard />
                <WaterIntake />
              </div>
              <div className="mt-4">
                <MacroCards />
              </div>
            </section>

            {/* График за неделю */}
            <section id="weekly">
              <WeeklyChart />
            </section>

            {/* PRO Аналитика */}
            <ProAnalytics />

            {/* AI рекомендации */}
            <AIRecommendation />

            {/* История приёмов пищи */}
            <section id="history">
              <MealHistory />
            </section>
          </div>

          {/* Правая колонка */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            <ActionCards />
            
            {/* PRO блоки */}
            <ProBlock
              title="Чат с нутрициологом"
              description="Персональные консультации с профессиональным нутрициологом"
              icon={<MessageSquare className="w-6 h-6 text-fitness-purple" />}
              buttonText="Скоро"
            >
              <div className="p-6">
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">👨‍⚕️</div>
                  <p className="text-gray-300 mb-2">Чат с нутрициологом</p>
                  <p className="text-sm text-gray-400">Скоро вы сможете общаться с профессиональным нутрициологом и получать персональные рекомендации!</p>
                </div>
              </div>
            </ProBlock>
            
            <ProReports />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

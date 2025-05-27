
import Header from '@/components/Header';
import CalorieChart from '@/components/CalorieChart';
import MacroCards from '@/components/MacroCards';
import LastMealCard from '@/components/LastMealCard';
import WaterIntake from '@/components/WaterIntake';
import ActivityCard from '@/components/ActivityCard';
import WeeklyChart from '@/components/WeeklyChart';
import AIRecommendation from '@/components/AIRecommendation';
import MealHistory from '@/components/MealHistory';
import ActionCards from '@/components/ActionCards';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Приветствие */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Добро пожаловать, Анна!</h1>
          <p className="text-gray-400">Отслеживайте свой прогресс и достигайте целей</p>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Левая колонка */}
          <div className="lg:col-span-8 space-y-6">
            {/* Обзор дня */}
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Обзор дня</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <CalorieChart />
                <LastMealCard />
                <WaterIntake />
              </div>
              <MacroCards />
            </section>

            {/* Активность */}
            <ActivityCard />

            {/* График за неделю */}
            <WeeklyChart />

            {/* AI рекомендации */}
            <AIRecommendation />

            {/* История приёмов пищи */}
            <MealHistory />
          </div>

          {/* Правая колонка */}
          <div className="lg:col-span-4">
            <ActionCards />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

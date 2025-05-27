
import { useTodayMeals, useUserProfile, calculateTodayTotals } from '@/hooks/useSupabaseData';
import { Loader2 } from 'lucide-react';

const MacroCards = () => {
  const { data: todayMeals, isLoading: mealsLoading } = useTodayMeals();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  if (mealsLoading || profileLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-4">
            <div className="flex items-center justify-center h-20">
              <Loader2 className="w-6 h-6 text-fitness-blue animate-spin" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const meals = todayMeals || [];
  const userProfile = profile?.[0];
  
  const totals = calculateTodayTotals(meals);
  
  // Цели из профиля или дефолтные значения
  const proteinGoal = userProfile?.daily_protein_goal || 150;
  const fatGoal = userProfile?.daily_fat_goal || 80;
  const carbsGoal = userProfile?.daily_carbs_goal || 220;

  const macros = [
    { 
      name: 'Белки', 
      current: Math.round(totals.protein), 
      target: proteinGoal, 
      unit: 'г', 
      color: 'fitness-green', 
      percentage: Math.round((totals.protein / proteinGoal) * 100) 
    },
    { 
      name: 'Жиры', 
      current: Math.round(totals.fat), 
      target: fatGoal, 
      unit: 'г', 
      color: 'fitness-purple', 
      percentage: Math.round((totals.fat / fatGoal) * 100) 
    },
    { 
      name: 'Углеводы', 
      current: Math.round(totals.carbs), 
      target: carbsGoal, 
      unit: 'г', 
      color: 'fitness-blue', 
      percentage: Math.round((totals.carbs / carbsGoal) * 100) 
    }
  ];

  if (meals.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {macros.map((macro, index) => (
          <div key={macro.name} className="glass-card p-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-300">{macro.name}</h4>
              <span className="text-xs text-gray-500">0%</span>
            </div>
            <div className="flex items-end space-x-2 mb-3">
              <span className="text-xl font-bold text-white">0</span>
              <span className="text-sm text-gray-400">/ {macro.target} {macro.unit}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="h-2 rounded-full bg-gray-600 w-0"></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Начните вести дневник питания</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {macros.map((macro, index) => (
        <div key={macro.name} className="glass-card p-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">{macro.name}</h4>
            <span className="text-xs text-gray-500">{Math.min(macro.percentage, 100)}%</span>
          </div>
          <div className="flex items-end space-x-2 mb-3">
            <span className="text-xl font-bold text-white">{macro.current}</span>
            <span className="text-sm text-gray-400">/ {macro.target} {macro.unit}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-${macro.color} transition-all duration-500`}
              style={{ width: `${Math.min(macro.percentage, 100)}%` }}
            ></div>
          </div>
          {macro.percentage > 100 && (
            <div className="text-xs text-orange-400 mt-1">Превышена норма на {macro.percentage - 100}%</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MacroCards;

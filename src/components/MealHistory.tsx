
import { Calendar, Clock } from 'lucide-react';

const MealHistory = () => {
  const meals = [
    { time: '08:00', name: 'Овсянка с бананом', calories: 320, type: 'Завтрак', date: 'Сегодня' },
    { time: '11:30', name: 'Протеиновый коктейль', calories: 180, type: 'Перекус', date: 'Сегодня' },
    { time: '14:30', name: 'Салат Цезарь', calories: 420, type: 'Обед', date: 'Сегодня' },
    { time: '19:00', name: 'Куриная грудка с рисом', calories: 580, type: 'Ужин', date: 'Вчера' },
    { time: '16:45', name: 'Греческий йогурт', calories: 150, type: 'Перекус', date: 'Вчера' }
  ];

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>История приёмов пищи</span>
        </h3>
        <button className="text-fitness-blue hover:text-blue-400 text-sm font-medium transition-colors">
          Показать все
        </button>
      </div>
      <div className="space-y-4">
        {meals.map((meal, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-glass-bg border border-glass-border hover:bg-gray-800/50 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-fitness-green to-fitness-blue rounded-lg flex items-center justify-center text-white text-sm font-medium">
                {meal.type[0]}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h4 className="text-white font-medium truncate">{meal.name}</h4>
                <span className="text-xs text-fitness-green font-medium">{meal.calories} ккал</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{meal.time}</span>
                <span>•</span>
                <span>{meal.type}</span>
                <span>•</span>
                <span>{meal.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealHistory;

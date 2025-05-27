
import { Clock } from 'lucide-react';

const LastMealCard = () => {
  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-4">Последний приём пищи</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-fitness-green to-fitness-blue rounded-lg flex items-center justify-center">
            🥗
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium">Салат Цезарь</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>14:30</span>
              <span>•</span>
              <span className="text-fitness-green">320 ккал</span>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Белки: 25г • Жиры: 15г • Углеводы: 20г
        </div>
      </div>
    </div>
  );
};

export default LastMealCard;

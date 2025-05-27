
import { Activity } from 'lucide-react';

const ActivityCard = () => {
  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <Activity className="w-5 h-5 text-fitness-purple" />
        <span>Физическая активность</span>
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Шаги</span>
          <span className="text-white font-semibold">8,420 / 10,000</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="h-2 rounded-full bg-gradient-to-r from-fitness-purple to-fitness-blue w-[84%] transition-all duration-500"></div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Сожжено калорий</span>
          <span className="text-fitness-green">420 ккал</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;

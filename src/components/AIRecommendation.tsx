
import { Sparkles } from 'lucide-react';

const AIRecommendation = () => {
  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-fitness-purple" />
        <h3 className="text-lg font-semibold text-white">AI-диетолог</h3>
      </div>
      <div className="bg-gradient-to-r from-fitness-purple/20 to-fitness-blue/20 rounded-lg p-4 border border-fitness-purple/30">
        <p className="text-gray-200 leading-relaxed">
          Совет дня: "Сегодня отлично поработал над рационом! Завтра попробуй добавить больше овощей для клетчатки 🌱"
        </p>
      </div>
      <button className="mt-4 text-fitness-purple hover:text-purple-400 text-sm font-medium transition-colors">
        Получить персональный совет
      </button>
    </div>
  );
};

export default AIRecommendation;

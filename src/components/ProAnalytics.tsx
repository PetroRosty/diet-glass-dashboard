
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp } from 'lucide-react';
import ProBlock from './ProBlock';

const ProAnalytics = () => {
  // Mock data for the blurred chart
  const monthlyData = [
    { month: 'Янв', calories: 2100, protein: 120, fat: 80, carbs: 180 },
    { month: 'Фев', calories: 1950, protein: 110, fat: 75, carbs: 170 },
    { month: 'Мар', calories: 2200, protein: 130, fat: 85, carbs: 190 },
    { month: 'Апр', calories: 2000, protein: 125, fat: 78, carbs: 175 },
    { month: 'Май', calories: 1980, protein: 115, fat: 72, carbs: 165 }
  ];

  const chartContent = (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-fitness-purple" />
        <span>Аналитика за 5 месяцев</span>
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="month" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 24, 39, 0.8)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="calories" fill="#8B5CF6" />
          <Bar dataKey="protein" fill="#10B981" />
          <Bar dataKey="fat" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-fitness-green">85%</div>
          <div className="text-xs text-gray-400">Выполнение целей</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-fitness-blue">12</div>
          <div className="text-xs text-gray-400">Недель прогресса</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-fitness-purple">-3.2</div>
          <div className="text-xs text-gray-400">кг за месяц</div>
        </div>
      </div>
    </div>
  );

  return (
    <ProBlock
      title="PRO Аналитика питания"
      description="Ещё больше графиков и персональная статистика по вашему рациону за длительные периоды"
      icon={<TrendingUp className="w-6 h-6 text-fitness-purple" />}
      buttonText="Попробовать PRO бесплатно"
    >
      {chartContent}
    </ProBlock>
  );
};

export default ProAnalytics;

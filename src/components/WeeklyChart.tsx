
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeeklyChart = () => {
  const data = [
    { day: 'Пн', calories: 1950 },
    { day: 'Вт', calories: 1800 },
    { day: 'Ср', calories: 2100 },
    { day: 'Чт', calories: 1750 },
    { day: 'Пт', calories: 2000 },
    { day: 'Сб', calories: 2300 },
    { day: 'Вс', calories: 1800 }
  ];

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Рацион за неделю</h3>
        <button className="text-fitness-blue hover:text-blue-400 text-sm font-medium transition-colors">
          Подробнее
        </button>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="day" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 24, 39, 0.8)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '8px',
              backdropFilter: 'blur(12px)'
            }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Line 
            type="monotone" 
            dataKey="calories" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;

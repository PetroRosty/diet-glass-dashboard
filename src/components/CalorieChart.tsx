
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CalorieChart = () => {
  const data = [
    { name: 'Потреблено', value: 1800, color: '#3B82F6' },
    { name: 'Осталось', value: 400, color: '#374151' }
  ];

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-4">Калории сегодня</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={450}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">1800</div>
            <div className="text-sm text-gray-400">из 2200 ккал</div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between text-sm">
        <span className="text-fitness-blue">Потреблено: 1800</span>
        <span className="text-gray-400">Осталось: 400</span>
      </div>
    </div>
  );
};

export default CalorieChart;

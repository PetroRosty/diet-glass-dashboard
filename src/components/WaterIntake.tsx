
const WaterIntake = () => {
  const current = 2.2;
  const target = 3.0;
  const percentage = (current / target) * 100;

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-4">Потребление воды</h3>
      <div className="flex items-center space-x-4">
        <div className="text-4xl">💧</div>
        <div className="flex-1">
          <div className="flex items-end space-x-2 mb-2">
            <span className="text-2xl font-bold text-fitness-blue">{current}</span>
            <span className="text-sm text-gray-400">/ {target} л</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-fitness-blue to-fitness-green transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">{Math.round(percentage)}% от дневной нормы</div>
        </div>
      </div>
    </div>
  );
};

export default WaterIntake;

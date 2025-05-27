
const MacroCards = () => {
  const macros = [
    { name: 'Белки', current: 120, target: 150, unit: 'г', color: 'fitness-green', percentage: 80 },
    { name: 'Жиры', current: 65, target: 80, unit: 'г', color: 'fitness-purple', percentage: 81 },
    { name: 'Углеводы', current: 180, target: 220, unit: 'г', color: 'fitness-blue', percentage: 82 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {macros.map((macro, index) => (
        <div key={macro.name} className="glass-card p-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">{macro.name}</h4>
            <span className="text-xs text-gray-500">{macro.percentage}%</span>
          </div>
          <div className="flex items-end space-x-2 mb-3">
            <span className="text-xl font-bold text-white">{macro.current}</span>
            <span className="text-sm text-gray-400">/ {macro.target} {macro.unit}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full bg-${macro.color} transition-all duration-500`}
              style={{ width: `${macro.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MacroCards;

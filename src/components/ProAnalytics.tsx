import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMonthlyAnalytics } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Calendar, Target } from 'lucide-react';

const ProAnalytics = () => {
  const { data, isLoading, error } = useMonthlyAnalytics();

  if (isLoading) {
    return (
      <Card className="glass-card animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-fitness-purple" />
            <span>Аналитика питания</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-[300px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-card animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-500">
            <TrendingUp className="w-5 h-5" />
            <span>Ошибка загрузки данных</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Не удалось загрузить данные аналитики. Пожалуйста, попробуйте позже.</p>
        </CardContent>
      </Card>
    );
  }

  const { monthlyData, stats } = data;

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-fitness-purple" />
          <span>Аналитика питания</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Статистика */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-fitness-purple/20 to-fitness-blue/20 p-4 rounded-lg border border-fitness-purple/30">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-fitness-purple" />
                <span className="text-sm text-gray-400">Дней с данными</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalDays}</div>
              <div className="text-xs text-gray-400 mt-1">
                за {stats.monthsWithData} {stats.monthsWithData === 1 ? 'месяц' : 'месяцев'}
              </div>
            </div>

            <div className="bg-gradient-to-r from-fitness-blue/20 to-fitness-green/20 p-4 rounded-lg border border-fitness-blue/30">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-fitness-blue" />
                <span className="text-sm text-gray-400">Средние калории</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.avgCalories.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">ккал в день</div>
            </div>

            <div className="bg-gradient-to-r from-fitness-green/20 to-fitness-purple/20 p-4 rounded-lg border border-fitness-green/30">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-fitness-green" />
                <span className="text-sm text-gray-400">Выполнение целей</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.goalCompletion}%</div>
              <div className="text-xs text-gray-400 mt-1">месяцев с данными</div>
            </div>
          </div>

          {/* График */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => `${value.toLocaleString()} ккал`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                  formatter={(value: number) => [`${value.toLocaleString()} ккал`, 'Калории']}
                />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#8B5CF6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Дополнительная информация */}
          <div className="text-sm text-gray-400 text-center">
            Данные обновляются каждые 5 минут. График показывает среднее потребление калорий по месяцам.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProAnalytics;

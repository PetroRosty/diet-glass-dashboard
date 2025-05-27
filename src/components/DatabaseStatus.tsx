
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { useUserProfile } from '@/hooks/useSupabaseData';

const DatabaseStatus = () => {
  const { error, isLoading } = useUserProfile();

  if (isLoading) return null;

  if (error) {
    return (
      <div className="glass-card p-4 mb-6 border-red-500/30 bg-red-500/10">
        <div className="flex items-center space-x-3">
          <WifiOff className="w-5 h-5 text-red-400" />
          <div>
            <h4 className="text-red-400 font-medium">Проблема с подключением к базе данных</h4>
            <p className="text-gray-300 text-sm">
              Не удается загрузить данные из Supabase. Проверьте настройки подключения.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-3 mb-6 border-green-500/30 bg-green-500/10">
      <div className="flex items-center space-x-2">
        <Wifi className="w-4 h-4 text-green-400" />
        <span className="text-green-400 text-sm font-medium">Подключено к базе данных</span>
      </div>
    </div>
  );
};

export default DatabaseStatus;

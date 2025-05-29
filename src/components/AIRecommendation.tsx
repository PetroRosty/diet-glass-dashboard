import { Sparkles, Loader2 } from 'lucide-react';
import { useLatestDigest } from '@/hooks/useSupabaseData';

const AIRecommendation = () => {
  const { data: digest, isLoading, error } = useLatestDigest();

  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-fitness-purple" />
          <h3 className="text-lg font-semibold text-white">AI-диетолог</h3>
        </div>
        <div className="flex items-center justify-center h-20">
          <Loader2 className="w-6 h-6 text-fitness-purple animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !digest) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-fitness-purple" />
          <h3 className="text-lg font-semibold text-white">AI-диетолог</h3>
        </div>
        <div className="bg-gradient-to-r from-fitness-purple/20 to-fitness-blue/20 rounded-lg p-4 border border-fitness-purple/30">
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🤖</div>
            <p className="text-gray-300 mb-2">Пока нет персональных рекомендаций</p>
            <p className="text-sm text-gray-400">Ведите дневник питания несколько дней, и AI-диетолог даст вам персональные советы!</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-fitness-purple" />
          <h3 className="text-lg font-semibold text-white">AI-диетолог</h3>
        </div>
        <span className="text-xs text-gray-500">{formatDate(digest.for_date)}</span>
      </div>
      
      <div className="space-y-4">
        {digest.summary_md && (
          <div className="bg-gradient-to-r from-fitness-blue/20 to-fitness-purple/20 rounded-lg p-4 border border-fitness-blue/30">
            <h4 className="text-sm font-semibold text-fitness-blue mb-2">Анализ дня:</h4>
            <p className="text-gray-200 text-sm leading-relaxed">
              {digest.summary_md}
            </p>
          </div>
        )}
        
        {digest.recommendation && (
          <div className="bg-gradient-to-r from-fitness-purple/20 to-fitness-green/20 rounded-lg p-4 border border-fitness-purple/30">
            <h4 className="text-sm font-semibold text-fitness-purple mb-2">Рекомендация:</h4>
            <p className="text-gray-200 text-sm leading-relaxed">
              {digest.recommendation}
            </p>
          </div>
        )}
      </div>
      
      <button className="mt-4 text-fitness-purple hover:text-purple-400 text-sm font-medium transition-colors">
        Получить новый анализ
      </button>
    </div>
  );
};

export default AIRecommendation;

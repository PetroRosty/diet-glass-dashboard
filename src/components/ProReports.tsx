import { FileText, Download, FileSpreadsheet, FileType } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProBlock from './ProBlock';
import { useReports } from '@/hooks/useReports';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const ProReports = () => {
  const { exportToPDF, exportToExcel } = useReports();
  const [isExporting, setIsExporting] = useState<'pdf' | 'excel' | null>(null);

  const handleExport = async (format: 'pdf' | 'excel', period: 'week' | 'month') => {
    try {
      setIsExporting(format);
      if (format === 'pdf') {
        await exportToPDF(period);
      } else {
        await exportToExcel(period);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const reportContent = (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <FileText className="w-5 h-5 text-fitness-blue" />
        <span>Расширенные отчёты</span>
      </h3>
      <div className="space-y-4">
        {/* Отчёт за неделю */}
        <div className="bg-gradient-to-r from-fitness-blue/20 to-fitness-purple/20 p-4 rounded-lg border border-fitness-blue/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium">Отчёт за неделю</h4>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="border-fitness-blue/30 hover:bg-fitness-blue/20"
                onClick={() => handleExport('pdf', 'week')}
                disabled={isExporting === 'pdf'}
              >
                {isExporting === 'pdf' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                PDF
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-fitness-green/30 hover:bg-fitness-green/20"
                onClick={() => handleExport('excel', 'week')}
                disabled={isExporting === 'excel'}
              >
                {isExporting === 'excel' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                )}
                Excel
              </Button>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-3">Статистика питания за последние 7 дней</p>
        </div>

        {/* Отчёт за месяц */}
        <div className="bg-gradient-to-r from-fitness-purple/20 to-fitness-green/20 p-4 rounded-lg border border-fitness-purple/30">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium">Отчёт за месяц</h4>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="border-fitness-blue/30 hover:bg-fitness-blue/20"
                onClick={() => handleExport('pdf', 'month')}
                disabled={isExporting === 'pdf'}
              >
                {isExporting === 'pdf' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                PDF
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-fitness-green/30 hover:bg-fitness-green/20"
                onClick={() => handleExport('excel', 'month')}
                disabled={isExporting === 'excel'}
              >
                {isExporting === 'excel' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                )}
                Excel
              </Button>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-3">Детальный анализ рациона за 30 дней</p>
        </div>

        <div className="text-center pt-2">
          <span className="text-xs text-gray-500">
            Отчёты включают статистику, графики и детальную информацию о приёмах пищи
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <ProBlock
      title="Расширенные отчёты"
      description="Экспортируйте детальные отчёты о вашем питании в PDF или Excel"
      icon={<FileText className="w-6 h-6 text-fitness-blue" />}
      buttonText="Открыть доступ"
    >
      {reportContent}
    </ProBlock>
  );
};

export default ProReports;

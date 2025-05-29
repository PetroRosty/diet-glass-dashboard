import { useUserMeals, useUserProfile } from './useSupabaseData';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';

interface ReportData {
  meals: any[];
  profile: any;
  period: {
    start: string;
    end: string;
  };
}

export const useReports = () => {
  const { data: profile } = useUserProfile();
  const { data: weeklyMeals } = useUserMeals(7);
  const { data: monthlyMeals } = useUserMeals(30);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const calculateTotals = (meals: any[]) => {
    return meals.reduce((totals, meal) => ({
      calories: totals.calories + (meal.kcal || 0),
      protein: totals.protein + (meal.prot || 0),
      fat: totals.fat + (meal.fat || 0),
      carbs: totals.carbs + (meal.carb || 0),
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
  };

  const generateReportData = (period: 'week' | 'month'): ReportData => {
    const meals = period === 'week' ? weeklyMeals || [] : monthlyMeals || [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (period === 'week' ? 7 : 30));

    return {
      meals,
      profile: profile?.[0] || {},
      period: {
        start: formatDate(startDate),
        end: formatDate(endDate)
      }
    };
  };

  const exportToPDF = async (period: 'week' | 'month') => {
    const reportData = generateReportData(period);
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Заголовок
    doc.setFontSize(20);
    doc.text('Отчёт о питании', pageWidth / 2, 20, { align: 'center' });
    
    // Период
    doc.setFontSize(12);
    doc.text(
      `Период: ${reportData.period.start} - ${reportData.period.end}`,
      pageWidth / 2,
      30,
      { align: 'center' }
    );

    // Информация о пользователе
    doc.setFontSize(12);
    doc.text(`Пользователь: ${reportData.profile.first_name || 'Не указано'}`, 20, 45);
    doc.text(`Цель по калориям: ${reportData.profile.daily_calories_goal || 2200} ккал/день`, 20, 55);

    // Статистика
    const totals = calculateTotals(reportData.meals);
    const avgCalories = Math.round(totals.calories / (reportData.meals.length || 1));
    
    doc.setFontSize(14);
    doc.text('Общая статистика:', 20, 70);
    doc.setFontSize(12);
    doc.text(`Всего дней с данными: ${new Set(reportData.meals.map(m => m.eaten_at.split('T')[0])).size}`, 20, 80);
    doc.text(`Среднее потребление калорий: ${avgCalories} ккал/день`, 20, 90);
    doc.text(`Всего потреблено:`, 20, 100);
    doc.text(`- Калории: ${totals.calories} ккал`, 30, 110);
    doc.text(`- Белки: ${totals.protein}г`, 30, 120);
    doc.text(`- Жиры: ${totals.fat}г`, 30, 130);
    doc.text(`- Углеводы: ${totals.carbs}г`, 30, 140);

    // Таблица приёмов пищи
    const tableData = reportData.meals.map(meal => [
      new Date(meal.eaten_at).toLocaleDateString('ru-RU'),
      meal.name || 'Не указано',
      `${meal.kcal || 0} ккал`,
      `${meal.prot || 0}г`,
      `${meal.fat || 0}г`,
      `${meal.carb || 0}г`
    ]);

    (doc as any).autoTable({
      startY: 150,
      head: [['Дата', 'Блюдо', 'Калории', 'Белки', 'Жиры', 'Углеводы']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246] },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 20 }
    });

    // Сохраняем файл
    doc.save(`diet-report-${period}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToExcel = async (period: 'week' | 'month') => {
    const reportData = generateReportData(period);
    const totals = calculateTotals(reportData.meals);
    const avgCalories = Math.round(totals.calories / (reportData.meals.length || 1));
    const daysWithData = new Set(reportData.meals.map(m => m.eaten_at.split('T')[0])).size;

    // Создаем новую рабочую книгу
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Diet Dashboard';
    workbook.created = new Date();

    // Лист со статистикой
    const statsSheet = workbook.addWorksheet('Статистика');
    statsSheet.columns = [
      { header: 'Параметр', key: 'param', width: 30 },
      { header: 'Значение', key: 'value', width: 20 }
    ];

    // Добавляем данные статистики
    statsSheet.addRows([
      { param: 'Отчёт о питании', value: '' },
      { param: 'Период', value: `${reportData.period.start} - ${reportData.period.end}` },
      { param: 'Пользователь', value: reportData.profile.first_name || 'Не указано' },
      { param: 'Цель по калориям', value: `${reportData.profile.daily_calories_goal || 2200} ккал/день` },
      { param: '', value: '' },
      { param: 'Общая статистика', value: '' },
      { param: 'Дней с данными', value: daysWithData },
      { param: 'Среднее потребление калорий', value: `${avgCalories} ккал/день` },
      { param: 'Всего потреблено:', value: '' },
      { param: 'Калории', value: `${totals.calories} ккал` },
      { param: 'Белки', value: `${totals.protein}г` },
      { param: 'Жиры', value: `${totals.fat}г` },
      { param: 'Углеводы', value: `${totals.carbs}г` }
    ]);

    // Стилизация заголовка
    statsSheet.getRow(1).font = { bold: true, size: 14 };
    statsSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
    statsSheet.mergeCells('A1:B1');

    // Лист с приёмами пищи
    const mealsSheet = workbook.addWorksheet('Приёмы пищи');
    mealsSheet.columns = [
      { header: 'Дата', key: 'date', width: 15 },
      { header: 'Блюдо', key: 'name', width: 30 },
      { header: 'Калории', key: 'calories', width: 12 },
      { header: 'Белки', key: 'protein', width: 12 },
      { header: 'Жиры', key: 'fat', width: 12 },
      { header: 'Углеводы', key: 'carbs', width: 12 }
    ];

    // Добавляем данные о приёмах пищи
    mealsSheet.addRows(reportData.meals.map(meal => ({
      date: new Date(meal.eaten_at).toLocaleDateString('ru-RU'),
      name: meal.name || 'Не указано',
      calories: meal.kcal || 0,
      protein: meal.prot || 0,
      fat: meal.fat || 0,
      carbs: meal.carb || 0
    })));

    // Стилизация заголовков
    mealsSheet.getRow(1).font = { bold: true };
    mealsSheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Сохраняем файл
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diet-report-${period}-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return {
    exportToPDF,
    exportToExcel
  };
}; 
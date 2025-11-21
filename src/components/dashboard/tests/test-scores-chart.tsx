'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import { TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type TestScoresChartProps = {
    test: Test;
};

export default function TestScoresChart({ test }: TestScoresChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#171717' : '#000',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: isDark ? '#404040' : '#000',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context: { dataIndex: number; parsed: { y: number | null } }) {
            const score = test.scores?.[context.dataIndex];
            const value = score?.value ?? 0;
            const maxValue = score?.maxValue ?? 100;
            return [`${context.parsed.y ?? 0}%`, `得点: ${value} / ${maxValue}`];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: isDark ? '#a3a3a3' : '#6b7280',
          font: {
            size: 11,
          }
        }
      },
      y: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: isDark ? '#a3a3a3' : '#6b7280',
          font: {
            size: 10,
          },
          callback: function(value: string | number) {
            return value + '%';
          }
        },
        max: 100,
        min: 0
      }
    }
  };

  if (!test.scores || test.scores.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900  rounded-sm">
        <div className="flex flex-col items-center justify-center h-[320px]">
          <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-gray-400 dark:text-neutral-500" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">データがありません</p>
          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">スコアを追加すると表示されます</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: test.scores.map(score => score.subject?.name ?? '未設定'),
    datasets: [
      {
        label: '達成率',
        data: test.scores.map(score => {
          const maxValue = score.maxValue ?? 100;
          const percent = ((score.value ?? 0) / maxValue) * 100;
          return Math.round(percent);
        }),
        backgroundColor: test.scores.map(score => score.subject?.color ?? '#808080'),
        borderRadius: 4,
        barThickness: 40,
      }
    ]
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-sm">
      <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">教科別達成率</h2>
      </div>

      <div className="px-6 py-6">
        <div style={{ height: 280 }}>
          <Bar options={options} data={chartData} />
        </div>
      </div>
    </div>
  );
}

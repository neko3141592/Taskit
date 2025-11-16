'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { TrendingUp } from 'lucide-react';
import { useTheme } from 'next-themes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function SubjectChart({ subjectId }: { subjectId: string }) {
  const [chartData, setChartData] = useState<SubjectChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    spanGaps: true,
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
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
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
            size: 11,
          },
          callback: function(value: number) {
            return value + '%';
          }
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get<APIResponse<SubjectChartData | null>>('/api/subjects/chart?id=' + subjectId);
        if (res.data) {
          setChartData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm">
        <div className="flex items-center justify-center h-[380px]">
          <div className="text-sm text-gray-400 dark:text-neutral-500">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!chartData || chartData.datasets.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm">
        <div className="flex flex-col items-center justify-center h-[380px]">
          <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-gray-400 dark:text-neutral-500" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">データがありません</p>
          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">テストのスコアを追加すると表示されます</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm">
      <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">成績推移</h2>
      </div>

      <div className="px-6 py-6">
        <div style={{ height: 320 }}>
          <Line options={options} data={chartData} />
        </div>
      </div>

      {chartData.datasets.length > 0 && (
        <div className="px-6 pb-4 border-t border-neutral-100 dark:border-neutral-800 pt-4">
          <div className="flex flex-wrap gap-3">
            {chartData.datasets.map((dataset, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: dataset.borderColor }}
                />
                <span className="text-xs font-medium text-gray-700 dark:text-neutral-300">{dataset.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { ChartOptions, ChartData } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { formatCurrency } from '../../utils/formatters';
import { BarChart3, LineChart as LineIcon } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HistoryChartProps {
  chartData: {
    labels: string[];
    bills: number[];
    units: number[];
  };
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ chartData }) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  if (!chartData.labels || chartData.labels.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-utility-border p-4 text-center text-xs text-utility-muted">
        No prediction history available to graph.
      </div>
    );
  }

  const lineData: ChartData<'line'> = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Estimated Bill (₹)',
        data: chartData.bills,
        borderColor: '#C25E00',
        backgroundColor: 'rgba(194, 94, 0, 0.08)',
        borderWidth: 2,
        fill: true,
        tension: 0.25,
        pointBackgroundColor: '#C25E00',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const barData: ChartData<'bar'> = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Estimated Bill (₹)',
        data: chartData.bills,
        backgroundColor: 'rgba(194, 94, 0, 0.8)',
        borderColor: '#C25E00',
        borderWidth: 1.5,
        borderRadius: 4,
      },
    ],
  };

  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1C1917',
        titleFont: { family: 'Inter', size: 11, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 8,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const rawVal = context.parsed.y ?? 0;
            return `Bill: ${formatCurrency(rawVal)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#57534E',
          font: {
            family: 'Inter',
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: '#F0ECE4',
        },
        ticks: {
          color: '#78716C',
          font: {
            family: 'Inter',
            size: 10,
          },
          callback: (value) => `₹${value}`,
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl border border-utility-border p-4 shadow-soft mb-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-utility-charcoal">
            Monthly Bill Trend (₹)
          </h2>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-cream-100 p-0.5 rounded border border-utility-border text-xs">
          <button
            type="button"
            onClick={() => setChartType('line')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              chartType === 'line'
                ? 'bg-white text-utility-charcoal shadow-soft font-semibold'
                : 'text-utility-secondary hover:text-utility-charcoal'
            }`}
          >
            <LineIcon className="w-3 h-3" />
            <span>Line</span>
          </button>
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-white text-utility-charcoal shadow-soft font-semibold'
                : 'text-utility-secondary hover:text-utility-charcoal'
            }`}
          >
            <BarChart3 className="w-3 h-3" />
            <span>Bar</span>
          </button>
        </div>
      </div>

      <div className="h-44 sm:h-48 w-full">
        {chartType === 'line' ? (
          <Line data={lineData} options={options as ChartOptions<'line'>} />
        ) : (
          <Bar data={barData} options={options as ChartOptions<'bar'>} />
        )}
      </div>
    </div>
  );
};

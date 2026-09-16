import React from 'react';
import type { HistoryStats as StatsType } from '../../types/prediction';
import { StatCard } from '../ui/StatCard';
import { formatCurrency, formatUnits } from '../../utils/formatters';
import { Wallet, Zap, TrendingUp, FileText } from 'lucide-react';

interface HistoryStatsProps {
  stats: StatsType;
}

export const HistoryStats: React.FC<HistoryStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <StatCard
        title="Average Monthly Bill"
        value={formatCurrency(stats.averageBill)}
        subtitle="Across recorded months"
        icon={<Wallet className="w-3.5 h-3.5 text-utility-orange" />}
      />

      <StatCard
        title="Average Units"
        value={formatUnits(stats.averageConsumption)}
        subtitle="Mean consumption"
        icon={<Zap className="w-3.5 h-3.5 text-utility-orange" />}
      />

      <StatCard
        title="Highest Bill"
        value={formatCurrency(stats.highestBill)}
        subtitle="Peak month"
        icon={<TrendingUp className="w-3.5 h-3.5 text-utility-red" />}
      />

      <StatCard
        title="Total Records"
        value={stats.totalPredictions.toString()}
        subtitle="Saved in browser"
        icon={<FileText className="w-3.5 h-3.5 text-utility-secondary" />}
      />
    </div>
  );
};

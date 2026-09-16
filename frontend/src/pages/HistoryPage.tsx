import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PredictionResult } from '../types/prediction';
import {
  getHistory,
  getHistoryStats,
  getChartData,
  deleteBill,
  clearHistory,
} from '../services/historyService';
import { HistoryStats } from '../components/history/HistoryStats';
import { HistoryChart } from '../components/history/HistoryChart';
import { BillTable } from '../components/history/BillTable';
import { BillModal } from '../components/history/BillModal';
import { Button } from '../components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [bills, setBills] = useState<PredictionResult[]>([]);
  const [stats, setStats] = useState(getHistoryStats());
  const [chartData, setChartData] = useState(getChartData());
  const [selectedBill, setSelectedBill] = useState<PredictionResult | null>(null);

  const refreshData = () => {
    const list = getHistory();
    setBills(list);
    setStats(getHistoryStats());
    setChartData(getChartData());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this record?')) {
      deleteBill(id);
      refreshData();
    }
  };

  const handleClearHistory = () => {
    if (bills.length === 0) return;
    if (window.confirm('Are you sure you want to clear all prediction records?')) {
      clearHistory();
      refreshData();
    }
  };

  const handleViewBill = (bill: PredictionResult) => {
    setSelectedBill(bill);
  };

  const handlePrintBill = (bill: PredictionResult) => {
    navigate('/result', { state: { billResult: bill } });
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Compact Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-utility-border/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-utility-charcoal tracking-tight">
            Bill History
          </h1>
          <p className="text-xs text-utility-secondary mt-0.5">
            Past electricity calculations, monthly unit trends, and reprinting.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {bills.length > 0 && (
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-utility-muted" />}
              onClick={handleClearHistory}
              title="Clear all saved bills"
              className="text-xs px-2.5 sm:px-3"
            >
              <span>Clear History</span>
            </Button>
          )}
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => navigate('/predict')}
            className="text-xs px-2.5 sm:px-3 flex-1 sm:flex-initial"
          >
            <span>New Calculation</span>
          </Button>
        </div>
      </div>

      {/* 1. Four Summary Stats */}
      <HistoryStats stats={stats} />

      {/* 2. Compact Month -> Bill Trend Chart */}
      <HistoryChart chartData={chartData} />

      {/* 3. Prediction Records Table */}
      <BillTable
        bills={bills}
        onViewBill={handleViewBill}
        onPrintBill={handlePrintBill}
        onDeleteBill={handleDelete}
      />

      {/* Bill View / Print Modal */}
      <BillModal
        bill={selectedBill}
        onClose={() => setSelectedBill(null)}
        onPrint={(bill) => {
          setSelectedBill(null);
          handlePrintBill(bill);
        }}
      />
    </div>
  );
};

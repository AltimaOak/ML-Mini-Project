import type { PredictionResult, HistoryStats } from '../types/prediction';

const HISTORY_STORAGE_KEY = 'powerestimate_bill_history_v1';

export function getHistory(): PredictionResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveBill(bill: PredictionResult): void {
  try {
    const current = getHistory();
    // Avoid duplicate IDs
    const filtered = current.filter((b) => b.id !== bill.id && b.billNumber !== bill.billNumber);
    const updated = [bill, ...filtered];
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save bill to localStorage', e);
  }
}

export function getBillById(idOrBillNo: string): PredictionResult | null {
  const list = getHistory();
  return list.find((b) => b.id === idOrBillNo || b.billNumber === idOrBillNo) || null;
}

export function deleteBill(id: string): void {
  try {
    const current = getHistory();
    const updated = current.filter((b) => b.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete bill', e);
  }
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}

export function getHistoryStats(): HistoryStats {
  const list = getHistory();
  if (list.length === 0) {
    return {
      averageBill: 0,
      averageConsumption: 0,
      highestBill: 0,
      totalPredictions: 0,
    };
  }

  const totalBill = list.reduce((sum, item) => sum + item.predicted_bill, 0);
  const totalUnits = list.reduce((sum, item) => sum + (item.inputs?.units || 0), 0);
  const maxBill = Math.max(...list.map((item) => item.predicted_bill));

  return {
    averageBill: Math.round(totalBill / list.length),
    averageConsumption: Math.round(totalUnits / list.length),
    highestBill: maxBill,
    totalPredictions: list.length,
  };
}

export function getChartData(): { labels: string[]; bills: number[]; units: number[] } {
  const list = [...getHistory()].reverse(); // Chronological order
  return {
    labels: list.map((item) => item.billingMonth.replace(' 2026', '')),
    bills: list.map((item) => item.predicted_bill),
    units: list.map((item) => item.inputs?.units || 0),
  };
}

export type ConsumerCategory = 'Residential' | 'Commercial';

export interface PredictionInput {
  units: number;
  people: number;
  daily_hours: number;
  appliances: number;
  previous_units: number;
  billingMonth: string;
  consumerCategory: ConsumerCategory;
  consumerName: string;
  meterNumber?: string;
}

export interface BillBreakdown {
  energyCharges: number;
  fixedCharges: number;
  otherCharges: number;
  total: number;
}

export interface UsageComparison {
  currentUnits: number;
  previousUnits: number;
  diffUnits: number;
  percentChange: number;
  isIncrease: boolean;
}

export interface PredictionResult {
  id: string;
  billNumber: string;
  predicted_bill: number;
  billingMonth: string;
  generatedAt: string;
  inputs: PredictionInput;
  breakdown: BillBreakdown;
  comparison: UsageComparison;
  calculationMode: 'prediction' | 'tariff';
  source: 'api' | 'mock';
  status: 'Estimated';
}

export interface HistoryStats {
  averageBill: number;
  averageConsumption: number;
  highestBill: number;
  totalPredictions: number;
}

import type { PredictionInput, PredictionResult, BillBreakdown, UsageComparison } from '../types/prediction';
import { generateBillNumber, generateMeterNumber } from '../utils/billNumber';
import { formatLongDate } from '../utils/formatters';

// Runtime configuration for API URL (defaults to env or empty string for mock mode)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface PredictionOptions {
  forceMock?: boolean;
}

/**
 * Calculates consumption comparison between current and previous month
 */
export function calculateComparison(currentUnits: number, previousUnits: number): UsageComparison {
  const diffUnits = currentUnits - previousUnits;
  const percentChange = previousUnits > 0 ? (diffUnits / previousUnits) * 100 : 0;
  
  return {
    currentUnits,
    previousUnits,
    diffUnits,
    percentChange,
    isIncrease: diffUnits > 0,
  };
}

/**
 * Standard utility slab calculation for realistic tariff breakdown
 */
export function calculateTariffBreakdown(
  units: number,
  category: 'Residential' | 'Commercial' = 'Residential'
): BillBreakdown {
  const isCommercial = category === 'Commercial';
  const multiplier = isCommercial ? 1.4 : 1.0;
  
  let energyCharges = 0;
  
  if (units <= 100) {
    energyCharges = units * 3.75;
  } else if (units <= 300) {
    energyCharges = (100 * 3.75) + ((units - 100) * 5.80);
  } else if (units <= 500) {
    energyCharges = (100 * 3.75) + (200 * 5.80) + ((units - 300) * 7.50);
  } else {
    energyCharges = (100 * 3.75) + (200 * 5.80) + (200 * 7.50) + ((units - 500) * 8.90);
  }
  
  energyCharges = Math.round(energyCharges * multiplier);
  const fixedCharges = isCommercial ? 250 : 150;
  const otherCharges = Math.round(energyCharges * 0.09); // ~9% regulatory tax & duty
  const total = energyCharges + fixedCharges + otherCharges;
  
  return {
    energyCharges,
    fixedCharges,
    otherCharges,
    total,
  };
}

/**
 * Mock prediction model simulation for development and offline testing.
 * Uses realistic regression weights based on consumption units, hours, appliances, and occupancy.
 */
async function mockPredict(input: PredictionInput): Promise<number> {
  // Simulate 500ms realistic processing time
  await new Promise((resolve) => setTimeout(resolve, 550));
  
  // Base tariff estimation
  const tariff = calculateTariffBreakdown(input.units, input.consumerCategory);
  
  // Appliance & daily hour variance factor (slight load adjustment)
  const hourFactor = Math.max(0.85, Math.min(1.15, input.daily_hours / 8));
  const applianceFactor = Math.max(0.9, Math.min(1.1, 1 + ((input.appliances - 8) * 0.01)));
  
  const estimatedAmount = Math.round((tariff.total * 0.96 * hourFactor * applianceFactor) / 10) * 10;
  return Math.max(150, estimatedAmount);
}

/**
 * Validates prediction input before sending to backend or mock
 */
export function validatePredictionInput(input: PredictionInput): Record<string, string> {
  const errors: Record<string, string> = {};

  if (input.units === undefined || input.units === null || Number.isNaN(input.units)) {
    errors.units = 'Monthly consumption is required.';
  } else if (input.units < 0) {
    errors.units = 'Units cannot be negative.';
  }

  if (input.previous_units === undefined || input.previous_units === null || Number.isNaN(input.previous_units)) {
    errors.previous_units = 'Previous consumption is required.';
  } else if (input.previous_units < 0) {
    errors.previous_units = 'Previous consumption cannot be negative.';
  }

  if (input.people === undefined || input.people === null || Number.isNaN(input.people)) {
    errors.people = 'Number of people is required.';
  } else if (input.people < 1) {
    errors.people = 'People must be at least 1.';
  }

  if (input.daily_hours === undefined || input.daily_hours === null || Number.isNaN(input.daily_hours)) {
    errors.daily_hours = 'Daily usage is required.';
  } else if (input.daily_hours < 0 || input.daily_hours > 24) {
    errors.daily_hours = 'Daily usage must be between 0 and 24 hours.';
  }

  if (input.appliances === undefined || input.appliances === null || Number.isNaN(input.appliances)) {
    errors.appliances = 'Number of appliances is required.';
  } else if (input.appliances < 0) {
    errors.appliances = 'Appliances cannot be negative.';
  }

  return errors;
}

/**
 * Main prediction function.
 * Supports both production Python backend (POST /predict) and local mock estimation.
 */
export async function predictBill(
  input: PredictionInput,
  options?: PredictionOptions
): Promise<PredictionResult> {
  // Validate input first
  const validationErrors = validatePredictionInput(input);
  if (Object.keys(validationErrors).length > 0) {
    const firstError = Object.values(validationErrors)[0];
    throw new Error(`Validation Error: ${firstError}`);
  }

  let predictedAmount: number;
  let source: 'api' | 'mock' = 'mock';

  const shouldCallApi = API_BASE_URL && !options?.forceMock;

  if (shouldCallApi) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          units: Number(input.units),
          people: Number(input.people),
          daily_hours: Number(input.daily_hours),
          appliances: Number(input.appliances),
          previous_units: Number(input.previous_units),
        }),
      });

      if (!response.ok) {
        throw new Error(`Prediction API error (Status ${response.status})`);
      }

      const data = await response.json();
      if (typeof data.predicted_bill !== 'number') {
        throw new Error('Invalid response structure from prediction API.');
      }

      predictedAmount = Math.round(data.predicted_bill);
      source = 'api';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network failure while connecting to prediction server';
      throw new Error(`Could not connect to ML backend: ${message}. Check your API connection or switch to Demo Mode.`);
    }
  } else {
    // Development/demo mode
    predictedAmount = await mockPredict(input);
    source = 'mock';
  }

  // Derive realistic itemized breakdown to match the predicted bill
  const fixedCharges = input.consumerCategory === 'Commercial' ? 250 : 150;
  const taxableBase = Math.max(0, predictedAmount - fixedCharges);
  const otherCharges = Math.round(taxableBase * 0.08); // 8% duty
  const energyCharges = Math.max(0, predictedAmount - fixedCharges - otherCharges);

  const breakdown: BillBreakdown = {
    energyCharges,
    fixedCharges,
    otherCharges,
    total: predictedAmount,
  };

  const comparison = calculateComparison(input.units, input.previous_units);
  const billNumber = generateBillNumber(2026);
  const meterNumber = input.meterNumber || generateMeterNumber();

  return {
    id: `bill_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    billNumber,
    predicted_bill: predictedAmount,
    billingMonth: input.billingMonth || 'September 2026',
    generatedAt: formatLongDate(),
    inputs: {
      ...input,
      meterNumber,
    },
    breakdown,
    comparison,
    calculationMode: 'prediction',
    source,
    status: 'Estimated',
  };
}

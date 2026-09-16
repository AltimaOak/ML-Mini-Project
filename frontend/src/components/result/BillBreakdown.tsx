import React, { useState } from 'react';
import type { BillBreakdown as BreakdownType } from '../../types/prediction';
import { formatCurrency } from '../../utils/formatters';
import { Receipt, Info, Layers } from 'lucide-react';
import { calculateTariffBreakdown } from '../../services/predictionService';

interface BillBreakdownProps {
  breakdown: BreakdownType;
  units: number;
  category: 'Residential' | 'Commercial';
  source: 'api' | 'mock';
}

export const BillBreakdown: React.FC<BillBreakdownProps> = ({
  breakdown,
  units,
  category,
}) => {
  const [showSlabDetails, setShowSlabDetails] = useState(false);

  // Alternative standard slab tariff breakdown
  const tariffBreakdown = calculateTariffBreakdown(units, category);
  const currentBreakdown = showSlabDetails ? tariffBreakdown : breakdown;

  return (
    <div className="bg-white rounded-xl border border-utility-border p-4 sm:p-6 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 mb-4 sm:mb-5 border-b border-utility-border/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cream-100 flex items-center justify-center text-utility-secondary shrink-0">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-utility-charcoal">Bill Breakdown</h2>
            <p className="text-[11px] sm:text-xs text-utility-muted">Simple itemized summary of your estimated charges</p>
          </div>
        </div>

        {/* User-friendly View Switcher */}
        <div className="flex items-center bg-cream-100 p-1 rounded-xl border border-utility-border text-xs w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowSlabDetails(false)}
            className={`flex-1 sm:flex-initial text-center px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all ${
              !showSlabDetails
                ? 'bg-white text-utility-charcoal shadow-soft font-semibold'
                : 'text-utility-secondary hover:text-utility-charcoal'
            }`}
          >
            Estimated Summary
          </button>
          <button
            type="button"
            onClick={() => setShowSlabDetails(true)}
            className={`flex-1 sm:flex-initial text-center flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all ${
              showSlabDetails
                ? 'bg-white text-utility-charcoal shadow-soft font-semibold'
                : 'text-utility-secondary hover:text-utility-charcoal'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Slab Rate View</span>
          </button>
        </div>
      </div>

      {/* Friendly note */}
      <div className="mb-4 p-2.5 sm:p-3 bg-cream-50 rounded-lg border border-utility-border/70 text-xs text-utility-secondary flex items-start gap-2">
        <Info className="w-4 h-4 text-utility-orange shrink-0 mt-0.5" />
        <div>
          {showSlabDetails ? (
            <span>
              <strong>Slab Rate View:</strong> Shows how your electricity bill is tiered into usage slabs (cheaper for the first 100 units, then standard rates for higher consumption).
            </span>
          ) : (
            <span>
              <strong>Estimated Summary:</strong> Includes your units consumed, monthly meter service charge, and regulatory government electricity duty.
            </span>
          )}
        </div>
      </div>

      {/* Itemized Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-utility-border text-[11px] sm:text-xs font-semibold uppercase text-utility-secondary tracking-wider">
              <th scope="col" className="py-2.5 pr-3 sm:pr-4">Description</th>
              <th scope="col" className="hidden sm:table-cell py-2.5 px-4 text-center">Category</th>
              <th scope="col" className="py-2.5 pl-3 sm:pl-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-utility-border/60">
            <tr>
              <td className="py-2.5 sm:py-3 pr-3 sm:pr-4">
                <div className="font-medium text-utility-charcoal">Electricity Consumption</div>
                <div className="text-[11px] sm:text-xs text-utility-muted">Energy charges for {units} units (kWh) consumed</div>
              </td>
              <td className="hidden sm:table-cell py-2.5 sm:py-3 px-4 text-center text-xs text-utility-secondary">
                {category} Tariff
              </td>
              <td className="py-2.5 sm:py-3 pl-3 sm:pl-4 text-right font-mono font-medium text-utility-charcoal whitespace-nowrap">
                {formatCurrency(currentBreakdown.energyCharges)}
              </td>
            </tr>

            <tr>
              <td className="py-2.5 sm:py-3 pr-3 sm:pr-4">
                <div className="font-medium text-utility-charcoal">Fixed Meter Charges</div>
                <div className="text-[11px] sm:text-xs text-utility-muted">Standard monthly connection and meter fee</div>
              </td>
              <td className="hidden sm:table-cell py-2.5 sm:py-3 px-4 text-center text-xs text-utility-secondary">
                Fixed Fee
              </td>
              <td className="py-2.5 sm:py-3 pl-3 sm:pl-4 text-right font-mono font-medium text-utility-charcoal whitespace-nowrap">
                {formatCurrency(currentBreakdown.fixedCharges)}
              </td>
            </tr>

            <tr>
              <td className="py-2.5 sm:py-3 pr-3 sm:pr-4">
                <div className="font-medium text-utility-charcoal">Taxes &amp; Government Duty</div>
                <div className="text-[11px] sm:text-xs text-utility-muted">State electricity duty and regulatory surcharges</div>
              </td>
              <td className="hidden sm:table-cell py-2.5 sm:py-3 px-4 text-center text-xs text-utility-secondary">
                State Duty
              </td>
              <td className="py-2.5 sm:py-3 pl-3 sm:pl-4 text-right font-mono font-medium text-utility-charcoal whitespace-nowrap">
                {formatCurrency(currentBreakdown.otherCharges)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-utility-charcoal/20">
              <th scope="row" className="pt-3 sm:pt-4 pr-3 sm:pr-4 text-sm sm:text-base font-bold text-utility-charcoal">
                Estimated Total
              </th>
              <td className="hidden sm:table-cell pt-3 sm:pt-4 px-4 text-center text-xs text-utility-muted font-medium">
                Advance Estimate
              </td>
              <td className="pt-3 sm:pt-4 pl-3 sm:pl-4 text-right font-mono text-lg sm:text-xl font-extrabold text-utility-charcoal whitespace-nowrap">
                {formatCurrency(currentBreakdown.total)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-5 text-[11px] text-utility-muted flex items-center justify-between border-t border-utility-border/60 pt-3">
        <span>* Estimated advance figure to help you plan your monthly household budget.</span>
        <span className="font-mono text-utility-green font-semibold">Status: Normal</span>
      </div>
    </div>
  );
};

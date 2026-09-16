import React from 'react';
import type { PredictionResult } from '../../types/prediction';
import { formatCurrency, formatUnits } from '../../utils/formatters';
import { Eye, Printer, Trash2, CheckCircle2 } from 'lucide-react';

interface BillTableProps {
  bills: PredictionResult[];
  onViewBill: (bill: PredictionResult) => void;
  onPrintBill: (bill: PredictionResult) => void;
  onDeleteBill: (id: string) => void;
}

export const BillTable: React.FC<BillTableProps> = ({
  bills,
  onViewBill,
  onPrintBill,
  onDeleteBill,
}) => {
  if (bills.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-utility-border p-8 text-center">
        <p className="text-utility-secondary font-medium text-xs">No saved bills found.</p>
        <p className="text-[11px] text-utility-muted mt-0.5">
          Calculate an electricity bill estimate to see it listed here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-utility-border shadow-soft overflow-hidden">
      <div className="px-4 py-3 border-b border-utility-border/80 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-utility-charcoal">
          Bill Records ({bills.length})
        </h2>
        <span className="text-[11px] text-utility-muted">Sorted by most recent</span>
      </div>

      {/* Desktop Table View (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-cream-50/70 border-b border-utility-border text-utility-secondary font-semibold">
              <th scope="col" className="py-2.5 px-3">Bill No</th>
              <th scope="col" className="py-2.5 px-3">Date</th>
              <th scope="col" className="py-2.5 px-3">Month</th>
              <th scope="col" className="py-2.5 px-3 text-right">Units</th>
              <th scope="col" className="py-2.5 px-3 text-right">Estimated Bill</th>
              <th scope="col" className="py-2.5 px-3 text-center">Status</th>
              <th scope="col" className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-utility-border/60">
            {bills.map((bill) => (
              <tr key={bill.id} className="hover:bg-cream-50/50 transition-colors">
                <td className="py-2.5 px-3 font-mono font-bold text-utility-charcoal whitespace-nowrap">
                  {bill.billNumber}
                </td>
                <td className="py-2.5 px-3 text-utility-secondary whitespace-nowrap">
                  {bill.generatedAt}
                </td>
                <td className="py-2.5 px-3 font-medium text-utility-charcoal whitespace-nowrap">
                  {bill.billingMonth}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-medium text-utility-secondary whitespace-nowrap">
                  {formatUnits(bill.inputs?.units || 0)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-utility-charcoal whitespace-nowrap">
                  {formatCurrency(bill.predicted_bill)}
                </td>
                <td className="py-2.5 px-3 text-center whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-utility-amber-light text-utility-orange border border-utility-orange-border">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Estimated
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onViewBill(bill)}
                      title="View Bill Details"
                      className="p-1.5 rounded text-utility-secondary hover:text-utility-charcoal hover:bg-cream-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onPrintBill(bill)}
                      title="Print Bill"
                      className="p-1.5 rounded text-utility-orange hover:bg-utility-orange-light transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteBill(bill.id)}
                      title="Delete Record"
                      className="p-1.5 rounded text-utility-muted hover:text-utility-red hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View (< 640px) */}
      <div className="block sm:hidden divide-y divide-utility-border/60">
        {bills.map((bill) => (
          <div key={bill.id} className="p-3.5 space-y-2.5 hover:bg-cream-50/40 transition-colors">
            {/* Top Row: Bill No & Status */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-bold text-xs text-utility-charcoal">
                {bill.billNumber}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-utility-amber-light text-utility-orange border border-utility-orange-border">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Estimated
              </span>
            </div>

            {/* Middle Row: 3 Stats */}
            <div className="grid grid-cols-3 gap-2 bg-cream-50/70 p-2 rounded-lg border border-utility-border/60 text-xs">
              <div>
                <span className="text-[10px] text-utility-muted block uppercase font-medium">Month</span>
                <span className="font-medium text-utility-charcoal truncate block">
                  {bill.billingMonth}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-utility-muted block uppercase font-medium">Units</span>
                <span className="font-mono font-medium text-utility-secondary">
                  {formatUnits(bill.inputs?.units || 0)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-utility-muted block uppercase font-medium">Estimated</span>
                <span className="font-mono font-bold text-utility-charcoal">
                  {formatCurrency(bill.predicted_bill)}
                </span>
              </div>
            </div>

            {/* Bottom Row: Date & Action Buttons */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[11px] text-utility-muted">
                {bill.generatedAt}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onViewBill(bill)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white border border-utility-border text-utility-charcoal hover:bg-cream-100 text-[11px] font-medium"
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </button>
                <button
                  type="button"
                  onClick={() => onPrintBill(bill)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-utility-orange-light text-utility-orange border border-utility-orange-border hover:bg-utility-orange hover:text-white text-[11px] font-medium transition-colors"
                >
                  <Printer className="w-3 h-3" />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteBill(bill.id)}
                  title="Delete"
                  className="p-1 rounded text-utility-muted hover:text-utility-red hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

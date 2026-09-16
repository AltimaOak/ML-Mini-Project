import React from 'react';
import type { PredictionResult } from '../../types/prediction';
import { PrintableBill } from '../result/PrintableBill';
import { Button } from '../ui/Button';
import { X, Printer } from 'lucide-react';

interface BillModalProps {
  bill: PredictionResult | null;
  onClose: () => void;
  onPrint: (bill: PredictionResult) => void;
}

export const BillModal: React.FC<BillModalProps> = ({ bill, onClose, onPrint }) => {
  if (!bill) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-xl sm:rounded-2xl shadow-elevated border border-utility-border my-2 sm:my-8 flex flex-col max-h-[96vh] sm:max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-3.5 py-3 sm:px-6 sm:py-4 border-b border-utility-border shrink-0 gap-2">
          <div className="min-w-0 pr-2">
            <h2 className="text-sm sm:text-base font-bold text-utility-charcoal truncate">
              Bill: {bill.billNumber}
            </h2>
            <p className="text-[11px] sm:text-xs text-utility-muted truncate">
              {bill.billingMonth} &bull; {bill.generatedAt}
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              onClick={() => onPrint(bill)}
              className="px-2.5 py-1 text-xs"
            >
              <span className="hidden sm:inline">Print Bill</span>
              <span className="inline sm:hidden">Print</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-utility-secondary hover:text-utility-charcoal hover:bg-cream-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body with Printable Bill preview */}
        <div className="p-2 sm:p-5 overflow-y-auto bg-cream-50 flex-1">
          <PrintableBill bill={bill} />
        </div>
      </div>
    </div>
  );
};

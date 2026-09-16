import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { PredictionResult } from '../types/prediction';
import { getHistory } from '../services/historyService';
import { BillBreakdown } from '../components/result/BillBreakdown';
import { PrintableBill } from '../components/result/PrintableBill';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatUnits, formatPercentage } from '../utils/formatters';
import { Printer, Download, ArrowLeft, Eye, EyeOff, Hash, Calendar, TrendingUp, TrendingDown, Minus, CheckCircle2 } from 'lucide-react';

export const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Retrieve state passed from navigation or fallback to most recent history item
  const billResult: PredictionResult | null =
    (location.state as { billResult?: PredictionResult })?.billResult ||
    getHistory()[0] ||
    null;

  if (!billResult) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 text-center">
        <div className="bg-white p-6 rounded-xl border border-utility-border shadow-soft">
          <h2 className="text-lg font-bold text-utility-charcoal mb-1">No Bill Result Found</h2>
          <p className="text-xs text-utility-secondary mb-4">
            Please enter your electricity consumption details to generate an estimated bill.
          </p>
          <Button size="sm" variant="primary" onClick={() => navigate('/predict')}>
            Go to Prediction Form
          </Button>
        </div>
      </div>
    );
  }

  const { inputs, comparison, breakdown } = billResult;
  const changeFormatted = formatPercentage(comparison.percentChange);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const statementContent = `=================================================================
POWER ESTIMATE - ELECTRICITY BILL ESTIMATE
=================================================================
Bill Number      : ${billResult.billNumber}
Billing Month    : ${billResult.billingMonth}
Generated Date   : ${billResult.generatedAt}
Status           : Estimated Bill

CONSUMER DETAILS
-----------------------------------------------------------------
Consumer Name    : ${inputs.consumerName || 'Consumer'}
Consumer Category: ${inputs.consumerCategory}
Meter Number     : ${inputs.meterNumber || 'N/A'}
Household Members: ${inputs.people}

CONSUMPTION & USAGE
-----------------------------------------------------------------
Current Units    : ${inputs.units} kWh
Previous Units   : ${inputs.previous_units} kWh
Daily Run Hours  : ${inputs.daily_hours} hrs/day
Appliances       : ${inputs.appliances} units
Usage Variance   : ${comparison.diffUnits >= 0 ? '+' : ''}${comparison.diffUnits} kWh (${changeFormatted.text})

ITEMIZED CHARGES (ESTIMATED)
-----------------------------------------------------------------
Energy Charges   : ₹${breakdown.energyCharges}
Fixed Charges    : ₹${breakdown.fixedCharges}
Taxes / Duties   : ₹${breakdown.otherCharges}
-----------------------------------------------------------------
ESTIMATED TOTAL  : ₹${billResult.predicted_bill}
=================================================================
This document is an advance estimate for household budgeting.
=================================================================`;

    const blob = new Blob([statementContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${billResult.billNumber}_Estimated_Bill.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print flex items-center justify-between gap-2 mb-4 pb-3 border-b border-utility-border/60">
        <button
          type="button"
          onClick={() => navigate('/predict')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-utility-secondary hover:text-utility-charcoal transition-colors shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Edit Details</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleDownload}
            className="px-2.5 sm:px-3 text-xs"
          >
            <span className="hidden sm:inline">Download</span>
            <span className="inline sm:hidden">Save</span>
          </Button>

          <Button
            size="sm"
            variant="primary"
            leftIcon={<Printer className="w-3.5 h-3.5" />}
            onClick={handlePrint}
            className="px-2.5 sm:px-3 text-xs"
          >
            <span className="hidden sm:inline">Print Bill</span>
            <span className="inline sm:hidden">Print</span>
          </Button>
        </div>
      </div>

      {/* Screen Presentation (Hidden during print) */}
      <div className="no-print space-y-4">
        {/* Main 2-Column Summary & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Bill Amount & Usage Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Primary Amount Card */}
            <div className="bg-white rounded-xl border border-utility-border p-4 sm:p-5 shadow-soft">
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-utility-border/60">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-utility-amber-light text-utility-orange border border-utility-orange-border">
                  <CheckCircle2 className="w-3 h-3" />
                  Estimated Bill
                </span>
                <span className="text-xs font-mono font-bold text-utility-charcoal flex items-center gap-1">
                  <Hash className="w-3 h-3 text-utility-muted" />
                  {billResult.billNumber}
                </span>
              </div>

              <div className="text-xs font-semibold uppercase tracking-wider text-utility-muted">
                Estimated Amount Payable
              </div>
              <div className="mt-1 text-3xl sm:text-4xl font-extrabold font-mono text-utility-charcoal">
                {formatCurrency(billResult.predicted_bill)}
              </div>
              <div className="mt-1 text-xs text-utility-secondary flex items-center gap-1.5">
                <span>Billing Period:</span>
                <strong className="text-utility-charcoal">{billResult.billingMonth}</strong>
              </div>

              {/* Month-over-Month Comparison Pill */}
              <div className="mt-4 pt-3 border-t border-utility-border/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {changeFormatted.isNeutral ? (
                    <Minus className="w-4 h-4 text-utility-muted" />
                  ) : changeFormatted.isPositive ? (
                    <TrendingUp className="w-4 h-4 text-utility-red" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-utility-green" />
                  )}
                  <span className="text-utility-secondary">
                    {changeFormatted.isNeutral
                      ? 'Same as last month'
                      : changeFormatted.isPositive
                      ? 'Higher than last month'
                      : 'Lower than last month'}
                  </span>
                </div>
                <span
                  className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                    changeFormatted.isPositive
                      ? 'bg-utility-red-light text-utility-red'
                      : changeFormatted.isNeutral
                      ? 'bg-cream-100 text-utility-secondary'
                      : 'bg-utility-green-light text-utility-green'
                  }`}
                >
                  {changeFormatted.text}
                </span>
              </div>
            </div>

            {/* Quick Usage Stats Box */}
            <div className="bg-white rounded-xl border border-utility-border p-4 shadow-soft">
              <div className="text-xs font-bold uppercase tracking-wider text-utility-charcoal mb-2.5 pb-1 border-b border-utility-border/60">
                Usage Parameters
              </div>
              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-cream-50 p-2.5 rounded border border-utility-border/70">
                  <span className="text-[11px] text-utility-muted block">Current Units</span>
                  <span className="font-mono font-bold text-utility-charcoal">{formatUnits(inputs.units)}</span>
                </div>
                <div className="bg-cream-50 p-2.5 rounded border border-utility-border/70">
                  <span className="text-[11px] text-utility-muted block">Previous Units</span>
                  <span className="font-mono font-bold text-utility-secondary">{formatUnits(inputs.previous_units)}</span>
                </div>
                <div className="bg-cream-50 p-2.5 rounded border border-utility-border/70">
                  <span className="text-[11px] text-utility-muted block">Household Size</span>
                  <span className="font-medium text-utility-charcoal">{inputs.people} persons</span>
                </div>
                <div className="bg-cream-50 p-2.5 rounded border border-utility-border/70">
                  <span className="text-[11px] text-utility-muted block">Daily Usage</span>
                  <span className="font-medium text-utility-charcoal">{inputs.daily_hours} hrs/day</span>
                </div>
              </dl>
            </div>
          </div>

          {/* Right Column: Itemized Breakdown (7 cols) */}
          <div className="lg:col-span-7">
            <BillBreakdown
              breakdown={breakdown}
              units={inputs.units}
              category={inputs.consumerCategory}
              source={billResult.source}
            />
          </div>
        </div>

        {/* Printable Bill Inspection Toggle */}
        <div className="bg-white border border-utility-border rounded-xl p-3.5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs">
            <span className="font-bold text-utility-charcoal block">Official-Format Utility Document</span>
            <span className="text-utility-muted">Formatted for standard A4 black-and-white printing.</span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            leftIcon={showPrintPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            onClick={() => setShowPrintPreview(!showPrintPreview)}
            className="w-full sm:w-auto"
          >
            {showPrintPreview ? 'Hide Bill Preview' : 'Inspect Printable Bill'}
          </Button>
        </div>

        {/* On-Screen Printable Bill Preview */}
        {showPrintPreview && (
          <div className="p-2 sm:p-4 bg-cream-100/60 rounded-xl border border-utility-border shadow-soft overflow-x-auto">
            <PrintableBill bill={billResult} />
          </div>
        )}

        {/* Simple Bottom Links */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-utility-secondary pt-2">
          <span className="flex items-center gap-1 font-mono text-utility-muted">
            <Calendar className="w-3.5 h-3.5" />
            Generated on {billResult.generatedAt}
          </span>
          <button
            type="button"
            onClick={() => navigate('/predict')}
            className="text-utility-orange font-semibold hover:underline"
          >
            Calculate Another Bill &rarr;
          </button>
        </div>
      </div>

      {/* DEDICATED PRINT CONTAINER: Active ONLY during window.print() */}
      <div className="hidden print:block">
        <PrintableBill bill={billResult} />
      </div>
    </div>
  );
};

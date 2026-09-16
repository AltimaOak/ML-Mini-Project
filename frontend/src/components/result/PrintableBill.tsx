import React from 'react';
import type { PredictionResult } from '../../types/prediction';
import { formatCurrency, formatUnits } from '../../utils/formatters';
import { Zap } from 'lucide-react';

interface PrintableBillProps {
  bill: PredictionResult;
}

export const PrintableBill: React.FC<PrintableBillProps> = ({ bill }) => {
  const { inputs, breakdown } = bill;

  return (
    <div className="printable-bill-wrapper bg-white text-black font-sans border-2 border-neutral-900 rounded-none p-3.5 sm:p-6 md:p-8 max-w-3xl mx-auto shadow-sm print:p-0 print:border print:max-w-none">
      {/* Header */}
      <div className="border-b-2 border-neutral-900 pb-3 sm:pb-4 mb-4 sm:mb-5 flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-black stroke-[2.5]" />
            <span className="text-xl font-black tracking-wider uppercase font-mono">
              POWER ESTIMATE
            </span>
          </div>
          <div className="text-xs tracking-tight text-neutral-600 font-medium">
            Electricity Consumption &amp; Bill Estimate
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-xs sm:text-sm font-bold uppercase tracking-wide border border-neutral-900 px-2 py-0.5 inline-block">
            Estimated Electricity Bill
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5 sm:mt-1">
            Advance Customer Advisory
          </div>
        </div>
      </div>

      {/* Bill Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border border-neutral-800 p-2.5 sm:p-3 mb-4 sm:mb-5 text-xs bg-neutral-50 print:bg-transparent">
        <div>
          <span className="text-neutral-500 block text-[10px] uppercase font-bold">Bill Number</span>
          <span className="font-mono font-bold text-sm text-black">{bill.billNumber}</span>
        </div>
        <div>
          <span className="text-neutral-500 block text-[10px] uppercase font-bold">Billing Month</span>
          <span className="font-semibold text-black">{bill.billingMonth}</span>
        </div>
        <div>
          <span className="text-neutral-500 block text-[10px] uppercase font-bold">Generated On</span>
          <span className="text-black">{bill.generatedAt}</span>
        </div>
      </div>

      {/* Two-Column Consumer & Usage Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
        {/* Consumer Details */}
        <div className="border border-neutral-800 p-3.5">
          <div className="text-xs font-black uppercase tracking-wider border-b border-neutral-300 pb-1.5 mb-2.5">
            Consumer Details
          </div>
          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="py-1 text-neutral-600 w-1/2">Consumer Name:</td>
                <td className="py-1 font-semibold text-black">{inputs.consumerName || 'Registered Consumer'}</td>
              </tr>
              <tr>
                <td className="py-1 text-neutral-600">Category:</td>
                <td className="py-1 font-semibold text-black">{inputs.consumerCategory}</td>
              </tr>
              <tr>
                <td className="py-1 text-neutral-600">Meter Number:</td>
                <td className="py-1 font-mono text-black">{inputs.meterNumber || 'N/A'}</td>
              </tr>
              <tr>
                <td className="py-1 text-neutral-600">Number of Members:</td>
                <td className="py-1 text-black">{inputs.people}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Electricity Usage */}
        <div className="border border-neutral-800 p-3.5">
          <div className="text-xs font-black uppercase tracking-wider border-b border-neutral-300 pb-1.5 mb-2.5">
            Electricity Usage
          </div>
          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="py-1 text-neutral-600 w-1/2">Current Consumption:</td>
                <td className="py-1 font-mono font-bold text-black">{formatUnits(inputs.units)}</td>
              </tr>
              <tr>
                <td className="py-1 text-neutral-600">Previous Consumption:</td>
                <td className="py-1 font-mono text-black">{formatUnits(inputs.previous_units)}</td>
              </tr>
              <tr>
                <td className="py-1 text-neutral-600">Average Daily Usage:</td>
                <td className="py-1 text-black">{inputs.daily_hours} hrs/day</td>
              </tr>
              <tr>
                <td className="py-1 text-neutral-600">Number of Appliances:</td>
                <td className="py-1 text-black">{inputs.appliances}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Calculation Table */}
      <div className="mb-6">
        <div className="text-xs font-black uppercase tracking-wider border-b-2 border-neutral-900 pb-1 mb-2">
          Bill Calculation &amp; Charge Summary
        </div>
        <table className="w-full text-xs print-table border-collapse">
          <thead>
            <tr className="border-b border-neutral-900 text-left">
              <th className="py-2 font-bold text-black uppercase">Description</th>
              <th className="py-2 text-right font-bold text-black uppercase">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            <tr>
              <td className="py-2 text-neutral-800">
                Energy Charges ({inputs.units} kWh progressive consumption)
              </td>
              <td className="py-2 text-right font-mono font-semibold text-black">
                {formatCurrency(breakdown.energyCharges)}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-neutral-800">
                Fixed Charges (Meter rent &amp; standing service fee)
              </td>
              <td className="py-2 text-right font-mono font-semibold text-black">
                {formatCurrency(breakdown.fixedCharges)}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-neutral-800">
                Other Charges (State electricity duty &amp; regulatory surcharges)
              </td>
              <td className="py-2 text-right font-mono font-semibold text-black">
                {formatCurrency(breakdown.otherCharges)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-b-2 border-neutral-900">
              <th className="py-2.5 text-sm font-black uppercase text-left text-black">
                Estimated Total
              </th>
              <td className="py-2.5 text-right font-mono text-base font-black text-black">
                {formatCurrency(bill.predicted_bill)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Required Legal / Disclaimer Notice */}
      <div className="border border-neutral-800 p-3 text-[11px] text-center text-neutral-700 space-y-1">
        <p className="font-semibold text-black">
          This is an estimated bill generated using a machine learning prediction system.
        </p>
        <p className="text-neutral-600">
          This document is not an official electricity bill.
        </p>
        <div className="pt-2 text-[10px] text-neutral-500 border-t border-neutral-200 flex justify-between">
          <span>Generated by PowerEstimate</span>
          <span>Record ID: {bill.billNumber}</span>
        </div>
      </div>
    </div>
  );
};

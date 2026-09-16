import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import type { PredictionInput } from '../../types/prediction';
import { predictBill, validatePredictionInput } from '../../services/predictionService';
import { saveBill } from '../../services/historyService';

export const PredictionForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PredictionInput>({
    people: 1,
    appliances: 0,
    units: 0,
    previous_units: 0,
    daily_hours: 8,
    billingMonth: 'September 2026',
    consumerCategory: 'Residential',
    consumerName: '',
    meterNumber: '',
  });

  const [applianceCounts, setApplianceCounts] = useState<Record<string, number>>({
    ac: 0,
    refrigerator: 0,
    fans: 0,
    tv: 0,
    geyser: 0,
    washingMachine: 0,
    microwave: 0,
    computer: 0,
  });

  const applianceList = [
    { id: 'ac', name: 'Air Conditioner (AC)', desc: '1.5 Ton' },
    { id: 'refrigerator', name: 'Refrigerator', desc: 'Single/Double door' },
    { id: 'fans', name: 'Ceiling Fans', desc: 'Fans & coolers' },
    { id: 'tv', name: 'Television (TV)', desc: 'LED / Smart TV' },
    { id: 'geyser', name: 'Water Geyser', desc: 'Bathroom heater' },
    { id: 'washingMachine', name: 'Washing Machine', desc: 'Clothes washer' },
    { id: 'microwave', name: 'Microwave / Oven', desc: 'Kitchen oven' },
    { id: 'computer', name: 'Computer / PC', desc: 'Desktop / Laptop' },
  ];

  const handleApplianceChange = (id: string, delta: number) => {
    setApplianceCounts((prev) => {
      const current = prev[id] || 0;
      const updated = Math.max(0, current + delta);
      const next = { ...prev, [id]: updated };
      const total = Object.values(next).reduce((sum, val) => sum + val, 0);
      handleInputChange('appliances', Math.max(1, total));
      return next;
    });
  };

  const handleApplianceToggle = (id: string) => {
    setApplianceCounts((prev) => {
      const current = prev[id] || 0;
      const updated = current > 0 ? 0 : 1;
      const next = { ...prev, [id]: updated };
      const total = Object.values(next).reduce((sum, val) => sum + val, 0);
      handleInputChange('appliances', Math.max(1, total));
      return next;
    });
  };

  const [compareLastMonth, setCompareLastMonth] = useState(false);
  const [showOptionalDetails, setShowOptionalDetails] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const months = [
    { value: 'September 2026', label: 'September 2026' },
    { value: 'October 2026', label: 'October 2026' },
    { value: 'November 2026', label: 'November 2026' },
    { value: 'December 2026', label: 'December 2026' },
    { value: 'August 2026', label: 'August 2026' },
  ];

  const handleInputChange = (field: keyof PredictionInput, value: string | number) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'units' && !compareLastMonth) {
        next.previous_units = Math.max(0, (value as number) - 15);
      }
      return next;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    const validationErrors = validatePredictionInput(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const result = await predictBill(formData);
      saveBill(result);
      navigate('/result', { state: { billResult: result } });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to calculate bill prediction.';
      setGeneralError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-utility-border rounded-xl p-4 sm:p-6 md:p-7 shadow-sm">
      {generalError && (
        <div className="mb-4 sm:mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          {generalError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Responsive 2-column layout (stacks on mobile, 2 columns on tablet/desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 lg:gap-8 items-start">
          {/* Left Column (6 cols): Consumption & Household */}
          <div className="md:col-span-6 space-y-4 sm:space-y-5">
            {/* 1. Electricity Units */}
            <div>
              <label className="block text-xs font-bold text-utility-charcoal uppercase tracking-wider mb-1.5">
                Monthly Consumption (kWh)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  value={formData.units === 0 ? '' : formData.units}
                  onChange={(e) => handleInputChange('units', Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full text-base font-semibold text-utility-charcoal py-2.5 px-3 bg-white border border-utility-border rounded-lg focus:outline-none focus:border-utility-charcoal focus:ring-1 focus:ring-utility-charcoal"
                  placeholder="e.g. 320"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-utility-secondary pointer-events-none">
                  units
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-utility-muted mt-1">
                Units shown on your meter display or previous bill.
              </p>

              {errors.units && (
                <p className="text-xs text-utility-red mt-1">{errors.units}</p>
              )}

              {/* Optional Previous Month Comparison */}
              <div className="mt-2.5">
                {!compareLastMonth ? (
                  <button
                    type="button"
                    onClick={() => setCompareLastMonth(true)}
                    className="text-xs text-utility-orange hover:underline font-medium"
                  >
                    + Compare with last month's units
                  </button>
                ) : (
                  <div className="mt-2 p-2.5 sm:p-3 bg-cream-50 rounded-lg border border-utility-border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <span className="text-xs font-medium text-utility-charcoal block">Previous Month:</span>
                      <span className="text-[11px] text-utility-muted">For month-over-month comparison</span>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <input
                        type="number"
                        min={0}
                        value={formData.previous_units}
                        onChange={(e) => handleInputChange('previous_units', Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-20 text-center text-sm font-semibold py-1.5 px-2 bg-white border border-utility-border rounded-md focus:outline-none focus:border-utility-charcoal"
                      />
                      <span className="text-xs text-utility-muted">units</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCompareLastMonth(false);
                          handleInputChange('previous_units', Math.max(0, formData.units - 15));
                        }}
                        className="text-xs text-utility-muted hover:text-utility-red px-1 py-0.5"
                        title="Remove comparison"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Number of People */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-utility-charcoal uppercase tracking-wider">
                  Number of People
                </label>
                <span className="text-xs text-utility-secondary">
                  {formData.people} {formData.people === 1 ? 'person' : 'people'}
                </span>
              </div>

              <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => {
                  const isSelected = formData.people === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleInputChange('people', num)}
                      className={`py-2 sm:py-2 rounded-lg font-semibold text-xs min-w-0 transition-colors border cursor-pointer ${
                        isSelected
                          ? 'bg-utility-charcoal text-white border-utility-charcoal'
                          : 'bg-white text-utility-charcoal border-utility-border hover:bg-cream-50'
                      }`}
                    >
                      {num === 6 ? '6+' : num}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Daily Active Hours */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-utility-charcoal uppercase tracking-wider">
                  Daily Usage Hours
                </label>
                <span className="text-xs font-semibold text-utility-charcoal">
                  {formData.daily_hours} hrs / day
                </span>
              </div>

              <input
                type="range"
                min="2"
                max="24"
                step="1"
                value={formData.daily_hours}
                onChange={(e) => handleInputChange('daily_hours', parseInt(e.target.value, 10))}
                className="w-full accent-utility-charcoal cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] sm:text-[11px] text-utility-muted mt-1">
                <span>Light (2-4h)</span>
                <span>Normal (8h)</span>
                <span>Heavy (16h+)</span>
              </div>
            </div>

            {/* 4. Optional Details Accordion */}
            <div className="border-t border-utility-border pt-3.5">
              <button
                type="button"
                onClick={() => setShowOptionalDetails(!showOptionalDetails)}
                className="text-xs font-medium text-utility-secondary hover:text-utility-charcoal flex items-center gap-1 cursor-pointer py-1"
              >
                <span>{showOptionalDetails ? '− Hide consumer & billing details' : '+ Add consumer name & meter number (optional)'}</span>
                {showOptionalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showOptionalDetails && (
                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-medium text-utility-secondary mb-1">
                      Consumer Name
                    </label>
                    <input
                      type="text"
                      value={formData.consumerName}
                      onChange={(e) => handleInputChange('consumerName', e.target.value)}
                      placeholder="e.g. Full Name"
                      className="w-full text-xs py-2 px-3 bg-white border border-utility-border rounded-lg focus:outline-none focus:border-utility-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-utility-secondary mb-1">
                      Meter Number
                    </label>
                    <input
                      type="text"
                      value={formData.meterNumber}
                      onChange={(e) => handleInputChange('meterNumber', e.target.value)}
                      placeholder="e.g. MTR-XXXXXX"
                      className="w-full text-xs py-2 px-3 bg-white border border-utility-border rounded-lg focus:outline-none focus:border-utility-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-utility-secondary mb-1">
                      Billing Month
                    </label>
                    <select
                      value={formData.billingMonth}
                      onChange={(e) => handleInputChange('billingMonth', e.target.value)}
                      className="w-full text-xs py-2 px-3 bg-white border border-utility-border rounded-lg focus:outline-none focus:border-utility-charcoal"
                    >
                      {months.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-utility-secondary mb-1">
                      Connection Type
                    </label>
                    <select
                      value={formData.consumerCategory}
                      onChange={(e) => handleInputChange('consumerCategory', e.target.value as 'Residential' | 'Commercial')}
                      className="w-full text-xs py-2 px-3 bg-white border border-utility-border rounded-lg focus:outline-none focus:border-utility-charcoal"
                    >
                      <option value="Residential">Residential (Domestic)</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (6 cols): Major Appliances List */}
          <div className="md:col-span-6 space-y-2">
            <div className="flex justify-between items-center mb-1.5">
              <div>
                <label className="text-xs font-bold text-utility-charcoal uppercase tracking-wider block">
                  Major Appliances
                </label>
                <span className="text-[11px] text-utility-muted">
                  Select household appliances in use
                </span>
              </div>
              <span className="text-xs font-medium text-utility-secondary bg-cream-100 px-2.5 py-1 rounded-full border border-utility-border">
                {formData.appliances} total items
              </span>
            </div>

            <div className="space-y-1.5">
              {applianceList.map((app) => {
                const count = applianceCounts[app.id] || 0;
                const isChecked = count > 0;

                return (
                  <div
                    key={app.id}
                    className={`flex items-center justify-between p-2 sm:p-2 rounded-lg border transition-colors ${
                      isChecked
                        ? 'bg-white border-utility-charcoal/40 shadow-xs'
                        : 'bg-cream-50/50 border-utility-border hover:bg-cream-50'
                    }`}
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer select-none flex-1 min-w-0 py-0.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleApplianceToggle(app.id)}
                        className="w-4 h-4 rounded border-utility-border text-utility-charcoal focus:ring-utility-charcoal cursor-pointer shrink-0"
                      />
                      <div className="truncate pr-1">
                        <span className={`text-xs font-medium ${isChecked ? 'text-utility-charcoal' : 'text-utility-secondary'}`}>
                          {app.name}
                        </span>
                        <span className="text-[10px] text-utility-muted ml-1.5 hidden sm:inline">
                          ({app.desc})
                        </span>
                      </div>
                    </label>

                    {isChecked && (
                      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pl-1">
                        <button
                          type="button"
                          onClick={() => handleApplianceChange(app.id, -1)}
                          className="w-7 h-7 sm:w-6 sm:h-6 rounded-md bg-cream-100 hover:bg-cream-200 active:bg-cream-300 text-utility-charcoal text-xs font-bold flex items-center justify-center border border-utility-border cursor-pointer transition-colors"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold text-utility-charcoal w-5 text-center font-mono">
                          {count}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleApplianceChange(app.id, 1)}
                          className="w-7 h-7 sm:w-6 sm:h-6 rounded-md bg-cream-100 hover:bg-cream-200 active:bg-cream-300 text-utility-charcoal text-xs font-bold flex items-center justify-center border border-utility-border cursor-pointer transition-colors"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Explanatory note + Submit button */}
        <div className="mt-5 sm:mt-6 pt-4 border-t border-utility-border flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <span className="text-[11px] sm:text-xs text-utility-muted text-center sm:text-left">
            Calculated according to official domestic tariff slabs &amp; standard utility load estimates.
          </span>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto min-w-[200px] py-3 sm:py-2.5 px-6 bg-utility-orange hover:bg-utility-orange-hover active:bg-utility-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-75"
          >
            {isLoading ? 'Calculating...' : 'Calculate Bill'}
          </button>
        </div>
      </form>
    </div>
  );
};

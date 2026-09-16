import React from 'react';
import { PredictionForm } from '../components/predict/PredictionForm';

export const PredictPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-5 sm:py-10">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-utility-charcoal tracking-tight">
          Electricity Bill Estimator
        </h1>
        <p className="text-xs sm:text-sm text-utility-secondary mt-1">
          Enter your monthly electricity consumption and appliances to calculate an estimated bill.
        </p>
      </div>

      <PredictionForm />
    </div>
  );
};

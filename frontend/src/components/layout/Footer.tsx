import React from 'react';
import { Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="no-print mt-auto border-t border-utility-border bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-utility-secondary">
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 fill-utility-orange stroke-utility-orange text-utility-orange" />
            <span className="text-base font-bold text-utility-charcoal tracking-tight">
              PowerEstimate
            </span>
          </div>

          {/* Copyright */}
          <div className="text-xs text-utility-muted">
            &copy; 2026 PowerEstimate. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';

export interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    text: string;
    isPositive?: boolean;
    isNegative?: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
}) => {
  return (
    <div className="bg-white border border-utility-border rounded-xl p-3 sm:p-4 shadow-soft hover:border-utility-borderHover transition-colors">
      <div className="flex items-center justify-between gap-1">
        <span className="text-[11px] sm:text-xs font-medium text-utility-secondary truncate">{title}</span>
        {icon && (
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-cream-100 flex items-center justify-center text-utility-secondary shrink-0">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
        <span className="text-base sm:text-xl font-bold tracking-tight text-utility-charcoal truncate">
          {value}
        </span>
        {trend && (
          <span
            className={`text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded ${
              trend.isPositive
                ? 'bg-utility-green-light text-utility-green'
                : trend.isNegative
                ? 'bg-utility-red-light text-utility-red'
                : 'bg-cream-100 text-utility-secondary'
            }`}
          >
            {trend.text}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-0.5 text-[10px] sm:text-xs text-utility-muted truncate">{subtitle}</p>
      )}
    </div>
  );
};

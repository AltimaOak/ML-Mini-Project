export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatUnits(units: number): string {
  return `${units.toLocaleString('en-IN')} kWh`;
}

export function formatPercentage(percent: number): { text: string; isPositive: boolean; isNeutral: boolean } {
  if (Math.abs(percent) < 0.05) {
    return { text: '0.0%', isPositive: false, isNeutral: true };
  }
  const formatted = Math.abs(percent).toFixed(1);
  if (percent > 0) {
    return { text: `+${formatted}%`, isPositive: true, isNeutral: false };
  }
  return { text: `-${formatted}%`, isPositive: false, isNeutral: false };
}

export function formatDate(dateString?: string): string {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatLongDate(dateString?: string): string {
  const date = dateString ? new Date(dateString) : new Date();
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

import { Currency } from '../types';

export function formatCurrency(
  amount: number,
  currency: Currency,
  decimals: number = 2
): string {
  if (isNaN(amount) || !isFinite(amount)) return `${currency === 'USD' ? '$' : 'Bs'} 0.00`;
  const symbol = currency === 'USD' ? '$' : 'Bs';
  const formattedNumber = amount.toLocaleString('es-ES', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${symbol} ${formattedNumber}`;
}

export function formatConvertedCurrency(
  amount: number,
  currentCurrency: Currency,
  exchangeRate: number
): string {
  if (isNaN(amount) || !isFinite(amount)) return '';
  const rate = exchangeRate > 0 ? exchangeRate : 6.96;
  if (currentCurrency === 'USD') {
    const bobAmount = amount * rate;
    return `≈ Bs ${bobAmount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    const usdAmount = amount / rate;
    return `≈ $ ${usdAmount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

export function formatPercent(value: number, decimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0.00%';
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(decimals)}%`;
}

export function formatDays(days: number): string {
  return `${Math.round(days)} ${Math.round(days) === 1 ? 'día' : 'días'}`;
}

export function formatMonths(months: number): string {
  return `${months.toFixed(1)} ${months === 1 ? 'mes' : 'meses'}`;
}

export type CurrencyCode = 'PLN' | 'USD' | 'EUR';

export function formatAmount(amount: number, currency: CurrencyCode = 'PLN'): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(amount);
}

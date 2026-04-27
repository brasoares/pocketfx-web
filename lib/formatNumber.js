export function formatNumber(value, locale, options = {}) {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

export function formatCurrency(value, locale, currency = "USD") {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
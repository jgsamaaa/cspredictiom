export function formatMatchTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatShortTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatPercent(value: number, digits = 0) {
  return `${value.toFixed(digits)}%`;
}

export function formatCurrency(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}$${value.toFixed(2)}`;
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

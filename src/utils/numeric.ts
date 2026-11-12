/** Rounds num/den to the nearest integer, halves up. Positive integers only; exact below 2^53. */
export function roundDivHalfUp(num: number, den: number): number {
  const a = 2 * num + den;
  const b = 2 * den;
  return (a - (a % b)) / b;
}

/** Converts a value with at most one decimal place to integer tenths; null if it has more. */
export function toTenths(value: number): number | null {
  const t = Math.round(value * 10);
  return Math.abs(value * 10 - t) < 1e-9 ? t : null;
}

/** Percent to integer hundredths of a percent (72.5 -> 7250). */
export function toHundredths(pct: number): number {
  return Math.round(pct * 100);
}

export function fromHundredths(h: number): number {
  return h / 100;
}

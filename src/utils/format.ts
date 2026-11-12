import type { ZoneRow } from '../types';

/** Formats a number with up to maxDecimals decimals, trimming trailing zeros. */
export function formatNumber(n: number, maxDecimals = 3): string {
  const s = n.toFixed(maxDecimals);
  return s.includes('.') ? s.replace(/\.?0+$/, '') : s;
}

/** "139–157 bpm", "≤ 138 bpm", "162+ bpm". */
export function formatBpmRange(row: Pick<ZoneRow, 'lowerBpm' | 'upperBpm'>): string {
  const { lowerBpm: lo, upperBpm: hi } = row;
  if (lo !== null && hi !== null) return `${lo}–${hi} bpm`;
  if (lo === null && hi !== null) return `≤ ${hi} bpm`;
  if (lo !== null && hi === null) return `${lo}+ bpm`;
  return '—';
}

/** "73% to under 83%", "92–100%", "below 73%", "100% and above". */
export function formatPctRange(row: Pick<ZoneRow, 'lowerPct' | 'upperPct' | 'upperInclusive'>): string {
  const { lowerPct: lo, upperPct: hi, upperInclusive } = row;
  if (lo !== null && hi !== null) {
    return upperInclusive ? `${formatNumber(lo)}–${formatNumber(hi)}%` : `${formatNumber(lo)}% to under ${formatNumber(hi)}%`;
  }
  if (lo === null && hi !== null) return `below ${formatNumber(hi)}%`;
  if (lo !== null && hi === null) return `${formatNumber(lo)}% and above`;
  return '—';
}

/** Parses a text input: '' -> null, otherwise a number (NaN if not numeric). */
export function parseNumberInput(text: string): number | null {
  const t = text.trim();
  if (t === '') return null;
  return Number(t);
}

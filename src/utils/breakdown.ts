import type { BoundaryDetail, ZoneCalculation } from '../types';
import { formatNumber } from './format';

function detail(calc: ZoneCalculation, key: string): string {
  const v = calc.anchor.details[key];
  return typeof v === 'number' ? formatNumber(v) : String(v);
}

/** Shows the user's own numbers substituted into the formula for one boundary. */
export function describeSubstitution(calc: ZoneCalculation, b: BoundaryDetail): string {
  const pct = `${formatNumber(b.pct)}%`;
  switch (calc.anchor.kind) {
    case 'hrmax':
      return `${detail(calc, 'HRmax')} × ${pct}`;
    case 'hrr':
      return `${detail(calc, 'Resting HR')} + (${detail(calc, 'HRR')} × ${pct})`;
    case 'fthr':
      return `${detail(calc, 'Estimated FTHR')} × ${pct}`;
  }
}

export const ROUNDING_RULES = [
  'Calculations keep full precision. Each boundary is rounded once, to the nearest whole bpm, with exact halves rounded up.',
  'A zone runs from its own rounded lower boundary up to one bpm below the next zone’s boundary, so zones never overlap or leave gaps.',
  'The last zone includes its top boundary when the model has one (such as 100%).',
];

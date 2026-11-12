import type { Validated, ZoneCalculation } from '../types';

export function must<T>(r: Validated<T>): T {
  if (!r.ok) throw new Error('Expected ok, got errors: ' + JSON.stringify(r.errors));
  return r.value;
}

export function errorCodes<T>(r: Validated<T>): string[] {
  return r.ok ? [] : r.errors.map((e) => e.code);
}

export function warningCodes<T>(r: Validated<T>): string[] {
  return r.warnings.map((w) => w.code);
}

/** [lowerBpm, upperBpm] per zone. null = open end. */
export function ranges(calc: ZoneCalculation): (number | null)[][] {
  return calc.zones.map((z) => [z.lowerBpm, z.upperBpm]);
}

/** True when each zone starts exactly one bpm after the previous zone ends. */
export function isContiguous(calc: ZoneCalculation): boolean {
  for (let i = 0; i < calc.zones.length - 1; i++) {
    const up = calc.zones[i].upperBpm;
    const next = calc.zones[i + 1].lowerBpm;
    if (up === null || next === null) return false;
    if (next !== up + 1) return false;
  }
  return true;
}

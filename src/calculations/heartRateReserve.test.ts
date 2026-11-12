import { describe, expect, it } from 'vitest';
import { calculateHrrZones, heartRateReserveTenths } from './heartRateReserve';
import { errorCodes, isContiguous, must, ranges, warningCodes } from './testHelpers';

describe('heart rate reserve', () => {
  it('HRR = HRmax - RHR', () => {
    expect(heartRateReserveTenths(1900, 500)).toBe(1400);
  });

  it('Karvonen zones for HRmax 190, RHR 50 match the hand-verified example', () => {
    const calc = must(calculateHrrZones({ hrmax: { source: 'measured', measured: 190 }, rhr: 50 }));
    expect(calc.anchor.value).toBe(140);
    expect(calc.boundaries.map((b) => b.bpm)).toEqual([120, 134, 148, 162, 176, 190]);
    expect(ranges(calc)).toEqual([[120, 133], [134, 147], [148, 161], [162, 175], [176, 190]]);
    expect(calc.belowZone1MaxBpm).toBe(119);
    expect(calc.status).toBe('provisional');
  });

  it('target HR = RHR + HRR x percentage (70% -> 148)', () => {
    const calc = must(calculateHrrZones({ hrmax: { source: 'measured', measured: 190 }, rhr: 50 }));
    expect(calc.boundaries.find((b) => b.pct === 70)?.bpm).toBe(148);
  });

  it('works with an estimated HRmax and keeps its precision', () => {
    const calc = must(calculateHrrZones({ hrmax: { source: 'tanaka', age: 33 }, rhr: 55 }));
    expect(calc.anchor.details['HRmax']).toBe(184.9);
    expect(calc.anchor.value).toBeCloseTo(129.9, 6);
    expect(isContiguous(calc)).toBe(true);
  });

  it('requires resting HR below HRmax', () => {
    expect(errorCodes(calculateHrrZones({ hrmax: { source: 'measured', measured: 180 }, rhr: 180 }))).toEqual([
      'rhr_not_below_hrmax',
    ]);
    expect(errorCodes(calculateHrrZones({ hrmax: { source: 'measured', measured: 180 }, rhr: 190 }))).toEqual([
      'rhr_not_below_hrmax',
    ]);
  });

  it('reports every missing or invalid input at once', () => {
    expect(errorCodes(calculateHrrZones({ hrmax: { source: 'measured' }, rhr: null }))).toEqual(['missing', 'missing']);
    expect(errorCodes(calculateHrrZones({ hrmax: { source: 'measured', measured: 190 }, rhr: 0 }))).toEqual([
      'not_positive',
    ]);
  });

  it('warns on unusual resting HR and tiny reserve', () => {
    const lowRhr = calculateHrrZones({ hrmax: { source: 'measured', measured: 190 }, rhr: 28 });
    expect(lowRhr.ok).toBe(true);
    expect(warningCodes(lowRhr)).toEqual(['unusual_value']);
    const tiny = calculateHrrZones({ hrmax: { source: 'measured', measured: 130 }, rhr: 95 });
    expect(warningCodes(tiny)).toEqual(['small_reserve']);
    // A resting HR of 120 is itself unusual, and a 30 bpm reserve is small: both warnings
    const both = calculateHrrZones({ hrmax: { source: 'measured', measured: 150 }, rhr: 120 });
    expect(warningCodes(both)).toEqual(['unusual_value', 'small_reserve']);
  });

  it('refuses to produce a zone narrower than 1 bpm', () => {
    const r = calculateHrrZones({ hrmax: { source: 'measured', measured: 100 }, rhr: 99 });
    expect(errorCodes(r)).toEqual(['zone_too_narrow']);
  });
});

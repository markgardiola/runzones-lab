import { describe, expect, it } from 'vitest';
import { calculateMhrZones, resolveHRmax, tanakaHRmaxTenths, traditionalHRmaxTenths } from './maximumHR';
import { errorCodes, must, ranges, warningCodes } from './testHelpers';

describe('HRmax estimation', () => {
  it('traditional 220 - age', () => {
    expect(traditionalHRmaxTenths(40)).toBe(1800);
    expect(traditionalHRmaxTenths(20)).toBe(2000);
    expect(traditionalHRmaxTenths(70)).toBe(1500);
  });

  it('Tanaka 208 - 0.7 x age, kept exact to 0.1 bpm', () => {
    expect(tanakaHRmaxTenths(40)).toBe(1800); // equals 220 - age at 40
    expect(tanakaHRmaxTenths(20)).toBe(1940);
    expect(tanakaHRmaxTenths(70)).toBe(1590);
    expect(tanakaHRmaxTenths(33)).toBe(1849); // 184.9, not rounded
  });

  it('measured value takes the measured path and is labelled as measured', () => {
    const r = must(resolveHRmax({ source: 'measured', measured: 191, age: 30 }));
    expect(r.bpm).toBe(191);
    expect(r.estimated).toBe(false);
    expect(r.sourceLabel).toContain('Measured');
  });

  it('estimates are labelled as estimates', () => {
    const t = must(resolveHRmax({ source: 'tanaka', age: 33 }));
    expect(t.estimated).toBe(true);
    expect(t.bpm).toBe(184.9);
    expect(must(resolveHRmax({ source: 'traditional', age: 33 })).bpm).toBe(187);
  });

  it('never substitutes a missing input', () => {
    expect(errorCodes(resolveHRmax({ source: 'measured' }))).toEqual(['missing']);
    expect(errorCodes(resolveHRmax({ source: 'measured', measured: null, age: 30 }))).toEqual(['missing']);
    expect(errorCodes(resolveHRmax({ source: 'tanaka' }))).toEqual(['missing']);
    expect(errorCodes(resolveHRmax({ source: 'tanaka', measured: 190 }))).toEqual(['missing']);
  });

  it('rejects invalid ages and heart rates', () => {
    expect(errorCodes(resolveHRmax({ source: 'tanaka', age: 0 }))).toEqual(['out_of_range']);
    expect(errorCodes(resolveHRmax({ source: 'tanaka', age: 121 }))).toEqual(['out_of_range']);
    expect(errorCodes(resolveHRmax({ source: 'tanaka', age: 40.5 }))).toEqual(['not_integer']);
    expect(errorCodes(resolveHRmax({ source: 'tanaka', age: NaN }))).toEqual(['missing']);
    expect(errorCodes(resolveHRmax({ source: 'measured', measured: 0 }))).toEqual(['not_positive']);
    expect(errorCodes(resolveHRmax({ source: 'measured', measured: -5 }))).toEqual(['not_positive']);
    expect(errorCodes(resolveHRmax({ source: 'measured', measured: 301 }))).toEqual(['out_of_range']);
    expect(errorCodes(resolveHRmax({ source: 'measured', measured: 185.55 }))).toEqual(['too_precise']);
    expect(errorCodes(resolveHRmax({ source: 'measured', measured: Infinity }))).toEqual(['not_finite']);
  });

  it('warns, without blocking, on unusual values', () => {
    const low = resolveHRmax({ source: 'measured', measured: 110 });
    expect(low.ok).toBe(true);
    expect(warningCodes(low)).toEqual(['unusual_value']);
    const old = resolveHRmax({ source: 'tanaka', age: 85 });
    expect(old.ok).toBe(true);
    expect(warningCodes(old)).toEqual(['outside_studied_range']);
  });
});

describe('%MHR zones (Friel MHR column, edges 73/83/88/92/100)', () => {
  it('HRmax 190 matches the hand-verified example', () => {
    const calc = must(calculateMhrZones({ hrmax: { source: 'measured', measured: 190 } }));
    expect(ranges(calc)).toEqual([[null, 138], [139, 157], [158, 166], [167, 174], [175, 190]]);
    expect(calc.boundaries.map((b) => b.bpm)).toEqual([139, 158, 167, 175, 190]);
    expect(calc.status).toBe('confirmed');
    expect(calc.isCustom).toBe(false);
  });

  it('Tanaka estimate at age 40 (HRmax 180)', () => {
    const calc = must(calculateMhrZones({ hrmax: { source: 'tanaka', age: 40 } }));
    expect(ranges(calc)).toEqual([[null, 130], [131, 148], [149, 157], [158, 165], [166, 180]]);
    expect(calc.anchor.details['HRmax source']).toContain('Tanaka');
  });

  it('rounds exact halves up (150 x 73% = 109.5 -> 110)', () => {
    const calc = must(calculateMhrZones({ hrmax: { source: 'measured', measured: 150 } }));
    expect(calc.boundaries[0].bpm).toBe(110);
    expect(calc.boundaries[0].exactBpm).toBe(109.5);
  });

  it('final zone includes HRmax itself', () => {
    const calc = must(calculateMhrZones({ hrmax: { source: 'measured', measured: 187.5 } }));
    expect(calc.zones[4].upperBpm).toBe(188); // 187.5 rounds half up
    expect(calc.zones[4].upperInclusive).toBe(true);
  });
});

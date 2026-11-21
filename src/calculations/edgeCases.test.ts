import { describe, expect, it } from 'vitest';
import { compareMethods } from './comparison';
import { calculateHrrZones } from './heartRateReserve';
import { calculateMhrZones, tanakaHRmaxTenths, traditionalHRmaxTenths } from './maximumHR';
import { calculateThresholdZones } from './thresholdHR';
import { errorCodes, isContiguous, must, ranges, warningCodes } from './testHelpers';

// Expected values below were computed independently with exact decimal arithmetic (not by this program).

describe('extreme but valid inputs', () => {
  it('HRmax 300 bpm (the upper limit) gives contiguous zones and a warning, not an error', () => {
    const r = calculateMhrZones({ hrmax: { source: 'measured', measured: 300 } });
    expect(warningCodes(r)).toEqual(['unusual_value']);
    expect(ranges(must(r))).toEqual([[null, 218], [219, 248], [249, 263], [264, 275], [276, 300]]);
  });

  it('%HRR at the extremes (HRmax 300, resting 30)', () => {
    const calc = must(calculateHrrZones({ hrmax: { source: 'measured', measured: 300 }, rhr: 30 }));
    expect(calc.boundaries.map((b) => b.bpm)).toEqual([165, 192, 219, 246, 273, 300]);
    expect(isContiguous(calc)).toBe(true);
  });

  it('FTHR from a 20-minute average of 300 bpm', () => {
    const calc = must(calculateThresholdZones({ avg20: 300 }));
    expect(calc.anchor.value).toBe(285);
    expect(ranges(calc)).toEqual([[null, 221], [222, 247], [248, 267], [268, 284], [285, null]]);
    expect(calc.zones[4].subBands?.map((s) => [s.lowerBpm, s.upperBpm])).toEqual([[285, 293], [294, null]]);
  });

  it('Tanaka and 220 − age at the age extremes', () => {
    expect(tanakaHRmaxTenths(1)).toBe(2073);
    expect(tanakaHRmaxTenths(120)).toBe(1240);
    expect(traditionalHRmaxTenths(120)).toBe(1000);
    const old = calculateMhrZones({ hrmax: { source: 'tanaka', age: 120 } });
    expect(warningCodes(old)).toContain('outside_studied_range');
    expect(ranges(must(old))).toEqual([[null, 90], [91, 102], [103, 108], [109, 113], [114, 124]]);
  });

  it('the age warning starts just outside 18 to 81', () => {
    const codes = (age: number) => warningCodes(calculateMhrZones({ hrmax: { source: 'tanaka', age } }));
    expect(codes(18)).toEqual([]);
    expect(codes(81)).toEqual([]);
    expect(codes(17)).toEqual(['outside_studied_range']);
    expect(codes(82)).toEqual(['outside_studied_range']);
  });
});

describe('inputs that cannot give meaningful zones are rejected clearly', () => {
  it('a heart rate reserve of 0.1 bpm makes a zone narrower than 1 bpm', () => {
    const r = calculateHrrZones({ hrmax: { source: 'measured', measured: 300 }, rhr: 299.9 });
    expect(errorCodes(r)).toEqual(['zone_too_narrow']);
  });

  it('a tiny HRmax or FTHR cannot be split into five zones', () => {
    expect(errorCodes(calculateMhrZones({ hrmax: { source: 'measured', measured: 1 } }))).toEqual(['zone_too_narrow']);
    expect(errorCodes(calculateThresholdZones({ avg20: 0.1 }))).toEqual(['zone_too_narrow']);
  });

  it('zero, negative, NaN and infinite heart rates are errors, never silently corrected', () => {
    for (const v of [0, -1, -0.1]) {
      expect(errorCodes(calculateThresholdZones({ avg20: v }))).toEqual(['not_positive']);
      expect(errorCodes(calculateHrrZones({ hrmax: { source: 'measured', measured: 190 }, rhr: v }))).toEqual(['not_positive']);
    }
    expect(errorCodes(calculateThresholdZones({ avg20: NaN }))).toEqual(['missing']);
    expect(errorCodes(calculateThresholdZones({ avg20: Infinity }))).toEqual(['not_finite']);
  });

  it('resting heart rate equal to HRmax is rejected', () => {
    expect(errorCodes(calculateHrrZones({ hrmax: { source: 'measured', measured: 150 }, rhr: 150 }))).toEqual(['rhr_not_below_hrmax']);
  });

  it('custom zone percentages with more than two decimals are rejected by the engine', () => {
    const r = calculateMhrZones({ hrmax: { source: 'measured', measured: 190 }, edges: [null, 73, 83.555, 88, 92, 100] });
    expect(errorCodes(r)).toEqual(['too_precise']);
  });
});

describe('an irrelevant invalid input does not break a method that does not use it', () => {
  it('a measured HRmax ignores a nonsense age, and the 20-minute test ignores everything else', () => {
    const r = compareMethods({ age: -5, measuredHrmax: 190, hrmaxSource: 'measured', rhr: 50, avg20: 170 });
    expect(r.outcomes.mhr.state).toBe('complete');
    expect(r.outcomes.hrr.state).toBe('complete');
    expect(r.outcomes.threshold.state).toBe('complete');
  });
});

describe('properties that must hold for every plausible input', () => {
  it('%MHR: raising HRmax by 0.1 bpm never lowers a boundary and never moves it by more than 1 bpm', () => {
    let prev: number[] | null = null;
    for (let t = 1000; t <= 3000; t += 1) {
      const calc = must(calculateMhrZones({ hrmax: { source: 'measured', measured: t / 10 } }));
      const now = calc.boundaries.map((b) => b.bpm);
      if (prev) now.forEach((v, i) => {
        expect(v >= prev![i] && v - prev![i] <= 1).toBe(true);
      });
      prev = now;
    }
  });

  it('%HRR: zones are contiguous, start at the 50% point and end at HRmax across a wide grid', () => {
    for (let hrmax = 100; hrmax <= 300; hrmax += 7) {
      for (let rhr = 30; rhr <= hrmax - 40; rhr += 11) {
        const calc = must(calculateHrrZones({ hrmax: { source: 'measured', measured: hrmax }, rhr }));
        expect(isContiguous(calc)).toBe(true);
        expect(calc.zones[4].upperBpm).toBe(hrmax);
        expect(calc.zones[0].lowerBpm).toBe(calc.boundaries[0].bpm);
        for (const z of calc.zones) expect((z.upperBpm as number) >= (z.lowerBpm as number)).toBe(true);
      }
    }
  });

  it('every zone boundary lies between 0 and the anchor (HRmax or the top of the range)', () => {
    for (let hr = 100; hr <= 300; hr += 3) {
      const calc = must(calculateMhrZones({ hrmax: { source: 'measured', measured: hr } }));
      for (const b of calc.boundaries) expect(b.bpm > 0 && b.bpm <= hr).toBe(true);
    }
  });
});

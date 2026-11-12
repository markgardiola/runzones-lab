import { describe, expect, it } from 'vitest';
import { ZONE_MODELS } from '../data/zoneModels';
import { calculateHrrZones } from './heartRateReserve';
import { calculateMhrZones } from './maximumHR';
import { validateEdges } from './zoneCalculator';
import { errorCodes, isContiguous, must } from './testHelpers';

describe('zone presets', () => {
  it('every preset has six edges, strictly increasing where defined', () => {
    for (const model of Object.values(ZONE_MODELS)) {
      expect(model.edges.length).toBe(6);
      expect(validateEdges(model, model.edges)).toEqual([]);
    }
  });

  it('every preset names its sources and status', () => {
    for (const model of Object.values(ZONE_MODELS)) {
      expect(model.sourceIds.length > 0).toBe(true);
      expect(['confirmed', 'provisional'].includes(model.status)).toBe(true);
    }
    expect(ZONE_MODELS.hrr.status).toBe('provisional');
    expect(ZONE_MODELS.mhr.status).toBe('confirmed');
    expect(ZONE_MODELS.threshold.status).toBe('confirmed');
  });
});

describe('boundary conventions', () => {
  it('%MHR zones never overlap and leave no gap, for every HRmax from 120 to 230', () => {
    for (let hr = 120; hr <= 230; hr++) {
      const calc = must(calculateMhrZones({ hrmax: { source: 'measured', measured: hr } }));
      const z = calc.zones;
      expect(z[0].lowerBpm).toBeNull();
      expect(z[4].upperBpm).toBe(hr);
      expect(isContiguous(calc)).toBe(true);
    }
  });

  it('%HRR zones are contiguous across many HRmax/RHR combinations', () => {
    for (let hrmax = 150; hrmax <= 220; hrmax += 5) {
      for (let rhr = 35; rhr <= 90; rhr += 5) {
        const calc = must(calculateHrrZones({ hrmax: { source: 'measured', measured: hrmax }, rhr }));
        expect(isContiguous(calc)).toBe(true);
        expect(calc.zones[0].lowerBpm).toBe(calc.boundaries[0].bpm);
        expect(calc.zones[4].upperBpm).toBe(hrmax);
      }
    }
  });
});

describe('custom edge validation', () => {
  const m = ZONE_MODELS.mhr;
  it('rejects decreasing, out-of-range and re-shaped edges', () => {
    expect(validateEdges(m, [null, 73, 70, 88, 92, 100]).map((e) => e.code)).toEqual(['not_increasing']);
    expect(validateEdges(m, [null, 73, 83, 88, 92, 101]).map((e) => e.code)).toEqual(['out_of_range']);
    expect(validateEdges(m, [50, 73, 83, 88, 92, 100]).map((e) => e.code)).toEqual(['edge_shape']);
    expect(validateEdges(m, [null, 73, 83, 88, 92]).map((e) => e.code)).toEqual(['edge_count']);
  });

  it('calculation refuses invalid custom edges', () => {
    const r = calculateMhrZones({
      hrmax: { source: 'measured', measured: 190 },
      edges: [null, 73, 70, 88, 92, 100],
    });
    expect(errorCodes(r)).toEqual(['not_increasing']);
  });

  it('a custom edit is labelled custom; the preset itself is not', () => {
    const hr = { source: 'measured' as const, measured: 190 };
    const custom = must(calculateMhrZones({ hrmax: hr, edges: [null, 73, 85, 88, 92, 100] }));
    expect(custom.status).toBe('custom');
    expect(custom.isCustom).toBe(true);
    const same = must(calculateMhrZones({ hrmax: hr, edges: [null, 73, 83, 88, 92, 100] }));
    expect(same.status).toBe('confirmed');
    expect(same.isCustom).toBe(false);
  });

  it('decimal percentages work (83.5% of 190 = 158.65 -> 159)', () => {
    const r = must(
      calculateMhrZones({ hrmax: { source: 'measured', measured: 190 }, edges: [null, 73, 83.5, 88, 92, 100] }),
    );
    expect(r.boundaries[1].bpm).toBe(159);
    expect(isContiguous(r)).toBe(true);
  });
});

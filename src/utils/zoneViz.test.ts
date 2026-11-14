import { describe, expect, it } from 'vitest';
import { calculateHrrZones } from '../calculations/heartRateReserve';
import { calculateMhrZones } from '../calculations/maximumHR';
import { calculateThresholdZones } from '../calculations/thresholdHR';
import { must } from '../calculations/testHelpers';
import { compareMethods } from '../calculations/comparison';
import { buildSharedScale, buildVizSegments } from './zoneViz';

function sum(a: number[]): number {
  return a.reduce((x, y) => x + y, 0);
}

describe('buildVizSegments', () => {
  it('HRR (closed ends): segments touch exactly and span 120 to 191', () => {
    const calc = must(calculateHrrZones({ hrmax: { source: 'measured', measured: 190 }, rhr: 50 }));
    const s = buildVizSegments(calc.zones);
    expect(s[0].startBpm).toBe(120);
    expect(s[4].endBpm).toBe(191);
    for (let i = 0; i < 4; i++) expect(s[i].endBpm).toBe(s[i + 1].startBpm);
    expect(s.some((x) => x.openStart || x.openEnd)).toBe(false);
    expect(Math.abs(sum(s.map((x) => x.widthPct)) - 100) < 1e-9).toBe(true);
  });

  it('MHR: Zone 1 is open at the start and drawn one reference zone wide', () => {
    const calc = must(calculateMhrZones({ hrmax: { source: 'measured', measured: 190 } }));
    const s = buildVizSegments(calc.zones);
    expect(s[0].openStart).toBe(true);
    expect(s[0].endBpm).toBe(139);
    expect(s[0].startBpm).toBe(139 - 19); // Zone 2 is 139-157 = 19 bpm wide
    expect(s[4].endBpm).toBe(191);
  });

  it('FTHR: Zone 5 is open at the end and drawn one reference zone wide', () => {
    const calc = must(calculateThresholdZones({ avg20: 170 }));
    const s = buildVizSegments(calc.zones);
    expect(s[4].openEnd).toBe(true);
    expect(s[4].startBpm).toBe(162);
    expect(s[4].endBpm).toBe(162 + 10); // Zone 4 is 152-161 = 10 bpm wide
    expect(Math.abs(sum(s.map((x) => x.widthPct)) - 100) < 1e-9).toBe(true);
  });
});


describe('buildSharedScale', () => {
  const r = compareMethods({
    age: null,
    measuredHrmax: 190,
    hrmaxSource: 'measured',
    rhr: 50,
    avg20: 170,
  });
  const scale = buildSharedScale(
    (['mhr', 'hrr', 'threshold'] as const).map((m) => ({ method: m, zones: r.outcomes[m].calc!.zones })),
  )!;

  it('uses one axis wide enough for every method, in steps of 10', () => {
    expect(scale.minBpm).toBe(110);
    expect(scale.maxBpm).toBe(200);
    expect(scale.ticks).toEqual([110, 120, 130, 140, 150, 160, 170, 180, 190, 200]);
  });

  it('places the same bpm at the same position for every method', () => {
    const hrrZ1 = scale.rows.find((x) => x.method === 'hrr')!.segments[0];
    expect(Math.abs(hrrZ1.leftPct - ((120 - 110) / 90) * 100) < 1e-9).toBe(true);
    const mhrZ2 = scale.rows.find((x) => x.method === 'mhr')!.segments[1];
    expect(Math.abs(mhrZ2.leftPct - ((139 - 110) / 90) * 100) < 1e-9).toBe(true);
  });

  it('segments stay inside the axis and are contiguous', () => {
    for (const row of scale.rows) {
      for (let i = 0; i < row.segments.length; i++) {
        const s = row.segments[i];
        expect(s.leftPct >= 0 && s.leftPct + s.widthPct <= 100 + 1e-9).toBe(true);
        if (i > 0) {
          const p = row.segments[i - 1];
          expect(Math.abs(p.leftPct + p.widthPct - s.leftPct) < 1e-9).toBe(true);
        }
      }
    }
  });

  it('returns null with nothing to draw', () => {
    expect(buildSharedScale([])).toBeNull();
  });
});

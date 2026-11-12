import { describe, expect, it } from 'vitest';
import { calculateHrrZones } from '../calculations/heartRateReserve';
import { calculateMhrZones } from '../calculations/maximumHR';
import { calculateThresholdZones } from '../calculations/thresholdHR';
import { must } from '../calculations/testHelpers';
import { buildVizSegments } from './zoneViz';

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

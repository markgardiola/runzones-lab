import { describe, expect, it } from 'vitest';
import { ZONE_MODELS } from '../data/zoneModels';
import { calculateHrrZones } from './heartRateReserve';
import { calculateMhrZones } from './maximumHR';
import { calculateThresholdZones } from './thresholdHR';
import { editEdge, editZoneBound, resetEdges } from './zoneEditing';
import { isContiguous, must } from './testHelpers';

const mhr = ZONE_MODELS.mhr;
const hrr = ZONE_MODELS.hrr;
const fthr = ZONE_MODELS.threshold;

function ok(r: ReturnType<typeof editEdge>) {
  if (!r.ok) throw new Error(r.message);
  return r;
}

describe('per-zone editing with auto-adjust', () => {
  it('editing a zone side moves the shared boundary with its neighbour', () => {
    // Zone 2 upper = boundary 2 (shared with Zone 3 lower)
    const r = ok(editZoneBound(mhr, mhr.edges, 2, 'upper', 85));
    expect(r.edges).toEqual([null, 73, 85, 88, 92, 100]);
    expect(r.adjustedEdges).toEqual([]);
    expect(r.clamped).toBe(false);
    // Zone 3 lower is the same boundary
    const s = ok(editZoneBound(mhr, mhr.edges, 3, 'lower', 85));
    expect(s.edges).toEqual(r.edges);
  });

  it('pushes later boundaries up so zones never overlap, and reports what moved', () => {
    const r = ok(editZoneBound(mhr, mhr.edges, 2, 'upper', 88));
    expect(r.edges).toEqual([null, 73, 88, 89, 92, 100]);
    expect(r.adjustedEdges).toEqual([3]);
    expect(r.adjustedZones).toEqual([3, 4]);
  });

  it('pushes earlier boundaries down', () => {
    const r = ok(editZoneBound(mhr, mhr.edges, 3, 'lower', 70));
    expect(r.edges).toEqual([null, 69, 70, 88, 92, 100]);
    expect(r.adjustedEdges).toEqual([1]);
    expect(r.adjustedZones).toEqual([1, 2]);
  });

  it('cascades through several zones', () => {
    const r = ok(editEdge(hrr, hrr.edges, 3, 20));
    expect(r.edges).toEqual([17, 18, 19, 20, 90, 100]);
    expect(r.adjustedEdges).toEqual([0, 1, 2]);
  });

  it('clamps to the model range when the cascade would not fit', () => {
    const r = ok(editEdge(mhr, mhr.edges, 4, 100));
    expect(r.clamped).toBe(true);
    expect(r.appliedPct).toBe(99);
    expect(r.edges).toEqual([null, 73, 83, 88, 99, 100]);
    const low = ok(editEdge(hrr, hrr.edges, 3, 1));
    expect(low.appliedPct).toBe(3);
    expect(low.edges).toEqual([0, 1, 2, 3, 90, 100]);
  });

  it('the top edge can be lowered; the zones below yield so nothing overlaps', () => {
    const r = ok(editEdge(mhr, mhr.edges, 5, 95));
    expect(r.edges).toEqual([null, 73, 83, 88, 92, 95]);
    expect(r.adjustedEdges).toEqual([]);
    const pushed = ok(editEdge(mhr, mhr.edges, 5, 80));
    // Only boundaries that would overlap move: 92 -> 79, 88 -> 78, 83 -> 77; 73 stays
    expect(pushed.edges).toEqual([null, 73, 77, 78, 79, 80]);
    expect(pushed.adjustedEdges).toEqual([2, 3, 4]);
    expect(pushed.clamped).toBe(false);
  });

  it('open ends cannot be edited', () => {
    const a = editZoneBound(mhr, mhr.edges, 1, 'lower', 50);
    expect(a.ok).toBe(false);
    const b = editZoneBound(fthr, fthr.edges, 5, 'upper', 130);
    expect(b.ok).toBe(false);
    if (!b.ok) expect(b.code).toBe('open_end_not_editable');
  });

  it('rejects non-numeric input', () => {
    const r = editEdge(mhr, mhr.edges, 2, NaN);
    expect(r.ok).toBe(false);
  });

  it('whatever the edit, the result always validates and calculates contiguous zones', () => {
    const hr = { source: 'measured' as const, measured: 188 };
    for (let edge = 1; edge <= 5; edge++) {
      for (let pct = 0; pct <= 100; pct += 7) {
        const r = ok(editEdge(mhr, mhr.edges, edge, pct));
        const calc = must(calculateMhrZones({ hrmax: hr, edges: r.edges }));
        expect(isContiguous(calc)).toBe(true);
      }
    }
    for (let edge = 0; edge <= 5; edge++) {
      for (let pct = 0; pct <= 100; pct += 9) {
        const r = ok(editEdge(hrr, hrr.edges, edge, pct));
        const calc = must(
          calculateHrrZones({ hrmax: { source: 'measured', measured: 190 }, rhr: 50, edges: r.edges }),
        );
        expect(isContiguous(calc)).toBe(true);
      }
    }
  });

  it('custom FTHR zones drop the Friel 5a/5b sub-bands; reset restores them', () => {
    const r = ok(editEdge(fthr, fthr.edges, 2, 90));
    const custom = must(calculateThresholdZones({ avg20: 170, edges: r.edges }));
    expect(custom.status).toBe('custom');
    expect(custom.zones[4].subBands).toBeUndefined();
    const reset = must(calculateThresholdZones({ avg20: 170, edges: resetEdges(fthr) }));
    expect(reset.status).toBe('confirmed');
    expect(reset.zones[4].subBands?.length).toBe(2);
  });

  it('decimal edits are kept (83.5)', () => {
    const r = ok(editEdge(mhr, mhr.edges, 2, 83.5));
    expect(r.edges[2]).toBe(83.5);
  });
});

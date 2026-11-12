import type { ZoneModel, ZoneNumber } from '../types';
import { fromHundredths, toHundredths } from '../utils/numeric';

export const MIN_ZONE_WIDTH_PCT = 1;

type Edges = (number | null)[];

export interface EditSuccess {
  ok: true;
  edges: Edges;
  /** Edge indexes (other than the one edited) that were moved to avoid overlap. */
  adjustedEdges: number[];
  /** Zones with a side that moved because of the auto-adjust (not just the edited boundary itself). */
  adjustedZones: ZoneNumber[];
  /** True when the requested value was outside what the other boundaries allow. */
  clamped: boolean;
  requestedPct: number;
  appliedPct: number;
}

export interface EditFailure {
  ok: false;
  code: 'open_end_not_editable' | 'invalid_value';
  message: string;
}

export type EditResult = EditSuccess | EditFailure;

/**
 * Sets one zone boundary (edge index 0-5) and auto-adjusts the other boundaries so zones never
 * overlap and stay at least MIN_ZONE_WIDTH_PCT wide. Open (null) edges are not editable.
 */
export function editEdge(model: ZoneModel, edges: Edges, index: number, requestedPct: number): EditResult {
  if (!Number.isFinite(requestedPct)) {
    return { ok: false, code: 'invalid_value', message: 'Enter a number for the percentage.' };
  }
  if (index < 0 || index > 5 || edges[index] === null || edges[index] === undefined) {
    return {
      ok: false,
      code: 'open_end_not_editable',
      message: 'This end of the zone is open in the source model and cannot be edited.',
    };
  }
  const gap = toHundredths(MIN_ZONE_WIDTH_PCT);
  const h: (number | null)[] = edges.map((e) => (e === null ? null : toHundredths(e)));
  const defined = h.map((v, i) => (v === null ? -1 : i)).filter((i) => i >= 0);
  const pos = defined.indexOf(index);
  const lo = toHundredths(model.range.min) + gap * pos;
  const hi = toHundredths(model.range.max) - gap * (defined.length - 1 - pos);
  const wanted = toHundredths(requestedPct);
  const applied = Math.min(Math.max(wanted, lo), hi);

  const original = [...h];
  h[index] = applied;
  for (let j = pos - 1; j >= 0; j--) {
    const next = h[defined[j + 1]] as number;
    if ((h[defined[j]] as number) > next - gap) h[defined[j]] = next - gap;
  }
  for (let j = pos + 1; j < defined.length; j++) {
    const prev = h[defined[j - 1]] as number;
    if ((h[defined[j]] as number) < prev + gap) h[defined[j]] = prev + gap;
  }

  const adjustedEdges = defined.filter((i) => i !== index && h[i] !== original[i]);
  const adjustedZoneSet = new Set<ZoneNumber>();
  for (const i of adjustedEdges) {
    if (i >= 1) adjustedZoneSet.add(i as ZoneNumber); // zone i's upper end moved
    if (i <= 4) adjustedZoneSet.add((i + 1) as ZoneNumber); // zone i+1's lower end moved
  }

  return {
    ok: true,
    edges: h.map((v) => (v === null ? null : fromHundredths(v))),
    adjustedEdges,
    adjustedZones: [...adjustedZoneSet].sort((a, b) => a - b),
    clamped: applied !== wanted,
    requestedPct,
    appliedPct: fromHundredths(applied),
  };
}

/** Edits one side of one zone: lower = boundary with the zone below, upper = boundary with the zone above. */
export function editZoneBound(
  model: ZoneModel,
  edges: Edges,
  zone: ZoneNumber,
  side: 'lower' | 'upper',
  requestedPct: number,
): EditResult {
  return editEdge(model, edges, side === 'lower' ? zone - 1 : zone, requestedPct);
}

/** Back to the preset. */
export function resetEdges(model: ZoneModel): Edges {
  return [...model.edges];
}

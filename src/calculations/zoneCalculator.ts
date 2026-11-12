import { ZONE_OVERVIEW } from '../data/zoneOverview';
import type {
  AnchorSummary,
  BoundaryDetail,
  SubBandRow,
  Validated,
  ValidationIssue,
  ZoneCalculation,
  ZoneModel,
  ZoneNumber,
  ZoneRow,
} from '../types';
import { fromHundredths, roundDivHalfUp, toHundredths } from '../utils/numeric';
import { fail, issue, ok } from './validation';

/**
 * Exact anchor: bpm(pct) = base + span * pct/100, expressed with integers as
 *   (baseNum * 10000 + spanNum * pctHundredths) / (den * 10000).
 *   %MHR:  base 0,   span HRmax          (den 10:   tenths of a bpm)
 *   %HRR:  base RHR, span HRmax - RHR    (den 10)
 *   FTHR:  base 0,   span avg20 * 95/100 (den 1000: avg in tenths x 95)
 */
export interface Anchor {
  baseNum: number;
  spanNum: number;
  den: number;
  summary: AnchorSummary;
}

type Edges = (number | null)[];

export function toHundredthEdges(edges: Edges): (number | null)[] {
  return edges.map((e) => (e === null ? null : toHundredths(e)));
}

function boundary(anchor: Anchor, pctHundredths: number): { exact: number; bpm: number } {
  const num = anchor.baseNum * 10000 + anchor.spanNum * pctHundredths;
  const den = anchor.den * 10000;
  return { exact: num / den, bpm: roundDivHalfUp(num, den) };
}

export function edgesDifferFromModel(model: ZoneModel, edges: Edges): boolean {
  const a = toHundredthEdges(model.edges);
  const b = toHundredthEdges(edges);
  return a.some((v, i) => v !== b[i]);
}

/** Checks that custom edges keep the model's open/closed shape, stay in range and increase strictly. */
export function validateEdges(model: ZoneModel, edges: Edges): ValidationIssue[] {
  const errors: ValidationIssue[] = [];
  if (edges.length !== 6) {
    return [issue('error', 'edges', 'edge_count', 'Zone edges must have exactly six entries.')];
  }
  let previous: number | null = null;
  edges.forEach((e, i) => {
    if ((e === null) !== (model.edges[i] === null)) {
      errors.push(issue('error', 'edges', 'edge_shape', 'Open zone ends cannot be added or removed.'));
      return;
    }
    if (e === null) return;
    const h = toHundredths(e);
    if (Math.abs(h - e * 100) > 1e-6) {
      errors.push(issue('error', 'edges', 'too_precise', 'Zone percentages can have at most two decimals.'));
    }
    if (e < model.range.min || e > model.range.max) {
      errors.push(
        issue('error', 'edges', 'out_of_range', `Zone percentages must be between ${model.range.min}% and ${model.range.max}%.`),
      );
    }
    if (previous !== null && h <= previous) {
      errors.push(issue('error', 'edges', 'not_increasing', 'Each zone boundary must be higher than the one before it.'));
    }
    previous = h;
  });
  return errors;
}

export function calculateZones(
  model: ZoneModel,
  anchor: Anchor,
  edgesOverride?: Edges,
  warnings: ValidationIssue[] = [],
): Validated<ZoneCalculation> {
  const edges = edgesOverride ?? model.edges;
  const edgeErrors = validateEdges(model, edges);
  if (edgeErrors.length > 0) return fail(edgeErrors, warnings);

  const hEdges = toHundredthEdges(edges);
  const boundaries: BoundaryDetail[] = [];
  const bpmAt: (number | null)[] = hEdges.map((h, i) => {
    if (h === null) return null;
    const b = boundary(anchor, h);
    boundaries.push({ edgeIndex: i, pct: fromHundredths(h), exactBpm: b.exact, bpm: b.bpm });
    return b.bpm;
  });

  const isCustom = edgesOverride !== undefined && edgesDifferFromModel(model, edges);

  const zones: ZoneRow[] = [];
  for (let z = 1; z <= 5; z++) {
    const lowerEdge = bpmAt[z - 1];
    const upperEdge = bpmAt[z];
    const last = z === 5;
    const info = ZONE_OVERVIEW[z - 1];
    const lowerBpm = lowerEdge;
    // Zones are [lower, next lower): upper = next boundary - 1. The last zone's top edge is inclusive.
    const upperBpm = upperEdge === null ? null : last ? upperEdge : upperEdge - 1;
    if (lowerBpm !== null && upperBpm !== null && upperBpm < lowerBpm) {
      return fail(
        [
          issue(
            'error',
            'edges',
            'zone_too_narrow',
            `Zone ${z} would be narrower than 1 bpm with these inputs. Widen the zone percentages or check the heart rate values.`,
          ),
        ],
        warnings,
      );
    }
    const row: ZoneRow = {
      zone: z as ZoneNumber,
      name: info.name,
      descriptor: info.descriptor,
      lowerPct: edges[z - 1],
      upperPct: edges[z],
      upperInclusive: last && edges[z] !== null,
      lowerBpm,
      upperBpm,
    };
    if (last && !isCustom && model.subBands) {
      row.subBands = model.subBands.map((sb): SubBandRow => {
        const lo = boundary(anchor, toHundredths(sb.lowerPct)).bpm;
        const hi = sb.upperPct === null ? null : boundary(anchor, toHundredths(sb.upperPct)).bpm - 1;
        return { label: sb.label, lowerPct: sb.lowerPct, upperPct: sb.upperPct, lowerBpm: lo, upperBpm: hi };
      });
    }
    zones.push(row);
  }

  const firstBpm = bpmAt[0];
  return ok(
    {
      method: model.method,
      modelId: model.id,
      modelLabel: model.label,
      status: isCustom ? 'custom' : model.status,
      isCustom,
      anchor: anchor.summary,
      edges: [...edges],
      boundaries,
      zones,
      belowZone1MaxBpm: firstBpm === null ? null : firstBpm - 1,
    },
    warnings,
  );
}

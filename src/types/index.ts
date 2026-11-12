export type ZoneNumber = 1 | 2 | 3 | 4 | 5;
export type MethodId = 'mhr' | 'hrr' | 'threshold';

export interface NavItem {
  label: string;
  to: string;
}

export interface MethodSummary {
  id: MethodId;
  number: string;
  name: string;
  short: string;
  to: string;
}

/** General educational labels only. Numeric boundaries live in data/zoneModels.ts (Phase 3). */
export interface ZoneOverview {
  zone: ZoneNumber;
  name: string;
  descriptor: string;
  purpose: string;
}

export interface ResearcherHighlight {
  slug: string;
  name: string;
  /** Only descriptors verifiable from the cited sources. */
  descriptor: string;
  topic: string;
  featured: string;
}

export interface ReferenceEntry {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  identifiers: { doi?: string; pmid?: string };
  url: string;
  relevance: string;
}

// ---------- Calculation engine types (Phase 3) ----------

export type HRmaxSource = 'measured' | 'tanaka' | 'traditional';
export type PresetStatus = 'confirmed' | 'provisional';
export type ZoneStatus = PresetStatus | 'custom';

export interface ValidationIssue {
  severity: 'error' | 'warning';
  field: string;
  code: string;
  message: string;
}

export type Validated<T> =
  | { ok: true; value: T; warnings: ValidationIssue[] }
  | { ok: false; errors: ValidationIssue[]; warnings: ValidationIssue[] };

export interface SubBand {
  label: string;
  lowerPct: number;
  upperPct: number | null;
}

/**
 * A zone preset. `edges` has six entries: edges[i-1] is the lower percentage of zone i,
 * edges[i] its upper percentage. null = open end. Zones are contiguous: [edge, next edge).
 * Only the final zone's top edge (when not null) is inclusive.
 */
export interface ZoneModel {
  id: string;
  method: MethodId;
  label: string;
  status: PresetStatus;
  sourceIds: string[];
  anchorKind: 'hrmax' | 'hrr' | 'fthr';
  edges: (number | null)[];
  range: { min: number; max: number };
  subBands?: SubBand[];
  notes: string[];
}

export interface SubBandRow {
  label: string;
  lowerPct: number;
  upperPct: number | null;
  lowerBpm: number;
  upperBpm: number | null;
}

export interface ZoneRow {
  zone: ZoneNumber;
  name: string;
  descriptor: string;
  lowerPct: number | null;
  upperPct: number | null;
  /** True only for the last zone when the model defines a top edge (e.g. 100%). */
  upperInclusive: boolean;
  lowerBpm: number | null;
  upperBpm: number | null;
  subBands?: SubBandRow[];
}

export interface BoundaryDetail {
  edgeIndex: number;
  pct: number;
  /** Exact value in bpm, for display only. Rounding uses integer arithmetic. */
  exactBpm: number;
  bpm: number;
}

export interface AnchorSummary {
  kind: 'hrmax' | 'hrr' | 'fthr';
  label: string;
  value: number;
  formula: string;
  details: Record<string, string | number>;
}

export interface ZoneCalculation {
  method: MethodId;
  modelId: string;
  modelLabel: string;
  status: ZoneStatus;
  isCustom: boolean;
  anchor: AnchorSummary;
  edges: (number | null)[];
  boundaries: BoundaryDetail[];
  zones: ZoneRow[];
  /** HRR preset only: highest bpm below Zone 1, when Zone 1 has a closed floor. */
  belowZone1MaxBpm: number | null;
}

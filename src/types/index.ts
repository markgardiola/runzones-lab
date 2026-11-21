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

export type VerificationLevel = 'read-full' | 'read-partial' | 'citation-only' | 'secondary' | 'owner-supplied';
export type ReferenceCategory = 'peer-reviewed' | 'review' | 'guideline' | 'methodology' | 'practitioner';

export interface ReferenceEntry {
  id: string;
  title: string;
  authors: string;
  /** null when the year could not be verified. */
  year: number | null;
  venue: string;
  identifiers: { doi?: string; pmid?: string };
  /** Only set when a working public link was seen. */
  url?: string;
  category: ReferenceCategory;
  /** How far this project's checking went. Shown to readers. */
  verification: VerificationLevel;
  relevance: string;
  note?: string;
}

export interface BioSource {
  label: string;
  url: string;
}

/** A portrait is shown only when every field here is filled in (image rights must be clear). */
export interface PortraitInfo {
  /** Self-hosted file under /images/people/ */
  src: string;
  alt: string;
  /** Photographer or rights holder, as the licence requires. */
  credit: string;
  /** 'cleared' = licence or permission confirmed; 'unverified' = rights not confirmed (shown honestly on the page). */
  rights: 'cleared' | 'unverified';
  /** e.g. "CC BY-SA 4.0", "Public domain", "Used with permission". Required when rights are cleared. */
  license?: string;
  /** Page where the image and its licence or permission can be checked. */
  sourceUrl: string;
  width?: number;
  height?: number;
}

export interface ResearcherProfile {
  slug: string;
  name: string;
  kind: 'researcher' | 'coach';
  role: string;
  biography: string[];
  background: string[];
  contributions: string[];
  methods: MethodId[];
  /** The person's own publications or methodology. */
  publicationIds: string[];
  /** Other sources that discuss their work. */
  furtherReadingIds: string[];
  runningRelevance: string[];
  /** What this profile deliberately does not claim. */
  limits: string[];
  bioSources: BioSource[];
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

// ---------- Science articles (Phase 6) ----------

export type ExampleKey =
  | 'mhr-190'
  | 'mhr-tanaka-40'
  | 'hrr-190-50'
  | 'resting-hr-effect'
  | 'fthr-170'
  | 'zone-labels'
  | 'compare-presets'
  | 'compare-zone2';

export type ArticleBlock =
  | { type: 'h'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'formula'; text: string }
  | { type: 'callout'; title: string; text: string }
  | { type: 'table'; caption: string; head: string[]; rows: string[][]; note?: string }
  | { type: 'example'; example: ExampleKey };

export interface Article {
  slug: string;
  title: string;
  summary: string;
  blocks: ArticleBlock[];
  referenceIds: string[];
  tryIt?: { label: string; to: string };
}

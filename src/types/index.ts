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

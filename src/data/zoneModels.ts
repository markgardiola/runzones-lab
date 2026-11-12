import type { MethodId, ZoneModel } from '../types';

// Zone presets (Phase 2 decisions: see docs/DECISIONS.md and docs/SCIENTIFIC_METHODS.md).
// Source IDs refer to docs/SOURCES.md. Percentages live here, never in components.
// edges[i-1] = lower % of zone i, edges[i] = upper % (null = open end).

export const ZONE_MODELS: Record<MethodId, ZoneModel> = {
  mhr: {
    id: 'friel-mhr',
    method: 'mhr',
    label: 'Friel zones, % of maximum heart rate',
    status: 'confirmed',
    sourceIds: ['S-06', 'S-07'],
    anchorKind: 'hrmax',
    // Friel: Z1 < 72, Z2 73-82, Z3 83-87, Z4 88-92, Z5 92-100 (5a+5b). Each zone's stated
    // lower percentage is its lower boundary (see SCIENTIFIC_METHODS.md section 6).
    edges: [null, 73, 83, 88, 92, 100],
    range: { min: 0, max: 100 },
    notes: [
      'Zone 5 combines Friel zones 5a and 5b; 5c is not applicable to heart rate.',
      'The source table comes from a cycling book; Friel no longer separates running and cycling zones.',
    ],
  },
  hrr: {
    id: 'convention-10pct-hrr',
    method: 'hrr',
    label: 'Common 10%-band convention applied to heart rate reserve',
    status: 'provisional',
    sourceIds: ['S-08', 'S-09'],
    anchorKind: 'hrr',
    edges: [50, 60, 70, 80, 90, 100],
    range: { min: 0, max: 100 },
    notes: [
      'A common convention originally defined on maximum heart rate and applied here to heart rate reserve. Not a validated running-specific model.',
      'Effort below 50% HRR is below Zone 1.',
    ],
  },
  threshold: {
    id: 'friel-fthr',
    method: 'threshold',
    label: 'Friel zones, % of field-estimated FTHR',
    status: 'confirmed',
    sourceIds: ['S-06', 'S-07'],
    anchorKind: 'fthr',
    // Friel: Z1 < 78, Z2 78-86, Z3 87-93, Z4 94-99, Z5 >= 100 (5a 100-102, 5b > 102).
    edges: [null, 78, 87, 94, 100, null],
    range: { min: 0, max: 120 },
    subBands: [
      { label: '5a', lowerPct: 100, upperPct: 103 },
      { label: '5b', lowerPct: 103, upperPct: null },
    ],
    notes: [
      'FTHR is a field estimate (20-minute average x 0.95), not a laboratory-measured lactate threshold heart rate.',
      'Zone 5 has no upper cap in the source.',
    ],
  },
};

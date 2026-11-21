import type { ZoneNumber } from '../../types';

// Static class names so Tailwind can see them. Zones are always also labelled with text.
export const ZONE_BG: Record<ZoneNumber, string> = {
  1: 'bg-zone-1',
  2: 'bg-zone-2',
  3: 'bg-zone-3',
  4: 'bg-zone-4',
  5: 'bg-zone-5',
};

export const ZONE_BORDER: Record<ZoneNumber, string> = {
  1: 'border-zone-1',
  2: 'border-zone-2',
  3: 'border-zone-3',
  4: 'border-zone-4',
  5: 'border-zone-5',
};

// Open-ended segments are faded by lightening the background only. Fading the whole element would
// also fade the label text and fail WCAG AA contrast (see utils/contrast.test.ts).
export const ZONE_BG_FADED: Record<ZoneNumber, string> = {
  1: 'bg-zone-1/70',
  2: 'bg-zone-2/70',
  3: 'bg-zone-3/70',
  4: 'bg-zone-4/70',
  5: 'bg-zone-5/70',
};

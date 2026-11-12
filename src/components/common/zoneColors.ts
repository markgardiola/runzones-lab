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

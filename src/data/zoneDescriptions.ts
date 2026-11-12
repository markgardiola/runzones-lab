import type { ZoneNumber } from '../types';

// General educational wording only. It makes no method-specific physiological claims:
// what a zone means depends on the method and the individual (see SCIENTIFIC_METHODS.md).
export const ZONE_DETAILS: Record<ZoneNumber, { physiology: string; examples: string }> = {
  1: {
    physiology: 'Very low physiological stress. Effort feels very easy and can be held for a long time.',
    examples: 'Warm-up, cool-down, recovery jog.',
  },
  2: {
    physiology: 'Comfortable aerobic effort that can be sustained for long periods.',
    examples: 'Easy runs, long runs.',
  },
  3: {
    physiology: 'Noticeably harder than easy running, but still steady and controlled.',
    examples: 'Steady continuous runs, tempo-style efforts.',
  },
  4: {
    physiology: 'Hard effort near the threshold region, where the time you can sustain becomes limited.',
    examples: 'Longer intervals or sustained threshold blocks.',
  },
  5: {
    physiology: 'Very hard to near-maximal effort that can be held only briefly.',
    examples: 'Short intervals with generous recovery.',
  },
};

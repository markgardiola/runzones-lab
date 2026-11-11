import type { MethodSummary, NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Calculator', to: '/calculator' },
  { label: 'Compare', to: '/compare' },
  { label: 'Science', to: '/science' },
  { label: 'Researchers', to: '/researchers' },
  { label: 'References', to: '/references' },
  { label: 'About', to: '/about' },
];

export const METHODS: MethodSummary[] = [
  {
    id: 'mhr',
    number: '01',
    name: 'Maximum Heart Rate',
    short:
      'Zones as a percentage of your maximum heart rate, using a measured value or an age-based estimate (clearly labelled as an estimate).',
    to: '/calculator?method=mhr',
  },
  {
    id: 'hrr',
    number: '02',
    name: 'Heart Rate Reserve',
    short:
      'The Karvonen approach: zones are taken from the gap between resting and maximum heart rate, so resting heart rate matters.',
    to: '/calculator?method=hrr',
  },
  {
    id: 'threshold',
    number: '03',
    name: 'Threshold-Based Field Estimate',
    short:
      'Zones anchored to an estimated functional threshold heart rate (FTHR) from a 20-minute field test. An estimate, not a laboratory lactate measurement.',
    to: '/calculator?method=threshold',
  },
];

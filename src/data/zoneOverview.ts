import type { ZoneOverview } from '../types';

// General educational labels from the project brief (Section 6). They carry no
// numeric boundaries: those depend on the selected method and live in zoneModels.ts.
export const ZONE_OVERVIEW: ZoneOverview[] = [
  { zone: 1, name: 'Recovery', descriptor: 'Very Easy', purpose: 'Very light effort for warm-ups, cool-downs and recovery between harder sessions.' },
  { zone: 2, name: 'Aerobic Endurance', descriptor: 'Easy', purpose: 'Comfortable, sustainable running that builds the aerobic base for long runs.' },
  { zone: 3, name: 'Tempo', descriptor: 'Moderate-Hard', purpose: 'Controlled, sustained effort that feels work-like but steady.' },
  { zone: 4, name: 'Threshold', descriptor: 'Hard', purpose: 'Hard efforts around the threshold region, usually in intervals or sustained blocks.' },
  { zone: 5, name: 'High Intensity', descriptor: 'Maximum Effort', purpose: 'Short, very hard efforts with generous recovery.' },
];

import type { ResearcherHighlight } from '../types';

// Highlights use only descriptors verifiable from the cited sources.
// Full profiles (biography, background, publications) are Phase 6 and will be sourced individually.
export const RESEARCHER_HIGHLIGHTS: ResearcherHighlight[] = [
  {
    slug: 'tanaka',
    name: 'Hirofumi Tanaka',
    descriptor: 'Lead author, 2001 age-predicted HRmax study',
    topic: 'Age-predicted maximum heart rate',
    featured: 'Age-Predicted Maximal Heart Rate Revisited (2001)',
  },
  {
    slug: 'karvonen',
    name: 'Martti Karvonen',
    descriptor: 'First author, 1957 training and heart rate study',
    topic: 'Heart rate reserve and exercise intensity',
    featured: 'The Effects of Training on Heart Rate: A Longitudinal Study (1957)',
  },
  {
    slug: 'friel',
    name: 'Joe Friel',
    descriptor: 'Endurance coach and author',
    topic: 'Functional threshold heart rate and training zones',
    featured: 'A Quick Guide to Setting Zones (revised 2025)',
  },
];

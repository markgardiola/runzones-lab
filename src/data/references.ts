import type { ReferenceEntry } from '../types';

// Only entries whose bibliographic details were checked against PubMed or the
// publisher/author page. The full library is built in Phase 6.
export const REFERENCES: ReferenceEntry[] = [
  {
    id: 'tanaka-2001',
    title: 'Age-predicted maximal heart rate revisited',
    authors: 'Tanaka H, Monahan KD, Seals DR',
    year: 2001,
    venue: 'Journal of the American College of Cardiology 37(1):153–156',
    identifiers: { doi: '10.1016/s0735-1097(00)01054-8', pmid: '11153730' },
    url: 'https://pubmed.ncbi.nlm.nih.gov/11153730/',
    relevance: 'Source of the 208 − 0.7 × age estimate of maximum heart rate in healthy adults.',
  },
  {
    id: 'karvonen-1957',
    title: 'The effects of training on heart rate; a longitudinal study',
    authors: 'Karvonen MJ, Kentala E, Mustala O',
    year: 1957,
    venue: 'Annales Medicinae Experimentalis et Biologiae Fenniae 35(3):307–315',
    identifiers: { pmid: '13470504' },
    url: 'https://pubmed.ncbi.nlm.nih.gov/13470504/',
    relevance: 'Historical reference associated with the heart rate reserve (Karvonen) approach.',
  },
  {
    id: 'friel-quick-guide',
    title: 'A Quick Guide to Setting Zones',
    authors: 'Friel J',
    year: 2020,
    venue: 'joefrieltraining.com (published April 2020, revised September 2025)',
    identifiers: {},
    url: 'https://joefrieltraining.com/a-quick-guide-to-setting-zones/',
    relevance: 'Describes the 20-minute field test used to estimate functional threshold heart rate (FTHR).',
  },
];

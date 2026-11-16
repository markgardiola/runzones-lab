import type { ReferenceCategory, ReferenceEntry, VerificationLevel } from '../types';

// The reference library. Every entry records how far this project's checking went
// (`verification`), and nothing is stated about a source beyond that level.
// Details of what was read are in docs/SOURCES.md.

export const CATEGORY_LABELS: Record<ReferenceCategory, string> = {
  'peer-reviewed': 'Peer-reviewed research',
  review: 'Reviews, commentaries and historical articles',
  guideline: 'Guidelines and position stands',
  methodology: 'Coaching methodology (primary publications)',
  practitioner: 'Practitioner and manufacturer sources',
};

export const CATEGORY_ORDER: ReferenceCategory[] = ['peer-reviewed', 'review', 'guideline', 'methodology', 'practitioner'];

export const VERIFICATION_LABELS: Record<VerificationLevel, string> = {
  'read-full': 'Read in full',
  'read-partial': 'Abstract and excerpts read',
  'citation-only': 'Citation checked; content not read',
  secondary: 'Secondary or practitioner source',
  'owner-supplied': 'Supplied by the project owner',
};

export const REFERENCES: ReferenceEntry[] = [
  {
    id: 'tanaka-2001',
    title: 'Age-predicted maximal heart rate revisited',
    authors: 'Tanaka H, Monahan KD, Seals DR',
    year: 2001,
    venue: 'Journal of the American College of Cardiology 37(1):153–156',
    identifiers: { doi: '10.1016/s0735-1097(00)01054-8', pmid: '11153730' },
    url: 'https://pubmed.ncbi.nlm.nih.gov/11153730/',
    category: 'peer-reviewed',
    verification: 'read-full',
    relevance:
      'Source of HRmax = 208 − 0.7 × age. A meta-analysis plus a laboratory study of healthy adults; individual differences of about 10 bpm; may not apply with cardiovascular disease or smoking.',
  },
  {
    id: 'karvonen-1957',
    title: 'The effects of training on heart rate; a longitudinal study',
    authors: 'Karvonen MJ, Kentala E, Mustala O',
    year: 1957,
    venue: 'Annales Medicinae Experimentalis et Biologiae Fenniae 35(3):307–315',
    identifiers: { pmid: '13470504' },
    url: 'https://pubmed.ncbi.nlm.nih.gov/13470504/',
    category: 'peer-reviewed',
    verification: 'citation-only',
    relevance: 'Historical reference for the heart rate reserve approach.',
    note: 'PubMed has no abstract and the paper itself was not read. What is said about it on this site comes from the reviews listed below.',
  },
  {
    id: 'ferri-marini-2021',
    title: 'HRR and VO2R fractions are not equivalent: is it time to rethink aerobic exercise prescription methods?',
    authors: 'Ferri Marini C, Sisti D, Leon AS, Skinner JS, Sarzynski MA, Bouchard C, Rocchi MBL, Piccoli G, Stocchi V, Federici A, Lucertini F',
    year: 2021,
    venue: 'Medicine & Science in Sports & Exercise 53(1):174–182',
    identifiers: {},
    category: 'peer-reviewed',
    verification: 'citation-only',
    relevance: 'The study that argues %HRR and %VO2 reserve are not equivalent, which Swain and Franklin (2021) respond to.',
    note: 'Citation as listed in Swain and Franklin (2021). The paper itself was not read.',
  },
  {
    id: 'fox-1971',
    title: 'Physical activity and the prevention of coronary heart disease',
    authors: 'Fox SM 3rd, Naughton JP, Haskell WL',
    year: 1971,
    venue: 'Annals of Clinical Research 3(6):404–432',
    identifiers: { pmid: '4945367' },
    url: 'https://pubmed.ncbi.nlm.nih.gov/4945367/',
    category: 'review',
    verification: 'citation-only',
    relevance: 'The 1971 review in which data later associated with the 220 − age rule were compiled (per Tanaka et al., 2001, and Robergs and Landwehr, 2002).',
    note: 'The review itself was not read.',
  },
  {
    id: 'robergs-2002',
    title: 'The surprising history of the "HRmax = 220 − age" equation',
    authors: 'Robergs RA, Landwehr R',
    year: 2002,
    venue: 'Journal of Exercise Physiology online 5(2):1–10',
    identifiers: {},
    category: 'review',
    verification: 'read-partial',
    relevance:
      'Traces 220 − age to an informal fit of data compiled in 1971 rather than original research, and reports prediction errors of roughly 7–11 beats per minute for HRmax equations.',
    note: 'Abstract and substantial excerpts read from copies of the paper. No publisher link was verified.',
  },
  {
    id: 'ignaszewski-2017',
    title: 'The science of exercise prescription: Martti Karvonen and his contributions',
    authors: 'Ignaszewski M, Lau B, Wong S, Isserow S',
    year: 2017,
    venue: 'BC Medical Journal 59(1):38–41',
    identifiers: {},
    url: 'https://bcmj.org/articles/science-exercise-prescription-martti-karvonen-and-his-contributions',
    category: 'review',
    verification: 'read-full',
    relevance: 'Peer-reviewed article describing Karvonen’s career, the 1957 study and the Karvonen formula.',
  },
  {
    id: 'swain-franklin-2021',
    title: 'Counterpoint: Theoretical and empirical basis for equating heart rate reserve with VO2 reserve',
    authors: 'Swain DP, Franklin BA',
    year: 2021,
    venue: 'Journal of Clinical Exercise Physiology 10(3):97–101',
    identifiers: {},
    url: 'https://jcep.kglmeridian.com/downloadpdf/view/journals/ceph/10/3/article-p97.pdf',
    category: 'review',
    verification: 'read-full',
    relevance:
      'One side of a point/counterpoint debate: argues %HRR and %VO2 reserve are equivalent, notes the 1957 study did not measure oxygen uptake, and discusses cardiovascular drift.',
    note: 'The authors argue one side of an open debate; read it together with Ferri Marini et al. (2021).',
  },
  {
    id: 'faude-2009',
    title: 'Lactate threshold concepts: how valid are they?',
    authors: 'Faude O, Kindermann W, Meyer T',
    year: 2009,
    venue: 'Sports Medicine 39(6):469–490',
    identifiers: { doi: '10.2165/00007256-200939060-00003', pmid: '19453206' },
    url: 'https://pubmed.ncbi.nlm.nih.gov/19453206/',
    category: 'review',
    verification: 'read-partial',
    relevance: 'Located 25 different lactate threshold concepts, showing that "lactate threshold" is not one standard measurement.',
    note: 'Abstract read.',
  },
  {
    id: 'garber-2011',
    title:
      'Quantity and quality of exercise for developing and maintaining cardiorespiratory, musculoskeletal, and neuromotor fitness in apparently healthy adults: guidance for prescribing exercise',
    authors: 'Garber CE, Blissmer B, Deschenes MR, Franklin BA, Lamonte MJ, Lee IM, Nieman DC, Swain DP',
    year: 2011,
    venue: 'Medicine & Science in Sports & Exercise 43(7):1334–1359 (ACSM position stand)',
    identifiers: { doi: '10.1249/MSS.0b013e318213fefb', pmid: '21694556' },
    url: 'https://pubmed.ncbi.nlm.nih.gov/21694556/',
    category: 'guideline',
    verification: 'read-full',
    relevance:
      'Table of exercise-intensity classes by %HRmax and %HRR, and the caution that no study compares all intensity methods, so methods cannot be assumed equivalent.',
  },
  {
    id: 'friel-quick-guide-2025',
    title: 'A Quick Guide to Setting Zones',
    authors: 'Friel J',
    year: 2020,
    venue: 'joefrieltraining.com (published April 2020, revised September 2025)',
    identifiers: {},
    url: 'https://joefrieltraining.com/a-quick-guide-to-setting-zones/',
    category: 'methodology',
    verification: 'read-full',
    relevance:
      'The 20-minute field test used to estimate functional threshold heart rate (FTHR) by subtracting 5% from the 20-minute average. The page’s zone table is an image; the percentages were taken from the book below.',
  },
  {
    id: 'friel-hpc-2025',
    title: 'High-Performance Cyclist: The Complete Training Manual',
    authors: 'Friel J',
    year: 2025,
    venue: 'Bloomsbury Publishing (Bloomsbury Sport)',
    identifiers: {},
    category: 'methodology',
    verification: 'owner-supplied',
    relevance: 'Source of the zone percentages for the %MHR and threshold methods (zone table, p. 63).',
    note: 'Citation and table transcription supplied by the project owner. The table comes from a cycling book; Friel’s current article says he no longer separates running and cycling zones.',
  },
  {
    id: 'edwards-hrm-book',
    title: 'The Heart Rate Monitor Book',
    authors: 'Edwards S',
    year: null,
    venue: 'Fleet Feet Press',
    identifiers: {},
    category: 'practitioner',
    verification: 'secondary',
    relevance:
      'Practitioner source of the common five-zone, 10%-band convention (50–60 … 90–100%), defined on maximum heart rate.',
    note: 'Not peer-reviewed. Secondary mentions give different publication years, so none is stated here.',
  },
  {
    id: 'polar-heart-rate-zones',
    title: 'Heart rate zones',
    authors: 'Polar Electro',
    year: null,
    venue: 'Manufacturer guide (polar.com)',
    identifiers: {},
    url: 'https://www.polar.com/en/guide/heart-rate-zones',
    category: 'practitioner',
    verification: 'secondary',
    relevance: 'Shows the same 10%-band convention in widespread commercial use, as percentages of maximum heart rate.',
    note: 'Manufacturer documentation, not a scientific source.',
  },
];

export function getReference(id: string): ReferenceEntry | undefined {
  return REFERENCES.find((r) => r.id === id);
}

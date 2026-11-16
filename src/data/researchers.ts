import type { ResearcherHighlight, ResearcherProfile } from '../types';

// Profiles contain only facts checked against the sources listed on each profile. Nothing is
// invented: where a detail could not be verified it is left out. Research and coaching are kept
// distinct: researchers developed or studied a method, coaches popularised its practical use.

export const RESEARCHER_PROFILES: ResearcherProfile[] = [
  {
    slug: 'tanaka',
    name: 'Hirofumi Tanaka',
    kind: 'researcher',
    role: 'Exercise physiologist; Professor of Kinesiology and Health Education, The University of Texas at Austin',
    biography: [
      'Hirofumi Tanaka is a professor in the Department of Kinesiology and Health Education at The University of Texas at Austin. He directs the Cardiovascular Aging Research Laboratory and coordinates the university’s Exercise Physiology program.',
      'His research centres on vascular aging: the stiffening of large elastic arteries, vascular endothelial dysfunction, and the lifestyle habits that may prevent or reverse them, including studies of master athletes.',
    ],
    background: [
      'B.A. in physical education and martial arts, International Budo University, Japan',
      'M.S. in human bioenergetics, Ball State University',
      'Ph.D. in applied physiology, University of Tennessee',
      'Postdoctoral fellowship in cardiovascular physiology, University of Colorado at Boulder',
    ],
    contributions: [
      'Lead author, with Kevin D. Monahan and Douglas R. Seals, of “Age-predicted maximal heart rate revisited” (Journal of the American College of Cardiology, 2001). Combining a meta-analysis of published data (351 studies, 18,712 subjects) with a laboratory study of 514 healthy adults, the paper proposed HRmax = 208 − 0.7 × age.',
      'The authors reported that the age relationship held regardless of sex and of habitual physical activity level.',
      'The paper describes the older 220 − age rule as having been determined arbitrarily from about 10 studies, citing 1970s reviews by Fox and Haskell as its origin.',
    ],
    methods: ['mhr', 'hrr'],
    publicationIds: ['tanaka-2001'],
    furtherReadingIds: ['robergs-2002'],
    runningRelevance: [
      'RunZones Lab offers the Tanaka equation as one way to estimate maximum heart rate when no measured value is available, always labelled as an estimate. A measured value is preferred.',
    ],
    limits: [
      'The study population was healthy, non-medicated adults. The authors say the equation may not apply to people with cardiovascular disease or to smokers, and that direct measurement is preferable when possible.',
      'Individual values differ from the equation by roughly 10 bpm.',
      'The 2001 paper was written for adults in general, not specifically for runners.',
    ],
    bioSources: [{ label: 'The University of Texas at Austin, faculty profile', url: 'https://utw10366.utweb.utexas.edu/hirofumi_tanaka' }],
  },
  {
    slug: 'karvonen',
    name: 'Martti Karvonen',
    kind: 'researcher',
    role: 'Finnish physician and exercise physiologist',
    biography: [
      'Martti Karvonen was born in Finland in 1918. He is remembered as a founding figure of cardiovascular epidemiology and prevention in Finland.',
      'He brought observations about Finnish men to the attention of Ancel Keys; their collaboration led to Finland’s inclusion in the Seven Countries Study. His advice led to the North Karelia Project, created in 1972.',
    ],
    background: [
      'Medical degree, University of Helsinki (1945)',
      'PhD, University of Cambridge (1950)',
      'Director of the Department of Physiology at the Institute of Occupational Health in Helsinki, later the institute’s director general',
      'Chief physician of the Finnish air force (1956–1966) and army (1974–1978)',
    ],
    contributions: [
      'First author, with E. Kentala and O. Mustala, of “The effects of training on heart rate; a longitudinal study” (1957), credited as introducing a systematic way of prescribing exercise intensity as a percentage of the difference between resting and maximum heart rate, known as the heart rate reserve method.',
      'A review of his work describes the 1957 study as examining the effect of different training intensities on resting, working and maximum heart rates, and reports that it identified about 60% of heart rate reserve as the threshold at which improvements were seen. RunZones Lab has not read the 1957 paper itself, so this is reported second-hand.',
      'The formula that carries his name is: target heart rate = resting heart rate + (peak heart rate − resting heart rate) × K, where K is the chosen fraction of reserve.',
    ],
    methods: ['hrr'],
    publicationIds: ['karvonen-1957'],
    furtherReadingIds: ['ignaszewski-2017', 'swain-franklin-2021', 'ferri-marini-2021'],
    runningRelevance: [
      'The %HRR calculator uses the reserve approach, so resting heart rate shapes every zone boundary.',
      'One review describes the formula as a reasonably accurate rule of thumb that can over- or underestimate exercise intensity in some people.',
    ],
    limits: [
      'No single publication proves every modern use of the Karvonen formula.',
      'The 1957 study did not measure oxygen uptake. Whether %HRR equals %VO2 reserve is debated: Swain and Franklin (2021) argue it does, and Ferri Marini and colleagues (2021) argue the two are not equivalent.',
      'The 10%-band zones used in the %HRR calculator are a practitioner convention. This project found no evidence that they come from the 1957 paper.',
    ],
    bioSources: [
      {
        label: 'Ignaszewski et al. (2017), BC Medical Journal',
        url: 'https://bcmj.org/articles/science-exercise-prescription-martti-karvonen-and-his-contributions',
      },
    ],
  },
  {
    slug: 'haskell',
    name: 'William L. Haskell',
    kind: 'researcher',
    role: 'Exercise physiologist and cardiovascular researcher; Professor (Research) of Medicine, Emeritus, Stanford University School of Medicine',
    biography: [
      'William L. Haskell is Professor (Research) of Medicine, Emeritus, in the Division of Cardiovascular Medicine at the Stanford University School of Medicine, and the former deputy director of the Stanford Prevention Research Center.',
      'His work has focused on the effects of exercise in cardiac disease prevention and rehabilitation.',
    ],
    background: [
      'B.S. in physical education, University of California, Santa Barbara (1960)',
      'M.S. (1962) and Ph.D. in exercise physiology, University of Illinois',
      'Postdoctoral training in chronic disease epidemiology',
      'Honorary doctorate of medicine, Linköping University, Sweden (1980)',
    ],
    contributions: [
      'Co-author, with S. M. Fox III and J. P. Naughton, of the 1971 review “Physical activity and the prevention of coronary heart disease” (Annals of Clinical Research).',
      'Tanaka and colleagues cite 1970s reviews by Fox and Haskell as the origin of the 220 − age rule. Robergs and Landwehr describe it as a superficial estimate, based on observation, of a best fit to data compiled in a 1971 review, not the product of original research.',
      'Co-editor, with Claude Bouchard and Steven N. Blair, of Physical Activity and Health (Human Kinetics, 2nd edition).',
    ],
    methods: ['mhr'],
    publicationIds: ['fox-1971'],
    furtherReadingIds: ['robergs-2002', 'tanaka-2001'],
    runningRelevance: [
      'Historical context for why 220 − age is presented in RunZones Lab as a legacy estimate rather than a precise prediction.',
    ],
    limits: [
      'This profile does not say Haskell personally devised or endorsed 220 − age as a validated equation. The sources read describe its origin in data compiled in the early 1970s.',
      'The 1971 review itself was not read for this project.',
    ],
    bioSources: [
      { label: 'Stanford Historical Society, oral history of William L. Haskell', url: 'https://purl.stanford.edu/ys705vq6277' },
      { label: 'Stanford Profiles, William Haskell', url: 'https://profiles.stanford.edu/william-haskell' },
    ],
  },
  {
    slug: 'friel',
    name: 'Joe Friel',
    kind: 'coach',
    role: 'Endurance sports coach and author',
    biography: [
      'Joe Friel holds a master’s degree in exercise science. His publisher biography says he was a marathoner and running coach through the 1970s and early 1980s; he is now best known as a cycling and triathlon coach.',
      'He is the author of The Triathlete’s Training Bible and The Cyclist’s Training Bible, among other books, and cofounded TrainingPeaks in 1999 with his son Dirk Friel and Gear Fisher.',
    ],
    background: ['Master’s degree in exercise science', 'Endurance coach and author; cofounder of TrainingPeaks (1999)'],
    contributions: [
      'As a coach rather than a laboratory researcher, Friel popularised practical field tests for setting heart rate training zones. His earlier guidance used a 30-minute solo time trial, taking the average heart rate of the last 20 minutes as lactate threshold heart rate.',
      'His revised “A Quick Guide to Setting Zones” (September 2025) uses a 20-minute test: take the average heart rate for the full 20 minutes and subtract 5% to estimate functional threshold heart rate (FTHR), which he describes as an approximation. This is the protocol in the threshold calculator.',
      'The %MHR and threshold zone percentages in RunZones Lab come from the zone table in his book High-Performance Cyclist (page 63, as supplied by the project owner).',
    ],
    methods: ['mhr', 'threshold'],
    publicationIds: ['friel-quick-guide-2025', 'friel-hpc-2025'],
    furtherReadingIds: ['faude-2009'],
    runningRelevance: [
      'His own career includes running coaching, but the zone table used here comes from a cycling book. His 2025 article says he no longer separates running and cycling zones.',
    ],
    limits: [
      'Friel’s zone tables and field tests are coaching methodology, not peer-reviewed research.',
      'A field estimate such as FTHR is an approximation and is not the same as a laboratory-measured lactate threshold heart rate.',
      '“Lactate threshold” is not a single standard measurement: a review located 25 different threshold concepts (Faude et al., 2009).',
    ],
    bioSources: [
      { label: 'Joe Friel’s blog, biography', url: 'https://joefrielsblog.com/biography/' },
      { label: 'Simon & Schuster, author page', url: 'https://simonandschuster.co.in/authors/Joe-Friel/213170109' },
      {
        label: 'TrainingPeaks, earlier 30-minute test guidance',
        url: 'https://www.trainingpeaks.com/learn/articles/joe-friel-s-quick-guide-to-setting-zones/',
      },
    ],
  },
];

export function getProfile(slug: string): ResearcherProfile | undefined {
  return RESEARCHER_PROFILES.find((p) => p.slug === slug);
}

// Home-page cards. Descriptors use only what the profiles above verify.
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

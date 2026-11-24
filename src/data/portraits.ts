import type { PortraitInfo } from '../types';

export const PORTRAITS: Partial<Record<string, PortraitInfo>> = {
  tanaka: {
    src: '/images/people/tanaka.jpg',
    alt: 'Portrait of Hirofumi Tanaka',
    rights: 'unverified',
    credit: 'Image: The University of Texas at Austin',
    sourceUrl: 'https://liberalarts.utexas.edu/caps/faculty/tanaka',
    width: 400,
    height: 500,
  },
  karvonen: {
    src: '/images/people/karvonen.jpg',
    alt: 'Portrait of Martti Karvonen',
    rights: 'unverified',
    credit: 'Image from The Lancet',
    sourceUrl:
    'https://www.thelancet.com/journals/lancet/article/PIIS0140-6736%2809%2961654-8/fulltext',
    width: 400,
    height: 500,
  },
  
  haskell: {
    src: '/images/people/haskell.jpg',
    alt: 'Portrait of William Haskell',
    rights: 'unverified',
    credit: 'Image: Stanford Medicine',
    sourceUrl:
    'https://med.stanford.edu/profiles/william-haskell',
    width: 400,
    height: 500,
  },
  
  friel: {
    src: '/images/people/friel.jpg',
    alt: 'Portrait of Joe Friel',
    rights: 'unverified',
    credit: 'Image: joefrieltraining.com',
    sourceUrl:
    'https://joefrieltraining.com/biography/',
    width: 400,
    height: 500,
  },
};

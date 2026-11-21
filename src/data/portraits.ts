import type { PortraitInfo } from '../types';

tanaka: {
      src: '/images/people/tanaka.jpg'
      alt: 'Portrait of Hirofumi Tanaka'
      rights: 'unverified'
      sourceUrl: 'https://minio.la.utexas.edu/colaweb-prod/person_files/1/10962/hirofumi_tanaka.jpg'
      width: 400
      height: 500
    }

karvonen: {
      src: '/images/people/karvonen.jpg'
    alt: 'Portrait of Martti Karvonen'
      rights: 'unverified'
      sourceUrl: 'https://www.thelancet.com/cms/10.1016/S0140-6736(09)61654-8/asset/d4ab5e76-dfc8-403a-91ab-6189bb719b19/main.assets/fx1.jpg'
      width: 400
      height: 500
    }

haskell: {
      src: '/images/people/haskell.jpg'
      alt: 'Portrait of William Haskell'
      rights: 'unverified'
      sourceUrl: 'https://med.stanford.edu/services/api/cap/profiles/photocache.6108.jpg'
      width: 400
      height: 500
    }
friel: {
      src: '/images/people/friel.jpg'
      alt: 'Portrait of Joe Friel'
      rights: 'unverified'
      sourceUrl: 'https://joefrieltraining.com/wp-content/uploads/2019/04/Joe-Friel-e1555694006520-360x360.jpg'
      width: 400
      height: 500
    }
    
export const PORTRAITS: Partial<Record<string, PortraitInfo>> = {};

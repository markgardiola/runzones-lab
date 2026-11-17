import type { PortraitInfo } from '../types';

/**
 * Portraits by profile slug (tanaka, karvonen, haskell, friel).
 * Add an entry ONLY when the image rights are clear (see docs/PORTRAITS.md). Example:
 *
 *   tanaka: {
 *     src: '/images/people/tanaka.jpg',          // file placed in public/images/people/
 *     alt: 'Portrait of Hirofumi Tanaka',
 *     credit: 'Photo: Jane Doe',
 *     license: 'CC BY-SA 4.0',                    // or 'Public domain' / 'Used with permission'
 *     sourceUrl: 'https://commons.wikimedia.org/wiki/File:Example.jpg',
 *     width: 400, height: 500,
 *   },
 *
 * Profiles without an entry show a neutral placeholder.
 */
export const PORTRAITS: Partial<Record<string, PortraitInfo>> = {};

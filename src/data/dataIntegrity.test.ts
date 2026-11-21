import { describe, expect, it } from 'vitest';
import type { ArticleBlock } from '../types';
import { ARTICLES, METHOD_ARTICLE_HEADINGS } from './articles';
import { CATEGORY_LABELS, CATEGORY_ORDER, REFERENCES, VERIFICATION_LABELS, getReference } from './references';
import { PORTRAITS } from './portraits';
import { RESEARCHER_HIGHLIGHTS, RESEARCHER_PROFILES } from './researchers';
import { ZONE_MODELS } from './zoneModels';

describe('reference library integrity', () => {
  it('ids are unique and every entry has the required fields', () => {
    const ids = REFERENCES.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of REFERENCES) {
      expect(r.title.length > 0 && r.authors.length > 0 && r.venue.length > 0 && r.relevance.length > 0).toBe(true);
      expect(r.year === null || (r.year >= 1900 && r.year <= 2100)).toBe(true);
    }
  });

  it('identifiers and links are well formed', () => {
    for (const r of REFERENCES) {
      if (r.identifiers.pmid) expect(/^\d+$/.test(r.identifiers.pmid)).toBe(true);
      if (r.identifiers.doi) expect(/^10\.\d{4,9}\/\S+$/.test(r.identifiers.doi)).toBe(true);
      if (r.url) expect(r.url.startsWith('https://')).toBe(true);
    }
  });

  it('every category and verification level used is defined', () => {
    for (const r of REFERENCES) {
      expect(Object.keys(CATEGORY_LABELS).includes(r.category)).toBe(true);
      expect(Object.keys(VERIFICATION_LABELS).includes(r.verification)).toBe(true);
    }
    expect([...CATEGORY_ORDER].sort()).toEqual(Object.keys(CATEGORY_LABELS).sort());
  });

  it('anything not read in full discloses that in a note', () => {
    for (const r of REFERENCES) {
      if (r.verification !== 'read-full') expect(`${r.id}: ${(r.note ?? '').length > 0}`).toBe(`${r.id}: true`);
    }
  });

  it('sources that were not read in full are never described as peer-reviewed findings without that disclosure', () => {
    const karvonen = getReference('karvonen-1957')!;
    expect(karvonen.verification).toBe('citation-only');
    expect(karvonen.note).toContain('not read');
  });
});

describe('researcher profile integrity', () => {
  it('slugs are unique, kinds are valid, and every profile has content and sources', () => {
    const slugs = RESEARCHER_PROFILES.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const p of RESEARCHER_PROFILES) {
      expect(['researcher', 'coach'].includes(p.kind)).toBe(true);
      expect(p.role.length > 0 && p.biography.length > 0 && p.contributions.length > 0).toBe(true);
      expect(p.limits.length > 0).toBe(true);
      expect(p.bioSources.length > 0).toBe(true);
      for (const s of p.bioSources) expect(s.url.startsWith('https://')).toBe(true);
    }
  });

  it('every referenced publication exists in the library', () => {
    for (const p of RESEARCHER_PROFILES) {
      for (const id of [...p.publicationIds, ...p.furtherReadingIds]) {
        expect(`${p.slug} -> ${id}: ${getReference(id) !== undefined}`).toBe(`${p.slug} -> ${id}: true`);
      }
    }
  });

  it('coaches are not presented as laboratory researchers, and vice versa', () => {
    const friel = RESEARCHER_PROFILES.find((p) => p.slug === 'friel')!;
    expect(friel.kind).toBe('coach');
    expect(friel.limits.some((l) => l.includes('not peer-reviewed research'))).toBe(true);
    expect(RESEARCHER_PROFILES.filter((p) => p.kind === 'researcher').map((p) => p.slug)).toEqual([
      'tanaka',
      'karvonen',
      'haskell',
    ]);
  });

  it('profiles contain no promotional language (verified facts only)', () => {
    const banned = /world-renowned|world’s most|most trusted|legendary|pioneer|best-selling|famous|genius/i;
    for (const p of RESEARCHER_PROFILES) {
      const text = [p.role, ...p.biography, ...p.background, ...p.contributions, ...p.runningRelevance, ...p.limits].join(' ');
      expect(`${p.slug}: ${banned.test(text)}`).toBe(`${p.slug}: false`);
    }
  });

  it('the Haskell profile does not claim he devised the 220 − age equation', () => {
    const h = RESEARCHER_PROFILES.find((p) => p.slug === 'haskell')!;
    expect(h.limits.some((l) => l.includes('does not say Haskell personally devised'))).toBe(true);
  });

  it('Home highlights point at real profiles', () => {
    for (const h of RESEARCHER_HIGHLIGHTS) {
      expect(RESEARCHER_PROFILES.some((p) => p.slug === h.slug)).toBe(true);
    }
  });
});

describe('zone presets cite real library entries', () => {
  it('every sourceId exists in the reference library', () => {
    for (const model of Object.values(ZONE_MODELS)) {
      for (const id of model.sourceIds) {
        expect(`${model.id} -> ${id}: ${getReference(id) !== undefined}`).toBe(`${model.id} -> ${id}: true`);
      }
    }
  });
});

describe('portraits', () => {
  it('only exist for real profiles and are always complete, self-hosted and credited', () => {
    for (const [slug, p] of Object.entries(PORTRAITS)) {
      expect(`${slug}: ${RESEARCHER_PROFILES.some((x) => x.slug === slug)}`).toBe(`${slug}: true`);
      expect(p!.src.startsWith('/images/people/')).toBe(true);
      expect(p!.alt.length > 0 && p!.credit.length > 0).toBe(true);
      expect(['cleared', 'unverified'].includes(p!.rights)).toBe(true);
      if (p!.rights === 'cleared') expect((p!.license ?? '').length > 0).toBe(true);
      expect(p!.sourceUrl.startsWith('https://')).toBe(true);
    }
  });
});


const textOf = (blocks: ArticleBlock[]): string =>
  blocks
    .map((b) => {
      switch (b.type) {
        case 'ul':
        case 'ol':
          return b.items.join(' ');
        case 'table':
          return [b.caption, ...b.head, ...b.rows.flat(), b.note ?? ''].join(' ');
        case 'example':
          return '';
        case 'callout':
          return `${b.title} ${b.text}`;
        default:
          return b.text;
      }
    })
    .join(' ');

describe('science articles', () => {
  it('slugs are unique and every referenced source exists', () => {
    const slugs = ARTICLES.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const a of ARTICLES) {
      expect(a.referenceIds.length > 0).toBe(true);
      for (const id of a.referenceIds) expect(`${a.slug} -> ${id}: ${getReference(id) !== undefined}`).toBe(`${a.slug} -> ${id}: true`);
    }
  });

  it('every parenthetical citation (Author, Year) is backed by a source listed for that article', () => {
    const months = /^(January|February|March|April|May|June|July|August|September|October|November|December)$/;
    for (const a of ARTICLES) {
      const refs = a.referenceIds.map((id) => getReference(id)!);
      for (const m of textOf(a.blocks).matchAll(/\(([^()]*?),? (\d{4})\)/g)) {
        const surname = m[1].split(/[ ,]/)[0];
        if (months.test(surname)) continue;
        const ok = refs.some((r) => r.authors.startsWith(surname) && r.year === Number(m[2]));
        expect(`${a.slug}: ${m[0]} -> ${ok}`).toBe(`${a.slug}: ${m[0]} -> true`);
      }
    }
  });

  it('the three method articles contain every required section, in order', () => {
    for (const slug of ['maximum-heart-rate-method', 'karvonen-heart-rate-reserve-method', 'threshold-field-testing-method']) {
      const a = ARTICLES.find((x) => x.slug === slug)!;
      const headings = a.blocks.filter((b) => b.type === 'h').map((b) => (b as { text: string }).text);
      const positions = METHOD_ARTICLE_HEADINGS.map((h) => headings.indexOf(h));
      expect(`${slug}: ${positions.every((p) => p >= 0)}`).toBe(`${slug}: true`);
      expect([...positions].sort((x, y) => x - y)).toEqual(positions);
    }
  });

  it('keeps the careful wording: second-hand Karvonen, FTHR is not a lab LTHR, no method is called better', () => {
    const get = (slug: string) => textOf(ARTICLES.find((a) => a.slug === slug)!.blocks);
    expect(get('karvonen-heart-rate-reserve-method')).toContain('has not read the 1957 paper itself');
    expect(get('threshold-field-testing-method')).toContain('not the same as a laboratory-measured lactate threshold heart rate');
    expect(get('five-zones')).toContain('No method is automatically better');
    expect(get('understanding-heart-rate')).toContain('at least 25 different threshold concepts');
  });

  it('articles contain no promotional or absolute wording', () => {
    const banned = /revolutionary|proven to|guaranteed|the best method|always accurate|world-renowned|miracle/i;
    for (const a of ARTICLES) expect(`${a.slug}: ${banned.test(textOf(a.blocks))}`).toBe(`${a.slug}: false`);
  });
});

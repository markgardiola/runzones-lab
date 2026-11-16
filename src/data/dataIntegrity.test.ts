import { describe, expect, it } from 'vitest';
import { CATEGORY_LABELS, CATEGORY_ORDER, REFERENCES, VERIFICATION_LABELS, getReference } from './references';
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

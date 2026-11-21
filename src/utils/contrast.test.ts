import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { blend, contrastRatio } from './contrast';

// Read the real palette from tailwind.config.js so the test cannot drift from the site.
const config = readFileSync(new URL('../../tailwind.config.js', import.meta.url), 'utf8');
const color = (name: string): string => {
  const m = config.match(new RegExp(`${name}:\\s*'(#[0-9A-Fa-f]{6})'`));
  if (!m) throw new Error(`colour ${name} not found in tailwind.config.js`);
  return m[1];
};
const zone = (n: number): string => {
  const m = config.match(new RegExp(`\\b${n}:\\s*'(#[0-9A-Fa-f]{6})'`));
  if (!m) throw new Error(`zone ${n} not found`);
  return m[1];
};

const paper = color('paper');
const ink = color('ink');
const muted = color('muted');
const line = color('line');
const accent = color('accent');
const AA = 4.5; // WCAG AA for normal text

describe('contrast helper', () => {
  it('matches known values', () => {
    expect(Math.abs(contrastRatio('#000000', '#ffffff') - 21) < 0.01).toBe(true);
    expect(Math.abs(contrastRatio('#777777', '#ffffff') - 4.48) < 0.02).toBe(true);
    expect(blend('#000000', '#ffffff', 0.5)).toBe('#808080');
  });
});

describe('text colours meet WCAG AA (4.5:1) on the backgrounds they are used on', () => {
  const cases: [string, string, string][] = [
    ['body text', ink, paper],
    ['secondary text', muted, paper],
    ['accent text and links', accent, paper],
    ['primary button text', paper, ink],
    ['primary button hover', paper, accent],
    ['text on the light callout and placeholder tint', ink, blend(line, paper, 0.3)],
    ['muted text on the placeholder tint', muted, blend(line, paper, 0.4)],
  ];
  for (const [name, fg, bg] of cases) {
    const r = contrastRatio(fg, bg);
    it(`${name} (${r.toFixed(1)}:1)`, () => {
      expect(r >= AA).toBe(true);
    });
  }

  for (let z = 1; z <= 5; z++) {
    const r = contrastRatio(ink, zone(z));
    it(`Zone ${z} label text, ink on the zone colour (${r.toFixed(1)}:1)`, () => {
      expect(r >= AA).toBe(true);
    });
  }

  // Open-ended segments are drawn faded. Only the background may fade: fading the text too
  // (opacity on the whole element) drops Zone 5 to about 2.9:1.
  const FADE = 0.7;
  for (let z = 1; z <= 5; z++) {
    const r = contrastRatio(ink, blend(zone(z), paper, FADE));
    it(`Zone ${z} label on the faded (open-ended) background (${r.toFixed(1)}:1)`, () => {
      expect(r >= AA).toBe(true);
    });
  }
});

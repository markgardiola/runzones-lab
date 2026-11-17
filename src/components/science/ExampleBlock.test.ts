import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { ExampleKey } from '../../types';
import ExampleBlock from './ExampleBlock';

const html = (example: ExampleKey) => renderToStaticMarkup(createElement(ExampleBlock, { example }));

describe('article examples are computed by the engine and match the hand-verified numbers', () => {
  it('%MHR, measured HRmax 190', () => {
    const h = html('mhr-190');
    for (const t of ['139–157 bpm', '158–166 bpm', '175–190 bpm', '190 × 73%', '138.7 bpm']) expect(h.includes(t)).toBe(true);
  });
  it('%MHR, Tanaka estimate at 40', () => {
    const h = html('mhr-tanaka-40');
    expect(h.includes('166–180 bpm') && h.includes('≤ 130 bpm') && h.includes('180 bpm (estimated)')).toBe(true);
  });
  it('%HRR, HRmax 190 and RHR 50', () => {
    const h = html('hrr-190-50');
    for (const t of ['120–133 bpm', '176–190 bpm', '50 + (140 × 70%)', 'HRR = 190 − 50 = 140 bpm', 'Up to 119 bpm is below Zone 1']) expect(h.includes(t)).toBe(true);
  });
  it('resting heart rate effect at 70%', () => {
    const h = html('resting-hr-effect');
    expect(h.includes('133 bpm') && h.includes('148 bpm') && h.includes('154 bpm')).toBe(true);
  });
  it('FTHR from a 20-minute average of 170', () => {
    const h = html('fthr-170');
    for (const t of ['161.5 bpm', '126–140 bpm', '162+ bpm', '5a: 162–165 bpm', '140.505 bpm']) expect(h.includes(t)).toBe(true);
  });
  it('Zone 2 across the three methods', () => {
    const h = html('compare-zone2');
    expect(h.includes('139–157 bpm') && h.includes('134–147 bpm') && h.includes('126–140 bpm')).toBe(true);
  });
  it('preset percentage table is taken from the preset data, with status badges', () => {
    const h = html('compare-presets');
    expect(h.includes('73% to under 83%') && h.includes('50% to under 60%') && h.includes('78% to under 87%')).toBe(true);
    expect(h.includes('92–100%') && h.includes('100% and above')).toBe(true);
    expect(/Sourced preset/.test(h) && /Provisional preset/.test(h)).toBe(true);
  });
  it('general zone labels', () => {
    const h = html('zone-labels');
    expect(h.includes('Recovery / Very Easy') && h.includes('High Intensity / Maximum Effort')).toBe(true);
  });
});

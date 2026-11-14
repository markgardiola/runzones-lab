import type { MethodId } from '../../types';

// Each method gets a restrained identifier that does not depend on colour: a glyph and a border style.
export const METHOD_STYLE: Record<MethodId, { glyph: string; border: string; name: string }> = {
  mhr: { glyph: '●', border: 'border-solid', name: '%MHR' },
  hrr: { glyph: '■', border: 'border-dashed', name: '%HRR' },
  threshold: { glyph: '▲', border: 'border-dotted', name: 'Threshold-based' },
};

export const METHOD_ORDER: MethodId[] = ['mhr', 'hrr', 'threshold'];

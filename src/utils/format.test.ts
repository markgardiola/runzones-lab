import { describe, expect, it } from 'vitest';
import { formatBpmRange, formatNumber, formatPctRange, parseNumberInput } from './format';

describe('formatNumber', () => {
  it('trims trailing zeros and keeps up to 3 decimals', () => {
    expect(formatNumber(190)).toBe('190');
    expect(formatNumber(161.5)).toBe('161.5');
    expect(formatNumber(140.505)).toBe('140.505');
    expect(formatNumber(100)).toBe('100');
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(83.5)).toBe('83.5');
  });
});

describe('range formatting', () => {
  it('bpm ranges, including open ends', () => {
    expect(formatBpmRange({ lowerBpm: 139, upperBpm: 157 })).toBe('139–157 bpm');
    expect(formatBpmRange({ lowerBpm: null, upperBpm: 138 })).toBe('≤ 138 bpm');
    expect(formatBpmRange({ lowerBpm: 162, upperBpm: null })).toBe('162+ bpm');
  });
  it('percentage ranges make the boundary convention explicit', () => {
    expect(formatPctRange({ lowerPct: 73, upperPct: 83, upperInclusive: false })).toBe('73% to under 83%');
    expect(formatPctRange({ lowerPct: 92, upperPct: 100, upperInclusive: true })).toBe('92–100%');
    expect(formatPctRange({ lowerPct: null, upperPct: 73, upperInclusive: false })).toBe('below 73%');
    expect(formatPctRange({ lowerPct: 100, upperPct: null, upperInclusive: false })).toBe('100% and above');
  });
});

describe('parseNumberInput', () => {
  it('maps blank to null and text to numbers', () => {
    expect(parseNumberInput('')).toBeNull();
    expect(parseNumberInput('  ')).toBeNull();
    expect(parseNumberInput('185.5')).toBe(185.5);
    expect(Number.isNaN(parseNumberInput('abc'))).toBe(true);
  });
});

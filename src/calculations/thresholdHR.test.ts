import { describe, expect, it } from 'vitest';
import { calculateThresholdZones, estimateFTHRThousandths } from './thresholdHR';
import { errorCodes, isContiguous, must, ranges, warningCodes } from './testHelpers';

describe('field-estimated FTHR', () => {
  it('FTHR = 20-minute average x 0.95, exact', () => {
    expect(estimateFTHRThousandths(1700)).toBe(161500); // 170 -> 161.5
    expect(estimateFTHRThousandths(1685)).toBe(160075); // 168.5 -> 160.075
  });

  it('matches the hand-verified zone example (average 170 -> FTHR 161.5)', () => {
    const calc = must(calculateThresholdZones({ avg20: 170 }));
    expect(calc.anchor.value).toBe(161.5);
    expect(calc.boundaries.map((b) => b.bpm)).toEqual([126, 141, 152, 162]);
    expect(ranges(calc)).toEqual([[null, 125], [126, 140], [141, 151], [152, 161], [162, null]]);
    expect(calc.zones[4].subBands?.map((s) => [s.label, s.lowerBpm, s.upperBpm])).toEqual([
      ['5a', 162, 165],
      ['5b', 166, null],
    ]);
    expect(calc.status).toBe('confirmed');
  });

  it('rounds the exact half 87% x 161.5 = 140.505 up to 141', () => {
    const calc = must(calculateThresholdZones({ avg20: 170 }));
    const b = calc.boundaries.find((x) => x.pct === 87);
    expect(b?.bpm).toBe(141);
    expect(b?.exactBpm).toBeCloseTo(140.505, 9);
  });

  it('is labelled as a field estimate, never as laboratory LTHR', () => {
    const calc = must(calculateThresholdZones({ avg20: 170 }));
    expect(calc.anchor.label).toContain('field estimate');
    expect(calc.anchor.label.includes('Lactate')).toBe(false);
  });

  it('accepts one decimal place and rejects more', () => {
    expect(must(calculateThresholdZones({ avg20: 168.4 })).anchor.value).toBeCloseTo(159.98, 9);
    expect(errorCodes(calculateThresholdZones({ avg20: 168.45 }))).toEqual(['too_precise']);
  });

  it('missing and invalid inputs are errors', () => {
    expect(errorCodes(calculateThresholdZones({ avg20: null }))).toEqual(['missing']);
    expect(errorCodes(calculateThresholdZones({ avg20: undefined }))).toEqual(['missing']);
    expect(errorCodes(calculateThresholdZones({ avg20: 0 }))).toEqual(['not_positive']);
    expect(errorCodes(calculateThresholdZones({ avg20: 400 }))).toEqual(['out_of_range']);
  });

  it('warns on an unusual average', () => {
    expect(warningCodes(calculateThresholdZones({ avg20: 90 }))).toEqual(['unusual_value']);
  });

  it('zones are contiguous for every plausible average (100 to 230 bpm in 0.5 steps)', () => {
    for (let t = 1000; t <= 2300; t += 5) {
      const r = calculateThresholdZones({ avg20: t / 10 });
      const calc = must(r);
      expect(isContiguous({ ...calc, zones: calc.zones.slice(0, 4) })).toBe(true);
      expect(calc.zones[4].lowerBpm).toBe((calc.zones[3].upperBpm as number) + 1);
    }
  });
});

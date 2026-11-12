import { describe, expect, it } from 'vitest';
import { calculateHrrZones } from '../calculations/heartRateReserve';
import { calculateMhrZones } from '../calculations/maximumHR';
import { calculateThresholdZones } from '../calculations/thresholdHR';
import { must } from '../calculations/testHelpers';
import { describeSubstitution } from './breakdown';

describe('describeSubstitution', () => {
  it('%MHR shows HRmax x percentage', () => {
    const calc = must(calculateMhrZones({ hrmax: { source: 'measured', measured: 190 } }));
    expect(describeSubstitution(calc, calc.boundaries[0])).toBe('190 × 73%');
  });
  it('%HRR shows RHR + (HRR x percentage)', () => {
    const calc = must(calculateHrrZones({ hrmax: { source: 'measured', measured: 190 }, rhr: 50 }));
    expect(describeSubstitution(calc, calc.boundaries[2])).toBe('50 + (140 × 70%)');
  });
  it('FTHR shows estimated FTHR x percentage', () => {
    const calc = must(calculateThresholdZones({ avg20: 170 }));
    expect(describeSubstitution(calc, calc.boundaries[1])).toBe('161.5 × 87%');
  });
});

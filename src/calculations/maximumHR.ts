import { ZONE_MODELS } from '../data/zoneModels';
import type { HRmaxSource, Validated, ValidationIssue, ZoneCalculation } from '../types';
import { calculateZones } from './zoneCalculator';
import { fail, HR_SPECS, ok, validateAge, validateHeartRate } from './validation';

export interface HRmaxInput {
  source: HRmaxSource;
  age?: number | null;
  measured?: number | null;
}

export interface ResolvedHRmax {
  /** Exact, in tenths of a bpm. Not rounded. */
  tenths: number;
  bpm: number;
  source: HRmaxSource;
  estimated: boolean;
  sourceLabel: string;
  formula: string;
}

/** Tanaka, Monahan and Seals (2001): 208 - 0.7 x age, in tenths of a bpm. */
export function tanakaHRmaxTenths(age: number): number {
  return 2080 - 7 * age;
}

/** Legacy estimate: 220 - age, in tenths of a bpm. */
export function traditionalHRmaxTenths(age: number): number {
  return 2200 - 10 * age;
}

export function resolveHRmax(input: HRmaxInput): Validated<ResolvedHRmax> {
  if (input.source === 'measured') {
    const r = validateHeartRate(HR_SPECS.hrmax, input.measured);
    if (!r.ok) return r;
    return ok(
      {
        tenths: r.value,
        bpm: r.value / 10,
        source: 'measured',
        estimated: false,
        sourceLabel: 'Measured value entered by you',
        formula: 'HRmax = measured value',
      },
      r.warnings,
    );
  }
  const age = validateAge(input.age);
  if (!age.ok) return age;
  const tenths = input.source === 'tanaka' ? tanakaHRmaxTenths(age.value) : traditionalHRmaxTenths(age.value);
  const warnings: ValidationIssue[] = [...age.warnings];
  return ok(
    {
      tenths,
      bpm: tenths / 10,
      source: input.source,
      estimated: true,
      sourceLabel:
        input.source === 'tanaka'
          ? 'Estimated: Tanaka, Monahan and Seals (2001)'
          : 'Estimated: traditional 220 - age (legacy estimate)',
      formula: input.source === 'tanaka' ? 'HRmax = 208 - (0.7 x age)' : 'HRmax = 220 - age',
    },
    warnings,
  );
}

export interface MhrInput {
  hrmax: HRmaxInput;
  /** Optional custom zone edges (percent). */
  edges?: (number | null)[];
}

export function calculateMhrZones(input: MhrInput): Validated<ZoneCalculation> {
  const hr = resolveHRmax(input.hrmax);
  if (!hr.ok) return fail(hr.errors, hr.warnings);
  return calculateZones(
    ZONE_MODELS.mhr,
    {
      baseNum: 0,
      spanNum: hr.value.tenths,
      den: 10,
      summary: {
        kind: 'hrmax',
        label: 'Maximum heart rate',
        value: hr.value.bpm,
        formula: 'Target HR = HRmax x zone percentage',
        details: {
          'HRmax source': hr.value.sourceLabel,
          'HRmax formula': hr.value.formula,
          HRmax: hr.value.bpm,
        },
      },
    },
    input.edges,
    hr.warnings,
  );
}

import type { Validated, ValidationIssue } from '../types';
import { toTenths } from '../utils/numeric';

type Raw = number | null | undefined;

export function issue(
  severity: 'error' | 'warning',
  field: string,
  code: string,
  message: string,
): ValidationIssue {
  return { severity, field, code, message };
}

export function ok<T>(value: T, warnings: ValidationIssue[] = []): Validated<T> {
  return { ok: true, value, warnings };
}

export function fail<T>(errors: ValidationIssue[], warnings: ValidationIssue[] = []): Validated<T> {
  return { ok: false, errors, warnings };
}

function checkPresent(field: string, label: string, v: Raw): ValidationIssue | null {
  if (v === null || v === undefined || Number.isNaN(v)) {
    return issue('error', field, 'missing', `${label} is required.`);
  }
  if (!Number.isFinite(v)) {
    return issue('error', field, 'not_finite', `${label} must be a number.`);
  }
  return null;
}

/** Age in whole years, for age-based HRmax estimates. */
export function validateAge(age: Raw): Validated<number> {
  const missing = checkPresent('age', 'Age', age);
  if (missing) return fail([missing]);
  const a = age as number;
  if (!Number.isInteger(a)) {
    return fail([issue('error', 'age', 'not_integer', 'Age must be a whole number of years.')]);
  }
  if (a <= 0 || a > 120) {
    return fail([issue('error', 'age', 'out_of_range', 'Age must be between 1 and 120 years.')]);
  }
  const warnings: ValidationIssue[] = [];
  if (a < 18 || a > 81) {
    warnings.push(
      issue(
        'warning',
        'age',
        'outside_studied_range',
        'Age-based estimates are less well supported outside roughly 18 to 81 years, the range of the Tanaka et al. laboratory sample.',
      ),
    );
  }
  return ok(a, warnings);
}

interface HRSpec {
  field: string;
  label: string;
  warnLow: number;
  warnHigh: number;
}

export const HR_SPECS = {
  hrmax: { field: 'hrmax', label: 'Maximum heart rate', warnLow: 120, warnHigh: 230 },
  rhr: { field: 'rhr', label: 'Resting heart rate', warnLow: 30, warnHigh: 100 },
  avg20: { field: 'avg20', label: '20-minute average heart rate', warnLow: 100, warnHigh: 230 },
} as const satisfies Record<string, HRSpec>;

const HARD_MAX_BPM = 300;

/** Validates a heart rate in bpm (at most one decimal place). Returns integer tenths of a bpm. */
export function validateHeartRate(spec: HRSpec, value: Raw): Validated<number> {
  const missing = checkPresent(spec.field, spec.label, value);
  if (missing) return fail([missing]);
  const v = value as number;
  if (v <= 0) {
    return fail([issue('error', spec.field, 'not_positive', `${spec.label} must be greater than zero.`)]);
  }
  if (v > HARD_MAX_BPM) {
    return fail([
      issue('error', spec.field, 'out_of_range', `${spec.label} cannot exceed ${HARD_MAX_BPM} bpm.`),
    ]);
  }
  const tenths = toTenths(v);
  if (tenths === null) {
    return fail([
      issue('error', spec.field, 'too_precise', `${spec.label} can have at most one decimal place.`),
    ]);
  }
  const warnings: ValidationIssue[] = [];
  if (v < spec.warnLow || v > spec.warnHigh) {
    warnings.push(
      issue(
        'warning',
        spec.field,
        'unusual_value',
        `${spec.label} of ${v} bpm is outside the usual range of ${spec.warnLow}–${spec.warnHigh} bpm. Please check the value.`,
      ),
    );
  }
  return ok(tenths, warnings);
}

/** Cross-check for the HRR method. Both values are in tenths of a bpm. */
export function validateRestingVsMax(rhrTenths: number, hrmaxTenths: number): Validated<true> {
  if (rhrTenths >= hrmaxTenths) {
    return fail([
      issue(
        'error',
        'rhr',
        'rhr_not_below_hrmax',
        'Resting heart rate must be lower than maximum heart rate.',
      ),
    ]);
  }
  const warnings: ValidationIssue[] = [];
  if (hrmaxTenths - rhrTenths < 400) {
    warnings.push(
      issue(
        'warning',
        'rhr',
        'small_reserve',
        'Heart rate reserve is under 40 bpm, so the zones will be very narrow. Please check both values.',
      ),
    );
  }
  return ok(true, warnings);
}

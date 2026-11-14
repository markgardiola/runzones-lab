import type { HRmaxSource, MethodId, Validated, ValidationIssue, ZoneCalculation } from '../types';
import { formatNumber } from '../utils/format';
import { calculateHrrZones } from './heartRateReserve';
import { calculateMhrZones, resolveHRmax, type HRmaxInput, type ResolvedHRmax } from './maximumHR';
import { calculateThresholdZones } from './thresholdHR';
import { HR_SPECS, issue, validateHeartRate } from './validation';

type Edges = (number | null)[];

export interface ComparisonInput {
  age: number | null | undefined;
  measuredHrmax: number | null | undefined;
  /** Shared HRmax source. null = not chosen yet (never defaulted). */
  hrmaxSource: HRmaxSource | null;
  /** Optional per-method HRmax source, when the user wants different assumptions. */
  hrmaxSourceOverrides?: Partial<Record<'mhr' | 'hrr', HRmaxSource>>;
  rhr: number | null | undefined;
  avg20: number | null | undefined;
  /** Optional custom zone edges per method (percent). */
  edges?: Partial<Record<MethodId, Edges>>;
}

export type MethodState = 'complete' | 'incomplete' | 'invalid';

export interface MethodOutcome {
  method: MethodId;
  state: MethodState;
  /** Plain-language names of the inputs this method still needs (incomplete state). */
  missing: string[];
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  calc: ZoneCalculation | null;
  hrmax: ResolvedHRmax | null;
  /** Assumptions shown to the user, so nothing is hidden. */
  assumptions: string[];
}

export interface ComparisonResult {
  outcomes: Record<MethodId, MethodOutcome>;
  /** Cross-input consistency issues. Errors are blocking. */
  issues: ValidationIssue[];
  blocking: boolean;
}

export const METHOD_LABELS: Record<MethodId, string> = {
  mhr: '%MHR',
  hrr: '%HRR',
  threshold: 'Threshold-based',
};

const FIELD_LABELS: Record<string, string> = {
  age: 'Age',
  hrmax: 'Measured maximum heart rate',
  rhr: 'Resting heart rate',
  avg20: '20-minute average heart rate',
};

function unique<T>(a: T[]): T[] {
  return [...new Set(a)];
}

function incomplete(method: MethodId, missing: string[]): MethodOutcome {
  return { method, state: 'incomplete', missing, errors: [], warnings: [], calc: null, hrmax: null, assumptions: [] };
}

function invalid(method: MethodId, errors: ValidationIssue[], warnings: ValidationIssue[] = []): MethodOutcome {
  return { method, state: 'invalid', missing: [], errors, warnings, calc: null, hrmax: null, assumptions: [] };
}

function assumptionsFor(calc: ZoneCalculation, hrmax: ResolvedHRmax | null): string[] {
  const d = calc.anchor.details;
  const out: string[] = [];
  if (calc.method === 'mhr' || calc.method === 'hrr') {
    if (hrmax) out.push(`HRmax: ${formatNumber(hrmax.bpm)} bpm (${hrmax.sourceLabel.toLowerCase()})`);
  }
  if (calc.method === 'hrr') out.push(`Resting heart rate: ${formatNumber(d['Resting HR'] as number)} bpm`);
  if (calc.method === 'threshold') {
    out.push(`20-minute average heart rate: ${formatNumber(d['20-minute average HR'] as number)} bpm`);
    out.push(
      `Estimated FTHR: ${formatNumber(d['Estimated FTHR'] as number)} bpm (average × 0.95; a field estimate, not a laboratory measurement)`,
    );
  }
  out.push(`Zone percentages: ${calc.modelLabel}`);
  if (calc.belowZone1MaxBpm !== null) out.push(`Up to ${calc.belowZone1MaxBpm} bpm is below Zone 1.`);
  return out;
}

function fromResult(method: MethodId, r: Validated<ZoneCalculation>, hrmax: ResolvedHRmax | null): MethodOutcome {
  if (r.ok) {
    return {
      method,
      state: 'complete',
      missing: [],
      errors: [],
      warnings: r.warnings,
      calc: r.value,
      hrmax,
      assumptions: assumptionsFor(r.value, hrmax),
    };
  }
  if (r.errors.every((e) => e.code === 'missing')) {
    return incomplete(method, unique(r.errors.map((e) => FIELD_LABELS[e.field] ?? e.field)));
  }
  return invalid(method, r.errors, r.warnings);
}

function evalHrmaxMethod(method: 'mhr' | 'hrr', input: ComparisonInput): MethodOutcome {
  const source = input.hrmaxSourceOverrides?.[method] ?? input.hrmaxSource;
  const edges = input.edges?.[method];
  if (source === null) {
    const missing = ['HRmax source'];
    if (method === 'hrr') {
      const r = validateHeartRate(HR_SPECS.rhr, input.rhr);
      if (!r.ok) {
        if (r.errors.every((e) => e.code === 'missing')) missing.push(FIELD_LABELS.rhr);
        else return invalid(method, r.errors);
      }
    }
    return incomplete(method, missing);
  }
  const hrmaxInput: HRmaxInput = { source, age: input.age, measured: input.measuredHrmax };
  const resolved = resolveHRmax(hrmaxInput);
  const r =
    method === 'mhr'
      ? calculateMhrZones({ hrmax: hrmaxInput, edges })
      : calculateHrrZones({ hrmax: hrmaxInput, rhr: input.rhr, edges });
  return fromResult(method, r, resolved.ok ? resolved.value : null);
}

/**
 * Evaluates all three methods independently, each with its own input requirements. A method that
 * lacks inputs is reported as incomplete; nothing is ever guessed or borrowed from another method.
 */
export function compareMethods(input: ComparisonInput): ComparisonResult {
  const mhr = evalHrmaxMethod('mhr', input);
  const hrr = evalHrmaxMethod('hrr', input);
  const avg = calculateThresholdZones({ avg20: input.avg20, edges: input.edges?.threshold });
  const threshold = fromResult('threshold', avg, null);

  const issues: ValidationIssue[] = [];
  const avgV = validateHeartRate(HR_SPECS.avg20, input.avg20);
  const rhrV = validateHeartRate(HR_SPECS.rhr, input.rhr);
  const avgBpm = avgV.ok ? avgV.value / 10 : null;
  const rhrBpm = rhrV.ok ? rhrV.value / 10 : null;

  if (avgBpm !== null && rhrBpm !== null && rhrBpm >= avgBpm) {
    issues.push(
      issue(
        'error',
        'rhr',
        'rhr_not_below_avg20',
        `Your resting heart rate (${formatNumber(rhrBpm)} bpm) is not lower than your 20-minute average (${formatNumber(avgBpm)} bpm). One of these values is probably wrong.`,
      ),
    );
  }

  if (avgBpm !== null) {
    const seen = new Set<string>();
    for (const hr of [mhr.hrmax, hrr.hrmax]) {
      if (!hr || avgBpm <= hr.bpm) continue;
      const key = `${hr.source}-${hr.bpm}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (hr.estimated) {
        issues.push(
          issue(
            'warning',
            'avg20',
            'avg20_above_estimated_hrmax',
            `Your 20-minute average (${formatNumber(avgBpm)} bpm) is above the estimated HRmax of ${formatNumber(hr.bpm)} bpm. The estimate may be too low, since equation estimates are off by roughly 10 bpm for many people.`,
          ),
        );
      } else {
        issues.push(
          issue(
            'error',
            'avg20',
            'avg20_above_measured_hrmax',
            `Your 20-minute average (${formatNumber(avgBpm)} bpm) is above your measured HRmax (${formatNumber(hr.bpm)} bpm). One of these values is probably wrong.`,
          ),
        );
      }
    }
  }

  return {
    outcomes: { mhr, hrr, threshold },
    issues,
    blocking: issues.some((i) => i.severity === 'error'),
  };
}

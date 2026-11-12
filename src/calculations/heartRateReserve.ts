import { ZONE_MODELS } from '../data/zoneModels';
import type { Validated, ZoneCalculation } from '../types';
import { resolveHRmax, type HRmaxInput } from './maximumHR';
import { calculateZones } from './zoneCalculator';
import { fail, HR_SPECS, validateHeartRate, validateRestingVsMax } from './validation';

export interface HrrInput {
  hrmax: HRmaxInput;
  rhr: number | null | undefined;
  edges?: (number | null)[];
}

/** HRR = HRmax - RHR, in tenths of a bpm. */
export function heartRateReserveTenths(hrmaxTenths: number, rhrTenths: number): number {
  return hrmaxTenths - rhrTenths;
}

export function calculateHrrZones(input: HrrInput): Validated<ZoneCalculation> {
  const hr = resolveHRmax(input.hrmax);
  const rhr = validateHeartRate(HR_SPECS.rhr, input.rhr);
  const errors = [...(hr.ok ? [] : hr.errors), ...(rhr.ok ? [] : rhr.errors)];
  const warnings = [...hr.warnings, ...rhr.warnings];
  if (!hr.ok || !rhr.ok) return fail(errors, warnings);

  const cross = validateRestingVsMax(rhr.value, hr.value.tenths);
  if (!cross.ok) return fail(cross.errors, warnings);
  warnings.push(...cross.warnings);

  const hrrTenths = heartRateReserveTenths(hr.value.tenths, rhr.value);
  return calculateZones(
    ZONE_MODELS.hrr,
    {
      baseNum: rhr.value,
      spanNum: hrrTenths,
      den: 10,
      summary: {
        kind: 'hrr',
        label: 'Heart rate reserve',
        value: hrrTenths / 10,
        formula: 'HRR = HRmax - RHR; Target HR = RHR + (HRR x zone percentage)',
        details: {
          'HRmax source': hr.value.sourceLabel,
          HRmax: hr.value.bpm,
          'Resting HR': rhr.value / 10,
          HRR: hrrTenths / 10,
        },
      },
    },
    input.edges,
    warnings,
  );
}

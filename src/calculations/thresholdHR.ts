import { ZONE_MODELS } from '../data/zoneModels';
import type { Validated, ZoneCalculation } from '../types';
import { calculateZones } from './zoneCalculator';
import { HR_SPECS, fail, validateHeartRate } from './validation';

export const FTHR_FACTOR_NUM = 95;
export const FTHR_FACTOR_DEN = 100;

export interface ThresholdInput {
  /** Average heart rate over the full 20-minute time trial, in bpm. */
  avg20: number | null | undefined;
  edges?: (number | null)[];
}

/** Estimated FTHR = 20-minute average x 0.95, exact, in thousandths of a bpm. */
export function estimateFTHRThousandths(avg20Tenths: number): number {
  return (avg20Tenths * FTHR_FACTOR_NUM * 100) / FTHR_FACTOR_DEN;
}

export function calculateThresholdZones(input: ThresholdInput): Validated<ZoneCalculation> {
  const avg = validateHeartRate(HR_SPECS.avg20, input.avg20);
  if (!avg.ok) return fail(avg.errors, avg.warnings);
  const fthrThousandths = estimateFTHRThousandths(avg.value);
  return calculateZones(
    ZONE_MODELS.threshold,
    {
      baseNum: 0,
      spanNum: avg.value * FTHR_FACTOR_NUM, // avg in tenths x 95; den 1000 converts to bpm
      den: 1000,
      summary: {
        kind: 'fthr',
        label: 'Estimated functional threshold heart rate (field estimate)',
        value: fthrThousandths / 1000,
        formula: 'Estimated FTHR = 20-minute average HR x 0.95; Target HR = FTHR x zone percentage',
        details: {
          '20-minute average HR': avg.value / 10,
          'Estimated FTHR': fthrThousandths / 1000,
        },
      },
    },
    input.edges,
    avg.warnings,
  );
}

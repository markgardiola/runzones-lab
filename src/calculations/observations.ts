import { ZONE_MODELS } from '../data/zoneModels';
import { formatNumber } from '../utils/format';
import { roundDivHalfUp } from '../utils/numeric';
import { METHOD_LABELS, type ComparisonInput, type ComparisonResult } from './comparison';
import { tanakaHRmaxTenths, traditionalHRmaxTenths } from './maximumHR';
import { HR_SPECS, validateAge, validateHeartRate } from './validation';
import type { MethodId } from '../types';

export interface Observation {
  id: string;
  text: string;
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** Whole-bpm range by which a 10 bpm HRmax error moves a model's interior boundaries. */
function errorShift(method: 'mhr' | 'hrr'): [number, number] {
  const interior = ZONE_MODELS[method].edges.slice(1, 5).filter((e): e is number => e !== null);
  return [Math.round((10 * Math.min(...interior)) / 100), Math.round((10 * Math.max(...interior)) / 100)];
}

/**
 * Educational observations that depend on the user's actual numbers. Each is only produced when
 * the data it needs is present; nothing is assumed.
 */
export function buildObservations(result: ComparisonResult, input: ComparisonInput): Observation[] {
  const out: Observation[] = [];
  const { mhr, hrr, threshold } = result.outcomes;
  const methods: MethodId[] = ['mhr', 'hrr', 'threshold'];

  // Incomplete or invalid methods
  const notes: string[] = [];
  for (const m of methods) {
    const o = result.outcomes[m];
    if (o.state === 'incomplete') notes.push(`${METHOD_LABELS[m]} is incomplete: it still needs ${joinList(o.missing.map((x) => x.toLowerCase()))}.`);
    if (o.state === 'invalid') notes.push(`${METHOD_LABELS[m]} could not be calculated: ${o.errors[0]?.message ?? 'invalid input.'}`);
  }
  if (notes.length > 0) out.push({ id: 'incomplete', text: notes.join(' ') });

  // Resting HR changes the HRR result
  const rhrV = validateHeartRate(HR_SPECS.rhr, input.rhr);
  if (hrr.state === 'complete' && hrr.hrmax && rhrV.ok) {
    const h = hrr.hrmax.tenths;
    const r = rhrV.value;
    const mhrAt70 = roundDivHalfUp(h * 70, 1000);
    const hrrAt70 = roundDivHalfUp(r * 100 + (h - r) * 70, 1000);
    out.push({
      id: 'resting-hr',
      text: `Resting heart rate changes the %HRR result. With a resting heart rate of ${formatNumber(r / 10)} bpm and an HRmax of ${formatNumber(h / 10)} bpm, 70% of heart rate reserve is ${hrrAt70} bpm, while 70% of HRmax would be ${mhrAt70} bpm, a difference of ${hrrAt70 - mhrAt70} bpm. That gap equals resting heart rate × (1 − percentage), so it is largest at low percentages and disappears at 100%.`,
    });
  }

  // Estimated vs measured HRmax
  const used = ([['mhr', mhr], ['hrr', hrr]] as const).filter(([, o]) => o.state === 'complete' && o.hrmax);
  const estimated = used.filter(([, o]) => o.hrmax!.estimated);
  if (estimated.length > 0) {
    const values = [...new Set(estimated.map(([, o]) => formatNumber(o.hrmax!.bpm)))];
    const shifts = estimated.map(([m]) => {
      const [lo, hi] = errorShift(m);
      return `${METHOD_LABELS[m]} boundaries by about ${lo}–${hi} bpm`;
    });
    out.push({
      id: 'estimated-hrmax',
      text: `Your HRmax of ${joinList(values.map((v) => `${v} bpm`))} is an estimate. Individual differences from equation estimates are roughly 10 bpm (Tanaka et al., 2001), and because these zones scale with HRmax, a 10 bpm error would move the ${joinList(shifts)}.`,
    });
    const age = validateAge(input.age);
    if (age.ok) {
      const t = tanakaHRmaxTenths(age.value);
      const l = traditionalHRmaxTenths(age.value);
      out.push({
        id: 'equations',
        text: `At age ${age.value}, the Tanaka equation gives ${formatNumber(t / 10)} bpm and 220 − age gives ${formatNumber(l / 10)} bpm, a difference of ${formatNumber(Math.abs(t - l) / 10)} bpm. The choice of equation alone changes the zones.`,
      });
    }
  } else if (used.length > 0) {
    out.push({
      id: 'measured-hrmax',
      text: 'Your HRmax is a measured value, so these zones do not depend on an age-based equation. They are still only as accurate as the effort the measurement came from.',
    });
  }
  if (mhr.state === 'complete' && hrr.state === 'complete' && mhr.hrmax && hrr.hrmax && mhr.hrmax.sourceLabel !== hrr.hrmax.sourceLabel) {
    out.push({
      id: 'different-sources',
      text: `%MHR and %HRR use different HRmax sources (${mhr.hrmax.sourceLabel.toLowerCase()} and ${hrr.hrmax.sourceLabel.toLowerCase()}), so part of the difference between those columns comes from HRmax, not from the methods themselves.`,
    });
  }

  // Threshold has a different physiological reference
  if (threshold.state === 'complete' && threshold.calc) {
    const fthr = threshold.calc.anchor.value;
    const ref = used[0]?.[1];
    const share = ref?.hrmax ? ` That is about ${formatNumber((fthr / ref.hrmax.bpm) * 100, 1)}% of the HRmax used for ${METHOD_LABELS[used[0][0]]} (${formatNumber(ref.hrmax.bpm)} bpm).` : '';
    out.push({
      id: 'threshold-reference',
      text: `Threshold-based zones are anchored to your estimated FTHR of ${formatNumber(fthr)} bpm, a field estimate of the effort near threshold, not to the top of your heart rate range or to your resting heart rate.${share}`,
    });
  }

  // Why the ranges differ
  const complete = methods.filter((m) => result.outcomes[m].state === 'complete');
  if (complete.length >= 2) {
    const lowers = (zone: 2 | 4) =>
      complete.map((m) => ({ m, v: result.outcomes[m].calc!.zones[zone - 1].lowerBpm as number }));
    const z2 = lowers(2);
    const z4 = lowers(4);
    const spread = Math.max(...z4.map((x) => x.v)) - Math.min(...z4.map((x) => x.v));
    const fmt = (xs: { m: MethodId; v: number }[]) => joinList(xs.map((x) => `${x.v} bpm (${METHOD_LABELS[x.m]})`));
    out.push({
      id: 'ranges-differ',
      text: `For the same runner, Zone 2 starts at ${fmt(z2)}, and Zone 4 starts at ${fmt(z4)}, a spread of ${spread} bpm. The methods measure intensity against different references, so differing ranges are expected and are not errors.`,
    });
  }

  // Preset status
  if (hrr.calc && hrr.calc.status === 'provisional') {
    out.push({
      id: 'hrr-provisional',
      text: 'The %HRR zones use a common 10%-band convention that was originally defined on maximum heart rate. It is a provisional preset, not a validated running-specific model.',
    });
  }
  const custom = methods.filter((m) => result.outcomes[m].calc?.isCustom);
  if (custom.length > 0) {
    out.push({
      id: 'custom',
      text: `${joinList(custom.map((m) => METHOD_LABELS[m]))} ${custom.length > 1 ? 'are' : 'is'} using custom zone percentages, so ${custom.length > 1 ? 'they are' : 'it is'} not directly comparable with the source’s preset.`,
    });
  }

  out.push({
    id: 'none-superior',
    text: 'None of the three methods is automatically better. The American College of Sports Medicine notes that no study compares all intensity methods, so zones from one method cannot be assumed equivalent to another’s (Garber et al., 2011).',
  });
  return out;
}

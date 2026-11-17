import { compareMethods } from '../../calculations/comparison';
import { calculateHrrZones } from '../../calculations/heartRateReserve';
import { calculateMhrZones } from '../../calculations/maximumHR';
import { calculateThresholdZones } from '../../calculations/thresholdHR';
import { ZONE_MODELS } from '../../data/zoneModels';
import { ZONE_OVERVIEW } from '../../data/zoneOverview';
import type { ExampleKey, Validated, ZoneCalculation } from '../../types';
import { describeSubstitution } from '../../utils/breakdown';
import { formatBpmRange, formatNumber, formatPctRange } from '../../utils/format';
import { roundDivHalfUp } from '../../utils/numeric';
import type { ReactNode } from 'react';
import StatusBadge from '../calculator/StatusBadge';

const TH = 'py-2 pr-4 text-xs font-medium uppercase tracking-wider text-muted';

function Frame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure data-example className="my-5 border border-line p-4">
      <figcaption className="text-sm font-semibold">{title}</figcaption>
      <div className="mt-3 overflow-x-auto">{children}</div>
    </figure>
  );
}

function Worked({ title, inputs, calc }: { title: string; inputs: string[]; calc: ZoneCalculation }) {
  return (
    <Frame title={title}>
      <p className="text-sm text-muted">Inputs: {inputs.join('; ')}.</p>
      <p className="mt-1 text-sm text-muted">{calc.anchor.formula}</p>
      <table className="mt-3 w-full min-w-[26rem] border-collapse text-left text-sm">
        <caption className="sr-only">{title}: step by step</caption>
        <thead>
          <tr className="border-b border-ink">
            <th scope="col" className={TH}>Percentage</th>
            <th scope="col" className={TH}>Substitution</th>
            <th scope="col" className={TH}>Exact</th>
            <th scope="col" className={TH}>Rounded</th>
          </tr>
        </thead>
        <tbody>
          {calc.boundaries.map((b) => (
            <tr key={b.edgeIndex} className="border-b border-line">
              <td className="py-1 pr-4">{formatNumber(b.pct)}%</td>
              <td className="py-1 pr-4">{describeSubstitution(calc, b)}</td>
              <td className="py-1 pr-4 text-muted">{formatNumber(b.exactBpm)} bpm</td>
              <td className="py-1 font-semibold">{b.bpm} bpm</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="mt-4 w-full min-w-[22rem] border-collapse text-left text-sm">
        <caption className="sr-only">{title}: resulting zones</caption>
        <thead>
          <tr className="border-b border-ink">
            <th scope="col" className={TH}>Zone</th>
            <th scope="col" className={TH}>Heart rate range</th>
            <th scope="col" className={TH}>Percentage used</th>
          </tr>
        </thead>
        <tbody>
          {calc.zones.map((z) => (
            <tr key={z.zone} className="border-b border-line">
              <th scope="row" className="py-1 pr-4 text-left font-normal">Z{z.zone} {z.name}</th>
              <td className="py-1 pr-4 font-semibold">
                {formatBpmRange(z)}
                {z.subBands ? <span className="block text-xs font-normal text-muted">{z.subBands.map((s) => `${s.label}: ${formatBpmRange(s)}`).join(' · ')}</span> : null}
              </td>
              <td className="py-1 text-muted">{formatPctRange(z)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {calc.belowZone1MaxBpm !== null ? <p className="mt-2 text-xs text-muted">Up to {calc.belowZone1MaxBpm} bpm is below Zone 1.</p> : null}
    </Frame>
  );
}

function must(r: Validated<ZoneCalculation>): ZoneCalculation {
  if (!r.ok) throw new Error('Article example failed: ' + r.errors.map((e) => e.message).join('; '));
  return r.value;
}

export default function ExampleBlock({ example }: { example: ExampleKey }) {
  switch (example) {
    case 'mhr-190':
      return (
        <Worked
          title="Worked example: measured HRmax of 190 bpm"
          inputs={['measured HRmax = 190 bpm']}
          calc={must(calculateMhrZones({ hrmax: { source: 'measured', measured: 190 } }))}
        />
      );
    case 'mhr-tanaka-40':
      return (
        <Worked
          title="Worked example: Tanaka estimate for a 40-year-old"
          inputs={['age = 40', 'HRmax = 208 − (0.7 × 40) = 180 bpm (estimated)']}
          calc={must(calculateMhrZones({ hrmax: { source: 'tanaka', age: 40 } }))}
        />
      );
    case 'hrr-190-50':
      return (
        <Worked
          title="Worked example: HRmax 190 bpm, resting heart rate 50 bpm"
          inputs={['HRmax = 190 bpm', 'RHR = 50 bpm', 'HRR = 190 − 50 = 140 bpm']}
          calc={must(calculateHrrZones({ hrmax: { source: 'measured', measured: 190 }, rhr: 50 }))}
        />
      );
    case 'fthr-170':
      return (
        <Worked
          title="Worked example: 20-minute average of 170 bpm"
          inputs={['20-minute average = 170 bpm', 'estimated FTHR = 170 × 0.95 = 161.5 bpm']}
          calc={must(calculateThresholdZones({ avg20: 170 }))}
        />
      );
    case 'resting-hr-effect': {
      const h = 1900;
      const at = (rhr: number) => roundDivHalfUp(rhr * 100 + (h - rhr) * 70, 1000);
      return (
        <Frame title="Where 70% sits for the same maximum heart rate (190 bpm)">
          <table className="w-full min-w-[22rem] border-collapse text-left text-sm">
            <caption className="sr-only">70% of HRmax compared with 70% of heart rate reserve at two resting heart rates</caption>
            <thead>
              <tr className="border-b border-ink">
                <th scope="col" className={TH}>Method</th>
                <th scope="col" className={TH}>Working</th>
                <th scope="col" className={TH}>Result</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line"><th scope="row" className="py-1 pr-4 text-left font-normal">70% of HRmax</th><td className="py-1 pr-4">190 × 70%</td><td className="py-1 font-semibold">{roundDivHalfUp(h * 70, 1000)} bpm</td></tr>
              <tr className="border-b border-line"><th scope="row" className="py-1 pr-4 text-left font-normal">70% of HRR, resting HR 50</th><td className="py-1 pr-4">50 + (140 × 70%)</td><td className="py-1 font-semibold">{at(500)} bpm</td></tr>
              <tr className="border-b border-line"><th scope="row" className="py-1 pr-4 text-left font-normal">70% of HRR, resting HR 70</th><td className="py-1 pr-4">70 + (120 × 70%)</td><td className="py-1 font-semibold">{at(700)} bpm</td></tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs text-muted">The gap between the two methods is resting heart rate × (1 − percentage), so a higher resting heart rate raises the %HRR target.</p>
        </Frame>
      );
    }
    case 'zone-labels':
      return (
        <Frame title="General zone labels">
          <table className="w-full min-w-[26rem] border-collapse text-left text-sm">
            <caption className="sr-only">The five general zone labels and their purposes</caption>
            <thead>
              <tr className="border-b border-ink">
                <th scope="col" className={TH}>Zone</th>
                <th scope="col" className={TH}>Label</th>
                <th scope="col" className={TH}>General purpose</th>
              </tr>
            </thead>
            <tbody>
              {ZONE_OVERVIEW.map((z) => (
                <tr key={z.zone} className="border-b border-line align-top">
                  <th scope="row" className="py-1 pr-4 text-left font-normal">Z{z.zone}</th>
                  <td className="py-1 pr-4 font-semibold">{z.name} / {z.descriptor}</td>
                  <td className="py-1 text-muted">{z.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Frame>
      );
    case 'compare-presets': {
      const models = [ZONE_MODELS.mhr, ZONE_MODELS.hrr, ZONE_MODELS.threshold];
      const rowLabel = (z: number, m: (typeof models)[number]) =>
        formatPctRange({ lowerPct: m.edges[z - 1], upperPct: m.edges[z], upperInclusive: z === 5 && m.edges[5] !== null });
      return (
        <Frame title="Percentage boundaries of the three presets">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <caption className="sr-only">Zone percentage boundaries for each method</caption>
            <thead>
              <tr className="border-b border-ink align-bottom">
                <th scope="col" className={TH}>Zone</th>
                {models.map((m) => (
                  <th key={m.id} scope="col" className="py-2 pr-4 font-normal">
                    <span className="block text-xs font-medium uppercase tracking-wider text-muted">
                      {m.method === 'mhr' ? '% of HRmax' : m.method === 'hrr' ? '% of HRR' : '% of FTHR'}
                    </span>
                    <StatusBadge status={m.status} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((z) => (
                <tr key={z} className="border-b border-line">
                  <th scope="row" className="py-1 pr-4 text-left font-normal">Z{z}</th>
                  {models.map((m) => (
                    <td key={m.id} className="py-1 pr-4">{rowLabel(z, m)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Frame>
      );
    }
    case 'compare-zone2': {
      const r = compareMethods({ age: null, measuredHrmax: 190, hrmaxSource: 'measured', rhr: 50, avg20: 170 });
      const rows = [
        ['%MHR', r.outcomes.mhr.calc],
        ['%HRR', r.outcomes.hrr.calc],
        ['Threshold-based', r.outcomes.threshold.calc],
      ] as const;
      return (
        <Frame title="Zone 2 for the same runner, by method">
          <table className="w-full min-w-[22rem] border-collapse text-left text-sm">
            <caption className="sr-only">Zone 2 heart rate range for each method</caption>
            <thead>
              <tr className="border-b border-ink">
                <th scope="col" className={TH}>Method</th>
                <th scope="col" className={TH}>Zone 2</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, calc]) => (
                <tr key={label} className="border-b border-line">
                  <th scope="row" className="py-1 pr-4 text-left font-normal">{label}</th>
                  <td className="py-1 font-semibold">{calc ? formatBpmRange(calc.zones[1]) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Frame>
      );
    }
  }
}

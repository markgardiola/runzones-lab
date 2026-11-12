import type { ZoneCalculation } from '../../types';
import { describeSubstitution, ROUNDING_RULES } from '../../utils/breakdown';
import { formatNumber } from '../../utils/format';

export default function CalculationBreakdown({ calc }: { calc: ZoneCalculation }) {
  return (
    <details className="border border-line p-4">
      <summary className="cursor-pointer text-sm font-semibold">How was this calculated?</summary>
      <div className="mt-4 space-y-5 text-sm">
        <div>
          <h4 className="font-sans text-xs font-medium uppercase tracking-wider text-muted">Formula</h4>
          <p className="mt-1">{calc.anchor.formula}</p>
        </div>

        <div>
          <h4 className="font-sans text-xs font-medium uppercase tracking-wider text-muted">Your inputs</h4>
          <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            {Object.entries(calc.anchor.details).map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted">{k}</dt>
                <dd>{typeof v === 'number' ? `${formatNumber(v)} bpm` : v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h4 className="font-sans text-xs font-medium uppercase tracking-wider text-muted">
            Zone boundaries{calc.isCustom ? ' (your custom percentages)' : ''}
          </h4>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink text-xs uppercase tracking-wider text-muted">
                  <th scope="col" className="py-1 pr-3 font-medium">Percentage</th>
                  <th scope="col" className="py-1 pr-3 font-medium">Substitution</th>
                  <th scope="col" className="py-1 pr-3 font-medium">Exact</th>
                  <th scope="col" className="py-1 font-medium">Rounded</th>
                </tr>
              </thead>
              <tbody>
                {calc.boundaries.map((b) => (
                  <tr key={b.edgeIndex} className="border-b border-line">
                    <td className="py-1 pr-3">{formatNumber(b.pct)}%</td>
                    <td className="py-1 pr-3">{describeSubstitution(calc, b)}</td>
                    <td className="py-1 pr-3 text-muted">{formatNumber(b.exactBpm)} bpm</td>
                    <td className="py-1 font-semibold">{b.bpm} bpm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="font-sans text-xs font-medium uppercase tracking-wider text-muted">Rounding rules</h4>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-muted">
            {ROUNDING_RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}

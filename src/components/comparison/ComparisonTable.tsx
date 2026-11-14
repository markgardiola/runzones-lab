import type { ComparisonResult } from '../../calculations/comparison';
import { ZONE_OVERVIEW } from '../../data/zoneOverview';
import { formatBpmRange, formatPctRange } from '../../utils/format';
import StatusBadge from '../calculator/StatusBadge';
import { ZONE_BORDER } from '../common/zoneColors';
import { METHOD_ORDER, METHOD_STYLE } from './methodStyle';

export default function ComparisonTable({ result }: { result: ComparisonResult }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <caption className="sr-only">Heart rate zones for each method, side by side</caption>
        <thead>
          <tr className="border-b border-ink align-bottom">
            <th scope="col" className="py-2 pr-4 text-xs font-medium uppercase tracking-wider text-muted">Zone</th>
            {METHOD_ORDER.map((m) => {
              const o = result.outcomes[m];
              return (
                <th key={m} scope="col" className="py-2 pr-4 font-normal">
                  <span className="block font-semibold">
                    <span aria-hidden="true">{METHOD_STYLE[m].glyph}</span> {METHOD_STYLE[m].name}
                  </span>
                  {o.calc ? <StatusBadge status={o.calc.status} /> : null}
                  {o.state === 'incomplete' ? (
                    <span className="mt-1 block text-xs font-normal text-accent">
                      Incomplete: needs {o.missing.join(', ').toLowerCase()}
                    </span>
                  ) : null}
                  {o.state === 'invalid' ? (
                    <span className="mt-1 block text-xs font-normal text-accent">Could not be calculated</span>
                  ) : null}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {ZONE_OVERVIEW.map((z) => (
            <tr key={z.zone} className="border-b border-line align-top">
              <th scope="row" className={`border-l-4 py-3 pl-3 pr-4 text-left font-normal ${ZONE_BORDER[z.zone]}`}>
                <span className="font-display text-xl font-medium">Z{z.zone}</span>
                <span className="block text-xs text-muted">{z.name}</span>
              </th>
              {METHOD_ORDER.map((m) => {
                const row = result.outcomes[m].calc?.zones[z.zone - 1];
                return (
                  <td key={m} className="py-3 pr-4">
                    {row ? (
                      <>
                        <span className="block font-semibold">{formatBpmRange(row)}</span>
                        <span className="block text-xs text-muted">{formatPctRange(row)}</span>
                      </>
                    ) : (
                      <span className="text-muted" aria-label="Not available">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

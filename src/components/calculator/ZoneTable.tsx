import { ZONE_DETAILS } from '../../data/zoneDescriptions';
import type { ZoneCalculation } from '../../types';
import { formatBpmRange, formatPctRange } from '../../utils/format';
import { ZONE_BORDER } from '../common/zoneColors';

export default function ZoneTable({ calc }: { calc: ZoneCalculation }) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <caption className="sr-only">Five training zones with heart rate range, percentage range and purpose</caption>
          <thead>
            <tr className="border-b border-ink text-xs uppercase tracking-wider text-muted">
              <th scope="col" className="py-2 pr-4 font-medium">Zone</th>
              <th scope="col" className="py-2 pr-4 font-medium">HR range</th>
              <th scope="col" className="py-2 pr-4 font-medium">Percentage used</th>
              <th scope="col" className="py-2 font-medium">Purpose and meaning</th>
            </tr>
          </thead>
          <tbody>
            {calc.zones.map((z) => {
              const d = ZONE_DETAILS[z.zone];
              return (
                <tr key={z.zone} className="border-b border-line align-top">
                  <th scope="row" className={`border-l-4 py-3 pl-3 pr-4 text-left font-normal ${ZONE_BORDER[z.zone]}`}>
                    <span className="font-display text-xl font-medium">Z{z.zone}</span>
                    <span className="block font-semibold">{z.name}</span>
                    <span className="block text-xs text-muted">{z.descriptor}</span>
                  </th>
                  <td className="py-3 pr-4 font-semibold">
                    {formatBpmRange(z)}
                    {z.subBands ? (
                      <span className="mt-1 block text-xs font-normal text-muted">
                        {z.subBands.map((s) => `${s.label}: ${formatBpmRange(s)}`).join(' · ')}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4 text-muted">{formatPctRange(z)}</td>
                  <td className="py-3 text-muted">
                    <p>{d.physiology}</p>
                    <p className="mt-1 text-xs">Examples: {d.examples}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {calc.belowZone1MaxBpm !== null ? (
        <p className="mt-3 text-sm text-muted">
          Below Zone 1: up to {calc.belowZone1MaxBpm} bpm. Very easy movement such as walking or a gentle warm-up falls here.
        </p>
      ) : null}
      <p className="mt-3 text-xs text-muted">
        General educational wording. What a zone means physiologically depends on the method and on the individual, so a
        Zone 2 from one method is not automatically the same as a Zone 2 from another.
      </p>
    </div>
  );
}

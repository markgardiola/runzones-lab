import type { ZoneCalculation } from '../../types';
import { buildVizSegments } from '../../utils/zoneViz';
import { formatBpmRange } from '../../utils/format';
import { ZONE_BG } from '../common/zoneColors';

interface Props {
  calc: ZoneCalculation;
}

/** Horizontal BPM bar. Colour is never the only identifier: every zone carries its number and range. */
export default function ZoneBar({ calc }: Props) {
  const segments = buildVizSegments(calc.zones);
  const description = calc.zones.map((z) => `Zone ${z.zone}: ${formatBpmRange(z)}`).join('; ');
  const hasOpenEnd = segments.some((s) => s.openStart || s.openEnd);
  return (
    <figure>
      <div role="img" aria-label={`Heart rate zones on one scale. ${description}.`} className="flex h-12 w-full border border-ink">
        {segments.map((s) => (
          <div
            key={s.zone}
            style={{ width: `${s.widthPct}%` }}
            className={`flex min-w-0 items-center justify-center overflow-hidden border-r border-paper text-sm font-semibold text-ink last:border-r-0 ${ZONE_BG[s.zone]} ${
              s.openStart || s.openEnd ? 'opacity-70' : ''
            }`}
            title={`Zone ${s.zone}`}
          >
            <span aria-hidden="true">{s.widthPct >= 7 ? `Z${s.zone}` : ''}</span>
          </div>
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-5">
        {calc.zones.map((z) => (
          <li key={z.zone} className="flex items-baseline gap-2 sm:block">
            <span className="font-semibold">Z{z.zone}</span>{' '}
            <span className="text-muted">{formatBpmRange(z)}</span>
          </li>
        ))}
      </ul>
      {hasOpenEnd ? (
        <figcaption className="mt-2 text-xs text-muted">
          Faded ends are open-ended in the source model; their drawn length is only illustrative.
        </figcaption>
      ) : null}
    </figure>
  );
}

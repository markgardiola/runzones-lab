import type { ZoneCalculation } from '../../types';
import { buildVizSegments } from '../../utils/zoneViz';
import { formatBpmRange, formatBpmRangeShort } from '../../utils/format';
import { ZONE_BG } from '../common/zoneColors';

interface Props {
  calc: ZoneCalculation;
}

/** Below this width a label no longer fits under its zone, so the plain list is used instead. */
const ALIGN_MIN_WIDTH_PCT = 10;

/**
 * Horizontal BPM bar. Labels sit directly under their own zone (same widths as the bar), so they
 * line up even when zones are very different sizes. Colour is never the only identifier.
 */
export default function ZoneBar({ calc }: Props) {
  const segments = buildVizSegments(calc.zones);
  const description = calc.zones.map((z) => `Zone ${z.zone}: ${formatBpmRange(z)}`).join('; ');
  const hasOpenEnd = segments.some((s) => s.openStart || s.openEnd);
  const canAlign = segments.every((s) => s.widthPct >= ALIGN_MIN_WIDTH_PCT);

  return (
    <figure>
      <div
        role="img"
        aria-label={`Heart rate zones on one scale. ${description}.`}
        className="flex h-12 w-full border border-ink"
      >
        {segments.map((s) => (
          <div
            key={s.zone}
            data-zone-segment={s.zone}
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

      {canAlign ? (
        <div aria-hidden="true" className="mt-1 hidden w-full sm:flex">
          {segments.map((s, i) => {
            const z = calc.zones[i];
            return (
              <div
                key={s.zone}
                data-zone-label={s.zone}
                style={{ width: `${s.widthPct}%` }}
                className="min-w-0 border-l border-ink px-1 pt-1 text-center text-xs leading-snug last:border-r"
              >
                <span className="block font-semibold">Z{s.zone}</span>
                <span className="block text-muted">{formatBpmRangeShort(z)}</span>
              </div>
            );
          })}
        </div>
      ) : null}

      <ul className={`mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-5 ${canAlign ? 'sm:hidden' : ''}`}>
        {calc.zones.map((z) => (
          <li key={z.zone} className="flex items-baseline gap-2 sm:block">
            <span className="font-semibold">Z{z.zone}</span>{' '}
            <span className="text-muted">{formatBpmRange(z)}</span>
          </li>
        ))}
      </ul>

      <figcaption className="mt-2 text-xs text-muted">
        Heart rate in beats per minute (bpm).
        {hasOpenEnd ? ' Faded ends are open-ended in the source model; their drawn length is only illustrative.' : ''}
      </figcaption>
    </figure>
  );
}

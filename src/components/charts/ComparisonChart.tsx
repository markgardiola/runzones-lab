import type { ComparisonResult } from '../../calculations/comparison';
import { formatBpmRange } from '../../utils/format';
import { buildSharedScale } from '../../utils/zoneViz';
import { ZONE_BG } from '../common/zoneColors';
import { METHOD_ORDER, METHOD_STYLE } from '../comparison/methodStyle';

/** All methods on one bpm axis. Methods are told apart by glyph, label and border style, not colour. */
export default function ComparisonChart({ result }: { result: ComparisonResult }) {
  const items = METHOD_ORDER.filter((m) => result.outcomes[m].calc).map((m) => ({
    method: m,
    zones: result.outcomes[m].calc!.zones,
  }));
  const scale = buildSharedScale(items);
  if (!scale) {
    return <p className="text-sm text-muted">Complete at least one method to see the shared-scale chart.</p>;
  }
  const total = scale.maxBpm - scale.minBpm;
  const description = items
    .map((it) => `${METHOD_STYLE[it.method].name}: ${it.zones.map((z) => `Zone ${z.zone} ${formatBpmRange(z)}`).join(', ')}`)
    .join('. ');

  return (
    <figure>
      <div role="img" aria-label={`Zones for each method on one shared heart rate scale. ${description}.`}>
        {METHOD_ORDER.map((m) => {
          const row = scale.rows.find((r) => r.method === m);
          return (
            <div key={m} className="grid items-center gap-x-3 gap-y-1 py-2 sm:grid-cols-[9rem_1fr]">
              <p className="text-sm font-medium">
                <span aria-hidden="true">{METHOD_STYLE[m].glyph}</span> {METHOD_STYLE[m].name}
              </p>
              {row ? (
                <div className={`relative h-10 border-2 border-ink ${METHOD_STYLE[m].border}`}>
                  {row.segments.map((s) => (
                    <div
                      key={s.zone}
                      data-chart-method={m}
                      data-chart-zone={s.zone}
                      style={{ left: `${s.leftPct}%`, width: `${s.widthPct}%` }}
                      className={`absolute inset-y-0 flex items-center justify-center overflow-hidden border-r border-paper text-xs font-semibold text-ink ${ZONE_BG[s.zone]} ${
                        s.openStart || s.openEnd ? 'opacity-70' : ''
                      }`}
                      title={`${METHOD_STYLE[m].name}, Zone ${s.zone}`}
                    >
                      <span aria-hidden="true">{s.widthPct >= 5 ? `Z${s.zone}` : ''}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-10 items-center border-2 border-dashed border-line px-3 text-xs text-muted">
                  Incomplete: no zones to draw
                </div>
              )}
            </div>
          );
        })}
        <div className="grid gap-x-3 sm:grid-cols-[9rem_1fr]" aria-hidden="true">
          <span />
          <div className="relative mb-6 h-6 border-t border-ink">
            {scale.ticks.map((t) => (
              <span
                key={t}
                style={{ left: `${((t - scale.minBpm) / total) * 100}%` }}
                className="absolute top-0 -translate-x-1/2 text-xs text-muted"
              >
                <span className="mx-auto block h-1.5 w-px bg-ink" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="text-xs text-muted">
        Heart rate in beats per minute (bpm), one scale for every method. Faded ends are open-ended in the source model;
        their drawn length is only illustrative.
      </figcaption>
    </figure>
  );
}

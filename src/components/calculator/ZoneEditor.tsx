import { useState } from 'react';
import { editZoneBound, MIN_ZONE_WIDTH_PCT } from '../../calculations/zoneEditing';
import { ZONE_OVERVIEW } from '../../data/zoneOverview';
import type { ZoneModel, ZoneNumber } from '../../types';
import { formatNumber } from '../../utils/format';

type Edges = (number | null)[];
type Side = 'lower' | 'upper';

interface Props {
  model: ZoneModel;
  edges: Edges;
  onChange: (edges: Edges) => void;
  onReset: () => void;
}

const key = (zone: number, side: Side) => `${zone}-${side}`;
const edgeIndex = (zone: number, side: Side) => (side === 'lower' ? zone - 1 : zone);

/**
 * Per-zone percentage editing. Values are applied on Enter or when the field loses focus, so
 * typing "88" is not auto-adjusted at "8". Neighbouring zones move to avoid overlap.
 */
export default function ZoneEditor({ model, edges, onChange, onReset }: Props) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const commit = (zone: ZoneNumber, side: Side) => {
    const k = key(zone, side);
    const draft = drafts[k];
    if (draft === undefined) return;
    const clear = () =>
      setDrafts((d) => {
        const next = { ...d };
        delete next[k];
        return next;
      });
    const n = draft.trim() === '' ? NaN : Number(draft);
    if (!Number.isFinite(n)) {
      setError('Enter a number for the percentage.');
      setMessage('');
      clear();
      return;
    }
    if (Math.abs(n * 100 - Math.round(n * 100)) > 1e-9) {
      setError('Percentages can have at most two decimals.');
      setMessage('');
      clear();
      return;
    }
    const current = edges[edgeIndex(zone, side)];
    if (current !== null && n === current) {
      setError('');
      clear();
      return;
    }
    const r = editZoneBound(model, edges, zone, side, n);
    clear();
    if (!r.ok) {
      setError(r.message);
      setMessage('');
      return;
    }
    setError('');
    const parts: string[] = [];
    if (r.clamped) {
      parts.push(`Zone ${zone} ${side} limit was set to ${formatNumber(r.appliedPct)}% so every zone keeps at least ${MIN_ZONE_WIDTH_PCT} percentage point.`);
    } else {
      parts.push('Updated.');
    }
    if (r.adjustedZones.length > 0) {
      parts.push(`Zone${r.adjustedZones.length > 1 ? 's' : ''} ${r.adjustedZones.join(', ')} adjusted automatically so zones do not overlap.`);
    }
    setMessage(parts.join(' '));
    onChange(r.edges);
  };

  const field = (zone: ZoneNumber, side: Side) => {
    const idx = edgeIndex(zone, side);
    const current = edges[idx];
    const preset = model.edges[idx];
    const label = `Zone ${zone} ${side} percentage`;
    if (current === null) {
      return <span className="text-xs text-muted">{side === 'lower' ? 'no lower limit' : 'no upper limit'}</span>;
    }
    const k = key(zone, side);
    const value = drafts[k] ?? formatNumber(current, 2);
    return (
      <div>
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          aria-label={label}
          value={value}
          onChange={(e) => setDrafts((d) => ({ ...d, [k]: e.target.value }))}
          onBlur={() => commit(zone, side)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit(zone, side);
            }
          }}
          className="min-h-[44px] w-24 border border-ink bg-paper px-2 text-base"
        />
        <span className="ml-1 text-sm text-muted">%</span>
        {preset !== null && preset !== current ? (
          <span className="mt-1 block text-xs text-muted">Preset: {formatNumber(preset, 2)}%</span>
        ) : null}
      </div>
    );
  };

  return (
    <section aria-labelledby="editor-heading" className="border border-line p-4">
      <h3 id="editor-heading" className="text-lg font-semibold">Adjust the zone percentages</h3>
      <p className="mt-1 text-sm text-muted">
        Change any zone’s lower or upper percentage, then press Enter or move to the next field. Neighbouring zones
        shift automatically so zones never overlap, and each keeps at least {MIN_ZONE_WIDTH_PCT} percentage point.
        Custom zones are your own percentages and do not carry the source’s validation.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[22rem] border-collapse text-left text-sm">
          <caption className="sr-only">Editable lower and upper percentage for each zone</caption>
          <thead>
            <tr className="border-b border-ink text-xs uppercase tracking-wider text-muted">
              <th scope="col" className="py-2 pr-4 font-medium">Zone</th>
              <th scope="col" className="py-2 pr-4 font-medium">From</th>
              <th scope="col" className="py-2 font-medium">Up to</th>
            </tr>
          </thead>
          <tbody>
            {ZONE_OVERVIEW.map((z) => (
              <tr key={z.zone} className="border-b border-line align-top">
                <th scope="row" className="py-2 pr-4 text-left font-normal">
                  <span className="font-semibold">Z{z.zone}</span> {z.name}
                </th>
                <td className="py-2 pr-4">{field(z.zone, 'lower')}</td>
                <td className="py-2">{field(z.zone, 'upper')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p role="status" aria-live="polite" className="mt-3 min-h-[1.25rem] text-sm">{message}</p>
      {error ? <p role="alert" className="text-sm text-accent">{error}</p> : null}
      <button
        type="button"
        className="btn btn-secondary mt-3"
        onClick={() => {
          setDrafts({});
          setError('');
          setMessage('Reset to the preset.');
          onReset();
        }}
      >
        Reset to preset
      </button>
    </section>
  );
}

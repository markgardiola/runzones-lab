import { ZONE_OVERVIEW } from '../../data/zoneOverview';

const BG: Record<number, string> = { 1: 'bg-zone-1', 2: 'bg-zone-2', 3: 'bg-zone-3', 4: 'bg-zone-4', 5: 'bg-zone-5' };

/** Static five-zone overview band. No BPM or percentages: those are method-dependent. */
export default function ZoneStrip() {
  return (
    <ol className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-5">
      {ZONE_OVERVIEW.map((z) => (
        <li key={z.zone} className="bg-paper">
          <div className={`h-2 ${BG[z.zone]}`} aria-hidden="true" />
          <div className="p-4">
            <p className="font-display text-3xl font-medium">Z{z.zone}</p>
            <p className="mt-1 text-sm font-semibold">{z.name}</p>
            <p className="text-xs text-muted">{z.descriptor}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{z.purpose}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

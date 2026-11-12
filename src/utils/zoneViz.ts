import type { ZoneNumber, ZoneRow } from '../types';

export interface VizSegment {
  zone: ZoneNumber;
  startBpm: number;
  endBpm: number;
  /** The source model leaves this end open; the drawn extent is only illustrative. */
  openStart: boolean;
  openEnd: boolean;
  widthPct: number;
}

const FALLBACK_WIDTH = 10;

/**
 * Geometry for the horizontal BPM bar. A zone covering whole bpm lower..upper is drawn from
 * lower to upper + 1 so adjacent zones touch exactly. Open ends are drawn one reference zone wide.
 */
export function buildVizSegments(zones: ZoneRow[]): VizSegment[] {
  const width = (z: ZoneRow | undefined): number =>
    z && z.lowerBpm !== null && z.upperBpm !== null ? z.upperBpm - z.lowerBpm + 1 : FALLBACK_WIDTH;

  const raw = zones.map((z, i) => {
    let start: number;
    let end: number;
    if (z.lowerBpm !== null) start = z.lowerBpm;
    else start = Math.max(0, (z.upperBpm as number) + 1 - width(zones[i + 1]));
    if (z.upperBpm !== null) end = z.upperBpm + 1;
    else end = (z.lowerBpm as number) + width(zones[i - 1]);
    return { z, start, end, openStart: z.lowerBpm === null, openEnd: z.upperBpm === null };
  });
  const total = raw[raw.length - 1].end - raw[0].start;
  return raw.map((r) => ({
    zone: r.z.zone,
    startBpm: r.start,
    endBpm: r.end,
    openStart: r.openStart,
    openEnd: r.openEnd,
    widthPct: ((r.end - r.start) / total) * 100,
  }));
}

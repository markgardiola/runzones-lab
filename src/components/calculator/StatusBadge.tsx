import type { ZoneStatus } from '../../types';

const TEXT: Record<ZoneStatus, string> = {
  confirmed: 'Sourced preset',
  provisional: 'Provisional preset',
  custom: 'Custom zones',
};

const CLASSES: Record<ZoneStatus, string> = {
  confirmed: 'border-ink text-ink',
  provisional: 'border-accent text-accent',
  custom: 'border-ink bg-ink text-paper',
};

const EXPLANATION: Record<ZoneStatus, string> = {
  confirmed: 'Percentages come from a published source that was checked for this project.',
  provisional: 'A common convention rather than a validated running-specific model. Treat it as a starting point.',
  custom: 'Your own percentages. They do not carry any source’s validation.',
};

export function statusExplanation(status: ZoneStatus): string {
  return EXPLANATION[status];
}

export default function StatusBadge({ status }: { status: ZoneStatus }) {
  return (
    <span className={`inline-block border px-2 py-0.5 text-xs font-medium uppercase tracking-wider ${CLASSES[status]}`}>
      {TEXT[status]}
    </span>
  );
}

import { VERIFICATION_LABELS } from '../../data/references';
import type { VerificationLevel } from '../../types';

// Distinguished by text and border style, not colour alone.
const STYLE: Record<VerificationLevel, string> = {
  'read-full': 'border-solid border-ink',
  'read-partial': 'border-dashed border-ink',
  'citation-only': 'border-dotted border-ink',
  secondary: 'border-dotted border-muted text-muted',
  'owner-supplied': 'border-dashed border-muted text-muted',
};

export default function VerificationBadge({ level }: { level: VerificationLevel }) {
  return (
    <span className={`inline-block border px-2 py-0.5 text-xs font-medium ${STYLE[level]}`}>
      <span className="sr-only">How this source was checked: </span>
      {VERIFICATION_LABELS[level]}
    </span>
  );
}

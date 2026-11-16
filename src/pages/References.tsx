import ReferenceCard from '../components/research/ReferenceCard';
import VerificationBadge from '../components/research/VerificationBadge';
import { CATEGORY_LABELS, CATEGORY_ORDER, REFERENCES, VERIFICATION_LABELS } from '../data/references';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import type { VerificationLevel } from '../types';

const LEVEL_EXPLANATIONS: Record<VerificationLevel, string> = {
  'read-full': 'The full text was read, and statements about it on this site rest on that reading.',
  'read-partial': 'The abstract and part of the text were read; nothing is claimed beyond that.',
  'citation-only': 'The citation was checked in a database, but the paper itself was not read. Statements about it come from other sources.',
  secondary: 'A practitioner or manufacturer source, used only to show how a convention is used, not as scientific evidence.',
  'owner-supplied': 'The citation and any transcription were supplied by the project owner.',
};

export default function References() {
  useDocumentMeta(
    'Scientific References',
    'The publications behind every RunZones Lab method, with identifiers, links and an honest note on how far each source was checked.',
  );
  return (
    <div className="container-page py-12 sm:py-16">
      <p className="eyebrow">Bibliography</p>
      <h1 className="mt-2 text-4xl font-medium sm:text-5xl">Scientific References</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        Peer-reviewed research comes first, then reviews, guidelines and coaching methodology. Fitness blogs and calculator
        sites are not used for scientific claims. Each entry says how far this project’s checking went.
      </p>

      <section aria-labelledby="levels-heading" className="mt-8 border border-line p-5">
        <h2 id="levels-heading" className="text-xl font-medium">How sources were checked</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {(Object.keys(LEVEL_EXPLANATIONS) as VerificationLevel[]).map((lvl) => (
            <li key={lvl} className="flex flex-wrap items-start gap-3">
              <VerificationBadge level={lvl} />
              <span className="max-w-xl text-muted">{LEVEL_EXPLANATIONS[lvl]}</span>
            </li>
          ))}
        </ul>
      </section>

      {CATEGORY_ORDER.map((cat) => {
        const items = REFERENCES.filter((r) => r.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} aria-labelledby={`cat-${cat}`} className="mt-12">
            <h2 id={`cat-${cat}`} className="text-2xl font-medium">{CATEGORY_LABELS[cat]}</h2>
            <ul className="mt-2">
              {items.map((r) => (
                <ReferenceCard key={r.id} entry={r} />
              ))}
            </ul>
          </section>
        );
      })}

      <p className="mt-10 text-xs text-muted">
        {REFERENCES.length} sources. Levels used: {Object.values(VERIFICATION_LABELS).join('; ')}.
      </p>
    </div>
  );
}

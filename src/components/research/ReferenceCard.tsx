import type { ReferenceEntry } from '../../types';
import VerificationBadge from './VerificationBadge';

export default function ReferenceCard({ entry }: { entry: ReferenceEntry }) {
  const { doi, pmid } = entry.identifiers;
  return (
    <li id={entry.id} className="scroll-mt-8 border-b border-line py-5">
      <p className="text-sm text-muted">
        {entry.authors}
        {entry.year !== null ? ` (${entry.year})` : ' (year not verified)'}
      </p>
      <h3 className="mt-1 font-sans text-base font-semibold leading-snug">
        {entry.url ? (
          <a href={entry.url} target="_blank" rel="noopener noreferrer" className="link-underline">
            {entry.title}
          </a>
        ) : (
          entry.title
        )}
      </h3>
      <p className="mt-1 text-sm text-muted">{entry.venue}</p>
      {doi || pmid ? (
        <p className="mt-1 text-xs text-muted">
          {doi ? (
            <>
              DOI:{' '}
              <a href={`https://doi.org/${doi}`} target="_blank" rel="noopener noreferrer" className="link-underline">
                {doi}
              </a>
            </>
          ) : null}
          {doi && pmid ? ' · ' : null}
          {pmid ? (
            <>
              PMID:{' '}
              <a href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`} target="_blank" rel="noopener noreferrer" className="link-underline">
                {pmid}
              </a>
            </>
          ) : null}
        </p>
      ) : null}
      <p className="mt-2 text-sm leading-relaxed">{entry.relevance}</p>
      <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
        <VerificationBadge level={entry.verification} />
        {entry.note ? <span>{entry.note}</span> : null}
      </p>
    </li>
  );
}

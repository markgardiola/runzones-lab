import { Link } from 'react-router-dom';
import ProfileCard from '../components/research/ProfileCard';
import { RESEARCHER_PROFILES } from '../data/researchers';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Researchers() {
  useDocumentMeta(
    'Researchers and Coaches',
    'The researchers and coaches behind the heart rate zone methods, with verified biographies, contributions and primary sources.',
  );
  const researchers = RESEARCHER_PROFILES.filter((p) => p.kind === 'researcher');
  const coaches = RESEARCHER_PROFILES.filter((p) => p.kind === 'coach');
  return (
    <div className="container-page py-12 sm:py-16">
      <p className="eyebrow">Research library</p>
      <h1 className="mt-2 text-4xl font-medium sm:text-5xl">Researchers and Coaches</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        The people behind the three methods. Researchers developed or studied the scientific methods; coaches popularised
        their practical use, and the two are kept apart here. Every statement is tied to a source, and each profile says
        what it does not claim.
      </p>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Jump to:{' '}
        {RESEARCHER_PROFILES.map((p, i) => (
          <span key={p.slug}>
            {i > 0 ? ' · ' : ''}
            <a href={`#${p.slug}`} className="link-underline">{p.name}</a>
          </span>
        ))}
        . All sources are in the <Link to="/references" className="link-underline">reference library</Link>.
      </p>

      <section aria-labelledby="researchers-heading" className="mt-12">
        <h2 id="researchers-heading" className="sr-only">Researchers</h2>
        {researchers.map((p) => (
          <ProfileCard key={p.slug} profile={p} />
        ))}
      </section>

      <section aria-labelledby="coaches-heading" className="mt-4">
        <h2 id="coaches-heading" className="sr-only">Coaches and practitioners</h2>
        {coaches.map((p) => (
          <ProfileCard key={p.slug} profile={p} />
        ))}
      </section>
    </div>
  );
}

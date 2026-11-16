import { Link } from 'react-router-dom';
import { METHODS } from '../../config/navigation';
import { getReference } from '../../data/references';
import type { ReferenceEntry, ResearcherProfile } from '../../types';

function RefList({ ids }: { ids: string[] }) {
  const refs = ids.map(getReference).filter((r): r is ReferenceEntry => Boolean(r));
  return (
    <ul className="mt-2 space-y-1 text-sm">
      {refs.map((r) => (
        <li key={r.id}>
          <Link to={`/references#${r.id}`} className="link-underline">
            {r.title}
          </Link>{' '}
          <span className="text-muted">
            ({r.authors.split(',')[0].trim()}
            {r.year !== null ? `, ${r.year}` : ''})
          </span>
        </li>
      ))}
    </ul>
  );
}

const H = ({ children }: { children: string }) => (
  <h3 className="font-sans text-xs font-medium uppercase tracking-wider text-muted">{children}</h3>
);

export default function ProfileCard({ profile }: { profile: ResearcherProfile }) {
  const methods = METHODS.filter((m) => profile.methods.includes(m.id));
  return (
    <article id={profile.slug} className="scroll-mt-8 border-t border-ink py-10" aria-labelledby={`${profile.slug}-name`}>
      <p className="eyebrow">{profile.kind === 'coach' ? 'Coach and author' : 'Researcher'}</p>
      <h2 id={`${profile.slug}-name`} className="mt-1 text-3xl font-medium">{profile.name}</h2>
      <p className="mt-1 text-sm text-muted">{profile.role}</p>
      <p className="mt-2 text-xs text-muted">
        No portrait is shown: no image with a verified licence is available.
      </p>

      <div className="mt-6 grid gap-8 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <section aria-label={`${profile.name}: biography`}>
            <H>Biography</H>
            {profile.biography.map((p) => (
              <p key={p} className="mt-2 text-sm leading-relaxed">{p}</p>
            ))}
          </section>

          <section aria-label={`${profile.name}: contributions`}>
            <H>Major contributions</H>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed">
              {profile.contributions.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <section aria-label={`${profile.name}: relevance to running`}>
            <H>Relevance to endurance running</H>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed">
              {profile.runningRelevance.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <section aria-label={`${profile.name}: what this profile does not claim`} className="border border-line p-4">
            <H>What this profile does not claim</H>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
              {profile.limits.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6" aria-label={`${profile.name}: background and sources`}>
          <section>
            <H>Background</H>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {profile.background.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>

          <section>
            <H>Associated calculation methods</H>
            <ul className="mt-2 space-y-1 text-sm">
              {methods.map((m) => (
                <li key={m.id}>
                  <Link to={m.to} className="link-underline">{m.name}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <H>{profile.kind === 'coach' ? 'Selected methodology' : 'Selected publications'}</H>
            <RefList ids={profile.publicationIds} />
          </section>

          {profile.furtherReadingIds.length > 0 ? (
            <section>
              <H>Further reading about this work</H>
              <RefList ids={profile.furtherReadingIds} />
            </section>
          ) : null}

          <section>
            <H>Sources for this profile</H>
            <ul className="mt-2 space-y-1 text-sm">
              {profile.bioSources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-underline">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </article>
  );
}

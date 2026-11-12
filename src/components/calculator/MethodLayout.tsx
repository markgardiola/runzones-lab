import type { ReactNode } from 'react';

export interface SourceLink {
  label: string;
  href: string;
}

interface Props {
  title: string;
  intro: ReactNode;
  formula: string;
  limits: string[];
  sources: SourceLink[];
  children: ReactNode;
}

/** Shared frame for the three calculators: explanation, then form and results, then limits and sources. */
export default function MethodLayout({ title, intro, formula, limits, sources, children }: Props) {
  return (
    <div>
      <h2 className="text-3xl font-medium">{title}</h2>
      <div className="mt-3 max-w-2xl space-y-3 text-sm leading-relaxed text-muted">{intro}</div>
      <p className="mt-4 inline-block border border-line px-3 py-2 font-mono text-sm">{formula}</p>
      <div className="mt-8">{children}</div>
      <section className="mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-2" aria-label="Limitations and sources">
        <div>
          <h3 className="text-lg font-semibold">Know the limits</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
            {limits.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Sources</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {sources.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

import type { ArticleBlock } from '../../types';
import ExampleBlock from './ExampleBlock';

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="max-w-3xl">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h':
            return (
              <h2 key={i} id={slugify(b.text)} className="mt-10 scroll-mt-8 text-2xl font-medium">
                {b.text}
              </h2>
            );
          case 'p':
            return (
              <p key={i} className="mt-3 leading-relaxed">
                {b.text}
              </p>
            );
          case 'ul':
            return (
              <ul key={i} className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
                {b.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed">
                {b.items.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
            );
          case 'formula':
            return (
              <p key={i} className="mt-3 inline-block border border-line px-3 py-2 font-mono text-sm">
                {b.text}
              </p>
            );
          case 'callout':
            return (
              <aside key={i} className="mt-8 border-l-4 border-accent bg-line/30 p-4">
                <p className="font-semibold">{b.title}</p>
                <p className="mt-1 text-sm leading-relaxed">{b.text}</p>
              </aside>
            );
          case 'table':
            return (
              <div key={i} className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
                  <caption className="pb-2 text-left text-sm font-semibold">{b.caption}</caption>
                  <thead>
                    <tr className="border-b border-ink">
                      {b.head.map((h) => (
                        <th key={h} scope="col" className="py-2 pr-4 text-xs font-medium uppercase tracking-wider text-muted">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r) => (
                      <tr key={r.join('|')} className="border-b border-line align-top">
                        {r.map((c, j) =>
                          j === 0 ? (
                            <th key={j} scope="row" className="py-1 pr-4 text-left font-normal">{c}</th>
                          ) : (
                            <td key={j} className="py-1 pr-4">{c}</td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {b.note ? <p className="mt-2 text-xs text-muted">{b.note}</p> : null}
              </div>
            );
          case 'example':
            return <ExampleBlock key={i} example={b.example} />;
        }
      })}
    </div>
  );
}

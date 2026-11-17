import { Link } from 'react-router-dom';
import ArticleBody from '../components/science/ArticleBody';
import VerificationBadge from '../components/research/VerificationBadge';
import { ARTICLES, getArticle } from '../data/articles';
import { getReference } from '../data/references';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import type { ReferenceEntry } from '../types';
import NotFound from './NotFound';

export default function ArticlePage({ slug }: { slug: string }) {
  const article = getArticle(slug);
  useDocumentMeta(article ? article.title : 'Page not found', article?.summary);
  if (!article) return <NotFound />;

  const i = ARTICLES.findIndex((a) => a.slug === slug);
  const prev = ARTICLES[i - 1];
  const next = ARTICLES[i + 1];
  const refs = article.referenceIds.map(getReference).filter((r): r is ReferenceEntry => Boolean(r));

  return (
    <article className="container-page py-12 sm:py-16">
      <p className="eyebrow">
        <Link to="/science" className="link-underline">Science</Link> · Article {i + 1} of {ARTICLES.length}
      </p>
      <h1 className="mt-2 max-w-3xl text-4xl font-medium sm:text-5xl">{article.title}</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">{article.summary}</p>

      <ArticleBody blocks={article.blocks} />

      {article.tryIt ? (
        <p className="mt-8">
          <Link to={article.tryIt.to} className="btn btn-primary">{article.tryIt.label}</Link>
        </p>
      ) : null}

      <section aria-labelledby="supporting-refs" className="mt-14 max-w-3xl border-t border-ink pt-6">
        <h2 id="supporting-refs" className="text-2xl font-medium">Supporting references</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {refs.map((r) => (
            <li key={r.id}>
              <Link to={`/references#${r.id}`} className="link-underline font-medium">{r.title}</Link>
              <span className="text-muted">
                {' '}— {r.authors.split(',')[0].trim()}{r.year !== null ? `, ${r.year}` : ''}
              </span>{' '}
              <VerificationBadge level={r.verification} />
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label="Other articles" className="mt-12 grid max-w-3xl gap-4 border-t border-line pt-6 sm:grid-cols-2">
        <div>
          {prev ? (
            <Link to={`/science/${prev.slug}`} className="link-underline text-sm">← {prev.title}</Link>
          ) : null}
        </div>
        <div className="sm:text-right">
          {next ? (
            <Link to={`/science/${next.slug}`} className="link-underline text-sm">{next.title} →</Link>
          ) : null}
        </div>
      </nav>
    </article>
  );
}

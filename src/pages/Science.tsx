import { Link } from 'react-router-dom';
import { ARTICLES } from '../data/articles';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function Science() {
  useDocumentMeta(
    'The Science of Heart Rate Training',
    'Plain-language, sourced explanations of maximum heart rate, heart rate reserve, lactate thresholds and the five-zone system.',
  );
  return (
    <div className="container-page py-12 sm:py-16">
      <p className="eyebrow">Science and methodology</p>
      <h1 className="mt-2 text-4xl font-medium sm:text-5xl">The Science of Heart Rate Training</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        Start with the key ideas, then read how each of the three methods works: where it came from, the formula, a worked
        example, and its limits. Every statement names its source, and the worked examples are calculated by the same engine as the
        calculators.
      </p>

      <ol className="mt-10 max-w-3xl divide-y divide-line border-y border-line">
        {ARTICLES.map((a, i) => (
          <li key={a.slug} className="py-6">
            <p className="eyebrow">{i === 0 ? 'Start here' : i === ARTICLES.length - 1 ? 'Putting it together' : `Method ${i}`}</p>
            <h2 className="mt-1 text-2xl font-medium">
              <Link to={`/science/${a.slug}`} className="link-underline">{a.title}</Link>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{a.summary}</p>
          </li>
        ))}
      </ol>

      <p className="mt-8 max-w-2xl text-sm text-muted">
        Looking for the people and publications? See the <Link to="/researchers" className="link-underline">researchers and coaches</Link> and the{' '}
        <Link to="/references" className="link-underline">reference library</Link>, which shows how far each source was checked.
      </p>
    </div>
  );
}

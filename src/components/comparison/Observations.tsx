import type { Observation } from '../../calculations/observations';

export default function Observations({ items }: { items: Observation[] }) {
  return (
    <section aria-labelledby="observations-heading">
      <h3 id="observations-heading" className="text-2xl font-medium">What these differences mean</h3>
      <ul className="mt-4 max-w-3xl space-y-4 text-sm leading-relaxed">
        {items.map((o) => (
          <li key={o.id} data-observation={o.id} className="border-l-2 border-line pl-4">
            {o.text}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">
        Sources:{' '}
        <a className="link-underline" href="https://pubmed.ncbi.nlm.nih.gov/11153730/" target="_blank" rel="noopener noreferrer">
          Tanaka, Monahan &amp; Seals (2001)
        </a>
        ;{' '}
        <a className="link-underline" href="https://pubmed.ncbi.nlm.nih.gov/21694556/" target="_blank" rel="noopener noreferrer">
          Garber et al. (2011)
        </a>
        .
      </p>
    </section>
  );
}

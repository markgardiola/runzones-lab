import { Link } from 'react-router-dom';
import { METHODS } from '../config/navigation';
import { SITE } from '../config/site';
import { RESEARCHER_HIGHLIGHTS } from '../data/researchers';
import { REFERENCES } from '../data/references';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import HeroVisual from '../components/charts/HeroVisual';
import ZoneStrip from '../components/charts/ZoneStrip';
import SectionHeading from '../components/common/SectionHeading';
import DonationSection from '../components/donation/DonationSection';

export default function Home() {
  useDocumentMeta(SITE.name);

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-heading" className="container-page grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="eyebrow">Heart rate training for runners</p>
          <h1 id="hero-heading" className="mt-3 text-5xl font-medium leading-[1.05] sm:text-6xl">
            Heart Rate Training, <em className="font-normal">Explained by Science.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            RunZones Lab helps you calculate, understand and compare your heart rate training zones
            using three established approaches, and shows you the research behind every formula.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/calculator" className="btn btn-primary">Calculate My Heart Rate Zones</Link>
            <Link to="/science" className="btn btn-secondary">Explore the Science</Link>
          </div>
        </div>
        <div className="border border-line p-4 sm:p-6">
          <HeroVisual />
        </div>
      </section>

      <div className="track-rule" aria-hidden="true" />

      {/* Introduction */}
      <section aria-labelledby="intro-heading" className="container-page py-16 sm:py-20">
        <SectionHeading id="intro-heading" eyebrow="Introduction" title="Why heart rate zones matter">
          Heart rate gives runners a practical, real-time indication of how hard the body is working.
          Zones turn that number into guidance: easy days stay easy, and hard days are hard on purpose.
          But there is no single &ldquo;correct&rdquo; set of zones. Each method measures intensity
          against a different physiological reference, so the same runner can get different, equally
          reasonable ranges.
        </SectionHeading>
      </section>

      {/* Three methods */}
      <section aria-labelledby="methods-heading" className="container-page pb-16 sm:pb-20">
        <SectionHeading id="methods-heading" eyebrow="Three approaches" title="Three ways to calculate your zones" />
        <ul className="mt-10 grid gap-px border border-line bg-line md:grid-cols-3">
          {METHODS.map((m) => (
            <li key={m.id} className="flex flex-col bg-paper p-6">
              <p className="font-display text-sm text-accent">Method {m.number}</p>
              <h3 className="mt-2 text-xl font-semibold">{m.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{m.short}</p>
              <Link to={m.to} className="link-underline mt-5 text-sm font-medium">
                Open this calculator<span className="sr-only"> for {m.name}</span> →
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">
          Want to see them together? <Link to="/compare" className="link-underline">Compare all three methods</Link>.
        </p>
      </section>

      {/* Five zones */}
      <section aria-labelledby="zones-heading" className="container-page pb-16 sm:pb-20">
        <SectionHeading id="zones-heading" eyebrow="Five-zone system" title="Five zones, five training purposes">
          These are general educational labels. The actual boundaries, and what each zone means
          physiologically, depend on the method you choose, so a Zone 2 from one method is not
          automatically the same as a Zone 2 from another.
        </SectionHeading>
        <div className="mt-10">
          <ZoneStrip />
        </div>
      </section>

      {/* Research highlight */}
      <section aria-labelledby="research-heading" className="container-page pb-16 sm:pb-20">
        <SectionHeading id="research-heading" eyebrow="Research highlight" title="The people behind the methods">
          Researchers who studied these methods, and a coach who popularised practical field testing.
        </SectionHeading>
        <ul className="mt-10 grid gap-px border border-line bg-line md:grid-cols-3">
          {RESEARCHER_HIGHLIGHTS.map((r) => (
            <li key={r.slug} className="bg-paper p-6">
              <h3 className="text-xl font-semibold">{r.name}</h3>
              <p className="mt-1 text-sm text-muted">{r.descriptor}</p>
              <p className="mt-4 text-sm"><span className="font-medium">Topic:</span> {r.topic}</p>
              <p className="mt-1 text-sm text-muted">{r.featured}</p>
              <Link to={`/researchers#${r.slug}`} className="link-underline mt-5 inline-block text-sm font-medium">
                View profile<span className="sr-only"> of {r.name}</span> →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* References */}
      <section aria-labelledby="refs-heading" className="container-page pb-16 sm:pb-20">
        <SectionHeading id="refs-heading" eyebrow="Scientific references" title="Primary sources, linked">
          Every calculation is traceable to a published source.
        </SectionHeading>
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {REFERENCES.map((ref) => (
            <li key={ref.id} className="grid gap-2 py-5 md:grid-cols-[1fr_2fr]">
              <p className="text-sm text-muted">{ref.authors} ({ref.year})</p>
              <div>
                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="link-underline font-medium">
                  {ref.title}
                </a>
                <p className="mt-1 text-sm text-muted">{ref.venue}</p>
                <p className="mt-1 text-sm text-muted">{ref.relevance}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <Link to="/references" className="link-underline font-medium">Browse the reference library →</Link>
        </p>
      </section>

      {/* Donation */}
      <div className="container-page">
        <DonationSection />
      </div>
    </>
  );
}

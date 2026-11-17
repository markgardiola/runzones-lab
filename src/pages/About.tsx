import { Link } from 'react-router-dom';
import Disclaimer from '../components/common/Disclaimer';
import DonationSection from '../components/donation/DonationSection';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export default function About() {
  useDocumentMeta(
    'About RunZones Lab',
    'Why RunZones Lab exists, its educational mission, its commitment to scientific transparency, and how to support it.',
  );
  return (
    <div className="container-page py-12 sm:py-16">
      <p className="eyebrow">About</p>
      <h1 className="mt-2 text-4xl font-medium sm:text-5xl">About RunZones Lab</h1>

      <div className="mt-8 max-w-3xl space-y-10">
        <section aria-labelledby="why-heading">
          <h2 id="why-heading" className="text-2xl font-medium">Why RunZones Lab exists</h2>
          <p className="mt-3 leading-relaxed">
            Most heart rate calculators give you numbers and nothing else. RunZones Lab was created to show where those numbers
            come from: the formulas, the research behind them, and their limits, so that runners can decide how much weight to give
            them.
          </p>
        </section>

        <section aria-labelledby="mission-heading">
          <h2 id="mission-heading" className="text-2xl font-medium">Educational mission</h2>
          <p className="mt-3 leading-relaxed">
            To make exercise physiology and science-based heart rate training more accessible to everyday runners through
            transparent calculations, reliable scientific references, and understandable educational content.
          </p>
        </section>

        <section aria-labelledby="transparency-heading">
          <h2 id="transparency-heading" className="text-2xl font-medium">Commitment to scientific transparency</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
            <li>Every calculator shows its working: the formula, your inputs, each substitution and the rounding rules.</li>
            <li>
              Zone presets are labelled “sourced”, “provisional” or “custom”. The %HRR preset is provisional because no authoritative
              source was found for it.
            </li>
            <li>Estimated values are always labelled as estimates and never presented as measurements.</li>
            <li>
              The <Link to="/references" className="link-underline">reference library</Link> records how far each source was checked,
              from read in full to citation only, and says so when a link or year could not be verified.
            </li>
            <li>No method is presented as universally better than the others, and unverified claims are left out rather than guessed.</li>
          </ul>
          <p className="mt-3 text-sm text-muted">
            Learn how the methods work in <Link to="/science" className="link-underline">the science section</Link>, or meet the{' '}
            <Link to="/researchers" className="link-underline">researchers and coaches</Link> behind them.
          </p>
        </section>

        <section aria-labelledby="free-heading">
          <h2 id="free-heading" className="text-2xl font-medium">Free to use</h2>
          <p className="mt-3 leading-relaxed">
            RunZones Lab is free, needs no registration, and keeps every calculator and article available to everyone. Donations are
            voluntary and unlock nothing.
          </p>
        </section>
      </div>

      <div className="mt-12 max-w-3xl">
        <DonationSection />
      </div>

      <div className="mt-16 max-w-3xl border-t border-line pt-8">
        <Disclaimer variant="full" />
      </div>
    </div>
  );
}

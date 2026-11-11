import { Link } from 'react-router-dom';
import { NAV_ITEMS } from '../../config/navigation';
import { SITE } from '../../config/site';
import DonationLink from '../donation/DonationLink';
import Disclaimer from '../common/Disclaimer';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="track-rule" aria-hidden="true" />
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <section aria-labelledby="footer-about">
          <h2 id="footer-about" className="font-display text-lg font-semibold">About RunZones Lab</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {SITE.tagline} A free, educational platform that explains how heart rate training zones
            are calculated, and where the methods come from.
          </p>
          <div className="mt-4">
            <DonationLink />
          </div>
        </section>

        <nav aria-label="Footer">
          <h2 className="eyebrow">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="link-underline">{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-disclaimer">
          <h2 id="footer-disclaimer" className="eyebrow">Disclaimer</h2>
          <div className="mt-3">
            <Disclaimer variant="short" />
          </div>
        </section>
      </div>
      <div className="border-t border-line">
        <p className="container-page py-5 text-xs text-muted">
          © {new Date().getFullYear()} {SITE.name}. Scientific references are listed on the{' '}
          <Link to="/references" className="link-underline">References</Link> page.
        </p>
      </div>
    </footer>
  );
}

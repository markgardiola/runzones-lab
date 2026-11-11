import { DONATION_URL } from '../../config/site';

export default function DonationSection() {
  return (
    <section aria-labelledby="donate-heading" className="border border-ink p-8 sm:p-12">
      <p className="eyebrow">Voluntary support</p>
      <h2 id="donate-heading" className="mt-2 text-3xl font-medium sm:text-4xl">Support RunZones Lab</h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted">
        RunZones Lab is built to help runners better understand the science behind their training. If
        you find this platform useful, consider supporting its continued development through a
        voluntary contribution.
      </p>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Every calculator and article stays free. Payments are handled entirely on PayPal's own page;
        this site never sees or stores payment details.
      </p>
      <div className="mt-6">
        {DONATION_URL ? (
          <a href={DONATION_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Donate via PayPal
          </a>
        ) : (
          <span className="btn btn-disabled" role="link" aria-disabled="true">
            Donation link not yet configured
          </span>
        )}
      </div>
    </section>
  );
}

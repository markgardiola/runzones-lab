import { DONATION_URL } from '../../config/site';

/** Small inline donation link (footer). Never gates any feature. */
export default function DonationLink() {
  if (!DONATION_URL) {
    return (
      <span className="text-sm text-muted" aria-disabled="true">
        Donation link not yet configured.
      </span>
    );
  }
  return (
    <a href={DONATION_URL} target="_blank" rel="noopener noreferrer" className="link-underline text-sm">
      Support RunZones Lab via PayPal
    </a>
  );
}

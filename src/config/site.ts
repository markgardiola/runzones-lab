import { explainDonationUrl, parseDonationUrl } from '../utils/donation';

export const SITE = {
  name: 'RunZones Lab',
  tagline: 'Heart Rate Training, Explained by Science.',
  description:
    'Free, science-based heart rate zone calculators for runners: %MHR, Karvonen %HRR and a field-estimated threshold method, with the research behind each.',
} as const;

/** null until the owner supplies a valid PayPal URL via VITE_PAYPAL_DONATION_URL. */
const RAW_DONATION_URL = import.meta.env.VITE_PAYPAL_DONATION_URL;
export const DONATION_URL: string | null = parseDonationUrl(RAW_DONATION_URL);

// A typo in the link must not fail silently: the button would just stay disabled.
const donationProblem = explainDonationUrl(RAW_DONATION_URL);
if (donationProblem) {
  console.warn(`VITE_PAYPAL_DONATION_URL is set but not accepted, so the donate button stays disabled. ${donationProblem}`);
}

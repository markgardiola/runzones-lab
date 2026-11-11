import { parseDonationUrl } from '../utils/donation';

export const SITE = {
  name: 'RunZones Lab',
  tagline: 'Heart Rate Training, Explained by Science.',
  description:
    'Free, science-based heart rate zone calculators for runners: %MHR, Karvonen %HRR and a field-estimated threshold method, with the research behind each.',
} as const;

/** null until the owner supplies a valid PayPal URL via VITE_PAYPAL_DONATION_URL. */
export const DONATION_URL: string | null = parseDonationUrl(import.meta.env.VITE_PAYPAL_DONATION_URL);

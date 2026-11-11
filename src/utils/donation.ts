export const DONATION_PLACEHOLDER = 'PAYPAL_DONATION_URL_NOT_SET';

/**
 * Validates the owner-supplied donation URL. Returns a normalised https URL on
 * PayPal's own domains, or null when unset, malformed, non-https or off-domain.
 * No payment data is ever handled by this site; the link opens PayPal's page.
 */
export function parseDonationUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === DONATION_PLACEHOLDER) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.toLowerCase();
    const allowed =
      host === 'paypal.me' ||
      host === 'paypal.com' ||
      host.endsWith('.paypal.com') ||
      host.endsWith('.paypal.me');
    return allowed ? url.toString() : null;
  } catch {
    return null;
  }
}

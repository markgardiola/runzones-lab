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

/**
 * Explains in plain words why a configured donation URL is not accepted, or returns null when it is
 * fine (or when nothing is configured). Used for a console warning so a typo is not silent.
 */
export function explainDonationUrl(raw: string | undefined | null): string | null {
  if (!raw || !raw.trim() || raw.trim() === DONATION_PLACEHOLDER) return null;
  if (parseDonationUrl(raw) !== null) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return 'It is not a valid web address. Paste the full link, starting with https://';
  }
  if (url.protocol !== 'https:') return 'It must start with https://';
  return `The address ${url.hostname} is not a PayPal domain. Only paypal.com and paypal.me links are accepted.`;
}

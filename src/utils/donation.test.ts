import { describe, expect, it } from 'vitest';
import { DONATION_PLACEHOLDER, parseDonationUrl } from './donation';

describe('parseDonationUrl', () => {
  it('returns null when unset, empty or placeholder', () => {
    expect(parseDonationUrl(undefined)).toBeNull();
    expect(parseDonationUrl('')).toBeNull();
    expect(parseDonationUrl('   ')).toBeNull();
    expect(parseDonationUrl(DONATION_PLACEHOLDER)).toBeNull();
  });

  it('accepts https PayPal.Me and paypal.com URLs', () => {
    expect(parseDonationUrl('https://paypal.me/example')).toBe('https://paypal.me/example');
    expect(parseDonationUrl('https://www.paypal.com/donate/?hosted_button_id=X')).toContain('paypal.com');
  });

  it('rejects non-https, malformed and look-alike domains', () => {
    expect(parseDonationUrl('http://paypal.me/example')).toBeNull();
    expect(parseDonationUrl('not a url')).toBeNull();
    expect(parseDonationUrl('https://evilpaypal.com/x')).toBeNull();
    expect(parseDonationUrl('https://paypal.com.evil.example/x')).toBeNull();
  });
});

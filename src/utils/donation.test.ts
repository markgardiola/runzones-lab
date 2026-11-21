import { describe, expect, it } from 'vitest';
import { DONATION_PLACEHOLDER, explainDonationUrl, parseDonationUrl } from './donation';

describe('accepted PayPal link formats', () => {
  it('accepts the formats PayPal gives out', () => {
    for (const u of [
      'https://www.paypal.me/yourname',
      'https://paypal.me/yourname/5USD',
      'https://www.paypal.com/donate/?hosted_button_id=ABC123XYZ',
      'https://www.paypal.com/donate?business=ABC123&no_recurring=0&currency_code=USD',
      'https://www.paypal.com/ncp/payment/ABC123',
      'https://www.sandbox.paypal.com/donate/?hosted_button_id=TEST123',
    ]) {
      expect(`${u} -> ${parseDonationUrl(u) !== null}`).toBe(`${u} -> true`);
    }
  });
});

describe('explainDonationUrl', () => {
  it('says nothing when unset or valid', () => {
    expect(explainDonationUrl('')).toBeNull();
    expect(explainDonationUrl(undefined)).toBeNull();
    expect(explainDonationUrl('https://paypal.me/yourname')).toBeNull();
  });
  it('explains each kind of mistake', () => {
    expect(explainDonationUrl('paypal.me/yourname')).toContain('not a valid web address');
    expect(explainDonationUrl('http://paypal.me/yourname')).toContain('https://');
    expect(explainDonationUrl('https://example.com/pay')).toContain('example.com is not a PayPal domain');
  });
});

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

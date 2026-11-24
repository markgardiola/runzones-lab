import { describe, expect, it } from 'vitest';
import { initials } from './initials';

describe('initials', () => {
  it('uses the first and last name', () => {
    expect(initials('Hirofumi Tanaka')).toBe('HT');
    expect(initials('Martti Karvonen')).toBe('MK');
    expect(initials('William L. Haskell')).toBe('WH');
    expect(initials('Joe Friel')).toBe('JF');
  });
  it('handles one name, extra spaces and an empty string', () => {
    expect(initials('Cher')).toBe('C');
    expect(initials('  Joe   Friel  ')).toBe('JF');
    expect(initials('')).toBe('');
  });
});

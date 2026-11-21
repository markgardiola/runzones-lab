import { expect, test, type Page } from '@playwright/test';
import { calculate, openCalculator, useMeasuredHrmax } from './helpers';

// The tests decide what to check from what the page actually shows, not from guessing at
// environment variables: the site is either built with a donation link or without one.
// playwright.config.ts loads the same .env files as Vite, so EXPECTED is the link the site was built with.
const PAYPAL_LINK = /^https:\/\/([a-z0-9-]+\.)*paypal\.(com|me)\//i;
const EXPECTED = process.env.VITE_PAYPAL_DONATION_URL;

const donateButton = (page: Page) => page.getByRole('link', { name: /Donate via PayPal/ });

for (const route of ['/', '/about']) {
  test.describe(`donation on ${route}`, () => {
    test('when a link is configured, the button opens it in a new tab, safely', async ({ page }) => {
      await page.goto(route);
      test.skip((await donateButton(page).count()) === 0, 'No donation link is configured on this site');
      const button = donateButton(page);
      await expect(button).toBeVisible();
      await expect(button).toHaveAttribute('href', PAYPAL_LINK);
      if (EXPECTED) await expect(button).toHaveAttribute('href', EXPECTED);
      await expect(button).toHaveAttribute('target', '_blank');
      await expect(button).toHaveAttribute('rel', /noopener/);
      await expect(page.getByText('Donation link not yet configured')).toHaveCount(0);
    });

    test('when no link is configured, the button is disabled and nothing links to PayPal', async ({ page }) => {
      await page.goto(route);
      test.skip((await donateButton(page).count()) > 0, 'A donation link is configured on this site');
      await expect(page.getByText('Donation link not yet configured').first()).toBeVisible();
      await expect(page.locator('a[href*="paypal"]')).toHaveCount(0);
    });
  });
}

test('when a link is configured, the footer link is on every page and matches the button', async ({ page }) => {
  await page.goto('/about');
  test.skip((await donateButton(page).count()) === 0, 'No donation link is configured on this site');
  const href = await donateButton(page).getAttribute('href');
  for (const route of ['/', '/calculator', '/science']) {
    await page.goto(route);
    await expect(page.locator('footer').getByRole('link', { name: /Support RunZones Lab via PayPal/ })).toHaveAttribute('href', href!);
  }
});

test('the site itself loads nothing from PayPal and collects no payment details', async ({ page }) => {
  const paypalRequests: string[] = [];
  page.on('request', (r) => {
    if (/paypal/i.test(new URL(r.url()).hostname)) paypalRequests.push(r.url());
  });
  await page.goto('/about');
  await page.waitForLoadState('networkidle');
  expect(paypalRequests).toEqual([]);
  await expect(page.locator('input[type="password"], input[autocomplete^="cc-"], iframe[src*="paypal"]')).toHaveCount(0);
});

test('no feature is gated behind donating: the calculator works either way', async ({ page }) => {
  const p = await openCalculator(page, 'mhr');
  await useMeasuredHrmax(p, '190');
  await calculate(p);
  await expect(p).toContainText('139–157 bpm');
});

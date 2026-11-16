import { expect, test } from '@playwright/test';

const ROUTES = ['/', '/calculator', '/compare', '/science', '/researchers', '/references', '/about'];

test.describe('every page loads cleanly', () => {
  for (const route of ROUTES) {
    test(`${route}: one h1, a RunZones Lab title, no console errors, no sideways scroll`, async ({ page }) => {
      const problems: string[] = [];
      page.on('pageerror', (e) => problems.push(String(e)));
      page.on('console', (m) => {
        if (m.type() === 'error') problems.push(m.text());
      });
      await page.goto(route);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle(/RunZones Lab/);
      for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 900 });
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `sideways overflow at ${width}px`).toBeLessThanOrEqual(1);
      }
      expect(problems).toEqual([]);
    });
  }

  test('an unknown URL shows the 404 page instead of a blank screen', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });
});

test.describe('navigation and links', () => {
  test('the home page call to action opens the calculator', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Calculate My Heart Rate Zones' }).click();
    await expect(page).toHaveURL(/\/calculator$/);
  });

  test('a method card opens the matching calculator tab', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Open this calculator for Threshold-Based Field Estimate/ }).click();
    await expect(page).toHaveURL(/method=threshold/);
    await expect(page.getByRole('tab', { name: /Threshold/ })).toHaveAttribute('aria-selected', 'true');
  });

  test('the primary navigation reaches each page and marks the current one', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await nav.getByRole('link', { name: 'Science' }).click();
    await expect(page).toHaveURL(/\/science$/);
    await expect(nav.getByRole('link', { name: 'Science' })).toHaveAttribute('aria-current', 'page');
  });

  test('the footer disclaimer link opens the full disclaimer', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Read the full disclaimer' }).click();
    await expect(page).toHaveURL(/\/about#disclaimer$/);
    await expect(page.getByRole('heading', { name: 'Medical and educational disclaimer' })).toBeVisible();
  });

  test('the phone menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto('/');
    const menu = page.getByRole('button', { name: 'Menu' });
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await menu.click();
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Compare' })).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Compare' })).toBeHidden();
  });

  test('deep links work on a fresh load (what the Vercel rewrite is for)', async ({ page }) => {
    await page.goto('/compare');
    await expect(page.getByRole('heading', { name: 'Compare the Three Methods' })).toBeVisible();
  });
});

test.describe('donation', () => {
  test('without a configured link, the button is disabled and no link to PayPal exists', async ({ page }) => {
    test.skip(Boolean(process.env.VITE_PAYPAL_DONATION_URL), 'A donation URL is configured in this environment');
    await page.goto('/');
    await expect(page.getByText('Donation link not yet configured').first()).toBeVisible();
    await expect(page.locator('a[href*="paypal"]')).toHaveCount(0);
  });
});

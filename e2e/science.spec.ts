import { expect, test } from '@playwright/test';

const ARTICLES = [
  'understanding-heart-rate',
  'maximum-heart-rate-method',
  'karvonen-heart-rate-reserve-method',
  'threshold-field-testing-method',
  'five-zones',
];

test.describe('science section', () => {
  test('the index lists every article and each link opens it', async ({ page }) => {
    await page.goto('/science');
    await expect(page.locator('main ol li')).toHaveCount(5);
    await page.getByRole('link', { name: 'The maximum heart rate (%MHR) method' }).click();
    await expect(page).toHaveURL(/\/science\/maximum-heart-rate-method$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('maximum heart rate');
  });

  for (const slug of ARTICLES) {
    test(`${slug}: loads with supporting references that open the reference library`, async ({ page }) => {
      await page.goto(`/science/${slug}`);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.getByRole('heading', { name: 'Supporting references' })).toBeVisible();
      const first = page.locator('#supporting-refs ~ ul a, section[aria-labelledby="supporting-refs"] a').first();
      const href = await first.getAttribute('href');
      expect(href).toMatch(/^\/references#/);
      await first.click();
      await expect(page).toHaveURL(/\/references#/);
      await expect(page.locator(`#${href!.split('#')[1]}`)).toBeInViewport();
    });
  }

  test('each method article has every required section', async ({ page }) => {
    for (const slug of ['maximum-heart-rate-method', 'karvonen-heart-rate-reserve-method', 'threshold-field-testing-method']) {
      await page.goto(`/science/${slug}`);
      const headings = await page.locator('article h2').allInnerTexts();
      for (const h of ['Historical background', 'The scientific concept', 'The formula', 'Example calculation', 'Advantages', 'Limitations', 'Practical applications', 'Supporting references']) {
        expect(headings, `${slug} is missing "${h}"`).toContain(h);
      }
    }
  });

  test('worked examples show the same numbers as the calculators', async ({ page }) => {
    await page.goto('/science/maximum-heart-rate-method');
    await expect(page.locator('article')).toContainText('139–157 bpm');
    await expect(page.locator('article')).toContainText('166–180 bpm');
    await page.goto('/science/karvonen-heart-rate-reserve-method');
    await expect(page.locator('article')).toContainText('120–133 bpm');
    await expect(page.locator('article')).toContainText('50 + (140 × 70%)');
    await expect(page.locator('article')).toContainText('154 bpm');
    await page.goto('/science/threshold-field-testing-method');
    await expect(page.locator('article')).toContainText('161.5 bpm');
    await expect(page.locator('article')).toContainText('5a: 162–165 bpm');
  });

  test('the five-zones article shows the methods side by side and the ACSM classes', async ({ page }) => {
    await page.goto('/science/five-zones');
    const a = page.locator('article');
    await expect(a).toContainText('139–157 bpm');
    await expect(a).toContainText('134–147 bpm');
    await expect(a).toContainText('126–140 bpm');
    await expect(a).toContainText('64–76');
    await expect(a).toContainText('Friel’s descriptors for each zone');
    await expect(a).toContainText('No method is automatically better');
  });

  test('the method article links to its calculator tab; previous and next links work', async ({ page }) => {
    await page.goto('/science/karvonen-heart-rate-reserve-method');
    await page.getByRole('link', { name: 'Open the %HRR calculator' }).click();
    await expect(page).toHaveURL(/method=hrr/);
    await page.goto('/science/maximum-heart-rate-method');
    await page.getByRole('navigation', { name: 'Other articles' }).getByRole('link', { name: /Karvonen/ }).click();
    await expect(page).toHaveURL(/karvonen-heart-rate-reserve-method$/);
  });

  test('wide tables scroll inside the article on a phone, not the page', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    for (const slug of ARTICLES) {
      await page.goto(`/science/${slug}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${slug} overflows sideways`).toBeLessThanOrEqual(1);
    }
  });
});

test.describe('about page', () => {
  test('explains the mission and transparency commitments, and includes the disclaimer', async ({ page }) => {
    await page.goto('/about');
    for (const h of ['Why RunZones Lab exists', 'Educational mission', 'Commitment to scientific transparency', 'Free to use', 'Support RunZones Lab', 'Medical and educational disclaimer']) {
      await expect(page.getByRole('heading', { name: h })).toBeVisible();
    }
    await expect(page.locator('main')).toContainText('provisional because no authoritative');
    await expect(page.locator('#disclaimer')).toBeVisible();
  });

  test('without a configured donation URL, the donate button is disabled and nothing links to PayPal', async ({ page }) => {
    test.skip(Boolean(process.env.VITE_PAYPAL_DONATION_URL), 'A donation URL is configured in this environment');
    await page.goto('/about');
    await expect(page.getByText('Donation link not yet configured').first()).toBeVisible();
    await expect(page.locator('a[href*="paypal"]')).toHaveCount(0);
  });
});

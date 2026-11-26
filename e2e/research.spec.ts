import { expect, test } from '@playwright/test';

test.describe('researchers page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/researchers');
    await expect(page.getByRole('heading', { level: 1, name: 'Researchers and Coaches' })).toBeVisible();
  });

  test('shows a profile for each researcher and coach, kept apart by role', async ({ page }) => {
    for (const name of ['Hirofumi Tanaka', 'Martti Karvonen', 'William L. Haskell', 'Joe Friel']) {
      await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
    }
    await expect(page.locator('#friel')).toContainText(/coach and author/i);
    await expect(page.locator('#tanaka')).toContainText(/researcher/i);
  });

  test('every profile states what it does not claim and shows a portrait or an honest placeholder', async ({ page }) => {
    for (const slug of ['tanaka', 'karvonen', 'haskell', 'friel']) {
      const profile = page.locator(`#${slug}`);
      await expect(profile).toContainText('What this profile does not claim');
      // With no licensed image supplied yet, a monogram placeholder is shown instead of a photo
      if ((await profile.locator('[data-portrait="image"]').count()) === 0) {
        await expect(profile.locator('[data-portrait="placeholder"]')).toContainText('Portrait not yet available');
      } else {
        await expect(profile.locator('[data-portrait="image"] img')).toHaveAttribute('alt', /.+/);
        await expect(profile.locator('[data-portrait="image"] figcaption')).toContainText(/\S/);
      }
      await expect(profile).toContainText('Sources for this profile');
    }
  });

  test('careful attribution: Karvonen is reported second-hand, Haskell is not blamed for 220 − age, Friel is a coach', async ({ page }) => {
    await expect(page.locator('#karvonen')).toContainText('has not read the 1957 paper itself');
    await expect(page.locator('#karvonen')).toContainText('No single publication proves every modern use');
    await expect(page.locator('#haskell')).toContainText('does not say Haskell personally devised');
    await expect(page.locator('#friel')).toContainText('not peer-reviewed research');
  });

  test('external source links open safely in a new tab', async ({ page }) => {
    const links = page.locator('#tanaka a[href^="https://"]');
    expect(await links.count()).toBeGreaterThan(0);
    for (const rel of await links.evaluateAll((els) => els.map((e) => e.getAttribute('rel') ?? ''))) {
      expect(rel).toContain('noopener');
    }
  });

  test('the jump links go to the profile', async ({ page }) => {
    await page.getByRole('link', { name: 'William L. Haskell' }).first().click();
    await expect(page).toHaveURL(/#haskell$/);
    await expect(page.locator('#haskell')).toBeInViewport();
  });

  test('a publication link opens the matching entry in the reference library, scrolled into view', async ({ page }) => {
    await page.locator('#tanaka').getByRole('link', { name: 'Age-predicted maximal heart rate revisited' }).click();
    await expect(page).toHaveURL(/\/references#tanaka-2001$/);
    await expect(page.locator('#tanaka-2001')).toBeInViewport();
  });
});

test('home page profile links scroll to the right profile', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /View profile of Martti Karvonen/ }).click();
  await expect(page).toHaveURL(/\/researchers#karvonen$/);
  await expect(page.locator('#karvonen')).toBeInViewport();
});

test('the footer disclaimer link scrolls to the disclaimer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Read the full disclaimer' }).click();
  await expect(page.locator('#disclaimer')).toBeInViewport();
});

test.describe('reference library', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/references');
    await expect(page.getByRole('heading', { level: 1, name: 'Scientific References' })).toBeVisible();
  });

  test('groups sources by type, peer-reviewed research first', async ({ page }) => {
    const headings = await page.locator('main h2').allInnerTexts();
    expect(headings[0]).toMatch(/how sources were checked/i);
    expect(headings[1]).toBe('Peer-reviewed research');
    expect(headings).toContain('Guidelines and position stands');
    expect(headings).toContain('Coaching methodology (primary publications)');
    expect(headings).toContain('Practitioner and manufacturer sources');
  });

  test('each entry shows identifiers and links, and says how it was checked', async ({ page }) => {
    const tanaka = page.locator('#tanaka-2001');
    await expect(tanaka).toContainText('Read in full');
    await expect(tanaka.getByRole('link', { name: 'Age-predicted maximal heart rate revisited' })).toHaveAttribute(
      'href',
      'https://pubmed.ncbi.nlm.nih.gov/11153730/',
    );
    await expect(tanaka.getByRole('link', { name: '10.1016/s0735-1097(00)01054-8' })).toHaveAttribute('href', /doi\.org/);
    const karvonen = page.locator('#karvonen-1957');
    await expect(karvonen).toContainText('Citation checked; content not read');
    await expect(karvonen).toContainText('the paper itself was not read');
  });

  test('sources without a verified link or year say so instead of inventing one', async ({ page }) => {
    await expect(page.locator('#edwards-hrm-book')).toContainText('year not verified');
    await expect(page.locator('#edwards-hrm-book a[href]')).toHaveCount(0);
    await expect(page.locator('#robergs-2002')).toContainText('No publisher link was verified');
  });

  test('practitioner sources are labelled as not scientific evidence', async ({ page }) => {
    await expect(page.locator('#polar-heart-rate-zones')).toContainText('not a scientific source');
  });
});

import { expect, test, type Page } from '@playwright/test';
import { calculate, editZone, panel, useMeasuredHrmax } from './helpers';

const compare = (page: Page) => page.getByRole('button', { name: 'Compare methods' });

async function fillFull(page: Page) {
  await page.getByLabel('I know my measured maximum heart rate').check();
  await page.getByLabel(/Measured maximum heart rate/).fill('190');
  await page.getByLabel(/Resting heart rate/).fill('50');
  await page.getByLabel(/Average heart rate over a 20-minute time trial/).fill('170');
}

test.describe('comparison dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/compare');
    await expect(page).toHaveURL(/\/compare$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Compare the Three Methods' })).toBeVisible();
  });

  test('shows nothing until you compare; empty input shows every method as incomplete, with no invented zones', async ({ page }) => {
    await expect(page.getByText('Side-by-side results')).toHaveCount(0);
    await compare(page).click();
    const table = page.locator('table');
    await expect(table).toContainText('Incomplete: needs hrmax source');
    await expect(table).toContainText('Incomplete: needs hrmax source, resting heart rate');
    await expect(table).toContainText('Incomplete: needs 20-minute average heart rate');
    await expect(table).not.toContainText(/\d{2,3}–\d{2,3} bpm/);
    await expect(page.getByText('Complete at least one method')).toBeVisible();
  });

  test('only a 20-minute average: threshold is filled in, the others stay empty', async ({ page }) => {
    await page.getByLabel(/Average heart rate over a 20-minute time trial/).fill('170');
    await compare(page).click();
    await expect(page.locator('table')).toContainText('126–140 bpm');
    await expect(page.locator('table')).not.toContainText('139–157 bpm');
    await expect(page.locator('[data-chart-method="threshold"]')).toHaveCount(5);
    await expect(page.locator('[data-chart-method="mhr"]')).toHaveCount(0);
  });

  test('full inputs give all three methods side by side with badges, assumptions and observations', async ({ page }) => {
    await expect(page).toHaveURL(/\/compare$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Compare the Three Methods' })).toBeVisible();
    await fillFull(page);
    await compare(page).click();
    const table = page.locator('table');
    for (const text of ['139–157 bpm', '134–147 bpm', '126–140 bpm', '120–133 bpm', '162+ bpm']) {
      await expect(table).toContainText(text);
    }
    await expect(table).toContainText(/sourced preset/i);
    await expect(table).toContainText(/provisional preset/i);
    // The same HRmax line is listed under both %MHR and %HRR
    await expect(page.getByText('HRmax: 190 bpm (measured value entered by you)')).toHaveCount(2);
    await expect(page.getByText('Estimated FTHR: 161.5 bpm', { exact: false })).toBeVisible();
    await expect(page.getByText('a difference of 15 bpm', { exact: false })).toBeVisible();
    await expect(page.getByText('a spread of 15 bpm', { exact: false })).toBeVisible();
    await expect(page.getByText('None of the three methods is automatically better', { exact: false })).toBeVisible();
  });

  test('the chart uses one shared axis: the same bpm sits at the same position in every row', async ({ page }) => {
    await expect(page).toHaveURL(/\/compare$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Compare the Three Methods' })).toBeVisible();
    await fillFull(page);
    await compare(page).click();
    const pos = (method: string, zone: number) =>
      page.evaluate(
        ({ method, zone }) => {
          const seg = document.querySelector(`[data-chart-method="${method}"][data-chart-zone="${zone}"]`)!;
          const bar = seg.parentElement!.getBoundingClientRect();
          const r = seg.getBoundingClientRect();
          return (r.left - bar.left) / bar.width;
        },
        { method, zone },
      );
    // Axis is 110–200 bpm for these inputs
    expect(Math.abs((await pos('mhr', 2)) - (139 - 110) / 90)).toBeLessThan(0.01);
    expect(Math.abs((await pos('threshold', 2)) - (126 - 110) / 90)).toBeLessThan(0.01);
    expect(Math.abs((await pos('hrr', 1)) - (120 - 110) / 90)).toBeLessThan(0.01);
  });

  test('inconsistent values block the comparison with a clear message', async ({ page }) => {
    await expect(page).toHaveURL(/\/compare$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Compare the Three Methods' })).toBeVisible();
    await fillFull(page);
    await page.getByLabel(/Average heart rate over a 20-minute time trial/).fill('195');
    await compare(page).click();
    await expect(page.getByRole('alert')).toContainText('above your measured HRmax');
    await expect(page.locator('table')).toHaveCount(0);
  });

  test('different HRmax sources per method are allowed and the assumptions are visible', async ({ page }) => {
    await expect(page).toHaveURL(/\/compare$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Compare the Three Methods' })).toBeVisible();
    await fillFull(page);
    await page.getByLabel('Age (years)', { exact: true }).fill('40');
    await page.getByLabel('Use a different HRmax source for %MHR or %HRR').check();
    await page.getByLabel('HRmax source for %MHR', { exact: true }).selectOption('tanaka');
    await compare(page).click();
    await expect(page.getByText('HRmax: 180 bpm (estimated: tanaka', { exact: false })).toBeVisible();
    await expect(page.getByText('HRmax: 190 bpm (measured', { exact: false })).toBeVisible();
    await expect(page.getByText('use different HRmax sources', { exact: false })).toBeVisible();
  });

  test('on a phone the page does not scroll sideways; the table scrolls inside itself', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await expect(page).toHaveURL(/\/compare$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Compare the Three Methods' })).toBeVisible();
    await fillFull(page);
    await compare(page).click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    const scrolls = await page.evaluate(() => {
      const c = document.querySelector('table')!.parentElement!;
      return c.scrollWidth > c.clientWidth;
    });
    expect(scrolls).toBe(true);
  });
});

test('custom zones made on the Calculator page carry over to Compare, and can be reset there', async ({ page }) => {
  await page.goto('/calculator?method=mhr');
  const p = panel(page, 'mhr');
  await useMeasuredHrmax(p, '190');
  await calculate(p);
  await editZone(p, 2, 'upper', '88');

  // Client-side navigation keeps the in-memory edits (a full page load would not)
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Compare' }).click();
  await expect(page).toHaveURL(/\/compare$/);
  await expect(page.getByRole('heading', { level: 1, name: 'Compare the Three Methods' })).toBeVisible();
  await fillFull(page);
  await compare(page).click();
  await expect(page.locator('table')).toContainText(/custom zones/i);
  await expect(page.locator('table')).toContainText('139–166 bpm');
  await expect(page.getByText('Custom zone percentages (set on the Calculator page) are in use')).toBeVisible();
  await expect(page.getByText('%MHR is using custom zone percentages', { exact: false })).toBeVisible();

  await page.getByRole('button', { name: 'Reset %MHR to preset' }).click();
  await expect(page.locator('table')).toContainText('139–157 bpm');
  await expect(page.getByText('Custom zone percentages (set on the Calculator page)')).toHaveCount(0);
});

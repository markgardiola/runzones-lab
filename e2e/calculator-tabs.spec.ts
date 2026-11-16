import { expect, test } from '@playwright/test';
import { calculate, panel, useMeasuredHrmax } from './helpers';

const visiblePanels = (page: import('@playwright/test').Page) =>
  page.$$eval('[role=tabpanel]', (els) => els.filter((e) => !(e as HTMLElement).hidden).map((e) => e.id));

test.describe('calculator tabs', () => {
  test('?method= deep links select the right tab and panel', async ({ page }) => {
    await page.goto('/calculator?method=hrr');
    await expect(page.getByRole('tab', { name: /HRR/ })).toHaveAttribute('aria-selected', 'true');
    expect(await visiblePanels(page)).toEqual(['calc-panel-hrr']);
    await page.goto('/calculator?method=bogus');
    await expect(page.getByRole('tab', { name: '%MHR' })).toHaveAttribute('aria-selected', 'true');
  });

  test('clicking a tab switches the panel and updates the URL', async ({ page }) => {
    await page.goto('/calculator');
    await page.getByRole('tab', { name: /Threshold/ }).click();
    expect(await visiblePanels(page)).toEqual(['calc-panel-threshold']);
    await expect(page).toHaveURL(/method=threshold/);
  });

  test('arrow keys, Home and End move between tabs and wrap around', async ({ page }) => {
    await page.goto('/calculator?method=mhr');
    await page.getByRole('tab', { name: '%MHR' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: /HRR/ })).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('End');
    await expect(page.getByRole('tab', { name: /Threshold/ })).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: '%MHR' })).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByRole('tab', { name: /Threshold/ })).toHaveAttribute('aria-selected', 'true');
  });

  test('entered values and results survive switching tabs', async ({ page }) => {
    await page.goto('/calculator?method=mhr');
    const p = panel(page, 'mhr');
    await useMeasuredHrmax(p, '190');
    await calculate(p);
    await page.getByRole('tab', { name: /Threshold/ }).click();
    await page.getByRole('tab', { name: '%MHR' }).click();
    await expect(p).toContainText('139–157 bpm');
  });
});

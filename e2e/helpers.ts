import type { Locator, Page } from '@playwright/test';

export type Method = 'mhr' | 'hrr' | 'threshold';

/** The calculator panel for one method (all three live on /calculator; only one is visible). */
export const panel = (page: Page, method: Method): Locator => page.locator(`#calc-panel-${method}`);

export async function openCalculator(page: Page, method: Method): Promise<Locator> {
  await page.goto(`/calculator?method=${method}`);
  return panel(page, method);
}

export async function useMeasuredHrmax(scope: Locator, bpm: string): Promise<void> {
  await scope.getByLabel('I know my measured maximum heart rate').check();
  await scope.getByLabel(/Measured maximum heart rate/).fill(bpm);
}

export async function calculate(scope: Locator): Promise<void> {
  await scope.getByRole('button', { name: 'Calculate zones' }).click();
}

/** Types a percentage into a zone editor field and applies it with Enter. */
export async function editZone(scope: Locator, zone: number, side: 'lower' | 'upper', pct: string): Promise<void> {
  const field = scope.getByLabel(`Zone ${zone} ${side} percentage`);
  await field.fill(pct);
  await field.press('Enter');
}

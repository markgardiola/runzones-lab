import { expect, test } from '@playwright/test';
import { calculate, editZone, openCalculator, useMeasuredHrmax } from './helpers';

// HRmax 200 gives clearly unequal zones: Z1 ≤145, Z2 146–165, Z3 166–175, Z4 176–183, Z5 184–200.
async function mhr200(page: import('@playwright/test').Page) {
  const p = await openCalculator(page, 'mhr');
  await useMeasuredHrmax(p, '200');
  await calculate(p);
  return p;
}

test.describe('zone bar labels', () => {
  test.use({ viewport: { width: 1100, height: 900 } });

  test('each label is centred under its own zone, even when zones are unequal', async ({ page }) => {
    const p = await mhr200(page);
    const geo = await p.locator('figure').first().evaluate((fig) => {
      const out: { z: number; dLeft: number; dWidth: number; text: string }[] = [];
      for (let z = 1; z <= 5; z++) {
        const s = fig.querySelector(`[data-zone-segment="${z}"]`)!.getBoundingClientRect();
        const lab = fig.querySelector(`[data-zone-label="${z}"]`) as HTMLElement;
        const r = lab.getBoundingClientRect();
        out.push({ z, dLeft: Math.abs(s.left - r.left), dWidth: Math.abs(s.width - r.width), text: lab.innerText.replace(/\s+/g, ' ') });
      }
      return out;
    });
    for (const g of geo) {
      expect(g.dLeft, `Z${g.z} left edge`).toBeLessThan(1.5);
      expect(g.dWidth, `Z${g.z} width`).toBeLessThan(1.5);
    }
    expect(geo.map((g) => g.text)).toEqual(['Z1 ≤ 145', 'Z2 146–165', 'Z3 166–175', 'Z4 176–183', 'Z5 184–200']);
  });

  test('a zone too narrow for its label switches to the plain list', async ({ page }) => {
    const p = await mhr200(page);
    await editZone(p, 3, 'upper', '84');
    await expect(p.locator('[data-zone-label]')).toHaveCount(0);
    await expect(p.locator('figure ul').first()).toBeVisible();
  });
});

test('on a phone the readable list replaces the aligned labels', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  const p = await mhr200(page);
  await expect(p.locator('[data-zone-label]').first()).toBeHidden();
  await expect(p.locator('figure ul').first()).toContainText('Z4 176–183 bpm');
});

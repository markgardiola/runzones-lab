import { expect, test } from '@playwright/test';
import { calculate, editZone, openCalculator, useMeasuredHrmax } from './helpers';

test.describe('%MHR calculator', () => {
  test('asks you to choose an HRmax source and shows no results yet', async ({ page }) => {
    const p = await openCalculator(page, 'mhr');
    await calculate(p);
    await expect(p).toContainText('Choose how your maximum heart rate is determined.');
    await expect(p).not.toContainText('Your five heart rate zones');
  });

  test('requires a value once "measured" is chosen', async ({ page }) => {
    const p = await openCalculator(page, 'mhr');
    await p.getByLabel('I know my measured maximum heart rate').check();
    await calculate(p);
    await expect(p).toContainText('Maximum heart rate is required.');
  });

  test('measured HRmax 190 gives the hand-verified zones and a sourced-preset badge', async ({ page }) => {
    const p = await openCalculator(page, 'mhr');
    await useMeasuredHrmax(p, '190');
    await calculate(p);
    for (const text of ['≤ 138 bpm', '139–157 bpm', '158–166 bpm', '167–174 bpm', '175–190 bpm']) {
      await expect(p).toContainText(text);
    }
    await expect(p).toContainText(/sourced preset/i);
  });

  test('the breakdown is collapsed by default and shows your numbers when opened', async ({ page }) => {
    const p = await openCalculator(page, 'mhr');
    await useMeasuredHrmax(p, '190');
    await calculate(p);
    await expect(p.getByText('190 × 73%')).toBeHidden();
    await p.getByText('How was this calculated?').click();
    await expect(p.getByText('190 × 73%')).toBeVisible();
    await expect(p).toContainText('Each boundary is rounded once');
  });

  test('Tanaka estimate at age 40 gives HRmax 180 and is labelled as an estimate', async ({ page }) => {
    const p = await openCalculator(page, 'mhr');
    await p.getByLabel(/Tanaka equation/).check();
    await p.getByLabel('Age (years)').fill('40');
    await calculate(p);
    await expect(p).toContainText('166–180 bpm');
    await expect(p).toContainText('Estimated: Tanaka, Monahan and Seals (2001)');
  });

  test('invalid age is an error; an unusual age is only a warning', async ({ page }) => {
    const p = await openCalculator(page, 'mhr');
    await p.getByLabel(/Tanaka equation/).check();
    await p.getByLabel('Age (years)').fill('0');
    await calculate(p);
    await expect(p).toContainText('Age must be between 1 and 120 years.');
    await p.getByLabel('Age (years)').fill('90');
    await calculate(p);
    await expect(p).toContainText('less well supported');
    await expect(p).toContainText('Your five heart rate zones');
  });
});

test.describe('zone editing', () => {
  test('editing a zone moves the shared boundary and auto-adjusts neighbours', async ({ page }) => {
    const p = await openCalculator(page, 'mhr');
    await useMeasuredHrmax(p, '190');
    await calculate(p);
    await editZone(p, 2, 'upper', '88');
    await expect(p).toContainText(/custom zones/i);
    await expect(p).toContainText('139–166 bpm'); // Z2
    await expect(p).toContainText('167–168 bpm'); // Z3 was pushed
    await expect(p).toContainText('169–174 bpm'); // Z4
    await expect(p).toContainText('adjusted automatically so zones do not overlap');
    await expect(p.getByLabel('Zone 3 lower percentage')).toHaveValue('88');
    await expect(p.getByLabel('Zone 3 upper percentage')).toHaveValue('89');
    await expect(p).toContainText('Preset: 83%');
  });

  test('values that cannot fit are limited and the user is told', async ({ page }) => {
    const p = await openCalculator(page, 'mhr');
    await useMeasuredHrmax(p, '190');
    await calculate(p);
    await editZone(p, 4, 'upper', '100');
    await expect(p).toContainText('limit was set to 99%');
  });

  test('moving out of a field applies the edit, an empty value is rejected', async ({ page }) => {
    const p = await openCalculator(page, 'mhr');
    await useMeasuredHrmax(p, '190');
    await calculate(p);
    const z1 = p.getByLabel('Zone 1 upper percentage');
    await z1.fill('70');
    await z1.blur();
    await expect(p.getByLabel('Zone 2 lower percentage')).toHaveValue('70');
    await editZone(p, 2, 'upper', '');
    await expect(p).toContainText('Enter a number for the percentage.');
  });

  test('open ends of a source model cannot be edited, and Reset restores the preset', async ({ page }) => {
    const p = await openCalculator(page, 'mhr');
    await useMeasuredHrmax(p, '190');
    await calculate(p);
    await expect(p).toContainText('no lower limit');
    await editZone(p, 2, 'upper', '85');
    await expect(p).toContainText(/custom zones/i);
    await p.getByRole('button', { name: 'Reset to preset' }).click();
    await expect(p).toContainText(/sourced preset/i);
    await expect(p).toContainText('139–157 bpm');
  });
});

test.describe('%HRR calculator', () => {
  test('HRmax 190 and resting HR 50 give the hand-verified Karvonen zones', async ({ page }) => {
    const p = await openCalculator(page, 'hrr');
    await useMeasuredHrmax(p, '190');
    await p.getByLabel(/Resting heart rate/).fill('50');
    await calculate(p);
    for (const text of ['120–133 bpm', '134–147 bpm', '148–161 bpm', '162–175 bpm', '176–190 bpm']) {
      await expect(p).toContainText(text);
    }
    await expect(p).toContainText('Below Zone 1: up to 119 bpm');
    await expect(p).toContainText(/provisional preset/i);
    await p.getByText('How was this calculated?').click();
    await expect(p.getByText('50 + (140 × 70%)')).toBeVisible();
  });

  test('resting heart rate must be lower than HRmax; a missing value is reported', async ({ page }) => {
    const p = await openCalculator(page, 'hrr');
    await useMeasuredHrmax(p, '190');
    await p.getByLabel(/Resting heart rate/).fill('190');
    await calculate(p);
    await expect(p).toContainText('Resting heart rate must be lower than maximum heart rate.');
    await p.getByLabel(/Resting heart rate/).fill('');
    await calculate(p);
    await expect(p).toContainText('Resting heart rate is required.');
  });
});

test.describe('Threshold (FTHR) calculator', () => {
  test('a 20-minute average of 170 gives FTHR 161.5 and the hand-verified zones', async ({ page }) => {
    const p = await openCalculator(page, 'threshold');
    await p.getByLabel(/Average heart rate over the full 20-minute effort/).fill('170');
    await calculate(p);
    await expect(p).toContainText('161.5 bpm');
    for (const text of ['126–140 bpm', '141–151 bpm', '152–161 bpm', '162+ bpm', '5a: 162–165 bpm', '5b: 166+ bpm']) {
      await expect(p).toContainText(text);
    }
    await expect(p).toContainText('not a laboratory-measured lactate threshold heart rate');
  });

  test('shows the exact boundary behind a rounded value (87% of 161.5 = 140.505 -> 141)', async ({ page }) => {
    const p = await openCalculator(page, 'threshold');
    await p.getByLabel(/Average heart rate over the full 20-minute effort/).fill('170');
    await calculate(p);
    await p.getByText('How was this calculated?').click();
    await expect(p).toContainText('140.505 bpm');
  });

  test('a missing average is reported; custom zones drop the Friel sub-bands', async ({ page }) => {
    const p = await openCalculator(page, 'threshold');
    await calculate(p);
    await expect(p).toContainText('20-minute average heart rate is required.');
    await p.getByLabel(/Average heart rate over the full 20-minute effort/).fill('170');
    await calculate(p);
    await expect(p).toContainText('no upper limit');
    await editZone(p, 3, 'upper', '95');
    await expect(p).not.toContainText('5a: ');
    await expect(p).toContainText('apply to the original preset only');
  });
});

test('every input on the calculator has an accessible name', async ({ page }) => {
  const p = await openCalculator(page, 'hrr');
  await useMeasuredHrmax(p, '190');
  await p.getByLabel(/Resting heart rate/).fill('50');
  await calculate(p);
  const unlabeled = await page.$$eval('#calc-panel-hrr input', (els) =>
    (els as HTMLInputElement[]).filter((e) => !(e.labels && e.labels.length > 0) && !e.getAttribute('aria-label')).length,
  );
  expect(unlabeled).toBe(0);
});

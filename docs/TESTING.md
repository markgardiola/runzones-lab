# Testing guide

RunZones Lab has four safety nets. Each catches a different kind of mistake, so run all of them before you deploy.

| Check | Command | What it protects you from | Speed |
| --- | --- | --- | --- |
| **Type check** | `npm run typecheck` | Typos, wrong data shapes, calling a function with the wrong inputs. | seconds |
| **Unit tests** (Vitest) | `npm test` | **Wrong numbers.** Checks the maths: HRmax formulas, FTHR, zone boundaries, rounding, validation, zone editing, comparison logic. | seconds |
| **End-to-end tests** (Playwright) | `npm run test:e2e` | **The site not working for a real person.** Opens a real browser, types into the real forms, clicks the real buttons and checks what appears. | about 1 minute |
| **Production build** | `npm run build` | A site that would not deploy. | seconds |

Why both unit and end-to-end tests? A unit test proves "190 bpm × 73% rounds to 139". Only an end-to-end test proves that a runner who types 190 and clicks the button actually *sees* 139 on the page, in the right row, with the right label.

## First-time setup (Windows PowerShell)

Run these one at a time, inside the project folder:

```powershell
npm install
npx playwright install chromium
```

The second command downloads the test browser once (about 150 MB).

## Running the tests

```powershell
npm test                      # unit tests
npm run test:e2e              # all browser tests (starts the dev server for you)
npm run test:e2e:headed       # same, but you can watch the browser work
npm run test:e2e:ui           # interactive panel: pick a test, step through it, see snapshots
npx playwright test e2e/compare.spec.ts      # just one file
npx playwright test -g "Tanaka"              # only tests whose name contains "Tanaka"
npm run test:e2e:report       # open the HTML report from the last run
```

To test a deployed site instead (for example your Vercel URL after Phase 8), no local server is started:

```powershell
$env:E2E_BASE_URL = "https://your-site.vercel.app"
npx playwright test
```

## How an end-to-end test works

Here is one test from `e2e/calculator.spec.ts`, explained:

```ts
test('measured HRmax 190 gives the hand-verified zones ...', async ({ page }) => {
  const p = await openCalculator(page, 'mhr');   // 1. open /calculator?method=mhr in a fresh browser
  await useMeasuredHrmax(p, '190');              // 2. tick "I know my measured maximum heart rate", type 190
  await calculate(p);                            // 3. click "Calculate zones"
  await expect(p).toContainText('139–157 bpm');  // 4. check the page now shows this text
});
```

- **`page`** is a real browser tab. Every test gets a brand-new one, so tests never affect each other.
- **Finding things like a person would.** Tests find controls by their visible label or role (`getByLabel('Zone 2 upper percentage')`, `getByRole('button', { name: 'Calculate zones' })`). If a test cannot find something this way, a screen-reader user probably could not either, so these tests double as an accessibility check.
- **Automatic waiting.** `expect(...).toContainText(...)` keeps retrying for up to 5 seconds, so there are no manual pauses.
- **The server.** `playwright.config.ts` starts `npm run dev` on port 5173 before the tests and stops it afterwards.

## What each file guards

| File | What it checks |
| --- | --- |
| `e2e/calculator.spec.ts` | All three calculators: required inputs, error and warning messages, the hand-verified zone numbers, preset badges, the "How was this calculated?" panel, and per-zone percentage editing with auto-adjust, limits and reset. |
| `e2e/calculator-tabs.spec.ts` | Tabs: `?method=` links, click and keyboard navigation (arrows, Home, End), and that your entries survive switching tabs. |
| `e2e/zone-bar.spec.ts` | The coloured BPM bar: each label sits under its own zone even when zones are unequal; narrow zones and phones fall back to a list. |
| `e2e/compare.spec.ts` | The comparison page: incomplete methods are shown as incomplete (never guessed), the side-by-side table, one shared chart axis, blocking and warning messages, per-method HRmax sources, phone layout, and custom zones carrying over from the Calculator. |
| `e2e/navigation.spec.ts` | Every page loads with no console errors and no sideways scrolling (desktop and phone), the 404 page, home-page links, menu, disclaimer link, and the disabled donation button. |
| `e2e/research.spec.ts` | The Researchers and References pages: each profile and its "does not claim" section, careful attribution wording, safe external links, jump and publication links that scroll to the right place, reference grouping, verification badges, and honest handling of sources with no link or year. |
| `e2e/helpers.ts` | Small shared steps ("choose measured HRmax", "calculate") so tests stay short. |

Unit tests live next to the code they check, in files ending `.test.ts` under `src/`. `src/data/dataIntegrity.test.ts` protects the content itself: every reference and profile link resolves, anything not read in full carries a disclosure note, and profiles contain no promotional wording.

## When a test fails

1. **Read the message.** Playwright shows what it expected, what it found, and the line.
2. **Look at the evidence.** Run `npm run test:e2e:report`: it has a screenshot and a step-by-step trace of the failure. Or re-run that one test with `--headed` and watch.
3. **Decide which side is wrong.**
   - *Text or layout changed on purpose* (you reworded a label): update the test.
   - *A number changed*: **treat it as a bug first.** The expected numbers come from the hand-verified examples in `docs/SCIENTIFIC_METHODS.md` section 6, not from the program's own output. Do not edit an expected number just to make a test pass; recompute it by hand with exact arithmetic first.
4. Fix, re-run, and commit.

## When to run what

- After any change: `npm run typecheck` and `npm test`.
- Before every commit that touches the interface or calculations: add `npm run test:e2e`.
- Before deploying: all four, plus `npm run build`.
- After deploying: `npm run test:e2e` against the live URL (`E2E_BASE_URL`).

## Adding a test

Put new browser tests in `e2e/` in a file ending `.spec.ts`:

```ts
import { expect, test } from '@playwright/test';
import { calculate, openCalculator, useMeasuredHrmax } from './helpers';

test('measured HRmax 180 gives a Zone 5 that ends at 180', async ({ page }) => {
  const p = await openCalculator(page, 'mhr');
  await useMeasuredHrmax(p, '180');
  await calculate(p);
  await expect(p).toContainText('166–180 bpm');
});
```

For a new calculation, add a unit test first (`src/calculations/*.test.ts`), using a value worked out by hand.

## What was and was not verified when these were written

The 58 end-to-end tests were run in a Chromium browser against the real application code, served as a single-page app (like Vercel's rewrite), with a stand-in for React Router and a Tailwind 4 build of the styles, because the authoring environment had no network access. They have not yet run against your Vite dev server and Tailwind 3 build. If something fails on your first run, it is most likely a timing, spacing or font difference, not a logic error. Send me the report and I will adjust.

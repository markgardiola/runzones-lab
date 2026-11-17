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

The second command downloads Playwright's own test browser once (about 150 MB). On Windows the tests use the Microsoft Edge that is already installed (see Troubleshooting), so you can skip it there.

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

## Troubleshooting

**Windows Security says "Part of this app has been blocked ... chrome-headless-shell.exe".** Windows' reputation-based protection (for example Smart App Control) blocks Playwright's downloaded browser because it is unsigned. Nothing is wrong with your project. The config already uses the signed Microsoft Edge on Windows, so just re-run `npm run test:e2e`. Do not turn Smart App Control off: it generally cannot be turned back on. To choose a browser explicitly:

```powershell
$env:E2E_CHANNEL = "msedge"     # Microsoft Edge (default on Windows)
$env:E2E_CHANNEL = "chrome"     # Google Chrome, if installed
$env:E2E_CHANNEL = "bundled"    # Playwright's own Chromium (may be blocked on Windows)
npm run test:e2e
```

If the alert still names a file outside your Playwright folder (`%LOCALAPPDATA%\ms-playwright`), do not allow it.

**Every test fails.** Something shared is broken (the browser, the server or the page), not the tests themselves. Run the doctor first. It checks the build, the server, the browser and one real calculation, in that order, and tells you which one fails:

```powershell
npm run test:e2e:doctor
```

If you prefer to investigate by hand:

1. Run one small test and read only its first error:
   ```powershell
   npx playwright test e2e/navigation.spec.ts -g "home page call to action" --reporter=line
   ```
2. Match the message:
   - `ERR_CONNECTION_REFUSED`, or a message about the web server or a timeout starting it: the site did not start. Run `npx vite build` and then `npx vite preview --port 4173` yourself and read any error. A failed build is the usual cause.
   - `Executable doesn't exist`, `not found`, or `spawn EPERM`: the browser could not start. See the Windows Security entry above, then try `$env:E2E_CHANNEL = "chrome"`.
   - Timeouts waiting for a label or heading: the page loaded but is not showing the app. Run `npx vite preview --port 4173`, open http://localhost:4173/calculator in Edge, press F12 and look at the Console for a red error.
3. Look at the evidence: `npx playwright show-report` shows a screenshot of each failure. Also check the `test-results` folder.
4. Port already in use: close anything running on 4173 (or 5173 with `E2E_SERVER=dev`), then run again.

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
- **The server.** `playwright.config.ts` builds the site and serves the production build on port 4173 before the tests, and stops it afterwards. Set `E2E_SERVER=dev` to use the Vite dev server instead.

## What each file guards

| File | What it checks |
| --- | --- |
| `e2e/calculator.spec.ts` | All three calculators: required inputs, error and warning messages, the hand-verified zone numbers, preset badges, the "How was this calculated?" panel, and per-zone percentage editing with auto-adjust, limits and reset. |
| `e2e/calculator-tabs.spec.ts` | Tabs: `?method=` links, click and keyboard navigation (arrows, Home, End), and that your entries survive switching tabs. |
| `e2e/zone-bar.spec.ts` | The coloured BPM bar: each label sits under its own zone even when zones are unequal; narrow zones and phones fall back to a list. |
| `e2e/compare.spec.ts` | The comparison page: incomplete methods are shown as incomplete (never guessed), the side-by-side table, one shared chart axis, blocking and warning messages, per-method HRmax sources, phone layout, and custom zones carrying over from the Calculator. |
| `e2e/navigation.spec.ts` | Every page loads with no console errors and no sideways scrolling (desktop and phone), the 404 page, home-page links, menu, disclaimer link, and the disabled donation button. |
| `e2e/research.spec.ts` | The Researchers and References pages: each profile and its "does not claim" section, careful attribution wording, safe external links, jump and publication links that scroll to the right place, reference grouping, verification badges, and honest handling of sources with no link or year. |
| `e2e/science.spec.ts` | The Science section: index, each article loading, required method-article sections, worked-example numbers matching the calculators, supporting-reference links that scroll to the right entry, previous/next links, no sideways scroll on phones, and the About page. |
| `e2e/helpers.ts` | Small shared steps ("choose measured HRmax", "calculate") so tests stay short. |

Unit tests live next to the code they check, in files ending `.test.ts` under `src/`. `src/data/dataIntegrity.test.ts` protects the content itself: every reference and profile link resolves, anything not read in full carries a disclosure note, profiles and articles contain no promotional wording, every `(Author, Year)` citation in an article matches a source listed for it, and portraits are complete. `src/components/science/ExampleBlock.test.ts` checks that the article examples show the hand-verified numbers.

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

The 76 end-to-end tests were run in a Chromium browser against the real application code, served as a single-page app (like Vercel's rewrite), with a stand-in for React Router and a Tailwind 4 build of the styles, because the authoring environment had no network access. They have not yet run against your Vite dev server and Tailwind 3 build. If something fails on your first run, it is most likely a timing, spacing or font difference, not a logic error. Send me the report and I will adjust.

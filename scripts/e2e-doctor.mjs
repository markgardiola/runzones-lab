// Diagnoses why browser tests fail, one layer at a time: build -> server -> browser -> page.
// Usage: npm run test:e2e:doctor
import { spawn, spawnSync } from 'node:child_process';
import { chromium } from '@playwright/test';

const isWin = process.platform === 'win32';
const requested = process.env.E2E_CHANNEL;
const channel = requested === 'bundled' ? undefined : requested || (isWin ? 'msedge' : undefined);
const external = process.env.E2E_BASE_URL;
const baseURL = external ?? 'http://localhost:4173';

const say = (ok, msg) => console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`);
let server;

async function waitFor(url, ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      const r = await fetch(url);
      if (r.status < 500) return true;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

function stopServer() {
  if (!server) return;
  if (isWin) spawnSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  else server.kill();
}

async function main() {
  console.log(`Node ${process.version} on ${process.platform}`);
  console.log(`Browser: ${channel ?? 'Playwright bundled Chromium'}   Site: ${baseURL}\n`);

  if (external) {
    const up = await waitFor(baseURL, 15000);
    say(up, up ? `Site answers at ${baseURL}` : `Nothing answers at ${baseURL}. Check the address.`);
    if (!up) return 1;
  } else {
    console.log('Step 1/4: building the site (npx vite build)...');
    const b = spawnSync('npx', ['vite', 'build'], { stdio: 'inherit', shell: true });
    if (b.status !== 0) {
      say(false, 'The build failed. Fix the error printed above first: every test depends on a working build.');
      return 1;
    }
    say(true, 'Build succeeded');
    console.log('Step 2/4: starting the preview server...');
    server = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { stdio: 'ignore', shell: true });
    const up = await waitFor(baseURL, 60000);
    if (!up) {
      say(false, `The server did not answer at ${baseURL}. Is something else using port 4173? Close it and try again.`);
      return 1;
    }
    say(true, `Server answers at ${baseURL}`);
  }

  console.log('Step 3/4: starting the browser...');
  let browser;
  try {
    browser = await chromium.launch({ channel });
    say(true, 'Browser started');
  } catch (e) {
    say(false, 'The browser could not start. Details:\n  ' + String(e.message).split('\n').slice(0, 6).join('\n  '));
    console.log('\nWhat to try: if Windows Security blocked a file, see docs/TESTING.md (Troubleshooting).');
    console.log('Otherwise set another browser, e.g.  $env:E2E_CHANNEL = "chrome"  and run this again.');
    return 1;
  }

  console.log('Step 4/4: opening the calculator and doing one calculation...');
  const problems = [];
  const page = await browser.newPage();
  page.on('pageerror', (e) => problems.push(`Page error: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && problems.push(`Console error: ${m.text()}`));
  page.on('requestfailed', (r) => problems.push(`Request failed: ${r.url()} (${r.failure()?.errorText})`));
  let ok = true;
  try {
    await page.goto(`${baseURL}/calculator?method=mhr`, { waitUntil: 'load', timeout: 20000 });
    say(true, `Page loaded, title: "${await page.title()}"`);
    await page.getByRole('tab', { name: '%MHR' }).waitFor({ timeout: 10000 });
    say(true, 'The calculator is on screen');
    const panel = page.locator('#calc-panel-mhr');
    await panel.getByLabel('I know my measured maximum heart rate').check();
    await panel.getByLabel(/Measured maximum heart rate/).fill('190');
    await panel.getByRole('button', { name: 'Calculate zones' }).click();
    // Wait for the text to appear anywhere in the panel (the first matching element can be a hidden duplicate)
    await page.waitForFunction(
      () => document.querySelector('#calc-panel-mhr')?.innerText.includes('139–157 bpm'),
      undefined,
      { timeout: 10000 },
    );
    say(true, 'Typing 190 and clicking Calculate shows the expected zones (139–157 bpm)');
  } catch (e) {
    ok = false;
    say(false, 'The page did not behave as expected: ' + String(e.message).split('\n')[0]);
    const body = (await page.locator('body').innerText().catch(() => '')).trim().slice(0, 300);
    console.log(`  What the page shows: ${body ? JSON.stringify(body) : '(blank page)'}`);
  }
  if (problems.length) {
    console.log('\nProblems the browser reported:');
    for (const p of [...new Set(problems)].slice(0, 10)) console.log('  - ' + p);
  }
  await browser.close();
  if (ok && problems.length === 0) console.log('\nAll layers work. If tests still fail, send me the first error from `npm run test:e2e`.');
  else console.log('\nSend me everything printed above.');
  return ok && problems.length === 0 ? 0 : 1;
}

main()
  .then((code) => {
    stopServer();
    process.exit(code);
  })
  .catch((e) => {
    console.error('The doctor itself failed:', e);
    stopServer();
    process.exit(1);
  });

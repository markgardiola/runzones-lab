import { defineConfig, devices } from '@playwright/test';
import { loadEnv } from 'vite';

/**
 * End-to-end tests drive the real site in a real browser.
 *  - Default: builds the site and serves the production build on http://localhost:4173.
 *    This is stable and tests what you deploy. (The Vite dev server can reload the page while
 *    it optimises dependencies on first run, which makes tests fail at random.)
 *  - E2E_SERVER=dev: use the Vite dev server on http://localhost:5173 instead.
 *  - Against any deployed site (e.g. your Vercel URL), set E2E_BASE_URL and no server is started:
 *      PowerShell:  $env:E2E_BASE_URL = "https://your-site.vercel.app"; npx playwright test
 */
const useDev = process.env.E2E_SERVER === 'dev';
const port = useDev ? 5173 : 4173;
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${port}`;

/**
 * Windows can block Playwright's downloaded headless browser because it is unsigned
 * ("Part of this app has been blocked ... chrome-headless-shell.exe"). On Windows the tests
 * therefore use the signed Microsoft Edge that ships with the system.
 * Override with E2E_CHANNEL = chrome | msedge | bundled (bundled = Playwright's own Chromium).
 */
// Vite reads .env / .env.local itself, but Playwright does not. Load the same files so the tests can
// compare against the link the site was built with. Skipped for a deployed site (E2E_BASE_URL),
// whose settings live on the host.
if (!process.env.E2E_BASE_URL && !process.env.VITE_PAYPAL_DONATION_URL) {
  const fileEnv = loadEnv(useDev ? 'development' : 'production', process.cwd(), 'VITE_');
  if (fileEnv.VITE_PAYPAL_DONATION_URL) process.env.VITE_PAYPAL_DONATION_URL = fileEnv.VITE_PAYPAL_DONATION_URL;
}

const requested = process.env.E2E_CHANNEL;
const channel = requested === 'bundled' ? undefined : requested || (process.platform === 'win32' ? 'msedge' : undefined);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel, viewport: { width: 1280, height: 900 } },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: useDev
          ? 'npx vite --port 5173 --strictPort'
          : 'npx vite build && npx vite preview --port 4173 --strictPort',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});

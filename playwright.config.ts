import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests drive the real site in a real browser.
 *  - Default: starts the Vite dev server automatically on http://localhost:5173.
 *  - Against any deployed site (e.g. your Vercel URL), set E2E_BASE_URL and no server is started:
 *      PowerShell:  $env:E2E_BASE_URL = "https://your-site.vercel.app"; npx playwright test
 */
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:5173';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
  ...devices['Desktop Chrome'],
  channel: 'msedge',
  baseURL: 'http://localhost:5173',
},
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run dev -- --port 5173 --strictPort',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});

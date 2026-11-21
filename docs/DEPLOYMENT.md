# Deploying RunZones Lab (Vercel)

RunZones Lab is a static site (Vite build), so it needs no server, database or custom API.

## Before you deploy
Run these in PowerShell, one line at a time. Everything should pass.

```powershell
npm run typecheck
npm test
npm run test:e2e
npm run preflight
npm run build
```

`npm run preflight` lists things that need a decision: the donation link and any portrait whose image rights are not cleared.

## First deployment
1. Put the project on GitHub (once):
   ```powershell
   git init
   git add .
   git commit -m "RunZones Lab"
   ```
   Create an empty repository on GitHub, then follow the two commands GitHub shows (`git remote add origin ...` and `git push -u origin main`).
2. On vercel.com choose **Add New**, **Project**, and import the repository.
3. Vercel detects Vite. Check that the build command is `npm run build` and the output directory is `dist` (`vercel.json` also sets these). Leave the rewrite rule: it makes direct visits and refreshes of pages such as `/compare` work.
4. Under **Environment Variables** add `VITE_PAYPAL_DONATION_URL` (see `docs/DONATIONS.md`).
5. Deploy. Each later push to the main branch deploys automatically; pushes to other branches get a preview address.

Menu names on vercel.com change from time to time; the settings above are what matters.

## After deploying
- Run the browser tests against the live address:
  ```powershell
  $env:E2E_BASE_URL = "https://your-site.vercel.app"
  npm run test:e2e
  ```
- Visit `/calculator`, `/compare`, `/researchers` and `/science/five-zones` directly in a new tab and refresh each, to check the rewrite.
- On a phone, check the calculator, the comparison page and the menu.
- Click the donate button once (see `docs/DONATIONS.md`).

## Quality checks to run yourself
These need a real browser on your machine:
- **Lighthouse**: in Chrome or Edge press F12, open the *Lighthouse* tab, choose Mobile, and run it on `/`, `/calculator` and `/compare`. Look at Performance, Accessibility, Best Practices and SEO, and send me anything under 90.
- **Keyboard only**: use Tab, Shift+Tab, Enter, Space and the arrow keys through the calculator, the tabs and the zone editor. Every control should be reachable and show a visible outline.
- **Zoom**: set the browser to 200% and confirm nothing is cut off.

## Known follow-ups
- Fonts load from Google Fonts. That is simple, but it makes one extra request and sends visitors' addresses to Google. Self-hosting the two fonts is an option later.
- There is no social-sharing preview image yet (`og:image`). Add one when you have a logo or image you may use.
- `public/robots.txt` allows all pages. After you have a domain, add a `Sitemap:` line and a `sitemap.xml`.

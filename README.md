# RunZones Lab

*Heart Rate Training, Explained by Science.*

Frontend-only React + TypeScript site: heart rate zone calculators (%MHR, Karvonen %HRR, field-estimated FTHR), a comparison dashboard and a research library. See `PROJECT_BRIEF.md` for the full specification and `docs/DECISIONS.md` for decisions so far.

## Run it
```bash
npm install
npm run dev        # development server
npm test           # Vitest
npm run typecheck  # tsc --noEmit
npm run build      # production build to dist/
```

## Donations, portraits and deployment
See `docs/DONATIONS.md` (PayPal setup), `docs/PORTRAITS.md` and `docs/DEPLOYMENT.md`.

## Testing
See `docs/TESTING.md` for what each check is for, how to run it on Windows PowerShell, and how to read failures. First-time browser setup: `npx playwright install chromium`.

## Configuration
Copy `.env.example` to `.env.local` and set `VITE_PAYPAL_DONATION_URL` to the owner's PayPal.Me link (https, PayPal domains only). While unset, the site shows a disabled donation button.

## Deploy (Vercel)
Build command `npm run build`, output `dist`. `vercel.json` rewrites all routes to `index.html` so deep links and refresh work.

## Status
- Phase 1 (foundation, layout, Home): done and approved
- Phase 2 (scientific methodology verification): done and approved (`docs/SCIENTIFIC_METHODS.md`, `docs/SOURCES.md`)
- Phase 3 (calculation engine, zone models, validation, tests): done and approved
- Phase 4 (calculator interface): done and approved
- Phase 5 (comparison dashboard): done and approved
- Phase 6 (educational content): done and approved
- Phase 7 (donation, finalization): in progress (donation link, portraits workflow, contrast and edge-case tests, deployment docs done; owner checks listed in docs/DEPLOYMENT.md)
- Phases 2–8: pending approval

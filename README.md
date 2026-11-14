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

## Configuration
Copy `.env.example` to `.env.local` and set `VITE_PAYPAL_DONATION_URL` to the owner's PayPal.Me link (https, PayPal domains only). While unset, the site shows a disabled donation button.

## Deploy (Vercel)
Build command `npm run build`, output `dist`. `vercel.json` rewrites all routes to `index.html` so deep links and refresh work.

## Status
- Phase 1 (foundation, layout, Home): done and approved
- Phase 2 (scientific methodology verification): done and approved (`docs/SCIENTIFIC_METHODS.md`, `docs/SOURCES.md`)
- Phase 3 (calculation engine, zone models, validation, tests): done and approved
- Phase 4 (calculator interface): done and approved
- Phase 5 (comparison dashboard): drafted, awaiting review
- Phases 2–8: pending approval

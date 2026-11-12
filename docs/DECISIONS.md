# Scientific and technical decisions log

Decisions were delegated to Claude by the project owner at the start of Phase 1. Final
verification and write-up happen in Phase 2 (`SCIENTIFIC_METHODS.md`, `SOURCES.md`). Nothing here is
released as a zone preset until Phase 3, and every preset will carry a `status` of `verified` or `provisional`.

## S1. Method 3 (field-estimated FTHR): Friel table, FTHR column
- Anchor: Estimated FTHR = 20-min average HR × 0.95 (Friel, "A Quick Guide to Setting Zones", revised Sept 2025: average HR for the full 20 minutes, subtract 5%).
- Zone percentages (owner-supplied photo of the table, *The High-Performance Cyclist*, p. 63; the 2025 web article carries the same table as an image):

| Friel zone | % FTHR |
| --- | --- |
| 1 | < 78 |
| 2 | 78–86 |
| 3 | 87–93 |
| 4 | 94–99 |
| 5a | 100–102 |
| 5b | > 102 |
| 5c | not applicable (heart rate) |

- Display mapping: Z1–Z4 = Friel 1–4; **Z5 = Friel 5a + 5b** (5a/5b shown as sub-bands). 5c is not defined for heart rate, so it is not shown.
- The source is a cycling book. Friel's article says the table could equally be read for running. Disclose this on the site.
- Always labelled "field-estimated FTHR", never as laboratory-measured LTHR.
- Status: **confirmed** (owner approved the transcription).

## S2. Method 1 (%MHR): Friel table, MHR column (confirmed by owner)
| Friel zone | % MHR |
| --- | --- |
| 1 | < 72 |
| 2 | 73–82 |
| 3 | 83–87 |
| 4 | 88–92 |
| 5a + 5b | 92–100 (shared cell in the source) |
| 5c | not applicable |

- Source-label ambiguities: the printed table leaves 72–73% unassigned, and 92% appears at the top of Z4 and the bottom of Z5. Convention adopted: **each zone's stated lower percentage is its lower boundary** (73, 83, 88, 92; FTHR: 78, 87, 94, 100, 103), zones are half-open `[lower, next lower)`, and the final zone runs to the anchor's top. Document in SCIENTIFIC_METHODS.md.
- Friel's article advises against 220 − age. The site offers it only as a clearly labelled legacy estimate, with Tanaka (208 − 0.7 × age) and a user-measured HRmax as alternatives. A measured HRmax is preferred.

## S3. Method 2 (%HRR / Karvonen): conventional 10%-band zones (owner decision)
- Owner decision: use the conventional bands **50–60, 60–70, 70–80, 80–90, 90–100 % HRR** for Z1–Z5. Boundaries: 50, 60, 70, 80, 90; Z5 runs to 100% (HRmax).
- Formula: Target HR = RHR + (HRmax − RHR) × percentage (Karvonen et al., 1957 is the historical reference for the reserve approach, not for these bands).
- **Source status (Phase 2 finding):** these bands come from Sally Edwards' *The Heart Rate Monitor Book* and Polar, defined on % of **maximum heart rate**, not HRR. No authoritative source for the same bands on HRR was found. Applying them to HRR is a common calculator convention. Until then the preset is `provisional` and the UI must say it is a common convention, not a validated running-specific model.
- Consequence: nothing is defined below 50% HRR. Results should state that effort below Z1 is simply "below Zone 1" (very easy walking or jogging, warm-up), not an unassigned gap.
- Considered and not used: ACSM (Garber 2011) %HRR classes (<30, 30–39, 40–59, 60–89, ≥90), now verified in the primary paper (Table 5, p. 1341). Kept as a documented alternative.
- Display zone names follow the brief's general labels, which are methodology-dependent.
- Status: provisional.

## S4. Rounding
Each boundary is computed exactly, rounded once (half up) to whole BPM, and zone *n* is shown as `[round(b_n), round(b_{n+1}) − 1]`. Zones therefore never overlap or leave gaps. Open ends are shown as "< X" / "X+" or capped at HRmax where the method defines 100%.

## T1. Technical
- Tailwind v3, Vite 5, React Router 6 (SPA with Vercel rewrites), Vitest 2. Versions were chosen without registry access, so adjust on first install if needed.
- Charts: custom SVG (no Recharts), to keep the bundle small and the output accessible.
- Hero visual is a decorative SVG. No photograph is included because none with a verified licence is available.
- Karvonen's first name (Martti) is confirmed by a secondary source (see SOURCES S-10). Haskell's biography is now verified (S-12) and his profile is allowed in Phase 6, with the 1971 Fox, Naughton and Haskell paper cited as a verified citation only.

## U1. User-adjustable zone percentages (owner requirement, added in Phase 2)
Users edit zones one by one (each zone's lower and upper percentage). Zones stay contiguous and never overlap: neighbours auto-adjust with a 1-point minimum width, and the UI reports what moved. Open preset ends are not editable. Full rules in `SCIENTIFIC_METHODS.md` §7. Edited results are labelled "Custom zones" and never presented as sourced. Calculation support in Phase 3, interface in Phase 4.

## P3. Calculation engine decisions (Phase 3)
- Integer arithmetic: heart rates in tenths of a bpm (inputs accept at most one decimal), zone percentages in hundredths of a percent, FTHR = 20-minute average × 95/100 kept exact. Boundaries are rounded once, half up.
- HRmax estimates are not rounded before use; they are kept exact to 0.1 bpm.
- Inputs are validated with hard errors for impossible values and soft warnings for unusual ones. Missing inputs are never replaced with assumed values.

## P4. Calculator interface decisions (Phase 4)
- No default HRmax source: the user must choose measured, Tanaka or 220 − age before calculating. Results always name the source and mark estimates as estimates.
- All three calculators stay mounted when switching tabs, so entered values and results are kept. The active method is mirrored in `?method=` for deep links.
- Zone-percentage edits are applied on Enter or when a field loses focus (not on every keystroke), and the interface states which other zones were adjusted or limited.
- Preset labels shown to users: "Sourced preset" (Friel-based Methods 1 and 3), "Provisional preset" (Method 2 convention) and "Custom zones". The "How was this calculated?" panel is collapsed by default.
- Zone purpose, physiology and example text is deliberately general. It makes no method-specific physiological claims.
- Zone bar: drawn on one BPM scale; open-ended source ends are faded and labelled as illustrative; every zone is also labelled with its number and range, so colour is never the only identifier.

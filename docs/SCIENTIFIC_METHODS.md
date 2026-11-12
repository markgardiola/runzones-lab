# Scientific methods

Status: Phase 2 draft for owner review. Sources are in `SOURCES.md` (levels P / C / S / O). Preset status: **confirmed** (source read and owner-approved), **provisional** (convention or unresolved source question), **custom** (user-edited).

## 1. Terms
- **HRmax**: highest heart rate reached in maximal effort. Measured or age-estimated.
- **RHR**: resting heart rate.
- **HRR** (heart rate reserve) = HRmax − RHR.
- **FTHR** (functional threshold heart rate): here a **field estimate** from a 20-minute test, not a laboratory measurement.
- **LTHR / LT1 / LT2**: heart rate at laboratory-determined lactate thresholds. Not measured by this site.

## 2. Maximum heart rate sources
Priority when more than one is available: **measured > Tanaka estimate > 220 − age**. The result always names the source used, and age-based values are labelled "estimated".

| Source | Formula | Evidence |
| --- | --- | --- |
| Measured (user-entered) | n/a | Preferred. Tanaka et al. and ACSM both say direct measurement is preferable (S-01, S-05). |
| Tanaka | 208 − 0.7 × age | Meta-analysis and lab study in healthy, non-medicated, non-smoking adults (S-01). Individual SD about 10 bpm. May not apply to people with cardiovascular disease or smokers. |
| Traditional | 220 − age | Legacy estimate. Tanaka's data show it overestimates HRmax in young adults, equals the Tanaka value at age 40, and underestimates it in older adults (about 10 bpm at 70). Its origin is described by S-01 as arbitrary. Friel advises against it (S-06). |

Rule: no silent default. If the user has not chosen a source and gave no measured value, the calculator asks.

## 3. Method 1: %MHR
Target HR = HRmax × percentage.

Preset: Friel table, MHR column (S-06/S-07, owner-confirmed). Status: **confirmed**.

| Display zone | Friel zone | % MHR |
| --- | --- | --- |
| Z1 | 1 | < 72 |
| Z2 | 2 | 73–82 |
| Z3 | 3 | 83–87 |
| Z4 | 4 | 88–92 |
| Z5 | 5a + 5b | 92–100 |

5c is not applicable for heart rate. The printed ranges leave 72–73% unassigned and show 92% twice, so the boundary convention in §6 applies (boundaries 73, 83, 88, 92).

Limits to state in the UI: the result is only as good as the HRmax used; age-based HRmax carries about ±10 bpm individual error; the table comes from a cycling book and Friel says zones are no longer split by sport (S-06).

## 4. Method 2: %HRR (Karvonen)
Target HR = RHR + (HRmax − RHR) × percentage.

Preset (owner decision): 50–60, 60–70, 70–80, 80–90, 90–100 % HRR. Status: **provisional**.

What the research found about this preset:
- The 10%-band five-zone chart is a practitioner convention. It was published by Sally Edwards (S-08) and is used by Polar (S-09), in both cases as **% of maximum heart rate**, not of heart rate reserve.
- Using the same bands on HRR is common in calculators, but no authoritative source defining them for HRR was found. The UI must therefore say: "A common 10%-band convention, originally defined on maximum heart rate and applied here to heart rate reserve. Not a validated running-specific model."
- Nothing is defined below 50% HRR; show "below Zone 1".

Alternative documented: ACSM Table 5 %HRR classes (S-05, read in full): < 30, 30–39, 40–59, 60–89, ≥ 90. These are general exercise-intensity classes, not running zones.

History and limits (use careful wording):
- Karvonen, Kentala and Mustala (1957, S-04) is the historical reference for the reserve approach. Its content has not been read here. Secondary sources say it did not measure oxygen uptake and identified a 60% HRR threshold (S-10, S-11). Do not say one paper proves every modern use of the formula.
- ACSM (S-05): there is no study comparing all intensity methods, so one method's zone is not equivalent to another's; HRR may be preferable to %HRmax but not all studies support that; the accuracy of both depends on how HRmax is estimated.
- %HRR and %VO2R equivalence is debated (S-11).

## 5. Method 3: field-estimated FTHR
Protocol (S-06, page text read): a solo, steady, hard 20-minute effort; record the average heart rate for the whole 20 minutes; subtract 5% (× 0.95) to estimate FTHR. Friel's page advises a conservative start, and repeating the test about every six weeks.

Estimated FTHR = 20-minute average HR × 0.95. Keep full precision internally (e.g. 170 → 161.5).

Preset: Friel table, FTHR column (S-06/S-07, owner-confirmed). Status: **confirmed**.

| Display zone | Friel zone | % FTHR |
| --- | --- | --- |
| Z1 | 1 | < 78 |
| Z2 | 2 | 78–86 |
| Z3 | 3 | 87–93 |
| Z4 | 4 | 94–99 |
| Z5 | 5a, 5b | ≥ 100 (5a 100–102; 5b > 102) |

Z5 has no upper cap in the source; show it as "X+" with 5a/5b sub-bands. Never describe this as a laboratory-measured LTHR. The same table lists lactate-based columns (LT1, LT2); these are not implemented.

Limits to state: pacing errors, fatigue, environment and device accuracy can all shift the average heart rate (Friel's page explicitly mentions pacing; the others are general cautions to be sourced in Phase 6).

## 6. Boundaries and rounding (applies to all methods)
1. Each zone's stated lower percentage is its lower boundary. A zone covers `[lower, next lower)`. The last zone runs to the top of the model (HRmax for Methods 1 and 2; open-ended for Method 3).
2. Compute each boundary exactly, round **once** (half up) to whole BPM, then show zone *n* as `[round(b_n), round(b_{n+1}) − 1]`. Adjacent zones therefore never overlap or leave a gap. The first zone is shown as "≤ round(b_1) − 1", and Method 3's Z5 as "round(b_5)+".
3. Use integer arithmetic for boundaries (percentage × anchor ÷ 100). Binary floating point can fall on either side of exact halves (for example 87% of 161.5 is exactly 140.505 and rounds to 141). Phase 3 implements this with integers (heart rates in tenths of a bpm, percentages in hundredths of a percent) and tests cover it.
4. HRmax estimates are kept exact (for example Tanaka at age 33 is 184.9, not rounded to 185). Rounding happens only at zone boundaries.

Hand-verified examples (exact decimal arithmetic) for Phase 3 tests:

| Case | Boundaries (bpm) | Zones |
| --- | --- | --- |
| %MHR, HRmax 190; 73/83/88/92 % | 139, 158, 167, 175 | ≤ 138; 139–157; 158–166; 167–174; 175–190 |
| %HRR, HRmax 190, RHR 50 (HRR 140); 50–90 % | 120, 134, 148, 162, 176 | below 120; 120–133; 134–147; 148–161; 162–175; 176–190 |
| FTHR, 20-min avg 170 → FTHR 161.5; 78/87/94/100/103 % | 126, 141, 152, 162, 166 | ≤ 125; 126–140; 141–151; 152–161; 162+ (5a 162–165, 5b 166+) |

(The %HRR example has six rows because Z1 starts at 50% HRR: "below 120" is outside the five zones.)

## 7. User-adjustable zone percentages (owner requirement)
After a result is calculated, users can edit the percentages **zone by zone**: each zone's own lower and upper percentage. Zones can never overlap; the other zones adjust automatically.
- **Model:** zones are contiguous, so adjacent zones share one boundary. Editing Zone 2's upper percentage also sets Zone 3's lower percentage, and vice versa. A zone's two ends are therefore both editable without creating overlaps or gaps.
- **Auto-adjust rule:** when an edit would collide with a neighbouring boundary, the neighbour is pushed away just enough to keep a **minimum zone width of 1 percentage point**, and the push cascades (e.g. raising Z2's upper to 88% when Z3 already ends at 92% moves the Z3/Z4 boundary to 89%). If the cascade would run past the model's limits, the edit is clamped to the nearest valid value. The UI lists which other zones were adjusted, so nothing changes silently.
- **Open ends:** an end that the preset leaves open (Z1's lower limit for %MHR and FTHR, Z5's upper limit for FTHR) is not editable. Closed ends are editable: the %HRR Z1 floor (50%) and the 100% top for %MHR and %HRR. The same rule applies to them: the zones that would otherwise overlap yield, each keeping at least the minimum width (for example, lowering the %MHR top to 80% moves the 92, 88 and 83% boundaries to 79, 78 and 77%; the 73% boundary is untouched).
- **Limits per model:** %MHR and %HRR 0–100%; FTHR 0–120%.
- **Resolution:** 0.1 percentage point steps in the UI. The engine accepts up to two decimals.
- **Labelling:** edited results are "Custom zones", never "confirmed" or "provisional". The preset is shown beside the edit with changed values flagged, plus "Reset to preset". Zone 5a/5b sub-bands are Friel-specific and are shown only for the unedited preset.
- "How was this calculated?" shows the custom percentages; the Comparison dashboard uses the active values and shows a Custom badge.
- Custom zones inherit none of the preset's source support. The disclaimer is unchanged.
- Frontend-only: no accounts. Persistence (e.g. localStorage) is optional and deferred.
- Implementation: presets in `data/zoneModels.ts` are immutable. Calculations take a list of zone edges, so custom values use the same code path. Editing logic is in `calculations/zoneEditing.ts` and is covered by tests.

## 8. Unresolved items
1. **Method 2 source:** no authoritative source for 10%-band zones on %HRR. Options: keep provisional (current), adopt ACSM classes, or find a running-specific %HRR source. Owner decided on the current preset.
2. **S-07 citation:** supplied by the owner (Bloomsbury, 2025); confirm edition and page against the book.
3. **S-08 edition year** (1992/1993/1994).
4. **Full reading still to do** (Phase 6): Robergs & Landwehr (S-02), Karvonen 1957 content (S-04), the Swain/Franklin point-counterpoint (S-11).
5. **Tanaka population caveat:** surface "healthy adults; not validated for cardiovascular disease or smokers" next to the Tanaka option.
6. **Friel 5a/5b display:** the brief says to explain subdivisions; confirm the sub-band presentation for Z5 in Phase 4.

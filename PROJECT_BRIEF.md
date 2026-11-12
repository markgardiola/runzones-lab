# RUNZONES LAB

## Project Brief & Development Specification

**Project Version:** 1.0  
**Project Type:** Web Application / Sports Science Educational Platform  
**Status:** Ready for Development Planning  
**Primary Audience:** Runners and endurance-running enthusiasts

---

# 1. Project Overview

## Project Name

**RunZones Lab**

## Tagline

**Heart Rate Training, Explained by Science.**

## Description

RunZones Lab is a science-based heart rate training calculator and educational platform designed primarily for runners.

The website helps runners calculate, understand, and compare their personalized heart rate training zones using three established approaches:

1. Maximum Heart Rate (%MHR) Approach
2. Heart Rate Reserve (Karvonen Method / %HRR) Approach
3. Lactate Threshold-Based Approach using a field-estimated Functional Threshold Heart Rate (FTHR)

Unlike conventional heart rate calculators that simply generate numerical results, RunZones Lab aims to educate visitors about the scientific principles, historical development, researchers, publications, and practical applications behind each calculation method.

The platform will feature interactive calculators, a five-zone training system, a comparison dashboard, educational articles, researcher profiles, and scientific references.

The website should be free to use and accessible without requiring user registration.

A voluntary PayPal donation feature will allow visitors to support the continued development and maintenance of the project.

## Project Mission

To make exercise physiology and science-based heart rate training more accessible to everyday runners through transparent calculations, reliable scientific references, and understandable educational content.

---

# 2. Project Objectives

The main objectives are:

1. Develop an accurate and transparent heart rate zone calculator supporting three different approaches.
2. Explain the scientific foundations and mathematical formulas behind each approach.
3. Present the researchers, scientists, and influential endurance coaches associated with these methodologies.
4. Allow visitors to compare their calculated heart rate zones across all three approaches.
5. Provide access to scientific publications, research papers, and credible references.
6. Create a minimalist, research-oriented website with modern running aesthetics.
7. Deploy the application using Vercel.
8. Allow voluntary donations through PayPal.

---

# 3. Target Audience

The primary audience consists of recreational and competitive runners, including:

- Beginner runners learning about heart rate training.
- Intermediate runners following structured training programs.
- Advanced runners preparing for 5K, 10K, half marathon, and marathon events.
- Runners using Garmin, Coros, Polar, Suunto, Apple Watch, and other heart rate monitoring devices.
- Runners interested in understanding aerobic training, threshold training, and exercise physiology.

The educational content should remain understandable to beginners without sacrificing scientific accuracy for more experienced athletes.

---

# 4. Technology Stack

Use the following technologies:

| Technology             | Purpose                           |
| ---------------------- | --------------------------------- |
| Vite                   | Development server and build tool |
| React                  | Frontend component architecture   |
| TypeScript             | Main programming language         |
| Tailwind CSS           | Styling and responsive design     |
| Recharts or custom SVG | Data visualization                |
| React Router           | Page navigation                   |
| Vitest                 | Unit testing                      |
| Vercel                 | Hosting and deployment            |
| PayPal                 | Voluntary donations               |

## Technical Architecture

Use a frontend-only architecture for the initial release.

The calculator performs all calculations directly in the browser.

Researcher profiles, scientific references, educational articles, and calculation configurations should be stored as structured local TypeScript data.

A backend, database, authentication system, and custom API are NOT required for the MVP.

Avoid introducing unnecessary dependencies or infrastructure.

---

# 5. Website Structure and Pages

The website should have the following pages.

## 5.1 Home Page

Purpose: Introduce RunZones Lab and encourage visitors to explore heart rate training.

Required sections:

**Hero Section**

- Website name and tagline.
- Short introduction explaining the platform.
- Primary CTA: "Calculate My Heart Rate Zones".
- Secondary CTA: "Explore the Science".
- Minimalist running-related editorial photograph or visual.

**Introduction**

- Explain why understanding heart rate zones matters.
- Briefly introduce the three calculation approaches.

**Three Calculation Methods**

- Maximum Heart Rate.
- Heart Rate Reserve.
- Threshold-Based Field Estimate.

Each method should have a short explanation and navigation to its dedicated calculator or methodology section.

**Five Heart Rate Zones**

- Introduce Zones 1–5.
- Briefly explain their general training purposes.

**Research Highlight**

- Feature selected researchers, scientists, or coaches.
- Link to their profiles.

**Scientific References**

- Showcase selected publications and studies.

**Donation Section**

- Invite visitors to voluntarily support the platform through PayPal.

**Footer**

- Navigation links.
- About RunZones Lab.
- Scientific references.
- Disclaimer.
- Copyright information.
- PayPal donation link.

## 5.2 HR Zone Calculator Page

This is the primary functionality of the website.

Provide three calculation methods:

- %MHR Calculator
- %HRR Calculator
- Threshold-Based HR Calculator

Use tabs, segmented navigation, or another intuitive interface to switch between methods.

Each method must have its own input requirements, calculation explanation, and results.

### Method 01: Maximum Heart Rate (%MHR)

Required inputs:

- Age, when an age-based HRmax estimate is selected.
- Maximum heart rate (HRmax).
- HRmax source or estimation formula.

Provide two HRmax estimation options:

**Traditional equation:**

HRmax = 220 - Age

Label this as a commonly used legacy estimate, not a precise or universally valid prediction.

**Tanaka equation:**

HRmax = 208 - (0.7 × Age)

Reference:
Tanaka, Monahan, and Seals (2001), "Age-Predicted Maximal Heart Rate Revisited."

The user should also be able to enter an independently observed or clinically measured HRmax.

Prioritize an actual observed value when provided. Clearly identify the source of the HRmax used in the calculation.

Do not imply that age-based estimates are equivalent to measured maximum heart rate.

General calculation:

Target HR = HRmax × Zone Intensity Percentage

### Method 02: Heart Rate Reserve (Karvonen Method / %HRR)

Required inputs:

- Maximum heart rate (HRmax).
- Resting heart rate (RHR).
- Age only when an age-based HRmax estimate is selected.
- HRmax estimation source.

Formulas:

HRR = HRmax - RHR

Target HR = RHR + (HRR × Intensity Percentage)

The calculator should:

- Explain heart rate reserve.
- Explain why resting heart rate affects the calculation.
- Show the calculation of HRR.
- Show the percentage used for each zone.
- Display the resulting BPM range.
- Explain the methodology's limitations.

Historical reference:

Karvonen, Kentala, and Mustala (1957), "The Effects of Training on Heart Rate: A Longitudinal Study."

Important: Do not automatically treat general clinical intensity classifications as a scientifically validated five-zone running model.

The exact five-zone %HRR preset must be documented and source-verified before being presented as a standard running training model.

### Method 03: Threshold-Based HR (Field-Estimated FTHR)

The initial release will use a field-test estimate rather than laboratory lactate measurements.

Use the updated Joe Friel 20-minute Functional Threshold Heart Rate field-test procedure.

Required inputs:

- Average heart rate during a 20-minute time trial.

Calculation:

Estimated FTHR = Average 20-Minute Heart Rate × 0.95

Instructions displayed to users:

1. Perform a steady, hard 20-minute time trial.
2. Record the average heart rate for the entire 20-minute effort.
3. Multiply the average heart rate by 0.95.
4. Use the resulting estimated FTHR to calculate training zones.

Explain that this result is an approximation of Functional Threshold Heart Rate.

Do not label the field-test result as a direct laboratory measurement of Lactate Threshold Heart Rate.

Include the limitations of field testing, including pacing errors, fatigue, environmental conditions, and measurement accuracy.

Reference:

Joe Friel, "A Quick Guide to Setting Zones" (originally published 2020, revised September 2025).

Official article:
https://joefrieltraining.com/a-quick-guide-to-setting-zones/

### Important Scientific Requirement: Zone Boundaries

Every calculation method must use a documented five-zone percentage model.

Do not arbitrarily invent percentage boundaries.

Before implementing final numeric zone presets:

1. Research the appropriate published zone model for each method.
2. Identify the original or authoritative source.
3. Document the exact lower and upper percentages for Zones 1–5.
4. Explain any differences between general exercise-intensity classifications and running-specific training zones.
5. Ensure the resulting zones have consistent, non-overlapping BPM ranges.
6. Record the publication or methodology reference for every preset.

The third method must retain the distinction between field-estimated FTHR and laboratory-measured LTHR.

If an appropriate five-zone preset cannot be verified, document the available alternatives and request approval rather than inventing one.

Keep zone percentages in configurable data files, not hardcoded in React components.

---

# 6. Five-Zone Training System

The user interface should present five primary training zones.

Use these general descriptions as introductory educational labels:

| Zone   | General Description             |
| ------ | ------------------------------- |
| Zone 1 | Recovery / Very Easy            |
| Zone 2 | Aerobic Endurance / Easy        |
| Zone 3 | Tempo / Moderate-Hard           |
| Zone 4 | Threshold / Hard                |
| Zone 5 | High Intensity / Maximum Effort |

These labels are educational descriptions. Actual physiological interpretations and intensity boundaries must follow the selected calculation method.

If the selected source uses subdivisions such as Zones 5a, 5b, and 5c, clearly explain how these relate to the website's five primary display zones.

Each zone result should display:

- Zone number.
- Zone name.
- Heart rate range in BPM.
- Percentage range used.
- Training purpose.
- Short physiological explanation.
- Relevant training examples.

Do not assume that a Zone 2 result calculated using one approach is physiologically identical to Zone 2 from another approach.

---

# 7. Calculation Results

After successful calculation, display a structured results dashboard.

Each method should include:

**A. Summary**

- Calculation method.
- Inputs used.
- HRmax, HRR, or FTHR anchor, depending on the method.
- Date-independent calculation output.

**B. Five-Zone Table**

| Zone | Training Purpose | HR Range  |
| ---- | ---------------- | --------- |
| Z1   | Recovery         | XX–XX BPM |
| Z2   | Aerobic          | XX–XX BPM |
| Z3   | Tempo            | XX–XX BPM |
| Z4   | Threshold        | XX–XX BPM |
| Z5   | High Intensity   | XX–XX BPM |

Values must be dynamically calculated.

**C. Calculation Breakdown**

Add an expandable "How was this calculated?" section.

Show:

- Original formula.
- Actual user inputs.
- Selected zone percentages.
- Substitution of values into the formula.
- Final calculated BPM range.
- Rounding rules.

The result should be transparent and understandable.

**D. Zone Visualization**

Display a horizontal BPM range visualization using five restrained zone colors.

Use clear labels and BPM values.

Ensure text remains readable on mobile devices.

---

# 8. Comparison Dashboard

This is a major feature of RunZones Lab.

Visitors should be able to compare all three calculation approaches using one athlete's information.

## Comparison Inputs

Collect the shared athlete information once:

- Age.
- HRmax or HRmax estimation preference.
- Resting HR.
- 20-minute time trial average HR.

Use the shared inputs where applicable.

Allow users to provide different HRmax sources if needed, but make the assumptions visible.

Each calculation method must be independently evaluated using its own input requirements.

## Comparison Results

Display all three approaches side by side:

| Zone   | %MHR      | %HRR      | Threshold-Based |
| ------ | --------- | --------- | --------------- |
| Zone 1 | BPM range | BPM range | BPM range       |
| Zone 2 | BPM range | BPM range | BPM range       |
| Zone 3 | BPM range | BPM range | BPM range       |
| Zone 4 | BPM range | BPM range | BPM range       |
| Zone 5 | BPM range | BPM range | BPM range       |

Add a shared-scale chart showing differences between the resulting heart rate boundaries.

Each method should have a distinct but restrained visual identifier.

## Comparison Explanation

Provide dynamic educational observations explaining:

- How using resting HR changes the HRR calculation.
- How estimated and observed maximum heart rate can affect results.
- Why threshold-based calculations have a different physiological reference.
- Why the resulting BPM ranges are not necessarily identical.
- Why none of the three methods should automatically be presented as universally superior.

If a method is missing required information, display its incomplete state instead of silently guessing an input.

---

# 9. Research Library

The Research Library is one of the main educational components of RunZones Lab.

Its purpose is to present the people and research behind the methodologies.

Include both:

- Academic researchers and exercise physiologists.
- Influential endurance coaches and practitioners.

## Initial Researcher and Coach Profiles

### Hirofumi Tanaka

Role: Exercise physiologist and researcher.

Associated topic:
Age-predicted maximum heart rate.

Featured publication:

"Age-Predicted Maximal Heart Rate Revisited" (2001).

Authors: Hirofumi Tanaka, Kevin D. Monahan, and Douglas R. Seals.

Important contribution:
The 208 - (0.7 × Age) maximum heart rate prediction equation.

Reference:
https://pubmed.ncbi.nlm.nih.gov/11153730/

### Martti J. Karvonen

Role: Finnish physician and researcher.

Associated topic:
Heart rate reserve and exercise intensity.

Featured publication:

"The Effects of Training on Heart Rate: A Longitudinal Study" (1957).

Authors: M. J. Karvonen, E. Kentala, and O. Mustala.

Reference:
https://pubmed.ncbi.nlm.nih.gov/13470504/

Use careful historical attribution. Do not claim that one publication alone proves every modern application of the Karvonen formula.

### Joe Friel

Role: Endurance sports coach and author.

Associated topic:
Functional Threshold Heart Rate and endurance training zones.

Featured methodology:

"A Quick Guide to Setting Zones" (revised September 2025).

Official reference:
https://joefrieltraining.com/a-quick-guide-to-setting-zones/

### William L. Haskell

Role: Exercise physiologist and cardiovascular researcher.

Associated topic:
Historical context of age-predicted maximum heart rate and exercise prescription.

Only publish verified biographical information and contributions.

## Researcher Profile Template

Each researcher profile should include:

1. Full name.
2. Professional title or role.
3. Portrait, where an appropriate and legally usable image is available.
4. Biography.
5. Academic background or professional history, when verified.
6. Major research contributions.
7. Associated calculation methods.
8. Selected publications.
9. Relevance to endurance running.
10. Scientific references.

Use primary publications wherever possible.

Never invent credentials, affiliations, biographies, quotations, publication titles, or research contributions.

Clearly distinguish researchers who developed or studied a scientific method from coaches who popularized its practical application.

---

# 10. Science and Methodology Page

Create a dedicated educational section explaining the scientific concepts behind heart rate training.

Suggested topics:

### Understanding Heart Rate

- What is heart rate?
- What is maximum heart rate?
- What is resting heart rate?
- What is heart rate reserve?
- What is lactate?
- What are LT1 and LT2?
- What is Functional Threshold Heart Rate?
- What is the relationship between exercise intensity and heart rate?

### Understanding the Three Methods

Create separate articles explaining:

- Maximum Heart Rate Method.
- Karvonen / Heart Rate Reserve Method.
- Threshold-Based Field Testing Method.

Each article should contain:

- Historical background.
- Scientific concept.
- Mathematical formula.
- Example calculation.
- Advantages.
- Limitations.
- Practical applications.
- Supporting references.

### Understanding the Five Zones

Explain the purpose of each zone and its relationship to training intensity, perceived exertion, aerobic endurance, and threshold training.

Make clear that zone classifications are methodology-dependent.

---

# 11. Scientific References Page

Create a dedicated bibliography or reference library.

For each source, display:

- Publication title.
- Author or authors.
- Publication year.
- Journal or publisher.
- DOI, PMID, or other identifier.
- Short explanation of its relevance.
- External link to the original publication.

Prioritize:

1. Peer-reviewed original research.
2. Systematic reviews and meta-analyses.
3. Recognized exercise physiology guidelines.
4. Official academic or institutional sources.
5. Primary methodology publications by recognized coaches.

Do not rely solely on fitness blogs or commercial calculator websites for scientific claims.

Any factual statement about a researcher or scientific method should have an appropriate source.

---

# 12. About and Donation Page / Section

Include an About section explaining:

- Why RunZones Lab was created.
- Its educational mission.
- Its commitment to scientific transparency.
- Its intention to provide free heart rate training resources.

## PayPal Donation Integration

Add a voluntary donation CTA.

Suggested copy:

"Support RunZones Lab"

"RunZones Lab is built to help runners better understand the science behind their training. If you find this platform useful, consider supporting its continued development through a voluntary contribution."

Donation requirements:

- Use a PayPal.Me link or an eligible PayPal donation button.
- Open the official PayPal payment page.
- Do not require users to donate.
- Do not restrict any calculator or educational feature behind a payment.
- Do not collect or store payment credentials.
- Do not expose PayPal secret credentials in frontend code.

Store the owner's actual donation URL in configuration.

Use a clearly named placeholder until the owner supplies the real URL. Do not invent a PayPal account or link.

---

# 13. Visual Design and User Experience

## Design Direction

**Minimalist Editorial + Modern Running Aesthetic**

The website should resemble a combination of:

- A premium running publication.
- A minimalist scientific journal.
- A modern sports performance platform.

Avoid conventional dashboard-heavy designs, excessive gradients, oversized rounded cards, unnecessary shadows, and overly saturated colors.

## Color Palette

Suggested direction:

| Element            | Color Direction                       |
| ------------------ | ------------------------------------- |
| Main background    | White / warm white                    |
| Primary typography | Near black / charcoal                 |
| Secondary text     | Muted gray                            |
| Borders            | Light gray                            |
| Accent             | Restrained orange or cobalt blue      |
| Zone colors        | Five distinguishable but muted colors |

Use color consistently to differentiate training zones without making the interface visually overwhelming.

## Typography

Suggested fonts:

- Newsreader or Playfair Display for editorial headings.
- Inter or DM Sans for body text and interface elements.

Use a strong typographic hierarchy.

## Visual Elements

Use:

- Black-and-white running photography.
- Minimalist heart rate waveform illustrations.
- Running track-inspired lines and dividers.
- Clean scientific charts.
- BPM range visualizations.
- Small editorial labels and section headings.

Avoid placing decorative running imagery everywhere. Use visuals purposefully.

## Responsive Design

The website must work on:

- Desktop.
- Laptop.
- Tablet.
- Mobile devices.

On smaller screens, comparison tables should adapt to readable stacked cards or horizontally scrollable tables.

Ensure all input controls and navigation elements remain usable on touchscreens.

---

# 14. Suggested Application Architecture

Organize components and functionality into reusable modules.

Suggested project structure:

runzones-lab/
│
├── public/
│ ├── images/
│ └── favicon/
│
├── src/
│ ├── components/
│ │ ├── layout/
│ │ ├── common/
│ │ ├── calculator/
│ │ ├── comparison/
│ │ ├── charts/
│ │ ├── research/
│ │ └── donation/
│ │
│ ├── pages/
│ │ ├── Home.tsx
│ │ ├── Calculator.tsx
│ │ ├── Compare.tsx
│ │ ├── Science.tsx
│ │ ├── Researchers.tsx
│ │ ├── References.tsx
│ │ └── About.tsx
│ │
│ ├── calculations/
│ │ ├── maximumHR.ts
│ │ ├── heartRateReserve.ts
│ │ ├── thresholdHR.ts
│ │ └── zoneCalculator.ts
│ │
│ ├── data/
│ │ ├── zoneModels.ts
│ │ ├── researchers.ts
│ │ ├── articles.ts
│ │ └── references.ts
│ │
│ ├── types/
│ │ └── index.ts
│ │
│ ├── hooks/
│ │
│ ├── utils/
│ │
│ ├── App.tsx
│ ├── main.tsx
│ └── index.css
│
├── docs/
│ ├── SCIENTIFIC_METHODS.md
│ └── SOURCES.md
│
├── package.json
└── README.md

This is a suggested structure. It can be adjusted when necessary while preserving separation between calculation logic, research content, and UI components.

## Architecture Principles

- Calculation functions must remain independent of React components.
- All zone percentages must be configurable.
- Researcher profiles must use structured data.
- Scientific references should be reusable across pages.
- Components should be reusable and maintainable.
- Avoid unnecessary global state management.
- Do not introduce a backend without a clear requirement.
- Use TypeScript interfaces and types for important data structures.

---

# 15. Calculation Accuracy and Validation

This is a critical requirement.

The application must not sacrifice scientific accuracy for visual presentation.

## Input Validation

Validate all numerical inputs.

Examples:

- Age must be a positive and reasonable value.
- HRmax must be greater than zero.
- Resting HR must be greater than zero and lower than HRmax.
- Twenty-minute average HR must be a positive value.
- FTHR must be calculated from the correct field-test input.
- Missing inputs must not be silently replaced with assumed values.
- Invalid or physiologically inconsistent combinations must produce understandable error messages.

Apply sensible physiological plausibility checks, but avoid arbitrary hard-coded medical eligibility decisions.

## Rounding

- Use consistent whole-number BPM output for displayed training zones.
- Preserve precision internally when performing calculations.
- Define how percentage boundaries are converted into whole-number BPM ranges.
- Ensure adjacent zones do not overlap or leave unintended gaps.
- Document the rounding convention.

## Testing

Use Vitest to create unit tests for:

- HRmax estimation equations.
- HRR calculation.
- Karvonen target HR calculations.
- FTHR field-test estimation.
- Five-zone boundary calculations.
- Whole-number rounding.
- Missing and invalid inputs.
- Comparison calculations.
- Boundary edge cases.

Never implement the calculations without testing their expected outputs against independently verified examples.

---

# 16. Medical and Educational Disclaimer

Include an accessible disclaimer explaining that:

- RunZones Lab is an educational and informational tool.
- Calculated heart rate zones are estimates or training references, not medical diagnoses.
- Different training methodologies use different physiological references.
- Age-based HRmax prediction equations have individual limitations.
- Field-test results may be affected by fatigue, pacing, environment, and measurement errors.
- Some medications and health conditions can affect heart rate responses.
- Users with relevant health concerns should seek professional guidance before undertaking strenuous testing or changing exercise intensity.

The website should not make medical guarantees or prescribe training as a substitute for individualized professional advice.

---

# 17. SEO, Accessibility, and Performance

## SEO

Provide:

- Unique page titles.
- Meta descriptions.
- Semantic HTML.
- Structured heading hierarchy.
- Descriptive internal links.
- Search-engine-friendly educational pages.
- Appropriate metadata and social sharing previews.

## Accessibility

- Proper labels for every input.
- Keyboard-accessible navigation.
- Sufficient text contrast.
- Visible focus states.
- Accessible chart descriptions.
- Do not rely exclusively on colors to distinguish zones.

## Performance

- Optimize image sizes.
- Lazy-load non-critical images.
- Avoid unnecessarily large dependencies.
- Use responsive image formats where appropriate.
- Maintain fast initial page loading.
- Avoid unnecessary API requests.

---

# 18. Deployment

Deploy the completed application using Vercel.

Deployment requirements:

- Build successfully using the Vite production build.
- Configure the correct build command and output directory.
- Connect to the Git repository for automatic deployments.
- Ensure page routing works on direct URL access and refresh.
- Configure environment variables only when needed.
- Test the production deployment on desktop and mobile.

The application should not depend on a local XAMPP installation or a continuously running development server.

---

# 19. MVP Development Phases

Implement the project incrementally.

## Phase 1 — Foundation and Design

- Initialize Vite with React and TypeScript if no compatible project already exists.
- Configure Tailwind CSS.
- Establish typography and design tokens.
- Build responsive layout and navigation.
- Develop the Home page.
- Establish the page structure.

## Phase 2 — Scientific Methodology Verification

- Research the exact zone boundaries for all three methods.
- Identify the sources supporting each zone preset.
- Document limitations and terminology.
- Create SCIENTIFIC_METHODS.md.
- Record unresolved scientific decisions.
- Do not invent zone percentages.

This phase must be completed before final numerical zone outputs are released.

## Phase 3 — Calculation Engine

- Implement independent mathematical functions.
- Implement input validation.
- Implement configurable zone models.
- Establish BPM rounding rules.
- Create Vitest tests.
- Verify calculations against reference examples.

## Phase 4 — Calculator Interface

- Develop the three calculator interfaces.
- Add input guidance.
- Show results and zone tables.
- Add calculation breakdowns.
- Implement heart rate visualizations.

## Phase 5 — Comparison Dashboard

- Implement shared athlete inputs.
- Calculate all available methods.
- Display side-by-side results.
- Add shared-scale zone comparisons.
- Display educational explanations.

## Phase 6 — Educational Content

- Build the Science page.
- Build researcher profiles.
- Build the Research Library.
- Build scientific references.
- Add About and disclaimer sections.

## Phase 7 — Donation and Finalization

- Integrate the supplied PayPal donation URL.
- Complete responsive design.
- Perform accessibility checks.
- Test calculator edge cases.
- Optimize images and page performance.
- Prepare deployment documentation.

## Phase 8 — Deployment

- Push to the Git repository.
- Deploy to Vercel.
- Test all production routes.
- Verify calculator functionality.
- Verify donation link behavior.

---

# 20. MVP Acceptance Criteria

The first public release is considered complete when:

- The website is responsive and visually consistent.
- Visitors can navigate all primary pages.
- All three calculation approaches are available.
- Each method uses documented and verified zone percentages.
- The application distinguishes measured inputs from estimated inputs.
- The threshold-based field protocol is correctly explained.
- Every calculator displays five zones.
- Calculation formulas and results are transparent.
- All three methods can be compared.
- Incomplete inputs are handled correctly.
- Scientific profiles and references are presented accurately.
- The disclaimer is accessible.
- The PayPal donation link works when configured.
- Calculation functions have passing unit tests.
- The application successfully builds and deploys on Vercel.

---

# 21. Instructions for Claude Code

Act as a senior frontend engineer, TypeScript developer, and technically careful sports-science research assistant.

Use this document as the primary product and development specification for RunZones Lab.

Follow these instructions throughout development:

1. Inspect the existing project directory before creating, modifying, or removing files.
2. Use the specified technology stack unless there is a genuine compatibility issue.
3. Prioritize maintainable architecture and reusable components.
4. Keep mathematical calculations separate from presentation components.
5. Do not invent research findings, scientific references, biographies, or zone percentages.
6. Verify scientific information using primary studies and authoritative publications whenever possible.
7. Maintain a clear distinction between FTHR field estimates and laboratory-measured LTHR.
8. Do not publish unverified zone presets as scientifically validated.
9. Use placeholders for credentials, configuration values, and donation links that the owner has not supplied.
10. Do not add an unnecessary backend, database, or authentication system.
11. Write and run tests for calculation logic.
12. Explain important implementation decisions.
13. Keep the design aligned with the minimalist editorial visual direction.
14. Implement the application incrementally rather than generating the entire project in one unstructured step.

## Initial Instruction

Before implementing the entire application:

First inspect the project environment and present a concise implementation plan.

Identify any remaining scientific decisions, especially the five-zone percentage boundaries for %MHR, %HRR, and FTHR.

Produce a scientific methodology proposal with its supporting references and clearly distinguish verified facts from recommended design decisions.

Do not invent missing research information to make the implementation appear complete.

After the methodology and implementation plan have been reviewed, proceed with development in the phases specified above.

The goal is to deliver a functional, maintainable, educational, scientifically responsible, and visually polished website—not merely a collection of calculators.

---

# END OF PROJECT BRIEF

**RUNZONES LAB**  
_Heart Rate Training, Explained by Science._

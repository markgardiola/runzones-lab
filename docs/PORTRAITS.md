# Adding portraits (researchers and coaches)

RunZones Lab shows a portrait only when the image rights are clear. A photo found on a web page is almost always copyrighted, so it must not be copied just because it is visible. Until you add one, each profile shows a neutral placeholder.

## Legal ways to get a portrait

1. **A licensed image.** Wikimedia Commons hosts many photos with clear licences (CC BY, CC BY-SA, public domain). Check the licence box on the file's page and follow its credit requirements.
2. **Permission.** Ask the person (or the institution that owns the photo) for permission to use it on RunZones Lab, and keep the email. Good starting points: the University of Texas at Austin faculty page (Tanaka), Stanford Profiles (Haskell), Joe Friel's own website (Friel), and for Martti Karvonen the University of Minnesota's Seven Countries Study archive, which holds a photo but states no licence, so ask first.
3. **Your own photo**, if you have taken one.

Do not use images from search results, news sites, social media or publisher pages without a licence or permission.

## If you already have images you downloaded

Images found on the internet are normally protected by copyright, and being able to download one does not give you the right to publish it. Publishing without a licence or permission can lead to a takedown request or a claim against the site, so the safe path is to clear each image first. The decision is yours, and the project supports both honest options:

- **Cleared** (you know the licence or have permission): set `rights: 'cleared'` and fill in `license`.
- **Not verified** (you are using an image you have not cleared yet): set `rights: 'unverified'`. The page then says **Licence not verified** beside the credit and links to the page the image came from, so nothing is misrepresented. `npm run preflight` lists every unverified image so you can clear or replace it before launch. Remove an image promptly if its owner asks.

Never write a licence or permission you have not actually confirmed.

### Turning your downloads into web-ready files
1. Create a folder named `portrait-source` in the project root and copy your originals into it, renamed to the profile: `tanaka.jpg`, `karvonen.png`, `haskell.jpeg`, `friel.webp` (JPG, PNG or WebP).
2. Install the image tool once and run the script:
   ```powershell
   npm install
   npm run portraits
   ```
   Each image becomes `public/images/people/<slug>.jpg`, 400 x 500, about 30 to 80 KB, with camera metadata removed. If an original is under 400 px wide the script warns that it may look soft.
3. Add an entry for each in `src/data/portraits.ts` (see the example in that file). Use the page you downloaded the image from as `sourceUrl`.
4. Run `npm run preflight`, then check the Researchers page.

`portrait-source` is ignored by Git so your originals are never uploaded.

## How to add one

1. Save a web-sized image (about 400 px wide, JPEG or WebP, under 100 KB) as `public/images/people/<slug>.jpg`, where the slug is `tanaka`, `karvonen`, `haskell` or `friel`.
2. In `src/data/portraits.ts`, add an entry with the file, descriptive alt text, the credit the licence requires, the licence name, and the page where the licence or permission can be checked (see the example in that file).
3. Run `npm test`. A test fails if an entry is incomplete, is not self-hosted, or has no https source link.
4. Open the Researchers page: the photo, credit and licence line appear in place of the placeholder.

The photo is lazy-loaded and its credit is always shown beside it.

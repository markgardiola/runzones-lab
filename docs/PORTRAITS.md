# Adding portraits (researchers and coaches)

RunZones Lab shows a portrait only when the image rights are clear. A photo found on a web page is almost always copyrighted, so it must not be copied just because it is visible. Until you add one, each profile shows a neutral placeholder.

## Legal ways to get a portrait

1. **A licensed image.** Wikimedia Commons hosts many photos with clear licences (CC BY, CC BY-SA, public domain). Check the licence box on the file's page and follow its credit requirements.
2. **Permission.** Ask the person (or the institution that owns the photo) for permission to use it on RunZones Lab, and keep the email. Good starting points: the University of Texas at Austin faculty page (Tanaka), Stanford Profiles (Haskell), Joe Friel's own website (Friel), and for Martti Karvonen the University of Minnesota's Seven Countries Study archive, which holds a photo but states no licence, so ask first.
3. **Your own photo**, if you have taken one.

Do not use images from search results, news sites, social media or publisher pages without a licence or permission.

## How to add one

1. Save a web-sized image (about 400 px wide, JPEG or WebP, under 100 KB) as `public/images/people/<slug>.jpg`, where the slug is `tanaka`, `karvonen`, `haskell` or `friel`.
2. In `src/data/portraits.ts`, add an entry with the file, descriptive alt text, the credit the licence requires, the licence name, and the page where the licence or permission can be checked (see the example in that file).
3. Run `npm test`. A test fails if an entry is incomplete, is not self-hosted, or has no https source link.
4. Open the Researchers page: the photo, credit and licence line appear in place of the placeholder.

The photo is lazy-loaded and its credit is always shown beside it.

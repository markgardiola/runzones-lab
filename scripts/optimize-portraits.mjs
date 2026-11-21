// Turns the original portrait files you downloaded into small, web-ready images.
//
//   1. Put the originals in a folder named  portrait-source/  at the project root, named by profile:
//        tanaka.jpg   karvonen.png   haskell.jpeg   friel.webp      (jpg, jpeg, png or webp)
//   2. Run:  npm run portraits
//   3. The results appear in  public/images/people/<slug>.jpg  (400 x 500, about 30-80 KB, metadata removed).
//
// It does not decide whether you may use an image. See docs/PORTRAITS.md for that.
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { extname, join, basename } from 'node:path';
import sharp from 'sharp';

const SLUGS = ['tanaka', 'karvonen', 'haskell', 'friel'];
const IN_DIR = 'portrait-source';
const OUT_DIR = join('public', 'images', 'people');
const WIDTH = 400;
const HEIGHT = 500;

if (!existsSync(IN_DIR)) {
  console.log(`Folder "${IN_DIR}" not found. Create it and put your original images in it, named tanaka, karvonen, haskell, friel.`);
  process.exit(1);
}
mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(IN_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
if (files.length === 0) {
  console.log(`No images found in "${IN_DIR}".`);
  process.exit(1);
}

let done = 0;
for (const file of files) {
  const slug = basename(file, extname(file)).toLowerCase();
  if (!SLUGS.includes(slug)) {
    console.log(`SKIP  ${file}: name it after the profile (${SLUGS.join(', ')}).`);
    continue;
  }
  const src = join(IN_DIR, file);
  const dest = join(OUT_DIR, `${slug}.jpg`);
  try {
    const meta = await sharp(src).metadata();
    await sharp(src)
      .rotate() // respect the camera's orientation, then metadata is dropped below
      .resize(WIDTH, HEIGHT, { fit: 'cover', position: sharp.strategy.attention })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(dest);
    const kb = Math.round(statSync(dest).size / 1024);
    const small = meta.width && meta.width < WIDTH ? `  (original is only ${meta.width}px wide, so it may look soft)` : '';
    console.log(`OK    ${file} -> ${dest}  ${WIDTH}x${HEIGHT}, ${kb} KB${small}`);
    done++;
  } catch (e) {
    console.log(`FAIL  ${file}: ${e.message}`);
  }
}
console.log(`\n${done} image(s) ready. Next: add each one to src/data/portraits.ts (see the example in that file), then run  npm run preflight`);

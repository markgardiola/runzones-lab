// Checks the things that are easy to forget before deploying. It only reads files.
//   npm run preflight             prints a checklist
//   npm run preflight -- --strict  exits with an error if anything needs attention (for CI)
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const strict = process.argv.includes('--strict');
let attention = 0;
const ok = (m) => console.log(`OK    ${m}`);
const warn = (m) => {
  attention++;
  console.log(`CHECK ${m}`);
};

// ---- 1. Donation link (same rules as src/utils/donation.ts) ----
function readEnvFile(name) {
  if (!existsSync(name)) return {};
  const out = {};
  for (const line of readFileSync(name, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !line.trim().startsWith('#')) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}
const fromFiles = ['.env', '.env.production', '.env.local', '.env.production.local'].reduce((a, f) => ({ ...a, ...readEnvFile(f) }), {});
const raw = process.env.VITE_PAYPAL_DONATION_URL ?? fromFiles.VITE_PAYPAL_DONATION_URL ?? '';

function donationProblem(value) {
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    return 'not a valid web address (paste the full link, starting with https://)';
  }
  if (url.protocol !== 'https:') return 'must start with https://';
  const h = url.hostname.toLowerCase();
  const allowed = h === 'paypal.me' || h === 'paypal.com' || h.endsWith('.paypal.com') || h.endsWith('.paypal.me');
  return allowed ? null : `${h} is not a PayPal domain`;
}

console.log('Donation link');
if (!raw.trim()) {
  warn('VITE_PAYPAL_DONATION_URL is not set here, so the donate button will be disabled. Set it in .env.local for local tests and in Vercel for the live site (docs/DONATIONS.md).');
} else {
  const p = donationProblem(raw);
  if (p) warn(`VITE_PAYPAL_DONATION_URL is set but rejected: ${p}.`);
  else if (/sandbox\.paypal\.com/.test(raw)) warn('The donation link points to the PayPal SANDBOX (test) site. Use your live link for the real site.');
  else ok(`VITE_PAYPAL_DONATION_URL looks valid (${new URL(raw.trim()).hostname}). Remember Vercel needs its own copy.`);
}

// ---- 2. Portraits ----
console.log('\nPortraits');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const portraitsFile = join('src', 'data', 'portraits.ts');
const researchersFile = join('src', 'data', 'researchers.ts');
const slugs = existsSync(researchersFile)
  ? [...new Set([...readFileSync(researchersFile, 'utf8').matchAll(/slug:\s*'([a-z-]+)'/g)].map((m) => m[1]))]
  : [];
const code = existsSync(portraitsFile) ? strip(readFileSync(portraitsFile, 'utf8')) : '';
const entries = [...code.matchAll(/(\w+):\s*\{([\s\S]*?)\n\s*\},?/g)].map((m) => ({
  slug: m[1],
  src: (m[2].match(/src:\s*'([^']+)'/) || [])[1],
  rights: (m[2].match(/rights:\s*'([^']+)'/) || [])[1],
}));
for (const slug of slugs) {
  const e = entries.find((x) => x.slug === slug);
  if (!e) {
    warn(`${slug}: no portrait yet (a neutral placeholder is shown).`);
    continue;
  }
  if (!e.src || !existsSync(join('public', e.src))) warn(`${slug}: the image file ${e.src ?? '(none)'} is missing from public/.`);
  else if (e.rights === 'cleared') ok(`${slug}: image present, rights marked cleared.`);
  else warn(`${slug}: image present but rights are ${e.rights ?? 'not set'}. The page shows "Licence not verified". Clear it with the owner or replace it before you launch (docs/PORTRAITS.md).`);
}

console.log(attention === 0 ? '\nNothing needs attention.' : `\n${attention} item(s) need attention.`);
process.exit(strict && attention > 0 ? 1 : 0);

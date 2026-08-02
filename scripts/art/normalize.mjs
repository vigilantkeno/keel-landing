#!/usr/bin/env node
// STYLE_SPEC workflow step 4 — the consistency engine. Takes one human-
// selected candidate and produces the shipping assets:
//
//   - crop to 16:9 and upscale to the hero master size (2400x1350)
//   - black point mapped to true #0B0B0B (provider blacks drift charcoal)
//   - ember band hue-snapped to exactly #FF5A1F
//   - 2% film grain
//   - derived crops: og 1200x630, card 1200x800 (never new generations)
//   - WebP q82 committed; PNG master kept locally (gitignored — a 2400px
//     PNG is ~5MB and would put the repo on a ~300MB/year diet)
//   - provenance sidecar JSON (style version, model, prompt, source file)
//
//   node scripts/art/normalize.mjs --in <candidate.png> --slug <slug> --family <arch|obj|human|abs>
import sharp from 'sharp';
import { mkdirSync, writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { loadStyle } from './lib/style.mjs';

function arg(flag, dflt) {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : dflt;
}
const input = arg('--in');
const slug = arg('--slug');
const family = arg('--family', 'arch');
if (!input || !slug) {
  console.error('usage: node scripts/art/normalize.mjs --in <candidate.png> --slug <slug> --family <fam>');
  process.exit(1);
}

const style = loadStyle();
const INK = { r: 0x0b, g: 0x0b, b: 0x0b };
const EMBER = { h: 15.8, s: 0.88 }; // #FF5A1F in HSV
const GRAIN = style.normalize?.grainOpacity ?? 0.02;

const id = basename(input, '.png').split('-').pop();
const HERO_W = 2400, HERO_H = 1350;

// --- load, crop to 16:9, upscale to master size -------------------------
const src = sharp(input);
const meta = await src.metadata();
const cropH = Math.round((meta.width * 9) / 16);
const base = await src
  .extract({ left: 0, top: Math.max(0, Math.round((meta.height - cropH) / 2)), width: meta.width, height: Math.min(cropH, meta.height) })
  .resize(HERO_W, HERO_H, { kernel: 'lanczos3' })
  .removeAlpha()
  .raw()
  .toBuffer();

// --- single raw pass: black point + ember snap + grain ------------------
// black point: find the darkest luminance, then linearly map [min..255]
// so it lands exactly on ink (11). Values already at/below ink stay put.
let minLum = 255;
for (let i = 0; i < base.length; i += 3) {
  const lum = 0.2126 * base[i] + 0.7152 * base[i + 1] + 0.0722 * base[i + 2];
  if (lum < minLum) minLum = lum;
}
const target = 11;
const a = minLum < target ? 1 : (255 - target) / (255 - minLum);
const b = minLum < target ? 0 : target - a * minLum;

for (let i = 0; i < base.length; i += 3) {
  let r = a * base[i] + b, g = a * base[i + 1] + b, bl = a * base[i + 2] + b;

  // ember snap: saturated warm-orange pixels get hue/sat set to brand ember
  const mx = Math.max(r, g, bl), mn = Math.min(r, g, bl);
  const v = mx / 255, s = mx === 0 ? 0 : (mx - mn) / mx;
  if (s > 0.45 && v > 0.45 && mx === r) {
    const hue = ((g - bl) / (mx - mn)) * 60; // red-max sector: -60..60
    if (hue >= 5 && hue <= 45) {
      const nh = EMBER.h / 60, ns = Math.max(s, EMBER.s);
      const c = v * ns, x = c * (1 - Math.abs((nh % 2) - 1)), m = v - c;
      r = (c + m) * 255; g = (x + m) * 255; bl = m * 255;
    }
  }

  // 2% grain
  const n = (Math.random() - 0.5) * 2 * GRAIN * 255;
  base[i] = Math.max(0, Math.min(255, r + n));
  base[i + 1] = Math.max(0, Math.min(255, g + n));
  base[i + 2] = Math.max(0, Math.min(255, bl + n));
}

// --- outputs ------------------------------------------------------------
const master = sharp(base, { raw: { width: HERO_W, height: HERO_H, channels: 3 } });
const pubDir = join(process.cwd(), 'public', 'blog-art', slug);
const masterDir = join(process.cwd(), 'content', 'art', 'masters', slug);
mkdirSync(pubDir, { recursive: true });
mkdirSync(masterDir, { recursive: true });

const nameFor = (placement) => `keel-${family}-${slug}-${placement}-${id}`;
const q = style.export?.quality ?? 82;

await master.clone().png().toFile(join(masterDir, `${nameFor('hero')}.png`));
const outHero = await master.clone().webp({ quality: q }).toFile(join(pubDir, `${nameFor('hero')}.webp`));
// og 1200x630: resize to width, center-crop height
const outOg = await master.clone().resize(1200, 630, { fit: 'cover' }).webp({ quality: q }).toFile(join(pubDir, `${nameFor('og')}.webp`));
// card 1200x800 (3:2)
const outCard = await master.clone().resize(1200, 800, { fit: 'cover' }).webp({ quality: q }).toFile(join(pubDir, `${nameFor('card')}.webp`));

// --- provenance ---------------------------------------------------------
// pull the most recent run log from the candidate dir, if present
let run = null;
try {
  const dir = dirname(input);
  const logs = readdirSync(dir).filter((f) => f.startsWith('run-')).sort();
  if (logs.length) run = JSON.parse(readFileSync(join(dir, logs.at(-1)), 'utf8'));
} catch { /* provenance is best-effort */ }

writeFileSync(join(pubDir, `${nameFor('hero')}.json`), JSON.stringify({
  styleVersion: style.version,
  family,
  slug,
  sourceCandidate: basename(input),
  normalizedAt: new Date().toISOString(),
  blackPoint: { measuredMin: Math.round(minLum), mappedTo: target },
  emberTarget: '#FF5A1F',
  grain: GRAIN,
  provider: run?.provider ?? null,
  model: run?.model ?? null,
  quality: run?.quality ?? null,
  prompt: run?.prompt ?? null,
  slots: run?.slots ?? null,
}, null, 2) + '\n');

console.log(`hero  ${Math.round(outHero.size / 1024)}KB  public/blog-art/${slug}/${nameFor('hero')}.webp`);
console.log(`og    ${Math.round(outOg.size / 1024)}KB  card ${Math.round(outCard.size / 1024)}KB  + provenance json + PNG master (local only)`);
console.log(`blackpoint: min ${Math.round(minLum)} -> ${target}`);

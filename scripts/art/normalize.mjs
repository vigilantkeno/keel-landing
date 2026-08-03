#!/usr/bin/env node
// STYLE_SPEC workflow step 4 — the consistency engine. Takes one human-
// selected candidate and produces the shipping assets:
//
//   - crop to 16:9 at the provider's native resolution (no upscale)
//   - black point mapped to true #0B0B0B (provider blacks drift charcoal)
//   - ember band hue-snapped to exactly #FF5A1F
//   - resize to each shipping size, THEN grain (see below)
//   - hero 1440x810, card 800x533, og 1200x630 (never new generations)
//   - WebP q82 committed; PNG master kept locally (gitignored)
//   - provenance sidecar JSON (style version, model, prompt, source file)
//
// Two corrections landed here on 2026-08-02, both from measuring rather than
// reasoning (see content/art/style.json .master and .normalize):
//
//   1. NO UPSCALE. gpt-image-1 medium emits 1536x1024; this script used to
//      upscale the 16:9 crop to 2400x1350 and ship that. Everything past
//      1536 was interpolated — 74% of hero bytes for detail the generator
//      never produced. Sizes now come from the contract and derive DOWN.
//   2. GRAIN AFTER RESIZE. Grain used to be baked at master resolution, so
//      every derivative averaged it away; the 2% spec arrived closer to 1%
//      on the assets people actually see. Each output now gets its own grain
//      pass at its own resolution, which is the only way 2% means 2%.
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

// Master = the provider's own resolution after the 16:9 crop. Never larger:
// upscaling here is how the old 2400px hero happened.
const MASTER_W = style.master?.width ?? 1536;
const MASTER_H = style.master?.height ?? 864;

// --- load, crop to 16:9, fit to master (downscale only) -----------------
// withoutEnlargement means a smaller-than-expected candidate stays its own
// size rather than being inflated, so read the real dimensions back out of
// the resize instead of assuming them.
const src = sharp(input);
const meta = await src.metadata();
const cropH = Math.round((meta.width * 9) / 16);
const { data: base, info: baseInfo } = await src
  .extract({ left: 0, top: Math.max(0, Math.round((meta.height - cropH) / 2)), width: meta.width, height: Math.min(cropH, meta.height) })
  .resize(MASTER_W, MASTER_H, { kernel: 'lanczos3', withoutEnlargement: true, fit: 'cover' })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

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

  // NOTE: grain is deliberately NOT applied here — see grainAt() below.
  base[i] = Math.max(0, Math.min(255, r));
  base[i + 1] = Math.max(0, Math.min(255, g));
  base[i + 2] = Math.max(0, Math.min(255, bl));
}

/**
 * Resize the corrected master to a shipping size, then lay grain on at THAT
 * resolution. Order matters: grain applied before a downscale is partly
 * averaged out by the resampler, which is how a 2% spec was arriving at
 * roughly 1% on every shipped asset.
 */
async function shipBuffer(width, height) {
  const { data, info } = await sharp(base, { raw: { width: baseInfo.width, height: baseInfo.height, channels: 3 } })
    .resize(width, height, { kernel: 'lanczos3', fit: 'cover' })
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 3) {
    const n = (Math.random() - 0.5) * 2 * GRAIN * 255;
    data[i] = Math.max(0, Math.min(255, data[i] + n));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n));
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } });
}

// --- outputs ------------------------------------------------------------
const pubDir = join(process.cwd(), 'public', 'blog-art', slug);
const masterDir = join(process.cwd(), 'content', 'art', 'masters', slug);
mkdirSync(pubDir, { recursive: true });
mkdirSync(masterDir, { recursive: true });

const nameFor = (placement) => `keel-${family}-${slug}-${placement}-${id}`;
const q = style.export?.quality ?? 82;

// Shipping sizes come from the contract, never from literals here.
const P = style.placements;
const hero = P.hero, card = P.card, og = P.og;

// PNG master: corrected but grain-free, at provider-native resolution. It is
// the regeneration source, so it stays the one artifact without grain baked
// in — any future placement re-derives from it and gets grain at its own size.
await sharp(base, { raw: { width: baseInfo.width, height: baseInfo.height, channels: 3 } })
  .png()
  .toFile(join(masterDir, `${nameFor('hero')}.png`));

const outHero = await (await shipBuffer(hero.width, hero.height))
  .webp({ quality: q, effort: 6 }).toFile(join(pubDir, `${nameFor('hero')}.webp`));
const outOg = await (await shipBuffer(og.width, og.height))
  .webp({ quality: q, effort: 6 }).toFile(join(pubDir, `${nameFor('og')}.webp`));
const outCard = await (await shipBuffer(card.width, card.height))
  .webp({ quality: q, effort: 6 }).toFile(join(pubDir, `${nameFor('card')}.webp`));

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
  master: { width: baseInfo.width, height: baseInfo.height },
  shipped: { hero: [hero.width, hero.height], card: [card.width, card.height], og: [og.width, og.height] },
  blackPoint: { measuredMin: Math.round(minLum), mappedTo: target },
  emberTarget: '#FF5A1F',
  grain: GRAIN,
  grainAppliedAt: 'ship',
  provider: run?.provider ?? null,
  model: run?.model ?? null,
  quality: run?.quality ?? null,
  prompt: run?.prompt ?? null,
  slots: run?.slots ?? null,
}, null, 2) + '\n');

console.log(`master ${baseInfo.width}x${baseInfo.height} (no upscale)`);
console.log(`hero  ${hero.width}x${hero.height} ${Math.round(outHero.size / 1024)}KB  public/blog-art/${slug}/${nameFor('hero')}.webp`);
console.log(`og    ${Math.round(outOg.size / 1024)}KB  card ${Math.round(outCard.size / 1024)}KB  + provenance json + PNG master (local only)`);
console.log(`blackpoint: min ${Math.round(minLum)} -> ${target}   grain ${GRAIN} applied per shipping size`);

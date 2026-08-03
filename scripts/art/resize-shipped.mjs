#!/usr/bin/env node
// One-off backfill: bring already-shipped assets down to the contract sizes
// introduced on 2026-08-02 (hero 2400 -> 1440, card 1200 -> 800; og unchanged).
//
//   node scripts/art/resize-shipped.mjs [--dry]
//
// WHY THIS IS A SEPARATE SCRIPT AND NOT `normalize.mjs`: normalize needs the
// PNG master, and masters are gitignored — they live on whichever machine
// generated them, not in the repo. So the only universally available source
// for already-published art is the shipped WebP itself. That means this is a
// re-encode of already-lossy data rather than a clean re-derive.
//
// That tradeoff is acceptable here and nowhere else:
//   - the resize is a downscale, which hides recompression artifacts rather
//     than compounding them (verified by A/B at render size before shipping)
//   - grain is NOT re-applied; these assets already carry grain baked at
//     2400, which the downscale softens slightly. Re-adding would double it.
//     Backfilled art therefore sits a touch under the 2% spec; newly
//     generated art gets it right. Correcting the old set properly would mean
//     regenerating, which costs money and changes the pictures.
//
// Anything generated from here on goes through normalize.mjs and never needs
// this script. Delete it once the backfill is merged.
import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadStyle } from './lib/style.mjs';

const dry = process.argv.includes('--dry');
const style = loadStyle();
const q = style.export?.quality ?? 82;
const TARGET = {
  hero: [style.placements.hero.width, style.placements.hero.height],
  card: [style.placements.card.width, style.placements.card.height],
  og: [style.placements.og.width, style.placements.og.height],
};

const base = join(process.cwd(), 'public', 'blog-art');
let before = 0, after = 0, touched = 0, skipped = 0;

for (const slug of readdirSync(base)) {
  const dir = join(base, slug);
  if (!statSync(dir).isDirectory()) continue;

  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.webp')) continue;
    const placement = Object.keys(TARGET).find((p) => file.includes(`-${p}-`));
    if (!placement) continue;

    const path = join(dir, file);
    const [w, h] = TARGET[placement];
    const meta = await sharp(path).metadata();
    const size = statSync(path).size;
    before += size;

    // Already at or below target — leave it completely alone. Re-encoding a
    // correctly-sized asset would only add generation loss for no bytes.
    if (meta.width <= w) {
      after += size;
      skipped++;
      continue;
    }

    const buf = await sharp(path)
      .resize(w, h, { kernel: 'lanczos3', fit: 'cover' })
      .webp({ quality: q, effort: 6 })
      .toBuffer();

    after += buf.length;
    touched++;
    const pct = (100 - (100 * buf.length) / size).toFixed(0);
    console.log(
      `${dry ? 'would ' : ''}${placement.padEnd(4)} ${meta.width}->${w}  ` +
      `${String(Math.round(size / 1024)).padStart(4)}KB -> ${String(Math.round(buf.length / 1024)).padStart(3)}KB  ` +
      `(-${pct}%)  ${slug}`
    );
    if (!dry) writeFileSync(path, buf);
  }

  // Keep the provenance sidecar honest about what actually shipped.
  if (!dry) {
    for (const file of readdirSync(dir)) {
      if (!file.endsWith('.json')) continue;
      const p = join(dir, file);
      if (!existsSync(p)) continue;
      const j = JSON.parse(readFileSync(p, 'utf8'));
      j.shipped = { hero: TARGET.hero, card: TARGET.card, og: TARGET.og };
      j.resizedAt = new Date().toISOString();
      j.resizeNote =
        'Backfilled to contract sizes by scripts/art/resize-shipped.mjs — re-encoded from the shipped WebP (masters are gitignored), grain not re-applied.';
      writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
    }
  }
}

const K = (n) => `${(n / 1024 / 1024).toFixed(2)}MB`;
console.log(
  `\n${dry ? '[dry run] ' : ''}${touched} resized, ${skipped} already correct` +
  `\n${K(before)} -> ${K(after)}  (-${(100 - (100 * after) / before).toFixed(0)}%)`
);

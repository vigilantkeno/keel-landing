#!/usr/bin/env node
// Compose candidate pairs into tall review strips (N posts per strip,
// candidates side by side, slug-labelled rows) for fast visual review.
//   node scripts/art/review-strips.mjs content/art/briefs/<file>.json
import sharp from 'sharp';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const briefs = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const root = join(process.cwd(), 'content', 'art', 'candidates');
const TW = 560, TH = 315, PAD = 10, LABEL = 34, PER_STRIP = 7;

const rows = [];
for (const b of briefs) {
  const dir = join(root, b.slug);
  if (!existsSync(dir)) continue;
  const pngs = readdirSync(dir).filter((f) => f.endsWith('.png')).sort().slice(0, 2);
  if (pngs.length) rows.push({ slug: b.slug, family: b.family, dir, pngs });
}

let strip = 0;
for (let s = 0; s < rows.length; s += PER_STRIP) {
  const chunk = rows.slice(s, s + PER_STRIP);
  const W = PAD + 2 * (TW + PAD);
  const H = chunk.length * (TH + LABEL + PAD) + PAD;
  const tiles = [];
  for (const [r, row] of chunk.entries()) {
    const top = PAD + r * (TH + LABEL + PAD);
    const svg = `<svg width="${W}" height="${LABEL}"><text x="6" y="24" font-family="monospace" font-size="19" fill="#EDE7DC">${row.slug} (${row.family}) — 1 | 2</text></svg>`;
    tiles.push({ input: Buffer.from(svg), left: 0, top });
    for (const [i, f] of row.pngs.entries()) {
      tiles.push({
        input: await sharp(join(row.dir, f)).resize(TW, TH, { fit: 'cover' }).png().toBuffer(),
        left: PAD + i * (TW + PAD),
        top: top + LABEL,
      });
    }
  }
  strip++;
  const out = join(root, `review-strip-${strip}.webp`);
  await sharp({ create: { width: W, height: H, channels: 3, background: '#0B0B0B' } })
    .composite(tiles).webp({ quality: 82 }).toFile(out);
  console.log(`review-strip-${strip}.webp (${chunk.length} posts)`);
}

#!/usr/bin/env node
// Build a winners map from candidate directories without a human in the
// loop — used by CI, where the default is candidate 1 and the human gate
// moves to the PR itself (both candidates visible, `/art swap <slug>`
// to prefer the other).
//
//   node scripts/art/auto-winners.mjs <briefs.json> <out.json> [--pick 2] [--slug <slug>]
//
// With --slug, only that slug is (re)written into the map at --pick.
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const briefs = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const out = process.argv[3];
const pickIdx = process.argv.indexOf('--pick');
const pick = pickIdx > -1 ? parseInt(process.argv[pickIdx + 1], 10) : 1;
const slugIdx = process.argv.indexOf('--slug');
const only = slugIdx > -1 ? process.argv[slugIdx + 1] : null;

const winners = existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : {};
for (const b of briefs) {
  if (only && b.slug !== only) continue;
  const dir = join('content', 'art', 'candidates', b.slug);
  const pngs = readdirSync(dir).filter((f) => f.endsWith('.png')).sort();
  if (pngs.length < pick) {
    console.error(`${b.slug}: only ${pngs.length} candidate(s), cannot pick #${pick}`);
    process.exit(1);
  }
  winners[b.slug] = pngs[pick - 1];
}
writeFileSync(out, JSON.stringify(winners, null, 2) + '\n');
console.log(`winners: ${Object.entries(winners).map(([s, f]) => `${s} -> ${f}`).join(', ')}`);

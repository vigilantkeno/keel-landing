#!/usr/bin/env node
// Concept-router lint (contract v1.1) — deterministic pre-generation gate.
// Judgment happens once, at brief-writing; this enforces it mechanically.
// batch-generate.mjs refuses briefs files that fail this lint.
//
//   node scripts/art/lint-briefs.mjs <briefs.json>
//
// Checks per contract v1.1 (style.json .v11):
//   - required brief fields present, family/aperture/signature from vocab
//   - aperture-subtype quotas (scaled to batch size; warn under 10 briefs)
//   - no consecutive same aperture subtype (within file, in order)
//   - no composition signature reused within a 4-brief window
//   - noir cap: path_to_threshold + solo figure ≤ 1-in-5 (rounded up)
//   - orangeRole mix: destination ≤ 1-in-5 (rounded up)
//   - literalnessRisk/thumbnailRisk must be declared; "high" fails
import { readFileSync } from 'node:fs';
import { loadStyle } from './lib/style.mjs';

const briefs = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const v11 = loadStyle().v11;
const errs = [], warns = [];

const APERTURES = Object.keys(v11.apertureQuotasPer20);
const SIGS = v11.compositionSignatures;

briefs.forEach((b, i) => {
  const w = b.slug ?? `#${i}`;
  for (const f of v11.briefFields) {
    if (b[f] === undefined || b[f] === '') errs.push(`${w}: missing brief field "${f}"`);
  }
  if (b.apertureType && !APERTURES.includes(b.apertureType)) errs.push(`${w}: apertureType "${b.apertureType}" not in ${APERTURES.join('|')}`);
  if (b.compositionSignature && !SIGS.includes(b.compositionSignature)) errs.push(`${w}: compositionSignature "${b.compositionSignature}" not in vocabulary`);
  if (!['possession', 'destination'].includes(b.orangeRole)) errs.push(`${w}: orangeRole must be possession|destination`);
  for (const f of ['literalnessRisk', 'thumbnailRisk']) {
    if (b[f] === 'high') errs.push(`${w}: ${f} is "high" — re-concept before generating`);
  }
  if (i > 0 && briefs[i - 1].apertureType === b.apertureType) {
    errs.push(`${w}: same aperture subtype "${b.apertureType}" as previous brief — vary it`);
  }
  const window4 = briefs.slice(Math.max(0, i - 4), i);
  if (window4.some((p) => p.compositionSignature === b.compositionSignature)) {
    errs.push(`${w}: compositionSignature "${b.compositionSignature}" reused within a 4-brief window`);
  }
});

// quotas, scaled to batch size
const scale = briefs.length / 20;
const counts = {};
for (const b of briefs) counts[b.apertureType] = (counts[b.apertureType] ?? 0) + 1;
for (const [type, per20] of Object.entries(v11.apertureQuotasPer20)) {
  const cap = Math.ceil(per20 * scale);
  if ((counts[type] ?? 0) > cap) {
    const msg = `aperture quota: ${counts[type]}× "${type}" exceeds scaled cap ${cap} for a ${briefs.length}-brief batch`;
    (briefs.length < 10 ? warns : errs).push(msg);
  }
}

// noir + destination caps (1-in-5, rounded up)
const cap5 = Math.ceil(briefs.length / 5);
const noir = briefs.filter((b) => b.compositionSignature === 'path_to_threshold' && /\bsilhouette/i.test(b.slots ?? '')).length;
if (noir > cap5) errs.push(`noir cap: ${noir}× path_to_threshold-with-silhouette exceeds ${cap5} (1-in-5)`);
const dest = briefs.filter((b) => b.orangeRole === 'destination').length;
if (dest > cap5) errs.push(`orange-as-destination: ${dest} exceeds ${cap5} (1-in-5) — ember should mostly mark possession/control`);

for (const w of warns) console.warn(`⚠ ${w}`);
if (errs.length) {
  for (const e of errs) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log(`✓ lint-briefs: ${briefs.length} brief(s) pass contract v1.1${warns.length ? ` (${warns.length} warning)` : ''}`);

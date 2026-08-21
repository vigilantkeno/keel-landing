#!/usr/bin/env node
// Concept-router lint (contract v1.1 + v1.2) — deterministic pre-generation
// gate. Judgment happens once, at brief-writing; this enforces it
// mechanically. batch-generate.mjs refuses briefs files that fail this lint.
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
// Checks per contract v1.2 (style.json .v12):
//   - figurePresentation required on every brief ("none" when no figure)
//   - "mixed"/"none" are exempt from the repeat/balance checks below;
//     "feminine-presenting"/"masculine-presenting" describe what's in
//     frame (solo OR a uniform pair/group), not "this is one person"
//   - no consecutive repeat of the same presentation
//   - rolling balance warning over the trailing N counted images
import { readFileSync } from 'node:fs';
import { loadStyle } from './lib/style.mjs';

const briefs = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const ctxIdx = process.argv.indexOf('--context');
const context = ctxIdx > -1 ? JSON.parse(readFileSync(process.argv[ctxIdx + 1], 'utf8')) : [];
const style = loadStyle();
const v11 = style.v11;
const v12 = style.v12 ?? { figurePresentationValues: [], extraBriefFields: [], rollingBalanceWindow: 8, rollingBalanceMax: 6 };
const errs = [], warns = [];

const APERTURES = Object.keys(v11.apertureQuotasPer20);
const SIGS = v11.compositionSignatures;
const REQUIRED_FIELDS = [...v11.briefFields, ...v12.extraBriefFields];
const COUNTABLE_PRESENTATIONS = ['feminine-presenting', 'masculine-presenting'];

briefs.forEach((b, i) => {
  const w = b.slug ?? `#${i}`;
  for (const f of REQUIRED_FIELDS) {
    if (b[f] === undefined || b[f] === '') errs.push(`${w}: missing brief field "${f}"`);
  }
  if (b.apertureType && !APERTURES.includes(b.apertureType)) errs.push(`${w}: apertureType "${b.apertureType}" not in ${APERTURES.join('|')}`);
  if (b.compositionSignature && !SIGS.includes(b.compositionSignature)) errs.push(`${w}: compositionSignature "${b.compositionSignature}" not in vocabulary`);
  if (!['possession', 'destination'].includes(b.orangeRole)) errs.push(`${w}: orangeRole must be possession|destination`);
  for (const f of ['literalnessRisk', 'thumbnailRisk']) {
    if (b[f] === 'high') errs.push(`${w}: ${f} is "high" — re-concept before generating`);
  }
  if (b.figurePresentation && !v12.figurePresentationValues.includes(b.figurePresentation)) {
    errs.push(`${w}: figurePresentation "${b.figurePresentation}" not in ${v12.figurePresentationValues.join('|')}`);
  }
  // history = recently published art (via --context) + earlier briefs in file
  const history = [...context, ...briefs.slice(0, i)];
  const prev = history.at(-1);
  if (prev && prev.apertureType === b.apertureType) {
    errs.push(`${w}: same aperture subtype "${b.apertureType}" as the previous published/queued image — vary it`);
  }
  if (history.slice(-4).some((p) => p.compositionSignature === b.compositionSignature)) {
    errs.push(`${w}: compositionSignature "${b.compositionSignature}" reused within the last 4 published/queued images`);
  }
  // figure-presentation parity (v1.2): find the most recent image whose
  // presentation is countable (skipping "none"/"mixed" entries, which sit
  // outside the balance check), then apply the same no-immediate-repeat
  // rule aperture subtypes already get.
  const countedHistory = history.filter((p) => COUNTABLE_PRESENTATIONS.includes(p.figurePresentation));
  const prevCounted = countedHistory.at(-1);
  if (prevCounted && COUNTABLE_PRESENTATIONS.includes(b.figurePresentation) && prevCounted.figurePresentation === b.figurePresentation) {
    errs.push(`${w}: figurePresentation "${b.figurePresentation}" repeats the previous figure-bearing image — vary it`);
  }
  const recentCounted = [...countedHistory, ...(COUNTABLE_PRESENTATIONS.includes(b.figurePresentation) ? [b] : [])].slice(-v12.rollingBalanceWindow);
  if (recentCounted.length >= 6) {
    const feminine = recentCounted.filter((p) => p.figurePresentation === 'feminine-presenting').length;
    const masculine = recentCounted.length - feminine;
    if (Math.max(feminine, masculine) > v12.rollingBalanceMax) {
      warns.push(`${w}: figure presentation skewed ${feminine}f/${masculine}m over the last ${recentCounted.length} images — balance it`);
    }
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
console.log(`✓ lint-briefs: ${briefs.length} brief(s) pass contract v1.1/v1.2${warns.length ? ` (${warns.length} warning)` : ''}`);

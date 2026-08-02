#!/usr/bin/env node
// Mobile-rhythm gate (contract §4b, founder decision 2026-08-02).
// The corpus had drifted to a uniform 3-sentence paragraph register
// (mean 2.98 s/para, 63% of paragraphs ≥3 sentences) — a 6-9 line wall
// on a phone. Research basis: NN/g F-pattern scanning (+~47%
// comprehension from simplified text), Axios Smart Brevity (~26s median
// article attention; paragraphs rarely pass two sentences), mobile line
// length 30-50 chars.
//
// FAIL (build-breaking):
//   - any paragraph > 4 sentences or > 90 words
//   - post mean sentences/paragraph > 2.5
//   - share of paragraphs with ≥3 sentences > 45%
// WARN (targets, human-reviewed):
//   - mean > 2.2 · ≥3-share > 35% · median words > 42 ·
//     single-sentence share < 15%
//
// GRANDFATHERING: posts dated on/before 2026-08-02 predate the rule and
// are exempt (reported, never failed). No allowlist to maintain — the
// cutoff is the date already in frontmatter.
import { getAllPosts } from '../../lib/posts.js';

const CUTOFF = '2026-08-02';

function paragraphs(content) {
  const body = content
    .replace(/^#+ .*$/gm, '')          // headings
    .replace(/^\*By the team.*$/gm, '') // footer line
    .replace(/^> ?.*$/gm, '');          // blockquotes
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim().replace(/\s+/g, ' '))
    .filter((p) => p.length > 40 && !p.startsWith('|') && !p.startsWith('-'));
}

function stats(content) {
  const paras = paragraphs(content).map((p) => ({
    sentences: p.split(/(?<=[.!?])\s+/).filter((s) => s.length > 5).length,
    words: p.split(' ').length,
    text: p,
  }));
  const n = paras.length || 1;
  return {
    paras,
    mean: paras.reduce((a, p) => a + p.sentences, 0) / n,
    share3: paras.filter((p) => p.sentences >= 3).length / n,
    share1: paras.filter((p) => p.sentences === 1).length / n,
    medianWords: [...paras.map((p) => p.words)].sort((a, b) => a - b)[Math.floor(n / 2)] ?? 0,
  };
}

const errors = [];
const warns = [];
let checked = 0;
let legacy = 0;

for (const post of getAllPosts()) {
  const dated = String(post.date).slice(0, 10);
  const s = stats(post.content ?? '');
  const where = post.slug ?? post.dir;
  const isLegacy = dated <= CUTOFF;
  const out = isLegacy ? warns : errors;
  if (isLegacy) legacy++; else checked++;

  for (const p of s.paras) {
    if (p.sentences > 4) out.push(`${where}: paragraph with ${p.sentences} sentences (max 4): "${p.text.slice(0, 70)}…"`);
    if (p.words > 90) out.push(`${where}: ${p.words}-word paragraph (max 90): "${p.text.slice(0, 70)}…"`);
  }
  if (s.mean > 2.5) out.push(`${where}: mean ${s.mean.toFixed(2)} sentences/paragraph (max 2.5)`);
  if (s.share3 > 0.45) out.push(`${where}: ${Math.round(s.share3 * 100)}% of paragraphs have ≥3 sentences (max 45%)`);

  if (!isLegacy) {
    if (s.mean > 2.2) warns.push(`${where}: mean ${s.mean.toFixed(2)} s/para above the 2.2 target`);
    if (s.share3 > 0.35) warns.push(`${where}: ≥3-sentence share ${Math.round(s.share3 * 100)}% above the 35% target`);
    if (s.medianWords > 42) warns.push(`${where}: median paragraph ${s.medianWords} words above the 42 target`);
    if (s.share1 < 0.15) warns.push(`${where}: only ${Math.round(s.share1 * 100)}% single-sentence paragraphs (target ≥15% — use them like a closer uses silence)`);
  }
}

for (const w of warns) console.warn(`⚠ ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  console.error(`\n${errors.length} rhythm violation(s). Contract §4b: split the paragraph — don't soften the rule.`);
  process.exit(1);
}
console.log(`✓ rhythm: ${checked} post(s) pass §4b (${legacy} grandfathered pre-${CUTOFF}${warns.length ? `, ${warns.length} warning(s)` : ''})`);

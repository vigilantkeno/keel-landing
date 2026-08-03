#!/usr/bin/env node
// Citation gate (contract §3). Until now §3 was honour-system: "no numeric
// claim without a live link" was a rule the generator was asked to follow and
// nothing checked. Everything else that matters here is a build failure, so
// this is too.
//
// WHAT THIS DELIBERATELY DOES NOT DO: flag every number. The corpus is full
// of illustrative figures inside narrative — "talk ratio was 68%", "the 60%
// you happen to remember" — which are scene-setting, not evidence, and
// citing them would be nonsense. Failing those would teach the writer to
// strip specifics, which is the opposite of contract §4a.
//
// What it flags is a number wearing the costume of external evidence: a
// statistic attributed to research, a survey, a report, or a population
// ("40% of enterprises"). Those are the ones that must carry a link, and
// they are the ones that quietly become liabilities when they don't.
//
// FAIL   evidence-shaped claim in a paragraph with no external link
// REPORT posts with zero external citations (§3 wants 1-2, but the
//        scheduled run is egress-blocked and writes argument pieces that
//        legitimately need none — this is a worklist, not a verdict)
//
// GRANDFATHERING: posts dated on or before the cutoff predate the gate and
// are reported, never failed — same mechanism as the rhythm gate, same
// reason. The cutoff is the date already in frontmatter; no allowlist.
import { getAllPosts } from '../../lib/posts.js';

const CUTOFF = '2026-08-03';

// Attribution language: the claim is being sourced to someone.
const ATTRIBUTION = /\b(research (?:shows?|finds?|found|suggests?)|(?:a |the )?stud(?:y|ies) (?:show|shows|found|finds?|of)|according to|(?:a |the )?survey(?:ed|s)? |data from|report(?:s|ed) that|found that|analysis (?:of|found)|researchers?|experiment(?:s)? (?:show|found)|per [A-Z])/i;

// A percentage or magnitude attached to a population rather than a person in
// a story. "40% of enterprises" is evidence; "68% talk ratio" is a scene.
const POPULATION_STAT = /\b\d{1,3}(?:\.\d+)?%\s+of\s+(?:all\s+)?(?:enterprises|companies|organi[sz]ations|businesses|workers|employees|reps|sales\s?(?:reps|people|teams)|managers|buyers|customers|firms|respondents|deals|teams|people)\b/i;

// Forward-looking percentages ("…will hit 40% by 2030") are always someone
// else's forecast — nobody writes those from their own observation.
//
// Bare dollar magnitudes are deliberately NOT here. The first version caught
// "$50K or $5M", which is a deal-size scene, not a market-size claim, and
// failing it would have taught the writer to drop the concrete number — the
// precise instinct §4a is trying to build. Sourced dollar figures still get
// caught below, via their attribution.
const PROJECTION = /\b(?:by|in|through)\s+20[2-9]\d\b[^.]{0,90}?\d{1,3}(?:\.\d+)?%|\d{1,3}(?:\.\d+)?%[^.]{0,90}?\bby\s+20[2-9]\d\b/i;

const EXTERNAL_LINK = /\]\(https?:\/\/(?!(?:www\.)?getkeel\.io)[^)]+\)/;

function paragraphs(content) {
  return content
    .replace(/^#+ .*$/gm, '')
    .replace(/^\*By the team.*$/gm, '')
    .split(/\n\s*\n/)
    .map((p) => p.trim().replace(/\s+/g, ' '))
    .filter((p) => p.length > 40);
}

/** Why this paragraph looks like sourced evidence, or null if it doesn't. */
function evidenceReason(p) {
  if (POPULATION_STAT.test(p)) return 'population statistic';
  if (PROJECTION.test(p)) return 'projection / magnitude figure';
  // Attribution alone only counts when a figure rides along with it —
  // "research shows reps hate being recorded" is an argument, not a datum.
  if (ATTRIBUTION.test(p) && /\d/.test(p)) return 'figure attributed to a source';
  return null;
}

const errors = [];
const warns = [];
const debt = [];
let checked = 0;
let legacy = 0;

for (const post of getAllPosts()) {
  if (post.status !== 'published') continue;
  const date = String(post.date).slice(0, 10);
  const grandfathered = date <= CUTOFF;
  grandfathered ? legacy++ : checked++;

  const paras = paragraphs(post.content);
  const externalLinks = (post.content.match(/\]\(https?:\/\/[^)]+\)/g) ?? [])
    .filter((l) => !/getkeel\.io/.test(l));

  for (const p of paras) {
    const reason = evidenceReason(p);
    if (!reason) continue;
    if (EXTERNAL_LINK.test(p)) continue;
    const excerpt = p.length > 140 ? `${p.slice(0, 140)}…` : p;
    const msg = `${post.dir}: uncited ${reason} — "${excerpt}"`;
    (grandfathered ? warns : errors).push(msg);
  }

  if (externalLinks.length === 0) {
    debt.push(`${post.dir} (${date}, ${post.cluster ?? 'no cluster'})`);
  }
}

for (const w of warns) console.log(`⚠ ${w}\n`);

if (debt.length) {
  console.log(
    `\n— citation debt: ${debt.length} published post(s) carry no external source.\n` +
    `  §3 wants 1-2 per article. Scheduled runs are egress-blocked and write\n` +
    `  argument pieces that need none, so this is a worklist for the supervised\n` +
    `  pass (npm run content:cite), not a failure:\n`
  );
  for (const d of debt) console.log(`    ${d}`);
  console.log('');
}

if (errors.length) {
  console.error(`\n✗ citations: ${errors.length} uncited evidence claim(s)\n`);
  for (const e of errors) console.error(`  ${e}\n`);
  console.error('  Every figure presented as external evidence needs a live link');
  console.error('  beside it (contract §3), or it gets cut. Not softened — cut.\n');
  process.exit(1);
}

console.log(
  `✓ citations: ${checked} post(s) checked against §3` +
  (checked === 0 ? ' (none yet — every published post predates the gate)' : '') +
  ` · ${legacy} grandfathered on/before ${CUTOFF}` +
  ` · ${warns.length} warning(s) · ${debt.length} awaiting a source`
);

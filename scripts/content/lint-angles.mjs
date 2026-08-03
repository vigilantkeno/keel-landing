#!/usr/bin/env node
// Editorial-ambition lint (contract v1.4): validates angle records
// (content/keywords/angles/*.json) and editorial-memory records
// (content/editorial-memory/*.json). Presence and structure are
// mechanical; quality stays a curation/review judgment — exactly the
// boundary the reviewer and the architecture agree on.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const TIERS = ['coverage', 'reference', 'flagship'];
const ARCHETYPES = ['story-driven', 'practical-guide', 'contrarian-essay', 'framework-driven', 'comparison', 'problem-deep-dive'];
const PLACEHOLDER = /\b(tbd|todo|tk|lorem|xxx|fixme|placeholder)\b/i;

const errors = [];
const warns = [];
const norm = (s) => String(s ?? '').toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

// --- angle records ------------------------------------------------------
const anglesDir = join(process.cwd(), 'content', 'keywords', 'angles');
let angleCount = 0;
if (existsSync(anglesDir)) {
  for (const f of readdirSync(anglesDir).filter((x) => x.endsWith('.json'))) {
    angleCount++;
    const where = `angles/${f}`;
    let a;
    try { a = JSON.parse(readFileSync(join(anglesDir, f), 'utf8')); }
    catch (e) { errors.push(`${where}: invalid JSON — ${e.message}`); continue; }

    if (!a.keyword) errors.push(`${where}: missing keyword`);
    if (!TIERS.includes(a.tier)) errors.push(`${where}: tier must be one of ${TIERS.join('|')}`);
    if (!ARCHETYPES.includes(a.archetype)) errors.push(`${where}: archetype must be one of ${ARCHETYPES.join('|')}`);

    const u = a.uniqueAngle ?? {};
    for (const k of ['existingConsensus', 'keelClaim', 'supportingReason']) {
      if (!u[k] || !String(u[k]).trim()) errors.push(`${where}: uniqueAngle.${k} is required`);
      else if (PLACEHOLDER.test(u[k])) errors.push(`${where}: uniqueAngle.${k} contains placeholder language`);
    }
    const [c, k, r] = [norm(u.existingConsensus), norm(u.keelClaim), norm(u.supportingReason)];
    if (c && (c === k || c === r || k === r)) errors.push(`${where}: uniqueAngle fields are identical/trivial restatements`);
    if (k && /\b(sara|keel)\b/.test(k)) warns.push(`${where}: keelClaim mentions the product — a thesis should stand without it ("because of our product" is not an angle)`);

    // null-vs-missing (reviewer clarification #2): the KEY must exist so a
    // deliberate "no asset" is distinguishable from a forgotten field.
    for (const k2 of ['originalAsset', 'beliefShift']) {
      if (!(k2 in a)) errors.push(`${where}: "${k2}" key must be present (use null for a deliberate none at coverage tier)`);
    }
    if (a.tier !== 'coverage') {
      if (a.originalAsset == null) errors.push(`${where}: tier "${a.tier}" requires a non-null originalAsset`);
      if (a.beliefShift == null) errors.push(`${where}: tier "${a.tier}" requires a non-null beliefShift`);
    }
    if (a.archetypeOverrideReason !== undefined && !String(a.archetypeOverrideReason).trim()) {
      errors.push(`${where}: archetypeOverrideReason present but empty`);
    }
  }
}

// --- editorial memory ---------------------------------------------------
const memDir = join(process.cwd(), 'content', 'editorial-memory');
let memCount = 0, candidates = 0;
if (existsSync(memDir)) {
  for (const f of readdirSync(memDir).filter((x) => x.endsWith('.json'))) {
    memCount++;
    const where = `editorial-memory/${f}`;
    let m;
    try { m = JSON.parse(readFileSync(join(memDir, f), 'utf8')); }
    catch (e) { errors.push(`${where}: invalid JSON — ${e.message}`); continue; }
    if (!['candidate', 'accepted'].includes(m.status)) errors.push(`${where}: status must be candidate|accepted`);
    if (m.status === 'candidate') candidates++;
    for (const k of ['concept', 'introducedIn', 'canonicalExplanation']) {
      if (!m[k] || !String(m[k]).trim()) errors.push(`${where}: missing ${k}`);
    }
    if (!Array.isArray(m.reuseWhen) || !m.reuseWhen.length) errors.push(`${where}: reuseWhen must be a non-empty array`);
    if (m.status === 'accepted' && !m.ratified) errors.push(`${where}: accepted records must carry a "ratified" provenance line`);
  }
}

for (const w of warns) console.warn(`⚠ ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log(`✓ angles: ${angleCount} record(s) valid · editorial-memory: ${memCount} record(s)${candidates ? ` (${candidates} candidate awaiting founder ratification)` : ''}${warns.length ? ` · ${warns.length} warning(s)` : ''}`);

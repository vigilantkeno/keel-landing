#!/usr/bin/env node
// Mechanical banned-claims check. Runs in CI on every content PR.
//
// Why this exists as a grep and not just a prompt instruction: prompt-level
// avoidance is the first line of defence, but prompts drift between model
// versions and a model under revision pressure will happily reintroduce a
// claim it was told to avoid. This file does not drift.
//
// Scope: every post's body AND its frontmatter strings (a banned claim in a
// meta description is just as published as one in the body).
//
// Exit 1 on any match. Published posts and drafts are both checked — catching
// it at draft time is the point.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAllPosts } from '../../lib/posts.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIST = join(HERE, 'banned-claims.txt');

function loadPatterns() {
  if (!existsSync(LIST)) {
    console.error(`✗ banned-claims.txt not found at ${LIST}`);
    process.exit(1);
  }
  return readFileSync(LIST, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((src) => {
      try {
        return { src, rx: new RegExp(src, 'gi') };
      } catch (e) {
        console.error(`✗ banned-claims.txt: "${src}" is not a valid regex — ${e.message}`);
        process.exit(1);
      }
    });
}

// Contrast copy is core to Keel's positioning ("no meeting bot", "Sara never
// records", "unlike CRM connectors"). A checker that bans the words outright
// makes the product's own differentiation unwritable, so a match preceded by
// a negation marker is downgraded from failure to a warning a human reads —
// suppressed, never silently passed.
const NEGATION = /\b(no|not|never|without|unlike|isn'?t|aren'?t|doesn'?t|don'?t|won'?t|cannot|can'?t|nothing|neither|nor|instead of|rather than|zero)\b[^.]{0,60}$/i;

function isNegated(line, matchIndex) {
  return NEGATION.test(line.slice(Math.max(0, matchIndex - 80), matchIndex));
}

const patterns = loadPatterns();
const posts = getAllPosts();
let violations = 0;
const warnings = [];

for (const post of posts) {
  // Frontmatter strings are published surface too.
  const meta = [post.title, post.description, ...(post.secondaryKeywords ?? []),
    ...(post.faq ?? []).flatMap((f) => [f.question, f.answer])].filter(Boolean).join('\n');
  const haystacks = [['body', post.content ?? ''], ['frontmatter', meta]];

  for (const [where, text] of haystacks) {
    const lines = text.split('\n');
    for (const { src, rx } of patterns) {
      lines.forEach((line, i) => {
        rx.lastIndex = 0;
        const m = rx.exec(line);
        if (!m) return;
        const loc = `${post.dir}/index.mdx (${where}${where === 'body' ? `, line ~${i + 1}` : ''})`;
        if (isNegated(line, m.index)) {
          warnings.push(`⚠ ${loc}\n    "${m[0].trim()}" appears in negated/contrast form — allowed, but confirm it reads as a contrast and not a claim.\n    context: …${line.slice(Math.max(0, m.index - 60), m.index + m[0].length + 20).trim()}…`);
          return;
        }
        violations++;
        console.error(
          `✗ ${loc}\n` +
          `    matched banned claim: "${m[0].trim()}"\n` +
          `    pattern: ${src}\n` +
          `    Keel does not do this. Fix the copy — do not weaken the pattern.\n`
        );
      });
    }
  }
}

for (const w of warnings) console.warn(`${w}\n`);

if (violations) {
  console.error(`\n${violations} banned-claim violation(s) across ${posts.length} post(s). See content/keywords/seeds.md for the rationale.`);
  process.exit(1);
}
console.log(
  `✓ banned-claims: ${posts.length} post(s) clean against ${patterns.length} pattern(s)` +
  (warnings.length ? ` — ${warnings.length} negated mention(s) surfaced above for human confirmation` : '')
);

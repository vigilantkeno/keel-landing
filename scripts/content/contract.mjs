#!/usr/bin/env node
// Regenerates the internal-link allowlist (§1) inside
// content/keywords/package-contract.md between the ALLOWLIST markers, from
// the actual published post set — so "publisher updates §1 on every publish"
// is one command, not hand-editing. Run: npm run content:contract
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getAllPosts } from '../../lib/posts.js';

const CONTRACT = join(process.cwd(), 'content', 'keywords', 'package-contract.md');
const published = getAllPosts().filter((p) => p.status === 'published' && p.claimsReviewed === true);

const rows = [
  ['`/`', 'Home (Apply flow)'],
  ['`/blog`', 'Blog index'],
  ['`/founders`', 'CTA target — temporary redirect to `/` until the real page ships'],
  ...published.map((p) => [`\`/blog/${p.slug}\``, p.title + (p.pillar ? ' (pillar)' : '')]),
];
const today = new Date().toISOString().slice(0, 10);
const table = [
  `**Live as of ${today}** (regenerate: \`npm run content:contract\`):`,
  '',
  '| Path | Piece |',
  '|---|---|',
  ...rows.map(([a, b]) => `| ${a} | ${b} |`),
].join('\n');

let s = readFileSync(CONTRACT, 'utf8');
const re = /<!-- ALLOWLIST:BEGIN -->[\s\S]*?<!-- ALLOWLIST:END -->/;
if (!re.test(s)) { console.error('✗ ALLOWLIST markers not found in package-contract.md'); process.exit(1); }
s = s.replace(re, `<!-- ALLOWLIST:BEGIN -->\n${table}\n<!-- ALLOWLIST:END -->`);
writeFileSync(CONTRACT, s);
console.log(`✓ contract §1 regenerated — ${rows.length} allowed paths`);

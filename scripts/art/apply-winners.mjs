#!/usr/bin/env node
// Apply selected winners: normalize each into shipping assets, then write
// the art frontmatter (artFamily/artBrief/heroImage/heroAlt) into the post.
//   node scripts/art/apply-winners.mjs <briefs.json> <winners.json>
// winners.json: { "<slug>": "<candidate-file.png>", ... }
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const briefs = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const winners = JSON.parse(readFileSync(process.argv[3], 'utf8'));
const postsDir = join(process.cwd(), 'content', 'blog', 'posts');
const postDirs = readdirSync(postsDir);

const yq = (s) => JSON.stringify(String(s)); // YAML-safe double-quoted scalar

for (const b of briefs) {
  const winner = winners[b.slug];
  if (!winner) { console.log(`skip ${b.slug}: no winner selected`); continue; }
  const candidate = join('content', 'art', 'candidates', b.slug, winner);
  const id = winner.replace(/\.png$/, '').split('-').pop();

  execFileSync('node', ['scripts/art/normalize.mjs', '--in', candidate, '--slug', b.slug, '--family', b.family], { stdio: 'inherit' });

  const dir = postDirs.find((d) => {
    const fm = readFileSync(join(postsDir, d, 'index.mdx'), 'utf8');
    return new RegExp(`^slug: "${b.slug}"$`, 'm').test(fm);
  });
  if (!dir) { console.error(`no post found for slug ${b.slug}`); process.exit(1); }

  const file = join(postsDir, dir, 'index.mdx');
  const src = readFileSync(file, 'utf8');
  if (/^heroImage:/m.test(src)) { console.log(`skip frontmatter ${b.slug}: heroImage already set`); continue; }
  const heroPath = `/blog-art/${b.slug}/keel-${b.family}-${b.slug}-hero-${id}.webp`;
  const block = [
    `artFamily: ${yq(b.family)}`,
    `artBrief: ${yq(b.slots)}`,
    `heroImage: ${yq(heroPath)}`,
    `heroAlt: ${yq(b.alt)}`,
  ].join('\n');
  // insert after the `pillar:` line — present on every post
  const next = src.replace(/^(pillar: (?:true|false))$/m, `$1\n${block}`);
  if (next === src) { console.error(`could not find pillar line in ${file}`); process.exit(1); }
  writeFileSync(file, next);
  console.log(`frontmatter written: ${b.slug} -> ${heroPath}`);
}

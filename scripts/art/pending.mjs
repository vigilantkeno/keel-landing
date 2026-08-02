#!/usr/bin/env node
// Collect art briefs from published posts that declare a router record
// (written at article-time by the routine, or at import time) but have no
// heroImage yet. Emits content/art/briefs/pending.json for the standard
// batch-generate -> review -> apply-winners flow, and lints it against
// the variety history of recently published art.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import matter from 'gray-matter';

const postsDir = join(process.cwd(), 'content', 'blog', 'posts');
const ledger = JSON.parse(readFileSync(join(process.cwd(), 'content', 'keywords', 'date-ledger.json'), 'utf8'));
const order = Object.keys(ledger);

const posts = readdirSync(postsDir).map((dir) => {
  const { data } = matter(readFileSync(join(postsDir, dir, 'index.mdx'), 'utf8'));
  return data;
});

// variety context: the most recent published posts that carry a signature
const withArt = posts
  .filter((p) => p.artSignature && p.heroImage)
  .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
const context = withArt.slice(-4).map((p) => ({
  slug: p.slug,
  apertureType: p.artAperture,
  compositionSignature: p.artSignature,
}));

// pending: router record present, heroImage absent, published only
const pending = posts
  .filter((p) => p.status === 'published' && p.artBrief && !p.heroImage)
  .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug))
  .map((p) => ({
    slug: p.slug,
    family: p.artFamily,
    alt: p.heroAlt,
    slots: p.artBrief,
    conceptualTension: p.artTension,
    apertureType: p.artAperture,
    compositionSignature: p.artSignature,
    orangeRole: p.artOrangeRole,
    literalnessRisk: p.artLiteralness ?? 'low',
    thumbnailRisk: p.artThumbnail ?? 'low',
  }));

if (!pending.length) {
  console.log('no pending art — every published post with a brief has a hero');
  process.exit(0);
}

const briefsPath = join(process.cwd(), 'content', 'art', 'briefs', 'pending.json');
const contextPath = join(process.cwd(), 'content', 'art', 'briefs', 'pending-context.json');
writeFileSync(briefsPath, JSON.stringify(pending, null, 2) + '\n');
writeFileSync(contextPath, JSON.stringify(context, null, 2) + '\n');
console.log(`${pending.length} pending brief(s): ${pending.map((p) => p.slug).join(', ')}`);
console.log(`variety context: ${context.length} recent publish(es)`);
execFileSync('node', ['scripts/art/lint-briefs.mjs', briefsPath, '--context', contextPath], { stdio: 'inherit' });

#!/usr/bin/env node
// Frontmatter + publish-gate validation. Runs in CI on every content PR.
//
// THE GATE THIS EXISTS FOR: a post may only be `status: published` when
// `claimsReviewed: true`. As a convention that gets skipped at 11pm; as a
// build failure it cannot be. Same fail-closed posture as the product's
// send gates — the machine enforces what the policy promises.
//
// Also checks: required frontmatter, enum validity, kebab-case slugs, unique
// slugs, cluster membership, and that no published post is an orphan (every
// published post must have at least one internal link target in its cluster,
// or be the pillar).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getAllPosts, getPublishedPosts, validatePost } from '../../lib/posts.js';

const clusters = JSON.parse(readFileSync(join(process.cwd(), 'content', 'keywords', 'clusters.json'), 'utf8'));
const clusterIds = new Set(clusters.clusters.map((c) => c.id));

const posts = getAllPosts();
const errors = [];

// Per-post structural validation (includes the claimsReviewed publish gate).
for (const p of posts) errors.push(...validatePost(p));

// Cluster membership must resolve to a declared cluster.
for (const p of posts) {
  if (p.cluster && !clusterIds.has(p.cluster)) {
    errors.push(`${p.dir}: cluster "${p.cluster}" is not declared in content/keywords/clusters.json`);
  }
}

// Slug uniqueness — two posts on one URL silently shadows one.
const seen = new Map();
for (const p of posts) {
  if (!p.slug) continue;
  if (seen.has(p.slug)) errors.push(`duplicate slug "${p.slug}" in ${seen.get(p.slug)} and ${p.dir}`);
  seen.set(p.slug, p.dir);
}

// No orphan published posts: topical authority depends on internal linking,
// so a published non-pillar post needs at least one sibling in its cluster.
const published = getPublishedPosts();
for (const p of published) {
  if (p.pillar === true) continue;
  const siblings = published.filter((o) => o.slug !== p.slug && o.cluster === p.cluster);
  if (siblings.length === 0) {
    console.warn(`⚠ ${p.dir}: no published siblings in cluster "${p.cluster}" — orphan post, no internal links to earn`);
  }
}

// Exactly one pillar per cluster (zero is fine while a cluster is being built).
for (const id of clusterIds) {
  const pillars = published.filter((p) => p.cluster === id && p.pillar === true);
  if (pillars.length > 1) errors.push(`cluster "${id}" has ${pillars.length} published pillars — expected at most 1`);
}

if (errors.length) {
  console.error('✗ content validation failed:\n');
  for (const e of errors) console.error(`  ${e}`);
  console.error(`\n${errors.length} error(s). Nothing publishes until these are fixed.`);
  process.exit(1);
}

console.log(`✓ content: ${posts.length} post(s) valid — ${published.length} published, ${posts.length - published.length} in draft/review`);

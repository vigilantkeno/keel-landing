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

// Forward-only dates (package contract §6). content/keywords/date-ledger.json
// records every published slug's date at publish time. A ledgered slug whose
// frontmatter date differs fails the build — re-dating published content is
// visible and deliberate (update the ledger in the same PR) or it does not
// happen. New slugs may not be dated earlier than the newest ledgered date.
import { existsSync as _ex } from 'node:fs';
const LEDGER_PATH = join(process.cwd(), 'content', 'keywords', 'date-ledger.json');
const ledger = _ex(LEDGER_PATH) ? JSON.parse(readFileSync(LEDGER_PATH, 'utf8')) : {};
const maxLedgered = Object.values(ledger).sort().at(-1) ?? null;
for (const p of posts) {
  if (!p.slug || !p.date) continue;
  const d = String(p.date).slice(0, 10);
  if (ledger[p.slug] && ledger[p.slug] !== d) {
    errors.push(`${p.dir}: date ${d} differs from published date ${ledger[p.slug]} in date-ledger.json — published dates are forward-only; if this change is deliberate, update the ledger in this PR`);
  }
  // A brand-new slug MAY be dated earlier than the newest published post —
  // backdating a batch's first-ever appearance across a calendar is normal
  // content-ops practice (nothing has been indexed under the URL yet, so
  // there is nothing to manipulate). What stays hard-blocked, above, is
  // changing an ALREADY-ledgered date — that is the actual anti-manipulation
  // protection.
}

// Internal links must resolve. Both founder article packages so far arrived
// with links to slugs that do not exist (and to /founders, which has no route
// yet) — a 404 in a published post is worse than a build failure here.
// Checks /blog/<slug> against the actual post set and any other site-internal
// path (including absolute getkeel.io URLs) against the routes we serve.
const SITE_ROUTES = new Set(['/', '/blog', '/founders', '/manifesto', '/terms', '/privacy', '/sms-consent', '/feed.xml', '/sitemap.xml']);
const knownSlugs = new Set(posts.map((p) => p.slug).filter(Boolean));
const publishedSlugs = new Set(posts.filter((p) => p.status === 'published' && p.claimsReviewed === true).map((p) => p.slug));
for (const p of posts) {
  const body = p.content ?? '';
  for (const m of body.matchAll(/\]\((\/[^)\s#?]*|https?:\/\/(?:www\.)?getkeel\.io[^)\s#?]*)/g)) {
    let l = m[1].replace(/^https?:\/\/(?:www\.)?getkeel\.io/, '');
    l = (l.replace(/\/+$/, '') || '/');
    if (l.startsWith('/blog/')) {
      const slug = l.slice('/blog/'.length);
      if (!knownSlugs.has(slug)) {
        errors.push(`${p.dir}: links to /blog/${slug} — no post with that slug exists`);
      } else if (p.status === 'published' && p.claimsReviewed === true && !publishedSlugs.has(slug)) {
        // The slug exists as content but isn't live (still draft) — a
        // published post linking to it would 404 in production even though
        // the slug is real. Caught here because getAllPosts() includes
        // drafts, which the earlier existence check alone can't see past.
        errors.push(`${p.dir}: links to /blog/${slug} — that post is not published yet (still draft), so this link would 404 in production`);
      }
    } else if (!SITE_ROUTES.has(l)) {
      errors.push(`${p.dir}: links to ${l} — not a route this site serves`);
    }
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
// NOT getPublishedPosts() for this count: that function is environment-aware
// (renders drafts everywhere except VERCEL_ENV=production, by design, so PR
// previews can show them) — using it here made this summary line silently
// report "0 drafts" whenever the gate ran locally, exactly the run where a
// human is most likely to be checking whether a draft is actually held back.
const published = posts.filter((p) => p.status === 'published' && p.claimsReviewed === true);
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

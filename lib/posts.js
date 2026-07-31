import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

export const POSTS_DIR = join(process.cwd(), 'content', 'blog', 'posts');
export const INTENTS = ['informational', 'comparison', 'commercial'];
export const STATUSES = ['brief', 'draft', 'review', 'published'];

/**
 * Frontmatter contract. `required` fields must exist on every post file;
 * publish-time gates are enforced separately in validatePost so a draft can
 * exist in the repo incomplete without breaking the build.
 */
export const REQUIRED_FIELDS = [
  'title', 'description', 'slug', 'date', 'author',
  'targetKeyword', 'intent', 'cluster', 'status',
];

/** Read every post directory, newest first. Draft/brief posts are included. */
export function getAllPosts() {
  if (!existsSync(POSTS_DIR)) return [];
  return readdirSync(POSTS_DIR)
    .filter((d) => statSync(join(POSTS_DIR, d)).isDirectory())
    .map((dir) => {
      const file = join(POSTS_DIR, dir, 'index.mdx');
      if (!existsSync(file)) return null;
      const { data, content } = matter(readFileSync(file, 'utf8'));
      return { ...data, dir, content, faq: data.faq ?? [], secondaryKeywords: data.secondaryKeywords ?? [] };
    })
    .filter(Boolean)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

/** Only these reach the site, the sitemap, and llms.txt. */
export function getPublishedPosts() {
  return getAllPosts().filter((p) => p.status === 'published' && p.claimsReviewed === true);
}

export function getPostBySlug(slug) {
  return getPublishedPosts().find((p) => p.slug === slug) ?? null;
}

/** Siblings in the same cluster, for internal linking (no orphan posts). */
export function getRelatedPosts(post, limit = 3) {
  return getPublishedPosts()
    .filter((p) => p.slug !== post.slug && p.cluster === post.cluster)
    .slice(0, limit);
}

/**
 * Structural validation. Returns an array of human-readable errors.
 * THE PUBLISH GATE: a post may only be `status: published` when
 * `claimsReviewed: true`. This is enforced in CI (scripts/content/validate.mjs)
 * so it is a build failure, not a convention someone can forget.
 */
export function validatePost(p) {
  const errs = [];
  const where = p.dir ?? p.slug ?? '(unknown)';
  for (const f of REQUIRED_FIELDS) {
    if (p[f] === undefined || p[f] === null || p[f] === '') errs.push(`${where}: missing required frontmatter "${f}"`);
  }
  if (p.intent && !INTENTS.includes(p.intent)) errs.push(`${where}: intent "${p.intent}" not one of ${INTENTS.join('|')}`);
  if (p.status && !STATUSES.includes(p.status)) errs.push(`${where}: status "${p.status}" not one of ${STATUSES.join('|')}`);
  if (p.status === 'published' && p.claimsReviewed !== true) {
    errs.push(`${where}: status is "published" but claimsReviewed is not true — a human must review claims before publish`);
  }
  if (p.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) errs.push(`${where}: slug "${p.slug}" must be kebab-case`);
  if (p.date && Number.isNaN(Date.parse(p.date))) errs.push(`${where}: date "${p.date}" is not parseable`);
  if (p.pillar !== undefined && typeof p.pillar !== 'boolean') errs.push(`${where}: pillar must be a boolean`);
  if (p.faq && !Array.isArray(p.faq)) errs.push(`${where}: faq must be an array of {question, answer}`);
  return errs;
}

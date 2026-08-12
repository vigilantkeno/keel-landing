import { getPublishedPosts } from '../lib/posts';

// Replaces the former static public/sitemap.xml — posts now self-register
// with lastmod taken from frontmatter. These two cannot coexist: both serve
// /sitemap.xml, and the static file would win.
const BASE = 'https://getkeel.io';

export default function sitemap() {
  const staticRoutes = [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/founders`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/manifesto`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/terms`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/sms-consent`, changeFrequency: 'monthly', priority: 0.5 },
  ].map((r) => ({ ...r, lastModified: new Date() }));

  const posts = getPublishedPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: 'monthly',
    priority: p.pillar ? 0.8 : 0.6,
  }));

  return [...staticRoutes, ...posts];
}

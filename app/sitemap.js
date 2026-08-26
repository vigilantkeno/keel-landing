import { getPublishedPosts } from '../lib/posts';
import { lastCommitDate } from '../lib/route-dates';

// Replaces the former static public/sitemap.xml — posts now self-register
// with lastmod taken from frontmatter. These two cannot coexist: both serve
// /sitemap.xml, and the static file would win.
const BASE = 'https://getkeel.io';

// Each static route is backed by exactly one page file, and that file's last
// commit is when the route actually changed. These previously all carried
// `new Date()`, which told every crawler all seven pages were modified on
// every request — a freshness signal that was never true, and one that kept
// resubmitting the same URLs to IndexNow forever without them ever ageing out.
const STATIC_ROUTES = [
  { path: '/', source: 'app/page.jsx', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/founders', source: 'app/founders/page.jsx', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/blog', source: 'app/blog/page.jsx', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/manifesto', source: 'app/manifesto/page.jsx', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/terms', source: 'app/terms/page.jsx', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/privacy', source: 'app/privacy/page.jsx', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/sms-consent', source: 'app/sms-consent/page.jsx', changeFrequency: 'monthly', priority: 0.5 },
];

export default function sitemap() {
  const staticRoutes = STATIC_ROUTES.map(({ path, source, changeFrequency, priority }) => {
    const lastModified = lastCommitDate(source);
    return {
      url: `${BASE}${path}`,
      changeFrequency,
      priority,
      // Omitted when git can't answer — never guessed.
      ...(lastModified ? { lastModified } : {}),
    };
  });

  const posts = getPublishedPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: 'monthly',
    priority: p.pillar ? 0.8 : 0.6,
  }));

  return [...staticRoutes, ...posts];
}

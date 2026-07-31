import { getPublishedPosts } from '../../lib/posts';

// RSS. Cheap to maintain, useful for syndication, and several AI crawlers
// ingest feeds directly.
const BASE = 'https://getkeel.io';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const dynamic = 'force-static';

export function GET() {
  const posts = getPublishedPosts();
  const items = posts.map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${BASE}/blog/${p.slug}</link>
      <guid isPermaLink="true">${BASE}/blog/${p.slug}</guid>
      <description>${esc(p.description)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <author>${esc(p.author)}</author>
    </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>keel — Field Notes</title>
    <link>${BASE}/blog</link>
    <description>Deal complexity, rep-first AI, and the moments that happen after you hang up.</description>
    <language>en-us</language>
    <atom:link href="${BASE}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}

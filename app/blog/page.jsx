import { existsSync } from 'node:fs';
import { join } from 'node:path';
import BlogShell from '../../src/BlogShell';
import { getPublishedPosts } from '../../lib/posts';
import BlogIndexGrid from './BlogIndexGrid';

export const metadata = {
  title: 'Blog — keel',
  description:
    'Field notes on deal complexity, rep-first AI, and the moments no meeting bot can join.',
  alternates: { canonical: 'https://getkeel.io/blog' },
  openGraph: {
    title: 'Blog — keel',
    description:
      'Field notes on deal complexity, rep-first AI, and the moments no meeting bot can join.',
    url: 'https://getkeel.io/blog',
    type: 'website',
  },
};

// The card crop (1200x800) is derived from the hero by the art pipeline and
// shares its name; verify it actually exists before pointing a tile at it so
// a post whose art ever lags degrades to a clean text tile, not a 404.
function cardFor(heroImage) {
  if (!heroImage) return null;
  const card = heroImage.replace('-hero-', '-card-');
  return existsSync(join(process.cwd(), 'public', card.replace(/^\//, ''))) ? card : null;
}

export default function BlogIndex() {
  const posts = getPublishedPosts();
  return (
    <BlogShell
      wide
      title="Field Notes"
      lead="Deal complexity, rep-first AI, and the moments that happen after you hang up."
      meta={`${posts.length} POST${posts.length === 1 ? '' : 'S'} · GETKEEL.IO`}
    >
      <BlogIndexGrid
        posts={posts.map((p) => ({
          slug: p.slug,
          title: p.title,
          description: p.description,
          date: p.date,
          cluster: p.cluster,
          pillar: p.pillar === true,
          isDraft: p.status !== 'published' || p.claimsReviewed !== true,
          hero: p.heroImage ?? null,
          card: cardFor(p.heroImage),
          alt: p.heroAlt ?? null,
          readMin: Math.max(1, Math.round((p.content?.split(/\s+/).length ?? 0) / 220)),
        }))}
      />
    </BlogShell>
  );
}

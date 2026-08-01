import BlogShell from '../../src/BlogShell';
import { getPublishedPosts } from '../../lib/posts';
import PostList from './PostList';

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

export default function BlogIndex() {
  const posts = getPublishedPosts();
  return (
    <BlogShell
      title="Field Notes"
      lead="Deal complexity, rep-first AI, and the moments that happen after you hang up."
      meta={`${posts.length} POST${posts.length === 1 ? '' : 'S'} · GETKEEL.IO`}
    >
      <PostList posts={posts.map(({ slug, title, description, date, cluster, pillar, status, claimsReviewed }) => ({
        slug, title, description, date, cluster, pillar,
        isDraft: status !== 'published' || claimsReviewed !== true,
      }))} />
    </BlogShell>
  );
}

import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import BlogShell from '../../../src/BlogShell';
import { mdxComponents } from '../../../src/MdxStyles';
import { getPublishedPosts, getPostBySlug, getRelatedPosts } from '../../../lib/posts';
import RelatedPosts from './RelatedPosts';

// Static generation: every published post is prerendered at build time, so a
// crawler (and an AI crawler that never runs JS) gets the full article in the
// HTML response.
export function generateStaticParams() {
  return getPublishedPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  const url = `https://getkeel.io/blog/${post.slug}`;
  return {
    title: `${post.title} — keel`,
    description: post.description,
    keywords: [post.targetKeyword, ...(post.secondaryKeywords ?? [])],
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default function BlogPost({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);
  const url = `https://getkeel.io/blog/${post.slug}`;

  // Article + FAQPage JSON-LD. FAQPage is emitted only when the post declares
  // FAQs — an empty mainEntity is worse than no block.
  const graph = [
    {
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      datePublished: new Date(post.date).toISOString(),
      dateModified: new Date(post.updated ?? post.date).toISOString(),
      author: { '@type': 'Person', name: post.author },
      publisher: { '@id': 'https://getkeel.io/#organization' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
    },
  ];
  if (post.faq?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: post.faq.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }
  const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <BlogShell
        eyebrow={
          post.status !== 'published' || post.claimsReviewed !== true
            ? 'DRAFT — NOT PUBLISHED'
            : post.pillar
              ? 'PILLAR'
              : 'FIELD NOTES'
        }
        title={post.title}
        lead={post.description}
        meta={`${String(post.date).slice(0, 10).toUpperCase()} · ${post.author.toUpperCase()} · GETKEEL.IO`}
      >
        <MDXRemote source={post.content} components={mdxComponents} />
        <RelatedPosts
          posts={related.map(({ slug, title, description }) => ({ slug, title, description }))}
        />
      </BlogShell>
    </>
  );
}

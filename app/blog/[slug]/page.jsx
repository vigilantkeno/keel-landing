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
  // metaTitle (optional frontmatter): SERP titles want <60 chars; H1s can run
  // longer. When present it is used verbatim for <title>/OG/Twitter.
  const metaTitle = post.metaTitle ?? `${post.title} — keel`;
  return {
    title: metaTitle,
    description: post.description,
    keywords: [post.targetKeyword, ...(post.secondaryKeywords ?? [])],
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      title: post.metaTitle ?? post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle ?? post.title,
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
      // Sara is an AI and is never presented as a human author. The
      // accountable schema.org author is the Keel Organization; "Sara" is the
      // displayed voice (byline policy, contract §4 v1.2 — "Sara K." style
      // human-disguise bylines were explicitly rejected 2026-08-01).
      author: /^sara$/i.test(post.author) || /team/i.test(post.author)
        ? { '@type': 'Organization', name: 'Keel', url: 'https://getkeel.io' }
        : { '@type': 'Person', name: post.author, url: 'https://getkeel.io' },
      publisher: { '@id': 'https://getkeel.io/#organization' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
    },
  ];
  graph.push({
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://getkeel.io/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://getkeel.io/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  });
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
        crumbs={[
          { label: 'HOME', href: '/' },
          { label: 'BLOG', href: '/blog' },
          { label: post.title.toUpperCase().slice(0, 40) + (post.title.length > 40 ? '…' : '') },
        ]}
        eyebrow={
          post.status !== 'published' || post.claimsReviewed !== true
            ? 'DRAFT — NOT PUBLISHED'
            : post.pillar
              ? 'PILLAR'
              : 'FIELD NOTES'
        }
        title={post.title}
        lead={post.description}
        meta={`${String(post.date).slice(0, 10).toUpperCase()} · ${/^sara$/i.test(post.author) ? "SARA — KEEL'S AI DEAL ASSISTANT" : post.author.toUpperCase()} · GETKEEL.IO`}
      >
        <MDXRemote source={post.content} components={mdxComponents} />
        <RelatedPosts
          posts={related.map(({ slug, title, description }) => ({ slug, title, description }))}
        />
      </BlogShell>
    </>
  );
}

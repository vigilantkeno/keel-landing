"use client";

import { F, MICRO, O } from '../../../src/brand';

// Internal linking within a cluster — topical authority depends on it, and
// scripts/content/validate.mjs warns on published posts with no siblings.
export default function RelatedPosts({ posts }) {
  if (!posts?.length) return null;
  return (
    <div style={{ marginTop: 56, borderTop: '1px solid #1C1C1C', paddingTop: 24 }}>
      <div style={{ fontFamily: F.mono, fontSize: 9, color: O, letterSpacing: '0.18em',
        marginBottom: 16 }}>MORE IN THIS SERIES</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {posts.map((p) => (
          <a key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 15,
              color: '#E0E0E0', marginBottom: 3 }}>{p.title}</div>
            <div style={{ fontFamily: F.sans, fontSize: 14, color: MICRO, lineHeight: 1.6 }}>
              {p.description}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

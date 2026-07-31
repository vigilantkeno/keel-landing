"use client";

import { F, MICRO, O } from '../../src/brand';

export default function PostList({ posts }) {
  if (!posts.length) {
    return (
      <p style={{ fontFamily: F.mono, fontSize: 12, color: MICRO, letterSpacing: '0.1em' }}>
        NO POSTS PUBLISHED YET.
      </p>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {posts.map((p) => (
        <a key={p.slug} href={`/blog/${p.slug}`}
          style={{ display: 'block', padding: '20px 0', borderTop: '1px solid #1A1A1A',
            textDecoration: 'none' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontFamily: F.mono, fontSize: 9, color: MICRO, letterSpacing: '0.14em' }}>
              {String(p.date).slice(0, 10).toUpperCase()}
            </span>
            {p.pillar && (
              <span style={{ fontFamily: F.mono, fontSize: 8, color: O, letterSpacing: '0.14em',
                border: `1px solid ${O}44`, padding: '2px 7px' }}>PILLAR</span>
            )}
          </div>
          <h2 style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 19, color: '#F0F0F0',
            lineHeight: 1.35, marginBottom: 6 }}>{p.title}</h2>
          <p style={{ fontFamily: F.sans, fontSize: 15, color: '#888', lineHeight: 1.65, margin: 0 }}>
            {p.description}
          </p>
        </a>
      ))}
    </div>
  );
}

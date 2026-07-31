import { ImageResponse } from 'next/og';
import { getPublishedPosts, getPostBySlug } from '../../../lib/posts';

// Per-post OG images, generated at build time from frontmatter. One shared
// og-image.png for every post wastes the highest-leverage real estate in a
// social share; this costs nothing per post once wired.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'keel — Field Notes';

export function generateStaticParams() {
  return getPublishedPosts().map((p) => ({ slug: p.slug }));
}

export default function Image({ params }) {
  const post = getPostBySlug(params.slug);
  const title = post?.title ?? 'Field Notes';
  const eyebrow = post?.pillar ? 'PILLAR' : 'FIELD NOTES';

  // System fonts only: next/og cannot use the site's Google-hosted families
  // without embedding the font binaries, and a wrong-but-close font renders
  // worse than a clean system stack.
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', background: '#0B0B0B',
          padding: '64px 72px', fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width="44" height="48" viewBox="98 400 218 238">
            <defs>
              <linearGradient id="g" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF7A3D" />
                <stop offset="100%" stopColor="#CC3300" />
              </linearGradient>
            </defs>
            <path fill="url(#g)" d="M231.82 630.16 C229.44 629.66 228.95 627.73 228.08 626.18 C203.55 582.83 179.06 539.47 154.54 496.12 C138.71 468.15 122.85 440.19 107.01 412.22 C106.36 411.07 105.53 409.95 106.17 408.36 C107.57 406.92 109.58 407.37 111.26 407.44 C126.59 408.12 141.90 407.12 157.22 407.09 C158.72 407.09 160.22 407.15 161.72 407.10 C168.36 406.90 172.46 409.12 176.12 415.68 C199.47 457.57 222.69 499.54 247.01 540.89 C252.74 550.65 258.07 560.65 263.63 570.51 C264.86 572.69 265.30 574.56 263.86 576.99 C254.04 593.62 244.37 610.35 234.62 627.03 C233.96 628.15 232.98 629.07 231.82 630.16 Z" />
            <path fill="url(#g)" d="M302.68 508.62 C293.97 523.55 285.45 538.16 276.11 554.18 C265.54 535.49 255.60 517.90 245.07 499.28 C266.41 499.28 286.37 499.28 306.51 499.28 C307.29 503.27 304.07 505.39 302.68 508.62 Z" />
          </svg>
          <span style={{ fontSize: 34, fontWeight: 600, color: '#FFF', letterSpacing: '-0.025em' }}>
            keel
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 20, color: '#FF5A1F', letterSpacing: '0.2em', marginBottom: 20 }}>
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: title.length > 60 ? 56 : 68,
              fontWeight: 800, color: '#FFFFFF', lineHeight: 1.12,
              letterSpacing: '-0.02em', maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ fontSize: 18, color: '#8a8a8a', letterSpacing: '0.14em' }}>
          SARA · 24/7 DEAL ASSISTANT · GETKEEL.IO
        </div>
      </div>
    ),
    size,
  );
}

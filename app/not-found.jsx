import Mark from '../src/Mark';
import { O, OL, BK, F } from '../src/brand';
import '../src/not-found.css';

// Public 404: full-bleed atrium composition on landing brand. No kui, no
// next/link, no /sara route — Meet Sara goes to the existing /founders
// application surface (homepage already has Back home).

export const metadata = {
  title: 'Page not found — Keel',
  description: 'This page stopped responding.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      className="k404"
      style={{
        '--k404-bg': BK,
        '--k404-accent': O,
        '--k404-accent-hover': OL,
        '--k404-sans': F.sans,
        '--k404-mono': F.mono,
        '--k404-cond': F.cond,
      }}
    >
      <picture>
        <source media="(min-width:701px)" type="image/avif" srcSet="/404/atrium-landscape.avif" />
        <source media="(min-width:701px)" type="image/webp" srcSet="/404/atrium-landscape.webp" />
        <source media="(min-width:701px)" srcSet="/404/atrium-landscape.jpg" />
        <source type="image/avif" srcSet="/404/atrium-portrait.avif" />
        <source type="image/webp" srcSet="/404/atrium-portrait.webp" />
        <img
          src="/404/atrium-portrait.jpg"
          alt=""
          aria-hidden="true"
          className="k404-art"
          width={936}
          height={1024}
          decoding="async"
          fetchPriority="high"
        />
      </picture>

      <div className="k404-scrim" />

      <div className="k404-wrap">
        <header className="k404-header k404-col">
          <a href="/" className="k404-brand">
            <span className="k404-mark">
              <Mark size={34} />
            </span>
            <span className="k404-wordmark">keel</span>
          </a>
        </header>

        <div className="k404-main k404-col">
          <div className="k404-content">
            <div className="k404-thread" aria-hidden="true">
              <div className="k404-bubble k404-bubble-out">i think i&apos;m lost</div>
              <p className="k404-stamp k404-stamp-out">4:04 PM</p>
              <div className="k404-bubble k404-bubble-in">You are. This page stopped responding.</div>
              <p className="k404-stamp k404-stamp-in">4:04 PM</p>
              <div className="k404-bubble k404-bubble-in">Happens to deals too.</div>
              <p className="k404-stamp k404-stamp-in">4:04 PM</p>
            </div>

            <p className="k404-eyebrow">Error 404</p>
            <h1 className="k404-headline">Went dark.</h1>
            <p className="k404-body">
              This page stopped responding. Moved, renamed, or never existed — you&apos;ll never
              find out which. You know the feeling.
            </p>

            <div className="k404-actions">
              <a href="/" className="k404-btn k404-btn-primary">
                Back home
              </a>
              <a href="/founders" className="k404-btn k404-btn-secondary">
                Meet Sara
              </a>
            </div>
          </div>
        </div>

        <p className="k404-footnote k404-col">
          Keel — for the conversations that don&apos;t get recorded.
        </p>
      </div>
    </main>
  );
}

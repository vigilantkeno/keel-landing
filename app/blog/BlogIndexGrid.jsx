"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { F, MICRO, O } from '../../src/brand';

// Blog index: featured tile + 1px-gap tiled grid, with client-side search
// and cluster filtering over the already-in-memory post list. At this
// content size that is a property filter, not a "search feature" — no
// backend, no index. Layout skeleton adapted from the founder's Stitch
// concept; the tactical theming was deliberately not.
const BK = '#0B0B0B';
const BORDER = '#1A1A1A';

const clusterLabel = (c) => (c ?? '').replace(/-/g, ' ').toUpperCase();
const dateLabel = (d) => String(d).slice(0, 10).toUpperCase();

function Badges({ p }) {
  return (
    <>
      {p.isDraft && (
        <span style={{ fontFamily: F.mono, fontSize: 8, color: '#000', background: '#e8b30c',
          letterSpacing: '0.14em', padding: '2px 7px' }}>DRAFT</span>
      )}
      {p.pillar && (
        <span style={{ fontFamily: F.mono, fontSize: 8, color: O, letterSpacing: '0.14em',
          border: `1px solid ${O}44`, padding: '2px 7px' }}>PILLAR</span>
      )}
    </>
  );
}

function Meta({ p, style }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', ...style }}>
      <span style={{ fontFamily: F.mono, fontSize: 9, color: O, letterSpacing: '0.14em' }}>
        {clusterLabel(p.cluster)}
      </span>
      <span style={{ fontFamily: F.mono, fontSize: 9, color: MICRO, letterSpacing: '0.14em' }}>
        {dateLabel(p.date)}
      </span>
      <span style={{ fontFamily: F.mono, fontSize: 9, color: '#555', letterSpacing: '0.14em' }}>
        {p.readMin} MIN
      </span>
      <Badges p={p} />
    </div>
  );
}

function FeaturedTile({ p }) {
  return (
    <a href={`/blog/${p.slug}`} className="kbi-tile"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        background: BK, border: `1px solid ${BORDER}`, textDecoration: 'none',
        marginBottom: 28 }}>
      {p.hero && (
        /* The featured tile uses the hero, not the card: its column runs to
           roughly half the 1160px shell, wider than any grid tile. It is also
           the LCP element on /blog, so it stays eager while everything below
           it lazies. */
        <img src={p.hero} alt={p.alt ?? ''} width={1440} height={810}
          fetchPriority="high" decoding="async"
          style={{ display: 'block', width: '100%', height: '100%',
            objectFit: 'cover', aspectRatio: '16 / 9' }} />
      )}
      <div style={{ padding: '28px 28px 24px', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', gap: 18 }}>
        <div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontFamily: F.mono, fontSize: 9, color: '#000', background: O,
              letterSpacing: '0.14em', padding: '3px 8px' }}>LATEST</span>
            <Meta p={p} />
          </div>
          <h2 className="kbi-title" style={{ fontFamily: F.cond, fontWeight: 900,
            fontSize: 'clamp(24px, 3vw, 34px)', lineHeight: 1.05, color: '#FFF',
            textTransform: 'uppercase', letterSpacing: '-0.01em', margin: '0 0 12px' }}>
            {p.title}
          </h2>
          <p style={{ fontFamily: F.sans, fontSize: 15, color: '#8A8A8A',
            lineHeight: 1.7, margin: 0 }}>{p.description}</p>
        </div>
        <span style={{ fontFamily: F.mono, fontSize: 10, color: O, letterSpacing: '0.16em' }}>
          READ IT →
        </span>
      </div>
    </a>
  );
}

function PostTile({ p }) {
  return (
    <a href={`/blog/${p.slug}`} className="kbi-tile"
      style={{ background: BK, textDecoration: 'none', display: 'flex',
        flexDirection: 'column' }}>
      {p.card && (
        /* Lazy: the index carries a tile per published post, and eager-loading
           every card pulled the whole set down before anything below the fold
           was worth having. aspectRatio already reserves the box, so deferring
           these costs no layout stability. */
        <img src={p.card} alt={p.alt ?? ''} width={800} height={533}
          loading="lazy" decoding="async"
          style={{ display: 'block', width: '100%', height: 'auto',
            aspectRatio: '3 / 2', objectFit: 'cover' }} />
      )}
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column',
        gap: 10, flexGrow: 1 }}>
        <Meta p={p} />
        <h3 className="kbi-title" style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 17,
          color: '#F0F0F0', lineHeight: 1.35, margin: 0 }}>{p.title}</h3>
        <p style={{ fontFamily: F.sans, fontSize: 14, color: '#888', lineHeight: 1.6,
          margin: 0, display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
      </div>
    </a>
  );
}

function FoundersTile() {
  return (
    <a href="/founders" className="kbi-tile"
      style={{ background: BK, textDecoration: 'none', display: 'flex',
        flexDirection: 'column', justifyContent: 'center', padding: '28px 24px',
        borderLeft: `3px solid ${O}` }}>
      <span style={{ fontFamily: F.mono, fontSize: 9, color: O,
        letterSpacing: '0.22em', marginBottom: 14 }}>FOUNDERS CLUB</span>
      <p style={{ fontFamily: F.cond, fontWeight: 900, fontSize: 26, lineHeight: 1.1,
        color: '#FFF', textTransform: 'uppercase', margin: '0 0 12px' }}>
        You're not a beta tester. You're a co-builder.
      </p>
      <p style={{ fontFamily: F.sans, fontSize: 14, color: '#8A8A8A', lineHeight: 1.6,
        margin: '0 0 16px' }}>
        Sara is built with the reps using her. Applications are read by a human.
      </p>
      <span style={{ fontFamily: F.mono, fontSize: 10, color: O, letterSpacing: '0.16em' }}>
        APPLY →
      </span>
    </a>
  );
}

// The chip row overflows once the cluster count grows past what fits, and
// the scrollbar is hidden for aesthetic reasons — so with nothing else, a
// clipped chip at the edge reads as "the row ends here" rather than "drag
// to see more". These edge fades plus a click-to-nudge arrow are the fix:
// CSS-only affordance on both edges, a real click target on the right one.
function ChipRow({ clusters, cluster, setCluster }) {
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateEdges, clusters]);

  const nudge = (dir) => {
    scrollerRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative' }}>
      <div ref={scrollerRef} className="kbi-chips" onScroll={updateEdges}
        style={{ display: 'flex', gap: 8, overflowX: 'auto',
          paddingBottom: 4, scrollbarWidth: 'none' }}>
        {['all', ...clusters].map((c) => (
          <button key={c} onClick={() => setCluster(c)}
            style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: '0.12em',
              whiteSpace: 'nowrap', cursor: 'pointer', padding: '6px 12px',
              background: cluster === c ? O : 'transparent',
              color: cluster === c ? '#000' : MICRO,
              border: `1px solid ${cluster === c ? O : BORDER}` }}>
            {c === 'all' ? 'ALL' : clusterLabel(c)}
          </button>
        ))}
      </div>

      {canScrollLeft && (
        <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, bottom: 4,
          width: 32, background: `linear-gradient(to right, ${BK}, transparent)`,
          pointerEvents: 'none' }} />
      )}

      {canScrollRight && (
        <>
          <div aria-hidden style={{ position: 'absolute', right: 0, top: 0, bottom: 4,
            width: 48, background: `linear-gradient(to left, ${BK}, transparent)`,
            pointerEvents: 'none' }} />
          <button onClick={() => nudge(1)} aria-label="Show more categories"
            style={{ position: 'absolute', right: 0, top: 0, bottom: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 26, background: 'transparent', border: 'none', cursor: 'pointer',
              color: O, fontFamily: F.mono, fontSize: 13 }}>
            →
          </button>
        </>
      )}
    </div>
  );
}

export default function BlogIndexGrid({ posts }) {
  const [query, setQuery] = useState('');
  const [cluster, setCluster] = useState('all');

  const clusters = useMemo(() => {
    const seen = new Map();
    for (const p of posts) seen.set(p.cluster, (seen.get(p.cluster) ?? 0) + 1);
    return [...seen.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c);
  }, [posts]);

  const filtering = query.trim() !== '' || cluster !== 'all';
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) =>
      (cluster === 'all' || p.cluster === cluster) &&
      (!q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)));
  }, [posts, query, cluster]);

  const featured = !filtering && shown.length ? shown[0] : null;
  const gridPosts = featured ? shown.slice(1) : shown;

  // CTA tile sits mid-grid in the browse view, never in search results.
  const tiles = [...gridPosts];
  if (!filtering && tiles.length >= 3) tiles.splice(3, 0, { cta: true });

  return (
    <div>
      <style>{`
        .kbi-tile { transition: background 0.15s ease; }
        .kbi-tile:hover { background: #101010 !important; }
        .kbi-tile:hover .kbi-title { color: ${O}; }
        .kbi-title { transition: color 0.15s ease; }
        .kbi-chips::-webkit-scrollbar { display: none; }
        .kbi-search:focus { border-color: ${O} !important; }
      `}</style>

      {/* controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
        <input
          className="kbi-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH FIELD NOTES…"
          aria-label="Search posts"
          style={{ width: '100%', maxWidth: 380, background: '#0F0F0F',
            border: `1px solid ${BORDER}`, color: '#F0F0F0', padding: '11px 14px',
            fontFamily: F.mono, fontSize: 11, letterSpacing: '0.1em', outline: 'none' }}
        />
        <ChipRow clusters={clusters} cluster={cluster} setCluster={setCluster} />
      </div>

      {filtering && (
        <p style={{ fontFamily: F.mono, fontSize: 10, color: MICRO,
          letterSpacing: '0.12em', margin: '0 0 18px' }}>
          {shown.length} RESULT{shown.length === 1 ? '' : 'S'}
        </p>
      )}

      {featured && <FeaturedTile p={featured} />}

      {tiles.length > 0 ? (
        <div style={{ display: 'grid', gap: 1, background: BORDER,
          border: `1px solid ${BORDER}`,
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))' }}>
          {tiles.map((p, i) => (p.cta ? <FoundersTile key="cta" /> : <PostTile key={p.slug} p={p} />))}
        </div>
      ) : (
        <p style={{ fontFamily: F.mono, fontSize: 11, color: MICRO, letterSpacing: '0.1em' }}>
          NOTHING MATCHES — TRY A DIFFERENT TERM OR CLUSTER.
        </p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { O, OL } from "./brand";

const TRIANGLE_BASE = 26; // px — a fine, subtle texture, not a bold pattern

// Page-wide triangle-mesh texture with an ambient/cursor-tracked glow.
// The mesh is a pure CSS background (three sets of repeating diagonal
// lines at 0/60/-60deg — the classic triangular-grid trick), not DOM
// nodes: an earlier version drew one div pair per triangle, which was
// fine scoped to a hero but ballooned into thousands of fixed-position
// elements once applied to the whole page and produced dropped/blank
// compositor frames on scroll. A CSS background-image has none of that
// cost and tiles the full page for free. Fixed to the viewport so it
// stays cheap regardless of page length. No dependencies.
export default function PageGlowGrid() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Listens on window, not the container: page content sits visually
    // above this fixed layer (see .kg-container z-order), so a content
    // box would swallow mousemove before it ever reached this layer.
    function onMove(e) {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Injected via dangerouslySetInnerHTML, NOT as a JSX child. As a child,
  // the server escapes the quotes in `syntax: "<color>"` to &quot;, while the
  // client reads the unescaped text — a hydration mismatch that made React
  // throw out the server HTML and re-render the whole document (blank flash,
  // then a late recovery, with cursor tracking dead until it finished).
  const css = `
        @property --kg-glow-color {
          syntax: "<color>";
          inherits: false;
          initial-value: ${O};
        }
        .kg-container {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent ${TRIANGLE_BASE - 1}px, ${O}1a ${TRIANGLE_BASE}px),
            repeating-linear-gradient(60deg, transparent, transparent ${TRIANGLE_BASE - 1}px, ${O}1a ${TRIANGLE_BASE}px),
            repeating-linear-gradient(-60deg, transparent, transparent ${TRIANGLE_BASE - 1}px, ${O}1a ${TRIANGLE_BASE}px);
        }
        .kg-glow {
          position: absolute;
          width: min(560px, 70vw);
          height: min(560px, 70vw);
          top: 30vh;
          left: 50vw;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle closest-side, var(--kg-glow-color), transparent);
          opacity: 0.4;
          mix-blend-mode: screen;
          animation: kg-glow-pulse 7s ease-in-out infinite alternate;
          will-change: left, top;
          transition: left 0.5s ease-out, top 0.5s ease-out;
        }
        @keyframes kg-glow-pulse {
          from { --kg-glow-color: ${O}; transform: translate(-50%, -50%) scale(0.85); }
          to   { --kg-glow-color: ${OL}; transform: translate(-50%, -50%) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .kg-glow { animation: none; }
        }
      `;

  return (
    <div className="kg-container" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div ref={glowRef} className="kg-glow" />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { O, OL, BK } from "./brand";

const TRIANGLE_BASE = 26; // px — smaller than a full hero treatment, this is a subtle texture

// Triangle-tessellation mask over an ambient glow: the triangles are filled
// in the page's own background color, so the grid gaps read as thin lines
// and the glow only shows through the seams. Glow drifts to the cursor on
// desktop and pulses gently on its own otherwise. No dependencies.
export default function HeroGlowGrid() {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const [grid, setGrid] = useState({ columns: 0, rows: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function computeGrid() {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const columns = Math.ceil(width / (TRIANGLE_BASE * 2)) + 1;
      const rows = Math.ceil((height / TRIANGLE_BASE) * 1.733);
      setGrid({ columns, rows });
    }

    computeGrid();
    const ro = new ResizeObserver(computeGrid);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Listens on window, not the grid itself: the grid sits visually
    // beneath the headline (see .kg-container z-order), so the headline's
    // own box would swallow mousemove before it ever reached this layer.
    function onMove(e) {
      const rect = el.getBoundingClientRect();
      glow.style.left = `${e.clientX - rect.left}px`;
      glow.style.top = `${e.clientY - rect.top}px`;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const sets = [];
  for (let y = 0; y < grid.rows; y++) {
    for (let x = 0; x < grid.columns; x++) {
      sets.push({ key: `${x}-${y}`, offset: y % 2 === 0 });
    }
  }

  return (
    <div ref={containerRef} className="kg-container" aria-hidden="true">
      <style>{`
        @property --kg-glow-color {
          syntax: "<color>";
          inherits: false;
          initial-value: ${O};
        }
        .kg-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          --kg-gap: 1px;
          --kg-base: ${TRIANGLE_BASE}px;
          --kg-base-height: calc(1.733 * var(--kg-base));
          --kg-width: calc(var(--kg-base) - var(--kg-gap));
          --kg-height: calc(var(--kg-base-height) - var(--kg-gap));
        }
        .kg-glow {
          position: absolute;
          width: min(560px, 70%);
          height: min(560px, 70%);
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle closest-side, var(--kg-glow-color), transparent);
          opacity: 0.4;
          animation: kg-glow-pulse 7s ease-in-out infinite alternate;
          will-change: left, top;
          transition: left 0.5s ease-out, top 0.5s ease-out;
        }
        @keyframes kg-glow-pulse {
          from { --kg-glow-color: ${O}; transform: translate(-50%, -50%) scale(0.85); }
          to   { --kg-glow-color: ${OL}; transform: translate(-50%, -50%) scale(1); }
        }
        .kg-triangles {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(${grid.columns}, calc(var(--kg-base) * 2 + var(--kg-gap)));
        }
        .kg-set {
          display: inline-block;
          position: relative;
          width: calc(var(--kg-base) * 2 + var(--kg-gap));
          height: var(--kg-base-height);
        }
        .kg-set--offset {
          transform: translateX(calc(-1 * var(--kg-base) - 0.5 * var(--kg-gap)));
        }
        .kg-set::before,
        .kg-set::after {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          top: var(--kg-gap);
          border-right: var(--kg-width) solid transparent;
          border-left: var(--kg-width) solid transparent;
        }
        .kg-set::before {
          left: calc(-1 * var(--kg-base));
          border-bottom: var(--kg-height) solid ${BK};
        }
        .kg-set::after {
          right: calc(var(--kg-gap) * 2.5);
          border-top: var(--kg-height) solid ${BK};
        }
        @media (prefers-reduced-motion: reduce) {
          .kg-glow { animation: none; }
        }
      `}</style>
      <div ref={glowRef} className="kg-glow" />
      <div className="kg-triangles">
        {sets.map((s) => (
          <div key={s.key} className={`kg-set${s.offset ? " kg-set--offset" : ""}`} />
        ))}
      </div>
    </div>
  );
}

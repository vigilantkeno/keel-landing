"use client";

import { useEffect, useState } from "react";
import Mark from "./Mark";
import SiteFooter from "./SiteFooter";
import { BK, F, MICRO, O } from "./brand";

// Editorial long-form chrome — Manifesto, doctrine pages.
// Deliberately NOT LegalShell: LEGAL eyebrow + policy chrome says ToS.
// This should read as "this company believes something."
function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

export function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 18,
        color: "#F0F0F0", marginBottom: 14 }}>{title}</h2>
      <div style={{ fontFamily: F.sans, fontSize: 16, color: "#9A9A9A", lineHeight: 1.75 }}>
        {children}
      </div>
    </section>
  );
}

export function P({ children }) {
  return <p style={{ marginBottom: 14 }}>{children}</p>;
}

export function Quote({ children }) {
  return (
    <blockquote style={{
      margin: "20px 0",
      padding: "4px 0 4px 16px",
      borderLeft: `2px solid ${O}`,
      fontFamily: F.sans,
      fontSize: 16,
      color: "#D0D0D0",
      lineHeight: 1.7,
    }}>
      {children}
    </blockquote>
  );
}

export default function LongformShell({
  eyebrow = "MANIFESTO",
  title,
  lead,
  meta,
  children,
}) {
  const mobile = useMobile();

  return (
    <div style={{ background: BK, color: "#F5F5F5", fontFamily: F.sans,
      minHeight: "100vh", WebkitFontSmoothing: "antialiased" }}>

      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: mobile ? "14px 20px" : "16px 48px",
        borderBottom: "1px solid #1C1C1C", position: "sticky", top: 0, zIndex: 50,
        background: "rgba(11,11,11,0.97)", backdropFilter: "blur(12px)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: mobile ? 8 : 10,
          textDecoration: "none" }}>
          <Mark size={mobile ? 28 : 32} />
          <span style={{ fontFamily: F.sans, fontWeight: 600, fontSize: mobile ? 19 : 21,
            letterSpacing: "-0.025em", color: "#FFF" }}>keel</span>
        </a>
        {!mobile && (
          <span style={{ fontFamily: F.mono, fontSize: 9,
            color: "#333", letterSpacing: "0.18em" }}>getkeel.io</span>
        )}
      </nav>

      <main style={{ maxWidth: 720, margin: "0 auto",
        padding: mobile ? "40px 20px 56px" : "56px 48px 72px" }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: O,
          letterSpacing: "0.22em", marginBottom: 12 }}>{eyebrow}</div>
        <h1 style={{ fontFamily: F.cond, fontWeight: 900, fontSize: mobile ? 40 : 52,
          color: "#FFF", letterSpacing: "-0.01em", textTransform: "uppercase",
          marginBottom: lead ? 16 : 8, lineHeight: 1.0 }}>{title}</h1>
        {lead && (
          <p style={{ fontFamily: F.sans, fontSize: mobile ? 17 : 19, color: "#C8C8C8",
            lineHeight: 1.65, marginBottom: 12, fontWeight: 500 }}>{lead}</p>
        )}
        {meta && (
          <p style={{ fontFamily: F.mono, fontSize: 9, color: "#444",
            letterSpacing: "0.12em", marginBottom: 40 }}>{meta}</p>
        )}
        {!meta && <div style={{ marginBottom: 40 }} />}
        {children}
      </main>

      <SiteFooter mobile={mobile} />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Mark from "./Mark";
import SiteFooter from "./SiteFooter";
import { BK, F, MICRO, O } from "./brand";

// Blog chrome. Deliberately the same nav/footer construction as LegalShell so
// /blog reads as the same site — brand.js is the only source of colour and
// type. GLOBAL_STYLE is injected once by app/layout.jsx, not here.
function useMobile() {
  // Init to a constant, not window: this renders on the server too.
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

export default function BlogShell({ eyebrow = "BLOG", title, lead, meta, crumbs, children }) {
  const mobile = useMobile();

  return (
    <div style={{ background: BK, color: "#F5F5F5", fontFamily: F.sans,
      minHeight: "100vh", WebkitFontSmoothing: "antialiased" }}>

      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: mobile ? "14px 20px" : "16px 48px",
        borderBottom: "1px solid #1C1C1C", position: "sticky", top: 0, zIndex: 50,
        background: "rgba(11,11,11,0.97)", backdropFilter: "blur(12px)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: mobile ? 8 : 10, textDecoration: "none" }}>
          <Mark size={mobile ? 28 : 32} />
          <span style={{ fontFamily: F.sans, fontWeight: 600, fontSize: mobile ? 19 : 21,
            letterSpacing: "-0.025em", color: "#FFF" }}>keel</span>
        </a>
        <a href="/blog" style={{ fontFamily: F.mono, fontSize: 9, color: MICRO,
          letterSpacing: "0.18em", textDecoration: "none" }}>BLOG</a>
      </nav>

      <main style={{ maxWidth: 720, margin: "0 auto",
        padding: mobile ? "40px 20px 56px" : "56px 48px 72px" }}>
        {crumbs?.length > 0 && (
          <nav aria-label="Breadcrumb" style={{ marginBottom: 20 }}>
            {crumbs.map((c, i) => (
              <span key={i} style={{ fontFamily: F.mono, fontSize: 9,
                color: MICRO, letterSpacing: "0.12em" }}>
                {i > 0 && <span style={{ margin: "0 8px", color: "#333" }}>/</span>}
                {c.href
                  ? <a href={c.href} style={{ color: MICRO, textDecoration: "none" }}>{c.label}</a>
                  : <span style={{ color: "#666" }}>{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <div style={{ fontFamily: F.mono, fontSize: 10, color: O,
          letterSpacing: "0.22em", marginBottom: 12 }}>{eyebrow}</div>
        <h1 style={{ fontFamily: F.cond, fontWeight: 900, fontSize: mobile ? 36 : 44,
          color: "#FFF", letterSpacing: "-0.01em", textTransform: "uppercase",
          marginBottom: lead ? 12 : 8, lineHeight: 1.05 }}>{title}</h1>
        {lead && (
          <p style={{ fontFamily: F.sans, fontSize: mobile ? 16 : 17, color: "#9A9A9A",
            lineHeight: 1.7, marginBottom: 12 }}>{lead}</p>
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

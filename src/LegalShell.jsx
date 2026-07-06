import { useEffect, useState } from "react";
import Mark from "./Mark";
import SiteFooter from "./SiteFooter";
import { BK, F, GLOBAL_STYLE, O } from "./brand";

function useMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 18,
        color: "#F0F0F0", marginBottom: 12 }}>{title}</h2>
      <div style={{ fontFamily: F.sans, fontSize: 15, color: "#888", lineHeight: 1.75 }}>
        {children}
      </div>
    </section>
  );
}

function P({ children }) {
  return <p style={{ marginBottom: 12 }}>{children}</p>;
}

export default function LegalShell({ title, children }) {
  const mobile = useMobile();

  useEffect(() => {
    document.title = `${title} — keel`;
  }, [title]);

  return (
    <div style={{ background: BK, color: "#F5F5F5", fontFamily: F.sans,
      minHeight: "100vh", WebkitFontSmoothing: "antialiased" }}>
      <style>{GLOBAL_STYLE}</style>

      <nav style={{ display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: mobile ? "14px 20px" : "16px 48px",
        borderBottom: "1px solid #1C1C1C",
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(11,11,11,0.97)",
        backdropFilter: "blur(12px)" }}>
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
          letterSpacing: "0.22em", marginBottom: 12 }}>LEGAL</div>
        <h1 style={{ fontFamily: F.cond, fontWeight: 900, fontSize: mobile ? 36 : 44,
          color: "#FFF", letterSpacing: "-0.01em", textTransform: "uppercase",
          marginBottom: 8, lineHeight: 1.05 }}>{title}</h1>
        <p style={{ fontFamily: F.mono, fontSize: 9, color: "#444",
          letterSpacing: "0.12em", marginBottom: 40 }}>
          LAST UPDATED: JULY 6, 2026 · KEEL IS OPERATED BY PLANTLY, LLC
        </p>
        {children}
      </main>

      <SiteFooter mobile={mobile} />
    </div>
  );
}

export { Section, P };

import Mark from "./Mark";
import { F, MICRO } from "./brand";

function TrustPills() {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {[{ l: "ROAD TO SOC2", i: "🔐" }, { l: "PRIVACY FIRST", i: "🛡" }, { l: "NO DATA SOLD", i: "🚫" }].map(({ l, i }) => (
        <div key={l} style={{ display: "inline-flex", alignItems: "center", gap: 6,
          background: "#111", border: "1px solid #222", padding: "6px 12px" }}>
          <span style={{ fontSize: 11 }}>{i}</span>
          <span style={{ fontFamily: F.mono, fontSize: 8, color: MICRO,
            letterSpacing: "0.14em" }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

export default function SiteFooter({ mobile }) {
  const linkStyle = {
    fontFamily: F.mono,
    fontSize: 9,
    color: MICRO,
    letterSpacing: "0.12em",
    textDecoration: "none",
  };

  return (
    <div style={{ borderTop: "1px solid #1A1A1A", padding: mobile ? "20px" : "22px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 12,
        marginBottom: 12, padding: mobile ? "0 20px" : undefined }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <Mark size={mobile ? 22 : 24} />
          <span style={{ fontFamily: F.sans, fontWeight: 600,
            fontSize: mobile ? 16 : 18, letterSpacing: "-0.025em", color: "#FFF" }}>keel</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <a href="/terms" style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = "#888"; }}
            onMouseLeave={e => { e.currentTarget.style.color = MICRO; }}>
            TERMS
          </a>
          <a href="/privacy" style={linkStyle}
            onMouseEnter={e => { e.currentTarget.style.color = "#888"; }}
            onMouseLeave={e => { e.currentTarget.style.color = MICRO; }}>
            PRIVACY
          </a>
        </div>
      </div>
      <div style={{ padding: mobile ? "0 20px" : undefined, marginBottom: 12 }}>
        <div style={{ fontFamily: F.mono, fontSize: 9, color: MICRO,
          letterSpacing: "0.14em", lineHeight: 1.7 }}>
          © 2026 Plantly, LLC. Keel is operated by Plantly, LLC.
        </div>
      </div>
      <div style={{ padding: mobile ? "0 20px" : undefined }}>
        <TrustPills />
      </div>
    </div>
  );
}

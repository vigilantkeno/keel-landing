// Functional microlabels. These render at 8–9px mono with wide tracking, so
// they run one step lighter than plain-AA gray: 7.0:1 on #0B0B0B.
export const MICRO = "#9a9a9a";

export const O = "#FF5A1F";
export const OL = "#FF7A3D";
export const BK = "#0B0B0B";
export const BK2 = "#0F0F0F";

// The families are defined by next/font in app/layout.jsx, which self-hosts them
// and exposes each as a CSS variable on <html>. Each var() already carries
// next/font's metric-adjusted fallback; the name after the comma is a second
// safety net so a missing variable degrades to the font rather than to nothing.
export const F = {
  sans: "var(--font-sans,'Plus Jakarta Sans'),sans-serif",
  mono: "var(--font-mono,'DM Mono'),monospace",
  cond: "var(--font-cond,'Barlow Condensed'),sans-serif",
};

export const GLOBAL_STYLE = `
  * { box-sizing:border-box; margin:0; padding:0; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  input:focus, select:focus { border-color:#FF5A1F !important; outline:none; }
  /* iOS Safari auto-zooms any focused field whose font-size is under 16px;
     !important because field sizes are set inline. 767 matches useMobile(). */
  @media (max-width:767px) {
    input, select, textarea { font-size:16px !important; }
  }
`;

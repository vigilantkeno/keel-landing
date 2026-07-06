export const MICRO = "#8a8a8a"; // functional microlabels — WCAG AA on near-black

export const O = "#FF5A1F";
export const OL = "#FF7A3D";
export const BK = "#0B0B0B";
export const BK2 = "#0F0F0F";

export const F = {
  sans: "'Plus Jakarta Sans',sans-serif",
  mono: "'DM Mono',monospace",
  cond: "'Barlow Condensed',sans-serif",
};

export const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  input:focus, select:focus { border-color:#FF5A1F !important; outline:none; }
`;

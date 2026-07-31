import { F, O } from "./brand";

// NOT a client component: these are pure presentational element overrides with
// no hooks or handlers. MDXRemote (RSC) cannot receive a component map across
// the client boundary — marking this "use client" fails the prerender with
// "Could not find the module ... in the React Client Manifest".

// Prose styling for MDX bodies. Matches LegalShell's Section/P scale so a blog
// post and a legal page read as one typographic system.
export const mdxComponents = {
  h2: (p) => <h2 {...p} style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 22,
    color: "#F0F0F0", margin: "40px 0 12px", lineHeight: 1.3 }} />,
  h3: (p) => <h3 {...p} style={{ fontFamily: F.sans, fontWeight: 600, fontSize: 17,
    color: "#E0E0E0", margin: "28px 0 10px" }} />,
  p: (p) => <p {...p} style={{ fontFamily: F.sans, fontSize: 16, color: "#888",
    lineHeight: 1.8, marginBottom: 16 }} />,
  ul: (p) => <ul {...p} style={{ margin: "0 0 16px 20px", color: "#888",
    fontSize: 16, lineHeight: 1.8 }} />,
  ol: (p) => <ol {...p} style={{ margin: "0 0 16px 20px", color: "#888",
    fontSize: 16, lineHeight: 1.8 }} />,
  li: (p) => <li {...p} style={{ marginBottom: 6 }} />,
  a: (p) => <a {...p} style={{ color: O, textDecoration: "none",
    borderBottom: `1px solid ${O}44` }} />,
  strong: (p) => <strong {...p} style={{ color: "#D8D8D8", fontWeight: 600 }} />,
  blockquote: (p) => <blockquote {...p} style={{ borderLeft: `2px solid ${O}`,
    paddingLeft: 16, margin: "0 0 20px", color: "#9A9A9A", fontStyle: "italic" }} />,
  code: (p) => <code {...p} style={{ fontFamily: F.mono, fontSize: 13,
    background: "#141414", border: "1px solid #222", padding: "2px 6px", color: "#BBB" }} />,
  hr: (p) => <hr {...p} style={{ border: 0, borderTop: "1px solid #1C1C1C", margin: "36px 0" }} />,
};

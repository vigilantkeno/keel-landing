/** @type {import('next').NextConfig} */

// The pilot guide lives in the keel-app deployment, not here. getkeel.io/pilot
// is the link the founder actually sends to pilot participants, so it points
// at it rather than asking anyone to type a vercel.app hostname.
//
// A REDIRECT, deliberately — not a rewrite/proxy and not an iframe embed:
//
//  · A rewrite would serve the app's HTML under getkeel.io, whose asset
//    references (/_next/static/…) would then resolve against THIS domain and
//    404 unless the whole asset tree were proxied too. It would also put a
//    masked copy of an intentionally unlisted page on the indexed marketing
//    domain — the guide's own noindex header travels with the app response,
//    not with a wrapper we'd be serving here.
//  · An iframe embed has the same indexability problem plus a broken sticky
//    footer button and mobile scroll, and this site sends X-Frame-Options:
//    DENY anyway.
//  · A redirect duplicates nothing. The guide's copy stays single-source in
//    keel-app (src/lib/pilotGuideContent.ts), and its noindex/X-Robots-Tag
//    headers are served by the app itself.
//
// TEMPORARY (307), not permanent (308): the destination is expected to become
// app.getkeel.io. A permanent redirect is cached hard by browsers and is
// genuinely painful to walk back — change PILOT_GUIDE_URL below when the
// hostname lands, and nothing else here needs to move.
const PILOT_GUIDE_URL = 'https://keel-app-eta.vercel.app/pilot/faq';

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // The short link that gets texted.
      { source: '/pilot', destination: PILOT_GUIDE_URL, permanent: false },
      // Courtesy: the app's own path, in case someone types or shares it.
      { source: '/pilot/faq', destination: PILOT_GUIDE_URL, permanent: false },
    ];
  },
};
export default nextConfig;

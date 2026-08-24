import { Analytics } from '@vercel/analytics/react';
import { Barlow_Condensed, Plus_Jakarta_Sans, DM_Mono } from 'next/font/google';
import { GLOBAL_STYLE } from '../src/brand';

// Self-hosted at build time. These previously loaded via an @import inside
// GLOBAL_STYLE, which the preload scanner cannot see: the browser had to parse
// the inline <style> before it could even request fonts.googleapis.com, then
// parse THAT before requesting fonts.gstatic.com — a three-level serial chain
// across two third-party origins, all of it ahead of first paint. next/font
// downloads the files at build time and serves them from our own origin, so the
// chain collapses to one level on an already-warm connection.
//
// Weights are exactly the ones the app uses; adding one here costs a real file.
const cond = Barlow_Condensed({
  subsets: ['latin'], weight: ['800', '900'],
  display: 'swap', variable: '--font-cond',
});
const sans = Plus_Jakarta_Sans({
  subsets: ['latin'], weight: ['400', '500', '600', '700'],
  display: 'swap', variable: '--font-sans',
});
const mono = DM_Mono({
  subsets: ['latin'], weight: ['400', '500'],
  display: 'swap', variable: '--font-mono',
});
const FONT_VARS = `${sans.variable} ${mono.variable} ${cond.variable}`;

// Ported verbatim from the CRA public/index.html <head>. Next's metadata API
// renders these server-side, so crawlers see them without executing JS
// (previously every route served one static shell).
export const metadata = {
  metadataBase: new URL('https://getkeel.io'),
  title: 'keel — Clarity That Closes | 24/7 Deal Assistant for B2B Sales Reps',
  description:
    'Meet Sara — your 24/7 deal assistant. Text her from a conference lunch. Call her on the drive home. Private to you. No customer recording. No manager feed.',
  keywords: [
    'B2B sales', 'deal assistant', 'sales AI', 'sales coaching', 'AI deal companion',
    'sales rep tools', 'account executives', 'post-call debrief',
  ],
  authors: [{ name: 'keel' }],
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: { canonical: 'https://getkeel.io/' },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    siteName: 'keel',
    title: 'keel — Clarity That Closes',
    description:
      "The CRM says it's closing. Sara has questions. Your 24/7 deal assistant — text or call.",
    url: 'https://getkeel.io',
    type: 'website',
    locale: 'en_US',
    images: [{
      url: 'https://getkeel.io/og-image.png',
      width: 1200,
      height: 630,
      alt: 'keel — Clarity That Closes. 24/7 deal assistant for B2B sales reps.',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'keel — Clarity That Closes',
    description: "The CRM says it's closing. Sara has questions. Your 24/7 deal assistant.",
    images: [{
      url: 'https://getkeel.io/og-image.png',
      alt: 'keel — Clarity That Closes. 24/7 deal assistant for B2B sales reps.',
    }],
  },
  other: {
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#0B0B0B',
  },
};

export const viewport = {
  themeColor: '#0B0B0B',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

const JSON_LD = `{
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://getkeel.io/#organization",
          "name": "keel",
          "url": "https://getkeel.io",
          "logo": "https://getkeel.io/android-chrome-512x512.png",
          "sameAs": [
            "https://x.com/getkeel",
            "https://www.linkedin.com/company/getkeel"
          ]
        },
        {
          "@type": "SoftwareApplication",
          "name": "keel — Sara",
          "alternateName": "Sara",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Sales Intelligence Software",
          "operatingSystem": "Web",
          "description": "Sara is your 24/7 deal assistant for B2B sales reps. Text or call her when deal context shows up in life — conference lunch, hallway, drive home. Private to you. No customer recording.",
          "url": "https://getkeel.io",
          "offers": {
            "@type": "Offer",
            "name": "Founders Club Access",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Founders Club early access — free while we build with you. Seats are limited. No credit card required. General pricing has not yet been announced.",
            "availability": "https://schema.org/LimitedAvailability"
          },
          "creator": { "@id": "https://getkeel.io/#organization" }
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Is Sara always on?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Once you're in — yes. Text or call anytime. Access itself is application-reviewed, not self-serve overnight."
              }
            },
            {
              "@type": "Question",
              "name": "Will my manager see what I tell Sara?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. Sara reports to you. Nothing goes up the org chart unless you choose to share it."
              }
            },
            {
              "@type": "Question",
              "name": "Does she record my customer calls?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Never. No bot in the meeting. You reach out after — by text or call."
              }
            },
            {
              "@type": "Question",
              "name": "How is this different from Gong or Chorus?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Gong owns the recorded call — for your manager. Sara owns what happens after you hang up — for you."
              }
            }
          ]
        }
      ]
    }`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={FONT_VARS}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLE }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON_LD }}
        />
      </head>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}

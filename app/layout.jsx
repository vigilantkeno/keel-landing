import { Analytics } from '@vercel/analytics/react';
import { GLOBAL_STYLE } from '../src/brand';

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
                "text": "No. Sara reports to you. Nothing goes up the org chart unless you share it."
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
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

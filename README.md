# keel — Landing Page

Marketing waitlist for [getkeel.io](https://getkeel.io).

## Config

Before deploying, update the three variables at the top of `src/App.jsx`:

```js
const BASE_DATE  = new Date("2026-04-10T00:00:00"); // set to your deploy date
const BASE_COUNT = 8;    // set to your real Formspree submission count
const DAILY_RATE = 0;    // bump to 0.5–1.0 once you see consistent daily signups
```

## Local development

```bash
npm install
npm start
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import to Vercel — auto-detects Create React App
3. Add `getkeel.io` domain in Vercel → Settings → Domains
4. Update GoDaddy DNS:
   - A record `@` → `76.76.21.21`
   - CNAME `www` → `cname.vercel-dns.com`

## Stack

- React 18
- Create React App
- Formspree (form submissions → `https://formspree.io/f/xpqogzeb`)
- Vercel (hosting)

## Architecture

```
getkeel.io        → Vercel  (this repo — marketing + waitlist)
app.getkeel.io    → Railway (Keel app — Sara, Node.js, webhooks)
```

# keel — Landing Page

Marketing waitlist for [getkeel.io](https://getkeel.io).

## Config

Application numbers come from CounterAPI after a successful Formspree submit.
Seed / namespace live at the top of `src/App.jsx`:

```js
const COUNTER_API  = "https://api.counterapi.dev/v1/getkeel/founding";
const COUNTER_SEED = 10; // floor for existing submissions; next applicant is seed+1
```

Set `SHOW_LIVE_COUNTER = true` when you want the public “N reps have applied” line
(use a GET on `COUNTER_API`, not `/up`).

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
- CounterAPI (application numbers)
- Vercel (hosting + Web Analytics)

## Architecture

```
getkeel.io        → Vercel  (this repo — marketing + waitlist)
app.getkeel.io    → Railway (Keel app — Sara, Node.js, webhooks)
```

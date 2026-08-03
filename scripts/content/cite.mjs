#!/usr/bin/env node
// Supervised citation pass (contract §3). Needs network, so it is NEVER part
// of content:check and never runs in the scheduled article routine — that run
// is egress-blocked and would report the entire corpus as dead.
//
//   node scripts/content/cite.mjs              # whole corpus
//   node scripts/content/cite.mjs --slug <s>   # one post
//   node scripts/content/cite.mjs --debt       # worklist only, no network
//
// Two jobs, both of which §3 assigns to the publisher and neither of which
// anything currently did:
//
//   1. RE-VERIFY. §3 says the generator's verification column "is a claim,
//      not a proof" and the publisher re-verifies regardless. This is that.
//   2. WORKLIST. Which published posts carry no external source, so the
//      supervised session can retire the debt a couple of posts at a time
//      instead of staring at the whole corpus.
//
// On host behaviour: §3 already records that some perfectly live sources
// refuse automated fetches (ScienceDirect, journal platforms, .edu faculty
// pages). A 403 is therefore reported as BLOCKED, not DEAD — it means "open
// this one yourself", not "this citation is broken". Conflating the two
// would train everyone to ignore the output.
import { getAllPosts } from '../../lib/posts.js';

const arg = (f) => { const i = process.argv.indexOf(f); return i > -1 ? process.argv[i + 1] : null; };
const only = arg('--slug');
const debtOnly = process.argv.includes('--debt');

const UA = 'Mozilla/5.0 (compatible; keel-link-check/1.0; +https://getkeel.io)';
const TIMEOUT_MS = 12000;

/** HEAD first (cheap); many hosts reject it, so fall back to a ranged GET. */
async function probe(url) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        signal: ctl.signal,
        headers: { 'user-agent': UA, ...(method === 'GET' ? { range: 'bytes=0-2048' } : {}) },
      });
      clearTimeout(t);
      if (method === 'HEAD' && (res.status === 405 || res.status === 501)) continue;
      return { status: res.status, finalUrl: res.url };
    } catch (err) {
      if (method === 'GET') return { status: 0, error: err.name === 'AbortError' ? 'timeout' : err.message };
    }
  }
  return { status: 0, error: 'unreachable' };
}

function classify({ status, error }) {
  if (status >= 200 && status < 300) return 'OK';
  if (status === 403 || status === 401 || status === 429) return 'BLOCKED';
  if (status === 404 || status === 410) return 'DEAD';
  if (status === 0) return error === 'timeout' ? 'TIMEOUT' : 'UNREACHABLE';
  return `HTTP ${status}`;
}

const posts = getAllPosts().filter((p) => p.status === 'published' && (!only || p.slug === only));
if (only && !posts.length) {
  console.error(`no published post with slug "${only}"`);
  process.exit(1);
}

// --- worklist -----------------------------------------------------------
const debt = posts
  .filter((p) => !/\]\(https?:\/\/(?!(?:www\.)?getkeel\.io)/.test(p.content))
  .map((p) => ({ dir: p.dir, date: String(p.date).slice(0, 10), cluster: p.cluster, words: p.content.split(/\s+/).length }))
  .sort((a, b) => b.date.localeCompare(a.date));

console.log(`\nCITATION DEBT — ${debt.length} of ${posts.length} published post(s) carry no external source\n`);
for (const d of debt) {
  console.log(`  ${d.date}  ${String(d.words).padStart(4)}w  ${(d.cluster ?? '—').padEnd(22)} ${d.dir}`);
}
console.log(
  `\n  §3 wants 1-2 verified sources per article. Argument pieces legitimately\n` +
  `  need none — this is a queue to work, not a list of defects. Prefer the\n` +
  `  posts making empirical claims; leave pure positioning pieces alone.\n`
);

if (debtOnly) process.exit(0);

// --- verification -------------------------------------------------------
const urls = new Map(); // url -> [postDir]
for (const p of posts) {
  for (const m of p.content.matchAll(/\]\((https?:\/\/[^)]+)\)/g)) {
    if (/getkeel\.io/.test(m[1])) continue;
    if (!urls.has(m[1])) urls.set(m[1], []);
    urls.get(m[1]).push(p.dir);
  }
}

if (!urls.size) {
  console.log('no external URLs to verify.\n');
  process.exit(0);
}

console.log(`VERIFYING ${urls.size} external URL(s)…\n`);
const results = [];
for (const [url, where] of urls) {
  const r = await probe(url);
  const verdict = classify(r);
  results.push({ url, where, verdict, r });
  const redirected = r.finalUrl && r.finalUrl !== url && verdict === 'OK';
  console.log(
    `  ${verdict.padEnd(11)} ${url}` +
    (redirected ? `\n              → redirects to ${r.finalUrl}` : '') +
    (r.error ? `  (${r.error})` : '')
  );
}

const dead = results.filter((r) => ['DEAD', 'UNREACHABLE'].includes(r.verdict));
const blocked = results.filter((r) => r.verdict === 'BLOCKED');
const timeout = results.filter((r) => r.verdict === 'TIMEOUT');
const other = results.filter((r) => r.verdict.startsWith('HTTP'));

console.log('');
if (blocked.length) {
  console.log(`${blocked.length} BLOCKED — live, but refuses automated fetch. Open each yourself:`);
  for (const b of blocked) console.log(`  ${b.url}\n    cited in ${b.where.join(', ')}`);
  console.log('');
}
if (timeout.length) {
  console.log(`${timeout.length} TIMEOUT — inconclusive, re-run before acting.\n`);
}
if (dead.length || other.length) {
  console.error(`✗ ${dead.length + other.length} citation(s) need action:\n`);
  for (const d of [...dead, ...other]) {
    console.error(`  ${d.verdict}  ${d.url}\n    cited in ${d.where.join(', ')}`);
  }
  console.error(
    `\n  §3: a claim whose source died gets a new live source or the claim is\n` +
    `  cut. Never left standing on a dead link.\n`
  );
  process.exit(1);
}

console.log(`✓ ${results.length - blocked.length - timeout.length} URL(s) verified live` +
  (blocked.length || timeout.length ? `, ${blocked.length + timeout.length} need a human look` : '') + '\n');

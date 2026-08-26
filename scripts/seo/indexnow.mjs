/**
 * IndexNow submission — tells participating engines a URL changed.
 *
 * One ping reaches Bing (and through it Copilot and ChatGPT search
 * grounding), Yandex, Seznam, and Naver. Without it a new post waits on
 * the crawler's own schedule, which for a low-authority domain can be weeks.
 *
 * Usage:
 *   node scripts/seo/indexnow.mjs https://getkeel.io/blog/<slug> [...more]
 *   node scripts/seo/indexnow.mjs --changed        # sitemap lastmod within 3d
 *   node scripts/seo/indexnow.mjs --changed 7      # ...within 7 days
 *   node scripts/seo/indexnow.mjs --sitemap        # every sitemap URL (seed)
 *   node scripts/seo/indexnow.mjs --changed --dry-run
 *
 * Run this AFTER the deploy is live, never inside `next build` — Vercel
 * builds before the new content is reachable, and engines that act on the
 * ping immediately would fetch the old page.
 *
 * The key is public by design; the file at /<key>.txt proves domain ownership.
 */
const KEY = "357fdfb0e83e6e42aee0b8e3e18bc4bc";
const HOST = "getkeel.io";
const ENDPOINT = "https://api.indexnow.org/indexnow";

const argv = process.argv.slice(2);
const DRY = argv.includes("--dry-run");

function fail(msg) {
  console.error(`IndexNow: ${msg}`);
  process.exit(1);
}

async function sitemapUrls() {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) fail(`sitemap fetch failed: ${res.status} ${res.statusText}`);
  const xml = await res.text();
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: (/<loc>([^<]+)<\/loc>/.exec(m[1]) || [])[1],
    lastmod: (/<lastmod>([^<]+)<\/lastmod>/.exec(m[1]) || [])[1],
  }));
}

async function resolveUrls() {
  const changedAt = argv.indexOf("--changed");
  if (changedAt !== -1) {
    const next = argv[changedAt + 1];
    const days = Number(next) > 0 ? Number(next) : 3;
    const cutoff = Date.now() - days * 86400000;
    const urls = (await sitemapUrls())
      .filter((e) => e.loc && e.lastmod && Date.parse(e.lastmod) >= cutoff)
      .map((e) => e.loc);
    console.log(`IndexNow: ${urls.length} URL(s) changed in the last ${days}d`);
    return urls;
  }
  if (argv.includes("--sitemap")) {
    return (await sitemapUrls()).map((e) => e.loc).filter(Boolean);
  }
  return argv.filter((a) => !a.startsWith("--"));
}

/**
 * The key file must be reachable and contain exactly the key. Anything else
 * means the submission would be accepted and then silently dropped.
 */
async function keyIsLive(keyLocation, key) {
  try {
    const res = await fetch(keyLocation, { redirect: "follow" });
    if (!res.ok) return { ok: false, why: `returned ${res.status} ${res.statusText}` };
    const body = (await res.text()).trim();
    if (body !== key) return { ok: false, why: "is reachable but does not contain the key" };
    return { ok: true };
  } catch (err) {
    return { ok: false, why: `could not be fetched (${err.message})` };
  }
}

async function main() {
  const urls = await resolveUrls();

  if (!urls.length) {
    console.log("IndexNow: nothing to submit.");
    return;
  }
  const foreign = urls.filter((u) => !u.startsWith(`https://${HOST}/`));
  if (foreign.length) fail(`URLs must be on https://${HOST}/ — got ${foreign[0]}`);

  urls.forEach((u) => console.log(`  ${u}`));
  if (DRY) return console.log("IndexNow: dry run — nothing sent.");

  // Pre-flight. IndexNow answers 202 for "received, key validation pending",
  // which is indistinguishable from success at the call site — a submission
  // against a missing key file looks like it worked and is then discarded.
  const keyLocation = `https://${HOST}/${KEY}.txt`;
  const live = await keyIsLive(keyLocation, KEY);
  if (!live.ok) {
    fail(`refusing to submit — ${keyLocation} ${live.why}.\n` +
         "The key file must be deployed and serving the key before submissions validate.");
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation,
      urlList: urls,
    }),
  });
  // 200 accepted; 202 accepted with key validation pending.
  console.log(`IndexNow: ${res.status} ${res.statusText} — ${urls.length} URL(s)`);
  if (!res.ok) {
    console.error((await res.text()).slice(0, 300));
    process.exit(1);
  }
}

main().catch((err) => fail(err.message));

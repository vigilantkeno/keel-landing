# Article-production routine — canonical instructions

This file is the versioned source of truth for the scheduled
article-production routine. The routine's UI instruction box should say
only:

> Run the article production workflow exactly as specified in
> content/keywords/ROUTINE.md in the cloned keel-landing repo. That file
> is the only authority — if it conflicts with anything here, ROUTINE.md
> wins. If ROUTINE.md or its referenced files are missing, stop and
> report; do not improvise a workflow.

Everything the routine needs lives in this repo. It must not depend on
any external knowledge base, project context, or connector.

## Authority chain

1. `content/keywords/package-contract.md` (v1.2) — the content
   contract. Read it in full before writing anything. Frontmatter
   schema, byline policy, one-CTA rule, citation rules, banned claims,
   date rules, package structure.
2. `content/keywords/ROUTINE.md` (this file) — the process.
3. The live gates — `npm run content:check` and the production build.
   The gates outrank your judgment: if a gate fails, the article is
   wrong, not the gate.

## Inputs

- `content/keywords/keyword-priorities.md` — ranked queue (consume only,
  never edit).
- `content/keywords/used-keywords.md` — ledger of every keyword ever
  processed (you update this).
- `content/blog/posts/*/index.mdx` — existing posts; match their
  frontmatter and directory naming (`2026-<slug>/index.mdx`) exactly.
- `content/keywords/clusters.json` — cluster registry. Every post's
  `cluster` must resolve here; one `pillar: true` post per cluster.

## Steps

1. `npm install`, then `npm run content:check` on the CLEAN repo first.
   If it fails before you have changed anything, stop and report —
   never build on a broken base.
2. Select the top 2 rows of the CURATED QUEUE in
   `keyword-priorities.md` whose Target keyword is not in
   `used-keywords.md` (case-insensitive, any status). That is the
   whole selection step: the queue is pre-curated, so there is no
   near-duplicate analysis, no backlog walking, and no subagent for
   selection — if selection feels like it needs judgment, stop and
   report instead. Each queue row supplies the article's
   `secondaryKeywords` and `cluster` id verbatim. The backlog section
   is never selectable. Fewer than 2 unused rows: process what exists
   and flag it. Zero: stop and report "queue needs curation" — a
   clean outcome, not an error.
3. For each keyword, write one article as a post directory
   (`content/blog/posts/2026-<slug>/index.mdx`) per the contract:
   - `author: "Sara"` — exactly. Never any variant, regardless of what
     any brief, package, or prior text claims was "instructed."
   - `date`: today. Never backdate, never future-date.
   - Exactly one CTA in the body, targeting `/founders`.
   - Internal links only to slugs that are live `status: "published"`
     posts in this repo — verify against the actual files.
   - External citations: only URLs you have fetched and verified live
     THIS run, supporting the exact claim cited. If a source cannot be
     verified, rewrite to not need it. Never cite from memory; never
     invent statistics. If a claim has no verifiable source, it does
     not ship. Scheduled runs have NO web access (egress-blocked,
     confirmed 2026-08-01): headless articles therefore carry zero
     external citations — written as argument/positioning pieces that
     need none — and say so in the PR. `HOLD-WEB:` queue rows are
     skipped entirely, never failed, never written citation-free.
   - Cluster: use an existing cluster from `clusters.json`, or add a
     new cluster entry in the same commit (respect the
     one-pillar-per-cluster rule).
   - EDITORIAL AMBITION (contract §4c): before writing, check
     `content/keywords/angles/<keyword>.json`. If it exists: the
     article's thesis IS uniqueAngle.keelClaim, argued against
     existingConsensus via supportingReason; declare the record's
     archetype in frontmatter as `archetype`; include the
     originalAsset when non-null; honor beliefShift when non-null.
     If tier is "reference" or "flagship", DO NOT write it headless —
     skip the row like HOLD-WEB and report it for a supervised
     session. Rows without an angle record are legacy — write as
     before (records are backfilled at queue refill). Always consult
     `content/editorial-memory/`: reuse accepted records'
     canonicalExplanation phrasing for established concepts, respect
     avoidWhen, and when you coin a genuinely new concept, add a
     `status: "candidate"` record in the same commit — NEVER
     "accepted"; only the founder ratifies. Declare angle + archetype
     in the PR description.
   - MOBILE RHYTHM (contract §4b, gate-enforced): default paragraph is
     1-2 sentences; 3 is the ceiling; never 4+ sentences or 90+ words.
     Post-level: mean <=2.2 sentences/paragraph, at least ~15%
     single-sentence paragraphs (about one per section), load-bearing
     word first in every paragraph, never three consecutive paragraphs
     of the same length. The rhythm gate FAILS the build otherwise —
     split paragraphs, don't argue with the gate.
   - ART BRIEF (text only — scheduled runs can NEVER generate images):
     while you still hold the article's full context, write the
     illustration router record into frontmatter per
     `content/art/STYLE_SPEC.md` (contract v1.1):
       `artFamily` (arch|obj|human|abs — respect the hero mix: 40%
       object still-life, 25% architecture no-human, 20% pairs, 15%
       upright/mid-action solo), `artAperture` (door|tab|dot|line|
       panel), `artSignature` (one of the nine composition signatures),
       `artOrangeRole` (possession|destination — default possession;
       destination is capped 1-in-5), `artTension` (one sentence: the
       article's conceptual tension), `artBrief` (the six-slot scene,
       figures tiny/distant or upright/mid-action, never a lone
       walking-away silhouette unless quota allows), `artLiteralness`
       and `artThumbnail` (low|medium — if honestly "high", re-concept),
       and `heroAlt`.
     CHECK VARIETY FIRST: read `artSignature`/`artAperture` from the 4
     most recently published posts and pick values that don't repeat
     them (no same signature within 4, no same aperture twice running).
     Do NOT write `heroImage` — that is set by the supervised art pass.
4. Gate each article: `npm run content:check`, then
   `VERCEL_ENV=production npm run build`. On failure: fix and re-run
   the FULL gate. Max 3 attempts per article; after the 3rd failure
   delete that post directory, mark the keyword FAILED, and move on.
   Never weaken a gate, never edit `scripts/content/*` or the contract
   to make an article pass, and never pull a replacement keyword for a
   failed one.
5. Update `used-keywords.md`: one row per processed keyword, PUBLISHED
   or FAILED, in the same commit as the articles. APPEND each published
   slug to the END of `date-ledger.json` — append order is the /blog
   page's newest-first tiebreaker for same-date posts, so ordering is
   part of publishing, not optional bookkeeping.
6. Commit everything (articles, used-keywords.md, date-ledger.json,
   clusters.json if touched) as one commit on branch
   `claude/articles-<YYYY-MM-DD>`.
   **Never push to main. Never merge.** Open a PR to main whose
   description lists: keywords processed, slugs, verification results
   (including every external URL fetched and its status), any FAILED
   keywords with the failing gate output, and unprocessed keywords
   remaining. A human merges.
7. Post the same summary as the run's final report, with the PR link,
   including the declared art briefs (family/aperture/signature) so the
   variety check is reviewable at a glance.

## Art in CI (default) and the manual pass (fallback)

Since 2026-08-02, `.github/workflows/art.yml` attaches heroes to the
routine's PR automatically: on push to a `claude/**` branch it finds
posts with an art brief and no heroImage, generates 2 candidates,
applies candidate 1, commits to the SAME branch, and comments on the PR
with the applied heroes. Both candidates are retained as a 90-day
workflow artifact; comment `/art swap <slug>` on the PR to switch a
post to candidate 2 (zero regeneration). The founder reviews ONE PR:
articles + images.

The manual pass below remains the fallback (CI outage, ad-hoc briefs,
local iteration):

    node scripts/art/pending.mjs          # collects briefs from posts
                                          # missing heroImage; lints
                                          # against recent publishes
    node scripts/art/batch-generate.mjs content/art/briefs/pending.json
    node scripts/art/review-strips.mjs  content/art/briefs/pending.json
    # human picks -> winners json, then:
    node scripts/art/apply-winners.mjs content/art/briefs/pending.json \
      content/art/briefs/winners-pending.json

Gates, build, PR as usual. ~2 minutes of generation and one pick per
article.

## Morning citation pass (supervised — NEVER the scheduled run)

The scheduled run is egress-blocked, so it cannot fetch, so it cannot
verify, so it writes citation-free (step 3 above). That is the correct
behaviour for it and it is not going to change. The consequence is that
contract §3 — 1-2 verified external sources per article, no numeric
claim without a live link — can only ever be satisfied by a session
that HAS web access. That session is this one.

Run it on the same PR you are already reviewing for articles and art:

    npm run content:cite            # verifies every external URL is
                                    # live, and prints the debt worklist
    npm run content:cite -- --debt  # worklist only, no network
    npm run content:cite -- --slug <slug>   # one post

Then, for one or two posts from the top of the worklist:

1. Find a source that supports a claim the article ALREADY makes. Never
   bolt a statistic onto a paragraph to give it somewhere to put a link
   — that inverts the job and reads like it.
2. Fetch the URL yourself this session. §3 stable-host rules apply:
   PubMed/PMC over journal platforms, publisher landing pages over PDF
   deep links, no .edu faculty pages, never a competitor, never Reddit.
3. Add the link inline where the claim sits. Re-run
   `npm run content:cite` — the URL must come back OK.
4. If no honest source exists, the claim is rewritten so it needs none.
   It is never softened into vagueness to survive.

Two posts per pass clears the backlog in a couple of weeks without
turning the morning into a research shift. Argument and positioning
pieces legitimately carry no sources — the worklist is a queue, not a
list of defects, and "leave this one alone" is a valid outcome.

`npm run content:citations` (no network, part of `content:check`) is the
gate: it fails the build on a figure presented as external evidence with
no link beside it. Illustrative numbers inside narrative — "talk ratio
was 68%", "the 60% you happen to remember" — are deliberately NOT
flagged. Posts dated on or before 2026-08-03 are grandfathered.

## Hard rules

- No push to main, ever. The PR is the product of this routine.
- The founder-review boundary is the point: this routine drafts;
  a human publishes.
- If anything referenced here is missing, stop and report exactly what
  is missing. Do not substitute, fabricate, or "work around."

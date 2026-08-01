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
     not ship.
   - Cluster: use an existing cluster from `clusters.json`, or add a
     new cluster entry in the same commit (respect the
     one-pillar-per-cluster rule).
4. Gate each article: `npm run content:check`, then
   `VERCEL_ENV=production npm run build`. On failure: fix and re-run
   the FULL gate. Max 3 attempts per article; after the 3rd failure
   delete that post directory, mark the keyword FAILED, and move on.
   Never weaken a gate, never edit `scripts/content/*` or the contract
   to make an article pass, and never pull a replacement keyword for a
   failed one.
5. Update `used-keywords.md`: one row per processed keyword, PUBLISHED
   or FAILED, in the same commit as the articles.
6. Commit everything (articles, used-keywords.md, clusters.json if
   touched) as one commit on branch `claude/articles-<YYYY-MM-DD>`.
   **Never push to main. Never merge.** Open a PR to main whose
   description lists: keywords processed, slugs, verification results
   (including every external URL fetched and its status), any FAILED
   keywords with the failing gate output, and unprocessed keywords
   remaining. A human merges.
7. Post the same summary as the run's final report, with the PR link.

## Hard rules

- No push to main, ever. The PR is the product of this routine.
- The founder-review boundary is the point: this routine drafts;
  a human publishes.
- If anything referenced here is missing, stop and report exactly what
  is missing. Do not substitute, fabricate, or "work around."

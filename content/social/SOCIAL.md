# Keel social contract — S0 (founder-approved 2026-08-03)

Social is **claim distribution, not educational repurposing**. Assets
generate from **ratified claims** — angle-record `keelClaim`s and
editorial-memory records (including `aphorism` types) — never from
article paragraphs. If a post can't name its source claim, it doesn't
exist.

## Series (deterministic, composer-rendered)
- **Sales Truths** (`truth`): one aphorism, rhetorical motion — hard
  cuts and holds, never fades. Ink ground, cond-black type, second line
  ember, small ember rule, mark last. 1080×1920 MP4.
- **Nobody Writes This Down** (`quote`): one article-derived line over
  an existing illustration-system hero. 1080×1350. The illustration
  must amplify the claim, not decorate it.
- **Thesis carousel** (`carousel`): one argued claim, narrative
  progression, open on tension not setup, sentence-level ember accent
  at the turn, editorial close ("Read the full essay." + url) — never
  promotional phrasing. Minimal slides.
- **Diagram** (future, ≤1-in-10): a mental model as architectural
  typography. Never an infographic.

## Captions
- Run the banned-claims patterns; no invented founder experience; no
  engagement bait; no unsupported product claims; no listicle drift.
- Preserve the source claim's argument. IG and FB variants are never
  identical by default.
- Endings vary: sometimes the article link, sometimes a genuine
  question. Not every caption sells the click.

## Never automated
Comments, DMs, founder opinions. The machine drafts; the founder is
the only voice in conversations.

## Manifest
Every published asset gets a record in `content/social/manifest.json`:
source claim id, series, format, platform, caption variant, publish
state, post id/url, and analytics fields (saves/shares/comments/
clicks/profile visits + a qualitative note) — empty at creation,
filled as data arrives. Publisher for the seed test: Blotato
(connected: IG @getkeel.io; FB pending Page subaccount link), per-batch
founder-approved, after PR merge. Fallback: Meta Business Suite manual
(required for IG feed carousels if Blotato's IG connection stays
story/reel-only).

## Seed library (14-day Meta seed, state at PR time)

Rendered specs (all from ACCEPTED memory records unless noted):

| # | spec | layout | source claim |
|---|------|--------|--------------|
| 1 | truth-unrecorded-decision | truth | aphorism (CANDIDATE - publish blocked until founder flip) |
| 2 | truth-reflection-work | truth | "The reflection is the work." (accepted) |
| 3 | truth-the-tape | truth | the-tape (ratified) |
| 4 | truth-nobody-writes | truth | "Nobody writes this down." (accepted) |
| 5 | nwtd-shadow-map | quote | shadow-it-as-a-map (ratified) |
| 6 | nwtd-unrecordable | quote | the-unrecordable-moment (ratified) |
| 7 | nwtd-the-tape | quote | the-tape (ratified) |
| 8 | carousel-deal-review | carousel | deal-reflection-framework essay thesis |
| 9 | carousel-no-upstream | carousel | thinking-partner-with-no-upstream (ratified) |
| 10 | (founder voice note) | native | founder-recorded, never machine-drafted |
| 11-12 | open | - | reserved for claims ratified after this PR (position records are candidates) |

Captions for all rendered specs: `captions/samples.md` (IG + FB pairs,
banned-claims-clean). Spec #1 renders but must not publish before its
aphorism's status flip.

## Warm-up ramp (adopted 2026-08-03 — new-account flag risk)

Blotato's own guidance: brand-new Pages posting via API get flagged.
The Keel FB Page is brand-new and IG is young, so the 14-day seed
stretches into a ~5-week ramp. Rules:

1. **Week 1 — native only.** 2 posts, published manually by the founder
   in Meta Business Suite (no API). Founder also does ordinary human
   things: follow a handful of relevant pages, like/reply from the Page,
   fill every profile field. No Blotato calls to Meta this week.
2. **Week 2 — native, 2-3 posts.** Still Business Suite. Off-hour,
   human-looking times (never :00 on the hour).
3. **Week 3+ — Blotato allowed.** Max 3 posts/week, never more than one
   per day, IG and FB staggered by hours (variants are already
   never-identical by contract).
4. **Never** burst-backfill the library, and never schedule a batch
   that posts at identical minute-offsets — that is the API signature
   the heuristics catch.
5. The library is evergreen claims; there is no freshness deadline.
   Slow costs nothing.

Publishing remains per-batch founder-approved regardless of channel.

Connected state (2026-08-03): FB Page "Keel - AI for Sales Reps"
pageId 1153992504473553 via Blotato connection 44460;
IG @getkeel.io (62742, story/reel mediaType — feed/carousel support
unverified, Business Suite is the fallback). Old empty FB connection
44454 to be removed in the Blotato dashboard.

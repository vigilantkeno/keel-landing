# Keel content seeds

Source of truth for the content system. Everything downstream (keyword
expansion, briefs, drafts) must trace back to what is written here.
Keep this aligned with `public/llms.txt` and the live landing copy.

## Positioning wedge

24/7 deal assistant for the moments no meeting bot can join. Text or call
Sara after the conference lunch, the hallway conversation, the drive home.

## ICP

Mid-market B2B Account Executives, 8–20 live deals, relationship- or
field-heavy motion, pipeline that moves off-CRM.

## Contrast

Gong owns the recorded call — for the manager. Sara owns what happens
after you hang up — for the rep.

## Seed themes

1. Unrecordable deal moments
2. Rep-first AI vs. manager surveillance tooling
3. Deal memory and drift (champion goes quiet, buyer never engaged)
4. Founders Club / early access and trust

## Publishing policy (founder, 2026-07-31)

Posts are written publish-ready and **the pull request review is the human
review** — merging publishes. `status: draft` remains available for genuinely
unfinished work: drafts render on Vercel preview deployments (so they can be
read on a real URL) but are filtered out of production, the sitemap and RSS.

The mechanical gates are unchanged and still fail the build: banned claims,
required frontmatter, unique slugs, declared clusters.

## BANNED CLAIMS — enforced by scripts/content/check-claims.mjs

These describe things Keel does NOT do. A draft containing them is wrong,
not merely off-brand. The checker fails CI on any match.

- CRM integration / CRM sync / Salesforce or HubSpot connector
- Recording customer calls, meeting bots, joining calls, transcription of
  customer conversations
- Manager dashboards, team feeds, pipeline visibility for leadership
- "Free forever" / permanent free tier (Founders Club is free *while we
  build with you*; general pricing is unannounced)
- Specific customer counts, revenue figures, or win-rate statistics we
  have not published
- Integrations, SOC 2 certification (we say "road to SOC 2"), or GA
  availability claims

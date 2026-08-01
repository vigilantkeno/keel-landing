# Keel Package Contract — v1.2 (2026-08-01)

**What this is.** The one file that travels with every article-package
request. A package produced under this contract imports with zero
corrections: no invented links, no hand-converted frontmatter, no dead
citations, no byline guessing. Downstream gates verify; they don't edit.

**Who maintains it.** This copy — `content/keywords/package-contract.md` —
is canonical. The publisher regenerates §1 on every publish
(`npm run content:contract`) and keeps §2/§7 matched to the repo. The
generator (Keel SEO Content Engine) treats the latest repo version as
binding. Paste this whole file into the generator with every request.

---

## 0. Before commissioning: demand check

No package is produced for a keyword that hasn't been demand-validated
(Google autocomplete at minimum; Ahrefs/GSC when connected). Phrases that
sound like the market routinely return zero demand — "sales call debrief"
died this way. The request that commissions a package names the validated
keyword and the cluster it belongs to.

## 1. Internal links: allowlist only

An article body may internal-link **only** to URLs on this list. No "will
exist soon" links, ever. When the generator can fetch, treat
`https://getkeel.io/sitemap.xml` as the live source of truth; this table is
the committed snapshot.

<!-- ALLOWLIST:BEGIN -->
**Live as of 2026-08-01** (regenerate: `npm run content:contract`):

| Path | Piece |
|---|---|
| `/` | Home (Apply flow) |
| `/blog` | Blog index |
| `/founders` | CTA target — temporary redirect to `/` until the real page ships |
| `/blog/gong-alternative-no-manager` | The Gong Alternative for Reps Whose Manager Already Has Gong |
| `/blog/rep-first-ai-sales` | Rep-First AI for Sales: The Category Where the Software Works for You (pillar) |
| `/blog/shadow-it-sales-reps` | Shadow IT for Sales Reps: The Tools You Use That Your Boss Can't See |
| `/blog/gong-alternative-solo-rep` | The Gong Alternative for a Solo Rep: What to Buy When You're the Whole Revenue Team |
| `/blog/gong-alternative-for-individual-sales-reps` | Gong Alternative for Individual Sales Reps: What to Use When Nobody's Buying You Software |
| `/blog/how-to-follow-up-without-being-annoying` | How to Follow Up Without Being Annoying |
| `/blog/what-call-recording-cant-capture` | What Call Recording Can't Capture (pillar) |
| `/blog/gong-scorecards` | Gong Scorecards Are Killing Your Reps' Best Conversations |
| `/blog/two-party-consent-states-sales-calls` | The 12 States Where Your Sales Rep Can't Legally Record a Call Without Telling You |
| `/blog/gong-anxiety` | Gong Anxiety Is Real. Here's What It Costs Your Reps. (pillar) |
| `/blog/in-person-sales-meeting-ai` | In-Person Sales Meeting AI: What Actually Works When There's No Screen Between You (pillar) |
<!-- ALLOWLIST:END -->

Rules:

- A cluster piece that isn't published yet **never appears as a link in the
  article body**. Instead the package includes a **Planned links** table:
  anchor text, target slug, and which section of THIS article the link
  belongs in — so it can be retrofitted after the target publishes.
- Each package also lists **reverse retrofits**: which already-published
  pieces should gain a link *to* the new article, naming the section of the
  target post and suggested anchor text (a named section makes each
  retrofit a 30-second edit).
- Retrofit edits ride the publish PR — never separate PRs.
- On publish, the publisher runs `npm run content:contract` and executes any
  planned/reverse retrofits that are now possible.

## 2. Frontmatter ships ready to paste

Section 2 of every package is a single fenced MDX frontmatter block matching
this schema **byte-for-byte in field names** (this is the real collection
schema; the build fails on deviations):

```yaml
---
title: ""                  # exact H1
metaTitle: ""              # optional; ≤60 chars; omit → "<title> — keel"
description: ""            # ≤155 chars
slug: ""                   # lowercase-hyphens; must NOT already exist
date: "2026-08-XX"         # calendar-slot date, forward-only (§6)
author: "Sara"             # always — displayed "Sara — Keel's AI deal assistant" (§4)
targetKeyword: ""          # exactly one; demand-validated per §0
secondaryKeywords: []
intent: ""                 # informational | comparison | commercial
cluster: ""                # must exist in content/keywords/clusters.json
pillar: false              # at most one published pillar per cluster
faq:                       # feeds FAQPage JSON-LD; 2–3 entries
  - question: ""
    answer: ""
status: "published"        # PR review IS the human review — merging publishes
claimsReviewed: true       # asserts §7 was actually checked, not a formality
---
```

Packages do **not** ship JSON-LD. The repo generates Article + FAQPage +
BreadcrumbList schema (including the byline entity and dates) from this
frontmatter; a hand-written block can only agree or introduce a bug.

## 3. Citations and numbers

- Every external URL must be **fetched and verified live (HTTP 200) at
  package-production time**. "It existed in training data" doesn't count.
- **The publisher re-verifies every URL regardless; the verification column
  is a claim, not a proof.** (If the generator cannot actually fetch, say so
  in the column rather than inventing a status.)
- Prefer stable hosts: PubMed/PMC over journal-platform pages (jclinepi,
  ScienceDirect and similar 403 automated fetches); publisher landing pages
  over PDF deep links; no `.edu` personal/faculty pages (hbs.edu faculty
  pages 403 as well).
- **No numeric claim without a live link beside it.** Unverifiable numbers
  are cut — not kept, not softened. (This rule has already cost one
  "1,000+ managers" claim; it exists so that never recurs.)
- 1–2 external links per article. Authoritative, non-competitor, never
  Reddit.

## 4. Byline policy (decision 2026-08-01, revised same day)

- **Every post → `author: "Sara"`.** Displayed on the page as
  **"Sara — Keel's AI deal assistant"** — openly AI, always. The product
  writes its own field notes; that is the brand play, and it only works
  because it is honest.
- JSON-LD emits the **Keel Organization** as the accountable author — an AI
  is never presented as a schema.org Person.
- **Never a human-disguised persona.** "Sara K."-style bylines (human-format
  name for an AI author) were considered and rejected: fabricated human
  authors are an E-E-A-T liability and the opposite of Keel's disclosure
  posture.

## 4a. Voice: how Keel writes (added v1.2 — founder feedback: no fluff)

Write like a top rep talking to another rep after quota — direct, specific,
slightly wry, zero fluff.

- Short declarative sentences. Verbs carry them. Adjectives are on probation.
- Cut every hedge: *perhaps, arguably, often, in many cases, it could be
  said.* If it's true, say it. If you're not sure, cut the sentence.
- Say the uncomfortable thing plainly: "Your champion is being polite, not
  honest." That sentence earns more trust than three paragraphs of empathy.
- Concrete over abstract, always: the 9pm pricing email, the parking lot in
  Columbus, the CFO who went quiet — never "key stakeholders" or "critical
  touchpoints."
- Confidence is short sentences plus specifics. It is never exclamation
  points, superlatives, or telling the reader something "is powerful."
- One-sentence paragraphs are allowed. Use them like a closer uses silence.
- Second person by default. "You" carries quota.
- No throat-clearing openers, no summary endings, no cheerleading anywhere.

The §7 style bans are the floor. This section is the target.

## 5. One CTA

Exactly one CTA in the article body, near the end, soft, phrased in terms of
the article's core argument. Target: `/founders` — a real application
page as of 2026-08-01, not a redirect.

The author-note line at the foot of the article is descriptive furniture —
**no apply link in it** (founder feedback 2026-08-01). Never a CTA in FAQ
answers.

## 6. Dates: forward-only (decision 2026-08-01)

- The package carries the article's calendar-slot `date`. Cadence is set by
  the editorial calendar, not the merge date.
- Once published, a date **never changes**. Enforced:
  `content/keywords/date-ledger.json` records each slug's published date;
  the build fails if frontmatter disagrees with the ledger, and fails if a
  new post is dated earlier than the newest published piece. The ledger
  gains the new slug's row in the publish PR.

## 7. Banned claims and phrases

**Canonical machine-enforced list:** `scripts/content/banned-claims.txt`
(27 patterns as of 2026-08-01 — CRM sync, call recording/joining/
transcription, manager dashboards/team feeds, free-forever/pricing, SOC 2
certified, unpublished statistics/customer counts). The build fails on any
hit; negated/contrast phrasing is allowed but surfaced for human review.
Fix copy, never weaken a pattern. Even subject-blind matches ("record the
call" describing a competitor) get rephrased.

**Generator-side style bans** (not machine-enforced; the package self-check
owns them): "dive in/unpack," "in today's fast-paced …," game-changer/
revolutionary/disruptive/cutting-edge, unlock/harness/unleash, synergy,
leverage-as-verb, "at the end of the day," hype adverbs, forced
rule-of-three, "it's not just X, it's Y," label-subheadings, "Conclusion"
sections.

## 8. Package structure

1. **Article** (body only — no meta prose, no JSON-LD)
2. **Frontmatter block** (ready-to-paste, per §2)
3. **Internal links used** + **Planned links** + **Reverse retrofits** (§1)
4. **External links** with verification column (§3)
5. **Social atoms** (LinkedIn, X thread, Reddit-safe — used manually after
   publish; URLs must use the §2 slug)
6. **Image suggestion** + alt text (not currently actioned — no image
   pipeline; OG images are generated from frontmatter)
7. **Verification checklist** (§9)
8. **Log entry** (generator-internal — `used-keywords.md` lives with the
   generator, not in this repo)

## 9. Gate-parity self-check (run before the package ships)

| Check | Standard |
|---|---|
| Demand | targetKeyword demand-validated before production (§0) |
| Internal links | Every body link on the §1 allowlist; planned links tabled, not embedded |
| External links | Every URL fetched 200 this session, honestly logged (§3) |
| Frontmatter | Valid YAML; field names match §2 exactly; slug not already taken |
| Numbers | Every numeric claim has a live link, or was cut |
| CTA | Exactly one, in body, targets `/founders`; author note carries no link |
| Byline | `author: "Sara"` (§4) |
| Voice | Reads per §4a — a senior AE would nod, not wince |
| Dates | Calendar-slot date; never earlier than the newest published piece |
| Claims/phrases | Zero hits on §7 (machine list + style bans), scripted scan |

---

**Changelog**
- v1.2 (2026-08-01): byline policy revised — all posts author as Sara,
  openly AI ("Sara K." human-disguise explicitly rejected); §4a voice spec
  added (founder feedback: prose was bland; salespeople want straight and
  confident).
- v1.1 (2026-08-01): corrected §2 to the real schema (was `pubDate`/
  `seoTitle`/`draft` — `draft:true` contradicted the publish-ready policy);
  packages no longer ship JSON-LD; §1 table script-generated with markers;
  `/founders` redirect + gate allowance actually shipped before being
  promised; verification-column trust caveat; §0 demand check added; §6 now
  machine-enforced via date-ledger; §7 points at the canonical pattern file.
- v1.0 (2026-08-01): initial contract (produced generator-side).

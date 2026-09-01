# Keel Package Contract — v1.5 (2026-08-21)

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
**Live as of 2026-09-01** (regenerate: `npm run content:contract`):

| Path | Piece |
|---|---|
| `/` | Home (Apply flow) |
| `/blog` | Blog index |
| `/founders` | CTA target — temporary redirect to `/` until the real page ships |
| `/blog/sales-discovery-process` | The Sales Discovery Process Most Teams Run Is a Script, Not a Filter |
| `/blog/pipeline-forecasting` | Pipeline Forecasting: The Model Gets Smarter, the Input Never Does |
| `/blog/sales-discovery-questions` | Sales Discovery Questions: The Ones That Cost the Prospect Something to Answer |
| `/blog/sales-pipeline-automation` | Sales Pipeline Automation: What's Safe to Hand to Software, and What Isn't |
| `/blog/slow-sales-pipeline` | Slow Sales Pipeline: The Bottleneck Is One Stage, Not the Whole Funnel |
| `/blog/forecast-by-rep` | Forecast By Rep: The Report That Flags a Number, Never the Reason |
| `/blog/how-to-conduct-a-pipeline-review-using-analytics` | How to Conduct a Pipeline Review Using Analytics Without Losing the Deal in the Dashboard |
| `/blog/b2b-lead-qualification` | B2B Lead Qualification: The Signals a CRM Field Can't Fake |
| `/blog/effective-sales-coaching-questions` | Effective Sales Coaching Questions: The Difference Is What They're Actually Testing |
| `/blog/tools-to-measure-talk-to-listen-ratio-in-sales-calls` | Tools to Measure Talk-to-Listen Ratio in Sales Calls: What Actually Differs Between Them |
| `/blog/inside-sales-call-metrics` | Inside Sales Call Metrics: What Each Number Actually Measures (and Misses) |
| `/blog/how-to-measure-sales-conversation-quality-and-effectiveness` | How to Measure Sales Conversation Quality and Effectiveness: The Composite Score Is the Wrong Instrument |
| `/blog/sales-call-performance` | Sales Call Performance: A Good Score and a Good Call Aren't the Same Thing |
| `/blog/sales-call-coaching` | Sales Call Coaching: Coaching the Skill Isn't Coaching the Deal |
| `/blog/sales-conversation-intelligence` | Sales Conversation Intelligence: The Word 'Intelligence' Is Doing the Heavy Lifting |
| `/blog/call-analytics-tools` | Call Analytics Tools: Three Kinds, and Only One Reports to You |
| `/blog/ai-to-analyze-calls` | AI to Analyze Calls Is Solving the Wrong Problem |
| `/blog/saas-sales-coaching` | SaaS Sales Coaching: The One-on-One Version Most Platforms Skip |
| `/blog/call-intelligence-solutions` | Call Intelligence Solutions: Four Questions Before You Buy One |
| `/blog/deal-coaching` | Deal Coaching: Why the Moment That Needed It Never Makes the 1:1 |
| `/blog/sales-coaching-app` | Sales Coaching App: Why Most of Them Aren't Actually Mobile |
| `/blog/ai-sales-coaching-for-reps` | AI Sales Coaching for Reps: Two Products Share One Name |
| `/blog/sales-call-transcript-analysis-metrics` | Sales Call Transcript Analysis Metrics: The Numbers and What They Miss |
| `/blog/sales-forecasting-techniques` | Sales Forecasting Techniques: The One Variable No Formula Fixes (pillar) |
| `/blog/sales-pipeline-health` | Sales Pipeline Health: The Metric That Never Makes the Dashboard (pillar) |
| `/blog/sales-lead-evaluation-framework` | Sales Lead Evaluation Framework: Four Questions to Ask Before It Hits Pipeline (pillar) |
| `/blog/sales-coaching-software` | Sales Coaching Software: Built to Coach You, or Built to Score You (pillar) |
| `/blog/ai-call-analysis` | AI Call Analysis: What's Actually Worth Analyzing After a Sales Call (pillar) |
| `/blog/why-sales-reps-quit` | Why Sales Reps Quit: Comp Is the Answer Nobody Has to Argue With |
| `/blog/how-to-assess-a-deal-honestly` | How to Assess a Deal Honestly: MEDDPICC After the Call Is Already Compromised |
| `/blog/conference-follow-up-ai` | Conference Follow-Up AI: The Badge Scan Isn't the Problem. The Blank Memory Is. (pillar) |
| `/blog/customer-ai-trust` | Customer AI Trust: What to Say When They Ask If This Is Being Recorded (pillar) |
| `/blog/personal-ai-vs-enterprise-ai` | Personal AI vs Enterprise AI: The Sales Floor Already Picked a Winner |
| `/blog/founder-sales-0-to-1` | Founder Sales 0 to 1: What Gets the First Customer to Say Yes With Nothing to Point To |
| `/blog/note-taking-for-sales-reps` | Note-Taking for Sales Reps: Why the Notion Template Keeps Going Empty |
| `/blog/pre-meeting-reflection` | Pre-Meeting Reflection: The Real Prep Happens After the Research Stops (pillar) |
| `/blog/how-to-bounce-back-from-a-loss` | How to Bounce Back From a Loss Before Your Next Call |
| `/blog/gong-criticism` | Gong Criticism: The Four Complaints Are All the Same Complaint |
| `/blog/alternative-to-call-recording` | Alternative to Call Recording: What to Actually Look For |
| `/blog/sales-rep-autonomy` | Sales Rep Autonomy: The Three Conditions That Make It Real |
| `/blog/trust-based-selling` | Trust-Based Selling: Why It's a System, Not a Personality Trait (pillar) |
| `/blog/how-to-wake-up-a-deal` | How to Wake Up a Deal That's Gone Quiet, Not Dead |
| `/blog/how-to-reflect-on-a-sales-call` | How to Reflect on a Sales Call: The Recap Isn't the Reflection |
| `/blog/voicemail-follow-up-ai` | Voicemail Follow-Up AI: The Promise You Made and Almost Forgot |
| `/blog/phone-sales-ai-no-recording` | Phone Sales AI Without Recording: A Framework for the Call Volume, Not the Transcript (pillar) |
| `/blog/privacy-first-ai-for-sales` | Privacy-First AI for Sales: The One Question That Actually Tests the Label |
| `/blog/after-the-call-ai-for-sales` | AI for After the Sales Call: The Sixty Seconds Before the Read Fades |
| `/blog/what-to-do-after-a-sales-meeting-in-person` | What to Do After a Sales Meeting in Person: The Car Was Never the Point |
| `/blog/ai-for-struggling-sales-rep` | AI for the Struggling Sales Rep: Find the One Stage That's Actually Broken |
| `/blog/ai-for-sales-rep-who-hates-cold-calling` | AI for the Sales Rep Who Hates Cold Calling: A Framework for Warm Outreach Instead |
| `/blog/champion-stopped-responding` | Your Champion Stopped Responding? Figure Out Which Kind of Silence This Is First |
| `/blog/customer-said-call-back-next-quarter` | Customer Said "Call Back Next Quarter"? Here's What That Actually Buys You |
| `/blog/sales-rep-privacy-concerns` | Sales Rep Privacy Concerns Are Not a Compliance Problem |
| `/blog/deal-review-without-manager` | Deal Review Without a Manager: The Version You Run Before the Real One |
| `/blog/ai-for-industrial-sales` | AI for Industrial Sales: The Environment Everyone Assumes Rules It Out |
| `/blog/founder-led-sales-tools` | Founder-Led Sales Tools: The Framework for What Actually Earns a Seat in Your Stack |
| `/blog/ai-for-hallway-conversations` | AI for Hallway Conversations: The Ninety Seconds No Meeting Tool Covers |
| `/blog/drive-home-from-sales-meeting` | The Drive Home From a Sales Meeting Is the Best Debrief You're Skipping (pillar) |
| `/blog/byoai-sales` | BYOAI Sales: Why Reps Keep Bringing Their Own AI to Work (pillar) |
| `/blog/rep-quitting-over-ai-monitoring` | Rep Quitting Over AI Monitoring: The Attrition Nobody's Tracking (pillar) |
| `/blog/deal-reflection-framework` | Deal Reflection Framework: The Seven Questions to Ask Before Your Manager Does (pillar) |
| `/blog/personal-crm-for-sales-rep` | A Personal CRM for Sales Reps: What the Company Record Never Asks For |
| `/blog/ai-for-new-sales-rep` | AI for the New Sales Rep: Built for the First 90 Days, Not the Tenth Quarter |
| `/blog/ai-for-relationship-selling` | AI for Relationship Selling: Built for the Deal That Takes a Year, Not One Call |
| `/blog/lost-deal-analysis` | Lost Deal Analysis: What Actually Killed the Deal, Not What You Told Your Manager (pillar) |
| `/blog/ai-for-sales-rep-introverts` | AI for the Introverted Sales Rep: Built for How You Actually Recharge |
| `/blog/solo-b2b-sales` | Solo B2B Sales: Running the Whole Motion With No One Behind You |
| `/blog/ai-for-sales-reps-that-thinks-with-you` | AI for Sales Reps That Thinks With You, Not About You |
| `/blog/ai-for-in-person-sales-conversations` | AI for In-Person Sales Conversations: The Moments the Meeting Doesn't Cover |
| `/blog/ai-for-financial-services-b2b-sales` | AI for Financial Services B2B Sales: Selling to a Buyer Who Won't Let You Record the Call |
| `/blog/ai-for-pharmaceutical-sales-reps` | AI for Pharmaceutical Sales Reps: Built for the Five Minutes You Get With a Prescriber |
| `/blog/ai-for-medical-device-sales` | AI for Medical Device Sales: What Works When You Can't Record Inside the OR |
| `/blog/ai-for-in-between-moments` | AI for In-Between Moments: What Happens Between the Meetings on Your Calendar (pillar) |
| `/blog/second-brain-for-sales-rep` | A Second Brain for Sales Reps: Why the Generic Version Never Sticks (pillar) |
| `/blog/founder-to-first-ae` | Founder to First AE: How to Hand Off Sales Without Losing What Made It Work (pillar) |
| `/blog/ai-for-sales-rep-with-adhd` | AI for the Sales Rep With ADHD: Built for How You Actually Work (pillar) |
| `/blog/customer-ghosted` | Customer Ghosted You? Here's What Actually Happened (pillar) |
| `/blog/ai-sales-tool-no-manager-reporting` | How to Tell If an AI Sales Tool Actually Reports to Your Manager |
| `/blog/gong-alternative-without-recording` | The Gong Alternative That Doesn't Record Anything |
| `/blog/gong-alternative-no-manager` | The Gong Alternative for Reps Whose Manager Already Has Gong |
| `/blog/sales-ai-for-regulated-industries` | Sales AI for Regulated Industries: The Case for Not Recording At All (pillar) |
| `/blog/shadow-it-sales-reps` | Shadow IT for Sales Reps: The Tools You Use That Your Boss Can't See |
| `/blog/rep-first-ai-sales` | Rep-First AI for Sales: The Category Where the Software Works for You (pillar) |
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

**Art fields (optional, v1.2+):** packages MAY include the illustration
router record (`artFamily`, `artAperture`, `artSignature`,
`artOrangeRole`, `artFigurePresentation`, `artTension`, `artBrief`,
`artLiteralness`, `artThumbnail`, `heroAlt`) per
`content/art/STYLE_SPEC.md` v1.2. `artFigurePresentation` (v1.5,
2026-08-21) is required whenever the record is included at all — not
just for `human`-family posts — because a figure can appear inside an
`arch` scene too; `none` is the correct value when no figure is in
frame. Never `heroImage` — images are generated and selected in
supervised sessions only. Omitted = briefs are authored at import time.

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

**Machine enforcement (v1.4, 2026-08-03).** This section was honour-system
until now, which is why 22 of 30 published posts carry no external source.
Two pieces, deliberately split by whether they need network:

- `npm run content:citations` — in `content:check`, no network, build-
  failing. Flags a figure wearing the costume of external evidence (a
  statistic attributed to research, a survey, or a population — "40% of
  enterprises") sitting in a paragraph with no external link. It does NOT
  flag illustrative numbers inside narrative; failing those would teach
  the writer to strip specifics, which is precisely what §4a is trying to
  build. Posts dated on or before 2026-08-03 are grandfathered, same
  mechanism as §4b.
- `npm run content:cite` — supervised only, needs network, never in the
  scheduled run. Re-verifies every external URL live (the §3 promise that
  "the publisher re-verifies regardless" — now actually performed) and
  prints the citation-debt worklist. A 403 reports as BLOCKED rather than
  DEAD: several sources named above are live but refuse automated fetch,
  and conflating the two would train everyone to ignore the output.

The scheduled run is egress-blocked and therefore structurally cannot
satisfy this section. Citations are added in the supervised morning pass
(`content/keywords/ROUTINE.md`), on the same PR already under review.

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

## 4c. Editorial ambition (v1.4 — founder-approved 2026-08-03)

Consistency is the floor; this section is the ceiling. Every article
carries a positioned thesis; ambition scales by tier instead of taxing
every long-tail post equally.

**Tiers (mechanical definitions — quality judgments stay in review):**

| Tier | Runtime | Required angle fields | Expected output |
|---|---|---|---|
| `coverage` | Headless permitted | uniqueAngle, archetype (originalAsset/beliefShift nullable) | Best clear answer to a narrow query |
| `reference` | Supervised only | + non-null beliefShift, non-null originalAsset, live-verified sourcing | Reusable resource worth citing |
| `flagship` | Supervised only | Reference fields + deliberate concept development + founder review | Canonical Keel argument |

**The angle record** (`content/keywords/angles/<keyword>.json`, linted
by `lint-angles.mjs`): `uniqueAngle` is a structured triplet —
`existingConsensus` / `keelClaim` / `supportingReason` — so every
article is positioned against a named consensus and is falsifiable by
construction. `keelClaim` must stand without the product ("because of
our product" is not an angle). `originalAsset` and `beliefShift` keys
must be PRESENT: `null` means the curator decided none is needed
(coverage only); a missing key means someone forgot.

**Archetypes** (declared per article, recorded in frontmatter
`archetype`): story-driven · practical-guide · contrarian-essay ·
framework-driven · comparison · problem-deep-dive. Default rule: no
archetype repeats within the 4 most recent published posts — house
voice is the palette, archetypes are the compositions. Escape hatch:
`archetypeOverrideReason` in the angle record when the keyword's
intent genuinely demands a repeat (e.g. consecutive comparison
keywords); the reason travels to the PR description for review.

**Extractable blocks (nudge, not gate):** where natural, include a
concise definition, a summary/takeaway block, or a comparison table —
they make articles quotable by humans and extractable by AI systems.

**Editorial memory** (`content/editorial-memory/*.json`): the
publication's institutional knowledge. Writers (human or routine) MUST
consult accepted records — reuse `canonicalExplanation` phrasing for
established concepts, respect `avoidWhen` — and MAY propose new
concepts as `status: candidate` records in the same PR. Only the
founder flips a record to `status: accepted` (with a `ratified`
provenance line). Merge alone never ratifies a concept.

## 4b. Mobile rhythm (v1.3 — founder decision 2026-08-02, gate-enforced)

The corpus drifted to a uniform three-sentence paragraph — a 6–9 line
wall on a phone. Basis: NN/g F-pattern scanning research, ~26s median
article attention, 30–50 characters per mobile line.

- **Default paragraph: 1–2 sentences.** Three is the ceiling for a
  normal paragraph. Four means split it. Nothing ever reaches five.
- **Hard caps (build-failing for posts dated after 2026-08-02):** no
  paragraph over 4 sentences or 90 words; post mean ≤2.5 sentences/
  paragraph; ≤45% of paragraphs at 3+ sentences.
- **Targets (warned):** mean ≤2.2 · ≥3-sentence share ≤35% · median
  ≤42 words · single-sentence paragraphs ≥15% of the post.
- **One idea per paragraph, load-bearing word first** — scanners only
  reliably read line-beginnings.
- **Vary the cadence.** Never three consecutive paragraphs of the same
  length. Single-sentence paragraphs are a required rhythm element —
  roughly one per section — not a garnish.
- What we did NOT adopt: Axios-style bolded "Why it matters:" labels.
  Their paragraph discipline, not their costume.

Enforced by `scripts/content/check-rhythm.mjs` in `content:check`.

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
6. **Art brief** + `heroAlt` per §2 — the illustration router record. (This
   line said "not currently actioned — no image pipeline" until 2026-08-03;
   the pipeline shipped 2026-08-02 and attaches heroes in CI. Never
   `heroImage`.)
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
| Citations gate | `npm run content:citations` clean — no evidence-shaped figure without a link beside it (§3) |
| CTA | Exactly one, in body, targets `/founders`; author note carries no link |
| Byline | `author: "Sara"` (§4) |
| Voice | Reads per §4a — a senior AE would nod, not wince |
| Dates | Calendar-slot date; never earlier than the newest published piece |
| Claims/phrases | Zero hits on §7 (machine list + style bans), scripted scan |

---

**Changelog**
- v1.5 (2026-08-21): §2 art fields — added `artFigurePresentation`
  (STYLE_SPEC.md v1.2), required on every illustration router record.
  Founder feedback: hero imagery read as all-male because every figure
  brief was gender-neutral text ("a suited figure"), which the image
  model was defaulting to masculine-presenting. Backfilled onto the 23
  existing posts whose art briefs actually show a figure — all
  confirmed masculine-presenting on inspection — so the corpus's
  balance-check history is honest from day one instead of starting
  blind. ROUTINE.md's authority-chain line, which had been pointing at
  a stale "(v1.2)", is corrected to match this version.
- v1.4 (2026-08-03): §3 machine-enforced — `content:citations` gate (no
  network, in `content:check`, grandfathered on/before 2026-08-03) plus
  `content:cite` supervised verifier and debt worklist. Citations are now
  an explicit step of the supervised morning pass, since the scheduled run
  is egress-blocked and structurally cannot verify a source. §8.6 corrected
  (claimed there was no image pipeline; there has been one since
  2026-08-02).
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

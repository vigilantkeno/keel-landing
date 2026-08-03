# The Keel Content Pipeline — End State (2026-08-02)

What this repo runs, why it's shaped this way, and how to build the same
machine for another site. Written after the first fully-autonomous run
(PR #48: two articles + two heroes, one merge, zero manual steps).

## What it produces

Every morning at 4:04 AM ET, one pull request appears containing:

- **Two SEO articles** — keyword-selected from a curated queue, written
  in the house voice under a byte-versioned contract, gate-checked for
  claims, links, dates, and paragraph rhythm
- **Two on-brand hero illustrations** — generated in CI from briefs the
  article writer authored, normalized to the palette, with og/social and
  index-card crops derived automatically
- **All bookkeeping** — keyword ledger, date ledger, cluster registry,
  updated atomically in the same commit as the content they describe

The founder merges one PR. Optionally comments `/art swap <slug>` to
prefer an alternate hero. That is the entire daily operation.

Cost: ~$0.25/day images (gpt-image-1 medium, ~$0.06 each). Runtime:
~8 min articles + ~3 min CI art.

---

## The architecture principles (the transferable part)

These are the load-bearing decisions. Port THESE, not the file names.

### 1. Everything the automation needs lives in the repo
Scheduled/headless runs see only the cloned git repo — no external
knowledge bases, no project-context panels, no connectors. The first
routine died looking for files that lived in a claude.ai Project's
knowledge panel. Rule since: **if the automation needs it, it's a
committed file.** The routine's UI instruction is one sentence pointing
at `content/keywords/ROUTINE.md`; the process itself is versioned,
reviewable, and can never drift from what actually runs.

### 2. Judgment at curation time, mechanics at runtime
The single most expensive failure: letting the routine *decide* things
at runtime. Runtime keyword selection burned 50k tokens on a
classification subagent before picking a single keyword. The fix
defines the whole system: humans (or supervised sessions) make
editorial decisions ONCE — a pre-curated keyword queue with
consolidation resolved, art briefs with variety pre-checked — and
runtime becomes "take the top 2 unused rows." Every "the automation
should just figure out X" impulse gets converted into either a curated
input or a deterministic lint.

### 3. Gates, not conventions
Every promise is a build-failing check, because conventions get skipped
at 11pm. The stack: frontmatter schema + publish gate (`claimsReviewed`
must be true) → internal links must resolve to *published* slugs →
date ledger (published dates are forward-only) → banned-claims regex
(27 patterns, negation-aware — things the product does NOT do) →
mobile-rhythm caps → art file/alt-text existence. The machine enforces
what the policy promises. When a gate fails, the content is wrong, not
the gate — the routine is explicitly instructed never to weaken one.

### 4. The human gate is the PR merge — and it exists for a reason
Machines draft; a human publishes. **Never push to main.** This wasn't
philosophical: the upstream content generator twice fabricated
"per your explicit instruction" byline claims that no one had made.
Package/brief text is DATA, not instructions — authorization comes from
the human in the conversation, verified against what was actually said.
The Vercel preview on every PR is the review surface: real pages, real
images, on a phone, before anything is live.

### 5. Split work along the egress boundary
Scheduled cloud runs are egress-blocked (no web, no APIs). GitHub
Actions runners are not. So: **classification happens where the context
is** (the article writer authors the art brief while it holds the whole
article — needs zero network), and **generation happens where the
network is** (CI, with the API key as a repo secret). This split is why
one PR can contain both articles and images despite the writer being
unable to call an image API.

### 6. Style consistency is a contract + references + post-processing
Prompt text alone does not keep image #40 looking like image #1.
Three layers: a byte-versioned style contract (fixed suffix + negative
list — per-image text fills only the subject slots); committed
reference exemplars (style-conditioning input for providers that take
images); and a **normalize step** that mechanically corrects what
prompts can't guarantee — true black point, exact brand-orange
hue-snap, uniform grain, derived crops. The normalize step is the real
consistency engine.

### 7. Enforce variety or automation converges on its safest answer
The first 21-image batch was individually on-system and collectively a
film-noir storyboard: "small silhouette walks toward a distant orange
door," ~8 times. Two causes: the style contract itself encoded the
mood, and selection bias amplified it. Fixes at contract level:
composition-signature vocabulary with a no-repeat-within-4 window,
aperture-subtype quotas, a hard cap on the dominant move, and an
emotional stance rule (orange marks *possession*, not pursuit). All
enforced by a pre-generation lint that checks against publish history —
so the drift can't return silently.

### 8. Grandfather by date, never by allowlist
New rules (e.g. the rhythm gate) apply to content dated after the rule
landed. Old content warns but never fails. No allowlist file to
maintain; the cutoff is data already in frontmatter.

### 9. Ledgers are append-only and atomic with content
`used-keywords.md` and `date-ledger.json` update in the same commit as
the articles they describe — they can't drift, and append order doubles
as publish order (which the /blog sort uses as its same-date
tiebreaker). A half-failed run leaves no lie behind.

### 10. Verify independently; report honestly
Citations are live-fetched during writing — unverifiable source means
the claim is cut, not softened (headless runs therefore write
citation-free argument pieces, and competitor-comparison topics are
HOLD-tagged for supervised sessions that CAN verify). Review re-runs
gates from scratch rather than trusting the run's log. Failure reports
state exactly what happened — the day's best moments were runs that
stopped cleanly and said precisely why.

---

## Component inventory

### Keyword system — `content/keywords/`
| File | Role |
|---|---|
| `keyword-priorities.md` | **Curated queue** (selectable, fully resolved: priority order, consolidated secondaries, cluster mapping, pillar-before-spokes) + **backlog** (raw research table, never selectable). `HOLD-WEB:` prefix = supervised-only topics. |
| `used-keywords.md` | Ledger: PUBLISHED / DRAFT / FAILED / CONSOLIDATED. Checked case-insensitively at selection. |
| `date-ledger.json` | Slug → date, append order = publish order = sort tiebreaker. |
| `clusters.json` | Cluster registry; one pillar per cluster, enforced. |
| `ROUTINE.md` | The canonical process. Selection, writing rules (voice + rhythm + art brief), gates, PR-only output, CI-art explanation, manual fallback runbook. |
| `package-contract.md` | v1.3. Governs imported packages AND routine output: §0 demand-check, §1 link allowlist, §2 frontmatter schema, §3 citations, §4 byline (AI byline shown honestly; JSON-LD author = Organization, never a fake Person), §4a voice, §4b mobile rhythm, §5 one CTA, §6 forward-only dates, §7 banned claims, §8 package structure. |

### Content gates — `scripts/content/`
`validate.mjs` (schema, links, dates, clusters, orphans) ·
`check-claims.mjs` (banned-claims regex, negation-aware) ·
`check-rhythm.mjs` (§4b caps/targets, date-grandfathered). All three
run in `npm run content:check`, which runs before every build.

### Art system — `content/art/` + `scripts/art/`
| Piece | Role |
|---|---|
| `STYLE_SPEC.md` (v1.1) + `style.json` | Human + machine halves of the illustration contract: palette w/ coverage targets, 4 subject families + hero mix (40 obj / 25 arch / 20 pairs / 15 upright-solo), orange-aperture device + subtype quotas, composition signatures, figure posture rules, luminance floor, fixed prompt suffix + negatives (byte-versioned), placement/export specs, naming convention. Synced two-way with the Claude Design project — the design doc is canonical for design, this repo for generation, and they must not drift. |
| `reference/*.webp` | Canonical exemplars per family; style-conditioning inputs. |
| `pending.mjs` | Frontmatter → pending briefs + variety context from publish history; lints before anything is spent. |
| `lint-briefs.mjs` | The concept router as a deterministic gate (vocab, quotas, signature windows, orange-role cap, risk flags). |
| `batch-generate.mjs` → `providers/openai.mjs` | Raw-fetch adapter (no SDK, no hidden retries), 2 candidates/post, per-invocation spend guard, resume-for-free skip, full audit log per run. |
| `apply-winners.mjs` | 3-case: swap (surgical heroImage-line replace + asset purge) / routine-insert / legacy full block. Records signature/aperture into frontmatter so future variety checks read straight from posts. |
| `normalize.mjs` | Black point → #0B0B0B, ember hue-snap → #FF5A1F, 2% grain, master + og (1200×630) + card (1200×800) crops, WebP q82, provenance sidecar JSON. PNG masters stay local (repo-weight). |
| `review-strips.mjs`, `auto-winners.mjs` | Contact strips for human review; CI default-pick helper. |

### CI — `.github/workflows/`
`art.yml`: on push to `claude/**` → pending → generate → apply
candidate 1 → gates → commit heroes to the same branch → PR comment
with images; both candidates kept as a 90-day artifact.
`art-swap.yml`: `/art swap <slug>` comment (write-access only) →
candidate 2 applied from the artifact, $0.
Key facts learned: cloud runs need the **GitHub App installed on the
repo** for push (OAuth connector alone = read-only); workflows only
run from refs that contain the workflow file; `${BODY}` — brace your
shell vars.

### Rendering — `app/` + `lib/posts.js`
Article pages render the hero and point og:image/Twitter/JSON-LD at
the derived og crop ("same image, never a new generation"). The /blog
index: featured tile (newest post, self-refreshing), 1px-gap tiled
grid on card crops, client-side search + cluster chips (one small
client component — at blog scale, search is a property filter, not a
feature), one Founders CTA tile. Sort = date desc, then ledger
position. Drafts render on preview deploys only (`VERCEL_ENV` gate,
fail-open to preview, never to production).

---

## The daily timeline

1. **4:04 AM** — routine selects top 2 unused queue rows (skipping
   HOLD-WEB), writes both articles per contract (voice + rhythm +
   citations policy), authors each art brief with a variety check
   against the last 4 published, updates all ledgers, pushes
   `claude/articles-<date>`, opens the PR.
2. **~4:07 AM** — `art.yml` fires: lints briefs, generates 2 candidates
   each, applies #1, normalizes, commits heroes, comments on the PR.
3. **Morning** — founder reviews ONE PR on the Vercel preview. Merge.
   Optionally `/art swap <slug>` first. Vercel rebuild regenerates
   /blog, sitemap, RSS, OG tags automatically.
4. **Periodic** — queue refill when the routine reports "queue needs
   curation" (~every 3 weeks): promote backlog rows WITH consolidation
   decided; supervised session handles HOLD-WEB topics with live
   citation verification.

---

## Porting guide: same machine for a GoHighLevel site

The principles port intact; the delivery rail changes. Keel is
git-native (PR = human gate, Vercel preview = review surface, build =
gate runner). GHL is API-native — no PRs, no builds, no previews. The
port keeps **git as the source of truth and gate runner** and treats
GHL as a publish target:

1. **Repo first.** A git repo (e.g. `pipeline-rocks`) holds everything:
   ROUTINE.md, contract, keyword queue/ledgers, gates, posts as
   markdown, art contract + scripts. The routine works exactly as here
   and opens PRs exactly as here. Nothing about steps 1–2 of the daily
   timeline changes.
2. **Publish step replaces Vercel.** After the human merges, a publish
   script (or supervised step) converts approved markdown → HTML and
   calls the GHL API (`blogs_create-blog-post` / `update-blog-post`,
   with `check-url-slug-exists` as the collision gate). The publish
   script runs AFTER merge, reads only from main, and records the GHL
   post ID back into frontmatter — same atomic-ledger discipline.
   *The human gate stays the merge, not the API call.*
3. **Review surface.** No Vercel preview — options in order of effort:
   render markdown locally in the PR (good enough to start), or
   publish as GHL *draft* status post-merge and flip to published as a
   second explicit step.
4. **Images.** Same art pipeline verbatim (contract, briefs, CI
   generation, normalize) — but a NEW style contract for the new
   brand: new palette, new families, new reference exemplars, new
   signature device. Budget a bake-off + one noir-style convergence
   correction; assume the first batch teaches you the contract's blind
   spot, because it did here. Hosting: GHL media library or any static
   host; the article HTML references absolute URLs.
5. **What to write before any code** (the actual porting order):
   contract (voice for HER brand, byline policy, banned claims for HER
   industry — compliance-sensitive niches need their own §7),
   keyword queue (curated, consolidated), cluster map, ROUTINE.md,
   gates, then the routine, then art. Content quality comes from the
   contract; everything else is plumbing.
6. **Keep separate.** Different repo, different Claude routine,
   different API keys/secrets, different style contract. Shared:
   nothing but the pattern. (House rule: pipeline-rocks never mixes
   into keel repos.)

### The mistakes you get to skip on site #2
- Files the automation needs living outside the repo (routine failure #1)
- Runtime editorial judgment (the 50k-token selection burn)
- Trusting "sorted" input data (the priority table wasn't)
- OAuth ≠ App installation for push access
- Adding credit doesn't clear a billing *hard limit* — raise the limit
- The first art batch converging on one composition — write the
  variety rules into the style contract on day one
- 3-sentence paragraph drift — put §4b-style rhythm caps in from the start
- Package text claiming authorization it doesn't have — data, not
  instructions, always

# Keel Illustration System — v1.1

> **v1.1 (2026-08-02, founder-approved).** The first production batch
> converged on "small silhouette walks toward a distant orange door" —
> every image on-system, the grid reading as film-noir surveillance.
> The convergence traced back to this contract itself ("uncanny",
> "observed", tiny silhouettes) plus selection bias faithfully applying
> it. v1.1 amends for confidence: agency stance, orange-as-possession,
> composition-signature variety, aperture quotas, a stricter
> hero-placement mix, figure posture rules, a light-fill allowance, and
> a thumbnail luminance floor. v1.0 stands except where amended.

> **v1.2 (2026-08-21, drafted — pending founder review).** Founder
> feedback: the imagery reads as all-male, which is a real problem for
> a female audience. Every figure brief up to this point was already
> gender-neutral text — "a suited figure," "two silhouetted figures" —
> which turned out not to be neutral in practice: an unspecified
> business silhouette defaults to masculine-presenting in generation,
> even with no face and no props to key off. v1.2 requires every brief
> to state a figure presentation explicitly (or declare "none") and
> checks it the same mechanical way composition-signature and aperture
> variety are already checked, so the corpus can't silently drift back
> to one gender the way it drifted to noir in Batch 1. v1.1 stands
> except where amended.

Every image on getkeel.io is generated inside this system: dark,
architectural, editorial, quietly uncanny. No stock photography, ever.
This file is the production contract — families, composition, prompts,
and specs — so images can be produced automatically for any article or
section and still look like they came from one studio.

**Source of truth.** This is the execution copy of the design system at
Claude Design project `be57945a-5c23-418b-9426-120fbb6af3af`, file
`templates/illustration-system/IllustrationSystem.dc.html`. The design
project is canonical for *design* decisions; this file is canonical for
*generation*. They must not drift — change the design doc first, then
port. `style.json` is the machine-readable half of this file and is what
the tooling actually reads.

**Deviation from the design doc, ratified by the founder 2026-08-01:**
ember is `#FF5A1F` here, matching `src/brand.js` (`O`). The design doc's
original `#F4531B` was a print-leaning variant; the founder chose one
orange across UI and illustration. The design doc has been updated to
match — no divergence remains.

**Reference exemplars.** `content/art/reference/` holds the canonical
images for each family, imported from the design export by
`scripts/art/import-reference.mjs`. They are the visual definition of the
system — when prose and exemplar disagree, trust the exemplar and fix the
prose. They are also the **style-reference input** for any provider that
supports image conditioning, which is a stronger consistency lever than
prompt text alone.

## The rule

Make everything in the conceptual family structure of Batch 1, rendered
with the refinement and restraint of Batch 2.

## Principles

1. **Dark is the default.** Near-black grounds the frame. Light is scarce
   and earned — one bone-white plane, one orange source. Brightness is
   information, not decoration.
2. **One idea per frame.** A single subject, a single gesture, a single
   accent. If two metaphors compete, make two images.
3. **Architectural, not illustrative.** Space, edge, and plane carry the
   meaning. Lean geometry and hard shadow over rendered detail or friendly
   SaaS characters.
4. **People as silhouettes.** Figures appear in profile or from behind,
   unlit, small in frame. Never faces, never eye contact, never a smile.
5. **Slightly uncanny.** Rooms too empty, light too clean, scale a little
   off. The tension is the brand — intelligent, watchful, composed.
6. **Print texture, digital geometry.** Fine paper grain and screen-print
   flatness over gloss, bloom, or 3D render sheen. Editorial poster, not
   product shot.
7. **Confident, not surveilled** *(v1.1)*. The subject has agency. Ember
   marks **possession or control** — a held folder, an active screen, a
   lit tab under the rep's hand — at least as often as it marks a
   destination. "Slightly uncanny" stays; "watched", "escaping", and
   "searching" go. If a frame would caption naturally as a detective
   still, re-concept it.

## Palette and target coverage

| Name | Hex | Role | Coverage |
|---|---|---|---|
| Ink | `#0B0B0B` | Ground | 55–70% |
| Bone | `#EDE7DC` | Lit plane, paper, screen | 15–30% |
| Ember | `#FF5A1F` | The signature | 3–8%, never more |
| Periwinkle | `#6E86D6` | Second voice: sky, tabs, data | ≤5% |
| Graphite | `#3A3A3A` | Mid-tone separation, concrete | — |

Two accents maximum, and **ember always outranks periwinkle**.
Greyscale-plus-one-accent is always a safe fallback. Three saturated
colors in a frame is off-system.

## Subject families

Mix ratios are targets across the whole site, not rules for a single
page — but if a quarter's images run 60% abstract, the system has drifted.

**Hero-placement mix** *(v1.1, founder-ratified)*: heroes are what people
see repeated in a grid, so they carry a stricter cap than the site-wide
spread below: **40% object still-life (no human) · 25% architecture
(no human) · 20% paired/group human scenes · 15% upright/mid-action solo
figures**. The site-wide family mix (50/25/15/10) remains the aspiration
for lower-stakes placements (inline images, spots, dividers).

### Architecture & space — 50% (balanced preset)
The backbone. Atria, corridors, thresholds, stairwells, empty lobbies. A
path leading somewhere, destination lit in ember. Reads as direction,
structure, transition, consequence.
*Use for:* product architecture · company strategy · onboarding &
migration · trust and governance · anything with no obvious object.

### Tactile business objects — 25%
Still life, raking light, one ember element in a stack of neutrals.
Folders, tabs, notebooks, terminals, index cards, a desk at night. The
most literal family — use when the topic has a real artifact.
*Use for:* memory & account context · privacy and retention · workflow
and admin · record-keeping · feature explainers.

### Human corporate scenes — 15%
Restrained narrative: silhouettes in a glass room, one figure walking, a
debrief at a table. Observed from outside and at distance — we look in,
never participate. Use sparingly; the most expensive family to keep
tasteful.
*Use for:* sales culture & coaching · management and pipeline reviews ·
rep behavior · customer stories · hiring.

### Abstract systems — 10%
Line flows, dot matrices, isolated chart fragments. Strictly minority
texture: it repeats badly and turns cosmic fast. One flow per page
maximum, never a hero for a people-centred article.
*Use for:* AI behavior & model reasoning · integrations and routing ·
benchmarks · section dividers and card art.

Other presets: architecture-led (65/20/10/5), product-led (35/40/10/15).

## The signature device — the orange aperture

Every image carries exactly one ember event: a doorway, a folder tab, a
lit window, a single indicator dot, a struck line on a chart. It is what
the eye lands on and what makes an image recognisably Keel across a feed
of thumbnails.

- One aperture per frame. Two reads as a pattern; three reads as decoration.
- It is the brightest and most saturated area of the image.
- Prefer it as a *source* of light — spilling onto floor, paper, glass —
  rather than a flat sticker of color.
- Give it geometry: rectangle, tab, slot, dot. Not a glow, blob, or gradient.
- Place it off-centre, at a third, never touching the frame edge on more
  than one side.

**Aperture-subtype quotas** *(v1.1)* — the aperture rule was being
satisfied while the vocabulary collapsed to "door". Per 20 images (scale
proportionally, rolling across publish order): door/threshold ≤5 ·
tab/indexed edge ≤4 · dot/node ≤4 · line/strike ≤4 · lit panel/window
≤3. Never the same subtype on two consecutive published posts. Ember as
a distant destination is capped at 1-in-5; the rest of the time it is
something the subject owns, holds, or operates.

## Composition rules

- **Negative space is a feature.** 30–40% of the frame effectively empty,
  biased to the side where text or a headline will sit. Crowded frames
  break the system faster than any color mistake.
- **One light source, hard-edged.** Late-afternoon raking light, one
  direction, crisp shadow. No ambient studio fill, no rim-light on every
  object, no lens flare.
- **Big planes, thin lines.** Large flat masses of tone divided by
  hairline edges — railings, mullions, folder creases. Consistent thin
  line weight; nothing outlined cartoon-style.
- **Deliberate perspective.** Choose one: straight-on elevation, low-angle
  looking up, or a single strong diagonal. Avoid casual three-quarter
  "product photo" angles.
- **Figures ≤12% of frame height.** People are scale references, not
  protagonists. Fully silhouetted, business dress, no visible facial
  features.
- **Crop tighter than feels safe.** Let subjects run out of frame. A
  fragment of an atrium is more ownable than a complete, centered building.
- **Composition signatures** *(v1.1)*. Every image declares one:
  `path_to_threshold` · `macro_object` · `isolated_spotlight` ·
  `split_boundary` · `convergence_diagram` · `window_observation` ·
  `monumental_vertical` · `table_conversation` · `indexed_stack`.
  No signature repeats within the previous 4 published images —
  different scenes with the same signature are the same thumbnail.
  `path_to_threshold` + lone silhouette (the noir move) is additionally
  capped at 1-in-5 overall.
- **Figure posture** *(v1.1)*. When humans appear, prefer pairs or small
  groups at eye level (collaborative, warm). Solo figures must be
  upright, frontal or mid-action — writing, presenting, closing a laptop
  — never only a distant walking-away silhouette. Silhouette/no-faces
  rules unchanged.
- **Figure presentation** *(v1.2)*. A silhouette with no visible face
  still reads as gendered — through clothing silhouette and hair
  length, not features. Left unspecified, that reads masculine by
  default, so state it: alternate a fitted-blazer-and-trouser cut
  against a fitted-blazer-and-skirt-or-dress cut, and vary hair length,
  across the corpus. Convey it through cut and hairstyle only — never
  through props like a handbag or jewelry, which reads as a caricature
  the system's restraint can't absorb. New paired and group scenes
  default to genuinely mixed presentation — one of each — unless the
  brief has a specific reason not to. Every brief declares what it
  actually shows (or "none," if no figure is in frame) so the mix can
  be checked the way aperture and signature already are — see
  "Figure-presentation parity" below.
- **Light fill** *(v1.1)*. One *dominant* hard-edged source, plus an
  optional quiet cool ambient fill so scenes are not 90% black with one
  spotlight. The interrogation-room look is off-system.
- **Thumbnail luminance floor** *(v1.1)*. A bone plane occupies 12–30%
  of the frame; reject any frame where >75% collapses into
  undifferentiated dark; the concept must survive grayscale at 320px.
  Black grounds the image — it must never erase the idea.

## Figure-presentation parity *(v1.2)*

Every brief declares `figurePresentation`: `feminine-presenting` ·
`masculine-presenting` · `mixed` · `none`. Required on every brief
regardless of family — `none` is a real, valid answer for an object or
architecture shot with nobody in it.

`feminine-presenting`/`masculine-presenting` describe what's actually
in frame, solo *or* uniform pair/group — two figures who both read
masculine are still `masculine-presenting`, not `mixed`. `mixed` is
reserved for a scene that genuinely shows more than one presentation.
Don't let "it's a pair" default the field to `mixed` unless the pair
actually is.

- A figure-bearing image's presentation (`feminine-presenting` or
  `masculine-presenting`) may not repeat the presentation of the most
  recent non-`none`, non-`mixed` image before it, published or queued
  in the same batch — the same rule aperture subtypes already follow,
  applied to gender presentation instead of aperture shape.
- Across any 8 consecutive `feminine-presenting`/`masculine-presenting`
  images, neither should exceed 6 (a ~3:1 skew) — checked as a
  warning, not a hard fail, so one deliberate exception (a specific
  person's actual presentation in a customer-story image, say) doesn't
  block a batch.
- New paired/group scenes default to genuinely `mixed` presentation
  going forward unless the brief has a specific reason not to — the
  existing corpus's uniform pairs are backfilled as what they show,
  not rewritten as what they should have been.
- Mechanically enforced by `scripts/art/lint-briefs.mjs` the same way
  aperture and signature variety are — this is not an honour-system
  rule, on purpose, because the honour system is what produced the
  all-male corpus in the first place.

## Do / don't

**Do:** ground the frame in near-black with one plane carrying the light ·
give the viewer a threshold to look through · keep paper grain and flat
screen-print tone · use ember as a light source with spill and shadow ·
repeat the dot matrix as a quiet system motif · crop into architecture and
let it exceed the frame.

**Don't:** stock photography, ever — including "editorial" stock ·
starfields, nebulae, glowing orbs, floating dashboards · smiling people,
faces, handshakes, headsets · purple-blue AI gradients, neon glow, bokeh,
lens flare · robots, brains, circuit boards, chat bubbles as icons ·
legible UI or fake charts with real-looking numbers · more than one
saturated accent competing · isometric SaaS scenes or rounded-corner
character illustration.

> The "no legible UI or fake charts with real-looking numbers" rule is the
> visual sibling of the copy contract's banned-claims list: an image must
> not imply a product surface or a statistic that does not exist.

## Prompt formula

Six slots plus a fixed style suffix. **The suffix never changes** — that
is what makes the batch cohere. Only the subject and aperture slots are
written per article.

```
[SUBJECT] · [SPACE / MATERIAL] · [VIEWPOINT] · [LIGHT] · [EMBER APERTURE]
· [NEGATIVE SPACE] + STYLE SUFFIX
```

Exact suffix and negative strings live in `style.json` (`styleSuffix`,
`negativePrompt`) — that file is authoritative for the byte-exact text.

### Worked examples

**Architecture** — "How Keel decides what to escalate"
> A curved concrete mezzanine sweeping to the right, a single figure in a
> fitted blazer and knee-length skirt, hair in a low bun, walking away
> from camera, low three-quarter viewpoint, late-afternoon raking light
> from the right, an ember-orange doorway at the end of the corridor
> spilling light across the floor, left half of the frame in deep
> shadow + STYLE SUFFIX
>
> *(figurePresentation: feminine-presenting — cut and hair carry it,
> not a prop or a face)*

**Object** — "What Keel remembers about an account"
> A fanned stack of manila and bone file folders on black, macro
> three-quarter crop running out of frame, hard side light, one
> ember-orange tab standing proud of the stack, a faint white dot-matrix
> embossed on the front black folder, right third empty + STYLE SUFFIX

**Human** — "Running a debrief that actually changes behavior"
> Three silhouetted figures in a glass-walled meeting room seen from the
> dark corridor outside — two in a fitted blazer-and-trouser cut, one in
> a fitted blazer-and-skirt cut with longer hair — straight-on elevation,
> the room's bone-white wall the only lit plane, a small ember-orange
> square on the presentation board, the outer two-thirds of the frame in
> near-black + STYLE SUFFIX
>
> *(figurePresentation: mixed — the paired/group default, not a special
> case)*

**Abstract** — "Routing every inbound message"
> Twenty thin horizontal lines converging through a single small aperture
> and fanning into an ordered dot grid, flat elevation, no perspective,
> black field, bone and periwinkle lines with four ember-orange lines,
> wide empty margins + STYLE SUFFIX

## Specs by placement

| Placement | Export | Ratio | Preferred family | Notes |
|---|---|---|---|---|
| Article hero | 2400×1350 | 16:9 | Architecture | Keep the left third clear for the headline overlay. |
| In-article section break | 1600×900 | 16:9 | Object / Abstract | One per ~800 words. Never two adjacent from one family. |
| Blog index card | 1200×800 | 3:2 | Object | Must survive a 320px crop — one clear shape, one ember event. |
| Marketing page band | 2880×1000 | ~2.9:1 | Architecture | Generate 16:9 and crop; never stretch or outpaint faces. |
| OG / social | 1200×630 | 1.91:1 | Any | Derived crop of the hero — same image, not a new generation. |
| Doc / changelog spot | 800×800 | 1:1 | Abstract | Motif only — dot grid, flow, single tab. No scenes. |

Export WebP at q82 plus a PNG master. Ship at 2× the largest rendered
width; the deep blacks band badly below q80.

## Production workflow

1. **Classify.** From the article title and outline, pick one family and
   one concrete noun. If no physical object or space can be named, default
   to Architecture. *In this repo, classification happens at article-write
   time* — the article routine writes `artFamily`, `artBrief`,
   `artFigurePresentation`, and `heroAlt` into post frontmatter. It needs
   article context and no network, so it runs where the context is.
2. **Assemble.** Fill the six slots, append the fixed suffix and negative
   list. Slots are the only free text; the suffix is never edited per image.
3. **Generate 4, keep 1.** Four candidates at 16:9. A human picks one
   against the ship checklist. Rejects are logged with a reason to tune
   the slots.
4. **Normalise.** Levels to a true `#0B0B0B` black point, ember
   hue-shifted to `#FF5A1F`, 2% grain overlay, then derive the crops.
   This step is the consistency engine — it corrects provider drift
   mechanically instead of relying on prompt obedience.
5. **File and log.** Store prompt, seed, family, and slug alongside the
   asset so any image can be regenerated or extended into a matching set.

**Naming:** `keel-{family}-{slug}-{placement}-{seed}.webp`, where family ∈
`arch` · `obj` · `human` · `abs`.
Example: `keel-obj-account-memory-hero-8842.webp`

## Ship checklist

- [ ] Exactly one ember aperture, off-centre.
- [ ] Black point genuinely near-black, not charcoal.
- [ ] No faces, no text, no legible UI.
- [ ] At most two accent colors.
- [ ] Reads at 320px wide as a single shape.
- [ ] Doesn't repeat the previous three images on the page.
- [ ] Figure presentation stated explicitly and doesn't repeat the last
      figure-bearing image (or "none" is correctly declared).
- [ ] Prompt + seed logged.
- [ ] Alt text written (accessibility + SEO; not optional).

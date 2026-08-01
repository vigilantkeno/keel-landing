# Article package import — the repeatable process

Companion to `content/keywords/package-contract.md` (the file the founder
pastes into the package generator). Packages produced under the contract
should need steps 8–11 only; the earlier steps are the safety net for
packages that drift from it.

Every founder-supplied article package goes through these steps, in order.
Steps 1–3 are now enforced by the build (`npm run content:check`); the rest
are judgment calls the importer makes and records in the PR description.

1. **Internal links** — packages routinely invent slugs. Repoint every
   `/blog/...` link to a real post (see `content/blog/posts/`), unlink
   anything with no live target (keep the anchor text as plain prose).
   ENFORCED: validate.mjs fails the build on links to nonexistent slugs or
   routes (including `/founders` until that route exists).
2. **CTA links** — `getkeel.io/founders` → `/` (standing founder decision,
   2026-08-01, until a /founders route ships). ENFORCED by the same gate.
3. **Banned claims** — run `npm run content:claims`. Fix the copy, never
   weaken a pattern. Subject-blind hits ("record the call" describing a
   competitor) get rephrased; negated hits surface as warnings for a human
   glance. ENFORCED.
4. **External citations** — curl every external link. Journal pages that
   403 automated fetches (Elsevier/jclinepi, hbs.edu faculty pages) get
   replaced with the same work's PubMed record or another stable host,
   verified 200. A claim with a number and no live source loses the number
   or the sentence.
5. **Frontmatter** — full schema per `_templates/post.mdx`, plus
   `metaTitle` when the package separates a <60-char SERP title from the H1.
   `status: published` + `claimsReviewed: true` (PR review IS the human
   review — merging publishes).
6. **Cluster + pillar** — assign per `content/keywords/clusters.json` and
   update that file (pillar swaps are allowed; at most one published pillar
   per cluster is ENFORCED).
7. **Forward-only dates** — content/keywords/date-ledger.json is enforced
   by the build: ledgered slugs must keep their date, new slugs are never
   dated before the newest published piece. Add the new slug's ledger row
   in the publish PR.
8. **One CTA total** — packages sprinkle early-access references (product
   section + closing CTA + author note). Keep exactly one, near the end;
   the author note stays descriptive with no apply link (founder feedback,
   2026-08-01).
9. **Dates** — publish dates follow the editorial calendar cadence the
   founder sets, not the merge date.
10. **Verify rendered** — build, then check the post page for: metaTitle in
   <title>, description/canonical/OG/Twitter tags, Article + FAQPage +
   BreadcrumbList JSON-LD, breadcrumb trail, related-posts block.
11. **PR** — one post per PR; description records every deviation from the
   package (links repointed, claims rephrased, citations swapped) so the
   package author can improve the generator.
12. **Post-publish** — `npm run content:contract` to regenerate the
    contract's §1 allowlist; execute any planned/reverse retrofits from the
    package (they ride the publish PR).
13. **Not actioned from packages**: social atoms (used manually after
    publish), image suggestions (no image pipeline), used-keywords log
    (tracked in content/keywords/ instead).

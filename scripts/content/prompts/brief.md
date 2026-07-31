# Prompt contract: content brief

Input: one validated keyword + its cluster.
Output: a filled `content/blog/_templates/brief.md`.
The brief is reviewed by a human BEFORE drafting — an outline is cheap to fix,
a finished post is not.

---

Produce a SERP-aware content brief for `{{targetKeyword}}`.

Include:
1. What currently ranks and what format wins
2. What every top result fails to say (our angle)
3. The answer-first lead — the definition/answer for the first ~100 words,
   because AI overviews and featured snippets extract from there
4. H2 outline
5. FAQs that will feed FAQPage JSON-LD
6. Internal links: up to the pillar, across to named siblings
7. **Claims that would be FALSE for Keel today** — enumerate explicitly.
   Mirror `scripts/content/banned-claims.txt`. This is the checklist the
   writer and the reviewer both work against.
8. CTA: Apply for Early Access / Founders Club

Do not invent statistics. If a point needs a number we have not published,
say so in the brief instead of supplying one.

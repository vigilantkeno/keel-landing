# Prompt contract: MDX draft

Input: an approved brief.
Output: `content/blog/posts/<yyyy>-<slug>/index.mdx`.

POLICY (founder, 2026-07-31): posts are written publish-ready —
`status: published`, `claimsReviewed: true` — and **the pull request review
is the human review**. Merging is the act of affirmation. The earlier
two-step (draft, then a second commit to flip the flags) added a round trip
without adding scrutiny, since the same person reviewed the same words either
way.

What this does NOT relax: every claim written must be true of the product
TODAY, and `scripts/content/check-claims.mjs` still fails the build on any
banned claim. Setting `claimsReviewed: true` asserts the claim list below was
actually checked — it is not a formality.

Write a post to `status: draft` only when it is genuinely unfinished and you
want the Vercel preview to render it for review without it going live.

---

Write the post as MDX using the supplied brief and the frontmatter schema in
`content/blog/_templates/post.mdx`.

VOICE: rep-first, concrete, unsentimental. Written for a quota-carrying AE who
is skimming on a phone between meetings. Short paragraphs. No throat-clearing
introductions, no "in today's fast-paced sales landscape".

STRUCTURE:
- Answer-first lead: define the thing and answer the query in the first ~100
  words, before any narrative
- Then the argument, then a concrete "what to do this week" close

HARD RULES:
- No invented statistics, customer counts, or win-rate figures
- Nothing from scripts/content/banned-claims.txt stated as a Keel capability
  (contrast phrasing like "no meeting bot is present" is fine and expected)
- Every factual claim about Keel must be true of the product TODAY, not of
  the roadmap
- CTA: Apply for Early Access / Founders Club

Set frontmatter completely EXCEPT the two gate fields above.

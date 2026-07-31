# Prompt contract: MDX draft

Input: an approved brief.
Output: `content/blog/posts/<yyyy>-<slug>/index.mdx` with
`status: draft` and `claimsReviewed: false`.

NEVER writes `status: published`. NEVER sets `claimsReviewed: true`.
Those are human acts, enforced by scripts/content/validate.mjs.

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

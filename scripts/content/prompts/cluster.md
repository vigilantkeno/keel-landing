# Prompt contract: clustering

Input: validated rows in `content/keywords/backlog.json`.
Output: proposed pillar/supporting structure for `content/keywords/clusters.json`.

---

Group the supplied keywords into topic clusters. For each cluster:

- Name ONE pillar page — the broad, definitional piece the cluster links up to
- Assign 3–5 supporting posts, each with exactly ONE primary keyword
- No keyword may be the primary for two posts (that is self-cannibalisation)
- Every supporting post must have a plausible internal link to the pillar AND
  to at least one sibling

Prefer fewer, deeper clusters over many shallow ones. Four well-linked posts
beat twelve orphans. If a keyword does not fit an existing cluster and cannot
justify a new one, leave it in the backlog rather than forcing it.

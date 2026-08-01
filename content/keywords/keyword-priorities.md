# Keyword priorities

The ranked queue the article-production routine draws from. Highest
priority first. The routine selects the top rows that do NOT already
appear in `used-keywords.md` (in any status) and never modifies this
file — it only consumes from it. Humans add rows here after validating
demand (Ahrefs/GSC), per contract §0.

Consolidation note: near-duplicate phrasings of one intent belong on ONE
row as secondaries — one pillar beats four thin competing pages.

Format: `| Priority | Target keyword | Secondaries (consolidated) |
Suggested cluster | Notes |`. Cluster must exist in `clusters.json`, or
the article PR adds it (one pillar per cluster — see the contract).

<!-- PASTE ZONE: rows from keel-keyword-priorities-v3-combined.md go
     below. Until rows exist here, the routine has nothing to select
     and must stop with "no unprocessed keywords" — that is correct
     behavior, not an error. -->

| Priority | Target keyword | Secondaries (consolidated) | Suggested cluster | Notes |
|---|---|---|---|---|

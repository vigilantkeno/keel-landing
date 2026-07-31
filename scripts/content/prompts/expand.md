# Prompt contract: keyword expansion

Inputs: `content/keywords/seeds.md` (ICP, wedge, banned claims).
Output: candidate rows appended to `content/keywords/backlog.json` — CANDIDATES
ONLY. A human validates volume/difficulty in Ahrefs or GSC before anything is
briefed. Nothing here is authoritative.

---

You are expanding keyword candidates for Keel, a 24/7 deal assistant for
mid-market B2B Account Executives.

POSITIONING (do not drift from this):
- Sara is reached by text or call, for deal context that happens where no
  meeting tool is present.
- Contrast: Gong owns the recorded call, for the manager. Sara owns what
  happens after you hang up, for the rep.

Generate keyword and question candidates grouped by search intent
(informational / comparison / commercial).

HARD EXCLUSIONS — do not generate keywords whose satisfying answer would
require Keel to have a capability it does not have:
- CRM integration, sync, or connectors (Salesforce, HubSpot)
- Call recording, meeting bots, transcription of customer conversations
- Manager dashboards, team feeds, leadership pipeline visibility
- Free-forever pricing, published pricing tiers, SOC 2 certification

A keyword is only useful to us if we can rank for it while telling the truth.
If the obvious article for a keyword would require a banned claim, drop it.

For each candidate emit: keyword, intent, why-it-fits-the-ICP, and the
cluster id it belongs to from content/keywords/clusters.json.

# Keyword priorities

Two sections. The **curated queue** is the only selectable list — every
editorial decision (priority order, consolidation, cluster mapping,
pillar sequencing) is already made, so runtime selection is mechanical.
The **backlog** below it is reference material and is NEVER selectable.

## Selection rule (routine) — zero judgment

Take the top 2 queue rows whose Target keyword does not appear in
`used-keywords.md` (case-insensitive, any status), skipping rows whose
Target is prefixed `HOLD-WEB:`. That's the entire selection step — no
near-duplicate analysis, no table walking, no subagents.

`HOLD-WEB:` rows are competitor/brand articles whose claims about
third-party products require fetching those vendors' live pages —
impossible in scheduled runs, whose egress policy blocks all web
access (confirmed 2026-08-01). They are written only in supervised
sessions with web access, then ledgered normally. The routine skips
them silently; it must never select them, never mark them FAILED, and
never write them citation-free. Each row already lists the secondaries to fold into the
article and the exact `cluster` id for frontmatter (ids marked (new)
get their `clusters.json` entry in the same commit; "pillar: yes" rows
set `pillar: true`). Ledger the target AND its listed secondaries on
one row when done.

Queue empty (or fewer than 2 unused rows): process what exists, then
stop and report "queue needs curation" — a clean outcome, not an
error. Humans (or a supervised Claude session, not this routine)
refill the queue from the backlog.

Why the queue is not in raw table order: the backlog's v4 rows were
appended after v3 and never re-sorted — e.g. "customer ghosted" (84.50,
the #2 keyword overall) sits at raw rank 229. The queue uses true
priority, adjusted so each cluster's pillar ships before its spokes
(spokes need a pillar to link up to, per clusters.json rules).

## Curated queue (selectable — top to bottom)

| # | Target keyword | Pri | Cluster id | Pillar | Secondaries (ledger with target) |
|---|---|---|---|---|---|
| 1 | Gong alternative without recording | 83.25 | surveillance-backlash | no | Gong alternative privacy focused |
| 2 | AI sales tool that doesn't report to manager | 83.25 | surveillance-backlash | no | AI sales tool no boss visibility; rep privacy AI sales tool |
| 3 | customer ghosted | 84.50 | deal-memory-drift | yes | customer went dark; customer stopped responding; customer won't respond; customer ignoring me |
| 4 | HOLD-WEB: AI note taker alternative for sales | 81.75 | note-taker-alternatives (new) | yes | AI note taker for sales rep; AI meeting notes for sales rep; AI meeting summary for sales; AI notetaker for sales without recording |
| 5 | HOLD-WEB: Fathom alternative for sales | 84.50 | note-taker-alternatives (new) | no | Fathom vs Sara; Fathom for sales rep; Fathom privacy |
| 6 | HOLD-WEB: Otter alternative for sales | 84.50 | note-taker-alternatives (new) | no | Otter for sales rep |
| 7 | HOLD-WEB: Read AI alternative for sales | 84.50 | note-taker-alternatives (new) | no | Read AI vs Sara; Read AI for sales rep; Read AI privacy |
| 8 | HOLD-WEB: Fireflies alternative for sales | 84.50 | note-taker-alternatives (new) | no | — |
| 9 | AI for sales rep with ADHD | 81.75 | ae-personas (new) | yes | AI for ADHD sales; sales rep ADHD tool; focus tool for sales |
| 10 | founder to first AE | 81.75 | founder-led-sales (new) | yes | founder first sales hire; founder to AE transition; hiring first AE |
| 11 | second brain for sales rep | 79.25 | second-brain (new) | yes | AI second brain for sales; second brain for AE; second brain for sales; AI as second brain for sales |
| 12 | AI for in-between moments | 79.25 | in-between-moments (new) | yes | AI for unscripted moments; AI for unscheduled moments; AI for between meetings |
| 13 | AI for medical device sales | 79.50 | field-sales-ai | no | — |
| 14 | AI for pharmaceutical sales reps | 79.25 | regulated-industries | no | — |
| 15 | AI for financial services B2B sales | 79.25 | regulated-industries | no | — |
| 16 | AI for in-person sales conversations | 79.25 | field-sales-ai | no | — |
| 17 | AI for sales reps that thinks with you | 79.25 | byoai-shadow-ai (new) | no | AI thinking partner for sales rep |
| 18 | HOLD-WEB: best AI for sales rep without manager | 76.50 | competitor-comparisons (new) | yes | best AI for sales rep privacy; best AI for sales rep no recording; Gong for individual contributor |
| 19 | solo B2B sales | 76.50 | founder-led-sales (new) | no | one person sales team; solo enterprise sales; solo sales motion |
| 20 | AI for sales rep introverts | 76.50 | ae-personas (new) | no | AI for introverted sales; sales tools for introverts; introvert-friendly sales AI; Gong for introverts |
| 21 | lost deal analysis | 76.50 | lost-deal-postmortem (new) | yes | post-mortem on a lost deal; why did we lose this deal; lost deal review; deal autopsy |
| 22 | AI for relationship selling | 75.25 | field-sales-ai | no | AI for relationship sellers |
| 23 | AI for new sales rep | 73.25 | ae-personas (new) | no | AI for new sales hire; new AE ramp; first 90 days AE; sales rep first 90 days |
| 24 | personal CRM for sales rep | 73.25 | second-brain (new) | no | personal CRM for one person; solo CRM for sales |
| 25 | HOLD-WEB: Hedy review | 73.25 | competitor-comparisons (new) | no | Hedy alternative; Hedy vs Sara; Hedy pricing |
| 26 | HOLD-WEB: Closius review | 73.25 | competitor-comparisons (new) | no | Closius vs Sara; Closius alternative; Closius pricing |
| 27 | deal reflection framework | 72.25 | deal-reflection (new) | yes | how to think about a deal; deal stress test questions; deal walk through AI; AE self-deal review |
| 28 | rep quitting over AI monitoring | 72.25 | rep-burnout (new) | yes | sales rep burnout AI monitoring; sales rep burnout from monitoring |
| 29 | BYOAI sales | 68.50 | byoai-shadow-ai (new) | yes | BYOAI sales rep; shadow AI in sales; reps using personal AI; AI tool my manager can't see; shadow AI |
| 30 | drive home from sales meeting | 68.25 | drive-home-debrief (new) | yes | parking lot debrief sales; drive-home debrief method; in-the-car debrief |

Competitor/brand rows (4–8, 18, 25, 26 — all `HOLD-WEB:`): every claim
about a third-party product must be verifiable from that vendor's own
live pages fetched during the run; prefer linking their pricing page
over quoting numbers. Unverifiable claim = don't make it. These ship
only from supervised sessions with web access.

## Cluster mapping reference (backlog table number → repo cluster id)

| # | Table cluster | Repo cluster id |
|---|---|---|
| 1 | Unrecorded Moment | unrecordable-moments |
| 2 | Gong Alternative for Individual Reps | rep-first-ai |
| 3 | Field / Relationship / In-Person | field-sales-ai |
| 4 | Regulated Verticals | regulated-industries |
| 5 | Drive-Home Debrief | drive-home-debrief (new) |
| 6 | Deal Reflection for AE Pain | deal-reflection (new) |
| 7 | Fear / Monitoring / Surveillance | surveillance-backlash |
| 8 | BYOAI / Shadow AI | byoai-shadow-ai (new) |
| 9 | Trust-Based Sales | trust-based-sales (new) |
| 10 | Conference / Trade Show | conference-follow-up (new) |
| 11 | Phone / Voicemail | phone-voicemail (new) |
| 12 | Specific Competitor Comparisons | competitor-comparisons (new) |
| 13 | Rep Burnout | rep-burnout (new) |
| 14 | Pre-Meeting Reflection | pre-meeting-reflection (new) |
| 15 | Customer-Facing AI Trust | customer-ai-trust (new) |
| 16 | Second Brain / Personal CRM | second-brain (new) |
| 17 | AI for In-Between Moments | in-between-moments (new) |
| 18 | Specific AE Personas | ae-personas (new) |
| 19 | Customer Ghosted / Deal Dark | deal-memory-drift |
| 20 | Founder-to-AE / Founder-Led | founder-led-sales (new) |
| 21 | AI Note Taker Alternative | note-taker-alternatives (new) |
| 22 | Lost Deal / Post-Mortem | lost-deal-postmortem (new) |

## Backlog — NOT selectable (raw source table, reference only)

Rows here become selectable only by being promoted into the curated
queue above, with consolidation and cluster mapping decided at
promotion time. Priority scores: volume × 0.10 + KD inverse × 0.25 +
intent × 0.20 + fit × 0.25 + conversion × 0.20.


| Rank | Source | Keyword | Cluster | Role | Type | Intent | Volume | KD | Fit | Conv | Priority | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | v3 | Gong alternative for solo rep | 2 | Support-1 | Comparison | commercial | low | easy | 5 | 5 | 85.75 | Long-tail. Pure blue ocean. |
| 2 | v3 | Gong alternative no manager | 2 | Support-2 | Comparison | commercial | very low | easy | 5 | 5 | 83.25 | Maps to banned-claim positioning. |
| 3 | v3 | sales AI no recording HIPAA | 4 | Support-1 | Vertical | commercial | very low | easy | 5 | 5 | 83.25 | Bottom-of-funnel. Regulated-vertical. |
| 4 | v3 | sales AI without call recording | 4 | Pillar | Vertical | commercial | very low | easy | 5 | 5 | 83.25 | Maps to banned-claim. |
| 5 | v3 | no recording sales AI | 4 | Support-2 | Vertical | commercial | very low | easy | 5 | 5 | 83.25 | Direct match. Long-tail. |
| 6 | v3 | Gong alternative without recording | 7 | Secondary | Comparison | commercial | very low | easy | 5 | 5 | 83.25 | Direct match to no-recording positioning. |
| 7 | v3 | AI sales tool that doesn't report to manager | 7 | Secondary | Comparison | commercial | very low | easy | 5 | 5 | 83.25 | Maps word-for-word. |
| 8 | v3 | Gong alternative for individual contributor | 2 | Support-2 | Comparison | commercial | very low | easy | 5 | 5 | 83.25 | IC = the rep, not the manager. |
| 9 | v3 | Gong alternative for rep not manager | 2 | Support-2 | Comparison | commercial | very low | easy | 5 | 5 | 83.25 | Direct intent match. |
| 10 | v3 | Gong alternative no manager visibility | 2 | Support-2 | Comparison | commercial | very low | easy | 5 | 5 | 83.25 | Variant. |
| 11 | v3 | Gong alternative for individual sales reps | 2 | Pillar | Comparison | commercial | medium | moderate | 5 | 5 | 82.00 | THE commercial head term. |
| 12 | v3 | in-person sales meeting AI | 3 | Pillar | Vertical | commercial | low | easy | 5 | 4 | 81.75 | Perfect positioning match. |
| 13 | v3 | private sales AI | 8 | Support-2 | Founder narrative | commercial | low | easy | 5 | 4 | 81.75 | Private maps to Sara's positioning. |
| 14 | v3 | AI for medical device sales | 3 | Support-1 | Vertical | commercial | low | moderate | 5 | 5 | 79.50 | High-value vertical. |
| 15 | v3 | Gong alternative for one person | 2 | Support-2 | Comparison | commercial | very low | easy | 5 | 4 | 79.25 | Solo founder/AE search. |
| 16 | v3 | AI sales tool no manager dashboard | 2 | Support-2 | Comparison | commercial | very low | easy | 5 | 4 | 79.25 | Maps to banned-claim. |
| 17 | v3 | AI for in-person sales conversations | 3 | Support-1 | Vertical | commercial | very low | easy | 5 | 4 | 79.25 | Direct long-tail. |
| 18 | v3 | AI for pharmaceutical sales reps | 4 | Support-1 | Vertical | commercial | very low | easy | 5 | 4 | 79.25 | High-fit vertical. |
| 19 | v3 | AI for financial services B2B sales | 4 | Support-2 | Vertical | commercial | very low | easy | 5 | 4 | 79.25 | High-fit vertical. |
| 20 | v3 | sales AI for regulated industries | 4 | Pillar | Vertical | commercial | very low | easy | 5 | 4 | 79.25 | Vertical pillar. |
| 21 | v3 | AI for sales reps that thinks with you | 8 | Secondary | Positioning | commercial | very low | easy | 5 | 4 | 79.25 | "Thinks with you" is the Sara framing. |
| 22 | v3 | Gong alternative privacy focused | 7 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 79.25 | Positions Sara as the privacy option. |
| 23 | v3 | private AI for sales rep | 1 | Secondary | Cluster | commercial | low | easy | 4 | 4 | 76.75 | Maps to trust angle. |
| 24 | v3 | no recording AI sales tool | 1 | Secondary | Cluster | commercial | low | easy | 4 | 4 | 76.75 | Privacy-first framing. |
| 25 | v3 | AI sales tool no boss visibility | 7 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 76.75 | Direct positioning. |
| 26 | v3 | rep privacy AI sales tool | 7 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 76.75 | Direct positioning. |
| 27 | v3 | HOLD-WEB: best AI for sales rep without manager | 12 | Pillar | Comparison | commercial | very low | easy | 5 | 4 | 76.50 | Bottom-of-funnel. |
| 28 | v3 | AI for industrial sales | 3 | Secondary | Vertical | commercial | low | moderate | 5 | 4 | 75.50 | Lower volume than med device. |
| 29 | v3 | AI for relationship selling | 3 | Pillar | Vertical | commercial | very low | easy | 5 | 3 | 75.25 | Perfect language match. |
| 30 | v3 | deal review without manager | 6 | Secondary | Cluster | informational | low | easy | 5 | 4 | 74.75 | Direct pain-point. |
| 31 | v3 | BAA-ready AI sales tool | 4 | Secondary | Cluster | commercial | very low | easy | 4 | 4 | 74.25 | Compliance term. |
| 32 | v3 | shadow IT for sales reps | 8 | Support-1 | Positioning | commercial | very low | easy | 4 | 4 | 74.25 | Niche but real. |
| 33 | v3 | personal sales AI not visible to company | 8 | Secondary | Positioning | commercial | very low | easy | 4 | 4 | 74.25 | Long-tail. Direct positioning. |
| 34 | v3 | sales rep privacy concerns | 7 | Secondary | Cluster | informational | low | easy | 5 | 4 | 74.75 | Direct pain-point. |
| 35 | v3 | AI for outside sales reps | 3 | Support-2 | Vertical | commercial | low | easy | 4 | 3 | 72.75 | Generic. |
| 36 | v3 | AI for B2B field sales | 3 | Secondary | Vertical | commercial | low | easy | 4 | 3 | 72.75 | Generic. |
| 37 | v3 | deal reflection framework | 6 | Pillar | Methodology | informational | very low | easy | 5 | 4 | 72.25 | Maps to the 7-question framework. |
| 38 | v3 | post-meeting reflection sales rep | 5 | Secondary | Cluster | informational | very low | easy | 5 | 4 | 72.25 | Maps to Sara's core use case. |
| 39 | v3 | field sales reflection after a meeting | 5 | Secondary | Cluster | informational | very low | easy | 5 | 4 | 72.25 | Specific to field motion. |
| 40 | v3 | how to deal with Gong anxiety | 7 | Secondary | Cluster | informational | very low | easy | 5 | 4 | 72.25 | Direct question-form. |
| 41 | v3 | Gong anxiety | 7 | Pillar | Fear | informational | very low | easy | 5 | 4 | 72.25 | Pure emotional keyword. |
| 42 | v3 | rep quitting over AI monitoring | 13 | Pillar | Cultural | informational | very low | easy | 5 | 4 | 72.25 | Anchored to Cornell 1-in-9. |
| 43 | v3 | after the call AI for sales | 1 | Secondary | Cluster | informational | low | easy | 5 | 3 | 70.75 | The "after" framing. |
| 44 | v3 | what to do after a sales meeting in person | 5 | Secondary | Cluster | informational | low | easy | 5 | 3 | 70.75 | Direct question. |
| 45 | v3 | how to think about a deal | 6 | Pillar | Methodology | informational | low | easy | 5 | 3 | 70.75 | Direct match to Sara. |
| 46 | v3 | privacy-first AI for sales | 4 | Secondary | Cluster | commercial | very low | easy | 4 | 3 | 70.25 | Privacy-first framing. |
| 47 | v3 | drive home from sales meeting | 5 | Pillar | Methodology | informational | very low | easy | 5 | 3 | 68.25 | The exact moment Keel's product serves. |
| 48 | v3 | parking lot debrief sales | 5 | Support-1 | Methodology | informational | very low | easy | 5 | 3 | 68.25 | Memorable term. |
| 49 | v3 | rep-first AI for sales | 1 | Secondary | Cluster | informational | very low | easy | 5 | 3 | 68.25 | Framing nobody owns. |
| 50 | v3 | unrecordable sales conversations | 1 | Pillar | Category | informational | very low | easy | 5 | 3 | 68.25 | Category-defining term. |
| 51 | v3 | AI for sales reps in the car | 3 | Secondary | Cluster | informational | very low | easy | 5 | 3 | 68.25 | Memorable. |
| 52 | v3 | how to reflect on a sales call | 5 | Support-1 | Methodology | informational | very low | easy | 5 | 3 | 68.25 | Direct question. |
| 53 | v3 | deal walk through AI | 6 | Secondary | Cluster | informational | very low | easy | 5 | 3 | 68.25 | Direct match. |
| 54 | v3 | deal stress test questions | 6 | Support-2 | Methodology | informational | very low | easy | 5 | 3 | 68.25 | Maps to reflection framework. |
| 55 | v3 | AE self-deal review | 6 | Secondary | Cluster | informational | very low | easy | 5 | 3 | 68.25 | Direct match. |
| 56 | v3 | pipeline review without manager | 6 | Secondary | Cluster | informational | very low | easy | 5 | 3 | 68.25 | Maps to "without manager" positioning. |
| 57 | v3 | before the deal review what to think about | 6 | Secondary | Cluster | informational | very low | easy | 5 | 3 | 68.25 | Long-tail. |
| 58 | v3 | sales rep autonomy | 9 | Support-2 | Cultural | informational | very low | easy | 5 | 3 | 68.25 | Direct positioning. |
| 59 | v3 | Gong bad for sales culture | 7 | Secondary | Fear | informational | very low | easy | 5 | 3 | 68.25 | Direct critical claim. |
| 60 | v3 | sales rep autonomy vs control | 9 | Secondary | Cultural | informational | very low | easy | 5 | 3 | 68.25 | Direct match. |
| 61 | v3 | sales rep autonomy AI | 9 | Secondary | Cultural | informational | very low | easy | 5 | 3 | 68.25 | Maps to rep-first positioning. |
| 62 | v3 | 5 minute sales debrief | 5 | Secondary | Cluster | informational | low | easy | 4 | 3 | 65.75 | Tactical. |
| 63 | v3 | sales meeting reflection questions | 5 | Support-1 | Methodology | informational | low | easy | 4 | 3 | 65.75 | Question-form. |
| 64 | v3 | deal went dark | 6 | Secondary | Cluster | informational | low | easy | 4 | 3 | 65.75 | Clean phrase. |
| 65 | v3 | what to do when deal goes quiet | 6 | Secondary | Cluster | informational | low | easy | 4 | 3 | 65.75 | Question-form. |
| 66 | v3 | Gong for introverts | 8 | Secondary | Positioning | informational | very low | easy | 4 | 4 | 66.75 | Memorable framing. |
| 67 | v3 | stealth sales AI | 8 | Secondary | Positioning | commercial | very low | easy | 4 | 4 | 66.75 | Maps to shadow IT. |
| 68 | v3 | sales rep burnout from monitoring | 13 | Secondary | Cultural | informational | very low | easy | 4 | 3 | 66.75 | Emerging pain. |
| 69 | v3 | AI thinking partner for sales rep | 1 | Secondary | Cluster | informational | very low | easy | 4 | 3 | 63.25 | Emerging language. |
| 70 | v3 | deal health check AE | 6 | Secondary | Cluster | informational | very low | easy | 4 | 3 | 63.25 | Self-assessment framing. |
| 71 | v3 | how to assess a deal honestly | 6 | Secondary | Cluster | informational | very low | easy | 4 | 3 | 63.25 | Question-form. |
| 72 | v3 | I hate call recording | 8 | Secondary | Fear | informational | very low | easy | 4 | 3 | 63.25 | Emotional. Hard to rank. |
| 73 | v3 | AI sales tool compliance | 4 | Secondary | Cluster | commercial | low | easy | 3 | 2 | 63.75 | Generic. |
| 74 | v3 | trust based selling | 9 | Pillar | Cultural | informational | low | easy | 4 | 3 | 64.50 | Established methodology. |
| 75 | v3 | high trust sales | 9 | Secondary | Cultural | informational | low | easy | 4 | 3 | 64.50 | Variant. |
| 76 | v3 | trust based sales culture | 9 | Support-1 | Cultural | informational | very low | easy | 5 | 3 | 66.50 | High-fit. Direct. |
| 77 | v3 | high trust sales culture | 9 | Secondary | Cultural | informational | very low | easy | 4 | 3 | 64.50 | Variant. |
| 78 | v3 | BYOAI sales | 8 | Pillar | Cultural | commercial | very low | easy | 5 | 4 | 68.50 | Emerging term. |
| 79 | v3 | BYOAI sales rep | 8 | Secondary | Cultural | commercial | very low | easy | 5 | 4 | 68.50 | Direct positioning. |
| 80 | v3 | shadow AI | 8 | Secondary | Cultural | commercial | very low | easy | 5 | 4 | 68.50 | Adjacent to BYOAI. |
| 81 | v3 | personal AI for work | 8 | Secondary | Cultural | commercial | very low | easy | 5 | 3 | 65.50 | Maps to positioning. |
| 82 | v3 | personal AI vs enterprise AI | 8 | Secondary | Cultural | informational | very low | easy | 5 | 3 | 65.50 | The dichotomy. |
| 83 | v3 | shadow AI in sales | 8 | Secondary | Cultural | commercial | very low | easy | 5 | 4 | 68.50 | Direct match. |
| 84 | v3 | reps using personal AI | 8 | Secondary | Cultural | commercial | very low | easy | 5 | 4 | 68.50 | Direct language. |
| 85 | v3 | AI tool my manager can't see | 8 | Secondary | Cultural | commercial | very low | easy | 5 | 4 | 68.50 | Rep framing. |
| 86 | v3 | Gong alternative for one person no manager | 2 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 79.25 | Variant. |
| 87 | v3 | AI sales tool for individual rep | 2 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 76.25 | Direct positioning. |
| 88 | v3 | AI sales tool for one person | 8 | Secondary | Positioning | commercial | very low | easy | 5 | 4 | 76.25 | Direct positioning. |
| 89 | v3 | rep-first sales AI | 1 | Secondary | Cluster | commercial | very low | easy | 5 | 3 | 68.25 | Emerging language. |
| 90 | v3 | private sales AI assistant | 8 | Secondary | Positioning | commercial | very low | easy | 5 | 4 | 76.75 | Direct positioning. |
| 91 | v3 | stealth AI for sales reps | 8 | Secondary | Positioning | commercial | very low | easy | 4 | 4 | 66.75 | Memorable. |
| 92 | v3 | Gong alternative for sales rep not manager | 2 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 79.25 | Variant. |
| 93 | v3 | conference follow up AI | 10 | Pillar | Scenario | commercial | very low | easy | 4 | 4 | 64.50 | Direct match. |
| 94 | v3 | trade show follow up AI | 10 | Support-1 | Scenario | commercial | very low | easy | 4 | 4 | 64.50 | Direct match. |
| 95 | v3 | post conference follow up | 10 | Secondary | Scenario | commercial | very low | easy | 4 | 3 | 62.50 | Generic but high-intent. |
| 96 | v3 | AI for trade show leads | 10 | Support-1 | Scenario | commercial | very low | easy | 4 | 3 | 62.50 | Niche. |
| 97 | v3 | personal AI for trade show | 10 | Support-2 | Scenario | commercial | very low | easy | 4 | 3 | 62.50 | Direct positioning. |
| 98 | v3 | conference networking follow up | 10 | Support-2 | Scenario | commercial | very low | easy | 4 | 3 | 62.50 | Niche. |
| 99 | v3 | after conference debrief | 5 | Secondary | Cluster | informational | very low | easy | 5 | 3 | 68.25 | Direct match. |
| 100 | v3 | trade show lead management | 10 | Secondary | Scenario | commercial | very low | easy | 4 | 3 | 62.50 | Generic. |
| 101 | v3 | conference lead follow up | 10 | Secondary | Scenario | commercial | very low | easy | 4 | 3 | 62.50 | Generic. |
| 102 | v3 | phone sales AI no recording | 11 | Pillar | Scenario | commercial | very low | easy | 5 | 4 | 68.50 | Direct match. |
| 103 | v3 | voicemail follow up AI | 11 | Support-1 | Scenario | commercial | very low | easy | 5 | 4 | 68.50 | Direct match. |
| 104 | v3 | missed call AI follow up | 11 | Secondary | Scenario | commercial | very low | easy | 4 | 3 | 64.50 | Direct match. |
| 105 | v3 | phone prospecting without recording | 11 | Secondary | Scenario | commercial | very low | easy | 5 | 4 | 68.50 | Direct match. |
| 106 | v3 | AI for phone sales rep | 11 | Support-2 | Scenario | commercial | very low | easy | 4 | 3 | 64.50 | Direct match. |
| 107 | v3 | AI voicemail detection | 11 | Secondary | Scenario | commercial | low | easy | 3 | 2 | 58.50 | Tool-specific. |
| 108 | v3 | phone sales follow up | 11 | Secondary | Scenario | commercial | very low | easy | 4 | 3 | 64.50 | Direct match. |
| 109 | v3 | after hours sales follow up | 11 | Secondary | Scenario | commercial | very low | easy | 4 | 3 | 64.50 | Direct match. |
| 110 | v3 | HOLD-WEB: Hedy review | 12 | Support-1 | Comparison | commercial | very low | easy | 5 | 4 | 73.25 | Direct review-intent. |
| 111 | v3 | Hedy alternative | 12 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 73.25 | Direct match. |
| 112 | v3 | Hedy vs Sara | 12 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 73.25 | Direct comparison. |
| 113 | v3 | Hedy pricing | 12 | Secondary | Comparison | commercial | very low | easy | 4 | 3 | 64.50 | Direct match. |
| 114 | v3 | HOLD-WEB: Closius review | 12 | Support-2 | Comparison | commercial | very low | easy | 5 | 4 | 73.25 | Direct review-intent. |
| 115 | v3 | Closius vs Sara | 12 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 73.25 | Direct comparison. |
| 116 | v3 | Closius alternative | 12 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 73.25 | Direct match. |
| 117 | v3 | Closius pricing | 12 | Secondary | Comparison | commercial | very low | easy | 4 | 3 | 64.50 | Direct match. |
| 118 | v3 | best AI for sales rep privacy | 12 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 76.25 | Bottom-of-funnel. |
| 119 | v3 | best AI for sales rep no recording | 12 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 76.25 | Bottom-of-funnel. |
| 120 | v3 | AmpUp vs Sara | 12 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 73.25 | Direct comparison. |
| 121 | v3 | Pod vs Sara | 12 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 73.25 | Direct comparison. |
| 122 | v3 | Hero vs Sara | 12 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 73.25 | Direct comparison. |
| 123 | v3 | Replicate Labs vs Sara | 12 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 73.25 | Direct comparison. |
| 124 | v3 | Gong for individual contributor | 12 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 76.25 | Direct match. |
| 125 | v3 | sales rep burnout | 13 | Support-1 | Cultural | informational | low | easy | 4 | 3 | 60.50 | Generic. |
| 126 | v3 | sales rep mental health | 13 | Secondary | Cultural | informational | very low | easy | 4 | 2 | 55.50 | Niche. |
| 127 | v3 | sales rep stress | 13 | Secondary | Cultural | informational | very low | easy | 4 | 2 | 55.50 | Niche. |
| 128 | v3 | sales rep anxiety | 13 | Secondary | Cultural | informational | very low | easy | 4 | 2 | 55.50 | Niche. |
| 129 | v3 | why sales reps quit | 13 | Secondary | Cultural | informational | low | easy | 4 | 2 | 58.50 | Direct match. |
| 130 | v3 | sales career longevity | 13 | Support-2 | Cultural | informational | very low | easy | 4 | 2 | 55.50 | Niche. |
| 131 | v3 | sustainable sales career | 13 | Support-2 | Cultural | informational | very low | easy | 4 | 2 | 55.50 | Niche. |
| 132 | v3 | pre-meeting reflection | 14 | Pillar | Methodology | informational | very low | easy | 5 | 3 | 68.25 | Direct match. |
| 133 | v3 | pre-call thinking | 14 | Secondary | Methodology | informational | very low | easy | 5 | 3 | 68.25 | Direct match. |
| 134 | v3 | deal preparation | 14 | Secondary | Methodology | informational | low | easy | 4 | 3 | 64.50 | Generic. |
| 135 | v3 | thinking through a deal | 14 | Support-1 | Methodology | informational | very low | easy | 5 | 3 | 68.25 | Direct match. |
| 136 | v3 | deal strategy before call | 14 | Secondary | Methodology | informational | very low | easy | 5 | 3 | 68.25 | Direct match. |
| 137 | v3 | mental rehearsal sales | 14 | Support-2 | Methodology | informational | very low | easy | 4 | 3 | 64.50 | Direct match. |
| 138 | v3 | sales call preparation | 14 | Secondary | Methodology | informational | low | easy | 4 | 3 | 64.50 | Generic. |
| 139 | v3 | customer AI trust | 15 | Pillar | Customer-side | informational | very low | easy | 5 | 3 | 65.50 | Direct match. |
| 140 | v3 | customer trust AI | 15 | Support-1 | Customer-side | informational | very low | easy | 5 | 3 | 65.50 | Direct match. |
| 141 | v3 | building customer trust sales | 15 | Support-2 | Customer-side | informational | very low | easy | 5 | 3 | 65.50 | Direct match. |
| 142 | v3 | customer consent recording | 15 | Secondary | Customer-side | informational | very low | easy | 4 | 3 | 60.50 | Niche. |
| 143 | v3 | customer asks is this recorded | 15 | Secondary | Customer-side | informational | very low | easy | 5 | 3 | 65.50 | Question-form. |
| 144 | v3 | customer recorded call | 15 | Secondary | Customer-side | informational | very low | easy | 4 | 3 | 60.50 | Niche. |
| 145 | v3 | internal debrief text sales | 5 | Secondary | Cluster | informational | very low | easy | 4 | 2 | 59.25 | Niche. |
| 146 | v3 | self-debrief sales call | 5 | Secondary | Cluster | informational | very low | easy | 4 | 2 | 59.25 | Niche. |
| 147 | v3 | AI for off-the-grid sales | 3 | Secondary | Cluster | informational | very low | easy | 4 | 2 | 59.25 | Niche. |
| 148 | v3 | MEDDPICC after the call | 6 | Secondary | Cluster | informational | very low | easy | 4 | 2 | 59.25 | Niche. |
| 149 | v3 | honest sales conversations | 7 | Secondary | Fear | informational | very low | easy | 4 | 2 | 59.25 | Abstract. |
| 150 | v3 | Gong scorecard complaint | 7 | Secondary | Fear | informational | very low | easy | 4 | 2 | 59.25 | Niche. |
| 151 | v3 | off the record sales conversation | 7 | Secondary | Fear | informational | very low | easy | 4 | 3 | 63.25 | Cultural phrase. |
| 152 | v3 | low trust sales culture | 9 | Secondary | Cultural | informational | very low | easy | 4 | 2 | 55.50 | Niche. |
| 153 | v3 | psychological safety sales team | 9 | Secondary | Cultural | informational | very low | easy | 4 | 3 | 60.50 | Niche. |
| 154 | v3 | high performance trust | 9 | Secondary | Cultural | informational | very low | easy | 4 | 2 | 55.50 | Niche. |
| 155 | v3 | sales rep empowerment | 9 | Secondary | Cultural | informational | very low | easy | 4 | 3 | 60.50 | Niche. |
| 156 | v3 | intrinsic motivation sales | 9 | Secondary | Cultural | informational | very low | easy | 4 | 2 | 55.50 | Niche. |
| 157 | v3 | trust based sales process | 9 | Secondary | Cultural | informational | very low | easy | 4 | 2 | 55.50 | Niche. |
| 158 | v3 | all-party consent states | 7 | Secondary | Fear | informational | low | easy | 4 | 3 | 62.50 | Niche. |
| 159 | v3 | call recording legal by state | 7 | Secondary | Fear | informational | low | easy | 4 | 3 | 62.50 | Niche. |
| 160 | v3 | two-party consent states sales calls | 7 | Support-1 | Fear | informational | very low | easy | 5 | 4 | 72.25 | Direct match. |
| 161 | v3 | call recording consent sales | 7 | Secondary | Fear | informational | low | easy | 4 | 3 | 62.50 | Niche. |
| 162 | v3 | Gong criticism | 7 | Support-2 | Fear | informational | very low | easy | 5 | 3 | 68.25 | Direct match. |
| 163 | v3 | Gong invasive | 7 | Secondary | Fear | informational | very low | easy | 4 | 3 | 63.25 | Niche. |
| 164 | v3 | AI sales scoring problems | 7 | Secondary | Fear | informational | very low | easy | 4 | 3 | 63.25 | Niche. |
| 165 | v3 | Gong scorecards | 7 | Support-2 | Fear | informational | very low | easy | 5 | 3 | 68.25 | Direct match. |
| 166 | v3 | Gong reps hate | 7 | Secondary | Fear | informational | very low | easy | 4 | 3 | 63.25 | Niche. |
| 167 | v3 | Gong backlash | 7 | Secondary | Fear | informational | very low | easy | 4 | 3 | 63.25 | Niche. |
| 168 | v3 | sales rep burnout AI monitoring | 13 | Pillar | Cultural | informational | very low | easy | 5 | 3 | 68.25 | Direct match. |
| 169 | v3 | alternative to call recording | 8 | Secondary | Positioning | commercial | very low | easy | 5 | 3 | 68.25 | Direct match. |
| 170 | v3 | no recording sales tool | 8 | Secondary | Positioning | commercial | very low | easy | 5 | 3 | 68.25 | Direct match. |
| 171 | v3 | AI for sales reps without recording | 8 | Secondary | Positioning | commercial | very low | easy | 5 | 3 | 68.25 | Direct match. |
| 172 | v3 | post-call debrief | 5 | Secondary | Cluster | informational | medium | hard | 3 | 2 | 46.75 | Crowded. Skip primary. |
| 173 | v3 | sales call debrief template | 5 | Secondary | Cluster | informational | medium | hard | 3 | 2 | 46.75 | Crowded. Skip primary. |
| 174 | v3 | champion went quiet | 6 | Support-1 | Cluster | informational | medium | moderate | 3 | 2 | 53.00 | Market Better owns. Skip primary. |
| 175 | v3 | stalled deal re-engagement | 6 | Secondary | Cluster | informational | medium | hard | 3 | 2 | 46.75 | Crowded. Skip primary. |
| 176 | v3 | how to revive a stalled deal | 6 | Secondary | Cluster | informational | medium | hard | 3 | 2 | 46.75 | Crowded. Skip primary. |
| 177 | v3 | economic buyer vs champion | 6 | Secondary | Cluster | informational | medium | hard | 2 | 2 | 41.75 | Crowded. Skip primary. |
| 178 | v3 | multi-threading sales | 6 | Secondary | Cluster | informational | medium | hard | 2 | 2 | 41.75 | Crowded. Skip primary. |
| 179 | v3 | how to multi-thread a deal | 6 | Secondary | Cluster | informational | medium | hard | 2 | 2 | 41.75 | Crowded. Skip primary. |
| 180 | v3 | mobile AI for sales | 3 | Secondary | Vertical | commercial | low | moderate | 3 | 2 | 57.50 | Crowded. Skip primary. |
| 181 | v4 | second brain for sales rep | 16 | Pillar | Productivity | commercial | low | easy | 5 | 5 | 79.25 | Gold Mine #1 |
| 182 | v4 | AI second brain for sales | 16 | Support-2 | Productivity | commercial | very low | easy | 5 | 4 | 76.50 | Direct match |
| 183 | v4 | personal CRM for sales rep | 16 | Support-1 | Productivity | commercial | low | easy | 5 | 4 | 73.25 | Established market |
| 184 | v4 | second brain for AE | 16 | Secondary | Productivity | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 185 | v4 | sales rep PKM | 16 | Secondary | Productivity | informational | very low | easy | 4 | 3 | 66.75 | Niche |
| 186 | v4 | personal CRM for one person | 16 | Secondary | Productivity | commercial | low | easy | 5 | 4 | 73.25 | Established search |
| 187 | v4 | solo CRM for sales | 16 | Secondary | Productivity | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 188 | v4 | personal knowledge management sales | 16 | Secondary | Productivity | informational | very low | easy | 4 | 3 | 66.75 | Niche |
| 189 | v4 | AI thinking partner for work | 16 | Secondary | Productivity | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 190 | v4 | second brain for sales | 16 | Secondary | Productivity | commercial | very low | easy | 5 | 4 | 76.25 | Direct match |
| 191 | v4 | thinking partner for sales | 16 | Secondary | Productivity | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 192 | v4 | personal sales notes | 16 | Secondary | Productivity | informational | very low | easy | 4 | 3 | 66.75 | Niche |
| 193 | v4 | note-taking for sales reps | 16 | Secondary | Productivity | informational | very low | easy | 4 | 3 | 66.75 | Established search |
| 194 | v4 | AI as second brain for sales | 16 | Secondary | Productivity | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 195 | v4 | note-taking system for sales | 16 | Secondary | Productivity | informational | very low | easy | 4 | 3 | 66.75 | Direct match |
| 196 | v4 | AI for in-between moments | 17 | Pillar | Category | commercial | very low | easy | 5 | 5 | 79.25 | Gold Mine #2 |
| 197 | v4 | AI for unscripted moments | 17 | Secondary | Category | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 198 | v4 | AI for informal conversations | 17 | Secondary | Category | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 199 | v4 | AI for hallway conversations | 17 | Support-1 | Category | commercial | very low | easy | 5 | 4 | 76.50 | Direct match |
| 200 | v4 | AI for elevator pitch | 17 | Secondary | Category | commercial | very low | easy | 4 | 3 | 66.75 | Niche |
| 201 | v4 | AI for coffee chat | 17 | Secondary | Category | commercial | very low | easy | 4 | 3 | 66.75 | Niche |
| 202 | v4 | AI for lunch meeting | 17 | Secondary | Category | commercial | very low | easy | 4 | 3 | 66.75 | Direct match |
| 203 | v4 | AI for unscheduled moments | 17 | Secondary | Category | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 204 | v4 | AI for off-the-cuff conversations | 17 | Secondary | Category | commercial | very low | easy | 4 | 3 | 66.75 | Niche |
| 205 | v4 | AI for casual conversations | 17 | Secondary | Category | commercial | very low | easy | 4 | 3 | 66.75 | Niche |
| 206 | v4 | drive-home debrief method | 17 | Support-2 | Methodology | informational | very low | easy | 5 | 3 | 68.25 | Direct match |
| 207 | v4 | in-between reflection | 17 | Secondary | Methodology | informational | very low | easy | 5 | 3 | 68.25 | Direct match |
| 208 | v4 | in-the-car debrief | 17 | Secondary | Methodology | informational | very low | easy | 4 | 3 | 65.75 | Niche |
| 209 | v4 | sales rep reflection method | 17 | Secondary | Methodology | informational | very low | easy | 5 | 3 | 68.25 | Direct match |
| 210 | v4 | AI for between meetings | 17 | Secondary | Category | commercial | very low | easy | 4 | 3 | 66.75 | Direct match |
| 211 | v4 | AI for sales rep with ADHD | 18 | Pillar | Persona | commercial | low | easy | 5 | 5 | 81.75 | Gold Mine #3 |
| 212 | v4 | AI for ADHD sales | 18 | Secondary | Persona | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 213 | v4 | sales rep ADHD tool | 18 | Secondary | Persona | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 214 | v4 | focus tool for sales | 18 | Secondary | Persona | commercial | low | easy | 4 | 3 | 65.75 | Direct match |
| 215 | v4 | AI for sales rep introverts | 18 | Support-1 | Persona | commercial | very low | easy | 5 | 4 | 76.50 | Direct match |
| 216 | v4 | AI for introverted sales | 18 | Secondary | Persona | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 217 | v4 | sales tools for introverts | 18 | Secondary | Persona | commercial | low | easy | 4 | 3 | 65.75 | Direct match |
| 218 | v4 | introvert-friendly sales AI | 18 | Secondary | Persona | commercial | very low | easy | 4 | 3 | 66.75 | Direct match |
| 219 | v4 | AI for relationship sellers | 18 | Support-2 | Persona | commercial | very low | easy | 5 | 4 | 76.50 | Direct match |
| 220 | v4 | AI for sales rep who hates cold calling | 18 | Secondary | Persona | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 221 | v4 | sales rep relationship focus | 18 | Secondary | Persona | informational | very low | easy | 4 | 3 | 66.75 | Niche |
| 222 | v4 | AI for warm outreach | 18 | Secondary | Persona | commercial | low | easy | 4 | 3 | 65.75 | Direct match |
| 223 | v4 | AI for new sales rep | 18 | Support-3 | Persona | commercial | low | easy | 5 | 4 | 73.25 | Direct match |
| 224 | v4 | new AE ramp | 18 | Secondary | Persona | commercial | low | easy | 4 | 3 | 65.75 | Direct match |
| 225 | v4 | first 90 days AE | 18 | Secondary | Persona | commercial | low | easy | 4 | 3 | 65.75 | Direct match |
| 226 | v4 | AI for new sales hire | 18 | Secondary | Persona | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 227 | v4 | sales rep first 90 days | 18 | Secondary | Persona | informational | low | easy | 4 | 3 | 65.75 | Direct match |
| 228 | v4 | AI for struggling sales rep | 18 | Secondary | Persona | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 229 | v4 | customer ghosted | 19 | Pillar | Scenario | commercial | medium | moderate | 5 | 5 | 84.50 | Gold Mine #4 |
| 230 | v4 | customer went dark | 19 | Secondary | Scenario | commercial | low | easy | 5 | 4 | 76.50 | Direct match |
| 231 | v4 | customer stopped responding | 19 | Secondary | Scenario | commercial | low | easy | 5 | 4 | 76.50 | Direct match |
| 232 | v4 | customer won't respond | 19 | Secondary | Scenario | commercial | low | easy | 5 | 4 | 76.50 | Direct match |
| 233 | v4 | customer ignoring me | 19 | Secondary | Scenario | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 234 | v4 | customer went cold | 19 | Secondary | Scenario | commercial | low | easy | 4 | 3 | 65.75 | Direct match |
| 235 | v4 | customer stopped opening emails | 19 | Secondary | Scenario | commercial | very low | easy | 4 | 3 | 66.75 | Niche |
| 236 | v4 | how to wake up a deal | 19 | Secondary | Scenario | informational | low | easy | 5 | 3 | 68.25 | Direct match |
| 237 | v4 | how to revive dead deal | 19 | Secondary | Scenario | informational | low | easy | 5 | 3 | 68.25 | Direct match |
| 238 | v4 | customer said call back next quarter | 19 | Secondary | Scenario | commercial | very low | easy | 5 | 4 | 73.25 | Long-tail specific |
| 239 | v4 | customer said no budget | 19 | Secondary | Scenario | commercial | very low | easy | 5 | 4 | 73.25 | Long-tail specific |
| 240 | v4 | customer said they're interested | 19 | Secondary | Scenario | commercial | very low | easy | 4 | 3 | 66.75 | Niche |
| 241 | v4 | customer said call me back | 19 | Secondary | Scenario | commercial | very low | easy | 4 | 3 | 66.75 | Niche |
| 242 | v4 | champion stopped responding | 19 | Secondary | Scenario | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 243 | v4 | champion changed roles | 19 | Secondary | Scenario | commercial | very low | easy | 4 | 3 | 66.75 | Direct match |
| 244 | v4 | champion got fired | 19 | Secondary | Scenario | commercial | very low | easy | 4 | 3 | 66.75 | Niche |
| 245 | v4 | founder to first AE | 20 | Pillar | Persona | commercial | low | easy | 5 | 5 | 81.75 | Gold Mine #5 |
| 246 | v4 | founder first sales hire | 20 | Secondary | Persona | commercial | low | easy | 5 | 4 | 73.25 | Direct match |
| 247 | v4 | founder to AE transition | 20 | Secondary | Persona | informational | very low | easy | 5 | 4 | 73.25 | Direct match |
| 248 | v4 | hiring first AE | 20 | Secondary | Persona | commercial | low | easy | 5 | 4 | 73.25 | Direct match |
| 249 | v4 | founder-led sales tools | 20 | Support-1 | Persona | commercial | low | easy | 5 | 4 | 76.50 | Established market |
| 250 | v4 | founder doing it all | 20 | Secondary | Persona | informational | low | easy | 4 | 3 | 65.75 | Direct match |
| 251 | v4 | founder sales tools | 20 | Secondary | Persona | commercial | low | easy | 5 | 4 | 73.25 | Direct match |
| 252 | v4 | first 10 customers founder | 20 | Secondary | Persona | informational | very low | easy | 4 | 3 | 66.75 | Direct match |
| 253 | v4 | founder sales 0 to 1 | 20 | Secondary | Persona | informational | very low | easy | 4 | 3 | 66.75 | Direct match |
| 254 | v4 | solo B2B sales | 20 | Support-2 | Persona | commercial | low | easy | 5 | 4 | 76.50 | Direct match |
| 255 | v4 | one person sales team | 20 | Secondary | Persona | commercial | low | easy | 5 | 4 | 73.25 | Direct match |
| 256 | v4 | solo enterprise sales | 20 | Secondary | Persona | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 257 | v4 | solo SaaS sales | 20 | Secondary | Persona | commercial | very low | easy | 4 | 3 | 66.75 | Direct match |
| 258 | v4 | solo outbound | 20 | Secondary | Persona | commercial | very low | easy | 4 | 3 | 66.75 | Niche |
| 259 | v4 | solo inbound | 20 | Secondary | Persona | commercial | very low | easy | 4 | 3 | 66.75 | Niche |
| 260 | v4 | solo sales motion | 20 | Secondary | Persona | commercial | very low | easy | 4 | 3 | 66.75 | Niche |
| 261 | v4 | HOLD-WEB: AI note taker alternative for sales | 21 | Pillar | Comparison | commercial | low | easy | 5 | 5 | 81.75 | Gold Mine #6 |
| 262 | v4 | HOLD-WEB: Fathom alternative for sales | 21 | Support-1 | Comparison | commercial | very low | easy | 5 | 5 | 84.50 | Direct match |
| 263 | v4 | HOLD-WEB: Otter alternative for sales | 21 | Secondary | Comparison | commercial | very low | easy | 5 | 5 | 84.50 | Direct match |
| 264 | v4 | HOLD-WEB: Read AI alternative for sales | 21 | Support-2 | Comparison | commercial | very low | easy | 5 | 5 | 84.50 | Direct match |
| 265 | v4 | HOLD-WEB: Fireflies alternative for sales | 21 | Secondary | Comparison | commercial | very low | easy | 5 | 5 | 84.50 | Direct match |
| 266 | v4 | AI note taker for sales rep | 21 | Secondary | Comparison | commercial | low | easy | 5 | 4 | 73.25 | Direct match |
| 267 | v4 | Fathom vs Sara | 21 | Secondary | Comparison | commercial | very low | easy | 5 | 5 | 84.50 | Direct match |
| 268 | v4 | Read AI vs Sara | 21 | Secondary | Comparison | commercial | very low | easy | 5 | 5 | 84.50 | Direct match |
| 269 | v4 | Otter for sales rep | 21 | Secondary | Comparison | commercial | very low | easy | 4 | 3 | 66.75 | Niche |
| 270 | v4 | Fathom for sales rep | 21 | Secondary | Comparison | commercial | very low | easy | 4 | 3 | 66.75 | Niche |
| 271 | v4 | Read AI for sales rep | 21 | Secondary | Comparison | commercial | very low | easy | 4 | 3 | 66.75 | Niche |
| 272 | v4 | Fathom privacy | 21 | Secondary | Comparison | informational | very low | easy | 4 | 2 | 59.25 | Niche |
| 273 | v4 | Read AI privacy | 21 | Secondary | Comparison | informational | very low | easy | 4 | 2 | 59.25 | Niche |
| 274 | v4 | AI meeting notes for sales rep | 21 | Secondary | Comparison | commercial | low | easy | 4 | 3 | 65.75 | Direct match |
| 275 | v4 | AI meeting summary for sales | 21 | Secondary | Comparison | commercial | low | easy | 4 | 3 | 65.75 | Direct match |
| 276 | v4 | AI notetaker for sales without recording | 21 | Secondary | Comparison | commercial | very low | easy | 5 | 4 | 73.25 | Direct match |
| 277 | v4 | lost deal analysis | 22 | Pillar | Scenario | commercial | medium | easy | 5 | 4 | 76.50 | Gold Mine #7 |
| 278 | v4 | post-mortem on a lost deal | 22 | Support-1 | Scenario | commercial | low | easy | 5 | 4 | 76.50 | Direct match |
| 279 | v4 | why did we lose this deal | 22 | Secondary | Scenario | informational | medium | easy | 5 | 3 | 70.75 | Universal |
| 280 | v4 | sales loss reflection | 22 | Secondary | Scenario | informational | very low | easy | 5 | 3 | 68.25 | Direct match |
| 281 | v4 | deal loss reflection | 22 | Secondary | Scenario | informational | very low | easy | 5 | 3 | 68.25 | Direct match |
| 282 | v4 | lost deal review | 22 | Secondary | Scenario | informational | very low | easy | 4 | 3 | 65.75 | Direct match |
| 283 | v4 | deal autopsy | 22 | Secondary | Scenario | informational | very low | easy | 4 | 3 | 65.75 | Niche |
| 284 | v4 | how to bounce back from a loss | 22 | Support-2 | Scenario | informational | low | easy | 5 | 3 | 68.25 | Direct match |
| 285 | v4 | after losing a deal | 22 | Secondary | Scenario | informational | low | easy | 4 | 3 | 65.75 | Direct match |
| 286 | v4 | deal loss recovery | 22 | Secondary | Scenario | informational | very low | easy | 4 | 3 | 65.75 | Niche |
| 287 | v4 | sales rep after a loss | 22 | Secondary | Scenario | informational | very low | easy | 4 | 2 | 59.25 | Niche |
| 288 | v4 | lost deal framework | 22 | Secondary | Scenario | informational | very low | easy | 4 | 2 | 59.25 | Niche |

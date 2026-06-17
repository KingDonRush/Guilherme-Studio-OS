# Cross-PRD Integration Map

Status: active planning map
Purpose: record the seams where PRDs must talk to each other before parallel
agents implement incompatible local versions.

## Integration Principles

- A cross-PRD concern has one owner and many consumers.
- Consumers depend on public contracts, not private implementation.
- If two PRDs need the same concept, do not duplicate it in two domain modules.
- A subagent may register a gap here, but must not silently decide another
  PRD's contract.

## Shared Seams

| Seam | Primary owner | Consumers | Contract to stabilize |
|---|---|---|---|
| Identity and duplicate review | PRD 02 | PRD 07, PRD 08, PRD 09 | person/organization reuse, duplicate candidates, merge guard |
| Communication records | PRD 02 | PRD 06, PRD 07, PRD 08, PRD 09, PRD 11 | channel, direction, subject, prepared action, external send flag |
| Prepared actions | PRD 01 | PRD 06, PRD 07, PRD 08, PRD 09, PRD 11, PRD 12 | prepare, confirm, execute, reconcile, expiry, checksum |
| Agent Harness Loop | PRD 10 | all PRDs | start, context, authorize, observe, action, verify, evidence, handoff, close |
| Interface exposure | PRD 11 | all PRDs | CLI/API/MCP/panel routes over command runtime |
| Classification and secret rejection | PRD 12 | all PRDs | field classification, secret-shaped detection, redaction, false-positive decision |
| Claim-to-evidence | PRD 05 | PRD 04, PRD 06, PRD 07, PRD 08 | claim type, evidence reliability, allowed copy, stale claim detection |
| Repository health | PRD 04 | PRD 03, PRD 05, PRD 10, PRD 12 | git root, branch, remote policy, dirty state, nested repo registry |
| WordPress environment health | PRD 03 | PRD 04, PRD 05, PRD 12 | WP-CLI health, plugin list, DB/uploads backup, restore check |
| Asset governance | PRD 05 | PRD 03, PRD 04, PRD 06 | source asset, optimized output, SEO metadata, manifest, checksum |
| Economic next actions | PRD 01 | PRD 02, PRD 07, PRD 08, PRD 09 | ranking reasons, due dates, obligation, revenue, follow-up, blockers |
| Finance and delivery closure | PRD 09 | PRD 03, PRD 07 | expected/invoiced/paid/reconciled states, unresolved obligations |
| Intake gaps | PRD 10 | all domain PRDs | `intake_required`, missing kinds, no fabricated records |

## Required Cross-PRD Fixtures

These fixtures should become executable checks before final PRD acceptance.

### Prospect to Client to Engagement

Owners:

- PRD 02 identity and CRM;
- PRD 07 opportunity and proposal;
- PRD 03 engagement and deliverable;
- PRD 09 contract/invoice/payment.

Must prove:

- duplicate review happens before active outreach;
- proposal and contract are linked;
- opportunity conversion creates linked client and engagement;
- delivery cannot close while finance obligations remain unresolved.

### Product Release to Portfolio Case to Campaign

Owners:

- PRD 04 release and repo;
- PRD 05 claim map and case;
- PRD 06 campaign and publication;
- PRD 12 security/public data guard.

Must prove:

- release claims map to tests or source evidence;
- case copies references, not product truth;
- publication payload is prepared and confirmed exactly;
- stale evidence is detected after product changes.

### Job Application via LinkedIn

Owners:

- PRD 08 role/application;
- PRD 02 organization identity;
- PRD 05 portfolio evidence;
- PRD 07 evidence-backed outreach discipline;
- PRD 11 interface exposure.

Must prove:

- role source snapshot is preserved;
- claims resolve to evidence;
- LinkedIn submission remains a prepared action until confirmed;
- follow-up timing is visible as an economic next action.

### Visual Feedback to Verified WordPress Implementation

Owners:

- PRD 03 delivery;
- PRD 04 repository;
- PRD 05 assets/evidence;
- PRD 10 Agent Harness Loop.

Must prove:

- user feedback becomes an observation, not a rewrite impulse;
- viewport/environment evidence is captured;
- repository health is checked before and after work;
- handoff includes what not to rethink.

### Security Incident and Recovery

Owners:

- PRD 12 security/recovery;
- PRD 10 agent governance;
- PRD 04 repository health;
- PRD 03 WordPress backup/restore.

Must prove:

- secret-shaped content is rejected;
- incident work gets a high/critical risk run;
- destructive recovery requires backup evidence and confirmation;
- restore rehearsal writes durable evidence.

## Conflict Prevention Rules

When a PRD agent needs a shared seam:

1. Check this map first.
2. If the seam exists, consume the owner contract.
3. If the seam is insufficient, append a `Gap` entry below.
4. Do not implement a parallel local version.
5. If blocked, return a handoff that names the missing owner decision.

## Open Gap Register

| ID | Seam | Raised by | Blocking what | Required owner decision |
|---|---|---|---|---|
| GAP-001 | Agent Harness Loop | planning | all PRD implementation runs | exact AgentRun state machine and close gate |
| GAP-002 | Context packs | planning | MCP/panel/agent execution | canonical context pack schema and redaction budget |
| GAP-003 | Claim-to-evidence | planning | portfolio, marketing, career, sales | claim type enum and stale claim policy |
| GAP-004 | Communication provider boundary | planning | sales, career, marketing, finance | provider payload shape and fake/local reconciliation |
| GAP-005 | Asset promotion | planning | portfolio, WordPress, marketing | WebP/SEO/quality manifest policy for WordPress assets |
| GAP-006 | Intake vs capability scoring | planning | acceptance reporting | stricter coverage metric that does not overstate PRD completion |


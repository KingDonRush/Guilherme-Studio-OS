# PRD 10 Capability Matrix: Knowledge, Memory, and Agents

Target: 100% capability complete as the primary AI harness.
Current estimate: 100%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Knowledge placement | Route information to constitution, PRD, decision, entity, workflow, evidence, lesson or note. | capability_complete | `knowledge.route` requires explicit destination and writes evidence, entity notes or governance route records. | CLI/core, API/MCP via command runtime | routing tests and CLI dry-run test | Ambiguous input asks for classification. |
| Decision memory | Record decisions with alternatives, authority, impact, reversibility and evidence. | capability_complete | Decision schema includes alternatives, authority, impact, reversibility, amendments and contradiction IDs. Active same-title contradiction requires `decision.amend` or explicit contradiction. | CLI/core, API/MCP via command runtime | decision contradiction and amendment tests | No silent override. |
| Context packs | Build scoped context with objective, entities, repos, constraints, decisions, evidence, next action and forbidden reconsiderations. | capability_complete | Context pack lives on AgentRun with source revisions, checksum, redactions, gaps and next action. | CLI/core, API/MCP via command runtime | agent harness lifecycle and redaction tests | Missing real data listed as gap. |
| Development method lens | Force development-related Studio work to carry the Praxis-derived operating questions before closure. | capability_complete | `agent.context` can attach a typed `development` method lens to the context pack; missing required lens answers become gaps and block `agent.close` for material runs. | CLI/core/MCP via command runtime | `npm run verify`; evidence `evd_20260619_development-method-lens-harness-verification` | No fake work data; unanswered areas remain explicit gaps. |
| Redaction | Exclude unrelated confidential material and secrets. | capability_complete | Secret-shaped values are rejected; context packs now filter referenced entities above the AgentRun classification budget and record explicit redactions/gaps. | CLI/core/MCP | redaction and classification-budget tests | No raw secrets or over-budget entity summaries in context. |
| Agent run start | Register objective, actor, risk, tools, targets and authority. | capability_complete | `agent.start` creates governed AgentRun with objective, phase, risk, targets and authority. | CLI/core, API/MCP via command runtime | start tests and CLI dry-run test | Material work requires run. |
| Authorization | Track oriented, authorized, verifying or blocked states. | capability_complete | AgentRun state machine enforces draft -> oriented -> authorized -> in_progress/verifying -> handoff_ready -> closed. | CLI/core, API/MCP via command runtime | authorization and lifecycle tests | Unauthorized actions blocked. |
| Observation | Record Git/runtime/context observations before mutation. | capability_complete | `agent.observe` records source, summary, repository and contradictions before action. | CLI/core, API/MCP via command runtime | observation tests | Current reality beats stale handoff. |
| Action log | Record actions, commands, files, status and evidence refs. | capability_complete | `agent.record-action` records action status, command, target and evidence IDs. | CLI/core, API/MCP via command runtime | action log tests | No action log fabrication. |
| Verification | Complete verification with command, result, artifact and not-run reason if needed. | capability_complete | `agent.verify` records passed/failed/not_run verification and requires not-run reason. | CLI/core, API/MCP via command runtime | verification tests | Not-run is explicit residual risk. |
| Handoff | Create handoff with current state, next action, gaps and what not to rethink. | capability_complete | `agent.handoff` records summary, gaps, next action, forbidden reopenings, confirmation boundaries and evidence. | CLI/core, API/MCP via command runtime | handoff tests and legacy fixture compatibility | Handoff can state blocker. |
| Close gate | Prevent closure with unresolved required process. | capability_complete | `agent.close` requires context pack, observation, action or blocker, verification, evidence or gap, and handoff. | CLI/core, API/MCP via command runtime | close gate tests | Blocked close remains blocked. |
| Learning promotion | Promote recurring failures to workflow/schema/test/decision. | capability_complete | `agent propose-learning` records learning proposals as decision records with failure class and destination. | CLI/core, API/MCP via command runtime | learning proposal tests | One-off symptoms stay local. |

Wave 1 note: the Agent Harness Loop, knowledge routing, decision contradiction
guard, learning proposal records and classification-aware context minimization
are now capability complete across core/CLI/MCP command surfaces.
Remaining work, if any, belongs to PRD 11 panel presentation or PRD 12 broader
security/recovery hardening, not PRD 10 harness capability.

2026-06-18 classification-aware context update:

- AgentRun start accepts a classification budget.
- Context packs include only referenced entities at or below the run
  classification budget, while omitting over-budget entities from
  `included_entity_ids` and `source_revisions`.
- Over-budget referenced entities are recorded as explicit redactions and gaps.
- Added focused Agent Harness coverage for confidential entity omission from an
  internal context pack.

2026-06-19 self-build execution update:

- Closed `run_20260619_self-build-storage-config-path-extraction` as the first
  real Studio OS self-build run using the development method lens.
- Recorded action, verification, evidence and handoff for a scoped storage
  config/path extraction.
- Evidence:
  `evd_20260619_self-build-storage-config-path-extraction-verification`.

2026-06-19 second self-build execution update:

- Closed `run_20260619_self-build-storage-transaction-lock-extraction` using
  the same harness loop and development method lens.
- Recorded action, verification, evidence and handoff for transaction/lock
  extraction in storage.
- Evidence:
  `evd_20260619_self-build-storage-transaction-lock-extraction-verification`.

2026-06-19 third self-build execution update:

- Closed `run_20260619_self-build-storage-entity-file-scanning-extraction`
  using the same harness loop and development method lens.
- Recorded action, verification, evidence and handoff for entity file scanning
  extraction in storage.
- Evidence: `evd_20260619_storage-file-scan-verification`.

2026-06-19 fourth self-build execution update:

- Closed `run_20260619_self-build-storage-event-store-extraction` using the
  same harness loop and development method lens.
- Recorded action, verification, evidence and handoff for EventStore extraction
  in storage.
- Evidence: `evd_20260619_storage-event-verification`.

2026-06-19 fifth self-build execution update:

- Closed `run_20260619_self-build-storage-projection-extraction` using the same
  harness loop and development method lens.
- Recorded action, verification, evidence and handoff for SQLite projection
  extraction in storage.
- Evidence: `evd_20260619_storage-projection-verification`.

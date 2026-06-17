# PRD 10 Capability Matrix: Knowledge, Memory, and Agents

Target: 100% capability complete as the primary AI harness.
Current estimate: 65%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Knowledge placement | Route information to constitution, PRD, decision, entity, workflow, evidence, lesson or note. | missing | Add routeKnowledge command and destination rules. | CLI/MCP/panel | routing tests | Ambiguous input asks for classification. |
| Decision memory | Record decisions with alternatives, authority, impact, reversibility and evidence. | partial | Expand decision schema and contradiction detection. | CLI/API/MCP/panel | decision tests | No silent override. |
| Context packs | Build scoped context with objective, entities, repos, constraints, decisions, evidence, next action and forbidden reconsiderations. | capability_complete | Context pack lives on AgentRun with source revisions, checksum, redactions, gaps and next action. | CLI/core, API/MCP via command runtime | agent harness lifecycle and redaction tests | Missing real data listed as gap. |
| Redaction | Exclude unrelated confidential material and secrets. | partial | Secret-shaped values are rejected; classification-aware minimization remains PRD 12/PRD 11 follow-up. | CLI/core | redaction tests | No raw secrets in context. |
| Agent run start | Register objective, actor, risk, tools, targets and authority. | capability_complete | `agent.start` creates governed AgentRun with objective, phase, risk, targets and authority. | CLI/core, API/MCP via command runtime | start tests and CLI dry-run test | Material work requires run. |
| Authorization | Track oriented, authorized, verifying or blocked states. | capability_complete | AgentRun state machine enforces draft -> oriented -> authorized -> in_progress/verifying -> handoff_ready -> closed. | CLI/core, API/MCP via command runtime | authorization and lifecycle tests | Unauthorized actions blocked. |
| Observation | Record Git/runtime/context observations before mutation. | capability_complete | `agent.observe` records source, summary, repository and contradictions before action. | CLI/core, API/MCP via command runtime | observation tests | Current reality beats stale handoff. |
| Action log | Record actions, commands, files, status and evidence refs. | capability_complete | `agent.record-action` records action status, command, target and evidence IDs. | CLI/core, API/MCP via command runtime | action log tests | No action log fabrication. |
| Verification | Complete verification with command, result, artifact and not-run reason if needed. | capability_complete | `agent.verify` records passed/failed/not_run verification and requires not-run reason. | CLI/core, API/MCP via command runtime | verification tests | Not-run is explicit residual risk. |
| Handoff | Create handoff with current state, next action, gaps and what not to rethink. | capability_complete | `agent.handoff` records summary, gaps, next action, forbidden reopenings, confirmation boundaries and evidence. | CLI/core, API/MCP via command runtime | handoff tests and legacy fixture compatibility | Handoff can state blocker. |
| Close gate | Prevent closure with unresolved required process. | capability_complete | `agent.close` requires context pack, observation, action or blocker, verification, evidence or gap, and handoff. | CLI/core, API/MCP via command runtime | close gate tests | Blocked close remains blocked. |
| Learning promotion | Promote recurring failures to workflow/schema/test/decision. | missing | Add learning proposal records. | CLI/panel | learning tests | One-off symptoms stay local. |

Wave 1 note: the Agent Harness Loop is now capability complete in core/CLI.
Remaining PRD 10 work is knowledge routing, richer decision memory,
classification-aware context minimization and learning promotion.

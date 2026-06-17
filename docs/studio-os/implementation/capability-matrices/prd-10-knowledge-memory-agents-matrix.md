# PRD 10 Capability Matrix: Knowledge, Memory, and Agents

Target: 100% capability complete as the primary AI harness.
Current estimate: 30%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Knowledge placement | Route information to constitution, PRD, decision, entity, workflow, evidence, lesson or note. | missing | Add routeKnowledge command and destination rules. | CLI/MCP/panel | routing tests | Ambiguous input asks for classification. |
| Decision memory | Record decisions with alternatives, authority, impact, reversibility and evidence. | partial | Expand decision schema and contradiction detection. | CLI/API/MCP/panel | decision tests | No silent override. |
| Context packs | Build scoped context with objective, entities, repos, constraints, decisions, evidence, next action and forbidden reconsiderations. | missing | Add context-pack schema, builder and storage. | CLI/MCP/API/panel | context pack tests | Missing real data listed as gap. |
| Redaction | Exclude unrelated confidential material and secrets. | missing | Integrate classification/redaction budget. | CLI/MCP/API | redaction tests | No raw secrets in context. |
| Agent run start | Register objective, actor, risk, tools, targets and authority. | missing | Add `agent.start` command and state machine. | CLI/API/MCP/panel | start tests | Material work requires run. |
| Authorization | Track oriented, authorized, verifying or blocked states. | missing | Add `agent.authorize` and transition preconditions. | CLI/API/MCP/panel | authorization tests | Unauthorized actions blocked. |
| Observation | Record Git/runtime/context observations before mutation. | missing | Add `agent.observe` and repo health link. | CLI/API/MCP/panel | observation tests | Current reality beats stale handoff. |
| Action log | Record actions, commands, files, status and evidence refs. | missing | Add `agent.record-action`. | CLI/API/MCP/panel | action log tests | No action log fabrication. |
| Verification | Complete verification with command, result, artifact and not-run reason if needed. | missing | Add `agent.verify`. | CLI/API/MCP/panel | verification tests | Not-run is explicit residual risk. |
| Handoff | Create handoff with current state, next action, gaps and what not to rethink. | partial | Replace simple handoff with required handoff contract. | CLI/API/MCP/panel | handoff tests | Handoff can state blocker. |
| Close gate | Prevent closure with unresolved required process. | missing | Add `agent.close` preconditions. | CLI/API/MCP/panel | close gate tests | Blocked close remains active/blocked. |
| Learning promotion | Promote recurring failures to workflow/schema/test/decision. | missing | Add learning proposal records. | CLI/panel | learning tests | One-off symptoms stay local. |

Completion blocker: this PRD is the harness. It must be implemented before
large parallel agent execution.


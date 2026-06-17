# PRD 03 Capability Matrix: Engagements and WordPress Delivery

Target: 100% capability complete without requiring real client delivery.
Current estimate: 35%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Engagement initiation | Create engagement from won opportunity or direct approved demand. | partial | Add direct approved-demand command with evidence basis. | CLI/API/MCP | initiation tests | No client demand means intake gap. |
| Deliverable planning | Split engagement into independently accepted outputs. | missing | Add deliverable creation/planning command and acceptance model. | CLI/API/panel | multi-deliverable fixture | No fake deliverables. |
| WordPress project bootstrap | Register/provision independent Git and Dockerized WordPress with assumptions. | partial | Tie WordPress provision result to project/environment lifecycle. | CLI/API/panel | WP adapter tests | Local template allowed; no production creds. |
| Requirement control | Link brief, scope, decisions and change requests. | missing | Add requirement/change request entities or structured records. | CLI/API/MCP/panel | change-control tests | Missing brief is visible blocker. |
| Scope impact | Calculate impact before accepting material changes. | missing | Add scope impact command and confirmation gate. | CLI/API/panel | scope tests | No automatic acceptance. |
| Production workflow | Plan, implement, verify, review, approve, deliver and support. | partial | Add workflow states and verification hooks. | CLI/API/panel/MCP | delivery workflow fixture | Empty workflow shows next required step. |
| WordPress security gate | Enforce capabilities, nonces, escaping, dependency and upgrade checks. | partial | Add checklist/evidence command and adapter smoke. | CLI/panel | WP security fixture | Does not inspect unknown prod without input. |
| Delivery package | Assemble handoff, docs, backups and acceptance evidence. | missing | Add `prepareDelivery` and close gate. | CLI/API/panel | closure tests | Missing backup/docs block closure. |
| Warranty | Start warranty only after delivery conditions are met. | missing | Add warranty state and date rules. | CLI/API/panel | warranty tests | No warranty without accepted delivery. |
| Repository health | Check before and after agent work. | partial | Integrate PRD 04 repo health into AgentRun close gate. | CLI/MCP/panel | repo health fixture | No repo means intake gap. |

Completion blocker: delivery lifecycle is not yet encoded as a full workflow.


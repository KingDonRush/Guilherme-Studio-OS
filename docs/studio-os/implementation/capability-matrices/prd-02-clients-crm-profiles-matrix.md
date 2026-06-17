# PRD 02 Capability Matrix: Clients, CRM, and Profiles

Target: 100% capability complete without requiring real clients.
Current estimate: 25%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Unified identity | Reuse person/organization across CRM, sales, career and communications. | partial | Add identity lookup, duplicate candidate records and merge guard. | CLI/API/MCP/panel | duplicate and merge tests | If no contacts exist, show intake gap. |
| Duplicate review | Detect probable duplicates and require review before merge. | partial | Add review decision state and reversible merge plan. | CLI/MCP/panel | duplicate fixtures | No fake identities. |
| Prospect qualification | Capture source, fit, need, market, relationship, next action and disqualification reason. | partial | Expand prospect schema and qualification command. | CLI/API/MCP/panel | qualification tests | Prospect creation requires provided input. |
| Client profile | Store overview, legal/commercial refs, stakeholders, channel, language, timezone, brand, constraints, risk. | missing | Add profile sections and update commands. | CLI/API/panel | schema and update tests | Missing client data is `intake_required`. |
| Relationship timeline | Link communications, meetings, proposals, approvals, disputes and payments. | missing | Add timeline query and communication summary command. | CLI/API/MCP/panel | timeline tests | Empty timeline is valid. |
| Health and next action | Explain stale follow-ups, approvals, payment risk and active engagement signals. | missing | Implement client health resolver. | CLI/API/panel | health ranking tests | No opaque sentiment scores. |
| Client context pack | Produce scoped context excluding secrets and unrelated engagement details. | missing | Integrate with PRD 10 context pack builder. | MCP/CLI | redaction/context tests | Missing profile sections listed as gaps. |
| Safety | Contact data confidential by default; deletion blocked with retention constraints. | partial | Add classification defaults and delete/archive guard. | CLI/API | security tests | No credential storage. |

Completion blocker: client profile and context pack are not implemented as
first-class capabilities.


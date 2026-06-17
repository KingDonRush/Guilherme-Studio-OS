# PRD 04 Capability Matrix: Products, Plugins, and Repositories

Target: 100% capability complete without requiring new products.
Current estimate: 45%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Product registry | Record thesis, target user, problem, differentiation, status and economic role. | partial | Expand product schema and update commands. | CLI/API/panel | product schema tests | Existing three plugins can remain current data. |
| Product links | Link repositories, packages, demos, cases, offers and campaigns. | partial | Add relation commands and link validation. | CLI/API/panel/MCP | relation tests | Missing links show intake gap. |
| Roadmap vs implemented | Separate roadmap claims from shipped capabilities. | missing | Add claim type and roadmap guard with PRD 05. | CLI/API/panel | claim tests | No invented roadmap. |
| Repository registry | Register root, remote, visibility, branch, release model, runtime relation and health commands. | partial | Expand repository schema and health command discovery. | CLI/API/MCP/panel | repo adapter tests | Missing repo is intake gap. |
| Nested repo boundaries | Detect nested boundaries and prevent root staging. | partial | Add root staging warning and registered child policy. | CLI doctor/panel | nested repo tests | No mutation without explicit command. |
| Product development | Connect decisions, tasks, tests, security reviews and releases. | partial | Add product development context query. | CLI/MCP/panel | workflow fixture | Empty tasks show next action. |
| Architecture debt | Detect monolithic files and debt thresholds. | missing | Add repo health rule for configured thresholds. | CLI/panel | repo health tests | Configurable, no automatic refactor. |
| Release management | Prepare version, changelog, compatibility, migration, assets, tests, payload. | partial | Expand release prepare/verify/publish commands. | CLI/API/MCP/panel | release fixture | No release data means intake gap. |
| Demo and evidence | Register demos and keep demo brands separate from case identity. | missing | Add demo records and separation guard. | CLI/API/panel | demo/case tests | No fake public claims. |
| Publication gate | Publish only after confirmation and clean verified state. | partial | Add dirty/unverified release block. | CLI/API/panel | publication tests | External provider stays fake/blocked. |

Completion blocker: release readiness and demo/case separation are not yet
first-class.


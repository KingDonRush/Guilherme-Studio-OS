# PRD 11 Capability Matrix: CLI, MCP, and Local Panel

Target: 100% capability complete without requiring MCP to be always running.
Current estimate: 50%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Shared rule | All mutations call Studio Core and produce same events/gates/errors. | partial | Expand equivalence tests to all semantic commands. | CLI/API/MCP | integration tests | Fixtures are deterministic. |
| CLI command groups | Required domain command groups exist with meaningful verbs. | partial | Replace generic creates with semantic verbs per PRD. | CLI | CLI help/tests | Empty domains show intake. |
| CLI machine behavior | JSON, dry-run, explicit IDs, exit codes, no prompts, idempotency, expected revision. | partial | Add stable exit tests for every mutable command. | CLI | CLI test matrix | No real data required. |
| MCP resources | Constitution, policies, schemas, lifecycles, context packs, repo/env, workflows. | partial | Add missing context-pack and run handoff resources. | MCP | stdio smoke | Missing data in resource gaps. |
| MCP tools | Query, health, prepare, low-risk mutate, validate, evidence, external actions, confirmation status. | partial | Add tool annotations and coverage per command class. | MCP | MCP tool tests | External execution blocked. |
| MCP prompts | Opportunity, engagement, implementation diagnosis, case, content, application, handoff. | partial | Add missing workflow prompts backed by canonical docs. | MCP | prompt smoke | Prompts do not mutate by themselves. |
| Panel home | Revenue, obligations, engagements, sales/applications, next actions, repo health, external actions. | partial | Add finance/obligation and intake-aware empty states. | panel/API | Playwright smoke | Empty data shown honestly. |
| Panel domain views | Clients, sales, applications, products, portfolio, tasks/runs, diagnostics, backup. | partial | Expand views from tables to operational flows. | panel/API | Playwright smoke | No YAML editor primary flow. |
| Panel mutation | Forms call API; protected actions show exact impact and confirmation. | partial | Add domain mutation forms and stale projection handling. | panel/API | panel mutation tests | No external sends. |
| Runtime security | Loopback, token, origin checks, MCP separate process consuming same core. | partial | Keep Host/Origin tests and MCP smoke current. | API/MCP | security tests | No public bind default. |
| CLI fallback | CLI remains fully useful when panel/MCP unavailable. | partial | Agent Harness Loop must be complete in CLI. | CLI | fallback tests | CLI is canonical fallback. |

Completion blocker: interface breadth must follow PRD capabilities, not just
current generic entity CRUD.


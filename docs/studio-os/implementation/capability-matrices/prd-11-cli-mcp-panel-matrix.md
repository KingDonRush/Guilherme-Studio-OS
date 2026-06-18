# PRD 11 Capability Matrix: CLI, MCP, and Local Panel

Target: 100% capability complete without requiring MCP to be always running.
Current estimate: 65%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Shared rule | All mutations call Studio Core and produce same events/gates/errors. | partial | Expand equivalence tests to all semantic commands. | CLI/API/MCP | integration tests | Fixtures are deterministic. |
| CLI command groups | Required domain command groups exist with meaningful verbs. | partial | Replace generic creates with semantic verbs per PRD. | CLI | CLI help/tests | Empty domains show intake. |
| CLI machine behavior | JSON, dry-run, explicit IDs, exit codes, no prompts, idempotency, expected revision. | partial | Add stable exit tests for every mutable command. | CLI | CLI test matrix | No real data required. |
| MCP resources | Constitution, policies, schemas, lifecycles, context packs, repo/env, workflows. | agent harness surface complete; broader lifecycle/policy resources partial | Add lifecycle contract and active policy resources. | MCP | build + smoke | Missing data in resource gaps. |
| MCP tools | Query, health, prepare, low-risk mutate, validate, evidence, external actions, confirmation status. | agent harness read tools complete; broader command-class annotations partial | Add tool annotations and coverage per command class. | MCP | MCP tool tests | External execution blocked. |
| MCP prompts | Opportunity, engagement, implementation diagnosis, case, content, application, handoff. | capability_complete for normative prompt set | Add smoke/assertion coverage for prompt registration. | MCP | prompt smoke | Prompts do not mutate by themselves. |
| Panel home | Revenue, obligations, engagements, sales/applications, next actions, repo health, external actions. | partial | Add finance/obligation and intake-aware empty states. | panel/API | Playwright smoke | Empty data shown honestly. |
| Panel domain views | Clients, sales, applications, products, portfolio, tasks/runs, diagnostics, backup. | agent runs/context/handoff operational view complete; other domains partial | Expand remaining views from tables to operational flows. | panel/API | build + API test; Playwright pending | No YAML editor primary flow. |
| Panel mutation | Forms call API; protected actions show exact impact and confirmation. | partial | Add domain mutation forms and stale projection handling. | panel/API | panel mutation tests | No external sends. |
| Runtime security | Loopback, token, origin checks, MCP separate process consuming same core. | partial | Keep Host/Origin tests and MCP smoke current. | API/MCP | security tests | No public bind default. |
| CLI fallback | CLI remains fully useful when panel/MCP unavailable. | agent harness fallback complete; full command matrix partial | Complete stable exit/idempotency tests for every mutable command. | CLI | fallback tests | CLI is canonical fallback. |

Completion blocker: interface breadth must follow PRD capabilities, not just
current generic entity CRUD.

2026-06-18 update:

- Added a shared Agent Harness read model in core for runs, context packs,
  handoffs and gaps.
- Exposed AgentRun context pack and handoff resources/tools through MCP.
- Added PRD 11 normative workflow prompts for opportunity qualification,
  engagement setup, implementation diagnosis, case seeding, content briefing,
  application preparation and handoff creation.
- Added local API read-only AgentRun endpoints and panel consumption for the
  same report.
- Remaining PRD 11 work: full CLI command matrix, broader interface equivalence
  tests, lifecycle/policy MCP resources, richer mutation forms, stale projection
  UI handling and final MCP/Playwright smokes.

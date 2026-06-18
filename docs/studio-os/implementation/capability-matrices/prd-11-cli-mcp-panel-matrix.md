# PRD 11 Capability Matrix: CLI, MCP, and Local Panel

Target: 100% capability complete without requiring MCP to be always running.
Current estimate: 86%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Shared rule | All mutations call Studio Core and produce same events/gates/errors. | AgentRun dry-run equivalence covered across core, CLI, local API and MCP command wrapper; broad semantic matrix partial | Expand equivalence tests to all semantic commands. | CLI/API/MCP | integration tests | Fixtures are deterministic. |
| CLI command groups | Required domain command groups exist with meaningful verbs. | partial | Replace generic creates with semantic verbs per PRD. | CLI | CLI help/tests | Empty domains show intake. |
| CLI machine behavior | JSON, dry-run, explicit IDs, exit codes, no prompts, idempotency, expected revision. | partial | Add stable exit tests for every mutable command. | CLI | CLI test matrix | No real data required. |
| MCP resources | Constitution, policies, schemas, lifecycles, context packs, repo/env, workflows. | agent harness surface complete; in-memory MCP smoke covers resources; broader lifecycle/policy resources partial | Add lifecycle contract and active policy resources. | MCP | build + smoke | Missing data in resource gaps. |
| MCP tools | Query, health, prepare, low-risk mutate, validate, evidence, external actions, confirmation status. | agent harness read and lifecycle mutation tools complete; broader command-class annotations partial | Add tool annotations and coverage per command class. | MCP | MCP lifecycle smoke | External execution blocked. |
| MCP prompts | Opportunity, engagement, implementation diagnosis, case, content, application, handoff. | capability_complete for normative prompt set with smoke coverage | Add argument-level prompt assertions where needed. | MCP | prompt smoke | Prompts do not mutate by themselves. |
| Panel home | Revenue, obligations, engagements, sales/applications, next actions, repo health, external actions. | partial; built-panel smoke now covers the operational shell | Add finance/obligation and intake-aware empty states. | panel/API | Playwright smoke | Empty data shown honestly. |
| Panel domain views | Clients, sales, applications, products, portfolio, tasks/runs, diagnostics, backup. | agent runs/context/handoff operational view complete; Playwright smoke covers Agent Harness and Control; other domains partial | Expand remaining views from tables to operational flows. | panel/API | build + API test + Playwright smoke | No YAML editor primary flow. |
| Panel mutation | Forms call API; protected actions show exact impact and confirmation. | stale projection handling complete; prepared-action refresh complete; domain mutation forms partial | Add domain mutation forms and exact impact flows. | panel/API | panel mutation tests | No external sends. |
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

2026-06-18 equivalence update:

- Added a cross-interface dry-run test proving `agent.start` preserves the same
  logical envelope through core, CLI, local API and the MCP command wrapper.
- Added an in-memory MCP server smoke covering resource listing, Agent Harness
  resource read, `studio_validate` tool call and handoff prompt retrieval.
- Remaining PRD 11 work: expand equivalence beyond AgentRun, add MCP tools for
  AgentRun mutation lifecycle, add panel Playwright smoke and complete stale
  projection handling.

2026-06-18 MCP Agent Harness update:

- Added MCP tools for the AgentRun lifecycle: start, context pack, authorize,
  observe, record action, record evidence, verify, create handoff and close.
- Every new MCP AgentRun tool delegates to `executeMcpCommand`; no MCP-local
  business logic was introduced.
- MCP lifecycle smoke now executes an AgentRun journey over the SDK in-memory
  transport and closes it through the same command runtime.
- Cross-interface dry-run equivalence now uses the real MCP
  `studio_start_agent_run` tool instead of only the internal command wrapper.
- Remaining PRD 11 work: broaden equivalence across more semantic commands,
  add final panel Playwright smoke, finish stale projection handling and enrich
  mutation forms without bypassing command runtime.

2026-06-18 panel smoke/stale projection update:

- Added built-panel smoke coverage through Playwright and the system Chrome:
  the smoke starts the local API against `apps/panel/dist`, opens the Agent
  Harness and Control routes, checks key text, rejects console/page errors and
  catches horizontal overflow.
- Added projection revision visibility to the panel topbar and stale-envelope
  detection across summary, coverage, acceptance, workflow, diagnostics and
  Agent Harness queries.
- Prepared action confirmation now invalidates the full query set so the
  dashboard does not leave adjacent panels stale after a mutation.
- Remaining PRD 11 work: broaden equivalence across more semantic commands,
  add lifecycle/policy MCP resources, complete stable CLI mutation behavior and
  build richer domain mutation forms without bypassing command runtime.

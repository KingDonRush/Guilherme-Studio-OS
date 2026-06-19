# PRD 11 Capability Matrix: CLI, MCP, and Local Panel

Target: 100% capability complete without requiring MCP to be always running.
Current estimate: 100%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Shared rule | All mutations call Studio Core and produce same events/gates/errors. | capability_complete: cross-interface dry-run matrix covers AgentRun, entity, evidence, decision, prepared action, CRM, prospect, sales, delivery, finance, content, case, handoff, release, application, payment, decision amend and learning command classes across core, CLI, API and MCP; AgentRun lifecycle also has MCP lifecycle smoke coverage | Keep future command classes in the equivalence matrix as they are added. | CLI/API/MCP | integration tests | Fixtures are deterministic. |
| CLI command groups | Required domain command groups exist with meaningful verbs. | capability_complete: required PRD command groups are present (`init`, `inspect`, `client`, `opportunity`, `engagement`, `project`, `repo`, `task`, `evidence`, `campaign`, `application`, `status`, `validate`, `doctor`, `sync`, `backup`, `dashboard`) and semantic verbs are covered by the fallback matrix. | Maintain help/contract coverage when adding command groups. | CLI | CLI help/tests | Empty domains show intake. |
| CLI machine behavior | JSON, dry-run, explicit IDs, exit codes, no prompts, idempotency, expected revision. | capability_complete: semantic command runtime, stable exit codes, idempotency replay/conflict, expected revision checks, operational helper dry-runs and fake-adapter blocked/local contracts are covered. Live WordPress/docker helper smoke remains environment-gated and belongs to runtime acceptance, not PRD 11 interface capacity. | Run environment-gated live helper smoke when a WordPress runtime is explicitly available. | CLI | CLI test matrix | No real data required. |
| MCP resources | Constitution, policies, schemas, lifecycles, context packs, repo/env, workflows. | capability_complete: active policy, lifecycle, schema, workflow, Agent Harness, repo health, prepared action, acceptance and coverage resources/templates are covered by in-memory MCP smoke. | Keep resource template assertions current as new domain resources appear. | MCP | build + smoke | Missing data in resource gaps. |
| MCP tools | Query, health, prepare, low-risk mutate, validate, evidence, external actions, confirmation status. | capability_complete: Agent Harness read/lifecycle mutation tools and semantic command-runtime mutation tools support dry-run/idempotency and are covered by the equivalence matrix. | Keep names/descriptions discoverable for MCP clients. | MCP | MCP lifecycle smoke | External execution blocked. |
| MCP prompts | Opportunity, engagement, implementation diagnosis, case, content, application, handoff. | capability_complete: normative prompt set is exposed and smoke covered. | Keep prompt arguments explicit when adding new workflows. | MCP | prompt smoke | Prompts do not mutate by themselves. |
| Panel home | Revenue, obligations, engagements, sales/applications, next actions, repo health, external actions. | capability_complete: built-panel smoke covers the operational shell, finance counts, obligation/prepared-action state, next actions and intake-required PRD gaps. | Deeper drilldowns can move to diagnostics/domain pages without blocking home capacity. | panel/API | Playwright smoke | Empty data shown honestly. |
| Panel domain views | Clients, sales, applications, products, portfolio, tasks/runs, diagnostics, backup. | capability_complete: AgentRun context/handoff view, CRM, Career, Delivery, Products, Portfolio/Marketing and Finance structured forms, plus relationship pickers for product release, delivery repo and finance invoice flows are covered. | Add richer forms as new semantic commands appear; do not reintroduce YAML/editor-primary mutation flow. | panel/API | build + API test + Playwright smoke | No YAML editor primary flow. |
| Panel mutation | Forms call API; protected actions show exact impact and confirmation. | capability_complete: stale projection handling, prepared-action refresh and structured dry-run exact payload review before execution are covered across key domains. | New protected transitions must use the same exact-payload review component. | panel/API | panel mutation tests | No external sends. |
| Runtime security | Loopback, token, origin checks, MCP separate process consuming same core. | capability_complete: Host rejection, invalid Origin rejection, missing/invalid token rejection, allowed local Origin, panel session cookie bootstrap and MCP separate-process smoke are covered. | Add process-level bind smoke only if remote/local API serving behavior changes. | API/MCP | security tests | No public bind default. |
| CLI fallback | CLI remains fully useful when panel/MCP unavailable. | capability_complete: every registered semantic command has JSON dry-run CLI fallback; bespoke operational helpers and blocked/fake external adapter prepares are machine-readable and covered. | Run live WordPress/docker helper smoke only as an environment-gated runtime check. | CLI | fallback tests | CLI is canonical fallback. |

Completion blocker: none for PRD 11 capability. Real external sends remain
blocked by adapter policy, and live WordPress helper smoke is an
environment-gated runtime acceptance check rather than an interface-capacity
gap.

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

2026-06-18 CLI fallback update:

- Added a CLI fallback matrix that asserts every semantic command registered in
  `STUDIO_COMMAND_REGISTRY` has a JSON dry-run CLI route with stable exit code
  zero and the expected command envelope shape.
- Added CLI idempotency replay coverage and conflict classification for reused
  keys with different payloads.
- Added expected revision coverage for success, stale revision conflict and
  invalid revision input.
- CLI pre-command validation errors now return ResultEnvelope JSON from the
  runtime path instead of escaping before exit-code mapping.
- Remaining PRD 11 work: broaden CLI/API/MCP equivalence beyond AgentRun,
  expose lifecycle/policy MCP resources and finish bespoke operational helper
  command contracts for adapter/WordPress commands.

2026-06-18 operational CLI contracts update:

- Added CLI contract coverage for bespoke operational helpers outside the
  semantic command registry: bootstrap vertical, coordinated backup, WordPress
  fix-ownership/backup/provision/restore-check dry-runs and asset optimization
  dry-run.
- Added CLI contract coverage for GitHub and communication adapter prepares:
  disabled providers return blocked output with stable exit code 7, while
  explicit fake providers create local prepared actions with
  `external_send: false`.
- The tested path does not call Docker, WordPress runtime services, network
  providers or portfolio implementation code.
- Remaining PRD 11 work: broaden CLI/API/MCP equivalence beyond AgentRun,
  add optional environment-gated live WordPress helper smoke and build richer
  domain mutation forms without bypassing command runtime.

2026-06-18 MCP lifecycle/policy resource update:

- Added `studio://policies/active` as the active policy manifest for MCP agents,
  including source documents and hard operational invariants.
- Added `studio://lifecycles` for the normative lifecycle contract.
- Added listable resource templates for `studio://schemas/{kind}` and
  `studio://workflows/{workflow_id}` so clients can discover focused schema and
  workflow context without mirroring the filesystem.
- Extended the in-memory MCP smoke to list/read active policies, lifecycles,
  a focused schema and a focused workflow resource.
- Remaining PRD 11 work: broaden CLI/API/MCP equivalence beyond AgentRun, add
  optional environment-gated live WordPress helper smoke and build richer domain
  mutation forms without bypassing command runtime.

2026-06-18 interface equivalence matrix update:

- Expanded the cross-interface dry-run equivalence test from only `agent.start`
  to a four-command matrix: `agent.start`, `entity.create`,
  `evidence.register` and `decision.record`.
- Added `dry_run` and `idempotency_key` support to the MCP shared mutation
  tools used by that matrix.
- The matrix proves the same logical dry-run envelope through Studio Core, CLI,
  local API and MCP for agent, entity, evidence and governance command classes.
- Remaining PRD 11 work: expand the matrix to the remaining semantic commands,
  add optional environment-gated live WordPress helper smoke and build richer
  domain mutation forms without bypassing command runtime.

2026-06-18 panel domain mutation update:

- Added a structured panel command review component that posts to
  `/api/v1/commands/dry-run`, shows the exact command payload and dry-run
  envelope, then executes the same payload through `/api/v1/commands/execute`.
- Added CRM prospect intake and LinkedIn application preparation flows without
  exposing a YAML/editor-primary mutation path.
- Extended the Playwright panel smoke to fill the CRM form, review exact
  payload, execute through the local API and verify the created prospect appears
  in the dashboard.
- Remaining PRD 11 work: add more domain operational forms, expand the
  equivalence matrix to the remaining semantic commands and optionally add
  environment-gated live WordPress helper smoke.

2026-06-18 broader panel domain forms update:

- Reused the command review component across Delivery, Products,
  Portfolio/Marketing and Finance.
- Added structured forms for project registration, product registration,
  content preparation and invoice creation for an existing contract.
- Extended the Playwright smoke to visit the expanded domain views and assert
  the new operational entrypoints render without horizontal overflow.
- Remaining PRD 11 work: add relationship pickers/exact-impact transition
  flows, expand equivalence to the remaining semantic commands and optionally
  add live WordPress helper smoke.

2026-06-18 panel relationship picker update:

- Added canonical select-field support to the structured panel command review
  component.
- Product release preparation now selects an existing product before calling
  `release.prepare`.
- Finance invoice creation now selects an existing contract before calling
  `invoice.create-for-contract`.
- Delivery repository registration now selects an existing project and explicit
  remote policy before calling `project.register-repo`.
- Extended the Playwright panel smoke to assert the relationship-based
  entrypoints render without horizontal overflow.
- Remaining PRD 11 work: expand equivalence to the remaining semantic commands,
  add remaining exact-impact panel transitions as commands mature and
  optionally add live WordPress helper smoke.

2026-06-18 semantic equivalence coverage update:

- Expanded the cross-interface dry-run equivalence matrix from four commands
  to cover AgentRun, entity, evidence, decision, prepared action, CRM,
  prospect, sales, delivery, finance, content, case and handoff command
  classes through Studio Core, CLI, local API and MCP.
- Added `dry_run` and `idempotency_key` support to existing MCP
  command-runtime mutation tools used by those command classes.
- Added target-id equivalence coverage for targeted mutations such as
  `prospect.qualify` and `deliverable.complete`.
- Remaining PRD 11 work: add MCP tools/equivalence for command classes still
  missing dedicated MCP tools, especially release, application, payment
  reconcile, decision amend and learning, plus optional live WordPress helper
  smoke.

2026-06-18 missing MCP semantic tools update:

- Added MCP tools for the remaining semantic command classes that lacked direct
  MCP mutation surface: entity transition, communication prepare, project repo
  registration, release prepare/publish, application prepare/follow-up/interview,
  knowledge route, decision amend, learning propose and payment reconcile.
- Each new tool delegates to `executeMcpCommand` and accepts `dry_run` plus
  `idempotency_key`.
- Expanded the cross-interface equivalence matrix again to cover those tools
  against Studio Core, CLI and local API dry-run envelopes.
- Remaining PRD 11 work: tighten panel home/finance empty states, keep Host and
  Origin security smoke current and optionally add live WordPress helper smoke
  when the runtime is available.

2026-06-18 runtime security smoke update:

- Added local API security smoke coverage for missing token rejection, invalid
  bearer rejection, allowed local Origin acceptance, panel session cookie
  bootstrap and cookie-authorized API reads.
- Existing tests continue to cover invalid Host and invalid Origin rejection.
- Remaining PRD 11 work: tighten panel home/finance empty states and optionally
  add process-level bind/live WordPress helper smoke when the runtime is
  available.

2026-06-18 panel home intake state update:

- Added finance counts for contracts, invoices and payments to the Economy home.
- Added a home table for revenue, obligations and prepared external actions,
  explicitly showing intake pending when no real records exist.
- Added a coverage-backed table for PRDs in `intake_required`, including the
  missing canonical kinds.
- Extended the Playwright panel smoke to open the home route and assert the new
  sections render without horizontal overflow.
- Remaining PRD 11 work: optionally add process-level bind/live WordPress helper
  smoke when the runtime is available.

2026-06-18 closure audit update:

- Reconciled the matrix against the implemented interface contract: CLI command
  groups, semantic CLI fallback, Core/CLI/API/MCP equivalence, MCP
  resources/tools/prompts, panel smoke, exact-payload panel mutation review and
  local API Host/Origin/token security are all capability complete.
- Reclassified live WordPress/docker helper smoke as an optional
  environment-gated runtime acceptance check. It should run when a real local
  WordPress runtime is available, but it is not a PRD 11 interface-capacity
  blocker.
- PRD 11 is now 100% capability complete. Real business/client/application data
  remains governed by canonical intake status, not by interface capability.

2026-06-19 MCP mutation modularity update:

- Extracted contract, invoice, payment and finance MCP mutation tools from
  `packages/mcp/src/tools/mutations.ts` into
  `packages/mcp/src/tools/mutations/finance-mutations.ts`.
- Kept `registerStudioMcpMutationTools` as the MCP mutation facade and
  preserved tool names, Zod schemas, command names, dry-run/idempotency support
  and payload construction.
- Verification: `npm run verify`; evidence
  `evd_20260619_mcp-finance-mutation-verification`.

2026-06-19 MCP career mutation modularity update:

- Extracted career and application MCP mutation tools from
  `packages/mcp/src/tools/mutations.ts` into
  `packages/mcp/src/tools/mutations/career-mutations.ts`.
- Kept `registerStudioMcpMutationTools` as the MCP mutation facade and
  preserved tool names, Zod schemas, command names, dry-run/idempotency support
  and payload construction.
- Verification: `npm run verify`; evidence
  `evd_20260619_mcp-career-mutation-verification`.

2026-06-19 MCP governance mutation modularity update:

- Extracted knowledge, decision, learning and handoff MCP mutation tools from
  `packages/mcp/src/tools/mutations.ts` into
  `packages/mcp/src/tools/mutations/governance-mutations.ts`.
- Kept `registerStudioMcpMutationTools` as the MCP mutation facade and
  preserved tool names, Zod schemas, command names, dry-run/idempotency support
  and payload construction.
- Verification: `npm run verify`; evidence
  `evd_20260619_mcp-governance-mutation-verification`.

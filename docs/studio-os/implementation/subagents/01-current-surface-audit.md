# Current Surface Audit For Subagents

Status: updated after Phase 0A, 0B, 0C, 0D and 0E extraction
Purpose: preserve concrete conflict findings before implementation agents start.

## Audited Hot Files

| Area | File | Risk |
|---|---|---|
| Schemas | `packages/schemas/src/index.ts` | resolved; 31-line barrel after 0A |
| Core barrel | `packages/core/src/index.ts` | resolved; 56-line barrel after 0B |
| Core commands | `packages/core/src/command-runtime.ts` | resolved; 41-line runtime backed by `packages/core/src/commands/**` |
| Core workflows | `packages/core/src/workflows/fixtures.ts` | resolved; 9-line barrel backed by `packages/core/src/workflows/**` |
| Coverage | `packages/core/src/coverage.ts` | about 212 lines; every PRD agent will want to close its own rows here |
| Economics | `packages/core/src/economics.ts` | moderate shared file; PRD 01, 07, 08 and 09 must coordinate reason taxonomy |
| Command service | `packages/core/src/command-service.ts` | moderate shared file; authorization, expected revision, idempotency and event wrapper |
| CLI | `packages/cli/src/index.ts` | resolved; 28-line entrypoint backed by `packages/cli/src/commands/**` and `packages/cli/src/runtime.ts` |
| API | `packages/local-api/src/index.ts` | resolved; 2-line barrel backed by route, security and server modules |
| MCP | `packages/mcp/src/index.ts` | resolved; 1-line barrel backed by resource, tool, prompt and server modules |
| Panel | `apps/panel/src/main.tsx` | single panel entrypoint and view surface |

## Concrete Conflict Patterns

- A new kind no longer competes in a 1000-line schema index, but still requires
  coordinated updates across schema specs, kind directory, alias mapping,
  coverage and tests.
- A new command now lands in `packages/core/src/commands/handlers/**` and the
  command registry, instead of a monolithic runtime switch.
- A new workflow fixture now lands in `packages/core/src/workflows/executors/**`
  and the workflow executor map, instead of a shared fixture monolith.
- Delivery, repository, portfolio and finance lifecycle behavior now has a
  smaller `LifecycleEngine`, but future preconditions still need an owned
  registry before several PRD agents edit it.
- Portfolio, marketing, sales and career will all compete in claim-to-evidence
  policy unless PRD 05 owns the public claim contract.
- Core governance, marketing, sales, career, finance and recovery will all
  compete in prepared action behavior unless PRD 01 owns lifecycle semantics
  and PRD 11 owns interface review.
- Economic next actions will diverge unless the reason taxonomy is owned by
  PRD 01 and consumed by PRDs 07, 08 and 09.
- CLI adapter shortcuts can bypass the command runtime if Phase 0 does not
  classify them as read-only diagnostics or future command-runtime mutations.
- MCP mutating tools now share a command execution helper, so PRD agents should
  add new tools through `packages/mcp/src/tools/**` instead of rebuilding local
  command execution blocks.

## Phase 0B Resulting Core Ownership

After 0B, domain command behavior is owned by:

- CRM: `packages/core/src/domains/crm.ts`
- sales/proposals: `packages/core/src/domains/sales.ts`
- delivery: `packages/core/src/domains/delivery.ts`
- products/repositories: `packages/core/src/domains/products.ts`
- portfolio: `packages/core/src/domains/portfolio.ts`
- marketing/content: `packages/core/src/domains/marketing.ts`
- career: `packages/core/src/domains/career.ts`
- finance: `packages/core/src/domains/finance.ts`
- agent handoff: `packages/core/src/domains/agents.ts`
- governance decisions: `packages/core/src/domains/governance.ts`

The facade `packages/core/src/domains/commands.ts` remains the stable internal
entrypoint for `command-runtime.ts`.

## Phase 0C Resulting Core Ownership

After 0C, command behavior is owned by:

- registry and shared payload parsing: `packages/core/src/commands/**`
- command handlers by domain: `packages/core/src/commands/handlers/**`
- workflow requirements: `packages/core/src/workflows/requirements.ts`
- workflow execution harness: `packages/core/src/workflows/execution.ts`
- workflow executors by journey: `packages/core/src/workflows/executors/**`

`packages/core/src/command-runtime.ts` remains the public runtime entrypoint for
mutations, and `packages/core/src/workflows/fixtures.ts` remains the public
workflow compatibility barrel.

## Phase 0D Resulting CLI Ownership

After 0D, CLI behavior is owned by:

- CLI program entrypoint: `packages/cli/src/index.ts`
- global options, output, exit-code and command-envelope execution:
  `packages/cli/src/runtime.ts`
- canonical/status/workflow/acceptance commands:
  `packages/cli/src/commands/core.ts`
- entity and prepared-action commands: `packages/cli/src/commands/entities.ts`
- domain shortcut commands: `packages/cli/src/commands/domains/**`
- repo, dashboard, backup, WordPress, assets and fake adapter commands:
  `packages/cli/src/commands/operations.ts`

Mutable canonical CLI commands continue to route through `executeCliCommand`,
which wraps `executeStudioCommand`.

## Phase 0E Resulting Interface Ownership

After 0E, API and MCP behavior is owned by:

- local API entrypoint: `packages/local-api/src/index.ts`
- local API server composition: `packages/local-api/src/server.ts`
- local API host/origin/session/error policy:
  `packages/local-api/src/security.ts`
- local API command adapter: `packages/local-api/src/command-runner.ts`
- local API read routes: `packages/local-api/src/routes/read.ts`
- local API mutating routes: `packages/local-api/src/routes/mutations.ts`
- MCP entrypoint: `packages/mcp/src/index.ts`
- MCP server composition: `packages/mcp/src/server.ts`
- MCP resources: `packages/mcp/src/resources.ts`
- MCP read-only tools: `packages/mcp/src/tools/read.ts`
- MCP mutating tools: `packages/mcp/src/tools/mutations.ts`
- MCP command execution helper: `packages/mcp/src/command.ts`
- MCP prompts: `packages/mcp/src/prompts.ts`

Mutating local API routes and mutating MCP tools continue to adapt payloads into
`executeStudioCommand`.

## Adapter Shortcut Inventory To Review

These current CLI surfaces need classification before PRD agents broaden them:

- bootstrap vertical setup;
- backup commands;
- WordPress commands;
- asset optimization commands;
- GitHub prepare/fake-reconcile commands;
- communication adapter prepare/fake-reconcile commands.

The decision is not "delete them". The decision is whether each command is:

- read-only diagnostic;
- local adapter operation that must emit evidence;
- mutable canonical operation that must enter through `executeStudioCommand`;
- fake/local prepared-action reconciliation with no external send.

## Interface Rule

Interface packages may adapt payloads, validate request shape and format
responses. They may not own canonical mutation behavior. Canonical mutations,
events, prepared actions and revisions belong behind command envelopes executed
by `executeStudioCommand`.

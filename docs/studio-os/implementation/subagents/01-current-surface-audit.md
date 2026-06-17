# Current Surface Audit For Subagents

Status: planning audit captured from subagents
Purpose: preserve concrete conflict findings before implementation agents start.

## Audited Hot Files

| Area | File | Risk |
|---|---|---|
| Schemas | `packages/schemas/src/index.ts` | about 1014 lines; mixes kinds, specs, envelopes, prepared actions, events, helpers, secret scan and kind directory |
| Core | `packages/core/src/index.ts` | about 2461 lines; mixes context, services, lifecycle, prepared actions, domains, workflows, gates, evidence and acceptance |
| Core commands | `packages/core/src/command-runtime.ts` | requirements plus one command switch for all mutable commands |
| Coverage | `packages/core/src/coverage.ts` | every PRD agent will want to close its own rows here |
| Economics | `packages/core/src/economics.ts` | shared by PRD 01, PRD 07, PRD 08 and PRD 09 |
| Command service | `packages/core/src/command-service.ts` | authorization, expected revision, idempotency and event wrapper |
| CLI | `packages/cli/src/index.ts` | about 1587 lines; all commands, adapters, acceptance, WordPress and aliases |
| API | `packages/local-api/src/index.ts` | auth, read routes, diagnostics, acceptance and mutations |
| MCP | `packages/mcp/src/index.ts` | resources, tools, prompts and acceptance in one file |
| Panel | `apps/panel/src/main.tsx` | single panel entrypoint and view surface |

## Concrete Conflict Patterns

- A new kind currently requires editing kind schema, prefix mapping, typed entity
  schema, kind directory, alias mapping, coverage and tests.
- A new command currently competes for the same requirement map and switch in
  `packages/core/src/command-runtime.ts`.
- Delivery, repository, portfolio and finance work will all compete in lifecycle
  preconditions unless preconditions are domain-owned.
- Portfolio, marketing, sales and career will all compete in claim-to-evidence
  policy unless PRD 05 owns the public claim contract.
- Core governance, marketing, sales, career, finance and recovery will all
  compete in prepared action behavior unless PRD 01 owns lifecycle semantics
  and PRD 11 owns interface review.
- Economic next actions will diverge unless the reason taxonomy is owned by
  PRD 01 and consumed by PRDs 07, 08 and 09.
- CLI adapter shortcuts can bypass the command runtime if Phase 0 does not
  classify them as read-only diagnostics or future command-runtime mutations.
- MCP command execution repeats context and envelope creation in multiple
  blocks; this should become one helper before adding PRD tools.

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


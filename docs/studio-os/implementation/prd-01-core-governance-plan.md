# PRD 01 Implementation Plan: Studio Core and Governance

Status: historical implementation plan; current state is tracked in the matching capability matrix and `studio coverage --json`
Initial harness estimate (historical baseline): 58%
Current capability state as of 2026-06-19: capability_ready=true
Primary owner: `packages/core`

## Objective

Make Studio Core the only place where mutations, lifecycles, authority, gates,
evidence requirements, events, and economic next actions are decided.

## Current Reality

Exists:

- command runtime and shared result envelopes;
- entity service and event emission;
- idempotency and expected revision handling;
- gate catalog;
- evidence registration and partial validation;
- economic next-action resolver;
- workflow fixtures.

Gaps:

- domain preconditions are partial;
- coverage currently overstates PRD completion by checking kinds more than
  behavior;
- gate decisions are not consistently attached to every mutable command;
- evidence validation is not yet a complete claim-to-evidence engine;
- event correlation to AgentRun is shallow.

## Required Capabilities

- `evaluateGate(request)`;
- `transitionEntity(command)` with domain preconditions;
- `registerEvidence(command)` with claim validation;
- `resolveNextActions(query)` with explainable domain reasons;
- `appendEvent(event)` with actor, target, command, run, and redaction;
- prepared-action invalidation when payload or source revision changes.

## Preferred Write Set

- `packages/core/src/commands/`
- `packages/core/src/domains/`
- `packages/core/src/evidence/`
- `packages/core/src/gates/`
- `packages/core/src/lifecycle/`
- `packages/core/src/economics.ts`
- `packages/core/src/*test.ts`

Avoid direct long-term edits to monolithic `packages/core/src/index.ts` except
as an extraction bridge.

## Public Commands

- `studio core gates --json`
- `studio entity transition <id> <status>`
- `studio evidence validate <id>`
- `studio next-actions --json`

Names can be refined, but all mutations must still pass through
`executeStudioCommand`.

## Cross-PRD Dependencies

- PRD 10 needs AgentRun-aware events.
- PRD 11 needs all command outcomes exposed consistently.
- PRD 12 needs gate and redaction behavior for security.
- PRD 05/06/07/08 need public-claim evidence checks.

## Tests

- invalid transition leaves canonical files unchanged;
- lifecycle preconditions per domain;
- gate catalog maps commands to required gates;
- public claim fails without evidence;
- expected revision conflict returns stable conflict envelope;
- economic next actions explain revenue, obligation, deadline, blocker and
  proof reasons.

## Acceptance

- no interface bypasses core for mutation;
- every mutable command emits an event;
- gates cannot be weakened by CLI/API/MCP/panel;
- coverage separates implemented capability, behavior evidence, and real data.

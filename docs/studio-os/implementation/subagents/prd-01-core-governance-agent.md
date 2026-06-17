# PRD 01 Agent Packet: Core And Governance

Wave: 1
Branch: `codex/prd-01-core-governance`

## Objective

Move PRD 01 to `capability_complete` for governance, gates, lifecycle,
acceptance semantics, economic next actions and decision authority.

## Read First

- `docs/studio-os/prds/01-studio-core-governance.md`
- `docs/studio-os/implementation/prd-01-core-governance-plan.md`
- `docs/studio-os/implementation/capability-matrices/prd-01-core-governance-matrix.md`
- `docs/studio-os/implementation/01-cross-prd-integration-map.md`

## Allowed Write Set

- `packages/schemas/src/gates.ts`
- `packages/schemas/src/prepared-actions.ts`
- `packages/core/src/domains/governance.ts`
- `packages/core/src/gates/**`
- `packages/core/src/lifecycle.ts`
- `packages/core/src/economics.ts`
- `packages/core/src/acceptance.ts`
- `packages/core/src/coverage.ts`
- `packages/core/src/commands/handlers/governance.ts`
- `packages/core/src/commands/registry.ts` registration entries only
- `packages/cli/src/commands/core.ts`
- `packages/cli/src/commands/domains/governance.ts`
- PRD 01 matrix and evidence docs

## Shared Contracts Owned

- gate catalog;
- prepared action authority semantics with PRD 10/11 consumers;
- acceptance status values: `complete`, `deferred_by_decision`,
  `intake_required`;
- economic next-action reason taxonomy.

## Must Not Do

- Do not implement domain-specific CRM, finance, delivery or career workflows
  inside the core module.
- Do not relax gates to make PRD fixtures pass.

## Verification

- unit tests for gate decisions and lifecycle preconditions;
- `studio coverage --json` separates capability, intake and evidence;
- `studio acceptance --json` reports blockers without fabricated data.

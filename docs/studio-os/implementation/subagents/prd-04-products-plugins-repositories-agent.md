# PRD 04 Agent Packet: Products, Plugins And Repositories

Wave: 3
Branch: `codex/prd-04-products-repositories`

## Objective

Move PRD 04 to `capability_complete` for product records, plugin repos,
release lifecycle, demo linkage and repository health.

## Read First

- `docs/studio-os/prds/04-products-plugins-repositories.md`
- `docs/studio-os/implementation/prd-04-products-plugins-repositories-plan.md`
- `docs/studio-os/implementation/capability-matrices/prd-04-products-plugins-repositories-matrix.md`

## Allowed Write Set

- `packages/schemas/src/entities/specs/products.ts`
- `packages/core/src/domains/products.ts`
- `packages/core/src/commands/handlers/products.ts`
- `packages/core/src/commands/registry.ts` registration entries only
- `packages/adapters/src/index.ts` Git/repository adapter slice only until adapter extraction exists
- `packages/cli/src/commands/domains/products.ts`
- `packages/cli/src/commands/operations.ts` repository command slice only
- `apps/panel/src/views/products.tsx`

## Shared Contracts Owned

- repository health contract: root mismatch, nested repo registry, dirty state,
  expected branch, remote policy, package scripts and HEAD evidence.

## Shared Contracts Consumed

- PRD 05 claim-to-evidence;
- PRD 12 backup/security for repositories;
- PRD 10 agent run repository observations.

## Must Not Do

- Do not absorb nested product repositories into root Git.
- Do not mark a release public without evidence and prepared publication gates.

## Verification

- local Git adapter tests;
- product release to portfolio case workflow segment;
- `studio doctor --json` reports repository health details.

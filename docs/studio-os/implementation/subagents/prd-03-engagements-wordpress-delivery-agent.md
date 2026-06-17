# PRD 03 Agent Packet: Engagements And WordPress Delivery

Wave: 3
Branch: `codex/prd-03-wordpress-delivery`

## Objective

Move PRD 03 to `capability_complete` for engagement, project, deliverable,
visual feedback, WordPress environment health, backup and restore-check
contracts.

## Read First

- `docs/studio-os/prds/03-engagements-wordpress-delivery.md`
- `docs/studio-os/implementation/prd-03-engagements-wordpress-delivery-plan.md`
- `docs/studio-os/implementation/capability-matrices/prd-03-engagements-wordpress-delivery-matrix.md`

## Allowed Write Set

- `packages/schemas/src/entities/specs/delivery.ts`
- `packages/core/src/domains/delivery.ts`
- `packages/core/src/commands/handlers/delivery.ts`
- `packages/core/src/commands/registry.ts` registration entries only
- `packages/adapters/src/index.ts` WordPress adapter slice only until adapter extraction exists
- `packages/cli/src/commands/domains/delivery.ts`
- `packages/cli/src/commands/operations.ts` WordPress command slice only
- `apps/panel/src/views/delivery.tsx`

## Shared Contracts Consumed

- PRD 04 repository health;
- PRD 05 evidence and asset governance;
- PRD 09 finance/delivery closure;
- PRD 10 visual feedback and handoff loop;
- PRD 12 backup and restore policy.

## Must Not Do

- Do not edit WordPress core.
- Do not close delivery while required evidence or finance obligations remain
  unresolved.

## Verification

- WordPress adapter local tests where available;
- visual feedback to verified implementation workflow fixture;
- restore-check path records evidence without overwriting live runtime.

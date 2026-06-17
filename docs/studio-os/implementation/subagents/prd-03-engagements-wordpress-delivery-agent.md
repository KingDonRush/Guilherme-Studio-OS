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

- `packages/schemas/src/entities/delivery/**`
- `packages/core/src/domains/delivery/**`
- `packages/core/src/commands/handlers/delivery/**`
- `packages/adapters/src/wordpress/**`
- `packages/cli/src/commands/delivery/**`
- `apps/panel/src/views/delivery/**`

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


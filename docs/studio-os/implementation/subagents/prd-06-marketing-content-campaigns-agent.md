# PRD 06 Agent Packet: Marketing, Content And Campaigns

Wave: 3
Branch: `codex/prd-06-marketing`

## Objective

Move PRD 06 to `capability_complete` for content ideas, content records,
campaigns, channel preparation, publication gates and evidence-backed copy.

## Read First

- `docs/studio-os/prds/06-marketing-content-campaigns.md`
- `docs/studio-os/implementation/prd-06-marketing-content-campaigns-plan.md`
- `docs/studio-os/implementation/capability-matrices/prd-06-marketing-content-campaigns-matrix.md`

## Allowed Write Set

- `packages/schemas/src/entities/specs/marketing.ts`
- `packages/core/src/domains/marketing.ts`
- `packages/core/src/commands/handlers/marketing.ts`
- `packages/core/src/commands/registry.ts` registration entries only
- `packages/cli/src/commands/domains/portfolio-marketing.ts` marketing command slice only
- `apps/panel/src/views/portfolio-marketing.tsx` marketing view slice only

## Shared Contracts Consumed

- PRD 05 claim-to-evidence and asset governance;
- PRD 01 prepared/public gates;
- PRD 11 prepared action review UI;
- PRD 12 secret/public data guard.

## Must Not Do

- Do not publish content externally.
- Do not fabricate campaign performance.
- Do not bypass exact payload confirmation.

## Verification

- publication prepared-action lifecycle tests;
- product release to portfolio case to campaign workflow fixture;
- absent campaign data appears as `intake_required`.

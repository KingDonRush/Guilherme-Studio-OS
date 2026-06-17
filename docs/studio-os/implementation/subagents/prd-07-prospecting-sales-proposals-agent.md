# PRD 07 Agent Packet: Prospecting, Sales And Proposals

Wave: 2
Branch: `codex/prd-07-sales`

## Objective

Move PRD 07 to `capability_complete` for prospecting, opportunity, proposal,
conversion, sales follow-up and evidence-backed outreach.

## Read First

- `docs/studio-os/prds/07-prospecting-sales-proposals.md`
- `docs/studio-os/implementation/prd-07-prospecting-sales-proposals-plan.md`
- `docs/studio-os/implementation/capability-matrices/prd-07-prospecting-sales-proposals-matrix.md`

## Allowed Write Set

- `packages/schemas/src/entities/sales/**`
- `packages/core/src/domains/sales/**`
- `packages/core/src/commands/handlers/sales/**`
- `packages/cli/src/commands/sales/**`
- `apps/panel/src/views/sales/**`

## Shared Contracts Consumed

- PRD 02 identity and communication records;
- PRD 05 claim-to-evidence;
- PRD 09 contract/invoice linkage;
- PRD 01 economic next actions;

## Must Not Do

- Do not create fake prospects or fake proposals.
- Do not send outreach.
- Do not convert an opportunity without duplicate review and required gates.

## Verification

- prospect-to-client-to-engagement workflow fixture;
- expected revision/idempotency tests for conversion commands;
- proposal prepared action has exact payload review.


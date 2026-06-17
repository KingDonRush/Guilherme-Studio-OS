# PRD 09 Agent Packet: Finance, Contracts And Obligations

Wave: 2
Branch: `codex/prd-09-finance`

## Objective

Move PRD 09 to `capability_complete` for contract, invoice, payment,
reconciliation, obligation and finance/delivery closure gates.

## Read First

- `docs/studio-os/prds/09-finance-contracts-obligations.md`
- `docs/studio-os/implementation/prd-09-finance-contracts-obligations-plan.md`
- `docs/studio-os/implementation/capability-matrices/prd-09-finance-contracts-obligations-matrix.md`

## Allowed Write Set

- `packages/schemas/src/entities/finance/**`
- `packages/core/src/domains/finance/**`
- `packages/core/src/commands/handlers/finance/**`
- `packages/cli/src/commands/finance/**`
- `apps/panel/src/views/finance/**`

## Shared Contracts Consumed

- PRD 03 delivery closure;
- PRD 07 proposal/contract conversion;
- PRD 01 economic next actions;
- PRD 12 confidential classification.

## Must Not Do

- Do not invent payments, invoices, contracts or revenue.
- Do not weaken confidential handling.
- Do not mark delivery financially closed while obligations remain open.

## Verification

- contract/invoice/payment lifecycle tests;
- payment reconciliation requires finance capability;
- no real finance data produces `intake_required` rows.


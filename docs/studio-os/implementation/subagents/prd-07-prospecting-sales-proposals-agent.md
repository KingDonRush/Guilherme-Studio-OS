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

- `packages/schemas/src/entities/specs/sales.ts`
- `packages/core/src/domains/sales.ts`
- `packages/core/src/commands/handlers/sales.ts`
- `packages/core/src/commands/registry.ts` registration entries only
- `packages/cli/src/commands/domains/sales.ts`
- `apps/panel/src/views/crm.tsx` sales rows in CRM view only unless a dedicated sales view is created

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

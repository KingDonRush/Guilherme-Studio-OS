# PRD 09 Implementation Plan: Finance, Contracts, and Obligations

Status: ready for implementation planning
Current harness estimate: 35%
Primary owner: `packages/core/src/domains/finance`

## Objective

Keep commercial commitments, receivables, payments, deadlines and delivery
obligations visible without pretending to be accounting, legal, tax or banking
software.

## Current Reality

Exists:

- contract, invoice and payment schemas;
- contract from engagement;
- invoice for contract;
- expected payment record;
- payment reconcile with reference;
- economic next action base.

Gaps:

- no commercial terms registry;
- no signed artifact reference enforcement;
- no issue/partial/overdue/dispute invoice lifecycle;
- no provider-evidence requirement for confirmed payment;
- no obligation calendar;
- no payment reminder prepared action.

## Required Capabilities

- record commercial terms;
- register contract metadata and signed reference;
- create and issue invoice;
- record payment expectation;
- confirm payment with provider evidence;
- reconcile payment to invoice;
- resolve obligations;
- prepare payment reminder;
- calculate economic view.

## Preferred Write Set

- `packages/core/src/domains/finance/`
- `packages/core/src/economics.ts`
- `packages/cli/src/commands/finance.ts`
- `apps/panel/src/views/finance/`

## Cross-PRD Dependencies

- PRD 03 blocks delivery/engagement closure on unresolved obligations.
- PRD 07 proposal terms feed commercial terms.
- PRD 02 client identity links parties.
- PRD 12 protects confidential financial records and secrets.

## Tests

- expected, invoiced, confirmed and reconciled money remain distinct;
- payment confirmation fails without provider evidence;
- confirmed payment edits create corrective event, not overwrite;
- engagement closure reports unresolved finance obligations;
- dashboard total traces to canonical records.

## Acceptance

- no legal/tax compliance claims are made;
- reminders and invoices are prepared actions before send;
- economic view explains source and confidence.


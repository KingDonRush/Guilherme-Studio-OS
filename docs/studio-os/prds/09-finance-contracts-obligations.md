# PRD 09: Finance, Contracts, and Obligations

## Product Job

Keep commercial commitments, receivables, payments, deadlines, and delivery
obligations visible and linked to the work they govern.

This module is operational recordkeeping, not accounting, tax, banking, or
legal advice.

## Capabilities

### Commercial terms

- Record currency, price basis, installments, deposit, due dates, warranty,
  maintenance, expenses, and acceptance conditions.
- Link terms to exact proposal and contract versions.

### Contract registry

- Store contract metadata, parties, effective dates, obligations, termination,
  confidentiality, intellectual property, and governing references.
- Preserve signed artifact references.
- Surface obligations without attempting legal interpretation beyond recorded
  text and explicit notes.

### Invoice and receivable management

- Create invoice records linked to engagement and deliverables.
- Track issue, due, partial payment, overdue, dispute, and settlement.
- Prepare reminders but require confirmation before sending.

### Payment reconciliation

- Record expected and confirmed payments.
- Require provider evidence for confirmation.
- Match payments to invoices and expose unmatched records.

### Obligation calendar

- Surface deposits, review windows, delivery dates, invoice due dates,
  warranties, renewals, and contractual notices.
- Separate operational reminder from legal deadline authority.

### Economic visibility

- Show expected revenue, confirmed revenue, overdue receivables, active value,
  and pipeline value with source and confidence.
- Never present forecasts as cash received.

## Canonical Structure

```text
operations/finance/
├── config/
├── obligations/
└── reports/

clients/<client>/engagements/<engagement>/commercial/
├── terms.yaml
├── proposals/
├── contracts/
├── invoices/
└── payments/
```

## Public Interfaces

```text
recordCommercialTerms()
registerContract()
createInvoice()
issueInvoice()
recordPaymentExpectation()
confirmPayment()
reconcilePayment()
resolveObligations()
preparePaymentReminder()
calculateEconomicView()
```

## Dependencies

- Depends on clients, engagements, proposals, authority, evidence,
  communications, and protected storage.
- Provider integrations are adapters and never canonical.

## Safety

- Financial account credentials are secret and external.
- Editing confirmed payments requires corrective events, not destructive
  overwrite.
- Contract and invoice deletion follows retention policy.
- Sending reminders and invoices requires confirmation.

## Acceptance Criteria

- Expected, invoiced, confirmed, and reconciled values remain distinct.
- Every payment traces to evidence.
- Engagement closure reports unresolved financial obligations.
- Dashboard totals can be traced to canonical records.
- No module claims tax or legal compliance without external professional
  confirmation.

# PRD 09 Capability Matrix: Finance, Contracts, and Obligations

Target: 100% capability complete without requiring real invoices or payments.
Current estimate: 100% capability_complete; canonical real finance data remains intake_required.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Commercial terms | Record price, installments, deposit, due dates, warranty, expenses and acceptance conditions. | capability_complete: contract schema has structured commercial terms and `contract.register-terms` writes them through Core/CLI/API/MCP; panel exposes the common terms flow. | Keep real commercial values as intake until supplied. | CLI/API/MCP/panel | finance runtime test + interface equivalence + CLI fallback | No terms means intake gap, not fabricated data. |
| Proposal/contract links | Link terms to exact proposal and contract versions. | capability_complete: contract creation and terms registration carry proposal id, proposal version ref, contract version ref and signed artifact ref; proposal id is validated when present. | Add stronger signed-artifact evidence gates when real signing workflow exists. | CLI/API/MCP/panel | dry-run equivalence + runtime test | Missing artifact blocks signed-state claims. |
| Contract registry | Store parties, effective dates, obligations, termination, confidentiality, IP and signed refs. | capability_complete: contract schema includes parties, effective/signed/end dates, obligations, termination, confidentiality, IP, governing reference and operational no-legal/tax note; `contract.register-details` updates details. | Add richer panel party editor later if needed. | CLI/API/MCP/panel | schema export + runtime test | Signed artifact ref required before claiming signed contract. |
| Obligation surfacing | Surface obligations without legal interpretation beyond recorded text. | capability_complete: `finance.resolve-obligations` emits recorded contract obligations, invoice due dates, expected payments and warranty windows with source refs and authority labels. | Keep legal/tax interpretation outside Studio OS. | CLI/API/MCP | runtime test + dry-run equivalence | No legal advice claims. |
| Invoice lifecycle | Track issue, due, partial, overdue, dispute and settlement. | capability_complete: invoice schema separates status from invoice `stage`; `invoice.issue` and `invoice.update-lifecycle` cover issue/view/partial/overdue/dispute/settle/void states. | Add provider-specific invoice send only after external adapters are enabled. | CLI/API/MCP/panel | runtime test + CLI fallback | No invoice data means intake gap. |
| Reminders | Prepare reminders with confirmation before sending. | capability_complete: `payment.prepare-reminder` creates a fake/local prepared action with exact payload, checksum, target invoice and source revisions; panel reviews the payload before execution. | Real communication provider remains blocked/deferred by adapter policy. | CLI/API/MCP/panel | runtime test + prepared-action assertions | No external send by default. |
| Payment reconciliation | Record expected/confirmed payments and provider evidence. | capability_complete: expected payments remain `waiting`; `payment.confirm` requires provider evidence; `payment.reconcile` requires confirmed/provider evidence and only then marks payment paid/reconciled. | Add corrective-event workflow if confirmed payment edits become common. | CLI/API/MCP/panel | runtime test + core cross-domain test | Expected is not received cash. |
| Unmatched records | Expose unmatched payments/invoices. | capability_complete: `finance.reconciliation-report` exposes unmatched invoices, unmatched payments and open payments, with empty report valid. | Add CSV/export later if operationally useful. | CLI/API/MCP | runtime test + dry-run equivalence | Empty report valid. |
| Obligation calendar | Surface deposits, review windows, due dates, warranties, renewals and notices. | capability_complete: `finance.obligation-calendar` sorts dated finance obligations from contract terms, invoices and expected payments, marked as operational reminders. | Add calendar feed adapter only after provider policy allows it. | CLI/API/MCP | runtime test + dry-run equivalence | Operational reminder only. |
| Economic visibility | Show expected, confirmed, overdue, active and pipeline value with source/confidence. | capability_complete: `finance.economic-view` reports expected, confirmed, reconciled, overdue and active contract values without presenting forecasts as cash. | Keep dashboard totals traceable to canonical records. | CLI/API/MCP/panel | runtime test + verify | Forecast not shown as cash. |
| Safety | No tax/legal claims; financial creds secret; corrections not destructive. | capability_complete: finance schemas carry an operational-record-only note; credentials remain outside canonical records; confirmation/reconciliation require evidence and prepared reminders use fake/local provider. | Implement explicit corrective event command if real payment correction workflow needs it. | CLI/API/MCP | verify + schema/security baseline | External professional confirmation required for legal/tax claims. |

2026-06-18 closure update:

- Expanded finance schemas for commercial terms, contract details, obligations,
  invoice stages, payment confirmation evidence and reconciliation metadata.
- Added semantic commands for terms, contract details, invoice issue/lifecycle,
  payment confirmation, payment reminder prepared action, obligation report,
  reconciliation report, obligation calendar and economic view.
- Extended CLI, MCP, API command-runtime equivalence and finance panel forms for
  the principal operational flows.
- Added runtime coverage proving expected, confirmed and reconciled money remain
  distinct and payment confirmation requires evidence.
- PRD 09 is now 100% capability complete. Real contracts, invoices and payments
  remain `intake_required` until supplied.

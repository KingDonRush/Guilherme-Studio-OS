# PRD 09 Capability Matrix: Finance, Contracts, and Obligations

Target: 100% capability complete without requiring real invoices or payments.
Current estimate: 35%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Commercial terms | Record price, installments, deposit, due dates, warranty, expenses and acceptance conditions. | missing | Add terms records and command. | CLI/API/panel | terms tests | No terms means intake gap. |
| Proposal/contract links | Link terms to exact proposal and contract versions. | partial | Add version references and validation. | CLI/API/panel | link tests | Missing artifact blocks confirmation. |
| Contract registry | Store parties, effective dates, obligations, termination, confidentiality, IP and signed refs. | partial | Expand contract schema and registerContract command. | CLI/API/panel | contract tests | Signed artifact ref required for signed state. |
| Obligation surfacing | Surface obligations without legal interpretation beyond recorded text. | missing | Add obligation extractor/records with source refs. | CLI/API/panel | obligation tests | No legal advice claims. |
| Invoice lifecycle | Track issue, due, partial, overdue, dispute and settlement. | partial | Add invoice states and issue command. | CLI/API/panel | invoice lifecycle tests | No invoice data means intake gap. |
| Reminders | Prepare reminders with confirmation before sending. | missing | Add payment reminder prepared action. | CLI/API/panel | reminder tests | No external send by default. |
| Payment reconciliation | Record expected/confirmed payments and provider evidence. | partial | Require evidence for confirmed payment and reconciliation. | CLI/API/panel | payment tests | Expected is not received cash. |
| Unmatched records | Expose unmatched payments/invoices. | missing | Add reconcile report. | CLI/API/panel | unmatched tests | Empty report valid. |
| Obligation calendar | Surface deposits, review windows, due dates, warranties, renewals and notices. | missing | Add calendar query. | CLI/API/panel | calendar tests | Operational reminder only. |
| Economic visibility | Show expected, confirmed, overdue, active and pipeline value with source/confidence. | partial | Expand economic resolver with finance reasons. | CLI/API/panel | economic tests | Forecast not shown as cash. |
| Safety | No tax/legal claims; financial creds secret; corrections not destructive. | partial | Add corrective event command and secret guard. | CLI/API | security tests | External professional confirmation required for legal/tax claims. |

Completion blocker: finance needs obligation and lifecycle depth beyond record
creation.


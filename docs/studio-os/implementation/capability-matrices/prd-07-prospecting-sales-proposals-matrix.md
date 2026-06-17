# PRD 07 Capability Matrix: Prospecting, Sales, and Proposals

Target: 100% capability complete without requiring active prospects.
Current estimate: 35%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Ideal client fit | Define ICP by need, budget logic, geography, technology and delivery fit. | missing | Add ICP/offer-fit records and commands. | CLI/API/panel | ICP tests | Missing ICP is intake gap. |
| Evidence-to-offer map | Map offers and proof to each profile. | missing | Add offer/evidence relation validation. | CLI/panel | offer proof tests | No invented proof. |
| Prospect research | Record source, situation, need, evidence, decision-maker, risk and reason to contact. | partial | Expand prospect research schema and command. | CLI/API/MCP/panel | research tests | Prospect requires real source/input. |
| Research freshness | Classify confidence and freshness. | missing | Add freshness fields and stale research warning. | CLI/panel | freshness tests | Stale data warns, not deletes. |
| Outreach preparation | Create personalized message with recipient, channel, exact copy, evidence and CTA. | partial | Expand communication.prepare for sales outreach. | CLI/API/MCP/panel | outreach tests | External send blocked. |
| Duplicate outreach | Prevent duplicate outreach and excessive follow-up. | missing | Add active outreach lookup and follow-up policy. | CLI/API/panel | duplicate outreach tests | No fake communications. |
| Opportunity facts | Capture discovery, need, urgency, budget, authority, competition, next action and probability source. | partial | Expand opportunity schema and discovery command. | CLI/API/panel | opportunity tests | Missing facts shown as gaps. |
| Proposal generation | Generate proposal from offer, scope, exclusions, schedule, assumptions, price, terms and acceptance. | partial | Add proposal package and versioning. | CLI/API/MCP/panel | proposal fixture | No sent version without confirmation. |
| Proposal immutability | Preserve exact sent version. | missing | Add sent artifact checksum and immutable state. | CLI/API/panel | immutability tests | Draft can change, sent cannot. |
| Negotiation | Record requested changes and scope/price/risk/timing impact. | missing | Add negotiation/change-impact command. | CLI/API/panel | negotiation tests | No silent conversion. |
| Conversion | Convert accepted opportunity into linked client and engagement. | partial | Harden transaction and identity merge behavior. | CLI/API/MCP | conversion tests | Real acceptance evidence required. |
| Lost reasons | Preserve lost reason and lesson without active pollution. | missing | Add close lost command and inactive views. | CLI/API/panel | lost opportunity tests | Lost data remains explainable. |

Completion blocker: sales has useful slices, but research, outreach policy and
proposal immutability are incomplete.


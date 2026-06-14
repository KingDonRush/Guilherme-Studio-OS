# PRD 07: Prospecting, Sales, and Proposals

## Product Job

Create qualified commercial conversations and convert suitable WordPress needs
into clear, traceable, profitable engagements.

## Capabilities

### Ideal client and offer fit

- Define ideal client profiles by business type, need, budget logic, geography,
  technology, and delivery fit.
- Map offers and evidence to each profile.
- Reject prospecting criteria based only on broad industry labels.

### Prospect research

- Record source, observed situation, likely need, fit evidence, decision-maker,
  risks, and an honest reason to contact.
- Classify confidence and research freshness.

### Outreach preparation

- Create concise, personalized messages based on verifiable signals.
- Expose recipient, channel, exact copy, evidence, and intended CTA.
- Require confirmation before sending.
- Prevent duplicate outreach and excessive follow-up.

### Opportunity management

- Capture discovery, need, urgency, budget signals, authority, competition,
  next action, and probability as explicit facts or inference.
- Maintain one owner and one next action.

### Proposal

- Generate proposal from offer, discovery, scope, exclusions, schedule,
  assumptions, price logic, payment terms, and acceptance criteria.
- Version proposals and preserve the exact sent version.
- Require review for claims, terms, and attachments.

### Negotiation and conversion

- Record requested changes and their effect on scope, price, risk, and timing.
- Convert accepted opportunity into client and engagement.
- Preserve lost reasons and lessons.

## Canonical Structure

```text
sales/
├── strategy/
├── ideal-clients/
├── offers/
├── prospects/<prospect>/
├── opportunities/<opportunity>/
│   ├── opportunity.yaml
│   ├── research/
│   ├── communications/
│   └── proposals/
└── analytics/
```

## Public Interfaces

```text
createProspect()
researchProspect()
qualifyProspect()
prepareOutreach()
recordOutreachResult()
createOpportunity()
recordDiscovery()
prepareProposal()
recordProposalResponse()
negotiateOpportunity()
convertOpportunity()
closeOpportunity()
```

## Dependencies

- Depends on identity, CRM, offers, evidence, communications, finance,
  contracts, and confirmation gates.
- Conversion invokes client and engagement services transactionally.

## Acceptance Criteria

- No outbound action lacks a verifiable reason for contact.
- No prospect receives duplicated active outreach.
- Opportunity stages always include next action and owner.
- Sent proposals are immutable records.
- Conversion creates linked client and engagement without duplicated identity.
- Lost opportunities preserve useful reason without polluting active views.

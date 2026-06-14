# PRD 02: Clients, CRM, and Profiles

## Product Job

Preserve relationship intelligence and client-specific operating context
without mixing it with the technical state of individual jobs.

## Core Distinction

```text
Person/Organization
→ Prospect
→ Opportunity
→ Client
→ Engagement
```

The client profile represents the relationship. Engagements represent paid
demands. Deliverables and projects represent production.

## Capabilities

### Unified identity

- Reuse one person or organization across prospecting, client, career, and
  communication contexts.
- Detect probable duplicates and require review before merge.

### Prospect qualification

- Capture source, fit reason, observed need, location, market, relationship
  strength, and next action.
- Disqualify with reason instead of deleting.

### Client profile

Store:

- overview and relationship status;
- legal and commercial identity references;
- stakeholders and roles;
- preferred channels, language, timezone, and response expectations;
- brand and operational context;
- working preferences and decision style;
- accessibility and implementation constraints;
- payment and scope risk flags;
- communication summaries;
- lessons that apply across engagements.

Do not store:

- passwords or production credentials;
- task-level implementation notes;
- repository state;
- one deliverable's changing requirements as global preference.

### Relationship timeline

- Link meaningful communications, meetings, proposals, approvals, disputes,
  and payments.
- Keep summaries and channel references; retain full message bodies only when
  required.

### Health and next action

- Calculate relationship health from explicit signals.
- Surface stale follow-ups, unresolved approvals, payment risk, and active
  engagements.
- Explain the signals behind health; never assign opaque sentiment scores.

## Canonical Structure

```text
clients/<client-slug>/
├── client.yaml
├── profile/
│   ├── overview.md
│   ├── stakeholders.yaml
│   ├── communication.md
│   ├── preferences.md
│   ├── brand-context.md
│   ├── constraints.md
│   └── lessons.md
└── engagements/
```

## Public Interfaces

```text
createProspect()
qualifyProspect()
convertProspectToOpportunity()
createClientFromOpportunity()
updateClientProfile()
recordCommunication()
resolveClientHealth()
listClientNextActions()
mergeIdentityCandidates()
```

## Dependencies

- Depends on identity, canonical storage, lifecycle, authority, and
  communication records.
- Opportunity conversion depends on the sales PRD.
- Engagement creation depends on the delivery PRD.

## Safety

- Contact data is confidential by default.
- Full communication import requires a separate adapter and retention policy.
- Merge is reversible until references are rewritten and confirmed.
- Client deletion is prohibited while financial or contractual retention
  applies.

## Acceptance Criteria

- One client can own several engagements without duplicated preferences.
- A person can be both recruiter and client stakeholder without duplicate
  identity.
- Disqualified prospects remain explainable but leave active pipeline views.
- Client context pack excludes secrets and unrelated engagement details.
- Health indicators are traceable to explicit facts.

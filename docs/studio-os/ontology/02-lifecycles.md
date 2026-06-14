# Entity Lifecycles

Status: normative state contracts

## Transition Contract

Every transition defines:

- current state;
- requested state;
- actor;
- preconditions;
- emitted event;
- required evidence;
- reversible or irreversible status;
- side effects;
- allowed recovery.

Invalid transitions fail closed.

## Prospect

```text
identified
→ researched
→ qualified
→ contacted
→ engaged
→ converted
```

Alternate exits:

```text
identified/researched/qualified → disqualified
contacted → no_response
any non-final state → archived
```

`converted` requires an opportunity. Contact requires a prepared action and
confirmation.

## Opportunity

```text
discovery
→ qualified
→ proposal_preparing
→ proposal_ready
→ proposal_sent
→ negotiation
→ won
→ converted_to_engagement
```

Alternate exits: `lost`, `deferred`, `withdrawn`, `expired`.

`won` requires explicit acceptance evidence. It does not imply payment.

## Client

```text
onboarding
→ active
→ inactive
→ archived
```

Additional flags represent relationship health and do not replace lifecycle:
`payment_risk`, `communication_risk`, `scope_risk`, `strategic`.

## Engagement

```text
draft
→ awaiting_approval
→ awaiting_deposit
→ scheduled
→ in_progress
→ client_review
→ delivery
→ warranty
→ closed
→ archived
```

Side states: `blocked`, `paused`, `cancelled`, `disputed`.

Rules:

- `scheduled` requires accepted scope and commercial basis.
- `in_progress` requires start authorization.
- `delivery` requires deliverable readiness evidence.
- `closed` requires commercial and delivery closure or a documented exception.

## Deliverable

```text
defined
→ ready
→ implementation
→ internal_review
→ client_review
→ approved
→ delivered
→ accepted
→ maintained
→ retired
```

Side states: `blocked`, `change_requested`, `cancelled`.

The deliverable state never changes engagement payment state automatically.

## Project

```text
proposed
→ initialized
→ active
→ verification
→ complete
→ maintained
→ archived
```

Side states: `blocked`, `paused`, `abandoned`.

`complete` requires project acceptance criteria, not client acceptance or
payment.

## Product and Release

Product:

```text
concept
→ validating
→ active
→ maintenance
→ deprecated
→ archived
```

Release:

```text
planned
→ implementing
→ verifying
→ ready
→ published
→ superseded
→ withdrawn
```

Publishing requires repository health, release evidence, and confirmation.

## Portfolio Case

```text
seeded
→ evidence_ready
→ narrative_draft
→ visual_design
→ implementation
→ review
→ approved
→ published
→ updated
→ archived
```

`evidence_ready` requires supported claims. A case cannot advance by visual
polish alone.

## Campaign and Content

Campaign:

```text
idea → planned → ready → active → measuring → complete → archived
```

Content item:

```text
idea → briefed → drafted → verified → approved → scheduled → published
```

Alternate exits: `rejected`, `cancelled`, `superseded`.

No content reaches `published` without a publication record.

## Job Application

```text
discovered
→ qualified
→ preparing
→ ready
→ submitted
→ follow_up
→ interview
→ offer
→ accepted
```

Alternate exits: `rejected`, `withdrawn`, `expired`, `declined`, `no_response`.

`submitted` requires exact materials and submission evidence.

## Invoice and Payment

Invoice:

```text
draft → issued → viewed → partially_paid → paid
```

Alternate states: `overdue`, `void`, `disputed`.

Payment:

```text
expected → pending → confirmed → reconciled
```

Alternate states: `failed`, `refunded`, `reversed`, `disputed`.

Only confirmed provider evidence advances payment to `confirmed`.

## Task

```text
backlog → ready → in_progress → verification → done
```

Side states: `blocked`, `deferred`, `cancelled`.

`done` requires evidence. Failed verification returns to `in_progress`.

## Agent Run

```text
oriented → authorized → executing → verifying → handed_off → closed
```

Side states: `blocked`, `aborted`, `failed`.

An agent run cannot be `closed` with required sessions or commands still
running.

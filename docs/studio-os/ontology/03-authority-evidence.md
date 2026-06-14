# Authority and Evidence Graph

Status: normative

## Actors

| Actor | Default authority |
|---|---|
| Guilherme | final human authority |
| Trusted collaborator | explicitly delegated scope |
| Local CLI operator | mutations allowed by command and policy |
| MCP agent | read or prepared mutation through tool contract |
| Panel user | local authenticated operator action |
| Scheduled automation | narrow pre-authorized transition |
| External adapter | provider operation only |

Authority is capability-based, not inferred from filesystem access.

## Decision Outcomes

Every gate returns:

```text
allow
warn
require_confirmation
block
```

It also returns:

- reason;
- violated or relevant rule;
- actor;
- target;
- risk;
- evidence required;
- confirmation payload when applicable;
- recovery guidance.

## Authority Matrix

| Action | Agent | CLI operator | Guilherme confirmation |
|---|---|---|---|
| read internal canonical record | allow | allow | no |
| draft content or proposal | allow | allow | no |
| mutate low-risk local task state | tool-scoped | allow | usually no |
| edit client scope | prepare | warn | required when contractual |
| send message | prepare only | prepare only | required |
| submit application | prepare only | prepare only | required |
| publish content or release | prepare only | prepare only | required |
| commit code | scoped repository rules | allow | according to workflow |
| push public repository | prepare or scoped | warn | required by publication policy |
| delete canonical record | block by default | confirmation path | required |
| access secret | no raw disclosure | adapter-scoped | local protected entry |
| production mutation | block by default | controlled runbook | required |
| payment or contract acceptance | block | prepare only | required |

## Evidence Types

### Source evidence

Official documentation, repository source, contract, approved brief, or
authoritative communication.

### Execution evidence

Command output, test result, diff, screenshot, runtime state, generated
artifact, or adapter response.

### Human evidence

Approval, confirmation, rejection, acceptance, or explicit decision.

### Economic evidence

Proposal acceptance, invoice, payment confirmation, contract, offer, or
application outcome.

### Public evidence

Published repository, release, case, live demo, article, or portfolio URL.

## Reliability Levels

- **A:** authoritative and independently verifiable.
- **B:** direct local observation or controlled test.
- **C:** human report or external communication without independent access.
- **D:** inference.
- **E:** assumption.

Public claims require A or B evidence unless clearly labeled as roadmap or
opinion.

## Evidence Requirements

| Transition | Minimum evidence |
|---|---|
| opportunity → won | explicit acceptance |
| engagement → in_progress | approved start conditions |
| deliverable → approved | approval record |
| project → complete | acceptance tests |
| release → published | release URL and repository state |
| case → evidence_ready | claim-to-evidence map |
| content → published | publication URL |
| application → submitted | submission receipt or captured state |
| invoice → paid | confirmed payment reference |
| task → done | task-specific completion evidence |

## Prepared Action Contract

Every external action must include:

```yaml
actor:
channel:
recipient:
purpose:
exact_payload:
attachments:
source_entities:
claims:
evidence_refs:
side_effects:
rollback:
expires_at:
confirmation_required: true
```

Confirmation applies only to the exact payload. Material edits invalidate the
confirmation.

## Learning Contract

A failure becomes a system learning candidate when it:

- repeats;
- causes material rework;
- exposes a reality mismatch;
- bypasses a gate;
- causes security or reputation risk;
- reveals an undefined ownership boundary.

The response must be one of:

- amend a workflow;
- add or strengthen a test;
- add a schema invariant;
- record a decision;
- improve calibration or environment capture;
- explicitly accept the risk.

Do not store accidental pixel values or one-off symptoms as global policy.

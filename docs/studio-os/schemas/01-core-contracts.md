# Core Schema Contracts

Status: normative logical schema
Purpose: define the contracts implementation schemas must encode

This document defines meaning and required fields. The implementation may use
JSON Schema, Zod, TypeBox, or another validated TypeScript-compatible schema
system after the stack research packet. Generated JSON Schema must remain
available for CLI, MCP, API, fixtures, and editor tooling.

## Schema Rules

- Every contract has an explicit version.
- Unknown top-level fields fail closed.
- Canonical timestamps use RFC 3339 with timezone offset.
- Money uses integer minor units plus ISO currency.
- URLs are validated and classified.
- Paths use Studio-root-relative POSIX form unless explicitly registered as
  external.
- IDs are immutable.
- Relations reference IDs, never copied entity truth.
- Free-form extensions require a namespace.
- Secret values are not valid canonical field values.
- Schema migration is separate from lifecycle transition.

## Identifier Contract

Format:

```text
<type-prefix>_<YYYYMMDD>_<slug-or-sortable-suffix>
```

Required prefixes:

| Entity | Prefix |
|---|---|
| Person | `per` |
| Organization | `org` |
| Prospect | `pro` |
| Client | `cli` |
| Opportunity | `opp` |
| JobApplication | `app` |
| Engagement | `eng` |
| Deliverable | `del` |
| Project | `prj` |
| Repository | `repo` |
| Environment | `env` |
| Product | `prod` |
| Release | `rel` |
| PortfolioCase | `case` |
| Evidence | `evd` |
| Campaign | `cmp` |
| ContentItem | `cnt` |
| Proposal | `prp` |
| Contract | `ctr` |
| Invoice | `inv` |
| Payment | `pay` |
| Task | `tsk` |
| Decision | `dec` |
| Asset | `ast` |
| Communication | `com` |
| AgentRun | `run` |
| Command | `cmd` |
| Event | `evt` |
| PreparedAction | `act` |

The implementation must provide collision-resistant generation. The readable
suffix is not used as the sole uniqueness mechanism.

## Common Entity Envelope

```yaml
api_version: studio.guilherme.dev/v1
kind: Project
metadata:
  id: prj_20260614_portfolio
  slug: portfolio
  schema_version: 1
  revision: 1
  created_at: 2026-06-14T10:00:00-03:00
  updated_at: 2026-06-14T10:00:00-03:00
  owner_id: per_20260614_guilherme-silva
  classification: internal
  labels: []
  archived_at: null
spec: {}
relations: []
extensions: {}
```

### Metadata contract

| Field | Required | Rule |
|---|---|---|
| `id` | yes | immutable valid typed ID |
| `slug` | yes | mutable human identifier |
| `schema_version` | yes | positive integer |
| `revision` | yes | monotonic integer |
| `created_at` | yes | immutable |
| `updated_at` | yes | equals committed mutation time |
| `owner_id` | yes | resolvable Person or delegated actor |
| `classification` | yes | public/internal/confidential |
| `labels` | no | controlled or namespaced labels |
| `archived_at` | no | required when archived |

`secret` is a field classification but not a permitted canonical entity
classification because secret values cannot be stored canonically.

## Relation Contract

```yaml
- type: engagement.has_deliverable
  target_id: del_20260614_site
  source_of_truth: target
  created_at: 2026-06-14T10:00:00-03:00
```

Rules:

- relation type is registered;
- source and target types are allowed;
- inverse relation is derived unless explicitly canonical;
- deleting or archiving a target does not silently delete relations;
- broken references fail validation or are explicitly marked external.

## Core Entity Specs

The following tables define minimum V1 fields. Domain PRDs may add required
constraints but cannot redefine their meaning.

### Relationship and commercial pipeline

| Kind | Required `spec` fields |
|---|---|
| `Person` | `display_name`, `roles`, `contact_points`, `consent_notes` |
| `Organization` | `name`, `organization_type`, `website`, `locations` |
| `Prospect` | `subject_id`, `state`, `source`, `fit_reason`, `next_action` |
| `Client` | `subject_id`, `state`, `relationship_owner`, `preferences`, `risks` |
| `Opportunity` | `prospect_id`, `state`, `need`, `offer`, `estimated_value`, `confidence`, `next_action` |
| `Proposal` | `opportunity_id`, `state`, `version`, `scope`, `price`, `valid_until`, `artifact_ref` |
| `Communication` | `participants`, `direction`, `channel`, `occurred_at`, `summary`, `external_ref` |

### Career

| Kind | Required `spec` fields |
|---|---|
| `JobApplication` | `organization_id`, `role_title`, `state`, `source_url`, `fit`, `materials`, `next_action` |

Job application materials reference immutable asset versions or checksums.

### Delivery and products

| Kind | Required `spec` fields |
|---|---|
| `Engagement` | `client_id`, `state`, `commercial_basis`, `start_conditions`, `next_action` |
| `Deliverable` | `engagement_id`, `state`, `outcome`, `acceptance_criteria`, `target_date` |
| `Project` | `primary_owner_id`, `state`, `objective`, `repository_ids`, `environment_ids`, `acceptance_criteria` |
| `Repository` | `owner_entity_id`, `local_path`, `expected_git_root`, `visibility`, `management_mode`, `remotes` |
| `Environment` | `owner_project_id`, `type`, `local_path`, `url`, `secret_reference`, `backup_policy` |
| `Product` | `state`, `problem`, `audience`, `repository_ids`, `release_policy` |
| `Release` | `product_id`, `version`, `state`, `compatibility`, `artifact_refs`, `release_notes_ref` |

### Evidence and distribution

| Kind | Required `spec` fields |
|---|---|
| `Evidence` | `evidence_type`, `subject_id`, `claim`, `source`, `reliability`, `captured_at`, `checksum` |
| `PortfolioCase` | `state`, `subject_ids`, `audience`, `claims`, `evidence_refs`, `publication` |
| `Campaign` | `state`, `goal`, `audience`, `offer`, `channels`, `content_ids`, `measurement` |
| `ContentItem` | `state`, `content_type`, `audience`, `purpose`, `source_evidence`, `artifact_ref`, `publication` |
| `Asset` | `owner_id`, `asset_type`, `source`, `path`, `mime_type`, `checksum`, `transformations`, `approval` |

### Finance and obligations

Money:

```yaml
amount_minor: 250000
currency: USD
```

| Kind | Required `spec` fields |
|---|---|
| `Contract` | `engagement_id`, `parties`, `state`, `effective_dates`, `obligations`, `artifact_ref` |
| `Invoice` | `engagement_id`, `state`, `number`, `issued_at`, `due_at`, `line_items`, `total`, `artifact_ref` |
| `Payment` | `invoice_ids`, `state`, `expected`, `confirmed`, `provider_reference`, `evidence_refs` |

Expected, invoiced, confirmed, and reconciled values are distinct fields and
states.

### Operations

| Kind | Required `spec` fields |
|---|---|
| `Task` | `owner_entity_id`, `state`, `objective`, `dependencies`, `acceptance_criteria`, `next_action` |
| `Decision` | `context`, `decision`, `alternatives`, `rationale`, `authority`, `reversibility`, `consequences` |
| `AgentRun` | `objective`, `state`, `owning_entities`, `target_repositories`, `authority`, `evidence_refs`, `next_valid_action` |

## Field Classification Contract

Every schema field is annotated:

```yaml
classification: confidential
redaction: omit
searchable: false
publishable: false
```

Possible redaction:

- `none`;
- `mask`;
- `omit`;
- `reference_only`.

Classification inheritance cannot reduce protection. A public entity may
contain confidential fields, but a public projection omits them.

## Command Contract

```yaml
api_version: studio.guilherme.dev/command-v1
command_id: cmd_20260614_example
command_type: entity.transition
actor:
  actor_id: per_20260614_guilherme-silva
  actor_kind: human
source:
  interface: cli
  run_id: run_20260614_example
target:
  entity_id: tsk_20260614_example
expected:
  revision: 2
intent: Mark task ready for verification.
payload:
  to_state: verification
idempotency_key: local-unique-value
requested_at: 2026-06-14T16:00:00-03:00
dry_run: false
```

Rules:

- command ID is unique;
- retry with same idempotency key and same payload returns prior result;
- same key with different payload fails;
- expected revision is required for updates;
- actor and source are never inferred from payload fields;
- unknown command type fails closed.

## Command Result Contract

```yaml
api_version: studio.guilherme.dev/result-v1
request_id: req_20260614_example
command_id: cmd_20260614_example
status: ok
target:
  entity_id: tsk_20260614_example
  prior_revision: 2
  current_revision: 3
events:
  - evt_20260614_example
warnings: []
required_actions: []
evidence_refs: []
```

Blocked results contain no future revision.

## Event Contract

```yaml
api_version: studio.guilherme.dev/event-v1
event_id: evt_20260614_example
event_type: task.state_changed
schema_version: 1
occurred_at: 2026-06-14T16:00:00-03:00
actor_id: per_20260614_guilherme-silva
command_id: cmd_20260614_example
run_id: run_20260614_example
subject_id: tsk_20260614_example
from_revision: 2
to_revision: 3
payload:
  from_state: in_progress
  to_state: verification
evidence_refs: []
classification: internal
```

Event payload schemas are registered per event type. Events are append-only;
correction creates another event.

## Gate Evaluation Contract

```yaml
gate_id: external.communication.send
outcome: require_confirmation
risk: high
actor_id: per_20260614_guilherme-silva
target_id: com_20260614_example
reason: Sending represents Guilherme externally.
rules:
  - constitution.article_11
required_evidence: []
prepared_action_id: act_20260614_example
recovery_guidance: Review and confirm the exact payload.
```

Outcomes:

- `allow`;
- `warn`;
- `require_confirmation`;
- `block`.

Callers cannot downgrade an outcome.

## Evidence Contract

```yaml
api_version: studio.guilherme.dev/v1
kind: Evidence
metadata:
  id: evd_20260614_test
  classification: internal
spec:
  evidence_type: execution
  subject_id: rel_20260614_v030
  claim: Plugin package activates and exposes both Elementor widgets.
  source:
    type: file
    path: products/simple-budget-plugin/evidence/release-0.3.0.txt
  reliability: B
  captured_at: 2026-06-14T16:10:00-03:00
  checksum:
    algorithm: sha256
    value: "<digest>"
  mutable_source: false
```

Evidence with mutable URLs records capture time and, when permitted, a local
snapshot or response digest.

## Prepared Action Contract

```yaml
api_version: studio.guilherme.dev/prepared-action-v1
action_id: act_20260614_example
revision: 1
state: awaiting_confirmation
action_type: communication.send
actor_id: per_20260614_guilherme-silva
provider: email
recipient:
  display: Example Agency
  address_ref: contact://org_20260614_example/primary-email
purpose: Initial outreach about Elementor implementation support.
exact_payload:
  subject: WordPress implementation support
  body_ref: assets://cnt_20260614_outreach/version-3
attachments: []
source_entities:
  - pro_20260614_example
claims:
  - text: I build custom Elementor integrations.
    evidence_refs:
      - case_20260614_simple-budget-plugin
side_effects:
  - Sends one external email.
rollback: Cannot retract after provider delivery.
payload_checksum: "<digest>"
expires_at: 2026-06-15T16:00:00-03:00
confirmation_required: true
```

Confirmation:

```yaml
confirmation_id:
action_id:
action_revision:
payload_checksum:
confirmed_by:
confirmed_at:
expires_at:
```

## Repository Observation Contract

```yaml
repository_id:
registered_path:
actual_git_root:
root_matches: true
branch:
head:
upstream:
ahead:
behind:
status:
  modified: []
  untracked: []
  staged: []
remotes: []
nested_repositories: []
observed_at:
```

Observation is immutable evidence for that moment, not a continuously true
fact.

## Handoff Contract

```yaml
run_id:
objective:
outcome:
current_reality:
changes:
verification:
repositories:
decisions:
residual_risks:
next_valid_action:
confirmation_boundaries:
created_at:
```

## Schema Evolution

Schema changes are:

- additive compatible;
- migration-required;
- breaking.

Rules:

- canonical files retain their declared schema version;
- readers either support or reject the version explicitly;
- migrations run through dry-run and backup;
- destructive field removal is not automatic;
- renamed fields retain migration provenance;
- lifecycle changes require compatibility analysis for existing state.

## Contract Test Matrix

Every schema must prove:

- valid minimal fixture;
- valid complete fixture;
- unknown field rejection;
- invalid ID rejection;
- classification enforcement;
- secret fixture rejection;
- relation type validation;
- schema-version handling;
- deterministic serialization;
- migration from every supported prior version.

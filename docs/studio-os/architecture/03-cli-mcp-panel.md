# CLI, MCP, Local API, and Panel Contracts

Status: normative interface architecture
Scope: coherent operator and agent surfaces over one Studio Core

## Interface Principle

The three interfaces serve different operators but express the same use cases:

- CLI optimizes deterministic execution and recovery;
- MCP optimizes governed agent access and context;
- panel optimizes human visibility and review.

No interface receives a privileged shortcut around Studio Core.

## Shared Response Envelope

All machine surfaces return a versioned envelope:

```json
{
  "apiVersion": "studio.guilherme.dev/v1",
  "requestId": "req_20260614_example",
  "status": "ok",
  "result": {},
  "warnings": [],
  "requiredActions": [],
  "evidence": [],
  "projectionRevision": 42
}
```

`status` is one of:

- `ok`;
- `warning`;
- `confirmation_required`;
- `blocked`;
- `conflict`;
- `error`.

Human output may be concise, but `--json` and API responses preserve the full
contract.

## CLI Command Grammar

```text
studio <resource> <verb> [target] [options]
```

Global options:

```text
--root <path>
--json
--quiet
--verbose
--dry-run
--actor <id>
--idempotency-key <value>
--expected-revision <number>
--yes
```

`--yes` can acknowledge an ordinary local prompt. It cannot substitute an
exact-payload confirmation token for protected external or destructive actions.

## Required CLI Surface

### Workspace and health

```text
studio init
studio inspect
studio status
studio validate
studio doctor
studio sync
studio backup
studio dashboard
```

### Domain resources

```text
studio person
studio organization
studio prospect
studio client
studio opportunity
studio engagement
studio deliverable
studio project
studio product
studio repo
studio evidence
studio case
studio campaign
studio content
studio application
studio proposal
studio contract
studio invoice
studio payment
studio task
studio decision
studio communication
studio run
```

Each resource supports only meaningful verbs. A generic CRUD generator must not
erase lifecycle semantics. Examples:

```text
studio opportunity qualify <id>
studio engagement transition <id> --to ready
studio evidence attach --subject <id> --file <path>
studio repo inspect <id>
studio application prepare <id>
studio content prepare-publish <id>
```

## CLI Exit Codes

| Code | Meaning |
|---|---|
| `0` | success |
| `2` | invalid command or input |
| `3` | schema validation failure |
| `4` | lifecycle or authority block |
| `5` | confirmation required |
| `6` | optimistic concurrency conflict |
| `7` | dependency or adapter unavailable |
| `8` | repository/environment mismatch |
| `9` | recovery required |
| `10` | unexpected internal failure |

Exit codes remain stable across minor versions.

## CLI Safety Behavior

- Mutations print target, prior state, future state, and evidence impact.
- `--dry-run` returns the same planned mutation without persistence.
- Machine mode never opens an interactive prompt.
- Destructive commands require target ID plus confirmation token.
- Repository commands print the resolved Git root before mutation.
- External actions stop after preparation unless a valid confirmation is
  supplied.
- Output redacts confidential fields according to command context.

## MCP Resource Model

Resources provide bounded context, not a mirrored filesystem.

Required URI patterns:

```text
studio://constitution
studio://schemas/{kind}
studio://entities/{id}
studio://entities/{id}/context
studio://workflows/{workflow-id}
studio://repositories/{id}/health
studio://dashboard/summary
studio://runs/{id}/handoff
```

Context resources declare:

- source records;
- classification;
- generated time;
- projection revision;
- omitted sensitive sections;
- unresolved contradictions.

An agent should receive the smallest context pack that can support the task.

## MCP Tool Classes

### Read tools

- `studio_query_entities`;
- `studio_get_entity`;
- `studio_get_next_actions`;
- `studio_inspect_repository`;
- `studio_validate`;
- `studio_get_prepared_action`;
- `studio_get_run_context`.

### Local mutation tools

- `studio_create_entity`;
- `studio_update_entity`;
- `studio_transition_entity`;
- `studio_register_evidence`;
- `studio_create_task`;
- `studio_record_decision`;
- `studio_create_handoff`.

These tools include expected revision and dry-run support.

### Protected action tools

- `studio_prepare_external_action`;
- `studio_confirm_external_action`;
- `studio_execute_confirmed_action`;
- `studio_prepare_destructive_action`;
- `studio_execute_destructive_action`.

Preparation, confirmation, and execution are distinct calls. An MCP client
cannot self-confirm on behalf of Guilherme unless an explicit delegated policy
exists for that exact action class.

## MCP Tool Annotation

Each tool declares:

- read-only or mutating;
- local or external effect;
- idempotency behavior;
- destructive potential;
- required capability;
- classification ceiling;
- confirmation behavior;
- evidence emitted.

Generic shell, arbitrary SQL, arbitrary path reads, and secret retrieval are
not public Studio MCP tools.

## MCP Prompts

Prompts are workflow entrypoints backed by canonical instructions:

- qualify a freelance opportunity;
- prepare an engagement;
- diagnose a visual implementation mismatch;
- seed a portfolio case from evidence;
- create a campaign brief;
- tailor a job application;
- hand off an active task.

Prompts do not carry hidden authority. They may guide an agent toward tools but
cannot change gate outcomes.

## Local API

The panel API:

- binds to `127.0.0.1`;
- rejects non-loopback binding in V1;
- uses an unpredictable per-launch session token;
- validates `Origin` and `Host`;
- uses SameSite cookies when a cookie is needed;
- disables permissive CORS;
- applies request size limits;
- exposes no raw filesystem route;
- applies the same command and response schemas as CLI/MCP;
- logs metadata without confidential payload bodies.

Suggested routes:

```text
GET  /api/v1/summary
GET  /api/v1/entities
GET  /api/v1/entities/:id
POST /api/v1/commands/dry-run
POST /api/v1/commands/execute
GET  /api/v1/prepared-actions/:id
POST /api/v1/prepared-actions/:id/confirm
GET  /api/v1/diagnostics
GET  /api/v1/events
```

The route design follows use cases, not database tables.

## Panel Information Architecture

### Economic overview

Answers:

- what can produce or protect income now;
- what is awaiting response, approval, invoice, or payment;
- what is blocked;
- what should happen next.

Views:

- revenue pipeline;
- active engagement value and stage;
- receivables;
- application pipeline;
- deadline and follow-up calendar;
- top next actions.

### Work

- clients and relationship context;
- engagements and deliverables;
- products and releases;
- repositories and environment health;
- tasks, evidence, decisions, and agent runs.

### Distribution

- portfolio cases;
- content queue;
- campaigns;
- opportunities influenced by evidence.

### Control

- validation errors;
- stale projections;
- backup age;
- recovery warnings;
- prepared actions;
- recent authority blocks.

## Panel Interaction Rules

- A list shows owner, state, next action, and blockage before decorative data.
- A detail page links canonical source and related evidence.
- A mutation preview shows exact before/after state.
- Protected actions show recipient, channel, exact payload, attachments, and
  expiration.
- Destructive actions require re-entry of target ID or equivalent deliberate
  confirmation.
- The UI cannot silently fix invalid records.
- A stale projection triggers authoritative refresh before edit.
- The panel does not expose a generic YAML editor as the primary workflow.

## Prepared Action Lifecycle

```text
draft
→ validated
→ awaiting_confirmation
→ confirmed
→ executing
→ executed
→ reconciled
```

Terminal alternatives:

```text
expired
cancelled
failed
superseded
```

Confirmation binds:

- prepared action ID;
- payload checksum;
- actor;
- side-effect class;
- expiration;
- target provider and recipient.

Any material edit creates a new revision and invalidates prior confirmation.

## Interface Equivalence Tests

For a shared fixture:

1. execute dry-run through CLI, MCP, and local API;
2. compare normalized mutation plan, gate result, warnings, and evidence;
3. execute through one interface;
4. verify the other interfaces observe the same canonical revision;
5. prove a blocked action remains blocked everywhere.

Formatting may differ. Meaning may not.

## Availability and Degradation

- If SQLite is unavailable, CLI can perform authoritative reads and repair.
- If the panel fails, CLI remains complete.
- If MCP fails, human and scripted CLI operation remains complete.
- If an external provider fails, the prepared action remains local and retryable
  according to idempotency policy.
- If canonical validation fails, all interfaces expose the same repair path.

## Versioning

- Schemas use explicit versions.
- CLI flags and exit codes follow semantic compatibility.
- MCP tool input/output changes require versioned contracts.
- Local API lives under `/api/v1`.
- The panel may evolve rapidly but cannot assume undocumented API behavior.

## Acceptance Criteria

- Every listed CLI group maps to owned core use cases.
- MCP Inspector can discover resources, tools, prompts, and schemas.
- Panel starts from `studio dashboard` and binds only to loopback.
- CLI/MCP/API equivalence fixtures pass.
- Confirmation tokens fail after payload edit or expiration.
- A panel request cannot read arbitrary local files.
- Machine output remains stable enough for scripts and agents.

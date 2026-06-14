# Studio OS System Architecture

Status: normative implementation architecture
Scope: runtime boundaries, dependency direction, use-case execution, and
failure isolation

## Architectural Objective

The Studio OS must coordinate the business without becoming a second source of
truth for Git, WordPress, GitHub, communication channels, or financial
providers.

It therefore has four responsibilities:

1. preserve canonical operational records;
2. enforce lifecycles, authority, and evidence requirements;
3. project those records into useful operational views;
4. coordinate external systems through narrow adapters.

The system is local-first. A network connection may be required by an adapter,
but the core operation, records, validation, inspection, and planning remain
available offline.

## Architectural Invariants

1. Domain rules live in Studio Core, not in CLI commands, MCP handlers, React
   components, database triggers, or adapters.
2. Markdown/YAML records and append-only audit events are canonical. SQLite is
   derived.
3. Every mutation identifies actor, intent, target, expected prior state, risk,
   and evidence.
4. A blocked action cannot be made valid by calling a different interface.
5. External adapters cannot write canonical files directly.
6. The core never imports provider SDKs.
7. A repository path is not trusted until resolved through the registry and
   checked against its declared Git root.
8. A panel failure cannot prevent CLI operation.
9. An MCP failure cannot corrupt or strand a prepared action.
10. No valid execution path accepts a secret value into canonical Git storage.

## Runtime Components

```text
Human or agent
      |
      +--------------------+--------------------+
      |                    |                    |
   Studio CLI          Studio MCP          Local panel
      |                    |                    |
      +--------------------+--------------------+
                           |
                      Local API
                (panel transport only)
                           |
                    Application layer
                           |
        +------------------+------------------+
        |                  |                  |
  Domain services    Policy/gate engine   Workflow services
        |                  |                  |
        +------------------+------------------+
                           |
                    Storage contracts
             +-------------+-------------+
             |                           |
       Canonical store              Read projector
      Markdown/YAML/events             SQLite
             |
       Adapter coordinator
             |
  Git / Docker / WordPress / GitHub / communication
```

The local API is not a universal internal transport. CLI and MCP call the
application layer in process. The panel uses the API because it runs in a
browser.

## Package Boundaries

### `packages/schemas`

Owns:

- versioned entity, event, command, response, and configuration schemas;
- parsing and structural validation;
- classification metadata;
- stable machine-readable error codes;
- schema migrations that preserve meaning.

Must not own:

- filesystem access;
- lifecycle decisions;
- provider integration;
- UI formatting.

### `packages/core`

Owns:

- use-case orchestration;
- lifecycle transition rules;
- authority and risk evaluation;
- prepared-action creation and confirmation;
- evidence requirements;
- domain services and cross-domain coordinators;
- idempotency and optimistic concurrency semantics.

Must not own:

- concrete filesystem operations;
- SQLite queries;
- HTTP framework behavior;
- shell execution;
- provider SDK behavior.

### `packages/storage`

Owns:

- canonical record repositories;
- atomic file transactions;
- append-only event writing;
- registry resolution;
- checksums and optimistic concurrency;
- SQLite projection and rebuild;
- storage locks and crash recovery.

Must not decide:

- whether a lifecycle transition is allowed;
- whether an external action requires confirmation;
- what a panel should display.

### `packages/cli`

Owns:

- argument parsing;
- operator-oriented output;
- machine-readable output;
- exit codes;
- interactive confirmation handoff;
- command discovery and help.

Commands translate input into application commands and format application
results. They do not duplicate domain behavior.

### `packages/mcp`

Owns:

- MCP resources, tools, and prompts;
- mapping MCP requests to application commands;
- scoped context assembly;
- tool annotations and confirmation boundaries;
- safe response shaping.

The MCP server exposes neither unrestricted filesystem access nor arbitrary
shell execution.

### `packages/local-api`

Owns:

- loopback HTTP transport;
- origin and session checks;
- request-to-command mapping;
- streaming read updates if needed;
- stable API response envelopes.

It must remain replaceable without changing domain services.

### `apps/panel`

Owns:

- operational dashboards;
- entity and pipeline views;
- prepared-action review;
- diagnostics and backup visibility;
- accessible local interaction.

It may cache view state but never canonical business state.

### `packages/adapters`

Contains provider-specific packages behind contracts:

```text
adapters/
├── git/
├── github/
├── docker/
├── wordpress/
├── whatsapp/
└── filesystem-secret-reference/
```

Each adapter:

- accepts a typed request;
- returns typed observations or a prepared side effect;
- declares whether it reads, mutates locally, or acts externally;
- never invents lifecycle transitions;
- never stores secrets in returned canonical payloads.

### `packages/testing`

Owns reusable:

- fixtures;
- fake clocks and ID generators;
- temporary Studio workspaces;
- adapter contract tests;
- canonical store crash fixtures;
- journey test harnesses.

It must not become a generic production utility package.

## Application Command Model

Every mutation enters Studio Core as a command envelope:

```yaml
command_id: cmd_20260614_example
command_type: engagement.transition
schema_version: 1
actor:
  id: per_20260614_guilherme-silva
  kind: human
source:
  interface: cli
  run_id: run_20260614_example
target:
  entity_id: eng_20260614_example
expected:
  revision: 7
intent: Start work after deposit confirmation.
payload:
  to_state: in_progress
idempotency_key: example-key
requested_at: 2026-06-14T15:00:00-03:00
```

Execution order:

1. parse command;
2. authenticate or resolve actor;
3. load target and referenced records;
4. validate expected revision;
5. evaluate lifecycle preconditions;
6. evaluate authority and risk gates;
7. validate required evidence;
8. calculate a mutation plan;
9. return a dry-run plan or persist atomically;
10. append events;
11. update the SQLite projection;
12. return result and evidence obligations.

No external side effect occurs inside the canonical record transaction. An
external action is prepared first, confirmed separately, executed by an
adapter, and reconciled through a second mutation.

## Mutation Transaction

A local canonical mutation uses this boundary:

```text
validated prior state
→ mutation plan
→ acquire scoped lock
→ write temporary records
→ validate complete future state
→ atomic rename
→ append audit event
→ release lock
→ update projection
```

If the process fails before atomic rename, canonical state is unchanged. If it
fails after the rename but before projection, the canonical state remains
valid and `studio sync` repairs the projection. If event append fails after a
record write, the transaction is marked incomplete and `studio doctor` must
reconcile it before further mutations to that entity.

V1 does not pretend the filesystem supports a distributed transaction. It
uses narrow locks, operation manifests, checksums, and deterministic repair.

## Query Model

Reads use two paths:

- **authoritative read:** canonical file by ID, used for mutation and detail;
- **projected read:** SQLite query, used for lists, counts, search, and
  dashboards.

Projected results include:

- projection revision;
- source checksum;
- indexed timestamp;
- stale flag when canonical state changed after indexing.

The panel may show stale data with a visible refresh state, but a mutation must
reload the authoritative record.

## Workflow Orchestration

The system supports explicit workflows without embedding a general-purpose
workflow language in V1.

A workflow definition declares:

- workflow ID and version;
- applicable entity types;
- ordered or conditional steps;
- required actor;
- input and output contracts;
- gates;
- evidence;
- compensating action;
- terminal outcomes.

Core workflow services invoke normal domain use cases. Workflow code cannot
bypass their validation.

## Failure Taxonomy

| Failure | Meaning | Required behavior |
|---|---|---|
| `validation_error` | input or record violates schema | reject without write |
| `conflict` | revision or state changed | reload and re-plan |
| `unauthorized` | actor lacks capability | block and record attempt |
| `confirmation_required` | exact side effect needs approval | return prepared action |
| `evidence_missing` | transition lacks proof | list required evidence |
| `dependency_unavailable` | provider or runtime missing | preserve local state |
| `projection_stale` | SQLite differs from canonical | rebuild or refresh |
| `repository_mismatch` | path or Git root differs from registry | block repository action |
| `secret_detected` | prohibited value in canonical payload | reject and guide secure entry |
| `recovery_required` | incomplete transaction or corrupted record | block scoped writes |

Errors include stable codes, human guidance, and structured context. Raw secret
values, provider credentials, and unnecessary private payloads are never
logged.

## Technology Decision Boundary

TypeScript is the implementation hypothesis because it can share contracts
across CLI, MCP, local API, and panel. It becomes a final decision only after a
research packet proves:

- supported Node distribution on Guilherme's environment;
- stable SQLite binding strategy;
- MCP SDK compatibility;
- packaging of the `studio` executable;
- acceptable startup and memory cost;
- test and migration ergonomics;
- dependency and supply-chain exposure.

The architecture is language-independent at the contract level. A failed
TypeScript assessment changes implementation technology, not the domain model.

## Architectural Fitness Tests

The implementation must continuously prove:

- `core` has no imports from interfaces or concrete adapters;
- panel, MCP, and CLI return equivalent outcomes for shared command fixtures;
- deleting SQLite does not affect canonical records;
- external adapters cannot be invoked without a prepared action where required;
- a registered repository action cannot escape its Git root;
- a secret fixture cannot reach canonical storage, logs, events, or projection;
- a simulated crash at every transaction stage is recoverable;
- no module named `utils`, `misc`, `common`, or `helpers` accumulates unrelated
  domain responsibilities;
- dependency graph remains acyclic.

## Implementation Exit

This architecture is implemented when the core journeys can run from fixtures,
all three surfaces share command contracts, SQLite can be rebuilt, provider
outages preserve local operation, and an external action cannot be executed by
changing interface.

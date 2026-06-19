# Self-Build Harness Bootstrap

Status: next implementation authority
Purpose: define the first playable Studio OS slice that lets agents use Studio
OS to operate and build the rest of Studio OS with discipline.

## Core Idea

The immediate goal is not to complete every PRD directly.

The immediate goal is to implement the minimum operational harness that lets an
AI agent run Studio OS against any material Studio work:

```text
objective
-> context pack
-> method lens
-> authorization
-> plan
-> observation
-> action log
-> verification
-> evidence
-> handoff
-> close or block
```

This is the same product idea as a game that becomes playable while it is still
installing. Studio OS does not need every domain complete before it is useful.
It needs one coherent playable loop that can discipline the implementation of
the remaining domains and every material operation that happens after them.

The first self-use will probably be a coding/refactor task because that is the
current bottleneck. That does not define the scope. The same harness must later
govern WordPress work, portfolio evidence, assets, product releases, marketing,
sales, LinkedIn/career applications, finance, decisions, backup/recovery and
prepared external actions.

## Non-Goals

This bootstrap does not:

- complete all PRDs;
- create real clients, jobs, campaigns or finance records;
- release the portfolio;
- send real external messages;
- make the panel the primary authoring surface;
- require MCP to be online for the harness to work;
- make agents autonomous without Guilherme's authority boundaries;
- import the Praxis method as a separate project framework.

It materializes Praxis knowledge into the Studio OS run loop.

## Bootstrap Definition

The harness is bootstrap-complete when the next material Studio task can be run
through Studio OS itself and the system refuses to close the run without enough
context, authority, evidence, verification and handoff.

Minimum self-use task:

```text
Use Studio OS to execute a scoped Studio OS work task,
such as extracting one storage responsibility out of
packages/storage/src/index.ts, while recording the whole agent run.
```

That task is not accepted because the code changed. It is accepted because the
run record proves:

- the objective and owner were resolved;
- the relevant PRD, architecture, decision, matrix and work context were loaded;
- the Praxis-derived engineering lens was applied proportionally;
- the allowed and prohibited write sets were explicit;
- observations and actions were recorded;
- verification was run or explicitly justified as not run;
- evidence and handoff were produced;
- the next valid action is recoverable without oral rebrief.

## Praxis Lens As Executable Context

Each `AgentRun` context pack must include a compact `method_lens` section. This
is not a lecture. It is the set of questions the run must answer for the task.

```yaml
method_lens:
  lifecycle:
    system_role:
    lifecycle_stage:
    tailoring:
  business_value:
    desired_outcome:
    stakeholder:
    cost_of_delay_or_reason_now:
  requirements_solution:
    acceptance_criteria:
    constraints:
    traceability:
  systems:
    system_of_interest:
    boundary:
    external_interfaces:
  software:
    architecture_concern:
    design_concern:
    construction_concern:
    test_concern:
    maintenance_concern:
  governance:
    gate:
    definition_of_done:
    decision_needed:
  quality_risk_security:
    quality_attributes:
    risks:
    controls:
    assurance_evidence:
  delivery_operations:
    build_or_runtime_entrypoint:
    recovery_or_rollback:
    operational_check:
  knowledge_documentation:
    source_of_truth:
    decision_or_handoff_needed:
    documentation_update:
  methods_models_practices:
    selected_practice:
    tailoring_reason:
    stop_criteria:
```

The context pack may mark a field `not_material` only with a short reason. For
material, public, security-sensitive, data-bearing or cross-domain work, missing
critical fields block authorization.

## Required Bootstrap Capabilities

### 1. AgentRun lifecycle

Implement first-class run states:

```text
draft -> oriented -> authorized -> in_progress -> verifying
-> handoff_ready -> closed
```

Exceptional states:

```text
blocked
abandoned
superseded
```

Close must fail when:

- objective outcome or blocker is missing;
- no handoff exists;
- material verification is missing without reason;
- dirty target repository state is unclassified;
- required evidence is missing;
- next valid action is absent;
- external or destructive action is unresolved.

### 2. Context pack builder

`buildContextPack` must assemble only the relevant context:

- AGENTS/root operating rules;
- current task or objective;
- owning PRD and implementation plan;
- relevant capability matrix rows;
- architecture contracts;
- decisions and open cross-PRD gaps;
- current Git/repository reality;
- evidence already available;
- forbidden reconsiderations;
- method lens derived from this bootstrap.

It must exclude secrets and unrelated confidential material.

### 3. Authorization and write-set contract

`authorizeAgentRun` records:

- allowed write paths;
- prohibited write paths;
- allowed tools or interfaces;
- confirmation requirements;
- risk tier;
- expected verification commands;
- external action policy;
- rollback or recovery expectation;
- maximum authority for the agent.

Authorization is not a vibe. It is a canonical record that future agents can
inspect.

### 4. Plan and observation record

Before mutation, the run records:

- current Git status for target repositories;
- relevant file/module observations;
- existing behavior or characterization evidence;
- planned change;
- expected outputs;
- acceptance criteria;
- risks and unknowns.

Repository reality outranks stale documentation.

### 5. Action log

Every material action records:

```yaml
action_id:
run_id:
actor:
kind: file_edit | command | test | adapter_observation | decision | evidence
target:
intent:
before:
after:
status:
evidence_refs: []
```

This does not need to log every read command. It must log material edits,
verification, decisions, generated evidence, adapter observations and blocked
actions.

### 6. Evidence and claim map

The harness must connect claims to proof:

```yaml
claim:
required_evidence:
actual_evidence:
verification_command:
artifact:
checksum:
mutable_source:
status:
```

Examples:

- "behavior preserved" links to test command and diff review;
- "canonical data valid" links to `studio validate`;
- "panel works" links to Playwright smoke;
- "MCP works" links to stdio smoke;
- "backup works" links to restore rehearsal evidence.

### 7. Verification close gate

`completeVerification` records:

- command run;
- exit code;
- summarized result;
- artifact path when relevant;
- skipped reason when not run;
- residual risk;
- relationship to acceptance criteria.

The system should not allow `closed` if required verification is absent.

### 8. Handoff and resume

`createHandoff` produces a compact, durable packet:

- what was requested;
- what is true now;
- what changed;
- what was verified;
- Git state;
- evidence links;
- residual risks;
- forbidden rework;
- exact next valid action.

`resumeAgentRun` or `studio agent status` must let another agent continue using
only the run ID and repository state.

### 9. Learning promotion

Repeated failure patterns should become one of:

- gate rule;
- test fixture;
- schema field;
- decision record;
- workflow instruction;
- documentation correction;
- agent prompt requirement.

One-off noise stays in the run. Recurring failure becomes system behavior.

### 10. Interface surfaces

Bootstrap priority:

1. CLI complete enough to run without MCP.
2. MCP resources/tools expose the same loop for agents when MCP is available.
3. Panel shows runs, context packs, evidence, blockers and exact payloads.

The CLI is the fallback harness. MCP is the governed agent surface. The panel is
visibility and review.

## Required CLI Surface

```text
studio agent start
studio agent context
studio agent authorize
studio agent observe
studio agent plan
studio agent record-action
studio agent record-evidence
studio agent verify
studio agent handoff
studio agent close
studio agent status
studio agent resume
```

All mutating commands must support:

- `--json`;
- `--dry-run`;
- `--idempotency-key`;
- expected revision when updating an existing run;
- stable exit codes.

## Required MCP Surface

Resources:

```text
studio://runs/{id}
studio://runs/{id}/context
studio://runs/{id}/handoff
studio://runs/{id}/evidence
studio://runs/{id}/method-lens
```

Tools:

```text
studio_start_agent_run
studio_build_context_pack
studio_authorize_agent_run
studio_record_agent_observation
studio_record_agent_action
studio_complete_agent_verification
studio_create_agent_handoff
studio_close_agent_run
```

MCP cannot bypass CLI/core behavior. The same command runtime must produce
compatible events.

## Required Panel Surface

The panel needs only enough for bootstrap:

- active runs;
- current run state;
- method lens summary;
- authorized write set;
- actions and verification;
- evidence and blockers;
- handoff preview;
- exact payload review for protected actions.

Do not build a full dashboard before this loop works.

## Implementation Phases

### Phase A: schemas and records

Write set:

- `packages/schemas/src/entities/agent-run*`
- `packages/schemas/src/entities/context-pack*`
- `operations/records/agent-runs/`
- `operations/records/context-packs/`

Acceptance:

- schemas support run lifecycle, method lens, authorization, actions,
  verification, evidence refs and handoff refs;
- sample records validate;
- secret-shaped content is rejected or redacted where required.

### Phase B: core harness service

Write set:

- `packages/core/src/harness/`
- `packages/core/src/commands/handlers/agent*`
- `packages/core/src/commands/registry.ts`

Acceptance:

- lifecycle preconditions are enforced;
- close gate blocks missing handoff/evidence/verification;
- context pack builder uses Studio records, not hardcoded prose;
- run actions emit events.

### Phase C: CLI fallback harness

Write set:

- `packages/cli/src/commands/agent*`
- CLI command registry;
- interface equivalence fixtures where needed.

Acceptance:

- a full run can be started, authorized, updated, verified, handed off and
  closed from CLI only;
- JSON output is stable;
- dry-run is available for mutating steps.

### Phase D: MCP and panel visibility

Write set:

- `packages/mcp/src/resources/`
- `packages/mcp/src/tools/`
- `apps/panel/src/views/agents/`
- `apps/panel/src/components/`

Acceptance:

- MCP exposes context/run/handoff without arbitrary filesystem access;
- panel reviews current run state and exact protected payloads;
- MCP/panel do not own domain decisions.

### Phase E: self-use fixture

Write set:

- `packages/testing/src/agent-harness/`
- workflow fixtures;
- capability matrix/evidence records.

Acceptance:

- fixture creates a temporary Studio workspace;
- starts a run for a scoped Studio work task;
- builds context pack with method lens;
- records authorization, observations, action, verification and handoff;
- refuses close until required fields exist;
- produces deterministic evidence.

## First Self-Build Task

After bootstrap implementation, the first real run should be:

```text
Use the new harness to extract one coherent storage responsibility from
packages/storage/src/index.ts while preserving behavior.
```

This is deliberately chosen because storage is a shared PRD 12 surface and
future parallel agents depend on it. The success criterion is not file size. It
is that the harness makes the work disciplined, recoverable and reviewable.

## First Self-Build Execution

2026-06-19: the first real self-build run closed as
`run_20260619_self-build-storage-config-path-extraction`.

Outcome:

- extracted Studio storage config/path helpers into
  `packages/storage/src/paths.ts`;
- kept `packages/storage/src/index.ts` as the public storage facade;
- preserved root path safety checks and runtime path behavior;
- passed `npm run verify`;
- recorded evidence
  `evd_20260619_self-build-storage-config-path-extraction-verification`;
- produced a handoff with the next valid action.

2026-06-19: the second self-build run closed as
`run_20260619_self-build-storage-transaction-lock-extraction`.

Outcome:

- extracted Studio storage transaction and entity lock helpers into
  `packages/storage/src/transactions.ts`;
- kept `EntityStore` as the public storage facade;
- preserved transaction manifest formats, recovery behavior, lock semantics and
  file mode behavior;
- passed `npm run verify`;
- recorded evidence
  `evd_20260619_self-build-storage-transaction-lock-extraction-verification`;
- produced a handoff with the next valid action.

2026-06-19: the third self-build run closed as
`run_20260619_self-build-storage-entity-file-scanning-extraction`.

Outcome:

- extracted Studio storage entity file scanning helpers into
  `packages/storage/src/files.ts`;
- kept storage public exports stable through `packages/storage/src/index.ts`;
- preserved canonical scan ordering, legacy filtering, path calculation and
  migration scan behavior;
- passed `npm run verify`;
- recorded evidence `evd_20260619_storage-file-scan-verification`;
- produced a handoff with the next valid action.

2026-06-19: the fourth self-build run closed as
`run_20260619_self-build-storage-event-store-extraction`.

Outcome:

- extracted Studio storage event append/list and legacy event normalization into
  `packages/storage/src/events.ts`;
- kept `EventStore` exported through `packages/storage/src/index.ts`;
- preserved JSONL append behavior, file mode, empty-list behavior, secret
  checks and legacy event normalization;
- passed `npm run verify`;
- recorded evidence `evd_20260619_storage-event-verification`;
- produced a handoff with the next valid action.

2026-06-19: the fifth self-build run closed as
`run_20260619_self-build-storage-projection-extraction`.

Outcome:

- extracted Studio storage SQLite projection and checksum helpers into
  `packages/storage/src/projection.ts`;
- kept `SQLiteProjection` and `projectionChecksum` exported through
  `packages/storage/src/index.ts`;
- preserved table schema, inserts, projection metadata, inspect behavior and
  next-action query ordering;
- passed `npm run verify`;
- recorded evidence `evd_20260619_storage-projection-verification`;
- produced a handoff with the next valid action.

2026-06-19: the sixth self-build run closed as
`run_20260619_self-build-storage-canonical-migration-extraction`.

Outcome:

- extracted Studio storage canonical validation and migration helpers into
  `packages/storage/src/canonical.ts`;
- kept `validateCanonicalFiles`, `migrateCanonicalV1` and canonical migration
  types exported through `packages/storage/src/index.ts`;
- preserved duplicate/path/relation validation, legacy alias mapping, YAML
  serialization, canonical write behavior and relation reconciliation;
- passed `npm run verify`;
- recorded evidence `evd_20260619_storage-canonical-migration-verification`;
- produced a handoff with the next valid action.

2026-06-19: the seventh self-build run closed as
`run_20260619_self-build-storage-entity-store-extraction`.

Outcome:

- extracted Studio storage `EntityStore` into
  `packages/storage/src/entity-store.ts`;
- kept `EntityStore` exported through `packages/storage/src/index.ts`;
- preserved constructor defaults, secret checks, revision conflicts, lock
  delegation, transaction delegation, `readByPath`, `get` and scan behavior;
- passed `npm run verify`;
- recorded evidence `evd_20260619_storage-entitystore-verification`;
- produced a handoff with the next valid action.

2026-06-19: the eighth self-build run closed as
`run_20260619_self-build-mcp-finance-mutation-extraction`.

Outcome:

- extracted Studio MCP contract, invoice, payment and finance mutation tools
  into `packages/mcp/src/tools/mutations/finance-mutations.ts`;
- kept `registerStudioMcpMutationTools` as the public MCP mutation facade;
- preserved MCP tool names, Zod schemas, command names, target IDs, dry-run,
  idempotency and payload construction;
- passed `npm run verify`;
- recorded evidence `evd_20260619_mcp-finance-mutation-verification`;
- produced a handoff with the next valid action.

## Gate To Resume PRD Waves

Do not resume broad PRD subagents until:

- one full self-build run closes through Studio OS;
- the run has context pack, authorization, action log, evidence, verification
  and handoff;
- CLI fallback works without MCP;
- MCP smoke exists or is explicitly blocked with a recorded gap;
- `studio validate` and `npm run verify` pass;
- the next PRD wave receives the run/handoff as context.

## Relationship To PRDs

- PRD 01 owns command runtime, gates, decisions and governance.
- PRD 10 owns the agent harness loop.
- PRD 11 owns CLI/MCP/panel exposure.
- PRD 12 owns data safety, recovery, redaction and backup implications.

The bootstrap is therefore a cross-PRD slice, but PRD 10 is the primary product
owner because the visible outcome is an operational AI harness.

# Agent Execution and Handoff

Status: normative workflow
Purpose: preserve continuity, authority, and reality across agent runs

## Operating Principle

An agent is not trusted because it has broad filesystem access or a large
context window. It is trusted only within an explicit task, authority scope,
repository boundary, and evidence contract.

The workflow must let an agent begin from current reality and stop without
forcing Guilherme to reconstruct the work verbally.

## Run Record

Every material execution creates an `AgentRun`:

```yaml
run_id:
objective:
requested_by:
actor:
status:
started_at:
ended_at:
owning_entities: []
target_repositories: []
target_environments: []
authority:
  allowed: []
  confirmation_required: []
  prohibited: []
context_sources: []
observations: []
decisions: []
actions: []
evidence_refs: []
risks: []
open_questions: []
next_valid_action:
handoff_path:
```

Routine read-only queries may be grouped, but coding, migration, external
communication, publication, financial work, or destructive actions require a
distinct run.

## Entry Protocol

### 1. Resolve the objective

Extract:

- economic or operational outcome;
- requested artifact or state change;
- explicit constraints;
- what must not change;
- expected evidence;
- urgency and risk.

The agent treats user language as raw intent and creates a precise internal
contract without erasing important vocabulary.

### 2. Resolve ownership

Identify:

- owning domain PRD;
- entity IDs;
- repository IDs;
- environment IDs;
- canonical source files;
- current task and decision records.

If ownership is ambiguous, the agent may inspect but must not create a new
generic location to avoid deciding.

### 3. Load minimum governing context

Required order:

1. Constitution;
2. task/run record;
3. owning entity and lifecycle;
4. target repository instructions;
5. relevant workflow, decision, and evidence;
6. only then implementation files.

Do not bulk-load historical conversations or all Studio documentation by
default.

### 4. Observe reality

Before mutation:

- inspect Git branch and status in every target repository;
- classify existing modifications and untracked files;
- inspect current runtime when behavior matters;
- validate paths against registry;
- compare handoff claims with actual files and provider state;
- record contradictions.

Repository and runtime evidence outrank stale handoff prose.

### 5. Classify work phase and risk

Phase:

- discovery;
- planning;
- implementation;
- stabilization;
- release;
- migration;
- recovery.

Risk:

- low: local reversible drafting or metadata;
- normal: scoped implementation with tests;
- high: data migration, public code, client deliverable, authentication,
  financial or privacy impact;
- critical: secret exposure, destructive recovery, production mutation,
  contract acceptance, payment.

The phase and risk select the gates and verification depth.

## Execution Protocol

### Plan the smallest complete change

The agent states:

- current observation;
- intended state;
- files or entities to change;
- dependencies;
- tests and evidence;
- confirmation boundaries.

Small does not mean incomplete. Scope expands when the current structure cannot
support a safe implementation.

### Execute through owned interfaces

- canonical state through Studio Core;
- code through the target repository;
- WordPress behavior through plugin/theme/runtime boundaries;
- external side effects through prepared actions;
- secrets through protected local entry.

The agent must not bypass a blocked interface by editing a lower layer directly.

### Maintain a decision trail

Record a decision when:

- public contract changes;
- data shape changes;
- migration becomes destructive;
- a dependency is adopted;
- repository topology changes;
- a user-approved design direction changes;
- a prior normative decision is reopened.

Routine local choices stay in code and run evidence.

### Verify proportionally

Verification is chosen from the risk, not from ritual:

- schema validation;
- unit/integration tests;
- static analysis;
- dependency audit;
- diff review;
- WordPress runtime smoke test;
- browser calibration and screenshot;
- backup/restore rehearsal;
- provider response;
- human approval.

The agent must validate the actual product entrypoint, not a lower-level proxy.

### Update canonical state

Before stopping:

- task state reflects reality;
- evidence is registered;
- repository health is current;
- decisions and risks are recorded;
- next valid action is explicit.

## Handoff Contract

A handoff must answer:

1. What was requested?
2. What is true now?
3. What changed?
4. Where did it change?
5. What was verified?
6. What remains uncertain or blocked?
7. What must not be repeated or reverted?
8. What is the exact next valid action?
9. Which actions still require Guilherme's confirmation?

Suggested structure:

```markdown
# Handoff: <objective>

## Outcome

## Current Reality

## Changes

## Verification

## Git State

## Decisions

## Residual Risks

## Next Valid Action

## Confirmation Boundaries
```

Handoffs reference evidence rather than pasting large command logs.

## Git Handoff Requirements

For each touched repository:

- absolute or registry path;
- branch;
- status summary;
- commits created;
- pushed or unpushed state;
- unrelated pre-existing changes preserved;
- relevant test command and result;
- files intentionally untracked or generated.

An agent must not report “clean” based on the coordinator repo while a nested
target repository is dirty.

## Interruption and Resume

If interrupted:

- do not invent completion;
- leave files in a valid or explicitly staged state;
- stop long-running sessions safely;
- record the last completed step;
- record the next command only when it is safe and deterministic;
- mark confirmation or external-state dependencies.

On resume:

1. read the latest handoff;
2. re-inspect Git and runtime;
3. compare revisions;
4. invalidate stale assumptions;
5. continue from the next valid action.

## Contradiction Protocol

When user instruction, handoff, documentation, and runtime disagree:

1. identify each claim and source;
2. classify as observation, inference, decision, or historical context;
3. apply document authority;
4. treat current runtime as sovereign for current behavior;
5. treat Guilherme as sovereign for intent and approval;
6. record the resolution if it affects future work.

Do not silently pick the most convenient interpretation.

## Agent Right to Disagree

An agent should challenge a requested path when it can state:

- the concrete risk;
- the likely cost;
- the evidence;
- a viable alternative.

After Guilherme understands and explicitly chooses a reversible path, execute
it competently. For blocked security, legal, financial, destructive, or
external-action boundaries, the required gate remains.

## Learning Promotion

Promote a run outcome into system policy only when:

- the failure is likely to recur;
- the abstraction applies beyond one file or pixel;
- the rule has an owner;
- compliance can be observed or tested;
- the cost of the rule is lower than the repeated failure.

Possible destinations:

- schema invariant;
- workflow;
- quality gate;
- decision;
- repository instruction;
- test fixture;
- adapter guard.

Do not create memory entries that merely narrate the conversation.

## Exit Checklist

- objective achieved or precise blocker recorded;
- canonical entities match reality;
- relevant Git roots inspected;
- verification evidence linked;
- no secret exposed;
- no external action executed without confirmation;
- no useful work left as accidental untracked output;
- next valid action identified;
- handoff sufficient for a different agent.

## Acceptance Criteria

- A new agent can continue a fixture task using only the run ID and repository.
- Existing user changes are not reverted.
- A stale handoff is detected through revision or Git mismatch.
- Every material action links to evidence.
- A stopped run never claims completion.
- Repeated failures can be promoted into testable process improvements.

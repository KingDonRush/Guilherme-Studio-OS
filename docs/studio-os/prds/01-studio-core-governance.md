# PRD 01: Studio Core and Governance

## Product Job

Provide one deterministic domain core that makes all Studio mutations obey the
same lifecycles, authority, evidence, and economic priorities regardless of
whether the caller is CLI, MCP, panel, or automation.

## Users

- Guilherme operating the studio.
- Agents preparing and executing bounded work.
- CLI, MCP, panel, and adapters consuming domain services.

## Capabilities

### Configuration and identity

- Resolve Studio root, runtime paths, schema versions, operator identity, and
  enabled adapters.
- Generate stable entity IDs and reject collisions.
- Expose environment capabilities without exposing secrets.

### Entity services

- Create, read, update, archive, and relate canonical entities.
- Validate classification and ownership.
- Write events for meaningful mutations.
- Prevent cross-domain duplication of canonical truth.

### Lifecycle engine

- Validate transitions using the contracts in
  [Lifecycles](../ontology/02-lifecycles.md).
- Return allowed transitions and missing preconditions.
- Emit one auditable event per accepted transition.

### Authority and gate engine

- Evaluate actor, action, target, classification, risk, and environment.
- Return `allow`, `warn`, `require_confirmation`, or `block`.
- Produce a prepared-action contract for external side effects.
- Invalidate stale confirmations after material payload changes.

### Evidence service

- Register evidence with provenance and checksum.
- Link evidence to claims, tasks, transitions, and public cases.
- Evaluate whether minimum evidence exists for completion.

### Economic prioritization

- Rank actionable work using revenue proximity, obligation, strategic proof,
  risk, dependency, capacity, and deadline.
- Explain rankings.
- Never auto-cancel lower-ranked work.

### Event and audit service

- Append immutable operational events.
- Correlate actions with actor, command, agent run, and target entities.
- Redact secret values.

## Structural Ownership

```text
packages/core/
├── config/
├── identity/
├── entities/
├── lifecycle/
├── authority/
├── evidence/
├── prioritization/
├── events/
└── workflows/
```

Each folder exposes a narrow public index. There is no generic `utils` module.

## Public Interfaces

```text
createEntity(command)
updateEntity(command)
transitionEntity(command)
archiveEntity(command)
evaluateGate(request)
prepareExternalAction(command)
confirmPreparedAction(command)
registerEvidence(command)
resolveNextActions(query)
appendEvent(event)
```

All interfaces return typed success or domain error objects. Exceptions are
reserved for programmer or infrastructure faults.

## Dependencies

- Depends on Constitution, schemas, canonical storage, registry, and event
  store.
- Must not depend on CLI, MCP, panel, or provider adapters.
- Blocks every mutation-capable interface and domain PRD implementation.

## Failure Modes

- caller bypasses core validation;
- inconsistent state transitions across interfaces;
- secret appears in event payload;
- confirmation reused after payload changes;
- economic ranking hides mandatory obligations;
- evidence references a missing or mutable source without checksum.

## Acceptance Criteria

- CLI, MCP, and API contract tests produce identical domain outcomes.
- Invalid transitions fail without partial writes.
- Hard gates cannot be downgraded by callers.
- external actions cannot execute without exact valid confirmation.
- all canonical mutations produce events.
- deleting the derived database does not affect core truth.

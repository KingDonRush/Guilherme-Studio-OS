# Praxis Development Method

Status: normative method for Studio OS development work
Purpose: prevent "modular monolith" from becoming a slogan instead of an
engineering method.

## Source

This method was derived from the local Praxis project at
`../AI/MCPS/praxis`, especially:

- `.praxis-method/praxis-method.md`
- `.praxis-method/operational-model/operational-model.md`
- `.praxis-method/method-derivation-plan.md`
- `.praxis-method/contracts/contracts.md`
- `.praxis-method/gates/gates.md`
- `.praxis-method/agents/agents.md`
- `.praxis-method/ai-scrum/ai-scrum.md`
- `.praxis-method/memory/memory.md`
- `.praxis-knowledge/03-systems-engineering/03-systems-engineering.md`
- `.praxis-knowledge/04-software-engineering/04-software-engineering.md`
- `.praxis-knowledge/06-quality-risk-and-security/06-quality-risk-and-security.md`
- `.praxis-knowledge/07-delivery-operations-support-retirement/07-delivery-operations-support-retirement.md`
- `.praxis-knowledge/08-knowledge-documentation-lifecycle-information/08-knowledge-documentation-lifecycle-information.md`
- `.praxis-knowledge/09-methods-models-and-practices/09-methods-models-and-practices.md`
- `docs/knowledge/software-engineering/architecture/README.md`

The Praxis rule adopted here is:

```text
development concerns are mandatory gates;
their artifact depth is tailored by risk, scope and evidence need.
```

Optionality exists only outside the development concern set. Inside software
development, a concern may be handled at minimum depth, but it is not silently
skipped.

## Operating Loop

Every material development increment follows the Praxis loop:

```text
orient -> frame -> plan increment -> produce -> verify/adapt -> consolidate
```

Low-risk edits may collapse the loop, but the final handoff must still show:

- what was intended;
- what was changed;
- what contract or boundary was touched;
- what verification proved;
- what remains unsafe, unknown or deferred.

For PRD completion, agent harness work, shared registries, architecture,
storage, security, recovery, interface behavior and WordPress/runtime behavior,
the default mode is `rigorous`.

## Mandatory Dev Gates

### 1. Method Selection Gate

Before implementation, state the method fragments being used and why:

- operating mode: light, standard or rigorous;
- dominant concern: architecture, command behavior, data, security, interface,
  recovery, UI, WordPress, test, documentation or integration;
- evidence expected;
- stop or downgrade criteria.

Do not adopt an entire framework when a local practice is enough. Do not invent
a practice when the repo already has one.

### 2. System Context Gate

Before changing code, answer:

- what is the system of interest;
- what role the software has in that system;
- which human, agent, CLI, API, MCP, panel or runtime actor consumes the result;
- which outside elements constrain the change.

This prevents building correct code for the wrong operating system.

### 3. Contract Gate

Every meaningful implementation has a small behavior contract:

- input and output;
- preconditions and postconditions;
- invariants;
- authority and risk;
- source of truth;
- acceptance evidence.

Contracts may live in tests, schemas, command definitions, PRD matrix rows,
decision records or documentation. They must be inspectable.

### 4. Architecture And Decomposition Gate

Architecture is not "using a modular monolith". It is a structural decision
with drivers, boundaries, dependencies, trade-offs and verification.

Before adding feature work to a large or shared surface, decide:

- the responsibility being owned;
- the boundary being created or preserved;
- the public interface;
- allowed and forbidden dependencies;
- data ownership;
- test and operational impact;
- whether an ADR or decision-register entry is required.

A split is valid only when each resulting module has a coherent reason to
exist and a smaller change surface than the original.

### 5. Design And Construction Gate

Implementation must preserve:

- high cohesion and low accidental coupling;
- explicit errors instead of silent catch paths;
- validation at boundaries;
- no domain logic hidden in UI, CLI, MCP or API adapters;
- no adapter dependency imported by core;
- dependency reuse justified by total cost, license, maintenance and security;
- repo-local naming and patterns.

Generic `utils`, `helpers` or catchall modules are rejected unless they have a
narrow domain owner.

### 6. Test And V&V Gate

Tests must be selected from the actual risk:

- unit tests for schema, lifecycle, ranking, parsing, validation and pure
  domain behavior;
- integration tests for command/runtime/API/MCP/CLI equivalence;
- workflow fixtures for PRD journeys;
- smoke tests for panel, MCP, WordPress and runtime entrypoints;
- recovery/security tests when data loss, secrets, external action or local
  server policy is touched.

Verification asks whether the implementation matches the specified contract.
Validation asks whether the result works for the intended Studio OS use.

### 7. Quality, Risk And Security Gate

Security and quality are not final checklists. They are transverse concerns.

At minimum, development work must consider:

- secret-shaped data rejection and redaction;
- path traversal and symlink escape;
- Host/Origin and local API boundary;
- stale confirmation replay;
- classification of private, public and confidential data;
- public claim evidence;
- backup or rollback for destructive/data changes.

If any item is relevant, it becomes a required verification item.

### 8. Configuration And Delivery Gate

Every change begins and ends with the correct repository state.

Required:

- correct Git root;
- dirty state classified;
- nested repos respected;
- diff reviewed;
- generated/derived files distinguished from source;
- package entrypoints and scripts verified when touched;
- release/publication remains behind prepared-action gates.

### 9. Operations And Recovery Gate

If a change affects runtime behavior, data, adapters, WordPress, backups,
doctor checks, sync or acceptance, it must expose:

- health signal;
- failure mode;
- recovery path;
- evidence artifact;
- handoff for the next agent.

### 10. Documentation, Memory And Evidence Gate

Documentation is required when it becomes source of truth, handoff, human
interface or audit evidence.

Rules:

- operational memory is not truth until promoted;
- decision records govern future action;
- evidence links claim, source, command/result and checksum when applicable;
- docs-as-code changes require freshness and drift awareness;
- do not dump chain-of-thought or chat history as documentation.

## Size And Modularity Thresholds

Line count is a signal, not the architecture.

Authored source files use these thresholds:

- preferred module: 200-320 lines;
- acceptable normal range: 200-400 lines;
- orchestrator/facade target: under 200 lines;
- 400+ lines: pause and decide whether a split is needed;
- 450+ lines: no new feature work unless a split task or recorded exception
  exists;
- 800+ lines: active architecture problem;
- 1200+ lines: blocking debt for new UI, command, workflow or control
  complexity.

Exceptions:

- generated files;
- third-party vendor files;
- temporary deterministic fixtures;
- migration files explicitly marked as such;
- narrow lookup tables where splitting would reduce clarity.

An exception must name the owner, reason, review trigger and verification.

## Subagent Application

Every PRD or refactor subagent receives this method as required input.

An agent must declare:

- operating mode;
- owned write set;
- contracts it may change;
- gates it must satisfy;
- files it must not touch;
- verification commands;
- evidence and handoff path.

Parallel work is allowed only when architecture boundaries and write sets are
clear enough that agents are not competing for the same source of truth.

## Completion Criteria

A development increment is complete only when:

- the behavior contract is implemented;
- boundaries and dependencies are coherent;
- relevant tests or smokes passed;
- evidence is durable enough for a later agent;
- docs or decisions were updated when they govern future work;
- residual risks are explicit;
- Git status is understood.


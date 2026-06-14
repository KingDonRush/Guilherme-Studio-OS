# Topological Implementation Backlog

Status: implementation plan
Purpose: convert the specification into ordered, independently verifiable work

## Backlog Rules

- Tasks are ordered by dependency, not visual appeal.
- No task begins until its dependency evidence exists.
- A task may be split, but its contract cannot be weakened silently.
- Runtime implementation begins only after the required research decisions.
- Migration remains separate from runtime feature work.
- Each task produces code, tests, documentation, and evidence together.
- A completed dependency exposes a public contract; downstream tasks do not
  import its private implementation.

## Dependency Graph

```text
Research decisions
    |
Workspace bootstrap
    |
Schemas and configuration
    |
Canonical storage ---- Registry
    |                    |
Event store          Repository resolution
    \                    /
     SQLite projection
            |
      Core identity
            |
       Lifecycles
            |
   Authority and evidence
            |
     Prepared actions
            |
       Workflow slice
       /      |      \
     CLI     MCP   Local API
                      |
                    Panel
            |
          Adapters
            |
         Migration
```

## Milestone 0: Decision Closure

### M0-T01: Runtime and schema spike

- **Depends on:** approved specification.
- **Owns:** RP-001.
- **Output:** TypeScript/Node/Zod proof or documented rejection.
- **Checks:** schema to JSON Schema, YAML parse, shared invocation, executable
  packaging, cold start.
- **Evidence:** spike repository or isolated branch, command transcript,
  decision STUDIO-016.

### M0-T02: SQLite binding spike

- **Depends on:** M0-T01.
- **Owns:** RP-003.
- **Output:** chosen `ProjectionDatabase` implementation.
- **Checks:** clean install, 10,000-entity rebuild, interruption, upgrade,
  deterministic output.
- **Evidence:** benchmark and failure report, decision STUDIO-018.

### M0-T03: CLI parser spike

- **Depends on:** M0-T01.
- **Owns:** RP-002.
- **Output:** parser choice and typed command registration.
- **Checks:** nested help, JSON mode, exit codes, dry-run, handler isolation.
- **Evidence:** representative commands, decision STUDIO-017.

### M0-T04: MCP version spike

- **Depends on:** M0-T01.
- **Owns:** RP-004.
- **Output:** SDK version and transport decision.
- **Checks:** MCP Inspector, resource/tool/prompt, blocked command, redaction.
- **Evidence:** Inspector capture and decision STUDIO-019.

### Milestone exit

- Runtime, schema, CLI, SQLite, and MCP choices are accepted.
- Package and Node versions are pinned.
- No production architecture depends on a pre-alpha SDK surface.

## Milestone 1: Workspace and Contracts

### M1-T01: Initialize workspace

- **Depends on:** M0 exit.
- **Creates:** root package workspace, lint/test/typecheck scripts, package
  boundaries, build configuration.
- **Must not create:** panel UI, provider adapters, domain behavior.
- **Checks:** clean install, reproducible scripts, dependency graph baseline.
- **Evidence:** CI/local command results.

### M1-T02: Implement common schema envelope

- **Depends on:** M1-T01.
- **Creates:** metadata, IDs, timestamps, classification, relation, extension,
  money, path, URL schemas.
- **Checks:** valid/invalid fixtures, deterministic serialization, JSON Schema
  export.
- **Evidence:** contract test suite.

### M1-T03: Implement core entity schemas

- **Depends on:** M1-T02.
- **Creates:** all entity contracts in
  [Core Schema Contracts](../schemas/01-core-contracts.md).
- **Checks:** minimum and complete fixture per entity, secret rejection,
  relation constraints.
- **Evidence:** generated schema catalog.

### M1-T04: Implement command, event, gate, evidence, and action schemas

- **Depends on:** M1-T02.
- **Creates:** transport-independent operation contracts.
- **Checks:** idempotency key rules, exact-payload checksum, result envelope,
  event validation.
- **Evidence:** shared interface fixtures.

### M1-T05: Implement Studio configuration

- **Depends on:** M1-T02.
- **Creates:** root discovery, runtime paths, operator identity, enabled
  adapters, schema support.
- **Checks:** nested invocation, invalid root, missing config, no secret fields.
- **Evidence:** config fixture matrix.

### M1-T06: Implement validation command bootstrap

- **Depends on:** M1-T03, M1-T04, M1-T05, M0-T03.
- **Creates:** read-only `studio validate`.
- **Checks:** scans fixture workspace, reports stable errors, JSON output.
- **Evidence:** first usable CLI command.

### Milestone exit

Another agent can add a new entity schema and fixture without changing storage
or interface code.

## Milestone 2: Canonical Storage and Registry

### M2-T01: Canonical path resolver

- **Depends on:** M1-T05.
- **Creates:** normalized root-relative paths, external path registration,
  symlink boundary checks.
- **Checks:** traversal, symlink escape, Unicode/space paths, missing target.

### M2-T02: Canonical record repository

- **Depends on:** M1-T03, M2-T01.
- **Creates:** read, list, stage, validate, atomic single-record write.
- **Checks:** interrupted write preserves prior content; revision conflict.

### M2-T03: Transaction manifests and scoped locks

- **Depends on:** M2-T02.
- **Creates:** multi-record operation manifest, entity locks, stale-lock
  inspection, recovery state.
- **Checks:** simulated crash at each stage, no blind lock deletion.

### M2-T04: Event store

- **Depends on:** M1-T04, M2-T03.
- **Creates:** append-only typed events and correlation indexes.
- **Checks:** correction event, concurrent append, secret redaction.

### M2-T05: Global entity registry

- **Depends on:** M2-T02.
- **Creates:** ID-to-path lookup, duplicate detection, move/update operation.
- **Checks:** immutable ID through path change, broken references.

### M2-T06: Repository and environment registry

- **Depends on:** M2-T01, M2-T05.
- **Creates:** repository/environment registration and resolution contracts.
- **Checks:** expected Git root, external ownership, path mismatch.

### M2-T07: SQLite projection

- **Depends on:** M0-T02, M2-T04, M2-T05.
- **Creates:** projection schema, full rebuild, incremental projection,
  projection metadata.
- **Checks:** delete/rebuild, duplicate ID failure, stale checksum, atomic
  promotion.

### M2-T08: Storage doctor and sync

- **Depends on:** M2-T03, M2-T07.
- **Creates:** `studio doctor` storage checks and `studio sync --rebuild`.
- **Checks:** incomplete transaction repair, invalid canonical record, stale
  projection.

### Milestone exit

- Canonical records survive failed writes.
- Registry resolves stable IDs.
- SQLite can be deleted and rebuilt.
- No lifecycle logic exists in storage.

## Milestone 3: Studio Core

### M3-T01: Identity and entity service

- **Depends on:** M2 exit.
- **Creates:** ID generation, create/update/archive/relation use cases.
- **Checks:** collision, revision conflict, archive policy, event emission.

### M3-T02: Lifecycle engine

- **Depends on:** M3-T01.
- **Creates:** transition registry, preconditions, state queries.
- **Checks:** every lifecycle fixture, invalid transition, side state recovery.

### M3-T03: Actor and capability model

- **Depends on:** M3-T01.
- **Creates:** human, agent, CLI, panel, automation, and adapter actor contracts.
- **Checks:** expired delegation, classification ceiling, default deny.

### M3-T04: Gate engine

- **Depends on:** M3-T02, M3-T03.
- **Creates:** allow/warn/confirmation/block outcomes and gate catalog.
- **Checks:** interface-independent result, hard gate cannot be downgraded.

### M3-T05: Evidence service

- **Depends on:** M3-T01.
- **Creates:** evidence registration, checksum, reliability, claim and
  transition evaluation.
- **Checks:** mutable source, missing evidence, public claim requirement.

### M3-T06: Prepared-action service

- **Depends on:** M3-T04, M3-T05.
- **Creates:** prepare, revise, confirm, expire, execute-state, reconcile.
- **Checks:** payload edit invalidates confirmation; replay and expiration fail.

### M3-T07: Economic next-action resolver

- **Depends on:** M3-T02, M3-T05.
- **Creates:** explainable ranking with hard obligation protection.
- **Checks:** forecast versus confirmed value, human override, blocked item.

### M3-T08: First vertical workflow

- **Depends on:** M3-T06.
- **Scope:** Task plus Evidence lifecycle.
- **Flow:** create task, start, submit verification, attach evidence, complete.
- **Checks:** all core services, events, projection, dry-run.
- **Evidence:** end-to-end core test without interface.

### Milestone exit

Another agent can implement a new domain use case by composing core services
without touching filesystem internals or UI.

## Milestone 4: CLI

### M4-T01: CLI shell and output

- **Depends on:** M0-T03, M3-T08.
- **Creates:** global flags, result rendering, JSON, exit codes, help.

### M4-T02: Workspace commands

- **Depends on:** M4-T01, M2-T08.
- **Creates:** `inspect`, `status`, `validate`, `doctor`, `sync`.

### M4-T03: Entity command registry

- **Depends on:** M4-T01, M3-T01.
- **Creates:** typed resource commands without generic lifecycle-erasing CRUD.

### M4-T04: Protected action commands

- **Depends on:** M4-T01, M3-T06.
- **Creates:** prepare, inspect, confirm, execute, reconcile.

### M4-T05: Repository commands

- **Depends on:** M2-T06, adapter contract only.
- **Creates:** read-only register/inspect/health before Git mutations.

### M4-T06: CLI journey fixtures

- **Depends on:** M4-T02 through M4-T05.
- **Checks:** drive eight workflows with fakes or local fixtures.

### Milestone exit

CLI is the complete operator fallback before MCP or panel exists.

## Milestone 5: MCP

### M5-T01: MCP package and context resources

- **Depends on:** M0-T04, M4 contract stability.
- **Creates:** Constitution, schemas, entities, context packs, repo health.

### M5-T02: Read tools

- **Depends on:** M5-T01.
- **Creates:** scoped entity, next-action, validation, and repository tools.

### M5-T03: Mutation and protected-action tools

- **Depends on:** M5-T02, M3-T06.
- **Creates:** typed dry-run/mutation/preparation calls.
- **Checks:** no self-confirmation, no raw secrets, no arbitrary path/shell.

### M5-T04: Workflow prompts

- **Depends on:** M5-T01.
- **Creates:** canonical prompts for qualification, delivery, visual diagnosis,
  case seeding, application, and handoff.

### M5-T05: MCP Inspector suite

- **Depends on:** M5-T02 through M5-T04.
- **Checks:** schemas, annotations, blocked action, redaction, error semantics.

## Milestone 6: Local API and Panel

### M6-T01: Loopback local API

- **Depends on:** M3 core stable, RP-005 closure.
- **Creates:** session launch, origin/host checks, query and command routes.

### M6-T02: Projection query services

- **Depends on:** M2-T07.
- **Creates:** economic summary, pipelines, next actions, repository health.

### M6-T03: Panel shell and navigation

- **Depends on:** M6-T01, M6-T02.
- **Creates:** accessible operational shell, not a marketing page.

### M6-T04: Economic dashboard

- **Depends on:** M6-T03.
- **Creates:** obligations, revenue, engagements, applications, next actions.

### M6-T05: Domain detail views

- **Depends on:** M6-T03.
- **Creates:** entity relationships, evidence, canonical source, history.

### M6-T06: Mutation and confirmation review

- **Depends on:** M6-T05, M3-T06.
- **Creates:** before/after preview and exact prepared-action approval.

### M6-T07: Diagnostics and recovery views

- **Depends on:** M6-T03, M2-T08.
- **Creates:** validation, projection, backup, and repository health.

### M6-T08: Panel security test

- **Depends on:** M6-T01 through M6-T07.
- **Checks:** loopback, Host/Origin, CSRF, session expiry, path rejection.

## Milestone 7: Adapters

### M7-T01: Adapter contract

- **Depends on:** M3-T06.
- **Creates:** typed read/local mutation/external effect boundaries.

### M7-T02: Git adapter

- **Depends on:** M2-T06, M7-T01.
- **Starts with:** inspect and status only.
- **Mutation expansion:** separate high-risk task after read behavior is stable.

### M7-T03: Docker and WordPress adapter

- **Depends on:** RP-009 closure, M7-T01.
- **Creates:** environment inspect/start/stop/health/wp/backup/restore.

### M7-T04: GitHub adapter

- **Depends on:** M7-T01, M3-T06.
- **Creates:** repository metadata read, prepared issue/PR/release actions.

### M7-T05: Communication adapter test harness

- **Depends on:** RP-011 closure, M7-T01.
- **Creates:** non-production prepare/confirm/execute/reconcile proof.

### M7-T06: Backup coordinator

- **Depends on:** M7-T02, M7-T03, RP-008 closure.
- **Creates:** component manifest, checksums, restore rehearsal.

## Milestone 8: Domain Expansion

Implement in this dependency order:

1. Clients and relationship identity.
2. Opportunities, proposals, and communications.
3. Engagements, deliverables, projects, and finance.
4. Products, releases, repositories, and evidence.
5. Portfolio cases.
6. Marketing content and campaigns.
7. Job applications and interviews.
8. Agent runs, handoffs, and learning promotion.

Each domain:

- adds schemas;
- adds core use cases;
- adds CLI commands;
- adds MCP resources/tools;
- adds panel views only after CLI behavior;
- adds journey fixtures.

## Milestone 9: Current Root Migration

Execute [Migration Plan](../migration/02-migration-plan.md) only after:

- registry and repository inspection work;
- backup and restore work;
- schemas validate current records;
- CLI remains available without panel;
- migration branch and checkpoints exist.

Migration phases remain independently reversible.

## Milestone 10: Operational Acceptance

### Full-system tests

- eight cross-domain journeys;
- secret incident;
- canonical crash recovery;
- SQLite deletion/rebuild;
- nested Git root mismatch;
- WordPress alternate-path restore;
- MCP blocked action;
- panel exact-payload confirmation;
- new-agent handoff.

### Economic acceptance

- current active work represented;
- current applications represented;
- current repositories registered;
- next actions visible;
- no required workflow depends on oral rebrief;
- Studio operation consumes less coordination time than the manual baseline.

## First Implementation Slice

The first safe implementation slice is:

```text
Workspace
→ common schemas
→ Task/Evidence schemas
→ canonical store
→ event store
→ SQLite projection
→ Task/Evidence core workflow
→ `studio task` and `studio evidence`
→ validation and rebuild
```

It proves the architecture without prematurely implementing CRM, finance,
WordPress adapters, MCP, or the panel.

## Backlog Completion Rule

A task is complete only when:

- its public contract exists;
- tests cover success and failure;
- evidence is recorded;
- docs reflect actual behavior;
- downstream dependencies can consume it without importing internals;
- no unresolved secret, migration, or repository-boundary risk is hidden.

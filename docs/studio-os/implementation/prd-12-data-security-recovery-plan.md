# PRD 12 Implementation Plan: Data, Security, Backup, and Recovery

Status: ready for implementation planning
Current harness estimate: 55%
Primary owner: `packages/storage`, `packages/adapters`, security checks

## Objective

Keep Studio data private, valid, portable, recoverable and auditable while
allowing human-readable versioned operations.

## Current Reality

Exists:

- canonical YAML validation;
- atomic-ish storage tests and transaction recovery;
- SQLite projection rebuild;
- repository health;
- backup manifest;
- WordPress DB/uploads backup and restore-check helpers;
- Host/Origin checks;
- prepared-action expiry/replay tests.

Gaps:

- secret-shaped rejection is not complete across all write paths;
- field classification is not deep enough for every domain;
- backup does not yet prove complete restore rehearsal for all components;
- symlink/path traversal coverage must remain broad;
- security monitoring is not a first-class `studio security` surface.

## Required Capabilities

- validate every canonical record against schema;
- reject secret-shaped fixtures before write and before commit;
- support explicit false-positive override through decision and local secure
  reference;
- deterministic SQLite delete/rebuild;
- backup root, private no-remote repos, WordPress DB/uploads and manifest;
- restore into clean alternate path and validate;
- panel loopback protection;
- stale confirmation replay fail-closed.

## Preferred Write Set

- `packages/storage/src/`
- `packages/adapters/src/backup*`
- `packages/adapters/src/wordpress*`
- `packages/core/src/security/`
- `packages/cli/src/commands/security.ts`
- `packages/local-api/src/`
- recovery/security tests.

## Cross-PRD Dependencies

- All PRDs depend on classification and secret safety.
- PRD 03 depends on WordPress backup/restore.
- PRD 04 depends on private repository recovery.
- PRD 10 depends on safe context packs.
- PRD 11 depends on panel/MCP transport security.

## Tests

- secret-shaped fixture rejected;
- false-positive secret requires decision/local reference;
- path traversal and symlink escape blocked;
- invalid write preserves original canonical file;
- SQLite deletion and rebuild deterministic;
- backup manifest lists all registered components;
- restore rehearsal validates alternate path and WordPress environment;
- Host/Origin and stale confirmation replay fail closed.

## Acceptance

- canonical Git never stores secrets;
- SQLite is disposable;
- backup age without restore rehearsal is not treated as sufficient proof;
- recovery produces durable evidence.


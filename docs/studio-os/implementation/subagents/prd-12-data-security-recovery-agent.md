# PRD 12 Agent Packet: Data, Security And Recovery

Wave: 1
Branch: `codex/prd-12-security-recovery`

## Objective

Move PRD 12 to `capability_complete` for classification, secret rejection,
path traversal/symlink safety, canonical write recovery, SQLite rebuild,
backup manifests, restore rehearsal and security gates.

## Read First

- `docs/studio-os/prds/12-data-security-recovery.md`
- `docs/studio-os/security/01-security-privacy.md`
- `docs/studio-os/implementation/prd-12-data-security-recovery-plan.md`
- `docs/studio-os/implementation/capability-matrices/prd-12-data-security-recovery-matrix.md`

## Allowed Write Set

- `packages/schemas/src/security.ts`
- `packages/schemas/src/classification.ts`
- `packages/storage/src/**`
- `packages/core/src/recovery/**`
- `packages/core/src/commands/handlers/governance.ts` recovery decision/handoff slice until recovery handlers are split
- `packages/core/src/commands/registry.ts` registration entries only
- `packages/cli/src/commands/operations.ts` backup/recovery command slice only
- `packages/local-api/src/security.ts`
- `apps/panel/src/views/control.tsx` diagnostics/recovery slice only

## Shared Contracts Owned

- field classification policy;
- secret-shaped fixture rejection;
- backup manifest shape;
- restore rehearsal evidence;
- stale lock and crash recovery semantics;
- Host/Origin policy for local panel/API.

## Must Not Do

- Do not print secrets in logs or test snapshots.
- Do not permit path traversal or symlink escape to pass as a valid workflow.
- Do not make backups appear successful without checksum and restore evidence.

## Verification

- security tests: secret-shaped fixture, path traversal, symlink escape,
  Host/Origin and stale confirmation replay;
- recovery tests: crash write, stale lock, SQLite delete/rebuild, backup
  manifest, restore check;
- `studio sync --rebuild --verify` passes.

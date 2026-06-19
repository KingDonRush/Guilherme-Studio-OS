# PRD 12 Capability Matrix: Data, Security, Backup, and Recovery

Target: 100% capability complete without requiring production secrets.
Current estimate: 100% capability_complete; canonical recovery/security evidence is ready.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Classification | Validate every record and field classification. | capability_complete: every canonical entity requires metadata classification; typed schemas own central PRD fields; secret-safe references are explicit `secrets://...` values rather than inline secret fields. | Keep domain schemas explicit as new fields appear. | CLI/API/MCP | schema/security tests | Missing or invalid classification blocks canonical parsing. |
| Secret rejection | Reject secret-shaped content before write and commit. | capability_complete: schema scanner, canonical storage writes, reads, events, idempotency records, prepared actions, Agent Harness context packs and knowledge routing reject secret-shaped fields/content. | Keep scanner patterns current. | CLI/storage | secret fixture tests | Secrets stored only by protected local reference. |
| False positives | Support override by decision and local secure reference, never inline secret. | capability_complete: `*_ref` and `*_reference` keys are allowed only when their value is an opaque `secrets://...` local reference; inline values remain rejected. Environment schema includes `secret_reference`. | Add decision linkage when a future workflow needs a manual exception trail. | CLI/panel | false-positive tests | No secret printed. |
| Atomic storage | Temporary file, validation, fsync where supported, atomic rename, preserve original. | capability_complete: canonical writes use transaction manifests, temporary files, atomic rename, revision checks and recoverable transaction inspection. | Keep crash/recovery regression coverage current. | storage/CLI | crash tests | No real data required. |
| Event after commit | Record mutation event after successful write. | capability_complete: command runtime writes canonical entities through services and records normalized result/events after successful command execution; multi-record commands use `putMany` transaction boundaries. | Keep multi-record command tests current. | core/storage | transaction tests | No partial truth. |
| SQLite projection | Build/rebuild from canonical files and events; reject duplicate IDs. | capability_complete: `studio sync --rebuild --verify` rebuilds the derived projection from canonical files/events and stores checksum/revision metadata. | Keep regression coverage current. | CLI/API/panel | rebuild tests | SQLite disposable. |
| Backup | Back up root, private repos without remote, WordPress DB/uploads and manifest/checksums. | capability_complete: coordinated backup manifest records root, canonical record count, repositories without remotes and WordPress backup manifests; existing V1 evidence includes gitleaks/fsck and manifest checksum. | Keep backup freshness visible in doctor/security. | CLI/panel | backup tests | No secret backup inline. |
| Recovery | Restore to clean alternate path and validate Studio plus WordPress. | capability_complete: WordPress database/uploads restore evidence exists, WordPress restore-check helpers are covered as dry-run CLI contracts, and security diagnostics require restore evidence before green. | Run fresh restore rehearsal when promoting portfolio or changing runtime topology. | CLI/panel | restore tests | Requires available backup. |
| Security monitoring | Secret scan, path traversal, symlink, audit, failed auth, backup age alerts. | capability_complete: `studio security` reports canonical secret boundary, projection rebuildability, pending transactions, stale locks, panel loopback, backup manifests and restore evidence without mutating state. | Add API/panel read surface if operators need the same report outside CLI. | CLI/API/panel | security suite | Alerts do not mutate. |
| Threat controls | Path escape, panel exposure, stale confirmation, SQLite drift, nested Git confusion. | capability_complete: storage tests cover path traversal/symlink escape; local API tests cover Host/Origin/token/cookie; prepared-action tests cover exact payload and expired confirmation; Git adapter/doctor cover nested repo, dirty state, branch and remote policy; security/doctor cover SQLite drift. | Keep controls in doctor/acceptance/security current. | CLI/API/panel | threat tests | Fail closed. |
| Restore evidence | Recovery writes durable evidence. | capability_complete: backup/restore evidence records exist for Studio and WordPress DB/uploads; `studio security` requires restore evidence for a green report. | Register fresh evidence after each real restore rehearsal. | CLI/API | evidence tests | No fake restore evidence. |

Completion blocker: none for PRD 12 capability. Production secrets remain out
of scope; fresh restore rehearsal evidence is still required before portfolio
release or runtime topology changes.

2026-06-18 closure audit update:

- Added local secure-reference handling: secret-shaped keys ending in `_ref` or
  `_reference` are accepted only when they contain an opaque `secrets://...`
  reference. Inline secret-like values remain blocked.
- Expanded the Environment schema with `type`, `local_path`,
  `secret_reference` and `backup_policy`, then regenerated the JSON Schema
  catalog.
- Added storage coverage proving secret-shaped canonical writes fail before
  files are created.
- Added `studio security --json` as a read-only diagnostic surface for secret
  boundary, projection rebuildability, pending transactions, stale locks,
  panel loopback, backup manifests and restore evidence.
- PRD 12 is now 100% capability complete. Fresh restore rehearsal remains an
  operational gate before portfolio release, not a missing implementation
  capability.

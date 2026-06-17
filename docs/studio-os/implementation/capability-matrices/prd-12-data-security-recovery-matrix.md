# PRD 12 Capability Matrix: Data, Security, Backup, and Recovery

Target: 100% capability complete without requiring production secrets.
Current estimate: 55%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Classification | Validate every record and field classification. | partial | Add deeper field classification map per domain. | CLI/API/MCP | schema/security tests | Missing classification blocks sensitive write. |
| Secret rejection | Reject secret-shaped content before write and commit. | partial | Add secret scanner to canonical writes and precommit command. | CLI/storage | secret fixture tests | Secrets stored only by protected local reference. |
| False positives | Support override by decision and local secure reference, never inline secret. | missing | Add secure reference schema and decision link. | CLI/panel | false-positive tests | No secret printed. |
| Atomic storage | Temporary file, validation, fsync where supported, atomic rename, preserve original. | partial | Expand crash matrix and fsync documentation. | storage/CLI | crash tests | No real data required. |
| Event after commit | Record mutation event after successful write. | partial | Ensure transaction/event ordering across multi-record commands. | core/storage | transaction tests | No partial truth. |
| SQLite projection | Build/rebuild from canonical files and events; reject duplicate IDs. | complete | Keep regression coverage current. | CLI/API/panel | rebuild tests | SQLite disposable. |
| Backup | Back up root, private repos without remote, WordPress DB/uploads and manifest/checksums. | partial | Complete registered component inventory and freshness checks. | CLI/panel | backup tests | No secret backup inline. |
| Recovery | Restore to clean alternate path and validate Studio plus WordPress. | partial | Add coordinated restore rehearsal command. | CLI/panel | restore tests | Requires available backup. |
| Security monitoring | Secret scan, path traversal, symlink, audit, failed auth, backup age alerts. | partial | Add `studio security` diagnostics surface. | CLI/API/panel | security suite | Alerts do not mutate. |
| Threat controls | Path escape, panel exposure, stale confirmation, SQLite drift, nested Git confusion. | partial | Keep controls in doctor/acceptance and expand tests. | CLI/API/panel | threat tests | Fail closed. |
| Restore evidence | Recovery writes durable evidence. | partial | Add evidence registration from restore rehearsal. | CLI/API | evidence tests | No fake restore evidence. |

Completion blocker: backup exists, but full recovery rehearsal and secret
governance must be closed.


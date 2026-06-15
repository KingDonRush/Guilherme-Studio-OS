# Studio OS V1 Completion Matrix

Status: active execution ledger
Updated: 2026-06-14

This matrix connects normative requirements to implementation, verification and
evidence. A row is complete only when code, automated verification and durable
evidence exist.

| Area | Normative source | Implementation owner | Acceptance | Status |
|---|---|---|---|---|
| Entity and relation contracts | schemas/01 | `packages/schemas` | Versioned catalog and valid fixtures | in progress |
| Commands, results and events | architecture/03 | `packages/schemas`, `packages/core` | CLI, MCP and API equivalence | in progress |
| Authority and gates | security/01 | `packages/core` | Default deny and capability tests | in progress |
| Prepared actions | architecture/03 | `packages/core` | Exact confirmation, execution and reconciliation | in progress |
| Canonical transactions | architecture/01 | `packages/storage` | Crash recovery and revision conflict tests | in progress |
| Derived projection | architecture/01 | `packages/storage` | Delete/rebuild/verify with matching checksum | in progress |
| Economic next actions | PRD 01 and 02 | `packages/core` | Explainable ranked obligations | pending |
| Domain lifecycles | ontology and PRDs | `packages/core` | Semantic command and invalid transition tests | in progress |
| CLI | architecture/03 | `packages/cli` | Required grammar, flags and stable exit codes | in progress |
| MCP | architecture/03 | `packages/mcp` | Resources, governed tools, prompts and Inspector | in progress |
| Local API | architecture/03 | `packages/local-api` | Loopback security and shared command execution | in progress |
| Panel | architecture/03 | `apps/panel` | Economic, work, distribution and control views | in progress |
| Git adapter | architecture/04 | `packages/adapters` | Root, branch, remote and dirty-state diagnostics | in progress |
| WordPress adapter | architecture/04 | `packages/adapters` | Start, stop, health, WP-CLI, backup and restore | in progress |
| GitHub adapter | PRD 11 | `packages/adapters` | Disabled-by-default fake-provider acceptance | pending |
| Communication adapter | PRD 11 | `packages/adapters` | No send without exact confirmation | pending |
| Coordinated backup | architecture/04 | `packages/adapters` | Checksummed manifest and restore rehearsal | in progress |
| Eight journeys | workflows/01 | `packages/testing` | Deterministic fixtures pass through interfaces | in progress |
| Physical migration | migration/02 | root coordinator | Four independent repositories and final rename | in progress |
| V1 acceptance | operations/04 | cross-package | Full verification suite and evidence pack | pending |

## Completion Rule

- `pending`: no accepted implementation evidence.
- `in progress`: implementation exists but one or more normative checks remain.
- `complete`: code, tests, operator verification and durable evidence all pass.
- Canonical business data is never fabricated to make a workflow green.
- Fixture verification and canonical coverage audit are reported separately.

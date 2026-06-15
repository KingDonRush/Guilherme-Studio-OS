# Studio OS PRD Completion Matrix

Status: active execution ledger
Updated: 2026-06-15

This matrix connects normative requirements to implementation, verification,
evidence, and remaining gaps. A row is complete only when code, automated
verification, operator verification, documentation, and durable evidence exist.

| Area | Owner | Status | Evidence | Verification command | Remaining gap |
|---|---|---|---|---|---|
| Entity and relation contracts | `packages/schemas` | in progress | schema tests and generated catalog | `npm run test -- packages/schemas/src/index.test.ts` | complete per-domain fixtures and reduce practical dependence on generic catchall fields |
| Commands, results and events | `packages/schemas`, `packages/core` | in progress | command runtime tests | `npm run test -- packages/core/src/command-runtime.test.ts` | broaden CLI/API/MCP equivalence fixtures across all PRD workflows |
| Authority and gates | `packages/core` | in progress | core governance tests | `npm run test -- packages/core/src/index.test.ts` | encode domain preconditions and gate catalog fixtures |
| Prepared actions | `packages/core` | in progress | exact checksum confirmation tests | `npm run test -- packages/core/src/index.test.ts` | panel exact-payload review and stale payload UI flow |
| Canonical transactions | `packages/storage` | in progress | storage transaction tests | `npm run test -- packages/storage/src/index.test.ts` | expand crash/recovery matrix and event replay evidence |
| Derived projection | `packages/storage` | in progress | rebuild checksum verification | `npm run studio -- sync --rebuild --verify --json` | expose stale projection recovery in panel/API diagnostics |
| Economic next actions | `packages/core` | in progress | economic resolver tests | `npm run test -- packages/core/src/economics.test.ts` | domain-specific obligation ranking and intake-aware gaps |
| Domain lifecycles | `packages/core` | in progress | lifecycle and semantic command tests | `npm run test -- packages/core/src/index.test.ts` | implement preconditions for every PRD lifecycle |
| CLI | `packages/cli` | in progress | command help and runtime tests | `npm run studio -- --help` | complete semantic command grammar and stable exit tests |
| MCP | `packages/mcp` | in progress | MCP smoke from V1 evidence | `npm run build -w @guilherme-studio/mcp` | add prompts/context packs and PRD coverage resource smoke |
| Local API | `packages/local-api` | in progress | local API tests | `npm run test -- packages/local-api/src/index.test.ts` | cover every mutating route through command runtime |
| Panel | `apps/panel` | in progress | build and Playwright smoke from V1 evidence | `npm run build -w @guilherme-studio/panel` | domain views, exact-payload review, coverage and intake views |
| Git adapter | `packages/adapters` | in progress | repository health inspection | `npm run studio -- repo inspect --json` | explicit root mismatch and package script evidence |
| WordPress adapter | `packages/adapters` | in progress | WordPress health/restore evidence | `npm run studio -- wordpress health --json` | alternate-path restore evidence and provision/register template |
| GitHub adapter | `packages/adapters` | in progress | disabled adapter contract test | `npm run test -- packages/adapters/src/index.test.ts` | provider interface and fake prepare/confirm/reconcile flow |
| Communication adapter | `packages/adapters` | in progress | disabled adapter contract test | `npm run test -- packages/adapters/src/index.test.ts` | provider interface and fake prepare/confirm/reconcile flow |
| Coordinated backup | `packages/adapters` | in progress | backup manifests | `npm run studio -- backup --json` | restore rehearsal that reports all registered components |
| Eight journeys | `packages/testing`, `packages/core` | in progress | workflow fixture check | `npm run studio -- workflow --fixtures --json` | executable CLI/API/MCP journey fixtures, not only kind coverage |
| Physical migration | root coordinator | in progress | renamed root and repository status | `npm run studio -- doctor --json` | path drift check green after final commit |
| PRD coverage and intake | `packages/core`, interfaces | in progress | coverage command and intake packet | `npm run studio -- coverage --json` | canonical records for PRDs with real data, collected through intake |
| Operational acceptance | cross-package | in progress | V1 acceptance evidence and reconciliation evidence | full final gate command set | every row complete or explicitly deferred by decision |

## Completion Rule

- `pending`: no accepted implementation evidence.
- `in progress`: implementation exists but one or more normative checks remain.
- `complete`: code, tests, operator verification and durable evidence all pass.
- Canonical business data is never fabricated to make a workflow green.
- Fixture verification and canonical coverage audit are reported separately.

## Acceptance Reconciliation

On 2026-06-15, `tsk_20260614_bootstrap-studio-os-vertical` was transitioned to
`done` after current verification passed and durable evidence was registered.

Evidence:

- `evd_20260615_studio-os-v1-acceptance-verification`;
- `evd_20260615_studio-os-v1-acceptance-reconciliation-verification`.

The bootstrap task is complete. The PRD completion work remains active until
this ledger has no `pending` rows and every `in progress` row is either
`complete` or explicitly deferred by a decision record.

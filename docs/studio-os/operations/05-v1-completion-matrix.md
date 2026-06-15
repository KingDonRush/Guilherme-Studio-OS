# Studio OS PRD Completion Matrix

Status: active execution ledger
Updated: 2026-06-15

This matrix connects normative requirements to implementation, verification,
evidence, and remaining gaps. A row is complete only when code, automated
verification, operator verification, documentation, and durable evidence exist.

| Area | Owner | Status | Evidence | Verification command | Remaining gap |
|---|---|---|---|---|---|
| Entity and relation contracts | `packages/schemas` | in progress | schema tests, generated catalog and `evd_20260615_prd-gates-and-coverage-verification` | `npm run test -- packages/schemas/src/index.test.ts` | complete per-domain workflow fixtures and keep new PRD fields covered by fixtures |
| Commands, results and events | `packages/schemas`, `packages/core` | in progress | command runtime tests; `evd_20260615_prd-semantic-command-slice-verification`; `evd_20260615_executable-workflow-fixtures-verification` | `npm run test -- packages/core/src/command-runtime.test.ts` | broaden API/MCP equivalence fixtures across all PRD workflows |
| Authority and gates | `packages/core` | in progress | gate catalog tests and `evd_20260615_prd-gates-and-coverage-verification` | `npm run test -- packages/core/src/index.test.ts` | connect every gate to executable workflow fixtures and acceptance report |
| Prepared actions | `packages/core` | in progress | exact checksum confirmation tests | `npm run test -- packages/core/src/index.test.ts` | panel exact-payload review and stale payload UI flow |
| Canonical transactions | `packages/storage` | in progress | storage transaction tests | `npm run test -- packages/storage/src/index.test.ts` | expand crash/recovery matrix and event replay evidence |
| Derived projection | `packages/storage` | in progress | rebuild checksum verification | `npm run studio -- sync --rebuild --verify --json` | expose stale projection recovery in panel/API diagnostics |
| Economic next actions | `packages/core` | in progress | economic resolver tests | `npm run test -- packages/core/src/economics.test.ts` | domain-specific obligation ranking and intake-aware gaps |
| Domain lifecycles | `packages/core` | in progress | lifecycle preconditions and semantic command tests; `evd_20260615_prd-semantic-command-slice-verification` | `npm run test -- packages/core/src/index.test.ts` | complete remaining domain-specific preconditions and fixture coverage |
| CLI | `packages/cli` | in progress | semantic command smoke; CLI equivalence tests; `evd_20260615_executable-workflow-fixtures-verification` | `npm run test -- packages/cli/src/index.test.ts` | add stable exit tests for every semantic command |
| MCP | `packages/mcp` | in progress | MCP semantic tools build; `evd_20260615_prd-semantic-command-slice-verification` | `npm run build -w @guilherme-studio/mcp` | add context-pack prompts and MCP Inspector smoke transcript |
| Local API | `packages/local-api` | in progress | local API tests | `npm run test -- packages/local-api/src/index.test.ts` | cover every mutating route through command runtime |
| Panel | `apps/panel` | in progress | build and Playwright smoke; exact-payload review; `evd_20260615_prd-semantic-command-slice-verification` | `npm run build -w @guilherme-studio/panel` | complete domain-specific views and intake workflows |
| Git adapter | `packages/adapters` | in progress | repository health inspection; `evd_20260615_adapter-health-and-fake-provider-verification` | `npm run studio -- repo inspect --json` | policy decisions for registered nested WordPress/plugin repos |
| WordPress adapter | `packages/adapters` | in progress | WordPress health/restore evidence | `npm run studio -- wordpress health --json` | alternate-path restore evidence and provision/register template |
| GitHub adapter | `packages/adapters` | in progress | disabled and fake provider contract tests; `evd_20260615_adapter-health-and-fake-provider-verification` | `npm run test -- packages/adapters/src/index.test.ts` | reconcile fake-provider actions through prepared-action records |
| Communication adapter | `packages/adapters` | in progress | disabled and fake provider contract tests; `evd_20260615_adapter-health-and-fake-provider-verification` | `npm run test -- packages/adapters/src/index.test.ts` | reconcile fake-provider actions through prepared-action records |
| Coordinated backup | `packages/adapters` | in progress | backup manifests | `npm run studio -- backup --json` | restore rehearsal that reports all registered components |
| Eight journeys | `packages/testing`, `packages/core` | in progress | executable workflow fixture report and `evd_20260615_executable-workflow-fixtures-verification` | `npm run studio -- workflow --fixtures --execute --json` | add API/MCP smoke coverage over the executable workflow report |
| Physical migration | root coordinator | in progress | renamed root and repository status | `npm run studio -- doctor --json` | path drift check green after final commit |
| PRD coverage and intake | `packages/core`, interfaces | intake_required | coverage command, intake packet and `evd_20260615_prd-gates-and-coverage-verification` | `npm run studio -- coverage --json` | canonical records for PRDs with real data, collected through intake; capability coverage is separated from data readiness |
| Operational acceptance | cross-package | in progress | V1 acceptance evidence and reconciliation evidence | full final gate command set | every row complete or explicitly deferred by decision |

## Completion Rule

- `pending`: no accepted implementation evidence.
- `in progress`: implementation exists but one or more normative checks remain.
- `complete`: code, tests, operator verification and durable evidence all pass.
- `deferred_by_decision`: intentionally not implemented yet and linked to a decision record.
- `intake_required`: capability exists, but real canonical data is absent and must not be fabricated.
- Terminal acceptance uses only `complete`, `deferred_by_decision` or `intake_required`.
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

## Semantic Command Slice

On 2026-06-15, `tsk_20260615_implement-prd-semantic-command-slice` was created
and completed for the first PRD-domain command expansion.

Evidence:

- `evd_20260615_prd-semantic-command-slice-verification`.

Delivered capacity:

- CRM duplicate review defaults to relationship/pipeline entities only.
- Opportunity conversion can create linked client and engagement records.
- Contract, invoice and expected payment records can be created from the
  engagement/contract/invoice chain.
- Deliverable completion and release publication require supporting evidence.
- Campaign content and decisions can be prepared with proof links.
- MCP exposes semantic tools for duplicate review, conversion, finance,
  deliverable completion, content preparation and decision records.
- Panel prepared-action review shows exact JSON payload and checksum before
  local confirmation.

## Adapter Health and Fake Provider Slice

On 2026-06-15,
`tsk_20260615_implement-adapter-health-and-fake-provider-slice` was created and
completed for adapter diagnostics and fake-provider behavior.

Evidence:

- `evd_20260615_adapter-health-and-fake-provider-verification`.

Delivered capacity:

- Git repository health now reports git root, root mismatch, expected branch,
  expected branch violation, HEAD, nested repositories, package manager and
  package scripts.
- `studio doctor` treats root mismatch and expected branch violation as
  repository health failures.
- GitHub and communication adapters have an explicit fake provider interface.
- Fake providers are blocked by default and, when explicitly enabled, report
  local preparation with `external_send: false`.

## Gates and Coverage Contract Slice

On 2026-06-15,
`tsk_20260615_implement-prd-gates-and-coverage-slice` was created and completed
for PRD coverage, gate and claim-evidence contracts.

Evidence:

- `evd_20260615_prd-gates-and-coverage-verification`.

Delivered capacity:

- `studio coverage` separates capability completeness, canonical data readiness,
  intake-required PRDs and missing evidence.
- Core exposes a named gate catalog for duplicate review, missing evidence,
  public claims, external confirmation, payment/delivery, confidential data,
  destructive action, stale revision and restore requirements.
- Evidence validation checks public claims, file/screenshot/backup checksums,
  mutable source handling and subject mismatch.
- Schema catalog was regenerated after the new PRD contract fields were added.

## Executable Workflow Fixture Slice

On 2026-06-15, `tsk_20260615_implement-executable-workflow-fixtures`
was created and completed for executable PRD workflow fixtures.

Evidence:

- `evd_20260615_executable-workflow-fixtures-verification`.

Delivered capacity:

- `studio workflow --fixtures --execute --json` executes all eight normative
  journeys in temporary Studio roots.
- Each fixture uses real Studio command envelopes and produces entities, events
  and prepared actions where the workflow requires them.
- CLI tests compare dry-run output against the core command runtime envelope.

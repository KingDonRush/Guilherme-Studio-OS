# Studio OS Operating North Star

Status: planning authority for Studio OS operating direction
Purpose: turn the Praxis knowledge reading into a concrete operating doctrine
for all material Studio work without importing the Praxis method as a project
artifact.

## Source Reading

This direction is derived from reading the local Praxis knowledge library under
`../AI/MCPS/praxis/.praxis-knowledge/`.

Scope read for this decision:

- `00-life-cycle-and-systems-context`
- `01-business-analysis-and-value`
- `02-requirements-and-solution-definition`
- `03-systems-engineering`
- `04-software-engineering`
- `05-project-product-delivery-governance`
- `06-quality-risk-and-security`
- `07-delivery-operations-support-retirement`
- `08-knowledge-documentation-lifecycle-information`
- `09-methods-models-and-practices`
- `_meta`, `_research`, `_sources`, and `.praxis-knowledge/praxis-knowledge.md`

Inventory at reading time: 1091 Markdown files and 86563 lines under
`.praxis-knowledge`. Temporary digests were used only to navigate the corpus;
they are not Studio OS source of truth.

The useful conclusion is not "copy Praxis into Studio OS". The conclusion is:

```text
knowledge + Studio context -> situated operating direction
```

Praxis knowledge treats development and operation as lifecycle problems, not
just code-style problems. Therefore Studio OS work must be judged by system
role, boundaries, requirements, architecture, design, construction, tests,
quality, security, delivery, operations, documentation and evidence.

Praxis is used here as knowledge input. Studio OS PRDs, architecture contracts,
decisions, evidence and operating guides remain the project authority.

## Doctrine Scope

This document is not only about file size, modularization, cognitive load or
code. Those are downstream symptoms. The north star is the complete operating
doctrine that must be burned into Studio OS before broad AI-driven work
continues.

For Studio OS, "Praxis-based" means every material Studio task is forced to
carry the relevant parts of this lens:

| Praxis knowledge area | Studio OS must force the agent to answer |
|---|---|
| Life cycle and systems context | What system, product, service, repository, environment or lifecycle stage is this change touching? What process depth is proportional to risk? |
| Business analysis and value | What operational or economic outcome justifies the work? What value, cost of delay, stakeholder or business change is affected? |
| Requirements and solution definition | What requirement, constraint, acceptance criterion, traceability link or validation need controls the change? |
| Systems engineering | What is the system of interest, boundary, environment, interface, allocation and verification relationship? |
| Software engineering | What architecture, design, construction, testing, configuration, maintenance, security, quality and economic concern is being changed? |
| Product/project/delivery governance | What gate, backlog item, increment, readiness criterion, decision point or definition of done governs progress? |
| Quality, risk and security | What quality attribute, risk, misuse case, control, assurance evidence, compliance or privacy issue must be addressed? |
| Delivery, operations, support and retirement | How will the change be built, packaged, run, diagnosed, recovered, backed up, supported, rolled back or retired? |
| Knowledge, documentation and lifecycle information | What becomes source of truth, decision record, operational memory, evidence, handoff or documentation map? |
| Methods, models and practices | Which method, model, metric, evaluation, template or practice is selected, tailored, rejected or stopped for this context? |

If a task is small and reversible, most answers can be short. If a task is
material, public, cross-domain, data-bearing, security-sensitive, financial,
portfolio-signaling or agent-coordinated, the answers must become explicit
context-pack fields and gates.

The important point: Studio OS should not rely on an agent remembering this
doctrine. The harness should inject it into the run, request answers, block
missing critical answers, and preserve the result as evidence or handoff.

This applies to code, architecture, refactoring, WordPress work, portfolio
assets, visual design, product releases, marketing content, sales/proposals,
LinkedIn/career applications, finance records, backup/recovery, decisions,
documentation, prepared external actions and panel/MCP operations.

## System Classification

The Studio OS is a local-first operating harness for commercial, portfolio,
career, WordPress delivery, product and agent work.

It is not:

- a dashboard-first CRUD app;
- a public SaaS backend;
- a generic workflow engine;
- a generic CRM;
- a microservice platform;
- a codebase where "modular monolith" alone explains the architecture.

The correct type is:

```text
local-first modular coordinator
+ command-driven application core
+ canonical record store
+ derived projections
+ governed interfaces
+ provider adapters
+ agent harness loop
```

In ordinary architecture language, this remains a modular monolith. The
important part is the qualifier: modules are accepted only when they own a
responsibility, public interface, dependency rule and verification path.

## Operating Method

For material Studio OS work, the usable method is:

```text
classify the system role
-> locate the owner
-> protect existing behavior
-> change through the command/core boundary
-> verify with evidence
-> record the remaining gap
```

Applied in practice:

1. Classify the change: domain behavior, interface adapter, storage, external
   adapter, projection, recovery, panel view, test fixture, documentation,
   asset, WordPress runtime, public claim, communication, finance, career,
   portfolio or operational decision.
2. Locate the owner: PRD, package, module, canonical record and command surface.
3. Characterize current behavior before refactoring a shared file.
4. Split only by responsibility, lifecycle or provider boundary.
5. Add behavior behind `executeStudioCommand` when it mutates canonical state.
6. Keep evidence, gates and security in the behavior path, not in a later
   checklist.
7. End with verification output, updated matrix/evidence when relevant, and
   an explicit handoff or gap.

This is intentionally stricter than "make a clean codebase" and lighter than
importing a full external method. It is the Studio OS agent harness style:
small enough to execute, structured enough to stop agents from improvising
different systems.

The operating method becomes executable in the
[Self-Build Harness Bootstrap](./03-self-build-harness-bootstrap.md). That is
the first "playable while installing" slice: build the part of Studio OS that
lets agents use Studio OS to operate and build the rest under discipline.

## Architecture Direction

Keep one local coordinator runtime. Do not split into services for V1.

The desired shape is:

```text
schemas
  -> contracts only
core
  -> domain behavior, command runtime, gates, evidence, lifecycle, harness
storage
  -> canonical files, events, projection, locks, recovery
interfaces
  -> CLI, MCP, local API, panel adapters over core
adapters
  -> Git, WordPress, backup, provider fakes, external observations/actions
testing
  -> fixtures, interface equivalence, workflow evidence
```

Dependency direction must stay:

```text
interfaces -> core -> schemas
interfaces -> storage only for validation/read helpers already documented
adapters -> core/schemas only through typed contracts where needed
core -/-> adapters
core -/-> CLI/MCP/API/panel
storage -/-> domain decisions
panel -/-> canonical state
```

## Type And Contract Direction

The Studio OS should become more typed where the PRDs describe stable business
concepts, not more generic.

Direction:

- central PRD fields move into canonical schemas instead of living in
  `catchall`;
- command envelopes expose stable discriminated actions, expected revision,
  idempotency, dry-run and JSON results;
- interfaces parse and normalize inputs at the edge;
- core works with typed domain records, lifecycle rules, gates and evidence
  claims;
- adapters produce typed observations, health reports, prepared actions and
  reconciliation records;
- panel and MCP display exact payloads from records/commands instead of
  inventing local UI-only shapes;
- tests assert command/event equivalence across CLI, API and MCP.

Avoid:

- broad `Record<string, unknown>` for central PRD concepts;
- local copies of lifecycle state machines in CLI, MCP, API or panel;
- adapter-specific payloads leaking into core domain rules;
- stringly typed workflows with no command contract;
- "dashboard-ready" fake data replacing `intake_required`.

## Non-Negotiable Code Principles

These are the Studio-specific interpretation of the Praxis knowledge:

- Source of truth remains human-readable canonical records and audit events.
- SQLite remains derived and rebuildable.
- Every mutable path goes through the command runtime unless explicitly
  classified as local diagnostic or local adapter operation.
- Interfaces adapt payloads; they do not own domain decisions.
- Adapters observe or prepare side effects; they do not decide lifecycles.
- Domain services own behavior and must expose small use-case methods.
- Gates and evidence are part of behavior, not after-the-fact documentation.
- Tests are evidence for claims; tests are not the whole quality model.
- Security is a lifecycle concern: input, storage, output, paths, secrets,
  confirmation replay, host/origin and recovery.
- Documentation is required when it becomes source of truth, handoff, decision,
  audit record or interface for another agent.

## Line Count Policy

Praxis knowledge explicitly warns against treating lines of code as quality.
Line count is only a diagnostic signal.

The Studio OS rule is:

```text
do not split a file because it is long;
split it when length exposes multiple responsibilities, unclear ownership,
hard review, high merge conflict risk, weak test focus or unsafe agent edits.
```

When a file is large, inspect these before deciding:

- system role;
- primary responsibility;
- secondary responsibilities mixed in;
- public interface;
- private helpers;
- allowed dependencies;
- forbidden dependencies;
- ownership by PRD or package;
- tests that characterize behavior;
- evidence needed to prove behavior preservation.

For the current codebase, the large files that already show real architectural
risk are not risky merely because of line count. They are risky because they
are shared surfaces, adapter clusters, interface registries or multi-lifecycle
domain files.

## Current Hot Surfaces

Current authored source hotspots, excluding generated `dist` and test files:

| File | Lines observed | Architecture reading |
|---|---:|---|
| `packages/mcp/src/tools/mutations.ts` | 1658 | Tool registry plus many unrelated tool families. Should become a thin registry over owned mutation modules. |
| `packages/storage/src/index.ts` | 1083 | Canonical store, transactions, events, projection, migration and validation in one surface. PRD 12 should own extraction. |
| `packages/core/src/domains/sales.ts` | 912 | Prospect research, outreach review, opportunities, proposals, send/acceptance/conversion and negotiation in one domain surface. Split by sales lifecycle slices. |
| `packages/adapters/src/index.ts` | 911 | Git, WordPress, backup and fake provider behavior in one adapter surface. Split by provider/capability before PRD 03/04/12 parallel work. |
| `packages/core/src/harness/agent-harness.ts` | 734 | Run lifecycle, context packs, authorization, action records, verification and handoff in one harness file. Split when extending harness behavior. |
| `packages/core/src/domains/finance.ts` | 681 | Contract, invoice, payment, obligation and economic report behavior together. Split if PRD 09 grows. |
| `packages/core/src/domains/career.ts` | 603 | Role targeting, evidence fit, applications, submission and interview behavior together. Split if PRD 08 grows. |
| `packages/cli/src/commands/core.ts` | 580 | Health, validation, workflow, coverage, acceptance and diagnostics commands clustered. Split by operational command family. |
| `packages/cli/src/commands/domains/sales.ts` | 533 | Domain CLI shortcuts for many sales lifecycle actions. Split only after core sales slices are stable. |
| `apps/panel/src/views/crm.tsx` | 452 | View, command forms and domain tables mixed. Split if CRM view gains workflow detail. |

These are not all urgent. They are the map of where future work will create
conflicts if agents continue adding behavior directly.

## Refactor Direction

### 1. Storage and adapters before more parallel PRD work

Storage and adapters are still shared surfaces. Do not run PRD 03, PRD 04 and
PRD 12 implementation lanes against them at the same time.

Target storage shape:

```text
packages/storage/src/config.ts
packages/storage/src/paths.ts
packages/storage/src/entity-store.ts
packages/storage/src/transactions.ts
packages/storage/src/events.ts
packages/storage/src/projection.ts
packages/storage/src/validation.ts
packages/storage/src/migration.ts
packages/storage/src/recovery.ts
```

Target adapter shape:

```text
packages/adapters/src/git/
packages/adapters/src/wordpress/
packages/adapters/src/backup/
packages/adapters/src/providers/github-fake/
packages/adapters/src/providers/communication-fake/
packages/adapters/src/policy.ts
packages/adapters/src/index.ts
```

Acceptance:

- behavior preserved;
- existing tests pass;
- package public exports remain stable;
- provider-specific code has provider-specific tests;
- no adapter starts deciding lifecycle.

### 2. MCP mutations become registry-first

`packages/mcp/src/tools/mutations.ts` should become a composition file.

Target shape:

```text
packages/mcp/src/tools/mutations/index.ts
packages/mcp/src/tools/mutations/entities.ts
packages/mcp/src/tools/mutations/prepared-actions.ts
packages/mcp/src/tools/mutations/evidence.ts
packages/mcp/src/tools/mutations/governance.ts
packages/mcp/src/tools/mutations/delivery.ts
packages/mcp/src/tools/mutations/products.ts
packages/mcp/src/tools/mutations/finance.ts
packages/mcp/src/tools/mutations/career.ts
packages/mcp/src/tools/mutations/sales/
packages/mcp/src/tools/mutations/agent-harness/
```

The MCP rule remains: tools adapt request shape into command envelopes and do
not own domain behavior.

### 3. Domain files split by lifecycle, not by aesthetics

Split domain services only when the lifecycle boundaries are real.

Sales target slices:

```text
sales/icp.ts
sales/prospect-research.ts
sales/outreach.ts
sales/opportunities.ts
sales/proposals.ts
sales/negotiation.ts
sales/conversion.ts
sales/reporting.ts
```

Finance target slices:

```text
finance/contracts.ts
finance/invoices.ts
finance/payments.ts
finance/obligations.ts
finance/reports.ts
```

Career target slices:

```text
career/role-targeting.ts
career/evidence-fit.ts
career/applications.ts
career/submissions.ts
career/interviews.ts
```

Agent harness target slices:

```text
harness/runs.ts
harness/context-packs.ts
harness/authorization.ts
harness/actions.ts
harness/verification.ts
harness/handoffs.ts
```

Each split must keep the existing facade or public import stable until callers
are migrated intentionally.

### 4. CLI and panel split after domain boundaries settle

Do not split CLI/panel first just to reduce lines. Interface splits are useful
only when they follow stable command/domain slices.

CLI target:

```text
commands/core/status.ts
commands/core/validation.ts
commands/core/workflows.ts
commands/core/coverage.ts
commands/core/acceptance.ts
commands/operations/repositories.ts
commands/operations/wordpress.ts
commands/operations/backup.ts
commands/operations/assets.ts
commands/operations/fake-providers.ts
```

Panel target:

```text
views/<domain>/summary.tsx
views/<domain>/commands.tsx
views/<domain>/tables.tsx
views/<domain>/types.ts
```

### 5. Tests split as evidence maps

Large tests are acceptable when they are fixture catalogs, but they still need
navigation.

Target:

```text
packages/testing/src/interface-equivalence/
packages/core/src/command-runtime/
```

Split by evidence claim:

- command-runtime invariants;
- sales workflow;
- finance workflow;
- career workflow;
- prepared action lifecycle;
- interface equivalence by domain.

## Work Ordering

Recommended next implementation order:

1. Complete the self-build harness bootstrap so future Studio work can run
   through `AgentRun`, context pack, authorization, action log, evidence,
   verification, handoff and close gates.
2. Use that harness to extract storage internals under PRD 12 ownership.
3. Extract adapters by provider/capability before PRD 03/04/12 run in parallel.
4. Extract MCP mutation registry by tool family.
5. Split `core/domains/sales.ts` by lifecycle slices.
6. Split finance, career and harness only when the next feature touches them.
7. Split CLI and panel surfaces after core/interface contracts settle.
8. Split large tests by evidence claim once behavior is stable.

This ordering follows the conflict risk, not the line-count ranking.

## Gate For Future Agents

Before adding behavior to a hotspot, an agent must answer:

```text
Is this file large because it owns one coherent table/catalog/fixture,
or because multiple responsibilities are competing?

What responsibility am I adding?
Who owns it?
What public interface exposes it?
What test or evidence proves behavior?
Can I add this through an owned slice instead of broadening a shared surface?
```

If the answer is unclear, create or extend a focused slice first.

## What This Does Not Do

This document does not:

- import Praxis method into Studio OS;
- create new bureaucracy for small reversible edits;
- require every file to be under an arbitrary line count;
- permit broad rewrites without characterization tests;
- supersede PRD acceptance gates;
- unblock portfolio release.

It is an operating direction document: use Praxis knowledge to make better
Studio work decisions.

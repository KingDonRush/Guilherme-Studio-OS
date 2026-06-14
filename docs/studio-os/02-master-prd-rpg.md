# Guilherme Studio OS: Master RPG PRD

Status: normative product specification
Method: Operations Repository Planning Graph

## Overview

### Problem Statement

Guilherme's work currently spans code repositories, WordPress runtimes,
portfolio assets, plugin plans, GitHub activity, conversations, opportunities,
marketing ideas, and operational knowledge. The parts contain value, but they
do not yet form one coherent economic system.

The central failure is not lack of files or tools. It is loss of continuity
between:

```text
market signal
→ opportunity
→ decision
→ work
→ evidence
→ publication
→ new opportunity
```

Without an explicit operating model:

- agents can optimize a local task while losing the business objective;
- client context and project context become mixed;
- one paid demand containing several sites becomes ambiguous;
- code, assets, approvals, and payments drift apart;
- public evidence is recreated instead of derived from delivered work;
- visual and technical validation can occur in the wrong environment;
- repeated mistakes remain conversational memories instead of system behavior;
- Guilherme must repeatedly restore context and manually coordinate the system.

### Target Users

#### Guilherme as operator

Needs immediate visibility into:

- what can generate revenue now;
- which work is active, blocked, unpaid, or awaiting approval;
- which application or prospect needs follow-up;
- which product or case creates the strongest hiring signal;
- what an agent is allowed to do next.

#### Guilherme as WordPress developer

Needs reproducible environments, repository isolation, secure code, controlled
assets, clear requirements, and evidence-backed delivery.

#### AI agents

Need a small, explicit context surface that identifies entity, objective,
repository, authority, risk, next action, and completion evidence.

#### Future collaborator

Needs to understand the operation without reading every conversation or
reverse-engineering private conventions.

### Success Metrics

The first production release succeeds when:

- 100% of active freelance work is represented by an engagement with
  deliverables, status, next action, commercial state, and repository links;
- 100% of active job applications have stage, company, role, next action, and
  communication history;
- 100% of independent repositories appear in the registry and pass health
  inspection;
- 100% of external actions require a prepared payload and explicit confirmation;
- 100% of secret-classified fields are rejected from canonical Git storage;
- the SQLite index can be deleted and rebuilt without loss of canonical state;
- a new agent can resolve the next valid action from the repository without a
  full oral briefing;
- completed work can produce a portfolio-case seed without copying its source
  facts manually;
- the dashboard exposes revenue pipeline, work pipeline, application pipeline,
  blocked items, and repository health;
- recurring high-cost failures generate a rule, test, or workflow correction.

## Five Connected Graphs

### Functional Graph

Defines what the Studio does:

- orient economic priorities;
- manage relationships and opportunities;
- contract and execute work;
- coordinate repositories and WordPress environments;
- manage products and evidence;
- distribute work through portfolio and marketing;
- govern knowledge, agents, security, and recovery.

### Structural Graph

Defines where responsibilities live:

- canonical records;
- Studio Core;
- CLI;
- MCP;
- panel;
- adapters;
- independent repositories;
- generated index;
- documentation.

### State Graph

Defines valid lifecycle transitions for:

- prospects;
- sales opportunities;
- clients;
- engagements;
- deliverables;
- products and releases;
- portfolio cases;
- campaigns and content;
- job applications;
- invoices and payments;
- tasks and agent runs.

### Authority Graph

Defines:

- actors;
- capabilities;
- confirmation boundaries;
- hard and soft gates;
- repository ownership;
- public versus private action;
- recovery authority.

### Evidence Graph

Connects:

- claims;
- work;
- source repositories;
- tests;
- screenshots;
- approvals;
- communications;
- deliveries;
- payments;
- public URLs.

## Functional Decomposition

### Capability: Economic Orientation

- **Inputs:** goals, pipeline state, obligations, deadlines, available capacity.
- **Outputs:** prioritized next actions, warnings, focus recommendation.
- **Behavior:** ranks work by revenue proximity, strategic evidence, risk, and
  dependency instead of treating all tasks equally.
- **Failure:** optimization of polish or infrastructure while revenue work is
  blocked.

### Capability: Relationship and Opportunity Management

- **Inputs:** people, organizations, sources, communications, qualification.
- **Outputs:** prospects, opportunities, clients, applications, follow-ups.
- **Behavior:** preserves relationship history while separating freelance and
  employment pipelines.
- **Failure:** duplicate people, unowned follow-ups, or outreach without reason.

### Capability: Paid Work Management

- **Inputs:** approved scope, proposal, contract, payment terms, client profile.
- **Outputs:** engagements, deliverables, schedules, approvals, delivery state.
- **Behavior:** one engagement may contain several independently tracked sites
  or deliverables.
- **Failure:** payment, scope, code, and client approval become disconnected.

### Capability: Technical Production

- **Inputs:** requirements, repositories, environments, assets, decisions.
- **Outputs:** tested code, WordPress builds, releases, evidence, handoffs.
- **Behavior:** routes work to the correct Git repository and enforces
  stack-specific gates.
- **Failure:** monolithic code, insecure implementation, cross-repo drift, or
  unverifiable completion.

### Capability: Product and Evidence Management

- **Inputs:** plugin code, releases, demos, documentation, test evidence.
- **Outputs:** product records, release history, cases, claims, public proof.
- **Behavior:** transforms real work into reusable market evidence.
- **Failure:** portfolio claims exceed implementation reality.

### Capability: Marketing and Distribution

- **Inputs:** evidence, audience, channel, offer, campaign goal.
- **Outputs:** drafts, content, campaigns, publication queue, performance data.
- **Behavior:** distributes validated evidence toward a defined economic goal.
- **Failure:** generic content without audience, proof, or next action.

### Capability: Career Pipeline

- **Inputs:** roles, organizations, requirements, portfolio evidence, contacts.
- **Outputs:** qualified applications, follow-ups, interviews, outcomes.
- **Behavior:** maps role requirements to existing evidence and exposes gaps.
- **Failure:** high-volume generic applications without fit or traceability.

### Capability: Financial and Contractual Control

- **Inputs:** proposals, contracts, invoices, payments, dates, obligations.
- **Outputs:** receivable state, alerts, records, delivery and warranty gates.
- **Behavior:** links economic events to engagements and evidence.
- **Failure:** unpaid delivery, invisible obligations, or ambiguous status.

### Capability: Knowledge and Agent Operations

- **Inputs:** decisions, observations, tasks, files, communications, evidence.
- **Outputs:** compact context packs, run records, handoffs, reusable rules.
- **Behavior:** preserves decisions while preventing indiscriminate context load.
- **Failure:** repeated briefing, contradictory memory, or policy ignored.

### Capability: Local Automation Surface

- **Inputs:** commands, MCP requests, panel actions, canonical records.
- **Outputs:** validated mutations, views, events, diagnostics, backups.
- **Behavior:** all surfaces call the same Studio Core.
- **Failure:** CLI, MCP, and panel implement conflicting business logic.

## Structural Decomposition

```text
guilherme-studio-os/
├── AGENTS.md
├── README.md
├── package.json
├── studio.config.yaml
├── apps/
│   └── panel/
├── packages/
│   ├── core/
│   ├── schemas/
│   ├── storage/
│   ├── cli/
│   ├── mcp/
│   ├── adapters/
│   └── testing/
├── data/
│   ├── registry/
│   ├── people/
│   ├── organizations/
│   ├── opportunities/
│   ├── clients/
│   ├── career/
│   ├── finance/
│   └── events/
├── clients/
├── products/
├── portfolio/
├── marketing/
├── sales/
├── career/
├── operations/
├── templates/
├── docs/
├── runtime/
└── archive/
```

`runtime/` contains generated SQLite, caches, locks, logs, and temporary
artifacts. It is ignored by Git and never canonical.

### Module Ownership

| Module | Responsibility | Public surface |
|---|---|---|
| `schemas` | entity and command contracts | schema registry and validators |
| `core` | lifecycles, authority, gates, domain services | typed use cases |
| `storage` | canonical file I/O, indexing, transactions | repositories and rebuild |
| `cli` | deterministic operator commands | `studio` executable |
| `mcp` | governed agent interface | resources, tools, prompts |
| `panel` | local operational views | localhost web application |
| `adapters` | external systems | narrow provider contracts |
| `testing` | fixtures and contract suites | test utilities |

## Dependency Graph

### Layer 0: Contracts

- Constitution: no runtime dependencies.
- Schemas: depends on Constitution and ontology.
- Configuration: depends on schemas.

### Layer 1: Canonical Storage

- File store: depends on schemas and configuration.
- Event store: depends on file store.
- Registry: depends on file store.
- SQLite projector: depends on schemas, events, and registry.

### Layer 2: Studio Core

- Identity service: depends on canonical storage.
- Lifecycle service: depends on identity and schemas.
- Authority service: depends on Constitution, identity, and lifecycle.
- Evidence service: depends on registry and storage.
- Workflow engine: depends on lifecycle, authority, and evidence.

### Layer 3: Operator Interfaces

- CLI: depends on Studio Core.
- MCP: depends on Studio Core and CLI-compatible command contracts.
- Local API: depends on Studio Core.
- Panel: depends on local API and read projections.

### Layer 4: Adapters

- Git adapter: depends on authority and repository registry.
- WordPress/Docker adapter: depends on project and repository services.
- GitHub adapter: depends on repository service and external-action gates.
- Communication adapters: depend on prepared-action and confirmation services.

Circular dependencies are prohibited. Adapters never become dependencies of
the core domain.

## Architecture Decisions

- TypeScript is the default implementation language across core, CLI, MCP, and
  panel to share contracts and reduce translation.
- The minimum Node version will be selected after validating `node:sqlite`,
  package distribution, and local environment compatibility.
- Markdown and YAML are canonical for human-maintained state.
- Append-only event records are canonical where audit history matters.
- SQLite is a derived query projection and can be rebuilt.
- The panel binds to loopback by default and has no remote mode in V1.
- Independent codebases use independent Git repositories registered by path.
- Submodules require an explicit decision record.
- CLI is the only general mutation authority; panel and MCP call core use cases
  through equivalent command contracts.

## Implementation Roadmap

### Phase 0: Constitutional and schema foundation

**Entry:** specification approved.
**Deliverables:** schemas, ID rules, classification, config, validation CLI.
**Exit:** fixtures validate and invalid secret fields are rejected.

### Phase 1: Canonical storage and registry

**Entry:** schemas stable.
**Deliverables:** atomic file writes, registry, event records, SQLite rebuild.
**Exit:** index deletion and deterministic rebuild pass.

### Phase 2: Core lifecycles and authority

**Entry:** storage stable.
**Deliverables:** entity services, transitions, gates, prepared actions.
**Exit:** core workflows run through tests without UI.

### Phase 3: CLI

**Entry:** core use cases stable.
**Deliverables:** commands listed in the interface PRD, diagnostics, dry runs.
**Exit:** the eight journeys can be driven from CLI fixtures.

### Phase 4: MCP

**Entry:** CLI contracts stable.
**Deliverables:** resources, read tools, mutation tools, confirmation flow.
**Exit:** MCP Inspector validates schemas and authority boundaries.

### Phase 5: Local panel

**Entry:** local API and projections stable.
**Deliverables:** economic overview, pipelines, work state, repo health.
**Exit:** panel provides complete visibility without becoming a second core.

### Phase 6: Adapters and migration

**Entry:** core surfaces stable.
**Deliverables:** Git, WordPress, Docker, GitHub, and communication adapters;
current root migration.
**Exit:** existing portfolio and repositories are registered and operational.

## Test Strategy

- Schema contract tests for every entity and event.
- Property tests for IDs and lifecycle transitions.
- Unit tests for authority and gate decisions.
- Integration tests for file store and SQLite rebuild.
- Contract tests shared by CLI, MCP, and API.
- Repository fixtures for nested Git safety.
- WordPress/Docker backup and restore rehearsal.
- Security tests for path traversal, secret classification, injection, and
  unauthorized external actions.
- End-to-end tests for the eight cross-domain journeys.
- Manual approval tests for visual, commercial, and public-action boundaries.

## Risks

| Risk | Mitigation |
|---|---|
| Building a CRM instead of a focused operating system | economic mission and domain budgets |
| Excessive schema complexity | minimum viable fields plus extension maps |
| Canonical and SQLite drift | rebuild-first architecture and projection checksums |
| Agent bypasses gates | all mutations pass through core use cases |
| Root migration damages repositories | inventory, backups, dry run, per-repo health checks |
| Private data leaks through Git | classification validators and secret scanning |
| Panel becomes remote attack surface | loopback-only V1 and no public deployment |
| Documentation diverges from runtime | schemas and command references generated from code after implementation |

## Master Acceptance Criteria

- Every domain PRD maps to one or more core modules.
- Every module appears once in the dependency graph.
- Every lifecycle transition has actor, precondition, event, and evidence.
- Every external action is prepared before confirmation.
- Every canonical record can be validated without SQLite.
- Every panel value can be traced to canonical records.
- Every repository operation identifies the target Git root.
- Every completed task has evidence proportional to risk.
- The system remains useful if MCP or the panel is unavailable.
- The system can be restored from canonical Git data, private backups, and
  registered repository remotes.

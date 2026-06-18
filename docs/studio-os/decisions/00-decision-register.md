# Studio OS Decision Register

Status: normative decision index
Rule: decisions listed as accepted cannot be silently reopened by implementation

## Decision Fields

Each material decision records:

- ID;
- status;
- date;
- context;
- decision;
- rationale;
- consequences;
- reconsideration trigger;
- authority.

## Accepted Decisions

### STUDIO-001: Product name

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** the system is named **Guilherme Studio OS**.
- **Rationale:** the name represents an operating system for Guilherme's
  commercial, career, production, evidence, and agent work.
- **Reconsideration trigger:** brand architecture changes materially.
- **Authority:** Guilherme.

### STUDIO-002: Economic scope

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** the Studio covers both international freelance income and
  international employment.
- **Consequence:** Opportunity and JobApplication share primitives but remain
  different lifecycles.
- **Authority:** Guilherme.

### STUDIO-003: Current root is adapted

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** adapt the current root instead of creating an external parent
  repository.
- **Consequence:** migration must preserve current history and nested repos.
- **Authority:** Guilherme.

### STUDIO-004: Family of specifications

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** use a Constitution, Master RPG PRD, ontology, domain PRDs,
  workflows, architecture, schemas, operations, migration, and decisions instead
  of one monolithic PRD.
- **Rationale:** responsibility and authority differ by domain.
- **Authority:** Guilherme.

### STUDIO-005: RPG is a planning method

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** the Repository Planning Graph structures WHAT/HOW,
  dependencies, authority, state, and evidence; it is not a runtime dependency.
- **Consequence:** no RPG framework is required in production code.
- **Authority:** Guilherme.

### STUDIO-006: Automated V1

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** V1 includes a custom Studio CLI, custom MCP server, and local
  browser panel.
- **Consequence:** the specification must define shared core contracts and
  cannot stop at folder conventions.
- **Authority:** Guilherme.

### STUDIO-007: Canonical and derived storage

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** Markdown/YAML and audit events are canonical; SQLite is derived
  and rebuildable.
- **Consequence:** no workflow may require SQLite as the only copy of truth.
- **Authority:** Guilherme.

### STUDIO-008: Private coordinator

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** the coordinator repository is private.
- **Consequence:** internal/confidential commercial data may be versioned when
  justified and classified.
- **Authority:** Guilherme.

### STUDIO-009: Secrets stay outside Git

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** credentials, tokens, private keys, cookies, and recovery codes
  never enter canonical Git storage.
- **Consequence:** schemas store opaque secret references only.
- **Authority:** Constitution hard gate.

### STUDIO-010: Proportional gates

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** gates scale with risk; reversible creative work is not governed
  like public, financial, destructive, or security-sensitive action.
- **Consequence:** quality control cannot become universal bureaucracy.
- **Authority:** Guilherme.

### STUDIO-011: External actions require confirmation

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** agents may research, draft, validate, and prepare, but sending,
  publishing, submitting, signing, moving money, and production mutation require
  exact-payload human confirmation.
- **Authority:** Guilherme.

### STUDIO-012: Independent Git histories

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** independently released products and WordPress sites use
  independent Git repositories registered by the coordinator.
- **Consequence:** submodules are opt-in and require a separate decision.
- **Authority:** Guilherme.

### STUDIO-013: Local-only panel V1

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** panel and local API bind to loopback only; V1 has no public or
  remote server mode.
- **Rationale:** remote access adds authentication, deployment, and attack
  surface unrelated to the first economic objective.
- **Authority:** architecture and security decision.

### STUDIO-014: Agentic Ops exclusion

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** Agentic Ops does not participate in the architecture and will be
  deleted during migration without artifact migration.
- **Consequence:** `.agentic-ops/` and its generated conceptual model are not
  sources for runtime design.
- **Authority:** Guilherme.

### STUDIO-015: Root rename occurs last

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** physical root rename happens after internal topology, registry,
  scripts, and runtimes are stable.
- **Rationale:** renaming early creates path churn without architectural value.
- **Authority:** migration design.

## Accepted Technical Decisions

### STUDIO-016: TypeScript platform

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** TypeScript, Node 24 LTS, npm workspaces, and Zod 4.
- **Evidence:** reproducible workspace typecheck, test, lint and build pipeline.
- **Authority:** implementation spike accepted by Guilherme's approved V1 plan.

### STUDIO-017: CLI parser

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** Commander with an internal typed command registry rather than
  oclif or a custom parser.
- **Evidence:** nested commands, global options, machine output and isolated
  handlers run in the current CLI.
- **Authority:** implementation spike accepted by Guilherme's approved V1 plan.

### STUDIO-018: SQLite binding

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** use `better-sqlite3` for the V1 derived projection.
- **Rationale:** the binding is stable on the pinned Node runtime and supports
  deterministic transactional rebuilds without making SQLite canonical.
- **Evidence:** projection creation, checksum inspection and rebuild tests.
- **Authority:** implementation spike accepted by Guilherme's approved V1 plan.

### STUDIO-019: MCP SDK version

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** official TypeScript SDK v1.x for V1, isolated behind the MCP
  package.
- **Evidence:** stdio server exposes resources and governed tools without
  leaking core implementation.
- **Reconsideration trigger:** planned SDK v2 becomes stable and offers a
  migration path with no contract regression.
- **Authority:** implementation spike accepted by Guilherme's approved V1 plan.

### STUDIO-020: Large asset storage

- **Status:** accepted
- **Date:** 2026-06-14
- **Decision:** source raster assets remain under ignored
  `runtime/assets/sources`; approved optimized WebP and legitimate SVG may be
  versioned with manifest evidence under their owning domain.
- **Consequence:** no Git LFS dependency in V1.
- **Reconsideration trigger:** approved production assets make repository size
  or distribution cost operationally harmful.
- **Authority:** Guilherme's approved asset policy and V1 plan.

### STUDIO-021: Praxis-informed development method

- **Status:** accepted
- **Date:** 2026-06-18
- **Decision:** Studio OS development uses the Praxis-derived method in
  `docs/studio-os/implementation/02-praxis-development-method.md`.
- **Rationale:** "modular monolith" is not a sufficient development method.
  Development work must pass through explicit method selection, system context,
  contracts, architecture/decomposition, design/construction, V&V, security,
  configuration, operations/recovery, documentation and evidence gates.
- **Consequence:** PRD subagents and refactor lanes must load the Praxis
  development method before editing code. Line-count thresholds are gate
  triggers, not substitutes for responsibility, boundary and dependency
  analysis.
- **Reconsideration trigger:** the local Praxis method is superseded by a
  stronger accepted Studio OS engineering method or the gates repeatedly add
  cost without improving decisions.
- **Authority:** Guilherme's 2026-06-18 instruction to treat development Praxis
  methods as mandatory.

## Explicit Non-Decisions

The following remain intentionally unresolved:

- public hosting or remote access for the panel;
- multi-user authentication;
- general workflow language;
- general CRM scoring automation;
- accounting, tax, or legal compliance engine;
- JetEngine or other third-party CCT integration;
- submodule adoption;
- cloud database or SaaS backend;
- autonomous external communication.

These require a new problem statement and decision record. They are not implied
by the V1 architecture.

## Amendment Rule

To supersede an accepted decision:

1. cite the decision ID;
2. present new observed evidence;
3. explain economic and migration impact;
4. define compatibility and rollback;
5. obtain required authority;
6. mark the old decision `superseded` rather than deleting it.

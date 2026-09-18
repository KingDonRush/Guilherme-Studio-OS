# Studio Control Plane

A local-first control plane for freelancers and small software studios. It connects
client acquisition, commercial work, delivery, repositories, environments, products
and evidence with the context needed to continue work across AI-agent runs.

The system keeps business and implementation records linked: why a project exists,
what was agreed, where its code runs, what has been verified and what should happen
next. A React panel, CLI and MCP interface operate on shared domain services.

## From prospect to delivered work

**Prospect → opportunity → discovery → proposal → client / engagement →
deliverable / project → evidence → portfolio case**

Commands record prospect research and discovery, prepare and review proposals,
record acceptance and convert opportunities into clients and engagements. Delivery
records connect the resulting work to projects, repositories and environments.
Evidence supports acceptance, release and portfolio decisions. These are linked
domain operations; the panel exposes selected forms and views rather than a
dedicated wizard for every transition.

| Area | Implemented system |
| --- | --- |
| Client and commercial operations | People, organizations, prospects, opportunities, discovery, proposals, clients and engagements |
| Delivery and products | Deliverables, projects, repository registration, environments, products and releases |
| Finance | Contracts, invoices, payment records and obligation tracking |
| Evidence and publication planning | Evidence registration, portfolio cases, campaigns and content preparation |
| Agent continuity and governance | Tasks, decisions, agent runs, context packs, observations, verification, handoffs and learning records |
| Career pipeline | Opportunity/application records and evidence-backed preparation within the same operational model |

Finance records track operational state; they do not process payments. Content and
commercial preparation remain distinct from external publication or sending.

## Continue work across agent runs

**Agent run → context pack → observations / actions → verification → handoff**

The agent harness records scope, authority, observations and evidence so a later
run can resume from explicit state. Shared commands validate mutations and entity
revisions. Prepared actions bind confirmation to an exact payload checksum and an
expiry; execution and reconciliation record their outcomes separately.

The [agent harness](packages/core/src/harness/agent-harness.ts) and
[prepared-action service](packages/core/src/prepared-actions/service.ts) implement
these mechanisms. Context packs and handoffs are executable capabilities; richer
client-memory and briefing models in the PRDs remain architectural direction.

## WordPress delivery specialization

WordPress is a concrete delivery environment within the broader studio model.
The [runtime adapters](packages/adapters/src/index.ts) implement Docker Compose
status/start/stop and HTTP health inspection, WP-CLI commands, plugin inspection,
database/uploads backups and restore checks. A
[portfolio site kit](packages/adapters/src/wordpress-site-kit.ts) applies the
included site capsule to a local WordPress/Elementor runtime.

These operations require the registered environment and its Compose files.
`wordpress provision` currently creates a target directory and provisioning
manifest; it does not complete site installation or registration. Product plugin
repositories retain independent Git histories and verification requirements; see
[repository topology](docs/studio-os/architecture/04-repository-wordpress-topology.md).

## System map

| Layer | Responsibility |
| --- | --- |
| [React panel](apps/panel/src) | CRM, delivery, products, finance, agents and operational control views |
| [Local API](packages/local-api/src), [CLI](packages/cli/src), [MCP](packages/mcp/src) | Human and automation entry points |
| [Core services](packages/core/src/domains) and [command registry](packages/core/src/commands/registry.ts) | Domain operations, validation and lifecycle transitions |
| [Schemas](packages/schemas/src) | Entity, relationship, command and result contracts |
| [Storage](packages/storage/src) | Canonical YAML/Markdown records and a rebuildable SQLite projection |
| [Adapters](packages/adapters/src) | Repository inspection, local WordPress runtime and external-action boundaries |

Canonical files are the durable source of truth; SQLite supports queries and the
dashboard. The [implementation guide](docs/studio-os/reviewer-guide.md) provides a
source-reading path. The [documentation index](docs/studio-os/00-index.md) links
runtime references and the broader design specifications.

## Run locally

The declared toolchain is Node.js 24.16.0 and npm 11.13.0. Installation builds
native SQLite dependencies. Inspect the checkout's operational records and
environment paths before operating an existing workspace.

```bash
git clone https://github.com/KingDonRush/studio-control-plane.git
cd studio-control-plane
npm ci
npm run build
npm run studio -- inspect
npm run studio -- dashboard --serve
```

The built panel and API use the loopback address configured in `studio.config.yaml`
(default `127.0.0.1:4177`). For panel development, keep the API running and use
`npm run dev:panel`; Vite proxies API requests from port 5177 to 4177. WordPress
operations additionally require Docker and a configured environment.

## Verification and current boundaries

```bash
npm run verify
```

This runs TypeScript checking, 65 tests, Biome and workspace builds. Tests exercise
domain commands, storage, lifecycle controls, agent continuity and adapter
contracts. Docker/WordPress deployment and external service behavior require
their own environment checks; a unit test does not establish a live deployment.

Git and local Docker/WordPress adapters have executable implementations. GitHub
and communication providers remain fake or disabled in the supplied configuration.
A prepared or confirmed record alone does not mean an external action completed.

The system assumes a trusted local operator and loopback access, without a hosted
multi-tenant authorization model. The CLI name `studio`, `@guilherme-studio/*`
packages, existing record IDs and `studio.guilherme.dev/*` contracts retain their
compatibility identities. The repository rename does not migrate stored records
or rename existing local directories.

# Guilherme Studio OS

A local workspace for organizing software delivery through a React panel,
TypeScript API/CLI and MCP interface. All interfaces share operational contracts.
YAML and Markdown hold canonical records; SQLite provides a rebuildable projection
for queries and the dashboard.

## How work moves through the system

Projects, plans and delivery records stay inspectable as files. The panel presents
that state to a person, while CLI and MCP commands expose it to automation.
Actions follow preparation, confirmation, execution and reconciliation. Payload
checksums and expiry constrain what can execute; failed or uncertain outcomes stay
visible instead of being treated as completed actions.

External communication and GitHub adapters are currently fake or disabled.
The local action lifecycle can be exercised without implying an external delivery.

## Run locally

The declared toolchain is Node.js 24.16.0 and npm 11.13.0. Installation builds
native SQLite dependencies.

```bash
npm ci
npm run verify
npm run studio -- dashboard
```

Consult the [system documentation](docs/studio-os/00-index.md) for setup and
commands, and the [architecture guide](docs/studio-os/reviewer-guide.md) for a
short source-reading path. This application is designed for a trusted local
workspace, not an internet-facing multi-tenant service.

## System map

| Layer | Responsibility |
| --- | --- |
| [React panel](apps/panel/src) | Human inspection and operation |
| [Local API](packages/local-api/src) | Local interface over shared services |
| [Core](packages/core/src) | Domain operations, prepared actions and reconciliation |
| [Storage](packages/storage/src) | Canonical records and SQLite projection |
| [CLI](packages/cli/src) / [MCP](packages/mcp/src) | Script and agent entry points |

WordPress product repositories have independent histories and release boundaries;
see [repository topology](docs/studio-os/architecture/04-repository-wordpress-topology.md).
They are not bundled releases of this application.

## Verification

`npm run verify` runs TypeScript checking, 65 tests, Biome and workspace builds,
including the panel. Test coverage includes the shared domain and storage contracts.
External adapters and cross-product WordPress workflows require their own runtime
validation. SQLite is a derived view: preserve canonical files when rebuilding it.

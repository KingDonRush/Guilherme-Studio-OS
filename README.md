# Guilherme Studio OS

A local application for organizing software delivery and structured agent work.
It combines a React dashboard, a TypeScript API/CLI and an MCP interface over the
same operational records. YAML and Markdown are canonical; SQLite is a rebuildable
local projection.

**Independent working prototype.** Useful evidence of application architecture,
agent interfaces and explicit action controls. External service adapters are
currently fake or disabled; this is not a claim of a live commercial service.

## Start with the evidence

| Interest | What to inspect |
| --- | --- |
| React / TypeScript applications | [Dashboard source](apps/panel/src), [local API](packages/local-api/src) |
| Agent tooling / MCP | [MCP server](packages/mcp/src/server.ts), [prepared action lifecycle](packages/core/src/prepared-actions/service.ts) |
| Product and system decisions | [System specification](docs/studio-os/00-index.md), [repository boundaries](docs/studio-os/architecture/04-repository-wordpress-topology.md) |
| WordPress implementation | [WordPress runtime and owned surfaces](wordpress/README.md); plugins have their own repositories |

An action moves through preparation, confirmation, execution and reconciliation.
The implementation checks expiry and payload checksums and records failures rather
than treating a prepared intention as a completed external action.

## Run locally

The declared toolchain is Node.js 24.16.0 and npm 11.13.0. Native SQLite dependencies
must be built during installation.

```bash
npm ci
npm run verify
npm run studio -- dashboard
```

The dashboard is local only. See the [review guide](docs/studio-os/reviewer-guide.md)
for validation results, scope and limitations. Agent contributors should then read
[AGENTS.md](AGENTS.md).

## Development method and authorship

This is an independent project, not evidence of an employer or a client engagement.
The source was produced primarily or entirely by AI coding agents under Guilherme
Manoel da Silva's direction. His contribution includes product intent, requirements,
constraints, decomposition, product and architectural decisions through the agent
interface, iteration, validation and documentation. The repository demonstrates
the resulting system and process; it does not imply that he manually wrote every
component or can reproduce it unaided from memory.

## Em português

Aplicação local para organizar entregas de software e trabalho dirigido por
agentes. Reúne painel React, API/CLI TypeScript e interface MCP, com registros
canônicos em YAML/Markdown e projeção SQLite. Projeto independente; cenários e
materiais de portfólio não representam clientes, receita ou adoção comprovados.

# PRD 11 Agent Packet: CLI, MCP And Local Panel

Wave: 1
Branch: `codex/prd-11-interfaces`

## Objective

Move PRD 11 to `capability_complete` for CLI fallback completeness, local API
read surfaces, MCP resources/tools/prompts and operational panel views.

## Read First

- `docs/studio-os/prds/11-cli-mcp-panel.md`
- `docs/studio-os/architecture/03-cli-mcp-panel.md`
- `docs/studio-os/implementation/prd-11-cli-mcp-panel-plan.md`
- `docs/studio-os/implementation/capability-matrices/prd-11-cli-mcp-panel-matrix.md`

## Allowed Write Set

- `packages/cli/src/**`
- `packages/local-api/src/**`
- `packages/mcp/src/**`
- `apps/panel/src/**`

## Shared Contracts Consumed

- all PRD command modules;
- PRD 10 Agent Harness Loop;
- PRD 01 acceptance and gates;
- PRD 12 Host/Origin and path safety;

## Must Not Do

- Do not implement business behavior only in the interface layer.
- Do not let mutating API or MCP tools bypass `executeStudioCommand`.
- Do not make a generic YAML editor the primary mutation workflow.

## Verification

- CLI/API/MCP equivalence tests for shared commands;
- MCP smoke through stdio client;
- panel smoke for operational views;
- prepared action detail shows exact payload, checksum, expiry, source and
  reconciliation state.


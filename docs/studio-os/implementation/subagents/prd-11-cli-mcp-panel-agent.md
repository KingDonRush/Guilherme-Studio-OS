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

- `packages/cli/src/runtime.ts`
- `packages/cli/src/index.ts` registration only
- `packages/cli/src/commands/**` interface wiring and shared options
- `packages/local-api/src/routes/**`
- `packages/local-api/src/server.ts`
- `packages/local-api/src/types.ts`
- `packages/local-api/src/command-runner.ts`
- `packages/mcp/src/resources.ts`
- `packages/mcp/src/tools/**`
- `packages/mcp/src/prompts.ts`
- `packages/mcp/src/server.ts` registration only
- `packages/mcp/src/command.ts`
- `apps/panel/src/app/app.tsx`
- `apps/panel/src/api/**`
- `apps/panel/src/components/**`
- `apps/panel/src/views/**`

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

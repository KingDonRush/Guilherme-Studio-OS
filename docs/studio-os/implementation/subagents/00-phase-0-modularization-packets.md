# Phase 0 Modularization Packets

Status: Phase 0 integrated; adapter extraction remains the main architectural
cleanup lane before future PRD 03/04/12 adapter-heavy parallel work
Purpose: create disjoint write surfaces before PRD agents implement capability.

## Why Phase 0 Exists

The original implementation was intentionally compact but too centralized for
twelve parallel implementation agents. Phase 0 now tracks resolved and remaining
hot surfaces explicitly.

Resolved by Phase 0:

- `packages/schemas/src/index.ts`: now a thin schema barrel.
- `packages/core/src/index.ts`: now a thin core barrel.
- `packages/core/src/command-runtime.ts`: now a thin command runtime.
- `packages/core/src/workflows/fixtures.ts`: now a thin workflow barrel.
- `packages/cli/src/index.ts`: now a thin CLI program entrypoint.
- `packages/local-api/src/index.ts`: now a thin local API barrel.
- `packages/mcp/src/index.ts`: now a thin MCP barrel.
- `packages/mcp/src/tools/mutations.ts`: now a thin MCP mutation facade backed
  by owned mutation modules.
- `apps/panel/src/main.tsx`: now a thin React render entrypoint.
- `packages/storage/src/index.ts`: now a thin storage barrel backed by extracted
  config, path, transaction, event, projection, canonical and entity-store
  modules.

Remaining hot surfaces before future adapter-heavy parallel work:

- `packages/core/src/coverage.ts`
- `packages/adapters/src/index.ts`

Phase 0 extracts registries and module folders without broadening PRD behavior.
It is a behavior-preserving refactor.

## Packet 0A: Schemas Extraction

Branch: `codex/phase-0-schemas`
Result: integrated into `codex/studio-os-v1`.

Allowed writes:

- `packages/schemas/src/**`
- `packages/schemas/src/index.test.ts`

Target shape:

```text
packages/schemas/src/entities/kinds.ts
packages/schemas/src/entities/specs/base.ts
packages/schemas/src/entities/specs/crm.ts
packages/schemas/src/entities/specs/delivery.ts
packages/schemas/src/entities/specs/products.ts
packages/schemas/src/entities/specs/portfolio.ts
packages/schemas/src/entities/specs/marketing.ts
packages/schemas/src/entities/specs/career.ts
packages/schemas/src/entities/specs/finance.ts
packages/schemas/src/entities/specs/governance.ts
packages/schemas/src/entities/typed-entity.ts
packages/schemas/src/envelopes/command.ts
packages/schemas/src/envelopes/result.ts
packages/schemas/src/envelopes/adapter.ts
packages/schemas/src/envelopes/event.ts
packages/schemas/src/prepared-actions.ts
packages/schemas/src/security.ts
packages/schemas/src/ids.ts
packages/schemas/src/paths.ts
packages/schemas/src/index.ts
```

Acceptance:

- existing schema tests pass;
- exported public names are preserved;
- no domain-specific behavior is newly invented;
- central enums remain discoverable by PRD agents.

## Packet 0B: Core Domain Extraction

Branch: `codex/phase-0-core-domains`
Result: integrated into `codex/studio-os-v1`.

Allowed writes:

- `packages/core/src/**`
- `packages/core/src/*.test.ts`

Target shape:

```text
packages/core/src/context.ts
packages/core/src/entity-service.ts
packages/core/src/authority.ts
packages/core/src/lifecycle.ts
packages/core/src/prepared-actions/service.ts
packages/core/src/domains/base.ts
packages/core/src/domains/commands.ts
packages/core/src/domains/crm.ts
packages/core/src/domains/sales.ts
packages/core/src/domains/delivery.ts
packages/core/src/domains/products.ts
packages/core/src/domains/portfolio.ts
packages/core/src/domains/marketing.ts
packages/core/src/domains/career.ts
packages/core/src/domains/finance.ts
packages/core/src/domains/governance.ts
packages/core/src/domains/agents.ts
packages/core/src/workflows/fixtures.ts
packages/core/src/gates/catalog.ts
packages/core/src/gates/engine.ts
packages/core/src/evidence/claims.ts
packages/core/src/acceptance.ts
packages/core/src/operations.ts
packages/core/src/index.ts
```

Acceptance:

- existing service tests pass;
- `executeStudioCommand` remains the only mutation runtime entrypoint;
- current command names and result envelopes are preserved;
- domain logic moves out of monolithic files into owned modules;
- imports from `@guilherme-studio/core` continue to work through the barrel.

## Packet 0C: Core Command And Workflow Registry Extraction

Branch: `codex/phase-0-command-registry`
Result: integrated into `codex/studio-os-v1`.

Allowed writes:

- `packages/core/src/commands/**`
- `packages/core/src/command-runtime.ts`
- `packages/core/src/command-runtime.test.ts`
- `packages/core/src/workflows/**`

Target shape:

```text
packages/core/src/commands/registry.ts
packages/core/src/commands/types.ts
packages/core/src/commands/handlers/
packages/core/src/workflows/requirements.ts
packages/core/src/workflows/execution.ts
packages/core/src/workflows/executors/
packages/core/src/workflows/fixtures.ts
```

Acceptance:

- unknown command behavior is unchanged;
- dry-run behavior is unchanged;
- requirement/capability mapping is testable without reading the runtime
  switch;
- adding a PRD command no longer requires editing a large switch;
- the current dynamic import cycle from `command-runtime.ts` back to `index.ts`
  is removed or isolated behind command handler factories.
- adding or editing one workflow fixture no longer requires touching a 500+
  line shared executor file.

## Packet 0D: CLI Command Extraction

Branch: `codex/phase-0-cli-commands`
Result: integrated into `codex/studio-os-v1`.

Allowed writes:

- `packages/cli/src/**`
- `packages/cli/src/index.test.ts`

Target shape:

```text
packages/cli/src/commands/
packages/cli/src/commands/domains/
packages/cli/src/runtime.ts
packages/cli/src/index.ts
```

Acceptance:

- current CLI commands and exit codes are preserved;
- command modules can be owned by PRD agents;
- mutable commands still call `executeStudioCommand`;
- `--json` output remains stable for existing commands;
- current direct adapter shortcuts are explicitly classified as either
  read-only diagnostics or future command-runtime mutations.

## Packet 0E: API And MCP Extraction

Branch: `codex/phase-0-api-mcp`
Result: integrated into `codex/studio-os-v1`.

Allowed writes:

- `packages/local-api/src/**`
- `packages/mcp/src/**`
- related tests if present

Target shape:

```text
packages/local-api/src/server.ts
packages/local-api/src/security.ts
packages/local-api/src/command-runner.ts
packages/local-api/src/routes/read.ts
packages/local-api/src/routes/mutations.ts
packages/local-api/src/index.ts
packages/mcp/src/server.ts
packages/mcp/src/resources.ts
packages/mcp/src/tools/read.ts
packages/mcp/src/tools/mutations.ts
packages/mcp/src/prompts.ts
packages/mcp/src/command.ts
packages/mcp/src/index.ts
```

Acceptance:

- local API mutating routes still adapt payloads into `executeStudioCommand`;
- MCP tools that mutate still call the command runtime;
- read-only resources can be added without touching a monolithic server file;
- no external send is introduced.
- MCP has one helper for command execution instead of repeated
  `createStudioContext -> createStudioCommand -> executeStudioCommand` blocks.

## Packet 0F: Panel View Extraction

Branch: `codex/phase-0-panel-views`
Result: implemented in this branch.

Allowed writes:

- `apps/panel/src/**`

Target shape:

```text
apps/panel/src/api/
apps/panel/src/app/
apps/panel/src/components/
apps/panel/src/views/
apps/panel/src/main.tsx
apps/panel/src/styles.css
```

Acceptance:

- current panel still renders;
- navigation can register one view per PRD domain;
- prepared action confirmation UI has a future owned surface;
- no generic YAML editor becomes the primary mutation flow.

## Integration Order

1. 0A schemas: integrated.
2. 0B core domains: integrated.
3. 0C command and workflow registries: integrated.
4. 0D CLI: integrated.
5. 0E API/MCP: integrated.
6. 0F panel: integrated.
7. PRD packet realignment: implemented in `codex/phase-0-prd-packets`.

If branches overlap, prefer integrating the lower-numbered packet first and
rebasing later packets onto it.

## Remaining Shared Surfaces

These are not entrypoint monoliths anymore, but they still require ownership
discipline:

- `packages/core/src/coverage.ts`: PRD 01 owns coverage semantics; PRD agents
  may request rows or update their own row with review.
- `packages/adapters/src/index.ts`: PRD 03, 04 and 12 must not broaden adapter
  behavior concurrently. Split this file first if multiple adapter lanes run in
  parallel.
- `packages/storage/src/index.ts`: PRD 12 owns storage/recovery semantics.
  Other PRDs should consume storage APIs rather than editing storage internals.

## Phase 0 Final Gate

Phase 0 is complete when:

- `npm run verify` passes;
- `npm run studio -- validate --json` passes;
- root status contains only intentional changes;
- hot files are registries or thin entrypoints;
- PRD agents have owned folders where they can add behavior without editing the
  same monolith.

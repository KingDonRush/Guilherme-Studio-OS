# Phase 0 Modularization Packets

Status: first execution lane
Purpose: create disjoint write surfaces before PRD agents implement capability.

## Why Phase 0 Exists

Current implementation is intentionally compact but too centralized for twelve
parallel implementation agents. These files are hot:

- `packages/schemas/src/index.ts`
- `packages/core/src/index.ts`
- `packages/core/src/command-runtime.ts`
- `packages/core/src/coverage.ts`
- `packages/core/src/economics.ts`
- `packages/core/src/command-service.ts`
- `packages/cli/src/index.ts`
- `packages/mcp/src/index.ts`
- `packages/local-api/src/index.ts`
- `apps/panel/src/main.tsx`

Phase 0 extracts registries and module folders without broadening PRD behavior.
It is a behavior-preserving refactor.

## Packet 0A: Schemas Extraction

Branch: `codex/phase-0-schemas`

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
packages/schemas/src/entities/specs/agents.ts
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

Allowed writes:

- `packages/core/src/**`
- `packages/core/src/*.test.ts`

Target shape:

```text
packages/core/src/context.ts
packages/core/src/entity-service.ts
packages/core/src/authority.ts
packages/core/src/lifecycle/
packages/core/src/prepared-actions/
packages/core/src/commands/
packages/core/src/domains/crm/
packages/core/src/domains/sales/
packages/core/src/domains/delivery/
packages/core/src/domains/products/
packages/core/src/domains/portfolio/
packages/core/src/domains/marketing/
packages/core/src/domains/career/
packages/core/src/domains/finance/
packages/core/src/domains/governance/
packages/core/src/domains/agents/
packages/core/src/workflows/
packages/core/src/gates/
packages/core/src/evidence/
packages/core/src/acceptance/
packages/core/src/recovery/
packages/core/src/index.ts
```

Acceptance:

- existing service tests pass;
- `executeStudioCommand` remains the only mutation runtime entrypoint;
- current command names and result envelopes are preserved;
- domain logic moves out of monolithic files into owned modules.
- imports from `@guilherme-studio/core` continue to work through the barrel.

## Packet 0C: Command Registry Extraction

Branch: `codex/phase-0-command-registry`

Allowed writes:

- `packages/core/src/commands/**`
- `packages/core/src/command-runtime.ts`
- `packages/core/src/command-runtime.test.ts`

Target shape:

```text
packages/core/src/commands/registry.ts
packages/core/src/commands/types.ts
packages/core/src/commands/handlers/
```

Acceptance:

- unknown command behavior is unchanged;
- dry-run behavior is unchanged;
- requirement/capability mapping is testable without reading the runtime
  switch;
- adding a PRD command no longer requires editing a large switch.
- the current dynamic import cycle from `command-runtime.ts` back to `index.ts`
  is removed or isolated behind command handler factories.

## Packet 0D: CLI Command Extraction

Branch: `codex/phase-0-cli-commands`

Allowed writes:

- `packages/cli/src/**`
- `packages/cli/src/index.test.ts`

Target shape:

```text
packages/cli/src/commands/
packages/cli/src/commands/domains/
packages/cli/src/renderers/
packages/cli/src/runtime/
packages/cli/src/index.ts
```

Acceptance:

- current CLI commands and exit codes are preserved;
- command modules can be owned by PRD agents;
- mutable commands still call `executeStudioCommand`;
- `--json` output remains stable for existing commands.
- current direct adapter shortcuts are explicitly classified as either
  read-only diagnostics or future command-runtime mutations.

## Packet 0E: API And MCP Extraction

Branch: `codex/phase-0-api-mcp`

Allowed writes:

- `packages/local-api/src/**`
- `packages/mcp/src/**`
- related tests if present

Target shape:

```text
packages/local-api/src/routes/
packages/local-api/src/server/
packages/local-api/src/security/
packages/mcp/src/resources/
packages/mcp/src/tools/
packages/mcp/src/prompts/
packages/mcp/src/server/
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

Allowed writes:

- `apps/panel/src/**`

Target shape:

```text
apps/panel/src/app/
apps/panel/src/components/
apps/panel/src/views/
apps/panel/src/api/
apps/panel/src/styles.css
```

Acceptance:

- current panel still renders;
- navigation can register one view per PRD domain;
- prepared action confirmation UI has a future owned surface;
- no generic YAML editor becomes the primary mutation flow.

## Integration Order

1. 0A schemas.
2. 0B core domains.
3. 0C command registry.
4. 0D CLI.
5. 0E API/MCP.
6. 0F panel.

If branches overlap, prefer integrating the lower-numbered packet first and
rebasing later packets onto it.

## Phase 0 Final Gate

Phase 0 is complete when:

- `npm run verify` passes;
- `npm run studio -- validate --json` passes;
- root status contains only intentional changes;
- hot files are registries or thin entrypoints;
- PRD agents have owned folders where they can add behavior without editing the
  same monolith.

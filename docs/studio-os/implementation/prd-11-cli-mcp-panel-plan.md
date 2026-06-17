# PRD 11 Implementation Plan: CLI, MCP, and Local Panel

Status: ready for implementation planning
Current harness estimate: 50%
Primary owner: `packages/cli`, `packages/mcp`, `packages/local-api`,
`apps/panel`

## Objective

Expose Studio Core through deterministic CLI, governed MCP and local panel
without allowing any interface to bypass gates or become canonical truth.

## Current Reality

Exists:

- CLI with global flags, semantic commands and acceptance reports;
- local API with command runtime route and read-only diagnostics;
- MCP server with resources/tools/prompts subset;
- panel with domain views and prepared-action payload review.

Gaps:

- CLI resources are still partly generic;
- MCP context packs and run handoff resources are incomplete;
- panel mutation flows are narrow;
- shared CLI/API/MCP equivalence is not broad enough;
- smoke tests are not always current in the active working state.

## Required Capabilities

- expose all mutable commands through CLI with `--dry-run`, `--json`,
  idempotency and expected revision where applicable;
- expose read/context tools through MCP;
- expose workflow prompts through MCP;
- expose domain views in panel without YAML editor as primary flow;
- panel exact-payload confirmation for protected actions;
- panel/API/MCP cannot bypass command runtime.

## Preferred Write Set

- `packages/cli/src/commands/`
- `packages/mcp/src/resources/`
- `packages/mcp/src/tools/`
- `packages/mcp/src/prompts/`
- `packages/local-api/src/routes/`
- `apps/panel/src/views/`
- interface equivalence tests.

## Cross-PRD Dependencies

- PRD 10 defines agent/run/context/handoff resources.
- Every domain PRD supplies command metadata and views.
- PRD 12 supplies Host/Origin, redaction and replay security.
- PRD 01 supplies command runtime and gates.

## Tests

- same mutation via CLI/API/MCP produces compatible envelope and event;
- protected action exact checksum review works in panel;
- MCP resources exclude secrets and unrelated context;
- CLI remains useful when panel and MCP are unavailable;
- panel does not bind publicly by default;
- stale projection triggers refresh/diagnostic, not silent overwrite.

## Acceptance

- interface behavior is coherent and boring;
- CLI is the fallback harness;
- MCP is the governed agent context surface;
- panel is review/visibility, not canonical state.


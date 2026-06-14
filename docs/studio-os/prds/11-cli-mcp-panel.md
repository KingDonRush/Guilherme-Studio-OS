# PRD 11: Studio CLI, MCP, and Local Panel

## Product Job

Expose the Studio Core through three coherent surfaces: deterministic CLI,
governed MCP, and a local operational panel.

## Shared Rule

No interface owns business logic. All mutations call Studio Core use cases and
produce the same events, gates, and errors.

## CLI Capabilities

Required command groups:

```text
studio init
studio inspect
studio client
studio opportunity
studio engagement
studio project
studio repo
studio task
studio evidence
studio campaign
studio application
studio status
studio validate
studio doctor
studio sync
studio backup
studio dashboard
```

Command requirements:

- `--json` machine output;
- human-readable default output;
- `--dry-run` for mutating commands where meaningful;
- explicit target IDs;
- confirmation tokens for protected actions;
- non-zero exit codes for invalid or blocked operations;
- no prompts when running in machine mode;
- idempotency keys for retryable mutations.

## MCP Capabilities

### Resources

- Constitution and active policies;
- entity schemas and lifecycle contracts;
- scoped context packs;
- repository and environment summaries;
- workflow instructions.

### Tools

- read and query entities;
- inspect next actions and health;
- prepare mutations;
- execute low-risk authorized mutations;
- validate artifacts;
- register evidence;
- prepare external actions;
- request confirmation status.

### Prompts

- opportunity qualification;
- engagement setup;
- implementation diagnosis;
- case seeding;
- content briefing;
- application preparation;
- handoff creation.

MCP must not expose raw secret stores or generic unrestricted shell access.

## Panel Capabilities

### Home

- revenue proximity;
- receivables and obligations;
- active engagements and blocked deliverables;
- sales and application pipelines;
- next actions;
- repository health;
- recent external actions.

### Domain views

- clients and engagements;
- prospects and opportunities;
- applications;
- products and releases;
- portfolio and campaigns;
- tasks and agent runs;
- diagnostics and backup health.

### Mutation behavior

- forms call the local API;
- protected actions show exact impact and confirmation;
- stale projections trigger refresh, not silent overwrite;
- panel state never becomes canonical.

## Runtime

- Panel binds to `127.0.0.1` by default.
- Remote access is out of scope for V1.
- The local API uses short-lived session protection and origin checks.
- CLI can start the panel with `studio dashboard`.
- MCP runs as a separate process consuming the same package core.

## Structural Ownership

```text
packages/cli/
packages/mcp/
apps/panel/
packages/local-api/
```

## Dependencies

- CLI depends on core and storage.
- MCP depends on core and MCP SDK.
- Local API depends on core.
- Panel depends on local API and read projections.
- No dependency flows from core to an interface.

## Acceptance Criteria

- Shared contract tests produce equivalent results across interfaces.
- Panel and MCP cannot bypass hard gates.
- CLI remains fully useful when panel and MCP are unavailable.
- Machine output is stable and schema-versioned.
- Panel does not bind publicly by default.
- External-action confirmation is exact-payload scoped.

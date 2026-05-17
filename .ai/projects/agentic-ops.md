# Agentic Ops

## Status

Concept and architecture specification.

No implementation repository exists yet.

## Purpose

Create a reusable operational layer for AI-assisted work:

- Core defines schemas, validators, presets, instruction packs, research,
  analysis, budgets, and handoff contracts.
- CLI executes deterministic operations over `.agentic-ops/`.
- MCP exposes resources, prompts, and safe tools so AI agents can use the CLI
  without drifting.

## Canonical Docs

- `docs/agentic-ops/README.md`
- `docs/agentic-ops/system-spec.md`
- `docs/agentic-ops/architecture.md`
- `docs/agentic-ops/implementation-plan.md`

## Current Decision

Build CLI-first, MCP-assisted.

The MCP should provide context and access to allowlisted CLI operations. It
should not become an autonomous planner. The CLI should write only
`.agentic-ops/` by default.

## V0 Scope

- core schemas;
- `aops inspect`;
- `aops init --non-destructive`;
- `aops validate`;
- `aops plan create`;
- `aops research brief`;
- MCP resources/prompts/tools for the same workflow.

## Out Of Scope For V0

- atom engine;
- DSL;
- automatic edits to `AGENTS.md`;
- multi-agent orchestration;
- deep CI integration;
- visual UI.

## Next Action

When ready, create a standalone `agentic-ops` repository and implement
`packages/core`, `packages/cli`, and `packages/mcp` from the docs.

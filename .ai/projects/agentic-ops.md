# Agentic Ops

## Status

Private implementation repository active.

- Local repo: `/home/kingdonrush/Área de trabalho/Dev/agentic-ops`
- GitHub: `https://github.com/KingDonRush/agentic-ops`
- Visibility: private
- Current implementation checkpoint: V2 / package version `0.3.0`

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

## Implemented

- core schemas and validators;
- `aops inspect`;
- `aops init --non-destructive`;
- `aops validate`;
- `aops plan create`;
- `aops research brief`;
- `aops phase create`;
- `aops task create`;
- `aops task start`;
- `aops task complete`;
- `aops subtask create`;
- `aops subplan create`;
- `aops test create`;
- `aops repo inspect`;
- `aops ci inspect`;
- `aops decision record`;
- `aops adapter create`;
- `aops readiness score`;
- `aops drift check`;
- `aops docs index`;
- `aops patch suggest`;
- `aops analyze`;
- `aops handoff create`;
- `aops snapshot create`;
- `aops diff`;
- `aops export`;
- MCP resources/prompts/tools for V2 validation, snapshots, exports, and
  allowlisted CLI execution.

## Still Out Of Scope

- atom engine;
- DSL;
- automatic edits to `AGENTS.md`;
- multi-agent orchestration;
- deep CI integration;
- visual UI.

## Next Action

Dogfood `agentic-ops` against this WordPress workspace and the Elementor
Implementation Toolkit repo, then decide whether V3 should add assisted task
execution, optional CI adapters, readiness trends, or chain/atom composition.

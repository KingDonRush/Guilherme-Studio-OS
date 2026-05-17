# Agentic Ops

Agentic Ops is a reusable operational layer for AI-assisted work.

It separates the system into three parts:

- **Core:** schemas, validation, presets, instruction packs, research method,
  analysis method, budgets, and shared rules.
- **CLI:** deterministic engine that inspects, initializes, validates, creates,
  exports, snapshots, and diffs operational artifacts.
- **MCP:** contextual and instructional layer that helps AI agents understand
  when and how to use the CLI without drifting.

The system exists so an AI can plan, research, decompose, validate, test,
execute, and hand off work without arbitrary planning, generic tasks, technical
hallucination, scope creep, weak handoffs, or loss of context between agents.

## Core Principle

During briefing, planning, and handoff, preserve this question:

> Como isso vai continuar funcionando depois que eu parar de explicar?

This is not a slogan. It is a continuity criterion.

## Document Map

- [System Specification](./system-spec.md): full conceptual and product spec.
- [Architecture](./architecture.md): package layout and runtime boundaries.
- [Operational Model](./operational-model.md): objects, lifecycle, presets, and
  workspace layer.
- [CLI Reference](./cli-reference.md): planned `aops` command surface.
- [MCP Reference](./mcp-reference.md): resources, prompts, tools, and expected
  agent behavior.
- [Research And Analysis](./research-analysis.md): research packets and analysis
  reports.
- [Schemas](./schemas.md): V0/V1 data contracts.
- [Roadmap](./roadmap.md): V0, V1, V2, anti-goals, and success criteria.
- [Implementation Plan](./implementation-plan.md): build sequence for the first
  repo.

## Current Decision

Build the system as a **CLI-first product with an MCP interface**.

The MCP should not become a giant planner. It should expose context, prompts,
schemas, and tools that help the AI use the CLI safely. The CLI should not be a
free-form reasoning agent. It should perform deterministic operations over
`.agentic-ops/` artifacts.

## V0 Thesis

The first version should be intentionally small:

- inspect a workspace;
- create a non-destructive `.agentic-ops/` overlay;
- create a plan from a preset and briefing;
- generate a refined research packet;
- validate core artifacts;
- expose the same instructions and schemas through MCP resources/prompts/tools.

V0 succeeds if an AI can start a project, create an operational plan, request
research with method, validate the plan, and hand off continuation without
polluting the target repository.

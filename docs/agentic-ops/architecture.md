# Agentic Ops Architecture

## Package Layout

```text
agentic-ops/
  packages/
    core/
      schemas/
      validators/
      presets/
      instruction-packs/
      research/
      analysis/
      budgets/
      handoff/
    cli/
      commands/
      storage/
      renderers/
      adapters/
    mcp/
      resources/
      prompts/
      tools/
      server/
```

## Core Package

The core package is pure operational logic.

Responsibilities:

- define object schemas;
- define preset contracts;
- define validation rules;
- define budget rules;
- define anti-drift checks;
- define research packet contracts;
- define analysis report contracts;
- define handoff packet contracts;
- expose reusable instruction packs.

The core package must not:

- inspect real workspaces directly;
- read or write `.agentic-ops/`;
- call AI models;
- call MCP clients;
- mutate repositories;
- run shell commands.

It should be usable by both CLI and MCP.

## CLI Package

The CLI is deterministic and file-oriented.

Responsibilities:

- inspect a workspace;
- create `.agentic-ops/`;
- create or update operational artifacts;
- validate artifacts with core validators;
- snapshot operational state;
- show diffs between operational states;
- export artifacts into JSON, YAML, Markdown, or text;
- keep operations non-destructive by default.

The CLI must not:

- infer broad strategy without explicit input;
- silently modify repository files outside `.agentic-ops/`;
- overwrite existing operational artifacts without a flag;
- edit `AGENTS.md`, docs, configs, or source code automatically;
- pretend to perform research.

## MCP Package

The MCP package exposes the system to AI agents.

Responsibilities:

- expose resources with instructions, schemas, presets, and examples;
- expose prompts for guided planning actions;
- expose tools that call safe CLI commands or core validators;
- explain when the AI should call each CLI command;
- keep the agent inside the expected workflow.

The MCP must not:

- become a separate planner with hidden behavior;
- mutate workspace files directly when the CLI can do it;
- replace the CLI validation layer;
- execute destructive commands;
- encourage task creation before orientation.

## Runtime Flow

Typical flow:

```text
AI client
  -> MCP resource: agentic_ops_overview
  -> MCP tool: inspect_workspace
  -> CLI: aops inspect
  -> MCP prompt: choose_preset
  -> MCP prompt: create_briefing
  -> MCP tool: suggest_non_destructive_init
  -> CLI: aops init --non-destructive --overlay
  -> CLI: aops plan create
  -> CLI: aops research brief
  -> CLI: aops validate plan
  -> MCP prompt: create_handoff
```

## Local Layer

The local workspace layer is:

```text
.agentic-ops/
```

This folder is the only default write target.

The manifest records:

- Agentic Ops version;
- workspace id;
- initialized date;
- mode: `new`, `overlay`, or `adopted`;
- detected agent instructions;
- detected stack;
- active preset;
- created artifacts;
- compatibility notes;
- safety notes.

## Overlay Mode

Overlay mode is used when a repository already has agent instructions or
planning structure.

In overlay mode:

- no existing agent file is overwritten;
- existing instructions are referenced as external context;
- compatibility notes are recorded;
- optional patch suggestions can be generated separately;
- Agentic Ops remains removable by deleting `.agentic-ops/`.

## Safety Model

Default behavior:

- read existing files;
- write only `.agentic-ops/`;
- never overwrite without confirmation;
- keep `--dry-run` available for mutating commands;
- produce optional patches rather than applying them;
- preserve audit logs.

Escalation behavior:

- `--force` requires explicit confirmation;
- external repo changes require a generated patch or separate user approval;
- production operations are out of scope for V0.

## MCP Basis

The Model Context Protocol separates server capabilities into resources,
prompts, and tools. Agentic Ops maps to that model as follows:

- resources: planning instructions, schemas, presets, examples, CLI reference;
- prompts: guided operations such as briefing, research packet, plan, handoff;
- tools: inspect, validate, snapshot, export, and controlled CLI invocation.

Primary references:

- [MCP server concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## Implementation Direction

V0 should avoid a custom atom engine or DSL.

Start with:

- schemas;
- validators;
- command handlers;
- MCP resources/prompts/tools;
- local storage.

Add compositional chains only when repeated CLI/MCP flows prove the need.

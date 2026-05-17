# Implementation Plan

## Phase 1: Repository Scaffold

Create a standalone repository:

```text
agentic-ops/
```

Recommended stack:

- TypeScript;
- pnpm workspaces;
- Node.js LTS;
- Zod or JSON Schema for validation;
- Vitest for tests;
- a lightweight CLI parser such as `commander` or `cac`;
- MCP TypeScript SDK for the MCP server.

Initial packages:

```text
packages/core
packages/cli
packages/mcp
```

## Phase 2: Core Contracts

Implement:

- schema registry;
- preset registry;
- budget rubric;
- validation result model;
- non-destructive policy constants;
- research packet schema;
- plan schema;
- task schema;
- handoff schema.

Tests:

- valid fixtures pass;
- missing required fields fail;
- unknown destructive modes fail;
- overlay mode validates.

## Phase 3: CLI V0

Implement:

- `aops inspect`;
- `aops init --non-destructive`;
- `aops validate`;
- `aops plan create`;
- `aops research brief`.

Storage:

- write only `.agentic-ops/` by default;
- support `--dry-run`;
- support JSON output;
- log operations.

Tests:

- empty workspace;
- workspace with `AGENTS.md`;
- workspace with existing `.agentic-ops/`;
- dry run does not write;
- init does not overwrite.

## Phase 4: MCP V0

Expose resources:

- overview;
- command reference;
- preset catalog;
- schema catalog;
- research method;
- handoff method.

Expose prompts:

- choose preset;
- create briefing;
- create plan;
- create research packet;
- validate operational contract;
- create handoff.

Expose tools:

- inspect workspace;
- suggest non-destructive init;
- validate plan;
- validate task;
- validate research packet;
- run allowlisted CLI command.

Tests:

- resources are discoverable;
- tools reject disallowed commands;
- tool output contains status and recommended next action;
- MCP server can run locally over stdio.

## Phase 5: Dogfood

Use Agentic Ops on:

1. its own repository;
2. the WordPress portfolio workspace;
3. the Elementor Implementation Toolkit repo;
4. one non-WordPress sample repo.

Capture:

- where the AI drifted less;
- where the CLI was too rigid;
- where the MCP prompts were too vague;
- which schemas were overbuilt;
- which missing commands were painful.

## Phase 6: V1 Planning

Only after V0 is useful, add:

- phases;
- subtasks;
- subplans;
- tests/subtests;
- snapshots;
- diff;
- export;
- analysis reports.

Do not build atom/chains/DSL until repeated real flows show duplication that
cannot be solved by presets and prompts.

## First Acceptance Criteria

V0 is acceptable when:

- `aops inspect` produces a useful workspace inspection;
- `aops init --non-destructive` creates `.agentic-ops/` without overwriting;
- `aops plan create` creates a valid plan skeleton;
- `aops research brief` creates a useful research packet;
- `aops validate` catches missing required fields;
- MCP resources and prompts explain how to use the CLI;
- MCP tools cannot write outside `.agentic-ops/`;
- the system can be removed by deleting `.agentic-ops/`.

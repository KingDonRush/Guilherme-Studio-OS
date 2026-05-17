# CLI Reference

The CLI binary is named:

```bash
aops
```

The CLI is deterministic, file-based, and non-destructive by default.

## Global Flags

```bash
--cwd <path>
--json
--dry-run
--verbose
--quiet
--no-color
```

Mutating commands should support:

```bash
--non-destructive
--force
--output <path>
```

`--force` requires explicit confirmation and must never be implied by MCP tools.

## V0 Commands

### `aops inspect`

Inspects the workspace.

Detects:

- project type;
- probable stack;
- package managers;
- frameworks;
- existing agent instructions;
- `.agentic-ops/`;
- `README.md`;
- `AGENTS.md`;
- docs structure;
- overwrite risks.

Example:

```bash
aops inspect --cwd . --json
```

Outputs:

```text
.agentic-ops/workspace-inspection.json
```

when called with a write mode, or stdout by default.

### `aops init --non-destructive`

Creates `.agentic-ops/` without overwriting anything.

Useful flags:

```bash
--overlay
--preset <preset-id>
--dry-run
--force
```

Expected behavior:

- if `.agentic-ops/` does not exist, create it;
- if it exists, validate it;
- if agent instructions exist, use overlay mode;
- never edit existing project files.

### `aops validate`

Validates the operational structure.

Targets:

```bash
aops validate workspace
aops validate plan
aops validate phase <id>
aops validate task <id>
aops validate subplan <id>
aops validate research <id>
aops validate test <id>
aops validate handoff
```

Validation should return:

- status;
- errors;
- warnings;
- missing fields;
- next recommended fix.

### `aops plan create`

Creates `plan.json` from a preset, briefing, or structured input.

Flags:

```bash
--preset <preset-id>
--from-brief <path>
--from-input <path>
--output <path>
--non-destructive
```

The command creates a plan skeleton. It does not pretend to have finished human
or AI reasoning.

### `aops research brief`

Generates a `research_packet`.

Important: this command does not search the web. It creates a refined research
instruction for an AI or research tool to execute.

Flags:

```bash
--question <text>
--decision <text>
--target plan|phase|task|subplan
--scope <text>
--output <path>
```

## V1 Commands

### `aops phase create`

Creates a phase with entry/exit conditions and required outputs.

### `aops task create`

Creates a task linked to a phase.

### `aops subtask create`

Creates a subtask linked to a task.

### `aops subplan create`

Creates a bounded Matrioshka subplan.

Required:

- parent task;
- purpose;
- scope boundary;
- entry condition;
- exit condition;
- max depth;
- budgets.

### `aops test create`

Creates a test linked to a plan, phase, task, or subplan.

### `aops analyze`

Generates analysis reports.

Types:

```bash
complexity
fit
technical
execution
scope
test
handoff-readiness
```

### `aops handoff create`

Creates `handoff_packet`.

### `aops snapshot create`

Creates a snapshot of the current operational state.

### `aops diff`

Shows differences between operational snapshots.

### `aops export`

Exports the operational plan.

Formats:

```bash
json
yaml
markdown
text
```

## CLI Exit Codes

Recommended:

- `0`: success;
- `1`: validation failed;
- `2`: invalid command input;
- `3`: workspace safety violation;
- `4`: missing dependency or unsupported environment;
- `5`: internal error.

## MCP Usage Rule

The MCP should call CLI commands only through a constrained tool that:

- supports allowlisted commands;
- blocks destructive flags by default;
- returns stdout, stderr, exit code, and parsed artifact path;
- logs the command under `.agentic-ops/logs/`.

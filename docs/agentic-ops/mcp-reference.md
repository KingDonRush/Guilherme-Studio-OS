# MCP Reference

The MCP is the contextual interface that helps AI agents use Agentic Ops.

It should expose resources, prompts, and tools. This matches the current Model
Context Protocol server capability model.

References:

- [MCP server concepts](https://modelcontextprotocol.io/docs/learn/server-concepts)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## MCP Responsibilities

The MCP should:

- give the AI the right context without copying huge instructions into every
  repository;
- explain available CLI commands;
- expose schemas and examples;
- suggest non-destructive initialization;
- validate artifacts;
- guide research packet creation;
- prevent direct jumps to generic tasks.

The MCP should not:

- replace the CLI;
- mutate arbitrary workspace files;
- become an autonomous planner with hidden behavior;
- skip user validation on risky decisions;
- execute destructive commands.

## Resources

Resources should include:

- `agentic_ops_overview`;
- `planning_instructions`;
- `briefing_protocol`;
- `preset_catalog`;
- `schema_catalog`;
- `budget_rules`;
- `research_packet_method`;
- `analysis_method`;
- `subplan_rules`;
- `test_method`;
- `handoff_method`;
- `cli_command_reference`;
- `non_destructive_policy`;
- `examples`.

## Prompts

Prompts should include:

- `create_operational_plan`;
- `choose_preset`;
- `create_briefing`;
- `create_phase`;
- `create_task`;
- `create_subtask`;
- `create_subplan`;
- `create_test`;
- `create_research_packet`;
- `run_refined_research`;
- `analyze_complexity`;
- `analyze_fit`;
- `analyze_scope`;
- `analyze_execution`;
- `create_handoff`;
- `validate_operational_contract`.

## Tools

Tools should include:

- `inspect_workspace`;
- `suggest_non_destructive_init`;
- `run_cli_command`;
- `validate_plan`;
- `validate_phase`;
- `validate_task`;
- `validate_subplan`;
- `validate_test`;
- `validate_research_packet`;
- `validate_handoff`;
- `create_snapshot`;
- `export_operational_plan`.

## Expected Agent Flow

1. First inspect the workspace.
2. If `.agentic-ops/` does not exist, suggest non-destructive init.
3. Choose a preset with justification.
4. Create briefing de encaixe.
5. Generate research packets when technical risk or reuse opportunity exists.
6. Create plan.
7. Create phases.
8. Create tasks and subtasks.
9. Create subplans only when needed.
10. Create tests and subtests.
11. Run validations.
12. Run final analysis separately from research.
13. Generate handoff.

## Guardrails

The MCP must block or warn when:

- the AI tries to create tasks before Phase 0;
- a plan has no preset;
- a task has no acceptance criteria;
- a subplan has no exit condition;
- a research packet has no decision dependency;
- a manual implementation lacks reuse analysis;
- a handoff lacks first next action;
- a CLI command attempts to write outside `.agentic-ops/`.

## `run_cli_command` Allowlist

V0 allowlist:

```text
aops inspect
aops init --non-destructive
aops validate
aops plan create
aops research brief
```

V1 allowlist:

```text
aops phase create
aops task create
aops subtask create
aops subplan create
aops test create
aops analyze
aops handoff create
aops snapshot create
aops diff
aops export
```

Blocked by default:

```text
--force
rm
git reset
git checkout --
arbitrary shell
editing AGENTS.md directly
writing outside .agentic-ops/
```

## Prompt Shape

Prompts should be short, scoped, and schema-bound.

Example prompt contract:

```json
{
  "prompt_id": "create_research_packet",
  "inputs": [
    "project_context",
    "decision_dependency",
    "allowed_scope",
    "forbidden_scope"
  ],
  "output_schema": "research_packet",
  "must_include": [
    "research_question",
    "decision_dependency",
    "sources_desired",
    "reuse_check",
    "plan_impact",
    "task_impact",
    "validation_needed"
  ]
}
```

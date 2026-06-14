# Task And Subplan Contracts

## Task Rule

A task is executable only when it has:

- a concrete objective;
- dependencies;
- expected outputs;
- acceptance criteria;
- budgets;
- risk notes;
- verification path;
- clear boundary.

Use:

- `.ai/templates/operational-planning/task.template.json`

## Subtask Rule

A subtask is a smaller action inside a task. It must not become its own hidden
plan.

Use subtasks for:

- ordered implementation steps;
- checks;
- file updates;
- small research items;
- focused QA actions.

Promote a subtask into a subplan when it becomes uncertain, multi-phase,
dependency-heavy, or too large for the parent task budget.

Use:

- `.ai/templates/operational-planning/subtask.template.json`

## TASK-001 Rule

The first task is always:

`TASK-001 - Plano-mae e ancoragem operacional`

It must contain:

- central objective;
- selected preset;
- assumptions;
- boundaries;
- recommended sequence;
- continuity criteria;
- anti-expansion rule;
- how the plan keeps working without further human explanation.

## Budget Fields

Every meaningful task and subplan must include:

- `time_budget`;
- `complexity_budget`;
- `context_budget`;
- `research_budget`;
- `iteration_budget`;
- `scope_budget`;
- `ambiguity_budget`;
- `validation_budget`.

Budgets are not estimates only. They are stop conditions.

## Complexity Levels

Use:

- `simple`: one clear action, low risk;
- `moderate`: multiple steps, known pattern;
- `complex`: multiple dependencies or verification paths;
- `very_complex`: should probably become a subplan.

## Priority Levels

Use:

- `critical`: blocks the project or anchors the plan;
- `high`: needed for core delivery;
- `medium`: useful after core structure exists;
- `low`: polish or optional support.

## Matrioshka Subplan Rule

A subplan is a closed internal plan for one part of the parent plan.

Use a subplan when a task:

- is too large;
- has its own phases;
- needs dedicated research;
- has visual QA loops;
- has integration risk;
- depends on human validation;
- could expand if not bounded.

Use:

- `.ai/templates/operational-planning/subplan.template.json`

## Subplan Stop Conditions

Stop and require human validation when:

- max depth is exceeded;
- scope boundary is crossed;
- ambiguity budget is exceeded;
- context budget is exceeded;
- the subplan needs another subplan beyond allowed depth;
- the subplan changes the parent objective.

## Dependency Rule

Every task should declare:

- `depends_on`: tasks that must finish first;
- `blocks`: tasks that cannot start until this one completes.

If those fields are empty, explain why the task is independent.

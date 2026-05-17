# Operational Planning Templates

Use these templates with `.ai/operational/ai-operational-planning-system.md`.

## Atomic Contracts

- `phase.template.json`: one plan phase.
- `task.template.json`: one executable task.
- `subtask.template.json`: one bounded child action.
- `subplan.template.json`: one closed Matrioshka plan.
- `research-entry.template.json`: one research evidence item.
- `preset-selector.matrix.json`: preset choice rules.
- `budget-rubric.json`: budgets, complexity levels, and stop conditions.

## Preset Starters

- `presets/visual-front-end-first.plan.json`
- `presets/full-stack-product.plan.json`
- `presets/cms-wordpress-elementor.plan.json`
- `presets/automation-integration-workflow.plan.json`
- `presets/research-strategy-conceptual.plan.json`

## Examples

- `examples/wordpress-elementor-admin-plan.example.json`

## Usage

1. Pick a preset starter.
2. Fill Phase 0 and briefing before legacy integration.
3. Add research entries as evidence, not prose.
4. Convert phases into task contracts.
5. Promote oversized tasks to subplan contracts.
6. Produce the final output using `../operational-plan-output.template.json`.

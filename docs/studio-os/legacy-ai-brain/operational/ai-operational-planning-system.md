# AI Operational Planning System

## Purpose

This is the entry point for turning fuzzy ideas, approved visual directions,
legacy plans, or broad project briefs into executable AI work.

Do not treat this as a single essay. This file routes the agent into a modular
planning system with reusable contracts, templates, and examples.

## Core Mantra

During briefing and planning, keep this explicit:

> Como isso vai continuar funcionando depois que eu parar de explicar?

After planning starts, the mantra becomes a constraint: every plan, task,
subplan, research entry, and handoff must reduce dependency on future human
explanation.

## Required Reading Order

For planning work, read in this order:

1. `planning-system/README.md`
2. `planning-system/phase-gates.md`
3. `planning-system/presets.md`
4. `planning-system/research-and-analysis.md`
5. `planning-system/task-and-subplan-contracts.md`
6. `planning-system/validation-and-handoff.md`
7. only then choose templates from `.ai/templates/operational-planning/`

For small requests, read only the first two files and the needed template. For
large or legacy plans, read the full set.

## Non-Negotiables

- Do not break a legacy plan into tasks before Phase 0 exists.
- Do not choose a preset without explaining the fit.
- Do not research and analyze in the same field.
- Do not create generic tasks without budgets and acceptance criteria.
- Do not create subplans that can expand forever.
- Do not hand off work without context, boundaries, and first action.
- Do not use visual-frame plans without also using `frame-driven-ui-qa.md`.
- Do not use WordPress/Elementor plans without checking whether existing
  plugins, APIs, or builder features can reduce custom code.

## Output Contract

Machine-readable plans should use:

- `.ai/templates/operational-plan-output.template.json`

Atomic reusable pieces live in:

- `.ai/templates/operational-planning/phase.template.json`
- `.ai/templates/operational-planning/task.template.json`
- `.ai/templates/operational-planning/subtask.template.json`
- `.ai/templates/operational-planning/subplan.template.json`
- `.ai/templates/operational-planning/research-entry.template.json`
- `.ai/templates/operational-planning/preset-selector.matrix.json`
- `.ai/templates/operational-planning/budget-rubric.json`

Preset-specific plan starters live in:

- `.ai/templates/operational-planning/presets/`

Examples live in:

- `.ai/templates/operational-planning/examples/`

## Done Means

The resulting plan is done only when another AI can:

1. identify the selected preset and why it was selected;
2. see what is crystallized, foggy, and dangerous;
3. inspect research evidence separately from analysis;
4. execute tasks in dependency order;
5. split oversized work into bounded subplans;
6. know when human validation is required;
7. continue from the handoff without asking the user to repeat the whole story.

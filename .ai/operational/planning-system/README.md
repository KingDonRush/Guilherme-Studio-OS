# Planning System Map

## What This System Does

This system turns intent into an operational contract.

It is designed for agentic work where a user may start with an incomplete idea,
a visual target, a legacy plan, or a broad technical direction. The agent must
reduce fog, choose a planning preset, research current facts, reuse existing
solutions where possible, generate tasks, and hand off the work without creating
an infinite-scope document.

## One-Pass Agent Procedure

1. State the mantra once during briefing:
   `Como isso vai continuar funcionando depois que eu parar de explicar?`
2. Run Phase 0 before touching the legacy plan.
3. Choose one preset or a justified hybrid.
4. Produce the briefing de encaixe.
5. Research only where facts can be stale or reuse can reduce custom work.
6. Generate the plan contract.
7. Generate tasks from the contract, not from vibes.
8. Turn oversized parts into bounded subplans.
9. Run final deep research.
10. Run final analysis separately from research.
11. Integrate the old plan after the new system exists.
12. Produce a handoff with first action and what not to rethink.

## File Roles

- `phase-gates.md`: mandatory sequencing and required artifacts.
- `presets.md`: how to choose visual, full-stack, CMS/WordPress, automation, or
  research strategy modes.
- `research-and-analysis.md`: how to collect evidence without mixing it with
  interpretation.
- `task-and-subplan-contracts.md`: task, subtask, budget, dependency, and
  Matrioshka rules.
- `validation-and-handoff.md`: acceptance, verification, human gates, and
  next-AI handoff rules.

## Template Roles

- `operational-plan-output.template.json`: full final output contract.
- `phase.template.json`: reusable phase contract.
- `task.template.json`: reusable task contract.
- `subtask.template.json`: reusable subtask contract.
- `subplan.template.json`: reusable Matrioshka contract.
- `research-entry.template.json`: reusable research evidence contract.
- `presets/*.plan.json`: starter plan shape for each planning preset.
- `examples/*.example.json`: filled examples that show expected density.

## Failure Modes This System Prevents

- The agent starts with a task list before understanding the project.
- The agent turns a visual target into generic UI tasks.
- The agent researches but does not explain how research changes the plan.
- The agent writes a beautiful plan that cannot be executed.
- The agent creates subplans that expand endlessly.
- The agent transfers cognitive load to the next AI.
- The user must re-explain the same intent after the handoff.

## Minimal Context Rule

For a new plan, load `phase-gates.md`, `presets.md`, and the matching preset
template first. Load task, subplan, research, and handoff templates only when
those artifacts are being created.

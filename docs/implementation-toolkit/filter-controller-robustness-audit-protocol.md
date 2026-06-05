# Filter Controller Robustness Audit Protocol

Date: 2026-06-05

Phase: `PHASE-FC-006`
Primary task: `TASK-FC-027`
Subplan: `SUBPLAN-FC-ROBUSTNESS-AUDIT`

Status: protocol complete, implementation not started.

## Purpose

This protocol exists because the Filter Controller has reached a product-surface
phase. From now on, a user example such as "Range labels are weird" or "Rating
has no stars" is not treated as an isolated fix by default. It is treated as a
signal that the shared contracts, the named filter type, and neighboring filter
types must be audited before implementation.

The goal is to stop the pattern where Codex repairs the visible example and
misses the code contract that made the example fail.

## Operating Rule

When Guilherme describes a filter issue as systemic, Codex must not fix only the
named filter type. Codex must first classify the concern across:

- source and field binding;
- preset persistence;
- Elementor content controls;
- Elementor style cadence;
- frontend render anatomy;
- frontend CSS containment;
- frontend JS state collection;
- REST payload shape;
- server resolver semantics;
- visual QA boundary.

Only after this classification should implementation tasks be created.

## Required Audit Template

Every finding must include:

- `task_id`: Agentic Ops task that owns the finding.
- `filter_type`: specific filter type or `cross-cutting`.
- `source_path`: file and line when available.
- `control_id`: Elementor control id if the issue starts in the editor.
- `preset_field`: saved preset key if persistence is involved.
- `render_selector`: frontend selector or data attribute.
- `js_contract`: editor or frontend JS behavior involved.
- `resolver_contract`: REST/server behavior involved.
- `failure_mode`: what can break for the user.
- `recommended_next_task`: analysis, implementation, test, or QA task.
- `qa_owner`: Codex for mechanical checks, Guilherme for nuanced visual/editor
  review, or both.

## Workflow

1. Confirm repository state in the root repo and plugin repo.
2. Read the local source before proposing a fix.
3. Build or update the source ownership map.
4. Classify the concern as one of:
   - cross-cutting contract gap;
   - per-filter visual depth gap;
   - Elementor editor fragility;
   - preset/data persistence gap;
   - resolver/runtime semantics gap;
   - QA-only visual judgment.
5. Produce audit output first.
6. Create implementation tasks only after the audit output exists.
7. Create tests separately from implementation tasks.

## QA Boundary

Codex owns:

- PHP syntax/lint checks;
- JSON schema validation;
- JS syntax checks;
- static CSS/selector review;
- source-to-render contract analysis;
- simple browser smoke checks when practical.

Guilherme owns final QA for:

- Elementor editor interactions with many clicks;
- motion quality;
- hierarchy and visual nuance;
- whether a control feels natural inside Elementor;
- complex visual comparison across many responsive states.

Codex may still do honest point inspections, but complex visual/editing
judgment remains Guilherme's final call.

## Implementation Gate

No implementation task should start unless the task states:

- which filter types are affected;
- which shared contract it changes;
- whether presets need migration or compatibility handling;
- what mechanical tests Codex can run;
- what visual/editor checks Guilherme must perform.

This gate is stricter for dynamic tags, preset storage, resolver semantics,
CSS layout containment, and Elementor editor APIs.

## Completion Decision

`TASK-FC-027` is complete when this protocol exists, the memory decision has the
example-as-signal rule, and later tasks can cite this document as their source of
acceptance.

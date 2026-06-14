# Phase Gates

## Rule

Phases are gates, not headings. A phase is complete only when its required
artifact exists.

## Phase 0: System Creation And Preset Selection

Goal: define how this project will be planned before decomposing anything.

Required artifact fields:

- project type;
- source base: visual, technical, strategic, functional, legacy, or hybrid;
- selected preset;
- rejected presets with reasons;
- method parts used;
- method parts not used;
- legacy plan integration strategy;
- dangerous uncertainty;
- human validation needs.

Fail condition: the agent starts summarizing or tasking the old plan before this
artifact exists.

## Phase 1: Briefing De Encaixe

Goal: help the user or next AI recognize the intended direction.

Required artifact fields:

- what the agent understood;
- what is crystallized;
- what is foggy;
- paths that seem to fit;
- paths discarded and why;
- what needs research;
- what is becoming operational contract;
- decisions that must not be made yet.

Fail condition: the briefing asks endless questions or pretends certainty where
the project is still foggy.

## Phase 2: Research During Planning

Goal: reduce risk and avoid reinventing the wheel.

Research when the plan touches:

- versions;
- frameworks;
- libraries;
- WordPress;
- Elementor;
- plugins;
- APIs;
- SDKs;
- no-code/low-code tools;
- open-source alternatives;
- compatibility;
- builder limitations;
- recent documentation changes.

Required artifact fields:

- research question;
- source;
- checked date;
- finding;
- impact on the plan;
- reuse opportunity;
- validation need.

Fail condition: research is copied into the plan without a decision impact.

## Phase 3: Plan Generation

Goal: create the operational contract.

Required artifact fields:

- objective;
- scope;
- out of scope;
- selected preset;
- phases;
- technical decisions;
- alternatives considered;
- reusable solutions found;
- dependencies;
- budgets;
- risks;
- validation points;
- acceptance criteria;
- execution strategy;
- handoff strategy.

Fail condition: phases are generic or could apply to any project.

## Phase 4: Tasks And Subtasks

Goal: turn the plan contract into executable units.

Required artifact fields per task:

- id;
- title;
- objective;
- priority;
- complexity;
- status;
- dependencies;
- blocked tasks;
- inputs required;
- expected outputs;
- acceptance criteria;
- budgets;
- risks;
- research required;
- human validation;
- subtasks;
- subplans.

First task is always:

`TASK-001 - Plano-mae e ancoragem operacional`

Fail condition: tasks lack dependency order, budgets, or acceptance criteria.

## Phase 5: Final Deep Research

Goal: selectively harden the plan after tasks exist.

Validate:

- technical choices;
- versions;
- compatibility;
- mature alternatives;
- dependency risks;
- maintenance risks;
- wheel reinvention;
- tasks that should become subplans;
- custom implementation that can be replaced by existing tooling.

Fail condition: this phase reopens the whole project instead of strengthening
the contract.

## Phase 6: Final Analysis

Goal: interpret research and adjust the plan.

Required analysis lenses:

- complexity;
- encaixe;
- execution;
- technical;
- scope;
- handoff.

Required output:

- issues found;
- adjustments made;
- remaining validation needs;
- plan readiness.

Fail condition: analysis repeats research facts without making decisions.

## Phase 7: Legacy Plan Integration

Goal: integrate the old plan only after the new system exists.

Required artifact fields:

- useful parts extracted;
- parts rewritten;
- parts discarded;
- conflicts found;
- crystallized decisions preserved;
- vague blocks converted;
- oversized blocks promoted to subplans;
- final integration notes.

Fail condition: the old plan dictates structure by inertia.

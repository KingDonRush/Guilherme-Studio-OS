# Operational Model

## Object Graph

```text
workspace
  project
    preset
    plan
      briefing
      phases[]
        tasks[]
          subtasks[]
          subplans[]
          tests[]
      research_packets[]
      decisions[]
      analysis_reports[]
      validation_results[]
      handoff_packet
      snapshots[]
```

## Workspace

Represents the inspected repository or folder.

Tracks:

- root path;
- detected stack;
- package managers;
- existing agent instructions;
- existing docs;
- risk of overwrite;
- `.agentic-ops/` presence;
- recommended mode.

## Project

Represents the human-intended project inside a workspace.

Tracks:

- name;
- objective;
- source inputs;
- known constraints;
- active preset;
- status;
- current operational contract.

## Preset

Represents a methodological hypothesis.

It is selected during Phase 0 and can be hybridized.

Tracks:

- id;
- reason selected;
- rejected alternatives;
- inherited rules;
- discarded rules;
- validation requirements;
- risk profile.

## Plan

The plan is the top-level operational contract.

It must contain:

- objective;
- scope;
- out of scope;
- preset;
- briefing;
- phases;
- tasks;
- research packets;
- decisions;
- budgets;
- tests;
- analysis;
- validation;
- handoff.

## Phase

A phase is a gate, not a heading.

It must have:

- entry condition;
- exit condition;
- required outputs;
- generated tasks;
- acceptance criteria;
- validation requirements.

## Task

A task is an executable unit.

It must be small enough to complete and validate without reinterpreting the
whole plan.

The first task is always:

```text
TASK-001 - Plano-mae e ancoragem operacional
```

## Subtask

A subtask is a smaller action inside a task.

If a subtask gains its own phases, research loop, scope risk, or validation
strategy, it should become a subplan.

## Subplan

A subplan is a bounded internal plan.

It must know:

- where it starts;
- where it stops;
- what it may expand into;
- what it must not expand into;
- which budget stops it;
- when human validation is required.

## Test And Subtest

Tests are first-class validation objects.

They can target:

- plan;
- phase;
- task;
- subtask;
- subplan;
- UI;
- API;
- integration;
- research;
- handoff.

Subtests break large validations into small observable checks.

## Research Packet

A research packet is a refined instruction for AI-performed research.

It does not search by itself. It defines what to research, why it matters, which
sources to prefer, what to compare, and how findings should affect the plan.

## Decision

A decision records a choice that should not be silently reopened.

It includes:

- decision statement;
- alternatives considered;
- rationale;
- source evidence;
- impact;
- reversibility;
- validation need.

## Budget

Budgets are stop conditions.

They constrain:

- time;
- complexity;
- context;
- research;
- iterations;
- scope;
- ambiguity;
- validation debt.

## Analysis Report

Analysis reports interpret evidence and operational state.

Types:

- complexity;
- encaixe;
- technical;
- execution;
- scope;
- test;
- handoff.

## Validation Result

Validation result records whether an artifact meets its contract.

It includes:

- target;
- validator;
- status;
- errors;
- warnings;
- recommendations;
- required human validation.

## Handoff Packet

The handoff packet enables another AI to continue.

It preserves:

- method;
- state;
- decisions;
- pending decisions;
- tasks;
- research;
- validations;
- next commands;
- next prompts;
- what not to reopen.

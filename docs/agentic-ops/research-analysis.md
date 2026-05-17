# Research And Analysis

## Core Rule

Research and analysis are separate objects.

Research asks and verifies.

Analysis interprets and decides.

## Research Packet

A `research_packet` is an instruction for refined research.

It contains:

- id;
- research question;
- reason;
- decision dependency;
- allowed scope;
- forbidden scope;
- desired sources;
- update policy;
- reliability signals;
- alternatives to compare;
- wheel reinvention risk;
- impact on plan;
- impact on tasks;
- recommendation;
- remaining uncertainty;
- validation required.

## Source Policy

Prefer:

- official documentation;
- source code;
- release notes;
- maintained repositories;
- standards;
- local evidence.

Use secondary articles only when they help interpret the primary source.

## Research Timing

### During Planning

Use to:

- avoid weak technical decisions;
- discover reusable solutions;
- verify versions;
- understand limitations;
- choose approach;
- decide whether work becomes task, subtask, or subplan.

### Final Deep Research

Use after the first plan version to:

- validate choices;
- detect incompatibilities;
- check mature alternatives;
- reduce maintenance risk;
- correct task sizing;
- strengthen the operational contract.

## Research Output

Research should produce evidence entries, not prose walls.

Each entry should include:

- source;
- checked date;
- finding;
- confidence;
- impact;
- follow-up need.

## Analysis Types

### Complexity Analysis

Evaluates:

- plan size;
- phase count;
- task count;
- dependencies;
- technical risk;
- integration risk;
- ambiguity risk;
- rework risk;
- need for subplans.

### Encaixe Analysis

Evaluates:

- fidelity to user intent;
- remaining fog;
- crystallized decisions;
- briefing needs;
- misalignment risk.

### Technical Analysis

Evaluates:

- stack;
- frameworks;
- libraries;
- plugins;
- existing solutions;
- viability;
- maintenance;
- compatibility;
- excess manual implementation.

### Execution Analysis

Evaluates:

- task order;
- dependencies;
- blockers;
- acceptance criteria;
- granularity;
- whether another AI can execute.

### Scope Analysis

Evaluates:

- scope expansion;
- open-ended subplans;
- missing boundaries;
- unrealistic budgets;
- out-of-scope drift.

### Test Analysis

Evaluates:

- coverage;
- testability;
- approval criteria;
- regressions;
- manual validation;
- automated validation.

### Handoff Analysis

Evaluates:

- preserved context;
- next-AI instructions;
- decisions made;
- pending decisions;
- next steps.

## Research-To-Analysis Boundary

Every analysis report should cite which research packets influenced it.

If an analysis decision has no research basis and the issue is volatile, mark it
as assumption or require validation.

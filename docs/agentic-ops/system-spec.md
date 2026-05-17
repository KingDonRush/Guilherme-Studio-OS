# Agentic Ops: Expanded System Specification

## Summary

Agentic Ops is a reusable operational layer for AI-assisted project work.

It helps AI agents plan, research, decompose, validate, test, execute, and hand
off projects with method. It is designed for many repositories and workflows,
not only for this WordPress portfolio.

The system has three major layers:

- **Core:** the shared operational contract.
- **CLI:** the deterministic execution engine.
- **MCP:** the instructional/contextual interface for AI agents.

The MCP orients the AI. The CLI performs concrete operations. The core defines
the schemas, presets, validations, research method, analysis method, budgets,
handoff rules, and anti-drift constraints used by both.

## Problems It Solves

Agentic Ops exists to prevent:

- arbitrary planning;
- lazy decomposition;
- generic tasks;
- technical hallucination;
- reinventing the wheel;
- infinite scope expansion;
- loss of context between agents;
- weak handoffs;
- drift between intention, plan, and execution;
- mixing research with analysis;
- treating hypotheses as facts;
- turning every project into a bespoke prompt pile.

## System Boundaries

### MCP Boundary

The MCP does not try to be the whole system.

It exposes:

- resources;
- prompts;
- schemas;
- presets;
- CLI command guidance;
- safe tools that call or validate CLI behavior.

It helps the AI decide what command or artifact should be used next.

### CLI Boundary

The CLI does not reason freely.

It:

- inspects;
- initializes;
- creates;
- validates;
- organizes;
- snapshots;
- diffs;
- exports.

It operates over explicit artifacts, mostly under `.agentic-ops/`.

### Core Boundary

The core does not run commands.

It provides:

- schemas;
- validators;
- presets;
- instruction packs;
- research packet rules;
- analysis report rules;
- budget rules;
- handoff contracts;
- anti-drift policies.

## Non-Destructive Workspace Layer

By default, Agentic Ops creates an isolated local layer:

```text
.agentic-ops/
  manifest.json
  workspace-inspection.json
  plan.json
  phases/
  tasks/
  subplans/
  tests/
  research/
  analysis/
  handoff/
  snapshots/
  logs/
```

This layer is non-destructive by default.

Agentic Ops must never overwrite:

- `AGENTS.md`;
- `README.md`;
- `package.json`;
- configuration files;
- source code;
- docs;
- existing agent instructions.

If a repository already contains agentic structure, Agentic Ops works in overlay
mode and records compatibility in `.agentic-ops/manifest.json`.

Expected agent message:

```text
This workspace already has agent instructions. I will create only the
.agentic-ops operational overlay and register compatibility. No existing file
will be overwritten.
```

If editing `AGENTS.md` would help, the system may generate an optional patch
proposal. It must not apply it automatically.

## Operational Mantra

During briefing, planning, and handoff:

> Como isso vai continuar funcionando depois que eu parar de explicar?

This question must influence:

- preset choice;
- briefing;
- research packets;
- budgets;
- task decomposition;
- subplans;
- acceptance criteria;
- validation;
- handoff.

Internally, the mantra acts as a continuity constraint. It should not become
decorative repetition.

## Encaixe Principle

The user may begin with a vague intention.

Agentic Ops should help the AI move progressively between:

- user intention;
- project shape;
- technical constraints;
- existing solutions;
- real scope;
- operational contract.

The AI must not act like a passive butler. It should brief, test hypotheses,
reduce ambiguity, and transform intention into operational decisions.

Encaixe is reached when:

- the objective is recognizable;
- the AI knows what not to reopen;
- the scope is bounded;
- technical decisions are justified;
- tasks are executable;
- budgets prevent unbounded expansion;
- another AI can continue without a new explanation from scratch.

Encaixe is a communication and decision protocol, not only a field in a task.

## Central Objects

The core model works with:

- `workspace`;
- `project`;
- `preset`;
- `plan`;
- `phase`;
- `task`;
- `subtask`;
- `subplan`;
- `test`;
- `subtest`;
- `research_packet`;
- `decision`;
- `budget`;
- `complexity_report`;
- `analysis_report`;
- `validation_result`;
- `handoff_packet`;
- `snapshot`.

Existing project artifacts may be imported as optional inputs. Agentic Ops can
extract decisions, constraints, and useful references from them without
automatically inheriting their structure.

## Supported Inputs

Agentic Ops can receive:

- raw idea;
- textual briefing;
- image;
- mockup;
- wireframe;
- technical documentation;
- existing repository;
- functional requirements;
- defined stack;
- task list;
- previous conversation;
- visual reference;
- existing research;
- context artifacts.

Raw input must be normalized before becoming plan, phase, task, subplan, test,
or handoff.

## Phase 0: Initial Orientation And Preset Choice

Before generating plans, phases, or tasks, the AI must orient the project.

It must:

1. identify the project type;
2. understand the apparent objective;
3. detect available material;
4. detect UI, code, documentation, stack, or defined requirements;
5. choose the best methodological preset;
6. justify the choice;
7. declare what remains unclear;
8. define what requires research;
9. define how the user will be briefed;
10. establish first scope boundaries.

Preset choice must consider:

- project nature;
- delivery type;
- uncertainty level;
- technical dependencies;
- scope risk;
- research need;
- human validation need;
- visual base;
- existing stack;
- risk of reinventing the wheel.

## Methodological Presets

Presets are initial methodological hypotheses. They are not lazy defaults.

Each selected preset must be justified and adapted to the project.

### Visual Front-End First

Use when the project starts from:

- image;
- mockup;
- wireframe;
- screenshot;
- visual reference;
- crystallized interface.

Focus:

- visual reading;
- component extraction;
- layout;
- minimum design system;
- responsiveness;
- interface states;
- animations;
- front-end implementation;
- visual validation;
- later integration.

### Full Stack Product

Use when the project is a complete functional product.

Focus:

- functional scope;
- architecture;
- database;
- API;
- authentication;
- permissions;
- front-end;
- integrations;
- tests;
- security;
- deployment;
- observability.

### CMS / WordPress / Elementor / Low-Code

Use when the project involves:

- WordPress;
- Elementor;
- Webflow;
- Framer;
- plugins;
- themes;
- CMS;
- no-code;
- low-code.

Focus:

- versions;
- compatibility;
- existing plugins;
- themes;
- builder limitations;
- reuse;
- performance;
- maintenance;
- exact points where custom code is justified.

### Automation / Integration / Workflow

Use when the project involves:

- APIs;
- webhooks;
- CRMs;
- spreadsheets;
- agents;
- external databases;
- queues;
- automations;
- SaaS tools;
- system integrations.

Focus:

- events;
- triggers;
- inputs;
- outputs;
- authentication;
- API limits;
- logs;
- retries;
- fallback;
- idempotency;
- monitoring.

### Research / Strategy / Conceptual System

Use when the project is still being formulated.

Focus:

- intention;
- hypotheses;
- benchmarking;
- alternatives;
- decision criteria;
- risks;
- scope definition;
- gradual conversion into executable plan.

### Refactor / Migration / Modernization

Use when a system already exists and the objective is to improve, migrate, or
reorganize it.

Focus:

- inventory;
- dependencies;
- regression risks;
- compatibility;
- safe phases;
- tests;
- rollback;
- incremental modernization.

### QA / Testing / Hardening

Use when the main objective is to validate, stabilize, or harden a system.

Focus:

- tests;
- subtests;
- acceptance criteria;
- security;
- performance;
- accessibility;
- edge cases;
- regressions;
- manual validation;
- automated validation.

### Hybrid Mode

Hybrid mode is allowed when no preset fits alone.

It must declare:

- dominant preset;
- auxiliary presets;
- why the combination is needed;
- inherited rules;
- discarded rules;
- risks of the combination.

## Briefing De Encaixe

Briefing is operational alignment. It is not praise, therapy, or passive
support.

The briefing must answer:

- What did I understand?
- What appears to be the real objective?
- What is already crystallized?
- What is still unclear?
- Which preset seems right?
- What needs research?
- Where can we reuse something existing?
- Where is there risk of reinventing the wheel?
- Where is there risk of infinite scope?
- Which decision is becoming operational contract?
- What needs human validation?

The AI should advance with explicit hypotheses when safe. It should request
validation only when uncertainty affects scope, architecture, cost, risk, or
intent.

## Research As Operational Packet

Research is not a magic autonomous search tool. It is a refined instruction
packet that forces the AI to research methodically.

A `research_packet` must contain:

- id;
- research question;
- research reason;
- decision that depends on it;
- allowed scope;
- forbidden scope;
- desired sources;
- update policy;
- reliability signals;
- alternatives to compare;
- wheel reinvention risk;
- plan impact;
- task impact;
- resulting recommendation;
- remaining uncertainty;
- required validation.

Research happens mainly:

1. during plan and task creation;
2. after the first plan version, as final deep research.

Planning research prevents weak technical decisions and discovers existing
solutions. Final deep research validates choices, detects incompatibility,
checks better alternatives, reduces maintenance risk, fixes task sizing, and
strengthens the operational contract.

Research must ask:

- Does something existing solve this better?
- Are we reinventing the wheel?
- Is the technology current?
- Is the dependency maintained?
- Is there compatibility risk?
- Is there a simpler, cheaper, or more stable path?
- Does this change architecture?
- Does this change tasks?
- Does this change budgets?

## Research Versus Analysis

Research collects, validates, and organizes information.

Analysis interprets, decides, and adjusts the plan.

Required analysis types:

- complexity analysis;
- encaixe analysis;
- technical analysis;
- execution analysis;
- scope analysis;
- test analysis;
- handoff analysis.

## Budgets

Budgets prevent generic defaults and unbounded expansion.

Tasks, subplans, and research packets can contain:

- `time_budget`;
- `complexity_budget`;
- `context_budget`;
- `research_budget`;
- `iteration_budget`;
- `scope_budget`;
- `ambiguity_budget`;
- `validation_budget`.

Defaults are initial hypotheses, not final answers.

## Matrioshka Subplans

Use subplans when a task is too large, too uncertain, or requires its own plan.

Each subplan must contain:

- `subplan_id`;
- `parent_task_id`;
- title;
- purpose;
- scope boundary;
- entry condition;
- exit condition;
- max depth;
- allowed expansion;
- forbidden expansion;
- budgets;
- internal tasks;
- internal tests;
- completion criteria;
- handoff notes.

Rules:

1. a subplan cannot open infinite scope;
2. every subplan must be closed in itself;
3. every subplan must state out-of-scope areas;
4. nested subplans need depth limits;
5. exceeding scope, context, complexity, or ambiguity requires human validation;
6. subplans do not replace the main plan;
7. subplans solve only one slice of the parent plan;
8. every subplan must know when to stop.

## Tests And Subtests

Tests are first-class objects.

A test can validate:

- plan;
- phase;
- task;
- subtask;
- subplan;
- integration;
- UI;
- API;
- performance;
- accessibility;
- security;
- handoff.

A test must contain:

- id;
- type;
- target;
- objective;
- preconditions;
- steps;
- expected result;
- pass criteria;
- evidence required;
- status;
- severity;
- dependencies;
- subtasks or subtests.

Test types:

- `acceptance_test`;
- `visual_test`;
- `functional_test`;
- `integration_test`;
- `regression_test`;
- `accessibility_test`;
- `performance_test`;
- `security_test`;
- `handoff_test`;
- `research_validation_test`.

Subtests break large validations into smaller checks.

## Tasks

Tasks are executable operational units, not generic checklist items.

A task must contain:

- id;
- title;
- description;
- objective;
- priority;
- complexity;
- status;
- phase id;
- dependencies;
- tasks blocked by it;
- required inputs;
- expected outputs;
- acceptance criteria;
- budgets;
- risks;
- research requirement;
- tests;
- human validation requirement;
- subtasks;
- subplans.

The first task of a plan is always:

```text
TASK-001 - Plano-mae e ancoragem operacional
```

It records:

- central objective;
- selected preset;
- assumptions;
- boundaries;
- recommended sequence;
- continuity criteria;
- anti-expansion rule;
- how the plan continues working without further human explanation.

## CLI

The CLI is the deterministic engine.

V0 commands:

- `aops inspect`;
- `aops init --non-destructive`;
- `aops validate`;
- `aops plan create`;
- `aops research brief`.

V1 commands:

- `aops phase create`;
- `aops task create`;
- `aops subtask create`;
- `aops subplan create`;
- `aops test create`;
- `aops analyze`;
- `aops handoff create`;
- `aops snapshot create`;
- `aops diff`;
- `aops export`.

## MCP

The MCP is the contextual intelligence layer.

It exposes:

- resources;
- prompts;
- tools.

It should guide the AI to:

1. inspect the workspace;
2. suggest non-destructive init if needed;
3. choose and justify a preset;
4. create briefing de encaixe;
5. generate research packets;
6. create plan;
7. create phases;
8. create tasks and subtasks;
9. create subplans only when necessary;
10. create tests and subtests;
11. validate;
12. analyze;
13. hand off.

The MCP must prevent direct jumps into generic tasks.

## Final Operational Contract

A plan is ready only when it contains:

- objective;
- scope;
- out of scope;
- selected preset;
- briefing;
- phases;
- tasks;
- subtasks;
- subplans when needed;
- research packets;
- decisions;
- budgets;
- acceptance criteria;
- tests;
- analysis;
- validations;
- handoff.

It must answer:

- What must be done?
- Why must it be done?
- In what order?
- With what boundaries?
- With what dependencies?
- With what risks?
- What must be researched?
- What has already been decided?
- What still needs validation?
- How do we know it is done?
- How does another AI continue?

## Anti-Drift Policy

The system should detect drift when an AI:

- changes the objective without recording a decision;
- creates tasks outside scope;
- chooses technology without research;
- ignores existing solutions;
- decomposes work generically;
- creates subplans without exit conditions;
- expands scope without budget;
- skips validation;
- generates incomplete handoff;
- treats hypotheses as facts.

When drift is detected, record:

- drift type;
- location;
- impact;
- proposed correction;
- required validation.

## Do Not Reinvent The Wheel Policy

Before manual implementation, check for:

- maintained library;
- suitable framework;
- plugin;
- template;
- component;
- architectural pattern;
- open-source solution;
- native stack feature;
- stable external service;
- ready automation;
- viable no-code/low-code tool.

Building from scratch requires justification.

Acceptable reasons:

- existing solution is incompatible;
- cost is too high;
- maintenance risk is unacceptable;
- required customization outweighs reuse;
- dependency is weak or abandoned;
- security requires more control;
- performance requires custom implementation.

## Handoff

The handoff is a package for another AI to continue without losing context.

It must include:

- current state;
- objective;
- preset used;
- decisions made;
- pending decisions;
- plan structure;
- completed tasks;
- pending tasks;
- risks;
- relevant research packets;
- validations;
- tests;
- next steps;
- what not to reopen;
- how to continue briefing the user;
- first recommended CLI command;
- first recommended MCP prompt.

The handoff preserves method, not only content.

## Anti-Objectives

Agentic Ops must not:

- become a pile of loose prompts;
- require copying huge instructions into every repository;
- overwrite user files by default;
- turn everything into generic tasks;
- pretend research happened;
- choose technology without justification;
- create infinite subplans;
- use presets as lazy defaults;
- turn briefing into flattery;
- push the method burden back onto the user;
- confuse planning with execution;
- confuse research with analysis;
- confuse handoff with summary.

## Success Definition

Agentic Ops works when:

- the AI knows how to start;
- the user understands the path;
- the project gains shape without losing intent;
- research reduces technical risk;
- the plan becomes an operational contract;
- tasks are executable;
- subplans are bounded;
- tests validate delivery;
- handoff enables continuity;
- the workspace is not contaminated;
- the system keeps working after the user stops explaining.

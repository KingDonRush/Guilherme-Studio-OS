# AI Operational Planning System

## Purpose

Use this protocol when a broad, nebulous, or legacy plan needs to become an
auditable execution system for AI work.

This is not a generic task list generator. Its job is to create a method for
planning, researching, decomposing, validating, integrating, and handing off
projects without hallucination, operational laziness, generic defaults, or
infinite scope expansion.

## Core Mantra

During briefing and planning, keep this explicit:

> Como isso vai continuar funcionando depois que eu parar de explicar?

After planning starts, this remains the operating principle. Do not repeat it as
decoration. Use it to turn fuzzy intention into an operational contract.

## Encaixe Principle

The user often works by approximation. They may see the shape of a result before
they can define it precisely.

The AI must route that approximation into a clearer contract:

1. make the intention less foggy;
2. test plausible alternatives;
3. surface constraints;
4. identify what already exists and can be reused;
5. shape the plan;
6. help the user recognize "this is it";
7. convert that recognition into an operational contract.

This is a communication and decision-making method. It is not a decorative field
inside a task object.

During briefing, state what is understood, what remains foggy, which paths make
sense, which risks exist, what needs research, and what decision is becoming a
technical contract. Do not passively obey every statement, but do not make the
user carry the planning method.

## When To Use

Use this protocol for:

- converting long plans into executable task systems;
- turning approved visual frames into implementation plans;
- planning WordPress, Elementor, plugin, CMS, no-code, or low-code work;
- creating handoffs for another AI;
- integrating an older plan into a better operational system;
- defining subplans for complex or uncertain project slices.

Do not use this protocol for tiny one-step fixes, simple command output, or
small local edits where the core loop is sufficient.

## Required Phase Gates

### Phase 0: Create The System And Choose The Preset

Before breaking a legacy plan into tasks:

1. understand the project type;
2. identify whether the base is visual, technical, strategic, or functional;
3. choose the most appropriate preset;
4. justify why that preset fits;
5. declare which method parts will be used;
6. declare which method parts will not be used;
7. define how any old plan will be integrated later.

Never choose a preset arbitrarily. Consider delivery type, uncertainty,
technical dependencies, research needs, scope risk, human validation, what is
already crystallized, and what remains nebulous.

### Phase 1: Briefing De Encaixe

Create a short briefing for the user or next AI before generating tasks.

It must answer:

1. What seems to be the real objective?
2. What is already crystallized?
3. What remains foggy?
4. Which preset fits best?
5. What needs research?
6. Where is there a risk of reinventing the wheel?
7. What must become an operational contract?
8. Which decisions should not be made yet?

### Phase 2: Research During Planning

Research when there is risk of outdated information, technical dependency, or a
chance to reuse an existing solution.

Research especially for versions, frameworks, libraries, WordPress, Elementor,
plugins, APIs, SDKs, integrations, no-code tools, architecture patterns, ready
components, templates, open-source solutions, compatibility risks, and recent
documentation changes.

Research must answer operational questions:

- Is there something ready that avoids custom implementation?
- Is there a mature framework, plugin, library, or pattern?
- Is the mentioned technology still current?
- Are there known incompatibilities?
- Is there a simpler, more stable, or cheaper path?
- Does this help the plan keep working without more explanation?

Do not research to pad the plan. Research to reduce risk and sharpen decisions.
If live research is unavailable, state the limitation and mark affected items as
`requires_validation: true`.

### Phase 3: Generate The Plan

After briefing and initial research, generate the plan with:

- objective;
- scope;
- out of scope;
- selected preset;
- phases;
- technical decisions;
- dependencies;
- alternatives considered;
- reusable solutions found;
- risks;
- budgets;
- human validation points;
- acceptance criteria;
- execution strategy;
- handoff strategy.

Each phase must have a clear role inside the operational contract.

### Phase 4: Generate Tasks And Subtasks

Convert the plan into tasks only after the system, preset, briefing, and research
exist.

The first task is always:

`TASK-001 - Plano-mae e ancoragem operacional`

That task seeds the rest of the plan. It records the central objective, selected
preset, assumptions, limits, recommended sequence, continuity criteria, how to
avoid infinite expansion, and how the plan will keep working without further
human explanation.

### Phase 5: Final Deep Research

After generating the plan and tasks, run a deeper selective research pass.

Validate technical choices, versions, compatibility, existing solutions,
maintenance risks, dependency risks, better alternatives, places where the plan
reinvents the wheel, and places where a task should become a subplan.

This phase strengthens the contract. It does not reopen the whole scope.

### Phase 6: Final Analysis

Separate research from analysis.

Research collects and validates information. Analysis interprets, decides, and
adjusts the plan.

Review the plan through these lenses:

- complexity: size, vague subtasks, oversized tasks, missing dependencies;
- encaixe: fidelity to the user's intent, remaining fog, validation needs;
- execution: whether another AI can execute without asking everything again;
- technical: justified decisions, reuse opportunities, compatibility risks;
- scope: overreach, infinite expansion, subplan closure, budgets;
- handoff: preserved context, clear instructions, low external dependency.

If the analysis finds failures, adjust the plan before finalizing.

### Phase 7: Integrate The Legacy Plan

Only integrate the old plan after the system, preset, briefing, planning,
research, and analysis exist.

When integrating:

1. do not accept the old structure as definitive;
2. extract useful parts;
3. discard redundancies;
4. correct vague parts;
5. turn large blocks into tasks;
6. turn complex parts into subplans;
7. preserve crystallized decisions;
8. mark validation needs;
9. record conflicts between old and new systems;
10. convert the result into the final operational contract.

## Presets

### Visual Front-End First

Use when a project starts from an image, mockup, wireframe, screenshot,
reference, or crystallized interface.

Focus on visual analysis, components, layout, minimal design system,
responsiveness, interface states, animations, front-end implementation, visual
validation, and later integration.

For approved frames, this preset must combine with
`operational/frame-driven-ui-qa.md`.

### Full Stack Product

Use when a project involves a complete product with front-end, back-end,
database, authentication, APIs, permissions, integrations, and deployment.

Focus on functional scope, architecture, data modeling, API, authentication,
permissions, front-end, integrations, tests, security, deployment, and
observability.

### CMS / WordPress / Elementor / No-Code / Low-Code

Use when a project involves WordPress, Elementor, plugins, CMS, site builders,
site automation, or no-code/low-code tools.

Focus on tool versions, compatibility, existing plugins, themes, builder limits,
reuse of components, performance risks, maintenance, and the exact points where
custom code is justified.

For Elementor widgets or controls, combine with
`operational/elementor-evidence-map.md`.

### Automation / Integration / Workflow

Use when a project involves automations, APIs, webhooks, agents, CRMs,
databases, spreadsheets, or external systems.

Focus on input events, flows, triggers, systems involved, authentication, API
limits, error handling, logs, retries, fallback, and monitoring.

### Research / Strategy / Conceptual System

Use when a project is still in formulation, strategy, research, conceptual
architecture, documentation, product definition, or methodology building.

Focus on intention, hypotheses, alternatives, decision criteria, risks,
benchmarking, synthesis, and gradual transformation into an executable plan.

Use hybrid mode when no single preset fits. State which presets were combined
and why.

## Budget Contract

Relevant tasks must contain explicit budgets:

- `time_budget`: estimated effort limit;
- `complexity_budget`: maximum acceptable complexity before splitting;
- `context_budget`: maximum context size before requiring summary;
- `research_budget`: how much research before deciding;
- `iteration_budget`: acceptable adjustment rounds;
- `scope_budget`: how far the task can expand before becoming a subplan;
- `ambiguity_budget`: acceptable uncertainty;
- `validation_budget`: how many pending decisions can remain before human
  validation is required.

Defaults are hypotheses. They must be justified or adjusted to the project.

## Matrioshka Subplan Contract

Use subplans when a task is too large, too uncertain, or needs its own plan.

Each subplan must include:

- `subplan_id`;
- `parent_task_id`;
- `title`;
- `purpose`;
- `scope_boundary`;
- `entry_condition`;
- `exit_condition`;
- `max_depth`;
- `allowed_expansion`;
- `forbidden_expansion`;
- `budgets`;
- `tasks`;
- `completion_criteria`;
- `handoff_notes`.

Rules:

1. subplans cannot open infinite scope;
2. every subplan is closed in itself;
3. every subplan declares what is out of scope;
4. subplans can contain subplans only within the declared depth limit;
5. if scope, context, complexity, or ambiguity exceeds the budget, require
   human validation;
6. subplans do not replace the main plan;
7. subplans solve one specific slice of the parent plan.

## Communication Protocol

During briefing and planning:

1. show what was understood;
2. show what remains foggy;
3. show which paths seem to fit;
4. show which paths should be discarded and why;
5. show what needs research;
6. show when a decision is becoming a technical contract;
7. do not pretend certainty;
8. do not ask endless questions;
9. advance with explicit hypotheses when safe;
10. ask for validation when uncertainty is dangerous.

## Output Contract

The final planning response should be valid JSON when the user asks for a
machine-readable plan.

It should contain these top-level areas:

- `project_meta`;
- `phase_0_system_creation`;
- `briefing_layer`;
- `research_layer`;
- `plan`;
- `analysis_layer`;
- `tasks`;
- `legacy_plan_integration`;
- `subplan_system`;
- `handoff_to_next_ai`.

Use `.ai/templates/operational-plan-generator.md` to generate a new plan and
`.ai/templates/operational-plan-output.template.json` as the output skeleton.

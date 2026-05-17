# Planning Presets

## Selection Rule

Choose the preset that matches the source of certainty.

- If the certainty is visual, use Visual Front-End First.
- If the certainty is product behavior across stack layers, use Full Stack
  Product.
- If the certainty is a CMS/builder environment, use CMS / WordPress /
  Elementor / No-Code / Low-Code.
- If the certainty is event flow between systems, use Automation /
  Integration / Workflow.
- If the certainty is still conceptual, use Research / Strategy / Conceptual
  System.

Use hybrid mode only when two sources of certainty are genuinely active.

## Preset: Visual Front-End First

Use when the project starts from an approved image, mockup, frame, screenshot,
wireframe, or visual reference.

Required outputs:

- visual source inventory;
- component extraction;
- layout contract;
- design token map;
- state map;
- responsive map;
- animation policy;
- implementation sequence;
- visual QA loop;
- integration handoff.

Must also use:

- `operational/frame-driven-ui-qa.md`

Do not use for:

- backend-only work;
- strategy documents without visual source;
- generic UI brainstorming.

Template:

- `.ai/templates/operational-planning/presets/visual-front-end-first.plan.json`

## Preset: Full Stack Product

Use when the project includes front-end, backend, data, auth, API,
permissions, integrations, deployment, or observability.

Required outputs:

- functional scope;
- architecture;
- data model;
- API contract;
- authentication and permission contract;
- front-end contract;
- integration contract;
- test strategy;
- security strategy;
- deploy strategy;
- observability strategy.

Do not use for:

- a purely visual implementation;
- a WordPress plugin setting page unless backend/domain behavior is broad enough.

Template:

- `.ai/templates/operational-planning/presets/full-stack-product.plan.json`

## Preset: CMS / WordPress / Elementor / No-Code / Low-Code

Use when the project depends on WordPress, Elementor, plugins, themes, CMS
content, site builders, no-code tools, or low-code automation.

Required outputs:

- environment assumptions;
- current version research;
- existing plugin/theme inventory;
- builder limitation map;
- reuse-before-custom-code analysis;
- compatibility risk map;
- performance risk map;
- maintenance model;
- custom-code justification list;
- QA plan using WordPress, browser, and relevant builder evidence.

Must also use when relevant:

- `operational/elementor-evidence-map.md`
- `operational/evidence-first.md`
- `operational/wordpress-containment.md`

Template:

- `.ai/templates/operational-planning/presets/cms-wordpress-elementor.plan.json`

## Preset: Automation / Integration / Workflow

Use when the project is mainly about events, triggers, APIs, webhooks, agents,
CRMs, databases, sheets, or external services.

Required outputs:

- event inventory;
- source and destination systems;
- trigger contract;
- authentication model;
- API limits;
- error handling;
- retry and fallback plan;
- logging model;
- monitoring plan;
- manual recovery plan.

Template:

- `.ai/templates/operational-planning/presets/automation-integration-workflow.plan.json`

## Preset: Research / Strategy / Conceptual System

Use when the project is still about formulation, positioning, architecture,
methodology, documentation, or product definition.

Required outputs:

- intent statement;
- hypotheses;
- alternatives;
- decision criteria;
- benchmark plan;
- risk map;
- synthesis;
- conversion path into executable plan.

Template:

- `.ai/templates/operational-planning/presets/research-strategy-conceptual.plan.json`

## Hybrid Mode

Hybrid mode must declare:

- primary preset;
- secondary preset;
- why both are needed;
- which preset owns execution;
- which preset only informs research or validation;
- what scope is forbidden to prevent expansion.

Example:

For a WordPress admin UI based on approved frames, use:

- primary: `cms_wordpress_elementor_no_code_low_code`;
- secondary: `visual_front_end_first`;
- owner: CMS preset owns WordPress constraints, visual preset owns frame QA.

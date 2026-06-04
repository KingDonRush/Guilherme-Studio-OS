# Filter Controller Four-Point Agentic Subplan

Date: 2026-06-04

Agentic Ops validation: valid.

Task validation: `TASK-FC-001` through `TASK-FC-006` and `TASK-FC-009`
through `TASK-FC-017` valid.

Execution status: `TASK-FC-001` complete through
`docs/implementation-toolkit/filter-controller-preset-contract-inventory.md`.
`TASK-FC-002` complete through
`docs/implementation-toolkit/filter-controller-widget-save-security-contract.md`.
`TASK-FC-003` complete through
`docs/implementation-toolkit/filter-controller-widget-save-implementation.md`.

Per-type audit subplan validation: all 10 filter-type subplans valid.

Audit subplans, one per filter type:

- `SUBPLAN-FC-AUDIT-RANGE`, child of `TASK-FC-006`.
- `SUBPLAN-FC-AUDIT-CHECKBOX`, child of `TASK-FC-009`.
- `SUBPLAN-FC-AUDIT-RADIO`, child of `TASK-FC-010`.
- `SUBPLAN-FC-AUDIT-CHIPS`, child of `TASK-FC-011`.
- `SUBPLAN-FC-AUDIT-TOGGLE`, child of `TASK-FC-012`.
- `SUBPLAN-FC-AUDIT-SWATCH`, child of `TASK-FC-013`.
- `SUBPLAN-FC-AUDIT-SEARCH`, child of `TASK-FC-014`.
- `SUBPLAN-FC-AUDIT-SELECT`, child of `TASK-FC-015`.
- `SUBPLAN-FC-AUDIT-DATE`, child of `TASK-FC-016`.
- `SUBPLAN-FC-AUDIT-RATING`, child of `TASK-FC-017`.

## Objective

Deliver the Filter Controller as a widget-first preset workflow without losing
the product depth that comes from auditing each filter type carefully.

The four points are:

1. Save a preset from the Elementor widget.
2. Make wp-admin a preset library, preview, and diagnostics surface.
3. Load/reuse a saved preset from another widget instance.
4. Audit and deepen each filter type and its subelements before adding broad
   customization.

## Operating Rule

Do not confuse a technical pass with product completion.

The range slider bug in vertical mode proves the risk: a control can render and
still feel underdesigned because its subelements, switchers, positions, labels,
states, and responsive behavior were not audited as their own component system.

## Boundaries

In scope:

- Elementor Filter Controller widget;
- existing saved preset infrastructure;
- wp-admin preset library and preview;
- REST/AJAX save/load paths if capability and nonce protected;
- per-type audit documents before deeper styling work;
- mechanical QA by Codex and frontend/editor QA by Guilherme.

Out of scope:

- JetSmartFilters parity;
- replacing the DOM-provider filtering runtime;
- turning wp-admin into a visual builder;
- aesthetic/portfolio presentation work;
- implementing all type customizations in one pass;
- Elementor Pro-only dependency as public architecture.

## Phase 1: Contract And Persistence Inventory

Purpose: define exactly what a preset is before save/load UI exists.

Agentic task:

- `TASK-FC-001`: Inventory preset and widget setting contract.

Tasks:

- inventory current `FilterPresets`, admin save shape, widget settings, and
  runtime config;
- decide which widget settings are part of a preset and which remain local;
- define preset identity: name, slug/key, source widget, updated date, version;
- define link/copy semantics:
  - linked preset: widget follows saved preset;
  - detached copy: widget imports preset values and then diverges locally;
- define migration/version field for future preset shape changes.

Acceptance:

- preset schema is explicit;
- local-only style overrides are identified;
- no save/load implementation starts without capability and nonce contract;
- existing presets remain readable.

Stop if:

- current admin preset shape cannot represent widget-built filters without data
  loss;
- linked vs detached semantics are still ambiguous.

## Phase 2: Save Preset From Widget

Purpose: let Elementor be the primary composition surface.

Agentic tasks:

- `TASK-FC-002`: Define widget preset save security contract.
- `TASK-FC-003`: Implement save preset from Elementor widget.

Tasks:

- design a minimal widget-side save flow;
- choose implementation surface: editor JS action plus protected REST/AJAX
  endpoint, or existing admin endpoint reuse if suitable;
- add nonce and capability checks;
- sanitize and normalize saved filter rows;
- return saved preset ID/key to the editor;
- make the editor state update predictably after save.

Acceptance:

- a manually built widget configuration can be saved as a preset;
- saved preset appears in existing storage/admin data;
- invalid filter rows fail safely;
- save does not require Elementor Pro;
- Codex can smoke-test the endpoint mechanically.

Stop if:

- Elementor editor context cannot provide a safe nonce/capability path without
  a smaller prerequisite task;
- the save UI requires a custom control surface that would become a separate
  builder.

## Phase 3: Admin Library, Preview, And Diagnostics

Purpose: make admin useful without making it the builder.

Agentic task:

- `TASK-FC-004`: Reframe admin presets as library, preview, and diagnostics.

Execution status:

- `TASK-FC-004`: done. Admin now acts as preset library, normalized structure
  preview, and diagnostics surface while keeping Elementor as the visual builder.

Tasks:

- reframe existing preset admin page as a saved preset library;
- show name, key, source, filter count, target selector, item selector, and
  updated date;
- show a render/preview of the preset structure;
- show diagnostics: missing target, empty options, unsupported fields, unknown
  filter type, unverified selectors;
- preserve rename, duplicate, delete, and recovery flows;
- mark admin-only edits as secondary, not primary.

Acceptance:

- admin answers "what exists?", "where did it come from?", "is it healthy?",
  and "can I reuse/recover it?";
- admin does not imply it is the required place to build filters;
- preview reflects the same normalized data the widget loads.

Stop if:

- preview starts requiring a full page/Elementor rendering context before the
  basic library is useful;
- admin UI begins duplicating the full widget builder.

## Phase 4: Load And Reuse Preset In Widget

Purpose: make presets reusable across pages/widgets.

Agentic task:

- `TASK-FC-005`: Implement widget preset load and reuse states.

Execution status:

- `TASK-FC-005`: done. Widget reuse now exposes linked/unselected/missing/local
  states, protected detached import, and runtime config state markers.

Tasks:

- expose saved presets in the widget;
- load preset settings deterministically;
- support linked and detached modes if Phase 1 confirms both;
- make conflict behavior explicit when a widget already has local filters;
- preserve manual widget composition for one-off filters;
- add clear editor copy so implementers know whether they are editing a preset
  or a local copy.

Acceptance:

- another widget can select a saved preset and render the same filter structure;
- detach/import behavior is deterministic;
- local overrides do not silently mutate the saved preset;
- missing/deleted preset fails with a recoverable editor/admin state.

Stop if:

- loading presets would overwrite local widget settings without explicit user
  intent;
- widget cannot distinguish linked preset from copied preset.

## Phase 5: Filter-Type Audit And Customization Backlog

Purpose: prevent shallow customization from shipping as "done".

Agentic tasks:

- `TASK-FC-006`: Produce range component audit sheet.
- `TASK-FC-009`: Produce checkbox component audit sheet.
- `TASK-FC-010`: Produce radio component audit sheet.
- `TASK-FC-011`: Produce chips component audit sheet.
- `TASK-FC-012`: Produce toggle component audit sheet.
- `TASK-FC-013`: Produce swatch component audit sheet.
- `TASK-FC-014`: Produce search component audit sheet.
- `TASK-FC-015`: Produce select component audit sheet.
- `TASK-FC-016`: Produce date component audit sheet.
- `TASK-FC-017`: Produce rating component audit sheet.

Execution status:

- `TASK-FC-006`: done. Range is now audited as a component system through
  `docs/implementation-toolkit/filter-controller-audit-range.md`, with vertical
  layout, switcher contracts, numeric inputs, labels, ticks, track, handles,
  mechanical bugs, product customization, deferred ideas, and Guilherme QA
  separated before implementation.
- `TASK-FC-009` through `TASK-FC-017`: done. Checkbox, radio, chips, toggle,
  swatch, search, select, date, and rating now each have a dedicated component
  audit sheet under `docs/implementation-toolkit/`, separating DOM anatomy,
  behavior semantics, mechanical bugs, product controls, deferred ideas, and
  Guilherme QA scenarios.
- `TASK-FC-018`: done. First implementation slice from the range audit is
  recorded in
  `docs/implementation-toolkit/filter-controller-range-slice-a-implementation.md`:
  current value labels and scale ticks now have distinct copy/control targets,
  range markup exposes explicit state classes, and vertical CSS no longer uses
  one fixed four-rail grid when value/tick rails are disabled.

Child subplans:

- `TASK-FC-006` owns `SUBPLAN-FC-AUDIT-RANGE`.
- `TASK-FC-009` owns `SUBPLAN-FC-AUDIT-CHECKBOX`.
- `TASK-FC-010` owns `SUBPLAN-FC-AUDIT-RADIO`.
- `TASK-FC-011` owns `SUBPLAN-FC-AUDIT-CHIPS`.
- `TASK-FC-012` owns `SUBPLAN-FC-AUDIT-TOGGLE`.
- `TASK-FC-013` owns `SUBPLAN-FC-AUDIT-SWATCH`.
- `TASK-FC-014` owns `SUBPLAN-FC-AUDIT-SEARCH`.
- `TASK-FC-015` owns `SUBPLAN-FC-AUDIT-SELECT`.
- `TASK-FC-016` owns `SUBPLAN-FC-AUDIT-DATE`.
- `TASK-FC-017` owns `SUBPLAN-FC-AUDIT-RATING`.

Tasks:

- create a component sheet for each filter type:
  - search;
  - select;
  - checkbox;
  - radio;
  - chips;
  - toggle;
  - swatch;
  - range;
  - date;
  - rating;
- for each type, map:
  - DOM anatomy;
  - switcher contracts;
  - subelements;
  - state matrix;
  - responsive behavior;
  - style controls needed now;
  - controls that should wait;
  - QA scenario for Guilherme;
- implement type improvements in slices, not all at once.

Acceptance:

- each filter type has a written audit before deep customization;
- Style controls are type-scoped and do not bloat unrelated sections;
- switchers remove or avoid reserving their dependent subelements;
- visible labels, markers, options, handles, icons, and states are treated as
  first-class subelements.

First audit target:

- range, because vertical labels/ticks already exposed product debt.

Stop if:

- a type audit turns into immediate implementation without a component sheet;
- a control is added only because it is easy, not because the component anatomy
  requires it.

## Verification Strategy

Codex mechanical QA:

- PHP lint;
- JS syntax checks;
- Composer validation/autoload;
- WP-CLI endpoint/render smokes;
- generated HTML contracts;
- simple screenshot checks for gross breakage.

Guilherme frontend QA:

- Elementor editor flows;
- many-click interactions;
- motion;
- visual hierarchy;
- nuanced responsive judgment;
- final craft approval.

## Commit And Git Policy

Git mode: `checkpoint-branch` until each phase becomes a publishable
`public-unit`.

Expected public units:

1. preset schema/save path;
2. admin library/preview;
3. widget load/reuse path;
4. type audit documents;
5. type-specific customization slices.

Do not accumulate more than three unpublished commits for one slice without
creating a publication plan.

## Completion Criteria

This subplan is complete when:

- widget-built presets can be saved;
- admin lists and previews saved presets;
- another widget can load/reuse a preset safely;
- every filter type has a component audit;
- at least the first type-specific customization slice follows the audit method;
- Guilherme has a focused QA checklist for the editor/frontend behavior.

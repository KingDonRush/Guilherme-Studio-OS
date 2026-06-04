# Filter Controller Widget-First Agentic Plan

Date: 2026-06-04

Agentic Ops validation: valid.

Evidence generated:

- Snapshot: `.agentic-ops/snapshots/SNAPSHOT-1780595566103/snapshot.json`
- Readiness: `.agentic-ops/readiness/READINESS-1780595566190.json`
- Drift: `.agentic-ops/drift/DRIFT-1780595566243.json`

Readiness score: 100.

Drift status: clear.

## Objective

Turn the Elementor Implementation Toolkit Filter Controller into a
widget-first, Elementor-native preset workflow while preserving the current
DOM-provider filtering runtime and reducing widget/admin complexity through
staged modularization.

## Boundaries

In scope:

- code changes inside `wordpress/wp-content/plugins/elementor-implementation-toolkit`;
- root repo only for operational memory and human-facing documentation;
- Composer PSR-4 support with fallback autoloader kept;
- Elementor widget as the primary filter-building surface;
- admin as saved preset library, preview/status, diagnostics, and recovery;
- behavior-preserving modularization before feature expansion.

Out of scope:

- WordPress core edits;
- query-provider engine replacement;
- JetSmartFilters parity claims;
- custom wp-admin app shell;
- Elementor Pro dependency for public architecture;
- deep WooCommerce, JetEngine, or Simple Budget adapters;
- staging `vendor/`.

## Operating Rule

Content decides Style.

The widget owns filter composition and page-contextual styling. The admin owns
persistence, preview, diagnostics, usage metadata, and recovery actions.

## Phase Plan

### PHASE-050 - Checkpoint and Evidence Baseline

Purpose: separate current dirty scopes before more widget work.

Tasks:

- classify root docs/memory changes;
- classify plugin JS fix;
- classify Composer/PSR-4 modularization;
- rerun current plugin verification;
- decide commit/checkpoint order.

Acceptance:

- root documentation changes are separate from plugin code changes;
- `assets/js/eit-frontend.js` is not mixed into later Elementor control
  refactors by accident;
- Composer/PSR-4 and fallback autoloader remain validated.

### PHASE-060 - Filter Controller Inventory

Purpose: map every Content and Style control before changing the editor UX.

Tasks:

- inventory all widget Content controls;
- inventory all widget Style controls;
- map controls to filter type, global state, CSS selector, or JS runtime;
- identify controls that are obsolete or misleading;
- check whether Elementor can condition Style sections from repeater contents.

Acceptance:

- every current widget control has a classification;
- every Style section has a reason to remain, move, hide, or become conditional;
- unimplemented admin/runtime fields are flagged.

### PHASE-070 - Behavior-Preserving Widget Modularization

Purpose: reduce `FilterController.php` before adding feature behavior.

Tasks:

- continue extracting cohesive PHP classes under
  `includes/Elementor/FilterController/`;
- keep `FilterController.php` as the `Widget_Base` identity;
- preserve HTML and `data-*` contracts;
- keep Composer and fallback autoload both valid.

Acceptance:

- no intended frontend behavior change;
- plugin loads with and without `vendor/`;
- current widget render path still works.

### PHASE-080 - Cadenced Elementor Controls

Purpose: make the widget editor show only controls relevant to selected filter
composition.

Tasks:

- implement native Elementor conditions where possible;
- add an auxiliary selected-filter-types mechanism only if native conditions are
  insufficient;
- hide or stage irrelevant Style sections;
- preserve existing saved widget settings.

Acceptance:

- if only search and range exist, unrelated Style sections are hidden or staged;
- global state controls appear only when their features are enabled;
- no unsupported Elementor internals are relied on without evidence.

### PHASE-090 - Widget-First Preset Save and Load

Purpose: allow filters built in Elementor to become reusable presets.

Tasks:

- define preset serialization contract;
- choose link vs copy/detach semantics;
- implement nonce/capability-protected save/load path;
- expose a widget-side save/load workflow;
- smoke-test admin visibility after save.

Acceptance:

- saved widget preset appears in the admin library;
- loading a preset into another widget is deterministic;
- mutation paths validate capability, intent, sanitization, and escaping.

### PHASE-100 - Admin Preset Library and Preview

Purpose: make admin reflect saved presets without becoming a second builder.

Tasks:

- reframe Filter Presets as library/preview/status;
- expose usage metadata and diagnostics;
- reduce or mark fields the runtime does not honor;
- preserve duplicate/delete/rename workflows.

Acceptance:

- admin no longer reads as the required filter-building surface;
- preview shows what the preset contains and whether DOM data is sufficient;
- destructive actions remain nonce and capability protected.

### PHASE-110 - Filter-Type Customization Expansion

Purpose: deepen frontend customization one filter type at a time.

First target: range/slider.

Candidate range controls:

- horizontal/vertical orientation;
- handle shape;
- optional handle icon;
- solid/dashed/segmented track style;
- selected vs unselected track styling;
- ticks/numbers above or below track;
- prefix/suffix/unit labels;
- responsive behavior.

Acceptance:

- Style controls remain type-scoped;
- range pass does not bloat unrelated filter sections;
- editor and frontend visual behavior are verified with browser evidence.

## Immediate Next Task

Start with `TASK-050`: classify and checkpoint the current dirty state.

Do not begin `PHASE-080` until `PHASE-060` inventory is complete.

Do not begin preset save/load until cadenced control behavior is stable enough
to serialize intentionally.

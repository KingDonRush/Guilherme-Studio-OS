# Elementor Implementation Toolkit Admin V0.2 Source Of Truth

## Purpose

This document is the implementation contract for the Admin V0.2 rebuild.

The saved layout frames are the visual source of truth and source of success.
The code should not drift into a generic WordPress settings page, and it should
not invent a new UI direction that is not present in the frames.

Source frames:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-01.png` through
`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-28.png`

Detailed planning artifact:

`docs/implementation-toolkit/admin-v0.2-frame-implementation-plan.md`

Canonical icon system:

`docs/assets/implementation-toolkit/admin-v0.2/icons/canonical-icon-manifest.json`

## Core Rule

Use the frames as the truth for:

- spatial hierarchy;
- containment;
- inspector behavior;
- selected states;
- object ownership;
- icon language;
- color semantics;
- preview scope;
- success criteria.

Use the implementation plan as supporting reasoning, not as a literal list of
screens to build.

When frames conflict, choose the canonical pattern in this document and record
the decision. Do not average the frames into a vague UI.

## Canonical Shell

The admin must stay inside WordPress admin chrome.

Mandatory shell traits:

- WordPress admin sidebar remains visible.
- WordPress admin top bar remains visible when present in the environment.
- Toolkit product shell sits inside the WordPress admin canvas.
- Top Toolkit navigation has `Filters`, `CPTs`, and `Integrations`.
- Current object/preset selector is visible near the top.
- Save and Preview actions are top-level actions.
- Right inspector is contextual and tied to the selected object/layer/module.
- Main canvas expresses architecture, not a flat settings table.

Do not adopt the fully standalone SaaS shell from frame 28 as the default admin
shell. Its preset library and settings drawer are useful interaction references,
but the final plugin UI must still respect WordPress admin containment.

## Visual Semantics

- Teal: structure, source, contract, valid architecture.
- Purple: modules, optional/configurable layers, filter controls.
- Coral: selected object, selected inspector context, override, destructive or
  high-attention state.
- Green: active, valid, enabled, healthy.
- Amber: degraded, warning, missing, caution.
- Blue: runtime, query, secondary system state.

These colors are semantic. Do not recolor cards just to make the UI busier.

## Canonical Components

Implement these as reusable components before building full screens:

- `ToolkitShell`
- `TopBar`
- `ObjectHeader`
- `StatusBadge`
- `IconGlyph`
- `ArchitectureCanvas`
- `ArchitectureBand`
- `ObjectMap`
- `GraphEdge`
- `ModuleCard`
- `LayerCard`
- `InspectorPanel`
- `InspectorSection`
- `SegmentedControl`
- `ToggleRow`
- `FieldRow`
- `SummaryChip`
- `PreviewModal`
- `RuntimeFlow`
- `StateMachine`
- `LibraryList`
- `EmptyState`

The component names are descriptive, not required PHP class names.

## Icon Contract

Use WebP icons from:

`wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/images/icons/`

Canonical icon vocabulary:

- `logo-layers`
- `filter-funnel`
- `post-type`
- `connector-registry`
- `admin-screen`
- `save-disk`
- `preview-eye`
- `publish-rocket`
- `reset-refresh`
- `object`
- `scope`
- `contract`
- `binding`
- `schema`
- `module`
- `output`
- `runtime`
- `filter-object-map`
- `architecture-step-rail`
- `ownership-spine-connectors`
- `source-database`
- `taxonomy`
- `meta-field`
- `registration`
- `rest`
- `provider`
- `target-bullseye`
- `existing-cards`
- `listing-detector`
- `search`
- `checkbox`
- `chips`
- `range-sliders`
- `swatches`
- `rating-star`
- `sort-arrows`
- `pagination`
- `result-count`
- `url-router`
- `ajax-bolt`
- `dom-code`
- `controller-state-machine`
- `state-feedback-loop`
- `apply-strategy`
- `conditional-rules`
- `constraints-sliders`
- `context-crosshair`
- `data-availability`
- `item-boundary`
- `identity-resolver-priority`
- `inspector`
- `inspector-sliders`
- `simple-budget-bridge`
- `woo-adapter`
- `mobile-panel`
- `token-mapper`
- `handoff-notes`
- `qa-runner`

Do not generate new icons during the first implementation slice.

If a frame concept is not in this list, resolve it through:

1. `icon-concept-resolution.json`;
2. CSS badge;
3. CSS glyph;
4. connector line;
5. text label;
6. no asset.

## Frame Classification

### Primary Implementation Frames

These frames define the first build target.

- `frame-20`: Filter Preset Root Overview
- `frame-19`: Provider Contract Selected
- `frame-18`: Price Range Module Selected
- `frame-17`: Controller Output Behavior Selected
- `frame-16`: Filter Controller Preview Modal
- `frame-24`: Filter Preset Object Map
- `frame-23`: Provider Contract Builder
- `frame-22`: Filter Module Schema Price Range
- `frame-21`: Output Behavior Runtime Surface
- `frame-26`: Filter Architecture With Contextual Preview
- `frame-27`: Visual Filter Architecture Builder

### Secondary Implementation Frames

These define later areas after the Filter Preset slice is stable.

- `frame-11`: Content Model Preview Modal
- `frame-12`: CPT Manager Meta Field Selected
- `frame-13`: CPT Taxonomy Layer Selected
- `frame-14`: CPT Registration Contract Selected
- `frame-15`: Managed CPT Root Overview
- `frame-01`: Connector Registry
- `frame-02`: QA Scenario Runner
- `frame-03`: Editor Handoff Notes
- `frame-04`: Design Token Mapper
- `frame-05`: Conditional Display Rules
- `frame-06`: URL State Router
- `frame-07`: Listing Target Detector
- `frame-08`: Mobile Responsive Filter Panel
- `frame-09`: WooCommerce Cards Adapter
- `frame-10`: Simple Budget Bridge

### Reference-Only Frame

- `frame-25`: Filter State Coverage Board

Frame 25 is a coverage board. Do not implement it as a screen.

### Interaction Reference Frame

- `frame-28`: Preset Library And Category Chips Editor

Frame 28 is useful for preset-library and module-drawer behavior, but its
standalone shell is not the default shell.

## First Implementation Slice

The first code slice should prove the Filter Preset architecture without
touching runtime filtering.

Build:

1. Canonical WordPress-contained Toolkit shell.
2. Canonical icon renderer for WebP icons.
3. Badge/glyph/connector primitives.
4. Filter Preset root object map.
5. Provider Contract selected state.
6. Price Range module selected state.
7. Controller Output selected state.
8. Filter Controller Preview modal.

Do not build:

- frontend filtering runtime;
- listing/grid renderer;
- Elementor editor detection;
- deep WooCommerce adapter;
- Simple Budget runtime bridge;
- CPT registration runtime changes;
- preset library standalone shell;
- full Style/Advanced editor.

## Data Model For The Slice

The UI should render from one object graph, not from unrelated mock arrays.

Minimum graph:

- `root`: Filter Preset
- `layers`:
  - Identity & Scope
  - Provider Contract
  - Data Binding Schema
  - Filter Modules
  - Controller Output
- `modules`:
  - Search
  - Category Checkbox
  - Price Range
  - Color Swatches
  - Rating
  - Sort
- `edges`:
  - owns
  - inherits
  - overrides
  - feeds
  - controls
- `selected_node`
- `inspector_context`
- `preview_context`

This graph can initially be admin-only sample/config state, but its shape
should be compatible with future saved options.

## Success Criteria By Frame

### Frame 20

Success means:

- root object is visible;
- five layer bands are visible;
- inspector context is root preset;
- summary chips match the selected preset;
- layout does not read as a WordPress settings table.

### Frame 19

Success means:

- Provider Contract is selected;
- DOM Provider mode is visible;
- detected targets and manual selector are visible;
- item boundary and identity resolver are visible;
- inspector edits Provider Contract;
- no results grid is introduced.

### Frame 18

Success means:

- Filter Modules layer is expanded;
- Price Range is selected;
- module list remains visible;
- center schema summary and right inspector read from the same module object;
- inherited/override badges are represented consistently.

### Frame 17

Success means:

- Controller Output is selected;
- Apply Strategy, URL State, Active Chips, Result Count, Sorting, Pagination,
  and Empty/Loading/Reset are visible;
- Runtime Flow is visible;
- URL State inspector is contextual;
- URL behavior is represented as a contract, not implemented runtime.

### Frame 16

Success means:

- Preview opens as a modal;
- modal previews controller controls only;
- no listing/grid is rendered;
- state summary is visible;
- modal works from current in-memory form state without saving.

### Frame 24

Success means:

- root object and child layers are expressed as an object map;
- ownership/inheritance/override relationships are visible;
- inspector context is `Filter Preset (Root)`;
- graph lines represent real relationships, not decoration.

### Frame 23

Success means:

- Provider Contract Builder is a step-based contract screen;
- selected step is Identity Resolver;
- Detection Preview is contextual;
- confidence/fallback settings are visible;
- deep third-party adapters are not claimed as implemented.

### Frame 22

Success means:

- parent context/inheritance is visually obvious;
- Price Range schema sections show inherited versus override;
- inspector edits the selected module;
- deleting/duplicating modules is not implemented unless dirty-state handling
  exists.

### Frame 21

Success means:

- Output Behavior has runtime flow and state machine;
- URL State inspector is visible;
- state machine names match the planned state model;
- no runtime animation is required.

### Frame 26

Success means:

- architecture bands and preview modal coexist;
- selected Price Range inspector is visible;
- preview remains controller-only;
- Runtime State row is visible.

### Frame 27

Success means:

- Source, Query Contract, Filter Layer, Target Listing, and Runtime columns are
  visible;
- Price Range is selected in the Filter Layer;
- graph edges show data/control flow;
- inspector edits selected Price Range.

## Divergence Decisions

### Shell

Frames use several generated shell variants. The implementation uses one
WordPress-contained shell.

### Icons

Frames imply hundreds of specific icon names. The implementation uses 58
canonical WebP glyphs plus CSS/text primitives.

### Frame 25

Frame 25 is not a screen. It is coverage evidence.

### Frame 28

Frame 28's preset library is useful, but its standalone shell is not the default
admin shell.

### Runtime

Runtime diagrams are admin contracts in V0.2. They are not full runtime
behavior unless specifically implemented later.

### Preview

Filter Controller preview never renders a grid/listing. It previews controls,
state, chips, count, actions, and pagination only.

## QA Method

Each implemented state should be checked against its source frame.

Minimum QA loop:

1. Open WordPress admin page.
2. Capture Playwright screenshot at desktop width.
3. Compare against source frame for:
   - shell;
   - spacing;
   - selected states;
   - inspector context;
   - overflow;
   - modal behavior;
   - icon usage.
4. Capture mobile/tablet screenshots after desktop passes.
5. Confirm console has no JS errors.

The build is not successful just because it works. It is successful when the
implemented state is recognizably the same product system as the approved
frames.

## Implementation Start Gate

Implementation can start when these are true:

- this source-of-truth document exists;
- canonical icon manifest validates;
- all required canonical icons exist as WebP;
- first slice is limited to admin UI/config state;
- no new icon generation is pending.

Current status: ready to start the first implementation slice.

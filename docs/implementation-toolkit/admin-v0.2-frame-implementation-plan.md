# Elementor Implementation Toolkit Admin V0.2 Frame Implementation Plan

## Method

This plan is frame-first and implementation-aware, but it is not code. Each
frame is treated as a target state of the same WordPress admin product system.

For each block:

1. Inventory the icons/assets needed before planning implementation.
2. Do a blind implementation pass: what the code would probably need.
3. Do a visual pass against the frame: what must change so the result matches
   the image instead of becoming a generic WordPress admin screen.
4. Record fragilities, acceptance checks, and what should not be coded yet.

The frames are saved in:

`docs/assets/implementation-toolkit/admin-v0.2/frames/`

This document starts with `frame-01.png` through `frame-04.png`.

## Shared Visual Contract From Frames 01-04

All four frames share the same product skeleton:

- WordPress admin bar and sidebar remain visible.
- The Toolkit owns a white product shell inside the WordPress admin canvas.
- Top bar has brand lockup, primary section nav, selected implementation
  pattern pill, save/preview/publish actions, and a vertical options button.
- The main architecture area uses a vertical numbered spine at the left.
- Each numbered architecture band represents a backend layer.
- The right inspector is a fixed contextual panel with coral/orange outline
  language.
- Teal means structural/default/valid.
- Coral means selected/current/attention.
- Purple means optional/editor-facing/configurable.
- Green means active/pass/healthy.
- Amber/orange means degraded/warning/missing.
- Blue appears as a secondary information/runtime color.

Important: these frames do not show different unrelated screens. They show the
same implementation pattern layout applied to different modules.

## Icon-First Asset Plan

### Shared Shell Icons

Create these before any frame-specific work:

- `toolkit-logo-layers`: stacked geometric Toolkit mark.
- `section-filters`: filter/list icon used in top nav.
- `section-cpts`: layered content/model icon used in top nav.
- `section-integrations`: small connector/network icon used in top nav.
- `save-action`: disk or document-save icon.
- `preview-action`: eye icon.
- `publish-action`: circular rocket/launch/check icon.
- `more-actions`: vertical dots.
- `close-inspector`: simple X.
- `external-link`: small outbound arrow.
- `chevron-right`: row expand affordance.
- `chevron-down`: expanded row affordance.
- `plus`: add item.
- `refresh`: rerun/retry/check again.

### Shared State Icons

These need one consistent family, not random badge styles:

- `state-active`: green dot/check.
- `state-enabled`: green pill/check.
- `state-disabled`: muted circle.
- `state-optional`: purple outlined mark.
- `state-missing`: amber/coral warning.
- `state-degraded`: amber/coral warning badge.
- `state-healthy`: green health badge.
- `state-pass`: green check.
- `state-fail`: coral fail.
- `state-limited`: amber limited badge.
- `state-read`: check/read indicator.
- `state-write`: pen/write indicator.
- `state-preview`: eye/check indicator.
- `state-validate`: shield/check indicator.

### Shared Architecture Icons

These are reused across the module frames:

- `architecture-scope`: target/scope icon.
- `architecture-contract`: clipboard/lock contract icon.
- `architecture-binding`: connector/link icon.
- `architecture-output`: output/document icon.
- `architecture-policy`: shield/gear icon.
- `architecture-health`: compatibility/heartbeat gear.
- `architecture-pipeline`: flow/process icon.
- `architecture-evidence`: image/file capture icon.
- `architecture-documentation`: document with external link.
- `architecture-runtime`: gear/state loop icon.

### Frame 01: Connector Registry Icons

Create the connector-specific family:

- `connector-registry`
- `connector-types`
- `listing-provider`
- `filter-source`
- `budget-action`
- `woocommerce-adapter`
- `elementor-editor-helper`
- `qa-capture`
- `dom-provider`
- `simple-budget-bridge`
- `cpt-manager-source`
- `url-state-router`
- `jetengine-connector`
- `elementor-pro-loop-grid`
- `woocommerce-blocks`
- `advanced-custom-fields`
- `meta-box-connector`
- `capability-contract`
- `dependency-policy`
- `soft-adapter`
- `hard-dependency`
- `safe-fallback`
- `health-compatibility`
- `environment-check`

### Frame 02: QA Scenario Runner Icons

Create the QA/process family:

- `qa-scenario-runner`
- `scenario-scope`
- `landing-cta`
- `search-page-filters`
- `single-product-budget`
- `quote-submit`
- `precondition-theme`
- `precondition-simple-budget`
- `precondition-cpt-products`
- `precondition-listing-selector`
- `precondition-filter-preset`
- `step-visit-page`
- `step-set-filters`
- `step-sort-results`
- `step-paginate`
- `step-add-budget-item`
- `step-open-budget-cart`
- `step-submit-quote`
- `assertion`
- `assertion-results-update`
- `assertion-url-sync`
- `assertion-budget-button`
- `assertion-console`
- `assertion-mobile-layout`
- `evidence-screenshot`
- `evidence-console-log`
- `evidence-rest-response`
- `evidence-dom-state`
- `evidence-timestamp`
- `evidence-retention`
- `pipeline-validate-setup`
- `pipeline-execute-steps`
- `pipeline-verify-assertions`
- `pipeline-capture-evidence`
- `pipeline-generate-report`
- `pipeline-store-results`

### Frame 03: Editor Handoff Notes Icons

Create the handoff/annotation family:

- `editor-handoff-notes`
- `note-scope`
- `page-post`
- `template`
- `widget-selector`
- `filter-preset`
- `cpt-field`
- `integration-adapter`
- `annotation-types`
- `annotation-warning`
- `implementation-note`
- `qa-checklist`
- `selector-contract`
- `dependency-note`
- `visibility-rules`
- `attachment-targets`
- `audit-trail`
- `notifications-reminders`
- `note-draft`
- `note-active`
- `note-acknowledged`
- `note-in-progress`
- `note-resolved`
- `note-archived`

### Frame 04: Design Token Mapper Icons

Create the token/design-system family:

- `design-token-mapper`
- `token-sources`
- `theme-json`
- `css-variables`
- `elementor-globals`
- `plugin-palette`
- `manual-tokens`
- `token-groups`
- `token-color`
- `token-typography`
- `token-spacing`
- `token-radius`
- `token-border`
- `token-shadow`
- `selector-binding`
- `controller-wrapper`
- `filter-field`
- `active-chips`
- `buttons`
- `pagination`
- `mobile-panel`
- `state-mapping`
- `state-default`
- `state-hover`
- `state-focus`
- `state-loading`
- `export-contract`
- `elementor-selectors`
- `preview-stylesheet`
- `token-report`
- `contrast-check`
- `focus-ring`
- `pipeline-load-sources`
- `pipeline-normalize`
- `pipeline-map-selectors`
- `pipeline-apply-states`
- `pipeline-output-css`
- `pipeline-preview`

### Icon Production Rules

- Source visual language from the approved/generated frames.
- Save source references into `docs/assets/...`.
- Export production icons to the plugin as transparent WebP.
- Crop every transparent icon to alpha bounding box.
- Keep icon proportions stable across families.
- Avoid hallucinated decorative detail. Icons should read clearly at 16, 24, and
  40px.
- Do not use emoji in the actual UI implementation.

## Frame 01 Plan: Connector Registry

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-01.png`

### What This Frame Represents

This is the `Connector Registry` state of the Integrations/Superpowers area. It
is not just a list of integrations. It explains the connector architecture:

- what connector types exist;
- which connectors are installed;
- which connectors are optional/future;
- what each connector is allowed to do;
- how missing dependencies degrade behavior;
- whether the local environment is healthy.

The selected inspector target is `WooCommerce Adapter`, even though the header
pattern is `Connector Registry`. That distinction matters: the screen is the
registry, the inspector is focused on one connector inside it.

### Blind Implementation Pass

Implementation would need:

- `IntegrationPatterns` data for `connector_registry`.
- A module-specific renderer for architecture rows instead of generic fields.
- A left numbered spine component with six layers.
- A row component with:
  - layer icon;
  - layer title;
  - layer description;
  - one or more child cards/tables.
- Connector cards with icon, title, subtype/status, and optional badge.
- Capability matrix table.
- Dependency policy cards.
- Health table.
- Inspector model for selected connector:
  - connector info;
  - capability contract;
  - dependencies;
  - fallback behavior;
  - documentation link.
- A selected connector state tied to row/card click.
- Preview button label: `Connector Preview`.

### Visual Pass Against The Frame

The generic architecture canvas implemented earlier is too boxy and too
horizontal. This frame is more like a vertical dossier:

- It uses wide horizontal bands, not narrow columns.
- The left spine is structural and must align exactly with each band.
- The row title block sits inside each band, left aligned, with content cards to
  the right.
- The selected/attention states use a thin coral outline over a white surface.
- There are almost no decorative connector lines inside the content. The spine
  is enough.
- Tables are dense but calm. They should look like admin data, not marketing
  cards.
- Inspector sections are stacked with real grouping and thin dividers.

So the implementation plan should not reuse the current column-based canvas for
this frame. It should introduce a second layout primitive:

`architecture_dossier`

with:

- `architecture_spine`
- `architecture_band`
- `band_heading`
- `band_cards`
- `band_table`
- `band_pipeline`
- `context_inspector`

### Data Shape Needed

Connector object:

- `id`
- `name`
- `type`
- `version`
- `adapter_id`
- `author`
- `status`
- `is_required`
- `dependency`
- `required_version`
- `fallback_behavior`
- `hide_related_features`
- `log_degraded_events`
- `documentation_url`
- `capabilities`

Capability object:

- `resource`
- `read`
- `write`
- `preview`
- `validate`

Dependency policy object:

- `mode`: `soft_adapter`, `hard_dependency`, `safe_fallback`
- `title`
- `description`
- `status`

Health row:

- `connector`
- `status`
- `version`
- `requirement`
- `notes`
- `docs_url`

### Fragilities

- It is easy to accidentally build a generic settings page. The frame needs a
  registry mental model: classes, installed connectors, future connectors,
  permissions, dependencies, health.
- The capability matrix can overflow on smaller widths. It needs responsive
  horizontal scroll inside the table region, not page overflow.
- The inspector selected object must be independent from the current pattern
  selector.
- Missing dependency status must not imply runtime behavior exists. It is an
  admin contract until adapters are implemented.

### Acceptance Checks

- The screen reads as `Connector Registry`, not as a generic integration card
  grid.
- The selected connector is visibly highlighted in the optional connectors row
  and reflected in the inspector.
- The capability matrix has columns for read, write, trigger/preview/validate,
  and admin UI.
- The dependency policy row clearly distinguishes soft adapter, hard dependency,
  and safe fallback.
- Health table includes degraded WooCommerce adapter state.
- No educational footer copy appears.

## Frame 02 Plan: QA Scenario Runner

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-02.png`

### What This Frame Represents

This is a QA contract builder for the three-page demo flow. It defines what must
be validated when the Toolkit and Simple Budget are tested together:

- scenario scope;
- preconditions;
- step pipeline;
- assertions;
- evidence capture;
- reporting output;
- dry-run pipeline.

The selected inspector target is `Assertions`, not the whole module.

### Blind Implementation Pass

Implementation would need:

- `qa_scenario_runner` module schema.
- Scenario cards for:
  - Landing CTA;
  - Search Page Filters;
  - Single Product Budget;
  - Quote Submit.
- Preconditions data source:
  - theme;
  - Simple Budget;
  - CPT products;
  - listing selector;
  - filter preset.
- Steps data source with ordered step cards.
- Assertions data source with severity/status/retry fields.
- Evidence capture settings.
- Reporting settings.
- Pipeline footer with dry-run stages.
- Inspector list for assertions with add/edit fields.
- Preview button label: `Run Dry Preview`.

### Visual Pass Against The Frame

This frame is not a runtime test runner yet. It is a QA scenario contract. The
implementation must feel operational but still admin-safe:

- The row bands are still wide and horizontal.
- Assertions row is selected with coral outline.
- Step cards use small numbered badges and arrows between cards.
- The inspector list is denser than the main content.
- Severity badges have three tones: low, medium, high.
- Status uses compact green check badges.
- The bottom pipeline is a horizontal process strip, not a card grid.

The generic IntegrationPatterns five-field schema is insufficient for this
state. The plan needs module-specific structured config, even if runtime is
future.

### Data Shape Needed

Scenario:

- `id`
- `label`
- `url_pattern`
- `enabled`

Precondition:

- `id`
- `label`
- `value`
- `status`
- `details`

Step:

- `order`
- `label`
- `action`
- `target`
- `expected_state`

Assertion:

- `id`
- `name`
- `description`
- `severity`
- `status`
- `timeout_ms`
- `retry_on_fail`
- `stop_on_fail`

Evidence:

- `screenshots`
- `console_logs`
- `rest_response`
- `dom_state`
- `timestamp`
- `retention_days`

Report output:

- `pass_fail_summary`
- `detailed_report`
- `export_csv`
- `share_link`
- `notifications`
- `email_report`

### Fragilities

- If implemented too literally, it may look like a fake automated QA product.
  V0.2 should frame this as dry-run/admin contract unless runtime exists.
- Assertions list can become long. Inspector needs internal scroll.
- The step row can overflow quickly. It should be a horizontal scroll strip on
  narrow screens.
- Some preconditions depend on local environment checks. Avoid pretending those
  are implemented unless backed by WP-CLI/runtime checks.

### Acceptance Checks

- The assertions layer is visually selected and reflected in inspector.
- The inspector shows assertion list plus selected assertion details.
- The step pipeline is readable at desktop width.
- Evidence capture clearly shows screenshots, console, REST, DOM, timestamp,
  retention.
- `Run Dry Preview` opens a conceptual preview, not a full runner.
- No promise that Playwright automation exists inside the plugin yet.

## Frame 03 Plan: Editor Handoff Notes

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-03.png`

### What This Frame Represents

This is a structured handoff/annotation system for implementers. It is not a
frontend feature. It lets the Toolkit store notes attached to implementation
objects:

- page/post;
- template;
- widget selector;
- filter preset;
- CPT field;
- integration adapter;
- canvas element;
- inspector section;
- admin object;
- preview modal;
- runtime state.

The selected inspector target is `Annotation Types`.

### Blind Implementation Pass

Implementation would need:

- `editor_handoff_notes` module schema.
- Note scopes list.
- Annotation types list with severity/color/roles.
- Visibility rules.
- Attachment targets.
- Audit fields.
- Notification settings.
- Lifecycle pipeline.
- Inspector tabs:
  - Types;
  - Defaults;
  - Workflow.
- Annotation type editor fields:
  - name;
  - severity;
  - roles;
  - color;
  - enabled.
- Preview button label: `Handoff Preview`.

### Visual Pass Against The Frame

This frame is strong because it makes backend hierarchy legible. Each band is a
different architectural layer:

- Note Scope: where notes can exist.
- Annotation Types: what kinds of notes exist.
- Visibility Rules: who sees them.
- Attachment Targets: where they anchor.
- Audit Trail: how lifecycle is tracked.
- Notifications & Reminders: how they surface.
- Note Pipeline: lifecycle states.

To match it, the implementation should not collapse fields into generic form
rows. Each layer needs semantic child chips/cards.

The inspector is almost a sub-builder:

- tabs at top;
- type list;
- repeated type rows;
- role chips;
- color input;
- default icon style.

### Data Shape Needed

Annotation type:

- `id`
- `name`
- `description`
- `severity`
- `roles`
- `color`
- `enabled`

Scope:

- `id`
- `label`
- `description`
- `enabled`

Visibility rule:

- `id`
- `label`
- `condition`
- `audience`
- `behavior`

Attachment target:

- `id`
- `label`
- `anchor_type`
- `selector_or_key`

Audit fields:

- `created_by`
- `created_at`
- `last_updated`
- `resolved_by`
- `decision_link`

Notification option:

- `unresolved_notes`
- `reminder_interval`
- `assignee_mentions`
- `change_tracking`
- `export_report`

### Fragilities

- This can accidentally become a real collaboration tool. In V0.2, it should be
  admin configuration and handoff metadata only.
- Role chips need a known list. Do not invent WordPress roles beyond saved
  labels unless runtime role checks are implemented.
- Color fields should use real inputs but not require a design-system engine.
- Attachment to Elementor canvas should remain future unless the editor-side
  runtime is explicitly built.

### Acceptance Checks

- Annotation Types layer is selected and coral-highlighted.
- Inspector tabs exist visually and `Types` is active.
- The type list includes Warning, Implementation Note, QA Checklist, Selector
  Contract, Dependency Note.
- Default icon style controls appear at the bottom of inspector.
- Note pipeline shows Draft, Active, Acknowledged, In Progress, Resolved,
  Archived.
- The frame communicates handoff architecture, not help text.

## Frame 04 Plan: Design Token Mapper

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-04.png`

### What This Frame Represents

This is a design-token mapping admin contract. It maps token sources into
Toolkit/Elementor UI parts and then maps component states to token values.

The selected inspector target is `State Mapping`.

### Blind Implementation Pass

Implementation would need:

- `design_token_mapper` module schema.
- Token sources list.
- Token groups list.
- Selector binding list.
- State mapping list.
- Export contract list.
- Token pipeline.
- Inspector state selector:
  - Default;
  - Hover;
  - Active;
  - Focus;
  - Disabled;
  - Loading.
- Token mapping table:
  - property;
  - token;
  - preview swatch.
- Contrast check panel.
- Focus ring panel.
- Preview button label: `Style Preview`.

### Visual Pass Against The Frame

This frame is the clearest example of architectural hierarchy:

- Sources are not fields; they are origins.
- Groups are semantic buckets.
- Selector binding maps tokens to UI parts.
- State mapping creates variants.
- Export contract defines output artifacts.
- Pipeline explains flow from source to preview.

The implementation should use the same dossier layout as frames 01-03, but with
token-specific child components:

- swatch previews;
- token chips;
- selector labels;
- contrast score badges;
- focus ring steppers.

This frame is also where icon/palette accuracy matters most. If colors and
state chips are wrong, the screen stops making sense.

### Data Shape Needed

Token source:

- `id`
- `label`
- `source_type`
- `token_count`
- `enabled`

Token group:

- `id`
- `label`
- `token_count`
- `icon`

Selector binding:

- `id`
- `ui_part`
- `selector`
- `status`

State mapping:

- `state`
- `properties`

Token property mapping:

- `property`
- `token`
- `preview_value`

Contrast check:

- `label`
- `grade`
- `ratio`

Focus ring:

- `enabled`
- `color_token`
- `width`
- `offset`

Export contract:

- `css_variables`
- `elementor_selectors`
- `preview_stylesheet`
- `token_report`

### Fragilities

- This can drift into a full design system builder. V0.2 should only define the
  contract and preview.
- Elementor Globals should be treated as a source placeholder unless local
  Elementor APIs are verified.
- Contrast scores shown in preview should be either calculated or clearly
  sample data. Do not present fake accessibility results as real.
- The token mapper should not mutate frontend CSS until a runtime export path is
  intentionally built.

### Acceptance Checks

- State Mapping layer is selected with coral outline.
- Inspector state segmented control exists and `Default` is selected.
- Token mappings include Text Color, Background, Border Color, Primary Color,
  Chip BG, Chip Text, Button BG, Button Text.
- Contrast check shows AA-style badges but is scoped as preview/admin contract.
- Focus ring settings include enable, color, width, and offset.
- Pipeline shows Load Sources → Normalize → Map to Selectors → Apply States →
  Output CSS → Preview.

## Block 01-04 Implementation Order

When coding later, do not start from CSS. Start from structure:

1. Create the shared dossier layout component:
   - shell top bar;
   - pattern selector;
   - action buttons;
   - vertical spine;
   - architecture bands;
   - inspector panel;
   - pipeline row;
   - preview modal.
2. Create the icon pack for the four modules and shared states.
3. Create module schemas for:
   - Connector Registry;
   - QA Scenario Runner;
   - Editor Handoff Notes;
   - Design Token Mapper.
4. Render frame-specific architecture bands from schema.
5. Add inspector selection state.
6. Add preview modal per module.
7. Add responsive behavior:
   - horizontal scroll inside dense tables/steps;
   - inspector below content on tablet/mobile;
   - no page-level horizontal overflow.
8. Only then refine visual fidelity:
   - spacing;
   - borders;
   - selected states;
   - typography;
   - icon sizing;
   - badge colors.

## What Not To Code Yet

- Real WooCommerce adapter runtime.
- Real QA automation runner.
- Real Elementor editor annotation overlay.
- Real design token export into frontend CSS.
- Real Elementor Globals import unless verified from local Elementor APIs.
- Any frontend grid/listing renderer.

## Block 05-08 Icon Delta

Frames 05-08 move from admin contracts into runtime-adjacent control surfaces.
The icon pack needs a sharper distinction between configuration, state
evaluation, URL behavior, detection, and mobile panel behavior.

### Frame 05: Conditional Display Rules Icons

Create these before planning implementation:

- `conditional-display-rules`
- `rule-scope`
- `condition-sources`
- `url-parameter-condition`
- `filter-state-condition`
- `post-meta-condition`
- `taxonomy-term-condition`
- `simple-budget-cart-state`
- `user-capability-condition`
- `operator-equals`
- `operator-not-equals`
- `operator-contains`
- `operator-not-contains`
- `operator-exists`
- `operator-not-exists`
- `operator-greater-than`
- `operator-between`
- `operator-empty`
- `target-action`
- `action-show`
- `action-hide`
- `action-add-class`
- `action-remove-class`
- `action-disable`
- `action-collapse-group`
- `evaluation-strategy`
- `event-deps`
- `runtime-state-collection`
- `runtime-condition-check`
- `runtime-action-apply`
- `runtime-event-emit`
- `runtime-resync`
- `rule-ready`

### Frame 06: URL State Router Icons

Create the router/query-string family:

- `url-state-router`
- `parameter-registry`
- `parameter-search`
- `parameter-category`
- `parameter-price`
- `parameter-color`
- `parameter-rating`
- `parameter-sort`
- `parameter-page`
- `namespace-rules`
- `serialization-contract`
- `serialization-scalar`
- `serialization-list`
- `serialization-range`
- `serialization-date-range`
- `serialization-boolean`
- `serialization-encoding`
- `restore-strategy`
- `browser-back`
- `session-fallback`
- `invalid-cleanup`
- `schema-validation`
- `sharing-seo-boundaries`
- `canonical-mode`
- `noindex-hints`
- `clean-reset-url`
- `share-format`
- `analytics-friendly`
- `state-flow-parse-url`
- `state-flow-normalize`
- `state-flow-sync-components`
- `state-flow-update-url`
- `state-flow-persist`
- `router-active`

### Frame 07: Listing Target Detector Icons

Create the detection/scoring family:

- `listing-target-detector`
- `dom-heuristics`
- `heuristic-article`
- `heuristic-li`
- `heuristic-product`
- `heuristic-elementor-post`
- `heuristic-jet-listing-item`
- `repetition-scoring`
- `card-count`
- `repeated-class-score`
- `item-density`
- `image-presence`
- `title-presence`
- `overall-score`
- `naming-strategy`
- `editor-highlight`
- `hover-overlay`
- `outline-color`
- `scroll-into-view`
- `canvas-safe-mode`
- `manual-selector-fallback`
- `selector-validation`
- `test-target`
- `confidence-score`
- `detection-scope`
- `detection-canvas-scan`
- `detection-apply-heuristics`
- `detection-score-candidates`
- `detection-group-name`
- `detection-highlight-editor`
- `detection-confirm-targets`

### Frame 08: Mobile Filter Panel Icons

Create the mobile/accessibility family:

- `mobile-responsive-filter-panel`
- `breakpoint-contract`
- `desktop-breakpoint`
- `tablet-breakpoint`
- `mobile-breakpoint`
- `panel-structure`
- `trigger-button`
- `drawer-side`
- `overlay`
- `close-behavior`
- `focus-trap`
- `controller-placement`
- `sticky-apply-reset`
- `active-chips-panel`
- `panel-header`
- `accessibility-state`
- `aria-label`
- `keyboard-close`
- `body-scroll-lock`
- `focus-return`
- `announce-changes`
- `animation-contract`
- `panel-animation`
- `animation-duration`
- `backdrop-animation`
- `reduce-motion`
- `runtime-breakpoint-check`
- `runtime-trigger-click`
- `runtime-lock-focus`
- `runtime-render-panel`
- `runtime-close-panel`

### Icon Delta Production Notes

- These icons should still belong to the same visual family created for frames
  01-04.
- Runtime-adjacent icons should use teal/blue structure, not aggressive coral,
  unless the layer is selected.
- Coral icons should be reserved for selected layers, active inspector objects,
  validation warnings, or destructive/missing states.
- Mobile and accessibility icons must stay extremely simple at 16px. The frame
  uses many small controls; detailed icons will become visual noise.

## Frame 05 Plan: Conditional Display Rules

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-05.png`

### What This Frame Represents

This is the `Conditional Display Rules` module. It controls whether Elementor
elements or Toolkit-controlled pieces should show, hide, collapse, receive a
class, or become disabled based on implementation state.

The selected inspector target is `Condition Sources`, specifically a URL
parameter condition. The module is in `Draft` in the top pattern selector, but
the screen-level module card says `Enabled`. That distinction matters:

- pattern status describes maturity/public use;
- module enabled describes whether the admin contract is turned on locally.

### Blind Implementation Pass

Implementation would need:

- `conditional_display_rules` schema with structured rule groups.
- Layer renderer for:
  - Rule Scope;
  - Condition Sources;
  - Operators;
  - Target Action;
  - Evaluation Strategy;
  - Event & Dependencies;
  - Runtime Pipeline.
- Condition table component with rows and inline controls.
- Condition source palette in inspector.
- Operator palette in main row.
- Target action palette in main row.
- Evaluation strategy toggles and numeric priority/debounce fields.
- Inspector details for selected condition:
  - source type;
  - parameter key/filter/meta key/etc.;
  - operator;
  - value;
  - validation status;
  - case sensitivity;
  - URL decode;
  - ignore empty.
- Runtime pipeline preview:
  - State Collection;
  - Condition Check;
  - Action Apply;
  - Event Emit;
  - Re-sync;
  - Rule Ready.
- Preview button label: `Rule Preview`.

### Visual Pass Against The Frame

This frame is selected on the second band, not on a generic module card. The
implementation must make the selected band feel like an editable rule table:

- The `Condition Sources` band has a coral outline and expanded table.
- The left label column is still present, but the content area becomes a table.
- Each condition row has an index, source icon/title, key/filter, operator,
  value, AND/OR connector, and row actions.
- The inspector repeats the same selected source as a detailed editor.
- The source type selector in the inspector is a six-tile grid.
- The operator row in the main content is a compact horizontal palette.
- The evaluation row is purple, indicating configuration strategy rather than
  rule content.

This should not be implemented as a generic "five fields" integration module.
It needs nested objects and selected-row state.

### Data Shape Needed

Rule:

- `id`
- `name`
- `enabled`
- `scope`
- `conditions`
- `condition_logic`
- `actions`
- `evaluation_strategy`
- `events`
- `dependencies`

Scope:

- `scope_type`
- `widget_selector`
- `container_selector`
- `apply_to`
- `context`

Condition:

- `id`
- `source_type`
- `source_label`
- `key`
- `operator`
- `value`
- `joiner`
- `case_sensitive`
- `url_decode`
- `ignore_empty`
- `validation_status`
- `sample`

Action:

- `id`
- `type`
- `label`
- `payload`

Evaluation strategy:

- `on_load`
- `on_filter_change`
- `on_ajax_complete`
- `debounce_ms`
- `priority`

Event/dependency contract:

- `events_emitted`
- `depends_on`
- `affected_elements`
- `status`

### Fragilities

- Conditional display is powerful enough to become a fragile no-code rule
  engine. V0.2 should keep it as an admin contract and preview unless runtime is
  intentionally implemented.
- User-entered selectors can be risky. Later runtime must validate and scope
  selectors to the current controller/listing context.
- Multiple rule joiners can get confusing. V0.2 should support simple AND/OR
  display but avoid nested groups until needed.
- A disabled action can break buttons if runtime is naive. The plan must keep
  "disable action" as a contract first.
- The inspector source type grid must not look like a separate screen. It is a
  detail editor for the selected condition row.

### Acceptance Checks

- `Condition Sources` band is selected with coral outline.
- The condition table has at least URL Parameter and Filter State rows.
- URL Parameter is selected in the inspector source type grid.
- The inspector shows parameter key `budget_mode`, operator `Equals`, value
  `enabled`, validation status, sample query string, and toggles.
- Operator palette includes equals, not equals, contains, not contains, exists,
  not exists, greater than, between, empty.
- Target actions include show, hide, add class, remove class, disable action,
  collapse group, add action.
- Runtime pipeline ends in `Rule Ready`.

## Frame 06 Plan: URL State Router

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-06.png`

### What This Frame Represents

This is the `URL State Router` module. It defines how filter/controller state is
serialized into URL parameters, restored from URLs, namespaced to avoid
conflicts, and kept safe for sharing/SEO.

The selected inspector target is `Parameter Registry`, with the `price`
parameter selected.

### Blind Implementation Pass

Implementation would need:

- `url_state_router` schema.
- Parameter registry list/table.
- Parameter detail inspector.
- Namespacing rules cards.
- Serialization contract cards.
- Restore strategy cards.
- Sharing & SEO boundaries cards.
- State flow runtime pipeline.
- Conflict detection status.
- Parameter add/remove/reorder UI.
- Preview button label: `Preview Contract`.

### Visual Pass Against The Frame

This frame is calmer than frame 05. The selected band is the first row and its
content is a parameter chip/card row, not a table. The inspector carries the
dense table/details:

- The main row shows seven parameters as compact cards.
- The inspector shows a full parameter registry table.
- The selected parameter is `price`.
- Detail fields below the table show type-specific settings.
- Conflict status is a final panel, not a top-level row.
- The runtime pipeline is lower and horizontal.

The implementation should not put all registry rows in the main content. The
main band needs to stay scannable; inspector handles dense management.

### Data Shape Needed

Parameter:

- `id`
- `label`
- `type`
- `query_key`
- `status`
- `conflict`
- `reserved`
- `enabled`
- `format`
- `allow_empty`
- `default_value`
- `include_in_sharing`
- `include_in_canonical`

Namespace rules:

- `global_params`
- `preset_prefix`
- `page_prefix`
- `scope_mode`
- `conflict_detection`
- `collision_policy`

Serialization contract:

- `scalar_format`
- `list_format`
- `range_format`
- `date_range_format`
- `boolean_format`
- `encoding`
- `version`

Restore strategy:

- `on_load`
- `browser_back`
- `session_fallback`
- `invalid_cleanup`
- `validation`

Sharing/SEO:

- `canonical_mode`
- `noindex_hints`
- `clean_reset_url`
- `share_format`
- `analytics_friendly`

### Fragilities

- URL handling can break shareability or SEO. Anything beyond admin preview must
  be verified against actual frontend behavior later.
- Parameter names can collide with WordPress query vars. The registry needs
  reserved/conflict markers.
- Default values and empty values must be normalized consistently.
- Canonical/noindex behavior must not be presented as real SEO integration until
  runtime/meta output exists.
- Browser history behavior should stay a contract until frontend state router is
  intentionally coded.

### Acceptance Checks

- `Parameter Registry` band is selected with coral outline.
- Main band shows `search`, `category`, `price`, `color`, `rating`, `sort`,
  `page`.
- Inspector parameter table shows 7 of 30 used.
- Selected parameter details show `price`, label `Price Range`, type `Range
  (Number)`, query key `price`, enabled on.
- Range format shows `min-max`.
- Include in sharing is on; include in canonical is off.
- Conflict status says no conflicts detected.
- State flow is Parse URL → Validate & Normalize → Sync Components → Update URL
  → Persist State → Router Active.

## Frame 07 Plan: Listing Target Detector

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-07.png`

### What This Frame Represents

This is the `Listing Target Detector` module. It detects existing listing
structures inside the Elementor canvas without modifying the listing output.

The selected inspector target is `Repetition Scoring`.

This frame is crucial for the Toolkit's promise: the plugin does not create its
own listing/grid. It detects and controls listings that already exist.

### Blind Implementation Pass

Implementation would need:

- `listing_target_detector` schema.
- DOM heuristic chips.
- Repetition scoring metrics.
- Naming strategy settings.
- Editor highlight settings.
- Manual selector fallback settings.
- Detection pipeline.
- Inspector scoring weights with sliders.
- Threshold settings.
- Signal toggles.
- Preview score box.
- Preview button label: `Preview Detector`.

### Visual Pass Against The Frame

This frame makes detection feel measurable rather than magical:

- DOM Heuristics is a compact dropdown-chip row.
- Repetition Scoring is selected and uses metric cards, not fields.
- Scoring weights live in inspector as sliders.
- Naming Strategy uses actual form fields in the main content.
- Editor Highlight is purple because it is editor UX, not detection logic.
- Manual Selector Fallback has validation and confidence.
- Detection Pipeline explains runtime flow.

The implementation must avoid vague labels like "smart detect". It needs
observable signals and weights, even if the first runtime is simple.

### Data Shape Needed

Heuristic:

- `id`
- `selector`
- `label`
- `enabled`
- `priority`

Scoring weights:

- `card_count_weight`
- `repeated_class_weight`
- `item_density_weight`
- `image_presence_weight`
- `title_presence_weight`

Thresholds:

- `minimum_card_count`
- `minimum_score`
- `high_score`
- `medium_score`
- `low_score`

Detection signals:

- `check_repeated_classes`
- `check_item_density`
- `check_image_presence`
- `check_title_presence`
- `check_link_presence`
- `check_price_presence`

Naming strategy:

- `post_type_label`
- `naming_pattern`
- `max_targets`
- `fallback_label`
- `use_sections`

Editor highlight:

- `hover_overlay`
- `outline_color`
- `outline_width`
- `scroll_into_view`
- `canvas_safe_mode`

Manual fallback:

- `selector_input`
- `validation`
- `test_target_strategy`
- `confidence`
- `scope`

### Fragilities

- If scoring is too elaborate for runtime, the admin will overpromise. The plan
  should distinguish admin-configurable scoring contract from implemented
  detection algorithm.
- Selector input needs escaping/scope validation later. Do not run arbitrary
  selector logic without guardrails.
- Editor highlight needs Elementor iframe/canvas access. That must be tested in
  the real editor, not assumed.
- Confidence scores must be derived or marked as preview samples.
- JetEngine/Elementor Pro selectors can be present in heuristics without being
  dependencies.

### Acceptance Checks

- `Repetition Scoring` band is selected with coral outline.
- Metric cards show card count, repeated class score, item density, image
  presence, title presence, overall score.
- Inspector scoring weights sum to 100%.
- Thresholds show minimum card count, minimum/high/medium/low scores.
- Signals toggles include repeated classes, density, image, title, link, price.
- Editor highlight row includes hover overlay, outline color `#FF2D8F`,
  outline width, scroll into view, canvas safe mode.
- Manual fallback row shows selector input, valid status, test target,
  confidence, scope.

## Frame 08 Plan: Mobile / Responsive Filter Panel

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-08.png`

### What This Frame Represents

This is the `Mobile / Responsive Filter Panel` module. It turns an existing
Filter Controller into an off-canvas or drawer-style mobile panel without
changing the listing.

The selected inspector target is `Panel Structure`.

This is runtime-adjacent, but V0.2 should still treat it as configuration and
preview contract unless the frontend module is explicitly implemented later.

### Blind Implementation Pass

Implementation would need:

- `mobile_filter_panel` schema.
- Breakpoint contract row.
- Panel structure row.
- Controller placement row.
- Accessibility state row.
- Animation contract row.
- Runtime flow row.
- Inspector sections for:
  - trigger button;
  - drawer side;
  - overlay;
  - close behavior;
  - focus trap.
- Panel preview modal or side preview.
- Preview button label: `Panel Preview`.

### Visual Pass Against The Frame

This frame is structurally different from frame 07 but uses the same dossier
layout:

- Breakpoint Contract is a concise row with desktop/tablet/mobile/source.
- Panel Structure is selected with coral outline and uses five vertical
  sub-cards.
- Controller Placement is purple because it controls composition of the filter
  UI inside the panel.
- Accessibility State is first-class, not an afterthought.
- Animation Contract is lower priority but explicit.
- Runtime Flow shows the real behavior sequence.

The inspector is very practical: it is not just metadata. It has segmented
controls, dropdowns, sliders, toggles, and collapsible subsections.

### Data Shape Needed

Breakpoint contract:

- `desktop_min`
- `tablet_min`
- `mobile_max`
- `source`

Panel structure:

- `trigger_type`
- `trigger_selector`
- `trigger_icon`
- `trigger_label`
- `show_label`
- `trigger_position`
- `drawer_side`
- `overlay_enabled`
- `overlay_opacity`
- `close_on_outside_tap`
- `show_close_icon`
- `close_icon`
- `esc_key_closes`
- `focus_trap_enabled`
- `initial_focus`

Controller placement:

- `filter_preset`
- `sticky_apply_reset`
- `active_chips_in_panel`
- `active_chips_max`
- `panel_header_enabled`
- `panel_title`

Accessibility state:

- `aria_label`
- `keyboard_close`
- `body_scroll_lock`
- `focus_return`
- `announce_changes`

Animation contract:

- `panel_animation`
- `animation_duration`
- `backdrop_animation`
- `backdrop_duration`
- `reduce_motion`

Runtime flow:

- `breakpoint_check`
- `trigger_click`
- `lock_focus`
- `render_panel`
- `close_panel`

### Fragilities

- Mobile filter panels touch accessibility, focus, body scroll, and viewport
  behavior. Runtime implementation should not be rushed.
- If the trigger selector is wrong, the panel cannot open. Later runtime should
  provide validation and fallback.
- Focus trap and scroll lock can conflict with Elementor popups or other
  plugins. Keep adapter boundaries explicit.
- Animation must respect `prefers-reduced-motion`.
- The panel should not duplicate/render a listing or grid.

### Acceptance Checks

- `Panel Structure` band is selected with coral outline.
- Breakpoints show desktop `1025px`, tablet `768px`, mobile `< 767px`, source
  `Elementor Breakpoints`.
- Panel structure cards show trigger button, drawer side, overlay, close
  behavior, focus trap.
- Inspector trigger type segmented control has Icon Button selected.
- Drawer side segmented control has Right selected.
- Overlay section includes enabled toggle and opacity slider at `0.6`.
- Accessibility state includes ARIA label, keyboard close, body scroll lock,
  focus return, announce changes.
- Runtime flow is Breakpoint Check → Trigger Click → Lock & Focus → Render Panel
  → Close Panel.

## Block 05-08 Implementation Order

When coding later, this block should come after the shared dossier layout and
base icon pack from block 01-04.

1. Extend module schemas with nested objects, not flat five-field configs.
2. Add a `selected_child` state model for inspector focus:
   - selected condition;
   - selected URL parameter;
   - selected scoring group;
   - selected panel structure section.
3. Build shared components:
   - segmented control;
   - toggle row;
   - metric card;
   - slider row;
   - parameter chip;
   - condition table;
   - operator/action palette;
   - runtime pipeline.
4. Implement frame-specific renderers:
   - Conditional Display Rules;
   - URL State Router;
   - Listing Target Detector;
   - Mobile Filter Panel.
5. Add conceptual preview modals:
   - Rule Preview;
   - Preview Contract;
   - Preview Detector;
   - Panel Preview.
6. Add responsive rules:
   - dense tables scroll internally;
   - chip rows wrap or scroll by design;
   - inspector moves below content on smaller admin widths;
   - no body-level horizontal overflow.
7. Review visual fidelity against each frame before adding behavior.

## Additional What Not To Code Yet

- Do not implement a full frontend conditional rule engine yet.
- Do not implement SEO/canonical output from URL router yet.
- Do not claim real scoring confidence unless runtime calculates it.
- Do not implement focus trap/mobile drawer until accessibility QA is planned.
- Do not wire selector fallback to arbitrary DOM mutation without scoped
  validation.
- Do not turn Mobile Filter Panel into a grid/listing renderer.

## Block 09-12 Icon Delta

Frames 09-12 add two adapter states and two CPT/content-model states. The icon
system needs to split cleanly between:

- integration adapters;
- Simple Budget actions/events;
- content model preview;
- CPT architecture layers.

### Frame 09: WooCommerce Cards Adapter Icons

Create or refine:

- `woocommerce-cards-adapter`
- `woocommerce-markup-adapter`
- `source-contract`
- `product-loop-scope`
- `single-product-scope`
- `cart-fragments-scope`
- `field-resolver`
- `field-id`
- `field-price`
- `field-sale-price`
- `field-categories`
- `field-stock`
- `field-rating`
- `field-image`
- `action-surface`
- `add-quote-button`
- `quantity-sync`
- `template-hooks`
- `hook-before-title`
- `hook-after-price`
- `hook-card-actions`
- `hook-single-summary`
- `compatibility-fallbacks`
- `theme-override-detection`
- `block-theme-warning`
- `selector-fallback`
- `source-markup`
- `output-events`

### Frame 10: Simple Budget Bridge Icons

Create or refine:

- `simple-budget-layer`
- `source-layer`
- `parasitic-dom-provider`
- `listing-target`
- `item-selector`
- `item-identity`
- `budget-action-contract`
- `add-item-action`
- `open-budget-action`
- `submit-quote-action`
- `clear-item-action`
- `data-mapping`
- `map-title`
- `map-price`
- `map-sku`
- `map-quantity`
- `map-image`
- `map-permalink`
- `map-metadata`
- `trigger-rules`
- `card-button-trigger`
- `single-product-button-trigger`
- `disabled-state`
- `availability-check`
- `debounce`
- `events-compatibility`
- `before-add-event`
- `after-add-event`
- `cart-update-event`
- `quote-sent-event`
- `ui-feedback`

### Frame 11: Content Model Preview Modal Icons

Create or refine:

- `content-model-preview`
- `preview-model-tab`
- `preview-admin-tab`
- `preview-rest-tab`
- `preview-compatibility-tab`
- `desktop-preview`
- `tablet-preview`
- `mobile-preview`
- `admin-screen-preview`
- `fields-preview`
- `taxonomies-preview`
- `api-preview`
- `compatibility-preview`
- `open-in-new-tab`
- `modal-close`
- `model-overview`
- `rest-request`
- `compatibility-check`

### Frame 12: CPT Manager Meta Field Selected Icons

Create or refine:

- `visual-content-architecture-builder`
- `content-source-layer`
- `post-type-node`
- `post-slug-node`
- `labels-node`
- `menu-icon-node`
- `description-node`
- `registration-contract-layer`
- `visibility-node`
- `url-structure-node`
- `rewrite-slug-node`
- `has-archive-node`
- `has-query-var-node`
- `taxonomy-layer`
- `category-taxonomy`
- `tag-taxonomy`
- `brand-taxonomy`
- `material-taxonomy`
- `color-taxonomy`
- `meta-field-layer`
- `price-meta-field`
- `material-meta-field`
- `color-meta-field`
- `rating-meta-field`
- `sku-meta-field`
- `featured-meta-field`
- `supports-layer`
- `rest-admin-exposure-layer`
- `runtime-request`
- `runtime-resolve-cpt`
- `runtime-apply-taxonomy`
- `runtime-apply-meta`
- `runtime-order-paginate`
- `runtime-return-response`
- `controller-ready`

### Icon Delta Production Notes

- Adapter icons should stay connector-like, not WooCommerce brand copies.
- CPT icons should be calmer and more structural than integration icons.
- Modal icons must be legible over dimmed backdrop; use stronger contrast and
  less internal detail.
- The `Price` meta icon and inspector icon must match, because frame 12 uses
  selected object continuity between the canvas and inspector.

## Frame 09 Plan: WooCommerce Cards Adapter

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-09.png`

### What This Frame Represents

This is an adapter configuration state for existing WooCommerce markup. The
frame explicitly says: adapt existing WooCommerce markup without duplicating
JetWooBuilder.

The top selector says `Adapter: WooCommerce Cards`, and the selected inspector
context is `Field Resolver`. The module is draft, which is important because
WooCommerce adapter runtime should remain optional/degraded until verified.

### Blind Implementation Pass

Implementation would need:

- Adapter-specific schema for WooCommerce card markup.
- Source contract layer with scopes:
  - Product Loop;
  - Single Product;
  - Cart Fragments.
- Field resolver layer with mappings:
  - ID;
  - Price;
  - Sale Price;
  - Categories;
  - Stock;
  - Rating;
  - Image.
- Action surface layer:
  - Add Quote Button;
  - Simple Budget Bridge;
  - Quantity Sync.
- Template hooks layer:
  - Before Title;
  - After Price;
  - Card Actions;
  - Single Summary.
- Compatibility/fallback layer:
  - Theme Override Detection;
  - Block Theme Warning;
  - Selector Fallback.
- Runtime pipeline:
  - Source Markup;
  - Field Resolver;
  - Actions;
  - Output/Events.
- Inspector for selected field resolver:
  - field mapping rows;
  - confidence selectors;
  - resolution settings;
  - confidence thresholds.
- Preview button label: `Adapter Preview`.

### Visual Pass Against The Frame

This frame is not a generic WooCommerce settings page. It is a mapping adapter:

- The module header is compact and adapter-specific.
- `Field Resolver` is selected and expanded with mapping chips.
- The inspector is mostly field mapping and confidence behavior.
- Read source toggles between `DOM` and `JSON-LD`.
- Confidence rules have sliders and legend dots.
- Compatibility/fallbacks are purple, not warning red, because they are
  strategic fallback behaviors.

The implementation must avoid WooCommerce dependency at this stage. It can name
selectors and contracts, but should not assume WooCommerce is active.

### Data Shape Needed

Adapter:

- `id`
- `adapter_id`
- `integration_type`
- `status`
- `source_contract`
- `field_mappings`
- `action_surface`
- `template_hooks`
- `compatibility_fallbacks`
- `resolution_settings`
- `confidence_rules`

Source scope:

- `id`
- `label`
- `context`
- `enabled`

Field mapping:

- `field`
- `label`
- `data_key`
- `selector`
- `confidence`
- `enabled`

Action surface:

- `id`
- `label`
- `description`
- `enabled`

Template hook:

- `hook`
- `label`
- `priority`

Compatibility rule:

- `id`
- `label`
- `behavior`
- `enabled`

Resolution settings:

- `read_source`
- `cache_duration`
- `retry_on_miss`
- `log_missing_fields`
- `strict_mode`

Confidence rules:

- `high_threshold`
- `medium_threshold`
- `low_threshold`

### Fragilities

- WooCommerce selectors vary by theme and plugins. The adapter must never imply
  universal compatibility.
- JSON-LD extraction is a separate parser concern; do not treat it as done
  unless implemented.
- Template hooks can imply output injection. In V0.2 this should stay a
  contract/preview unless runtime exists.
- Selector fallback can become brittle quickly. The inspector needs confidence
  and logging concepts before runtime.

### Acceptance Checks

- `Field Resolver` layer is coral-selected.
- Main mapping row includes ID, Price, Sale Price, Categories, Stock, Rating,
  Image.
- Inspector field mapping includes seven mapped fields with confidence levels.
- Resolution settings include DOM/JSON-LD toggle, cache duration, retry on miss,
  log missing fields, strict mode.
- Confidence rules include high/medium/low thresholds and legend.
- Compatibility/fallbacks row includes theme override detection, block theme
  warning, selector fallback.

## Frame 10 Plan: Simple Budget Bridge

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-10.png`

### What This Frame Represents

This is the Simple Budget integration layer. It maps existing listing/card data
into Simple Budget actions without modifying the Simple Budget plugin itself.

The selected inspector target is `Data Mapping`.

This frame directly serves the three-page demo goal: keep Simple Budget buttons
working inside filtered/sorted/paginated cards.

### Blind Implementation Pass

Implementation would need:

- `simple_budget_bridge` module schema.
- Source layer:
  - provider;
  - listing target;
  - item selector;
  - item identity.
- Budget action contract:
  - Add Item;
  - Open Budget;
  - Submit Quote;
  - Clear Item.
- Data mapping:
  - Title;
  - Price;
  - SKU;
  - Quantity;
  - Image;
  - Permalink;
  - Metadata.
- Trigger rules:
  - Card Button;
  - Single Product Button;
  - Disabled State;
  - Availability Check;
  - Debounce.
- Events & compatibility:
  - Before Add;
  - After Add;
  - Cart Update;
  - Quote Sent;
  - Compatibility Auto Detect.
- Runtime pipeline:
  - User Click;
  - Trigger Rules;
  - Data Mapping;
  - Budget Action;
  - Events;
  - UI Feedback.
- Inspector field mapping editor with toggles and preview value.
- Preview button label: `Preview Contract`.

### Visual Pass Against The Frame

This frame has a clearer left-to-right dependency story than the other
integration frames:

- Source layer detects the existing DOM/cards.
- Budget action contract defines Simple Budget API/events.
- Data mapping is selected because this is the fragile connection point.
- Trigger rules decide when mapping is allowed.
- Events & compatibility confirm the integration loop.

The inspector is narrow but dense:

- field mapping rows with selector input and enabled/copy controls;
- mapping options;
- preview value selector and resolved sample.

This should be planned as the first practical runtime candidate after admin
architecture, because it directly supports the demo.

### Data Shape Needed

Source layer:

- `provider`
- `listing_target`
- `item_selector`
- `item_identity`
- `detected`

Budget action:

- `action`
- `event_or_function`
- `label`
- `enabled`

Data mapping:

- `field`
- `selector`
- `enabled`
- `copy_from_source`
- `metadata_fields`

Mapping options:

- `trim_whitespace`
- `html_strip`
- `fallback_on_empty`
- `log_mapping_errors`

Trigger rules:

- `card_button_selector`
- `single_product_button_selector`
- `disabled_state_selector`
- `availability_check`
- `debounce_ms`

Events:

- `before_add`
- `after_add`
- `cart_update`
- `quote_sent`
- `compatibility`

Preview value:

- `field`
- `sample_value`
- `source_selector`

### Fragilities

- This should not require changes in Simple Budget while that plugin is frozen.
- Selector changes after filtering/sorting/pagination can detach actions unless
  event delegation is used.
- Quantity and metadata mapping can become ambiguous across cards.
- The bridge must preserve `.sbp-budget-action` behavior after DOM reordering.
- Preview value should be conceptual until real DOM sample inspection exists.

### Acceptance Checks

- `Data Mapping` layer is coral-selected.
- Main mapping row includes seven mapped fields.
- Inspector field mapping shows Title, Price, SKU, Quantity, Image, Permalink,
  Metadata Fields.
- Mapping options include trim whitespace, HTML strip, fallback on empty, log
  mapping errors.
- Preview value shows Price resolving to `$49.00` from `.price-amount`.
- Runtime pipeline ends in UI feedback.

## Frame 11 Plan: Content Model Preview Modal

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-11.png`

### What This Frame Represents

This is not a separate page. It is the CPT Manager `Model Preview` modal opened
over the content model builder. The background is dimmed; the inspector remains
visible but disabled behind the overlay.

The modal previews how a configured CPT model will look and behave in WordPress:

- model overview;
- admin screen preview;
- fields preview;
- taxonomies preview;
- REST/API preview;
- compatibility summary.

### Blind Implementation Pass

Implementation would need:

- Modal component with large centered panel and dimmed backdrop.
- Modal header with icon, title, description.
- Device preview segmented control:
  - Desktop;
  - Tablet;
  - Mobile.
- Modal tabs:
  - Model;
  - Admin;
  - REST;
  - Compatibility.
- Preview data assembled from current unsaved form state.
- Sections:
  - Overview;
  - Admin Screen Preview;
  - Fields Preview;
  - Taxonomies Preview;
  - API Preview;
  - Compatibility.
- Footer note:
  - preview reflects current configuration;
  - save to apply changes.
- Actions:
  - Open in New Tab;
  - Close.

### Visual Pass Against The Frame

This frame is much closer to the target than a small generic preview modal. The
modal is a real product surface:

- It is wide and grid-based.
- The background builder remains recognizable but dimmed.
- The modal uses tabs, not just a list of dl rows.
- The admin screen preview is a realistic WordPress list table mock.
- API preview includes REST base, namespace, schema fields, context support,
  permissions, and example request.
- Compatibility is a checklist of portfolio/demo readiness.

The current small registration preview would not satisfy this frame. The plan
needs a dedicated `content_model_preview_modal`, not a reused compact modal.

### Data Shape Needed

Preview model:

- `post_type`
- `labels`
- `public`
- `show_in_rest`
- `has_archive`
- `hierarchical`
- `supports`
- `menu_position`
- `menu_icon`
- `description`

Admin preview:

- `title`
- `rows`
- `columns`
- `filters`
- `bulk_actions`
- `search_placeholder`

Fields preview:

- `field`
- `type`
- `rest`
- `required`

Taxonomies preview:

- `taxonomy`
- `type`
- `hierarchical`
- `rest`
- `public`

API preview:

- `rest_base`
- `namespace`
- `schema_fields`
- `context_support`
- `permissions`
- `example_request`

Compatibility:

- `available_to_filter_presets`
- `budget_builder_ready`
- `elementor_source_ready`
- `rest_query_compatible`
- `archive_query_compatible`

### Fragilities

- Preview must read unsaved form state, not only saved option data.
- It must not imply real posts exist unless sample rows are marked as preview.
- REST preview must mirror actual CPT settings where possible.
- Compatibility checks should be conservative and explain assumptions.
- The modal must remain usable on tablet/mobile without becoming taller than
  the viewport with inaccessible actions.

### Acceptance Checks

- Opening `Model Preview` dims the builder behind it.
- Modal is large, centered, and has tabs.
- Device control shows Desktop selected.
- Admin Screen Preview looks like a WordPress list table.
- Fields Preview includes Price, Material, Color, Rating, SKU.
- API Preview includes `/wp-json/wp/v2/products`.
- Footer explains save is required to apply changes.

## Frame 12 Plan: CPT Manager Meta Field Selected

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-12.png`

### What This Frame Represents

This is the main CPT Manager architecture builder with `Price` selected inside
the `Meta Field Layer`.

It is not the same dossier layout used by integration modules. It uses a
columnar architecture model:

- Content Source;
- Registration Contract;
- Taxonomy Layer;
- Meta Field Layer;
- Supports;
- REST / Admin Exposure;
- Runtime Flow.

The inspector edits the selected meta field.

### Blind Implementation Pass

Implementation would need:

- CPT Manager renderer with column-based architecture canvas.
- Layer components:
  - Content Source;
  - Registration Contract;
  - Taxonomy Layer;
  - Meta Field Layer;
  - Supports;
  - REST/Admin Exposure.
- Selected object model:
  - selected layer;
  - selected item;
  - selected item type.
- Meta field detailed card in the main layer.
- Inspector form for selected meta field:
  - field definition;
  - validation;
  - admin display;
  - REST;
  - filter compatibility.
- Runtime flow row.
- Preview button label: `Preview`.

### Visual Pass Against The Frame

This frame is different from the integration frames in a useful way:

- It uses vertical columns instead of horizontal bands.
- Columns show containment: source feeds registration, registration feeds
  taxonomies/meta, meta feeds supports/rest exposure.
- The selected meta layer is purple and expanded.
- The selected `Price` item appears in both the left mini-list and the detailed
  card.
- The inspector mirrors the selected `Price` meta field.
- Supports and REST/Admin Exposure are side columns, not inspector-only.

The implementation should preserve this separate skeleton. Trying to force CPT
Manager into the integrations dossier layout would be wrong.

### Data Shape Needed

CPT definition:

- `post_type`
- `post_slug`
- `labels`
- `menu_icon`
- `description`
- `registration_contract`
- `taxonomies`
- `meta_fields`
- `supports`
- `rest_admin_exposure`

Meta field:

- `key`
- `label`
- `type`
- `default_value`
- `required`
- `show_in_rest`
- `show_in_admin_column`
- `filter_source`
- `sanitize_as`
- `min_value`
- `max_value`
- `decimal_precision`
- `prefix`
- `suffix`
- `placeholder`
- `admin_column`
- `column_width`
- `rest_schema_type`
- `context`
- `range_filter_compatibility`
- `sort_numeric_compatibility`
- `result_count_compatibility`

Runtime flow:

- `request`
- `resolve_cpt`
- `apply_taxonomy`
- `apply_meta`
- `order_paginate`
- `return_response`
- `controller_ready`

### Fragilities

- The existing CPT Manager has real registration behavior. Plan changes must
  preserve nonce/capability/sanitization and native WordPress APIs.
- Some fields in the frame go beyond current CPT runtime, especially filter
  compatibility. These can be stored/admin-preview first.
- Meta fields need type-aware sanitization. The UI cannot let arbitrary schema
  claims bypass server-side sanitizers.
- REST exposure must reflect actual `register_meta` behavior later.
- The layout is dense. It needs internal column scroll or responsive stacking,
  not shrunken unreadable cards.

### Acceptance Checks

- `Meta Field Layer` is selected and purple.
- `Price` meta field is selected in the list and expanded detail card.
- Inspector title is `Price`, type `Meta Field`, status active.
- Field Definition includes meta key `_price`, label `Price`, type `Number`,
  required toggle, REST toggle, admin column toggle, filter source.
- Validation includes sanitize as numeric, min/max, decimal precision.
- Admin Display includes prefix `$`, placeholder `0.00`, sortable admin column,
  column width.
- REST includes show in REST and schema type `number`.
- Filter Compatibility shows range filter, numeric sort, result count.
- Runtime flow ends in Controller Ready.

## Block 09-12 Implementation Order

This block should split into two implementation tracks:

1. Integration adapters:
   - WooCommerce Cards Adapter;
   - Simple Budget Bridge.
2. Content architecture:
   - Content Model Preview modal;
   - CPT Manager meta field selected state.

Order later:

1. Build missing icon families for adapter and CPT states.
2. Extend the shared top shell so it can say either `Implementation Pattern`,
   `Adapter`, `Integration Layer`, or `Content Type`.
3. Add adapter-specific schemas and renderers for frames 09-10.
4. Add selected-field inspector patterns for adapter mapping.
5. Replace compact CPT preview with `content_model_preview_modal`.
6. Rework CPT Manager canvas as a columnar architecture builder, separate from
   the integrations dossier layout.
7. Preserve existing CPT save/register behavior while adding admin-only
   compatibility metadata.
8. Add visual regression checks against frames 11-12 before touching runtime.

## Additional What Not To Code Yet For Block 09-12

- Do not require WooCommerce to be installed for the WooCommerce Cards Adapter
  admin contract.
- Do not clone JetWooBuilder or render Woo grids.
- Do not modify Simple Budget internals.
- Do not treat sample product/admin rows in preview as real database content.
- Do not expose fake compatibility claims publicly until runtime checks exist.
- Do not weaken existing CPT sanitization to match UI fields.

## Block 13-16 Icon Delta

Frames 13-16 complete the content-model architecture and return to the Filter
Controller preview state. The icon system needs to support taxonomy details,
registration details, root object overview, and a polished modal preview.

### Frame 13: CPT Taxonomy Layer Selected Icons

Create or refine:

- `taxonomy-layer-selected`
- `product-categories-taxonomy`
- `product-tags-taxonomy`
- `brand-taxonomy`
- `color-taxonomy`
- `taxonomy-slug`
- `taxonomy-singular-label`
- `taxonomy-plural-label`
- `taxonomy-hierarchical`
- `taxonomy-public`
- `taxonomy-show-ui`
- `taxonomy-admin-column`
- `taxonomy-rest-api`
- `taxonomy-rewrite-slug`
- `term-meta-readiness`
- `term-meta-icon`
- `term-meta-color`
- `term-meta-order`
- `term-meta-featured`
- `taxonomy-relationships`
- `taxonomy-attached-to`
- `taxonomy-filter-source`

### Frame 14: CPT Registration Contract Icons

Create or refine:

- `registration-contract-selected`
- `visibility-access`
- `rewrite-contract`
- `query-contract`
- `capabilities-contract`
- `admin-ui-contract`
- `architecture-url`
- `archive-url`
- `single-url`
- `permalink-structure`
- `query-context`
- `pagination-type`
- `pagination-base`
- `canonical-redirect`
- `admin-behavior`
- `runtime-request`
- `runtime-query-vars`
- `runtime-wp-query`
- `runtime-rest-admin`
- `runtime-render`

### Frame 15: Managed CPT Root Overview Icons

Create or refine:

- `managed-cpt-root`
- `identity-labels-layer`
- `editor-supports-layer`
- `architecture-layer-dot`
- `optional-layer-dot`
- `ownership-dependency-line`
- `save-contract`
- `root-valid`
- `all-valid`
- `created-at`
- `last-saved`
- `author`
- `ready-to-save`

### Frame 16: Filter Controller Preview Modal Icons

Create or refine:

- `filter-controller-preview`
- `preview-info`
- `device-desktop`
- `device-tablet`
- `device-mobile`
- `preview-controller-tab`
- `preview-states-tab`
- `preview-url-params-tab`
- `controller-search`
- `controller-category-checkbox`
- `controller-price-range`
- `controller-color-swatches`
- `controller-rating`
- `controller-sort`
- `controller-active-filter-chip`
- `controller-pagination`
- `state-summary`
- `url-sync-state`
- `apply-mode-state`
- `items-per-page-state`
- `active-modules-state`
- `active-filters-state`
- `controller-cache-state`
- `modal-reset`
- `modal-apply`

### Icon Delta Production Notes

- CPT icons should remain structural and calm; selected taxonomy/registration
  states use coral only for selection/inspector continuity.
- Filter preview icons must be smaller and more UI-like than architecture
  icons, because they sit inside a simulated controller.
- Device preview icons should match the modal tab scale and not reuse oversized
  admin icons.
- The active filter chips and pagination controls need visual language that can
  be built in CSS without relying on raster icons for every chip.

## Frame 13 Plan: CPT Taxonomy Layer Selected

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-13.png`

### What This Frame Represents

This is a CPT Manager state where `Product Categories` is selected inside the
`Taxonomy Layer`. The selected taxonomy is hierarchical, REST-exposed, available
to filter presets, and attached to the `product` CPT.

The inspector edits the selected taxonomy, not the whole content type.

### Blind Implementation Pass

Implementation would need:

- CPT columnar architecture layout from frame 12.
- Taxonomy layer selected state.
- Taxonomy list with selected taxonomy card and overflow action menu.
- Taxonomy detail card in the same layer:
  - ownership badges;
  - REST exposure badge;
  - slug;
  - labels;
  - hierarchical/public/UI/admin/REST toggles;
  - rewrite slug;
  - term meta readiness;
  - relationships.
- Right inspector for selected taxonomy:
  - labels;
  - visibility;
  - rewrite;
  - admin column;
  - REST.
- Supports, Meta Field Layer, and REST/Admin Exposure side columns.
- Preview button remains available.

### Visual Pass Against The Frame

This frame shows a different interaction model than frame 12:

- The selected object is a taxonomy, not a meta field.
- The Taxonomy Layer itself is purple-selected, but the selected item uses
  coral inside the layer.
- The taxonomy detail card is wider and more document-like than the list items.
- Term Meta Readiness and Relationships are separate nested panels.
- The right inspector mirrors only taxonomy properties.

The implementation must support selected-child behavior inside a selected
layer. A layer can be selected and also have a selected child object.

### Data Shape Needed

Taxonomy:

- `slug`
- `singular_label`
- `plural_label`
- `hierarchical`
- `public`
- `show_ui`
- `show_admin_column`
- `show_in_rest`
- `rewrite_slug`
- `rest_base`
- `rest_controller`
- `owner_cpt`
- `available_to_filter_presets`
- `term_meta_readiness`
- `relationships`

Term meta readiness:

- `icon`
- `color`
- `order`
- `featured`

Relationship:

- `attached_to`
- `filter_source`

Inspector groups:

- `labels`
- `visibility`
- `rewrite`
- `admin_column`
- `rest`

### Fragilities

- Taxonomy registration is real runtime behavior. Any future implementation must
  keep WordPress native API constraints.
- `REST Controller` should not accept arbitrary PHP callbacks from settings.
- Term meta readiness is likely admin-only/future unless term meta UI is
  implemented.
- Filter preset availability should be derived from taxonomy settings later,
  not just manually claimed.
- Selected child state must not lose unsaved edits when switching taxonomies.

### Acceptance Checks

- `Taxonomy Layer` is selected and purple.
- `Product Categories` is selected in the taxonomy list.
- Detail card shows badges: owned by Products CPT, available to filter presets,
  REST exposed.
- Inspector title is `Product Categories`, type `Taxonomy`, status active.
- Inspector labels show Category/Categories.
- Visibility toggles for hierarchical, public, show in UI, show admin column
  are on.
- Rewrite slug is `product-category`; query var is `product_cat`.
- REST section shows REST base `product_cat` and controller `Terms`.

## Frame 14 Plan: CPT Registration Contract Selected

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-14.png`

### What This Frame Represents

This is a CPT Manager state focused on the `Registration Contract`. It explains
how the post type is registered and how that registration flows into admin UI,
REST/admin exposure, architecture URLs, query vars, WP_Query, and rendering.

The selected inspector target is also `Registration Contract`.

### Blind Implementation Pass

Implementation would need:

- CPT architecture layout variant with Registration Contract selected.
- Registration card split into numbered subgroups:
  1. Visibility & Access;
  2. Rewrite;
  3. Query;
  4. Capabilities.
- Connector-like dependency lines from Content Source into Registration, and
  from Registration into Admin UI / REST / Architecture & URL.
- Admin UI panel:
  - menu position;
  - menu icon;
  - supports;
  - columns;
  - filters;
  - row actions.
- REST/Admin Exposure panel:
  - REST base;
  - show in REST;
  - schema;
  - fields.
- Admin Behavior panel:
  - admin order by.
- Architecture & URL panel:
  - archive URL;
  - single URL;
  - permalink structure;
  - query context;
  - pagination type/base;
  - canonical redirect.
- Runtime pipeline:
  - Request;
  - Query Vars;
  - WP_Query;
  - REST/Admin;
  - Render.
- Inspector mirrors the selected registration subgroups.

### Visual Pass Against The Frame

This frame is less list-like and more like a dependency diagram:

- The selected registration card is large and red/coral.
- Thick teal connector paths show data/control flow.
- The UI panels to the right are grouped by output surface.
- Inspector sections are accordion-like and mirror the selected card.
- The layout emphasizes registration as the central contract that feeds other
  surfaces.

This suggests the CPT Manager needs a specialized `contract_flow_canvas`, not
just columns. It can reuse components from the columnar builder, but the
selected registration state needs explicit dependency path visuals.

### Data Shape Needed

Registration contract:

- `visibility_access`
- `rewrite`
- `query`
- `capabilities`

Visibility/access:

- `public`
- `show_ui`
- `show_in_menu`
- `show_in_rest`
- `has_archive`
- `hierarchical`
- `exclude_from_search`
- `publicly_queryable`

Rewrite:

- `rewrite_slug`
- `with_front`
- `feeds`
- `pages`

Query:

- `query_var_enabled`
- `query_var_name`

Capabilities:

- `capability_type`
- `map_meta_cap`

Output surfaces:

- `admin_ui`
- `rest_admin_exposure`
- `admin_behavior`
- `architecture_url`

### Fragilities

- Connector paths can become decorative noise if not aligned to actual
  dependencies. Keep only meaningful lines.
- Capabilities are security-sensitive. Future implementation must not let a UI
  setting accidentally grant broad access.
- Rewrite changes require flush strategy; do not silently flush on every admin
  page render.
- Query/public flags have WordPress interactions. Need to reflect actual
  register_post_type behavior, not simplified assumptions.

### Acceptance Checks

- `Registration Contract` is selected with coral outline.
- Visibility & Access shows public/show UI/show in menu/show in REST/has
  archive on, hierarchical/exclude from search off, publicly queryable on.
- Rewrite shows slug `products`, with front/feeds/pages on.
- Query shows query var enabled with name `product`.
- Capabilities segmented control has `Post` selected and map meta cap on.
- Teal connector paths feed Admin UI, REST/Admin Exposure, Architecture & URL.
- Runtime pipeline includes WP_Query.

## Frame 15 Plan: Managed CPT Root Overview

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-15.png`

### What This Frame Represents

This is the CPT Manager overview/root state. The selected object is the root
managed CPT, not a specific layer child.

The frame shows the six architecture layers as horizontal bands:

1. Identity & Labels
2. Registration Contract
3. Editor Supports
4. Taxonomy Layer
5. Meta Field Layer
6. REST / Admin Exposure

The inspector edits root settings grouped by Identity, URL Shape, Visibility,
and Save Contract.

### Blind Implementation Pass

Implementation would need:

- Dossier-style CPT overview layout, distinct from the columnar selected-child
  layout.
- Root object banner with selected coral state.
- Vertical spine with six layers.
- Horizontal bands with summary cards.
- Layer status legend:
  - root object;
  - architecture layer;
  - optional layer;
  - ownership/dependency.
- Inspector root settings:
  - identity;
  - URL shape;
  - visibility;
  - save contract.
- Validation summary card.
- `Model Preview` button.

### Visual Pass Against The Frame

This frame is important because it reconciles the two CPT layouts:

- Overview uses horizontal dossier bands, like integrations.
- Detailed selected child states can use columns.
- Root selected state is a coral banner at the top.
- The spine expresses architecture order.
- Meta Field Layer is purple because it is optional/configurable.
- The inspector is not editing a layer, but the whole root object.

The plan should explicitly allow CPT Manager to have multiple layout states:

- root overview dossier;
- selected registration contract flow;
- selected taxonomy/meta columnar architecture;
- content model preview modal.

### Data Shape Needed

Root content type summary:

- `slug`
- `singular_label`
- `plural_label`
- `menu_name`
- `menu_icon`
- `status`
- `version`
- `created_at`
- `last_saved`
- `author`

Layer summary:

- `id`
- `label`
- `summary_items`
- `status`
- `optional`
- `count`
- `actions`

Save contract:

- `version`
- `created`
- `last_saved`
- `author`
- `validation_status`

### Fragilities

- Switching between overview and detailed states can fragment the code if each
  state gets its own unrelated renderer. Use shared layer data and specialized
  presentations.
- The root overview must not hide real registration details. It is a map, not a
  replacement for detailed editing.
- Save contract metadata should be truthful. Do not invent timestamps in saved
  data unless stored.
- The UI should not pretend unsaved changes are valid before validation runs.

### Acceptance Checks

- Root `Managed CPT` banner is selected with coral outline.
- Six numbered bands are visible with layer summaries.
- `Meta Field Layer` is purple/optional and shows totals.
- Inspector title says `Root: Managed CPT`.
- Identity fields show product/Product/Products/Products/dashicons-cart.
- URL Shape shows products, query var product, feed on.
- Visibility toggles reflect current CPT settings.
- Save Contract shows version, created, last saved, author, and valid state.

## Frame 16 Plan: Filter Controller Preview Modal

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-16.png`

### What This Frame Represents

This is the Filter Presets `Preview` modal. It previews only the Filter
Controller UI and behavior. It does not render listing results.

The background page is dimmed, with the Filter Modules layer selected behind the
modal and the inspector still visible.

### Blind Implementation Pass

Implementation would need:

- Large preview modal, not the small compact current preview.
- Current unsaved form state reader.
- Device segmented control:
  - Desktop;
  - Tablet;
  - Mobile.
- Preview tabs:
  - Controller;
  - States;
  - URL Params.
- Controller UI preview:
  - search;
  - category checkbox group;
  - price range;
  - color swatches;
  - rating radios;
  - sort select;
  - active filters;
  - result count;
  - reset/apply;
  - pagination.
- State summary panel:
  - URL Sync;
  - Apply Mode;
  - Items Per Page;
  - Active Modules;
  - Active Filters;
  - Controller ID;
  - Preset Slug;
  - Query Vars;
  - Cache.
- Informational note that no listing content is rendered.
- Background builder state with module list.

### Visual Pass Against The Frame

This frame clarifies what preview means for Filter Presets:

- Preview is a modal simulation, not an embedded real frontend.
- It uses a two-column modal body: controller on the left, state summary on the
  right.
- The controller preview is complete enough to judge spacing, labels, active
  chips, and pagination.
- The tabs at the top of the right side are modal-level preview tabs, not WP
  admin tabs.
- The background left-side builder has vertical architecture cards, not the
  horizontal dossier layout.

The implementation should replace the compact preview with a modal-specific
renderer that can be visually QA'd against this frame.

### Data Shape Needed

Preview controller:

- `device`
- `active_tab`
- `filters`
- `active_filters`
- `result_count`
- `pagination`
- `state_summary`

Filter preview item:

- `type`
- `label`
- `placeholder`
- `options`
- `range_min`
- `range_max`
- `range_step`
- `selected_value`

State summary:

- `url_sync`
- `apply_mode`
- `items_per_page`
- `active_modules`
- `active_filters`
- `controller_id`
- `preset_slug`
- `query_vars`
- `cache`

### Fragilities

- Preview must not save data.
- Preview must not imply result grid rendering.
- Active filter values may be sample data. They should be clearly preview
  values unless derived from form defaults.
- Range slider in preview should be static unless interactive preview is
  intentionally built.
- Modal must remain usable on smaller admin screens.

### Acceptance Checks

- Modal title is `Filter Controller Preview`.
- Notice says preview uses current form values and no save is required.
- Desktop tab is active.
- Controller tab is active.
- Search, categories, price range, color swatches, rating, sort, active filters,
  result count, actions, and pagination are visible.
- State Summary includes URL Sync on, Apply Mode auto, Items Per Page 9, Active
  Modules 6, Active Filters 4, Controller ID, Preset Slug, Query Vars, Cache.
- Info box says no listing content is rendered.

## Block 13-16 Implementation Order

This block should be implemented after the core schemas and icon system are
stable.

1. Build CPT root overview renderer from frame 15.
2. Build CPT selected-child renderer for taxonomies and meta fields from frames
   12-13.
3. Build Registration Contract flow renderer from frame 14.
4. Build Content Model Preview modal from frame 11, using real current form
   state where possible.
5. Replace Filter Controller compact preview with the frame 16 modal.
6. Add shared modal system:
   - large modal;
   - device tabs;
   - preview tabs;
   - two-column preview body;
   - sticky footer/actions when needed.
7. Add visual QA cases for:
   - CPT root overview;
   - taxonomy selected;
   - registration selected;
   - content model preview modal;
   - filter controller preview modal.

## Additional What Not To Code Yet For Block 13-16

- Do not invent real product rows in the database just to satisfy preview.
- Do not make preview modal depend on Elementor Pro.
- Do not render listings/results inside the Filter Controller preview.
- Do not treat term meta readiness as implemented term meta management unless
  that is built.
- Do not add capability mapping behavior without explicit security review.
- Do not discard existing CPT option storage; extend it carefully.

## Block 17-20 Icon Delta

Frames 17-20 complete the Filter Preset architecture family. They should be
treated as four states of the same `Filters` layout-base:

- root overview;
- provider contract selected;
- filter module selected;
- controller output selected.

The icon system needs to support both architecture-level layers and smaller
setting-level controls without making every control look like a standalone
feature.

### Frame 17: Controller Output Behavior Icons

Create or refine:

- `controller-output-behavior-selected`
- `apply-strategy`
- `auto-apply`
- `manual-apply`
- `apply-button-mode`
- `mixed-apply-mode`
- `debounce-timing`
- `update-on-drag`
- `url-state-section`
- `active-chips-section`
- `result-count-section`
- `sorting-section`
- `pagination-section`
- `empty-loading-reset-section`
- `runtime-flow`
- `runtime-url-state`
- `runtime-ajax-resolver`
- `runtime-dom-provider`
- `runtime-apply-reset`
- `shareable-state`
- `session-persistence`
- `clean-url`
- `include-defaults`
- `history-behavior`
- `custom-serializer`
- `inherited-state`

### Frame 18: Price Range Module Icons

Create or refine:

- `filter-module-price-range-selected`
- `module-search`
- `module-category-checkbox`
- `module-price-range`
- `module-color-swatches`
- `module-rating`
- `module-sort`
- `module-add`
- `price-range-identity`
- `price-range-data-binding`
- `price-range-bounds`
- `price-range-display`
- `price-range-behavior`
- `price-range-state-rules`
- `meta-field-source`
- `between-compare`
- `number-data-type`
- `range-min`
- `range-max`
- `range-step`
- `auto-detect-bounds`
- `fallback-range`
- `currency-prefix`
- `thousands-separator`
- `min-max-labels`
- `empty-behavior`
- `skeleton-loading`

### Frame 19: Provider Contract Icons

Create or refine:

- `provider-contract-selected`
- `provider-mode`
- `dom-provider`
- `wp-post-link`
- `adapter-placeholder`
- `target-discovery`
- `detected-target`
- `manual-selector`
- `add-selector`
- `item-boundary`
- `target-selector`
- `item-selector`
- `exclude-nodes`
- `pagination-scope`
- `identity-resolver-priority`
- `drag-priority-handle`
- `resolver-data-attribute`
- `resolver-permalink`
- `resolver-class-token`
- `resolver-visible-text`
- `data-availability`
- `visible-text-availability`
- `taxonomy-hints`
- `meta-hints`
- `fallback-strategy`

### Frame 20: Filter Preset Root Overview Icons

Create or refine:

- `filter-preset-root-object`
- `filter-root-active`
- `filter-root-save`
- `identity-scope-layer`
- `provider-contract-layer`
- `data-binding-schema-layer`
- `filter-modules-layer`
- `controller-output-layer`
- `architecture-step-rail`
- `root-object-dot`
- `infrastructure-layer-dot`
- `module-layer-dot`
- `output-layer-dot`
- `ownership-dependency-line`
- `root-inspector`
- `scope-intent`
- `scope-location`
- `scope-priority`
- `save-contract-valid`

### Icon Delta Production Notes

- Root/layer icons use teal and blue. Selected/root ownership uses coral.
- Filter module icons can use purple only when the module layer is selected or
  when representing a configurable module.
- Setting-level icons should be simpler than architecture icons. Avoid large
  pictograms inside dense inspector rows.
- The same `Controller Output` icon must read correctly in root overview,
  selected state, runtime flow, and modal preview.
- Status icons should be CSS-capable where possible: active, configured,
  inherited, disabled, warning, degraded, valid.

### Frame 17-20 Asset Production Status

Started production for the non-duplicate icon pack.

Generated source:

`docs/assets/implementation-toolkit/admin-v0.2/icons/source/frame-17-20-icon-source-sheet-01-chroma.png`

Processed alpha sheet:

`docs/assets/implementation-toolkit/admin-v0.2/icons/processed/frame-17-20-icon-source-sheet-01-alpha.png`

Extracted review pack:

`docs/assets/implementation-toolkit/admin-v0.2/icons/extracted/frame-17-20-pack-01/`

Production WebP output:

`wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/images/icons/`

Generated canonical icons:

- `apply-strategy`
- `manual-apply`
- `mixed-apply-mode`
- `clean-url`
- `custom-serializer`
- `currency-prefix`
- `auto-detect-bounds`
- `item-boundary`
- `identity-resolver-priority`
- `data-availability`
- `architecture-step-rail`
- `root-inspector`

Duplicate prevention manifest:

`docs/assets/implementation-toolkit/admin-v0.2/icons/icon-aliases-frame-17-20.json`

The alias manifest maps 97 requested frame-level icon names to either these 12
new canonical icons or already existing plugin icons. It currently has zero
missing targets for frames 17-20.

## Frame 17 Plan: Controller Output Behavior Selected

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-17.png`

### What This Frame Represents

This is the Filter Preset state where `Controller Output Behavior` is expanded.
It configures what happens after filter values change: apply strategy, URL
state, chips, count, sorting, pagination, and empty/loading/reset behavior.

The main canvas is focused on `Apply Strategy`, while the inspector is showing
`URL State`. The implementation should treat this as a selected output layer
with a nested sub-section selection model.

### Blind Implementation Pass

Implementation would need:

- Filter Preset architecture layout with the five standard layers.
- `Controller Output Behavior` expanded with coral selection.
- Nested subnav for:
  - Apply Strategy;
  - URL State;
  - Active Chips;
  - Result Count;
  - Sorting;
  - Pagination;
  - Empty / Loading / Reset.
- Main content renderer for Apply Strategy:
  - mode cards;
  - debounce slider;
  - numeric debounce input;
  - update-on-drag toggle;
  - explanatory state note.
- Runtime Flow strip:
  - URL State;
  - AJAX Resolver;
  - DOM Provider;
  - Apply / Reset.
- Right inspector renderer for URL State:
  - sync with URL;
  - query format;
  - query prefix;
  - shareable state;
  - session persistence;
  - clean URLs;
  - include defaults;
  - history behavior;
  - custom serializer;
  - inherited notice.
- Preview and Save actions remain in the top action bar.

### Visual Pass Against The Frame

The selected output layer is a containment shell inside the architecture list,
not a detached settings page. The coral outline wraps the whole expanded layer,
and the inner panel has its own left subnav.

Important structural cues:

- The top four layers stay compact and configured.
- Controller Output is visually larger and owns its nested settings.
- The runtime flow sits under the main setting panel as a dependency summary.
- The inspector is tall and narrow, with URL State as the current context.
- Toggle rows must align cleanly and avoid the default WordPress settings table
  feel.

The plan should support two related selections:

- `selected_layer = controller_output`;
- `selected_output_section = apply_strategy` or `url_state`.

If the final implementation cannot support two selections yet, the first pass
should default the inspector to the selected subnav item and only add secondary
inspector contexts later.

### Data Shape Needed

Controller output:

- `apply_strategy`
- `url_state`
- `active_chips`
- `result_count`
- `sorting`
- `pagination`
- `empty_loading_reset`

Apply strategy:

- `mode`
- `debounce_ms`
- `update_on_drag`
- `manual_button_label`
- `mixed_mode_rules`

URL state:

- `enabled`
- `query_format`
- `query_prefix`
- `shareable`
- `session_persistence`
- `clean_urls`
- `include_defaults`
- `history_behavior`
- `custom_serializer_enabled`
- `inherited_from_modules`

Runtime flow:

- `url_state`
- `ajax_resolver`
- `dom_provider`
- `apply_reset`

### Fragilities

- URL state is shared across modules. Avoid duplicating conflicting URL options
  inside every filter module.
- History behavior can break browser back/forward expectations if implemented
  casually.
- Custom serializer is a future advanced feature. In V0.2 admin it should be a
  contract flag, not arbitrary executable code.
- Debounce and update-on-drag affect runtime performance. Defaults should be
  conservative.
- The frame mixes Apply Strategy canvas with URL State inspector. The data model
  must make this intentional, not accidental.

### Acceptance Checks

- `Controller Output Behavior` is expanded and coral-selected.
- Subnav shows all seven output sections.
- `Apply Strategy` section is selected in the inner subnav.
- Auto Apply is selected.
- Debounce value is `300 ms`.
- Update On Drag is enabled.
- Runtime Flow displays URL State -> AJAX Resolver -> DOM Provider -> Apply /
  Reset.
- Inspector title is `URL State`.
- URL sync, shareable state, and session persistence are enabled.
- Clean URLs, include defaults, and custom serializer are disabled.
- Query prefix is `eit_`; history behavior is `Replace State`.
- Inherited notice is visible.

## Frame 18 Plan: Price Range Module Selected

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-18.png`

### What This Frame Represents

This is the Filter Preset state where the `Filter Modules` layer is expanded and
the `Price Range` module is selected. It shows both a module list and a detailed
module configuration surface.

The inspector edits only the selected Price Range module.

### Blind Implementation Pass

Implementation would need:

- Five-step Filter Preset architecture rail.
- Compact configured rows for:
  - Identity & Scope;
  - Provider Contract;
  - Data Binding Schema;
  - Controller Output.
- Expanded `Filter Modules` layer.
- Left module list:
  - Search;
  - Category Checkbox;
  - Price Range selected;
  - Color Swatches;
  - Rating;
  - Sort;
  - Add Filter Module button.
- Main Price Range detail table grouped by:
  - Identity;
  - Data Binding;
  - Bounds;
  - Display;
  - Behavior;
  - State Rules.
- Top badges:
  - inherited from Provider Contract;
  - module override.
- Right inspector with accordions for Data Binding, Bounds, Display, Behavior,
  and State Rules.

### Visual Pass Against The Frame

This frame is dense, but it does not feel like a WordPress metabox because the
hierarchy is explicit:

- outer layer = Filter Modules;
- selected child = Price Range;
- property bands = module schema;
- right inspector = editable control surface.

The module list must use stable item height and selected state. The main detail
area is a read/edit hybrid: each horizontal band summarizes settings, while the
inspector exposes the actual controls.

The implementation should avoid putting all fields directly in the center. The
center is the architectural snapshot; the inspector is the editable detail.

### Data Shape Needed

Filter module:

- `id`
- `type`
- `label`
- `query_var`
- `enabled`
- `show_label`
- `source`
- `key`
- `compare`
- `data_type`
- `module_override`
- `inherits_provider_contract`

Price range bounds:

- `min`
- `max`
- `step`
- `auto_detect`
- `fallback_min`
- `fallback_max`

Price range display:

- `style`
- `currency_prefix`
- `thousands_separator`
- `show_min_max_labels`

Price range behavior:

- `update_on_drag`
- `debounce_ms`
- `include_in_url`
- `empty_behavior`

State rules:

- `count_ready`
- `disable_options`
- `loading_state`

### Fragilities

- Auto-detect bounds require real data scanning. In admin V0.2 this can be a
  setting, but runtime detection needs a later adapter/provider contract.
- Currency prefix is visual only. Do not imply currency conversion.
- Numeric compare rules need strict sanitization and type casting.
- A range slider is easy to style badly in admin. It should be CSS-based and
  accessible, not image-based.
- The center detail and inspector can drift if they are rendered from separate
  hardcoded values. They should read from the same module object.

### Acceptance Checks

- `Filter Modules` is expanded and purple-selected.
- `Price Range` is selected in the module list.
- Search, Category Checkbox, Color Swatches, Rating, and Sort remain visible.
- Main detail shows Identity, Data Binding, Bounds, Display, Behavior, and State
  Rules.
- Data Binding shows source `Meta Field`, key `_price`, compare `BETWEEN`, data
  type `Number`.
- Bounds show min `0`, max `1000`, step `10`, auto-detect off, fallback `0 -
  1000`.
- Display shows style `Slider`, prefix `USD`, thousands separator on, min/max
  labels on.
- Behavior shows update on drag on, debounce `250 ms`, include in URL on, empty
  behavior `Ignore`.
- Inspector title is `Price Range`.

## Frame 19 Plan: Provider Contract Selected

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-19.png`

### What This Frame Represents

This is the Filter Preset state where `Provider Contract` is selected. It
defines how the controller identifies the target listing, how it finds items,
how it resolves identity, and what data can be read from the listing.

This is the key V0.1/V0.2 bridge between "do not build a results grid" and
"control existing listings".

### Blind Implementation Pass

Implementation would need:

- Filter Preset architecture layout with Provider Contract expanded.
- Provider mode segmented control:
  - DOM Provider;
  - WP Post Link;
  - Adapter Placeholder.
- Target discovery row:
  - detected target chips;
  - manual CSS selector field;
  - add selector action.
- Item boundary row:
  - target selector;
  - item selector;
  - exclude nodes;
  - pagination scope.
- Identity resolver priority row:
  - reorderable priority chips;
  - data-eit-post-id;
  - data-post-id;
  - permalink;
  - class token;
  - visible text.
- Data availability row:
  - data attributes;
  - visible text;
  - taxonomy hints;
  - meta hints.
- Right inspector with Settings, Preview, and Status tabs.
- Inspector sections:
  - Provider Mode;
  - Target Discovery;
  - Item Identity;
  - Fallbacks.

### Visual Pass Against The Frame

This frame explains the product idea better than a generic settings page:

- Provider Contract is the "source agreement" between a filter controller and
  whatever listing already exists.
- The selected layer is coral because it is currently inspected.
- The compact layers above and below make it clear Provider Contract influences
  Data Binding and Filter Modules.
- The inspector repeats the important parts in editable form.
- The target chips communicate detected listings without creating a results
  widget.

The renderer should make detected/manual/adapted providers feel like one
contract model, not three unrelated modes.

### Data Shape Needed

Provider contract:

- `mode`
- `target_discovery`
- `item_boundary`
- `identity_resolver_priority`
- `data_availability`
- `fallback_strategy`

Target discovery:

- `detection_mode`
- `detected_targets`
- `selected_target`
- `manual_selectors`

Detected target:

- `id`
- `label`
- `selector`
- `item_selector`
- `source`
- `status`
- `confidence`

Item boundary:

- `target_selector`
- `item_selector`
- `exclude_nodes`
- `pagination_scope`

Identity resolver:

- `strategy`
- `rank`
- `source`
- `label`
- `enabled`

Data availability:

- `data_attributes_count`
- `visible_text_count`
- `taxonomy_hints_count`
- `meta_hints_count`

### Fragilities

- Detection in the editor and detection on the frontend are different
  environments. Do not assume iframe/editor results exactly match frontend DOM.
- `Adapter Placeholder` must not imply deep Woo/JetEngine/Elementor Pro support
  exists before adapters are implemented.
- Visible text fallback is weak. The UI should call it a last resort.
- Manual selectors can break silently when the page changes. Status/preview
  checks should validate them later.
- Reorderable priority chips need keyboard and screen-reader handling if built
  as drag UI.

### Acceptance Checks

- `Provider Contract` is expanded and coral-selected.
- Provider mode shows `DOM Provider` selected.
- Target Discovery shows Products #1 selected, Products #2, Listing #3, and Add
  Selector.
- Manual CSS selector field is visible.
- Item Boundary shows `.archive-products`, `.product-card`, exclude nodes, and
  pagination scope.
- Identity Resolver Priority shows five ordered strategies.
- Data Availability shows counts for data attributes, visible text, taxonomy
  hints, and meta hints.
- Inspector title is `Provider Contract`.
- Inspector has Settings, Preview, and Status tabs.
- Detected targets list has detected status badges.
- Fallback is `Use Visible Text (last resort)`.

## Frame 20 Plan: Filter Preset Root Overview

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-20.png`

### What This Frame Represents

This is the root overview state for a Filter Preset. It is the map of the whole
configuration object and the cleanest expression of the hierarchy:

1. Root object owns every layer.
2. Infrastructure layers define scope, provider, and binding.
3. Module layer defines filter controls.
4. Output layer defines runtime behavior.

The inspector edits root-level identity, scope, status, and save contract.

### Blind Implementation Pass

Implementation would need:

- WordPress admin chrome retained.
- Toolkit top bar with tabs: Filters, CPTs, Integrations.
- Filter Preset selector/action bar.
- Root object banner:
  - `Filter Preset (Root Object)`;
  - description;
  - active badge.
- Architecture rail with numbered steps.
- Five layer bands:
  - Identity & Scope;
  - Provider Contract;
  - Data Binding Schema;
  - Filter Modules;
  - Controller Output.
- Each layer band contains summary cells and a right chevron.
- Legend:
  - infrastructure layer;
  - module layer;
  - output layer;
  - root object;
  - ownership/dependency.
- Right inspector:
  - Identity;
  - Scope;
  - Status;
  - Save Contract.

### Visual Pass Against The Frame

This frame should be the baseline for Filters. The other Filter frames are
selected states of this same architecture:

- frame 19 expands Provider Contract;
- frame 18 expands Filter Modules;
- frame 17 expands Controller Output;
- frame 16 opens Preview from the same context.

The design's "skeleton" is the ownership model:

- root object wrapper;
- vertical rail;
- layer bands;
- inspector tied to current selection.

This is the antidote to a normal WordPress settings page. The implementation
should not start from fields; it should start from an architecture object and
render fields as nested consequences of selected nodes.

### Data Shape Needed

Filter preset root:

- `id`
- `name`
- `slug`
- `description`
- `intent`
- `location`
- `priority`
- `status`
- `version`
- `created_at`
- `updated_at`
- `validation_state`

Layer summaries:

- `identity_scope`
- `provider_contract`
- `data_binding_schema`
- `filter_modules`
- `controller_output`

Filter module summary:

- `enabled_modules`
- `module_count`
- `module_labels`

Controller output summary:

- `apply_mode`
- `url_sync`
- `chips`
- `count`
- `pagination`

Save contract:

- `created`
- `updated`
- `version`
- `valid`

### Fragilities

- This frame must not become a static dashboard disconnected from the real form.
  Each summary cell should be derived from the same saved/in-memory preset
  object used by selected states.
- The architecture rail needs exact alignment. Bad connector math will make the
  UI look accidental.
- Layer colors must stay semantic. Do not recolor every card just to make the
  screen lively.
- Root inspector fields affect slugs/query vars and should validate collisions.
- The top action bar must not hide WordPress admin notices or overlap Screen
  Options/Help.

### Acceptance Checks

- Root banner says `Filter Preset (Root Object)` and shows active state.
- Five layer bands are visible and numbered.
- Identity & Scope summary shows Product Archive, product-archive, Product
  Listing, Active.
- Provider Contract summary shows DOM Provider, Products #1,
  `.product-card`, Auto Priority.
- Data Binding summary shows Meta Field, `_price`, BETWEEN, price.
- Filter Modules summary shows Search, Category Checkbox, Price Range, Color
  Swatches, Rating, Sort, and `6 Modules`.
- Controller Output summary shows Auto Apply, URL Sync enabled, Chips enabled,
  Count enabled, Pagination numbered.
- Inspector title is `Root: Filter Preset`.
- Save Contract shows valid state.

## Block 17-20 Implementation Order

This block should be implemented before polishing individual micro-controls,
because it defines the Filter Preset skeleton.

1. Build the Filter Preset root overview from frame 20.
2. Build the shared layer-band data model:
   - root;
   - layer;
   - selected layer;
   - selected child;
   - inspector context.
3. Build Provider Contract selected state from frame 19.
4. Build Filter Modules selected state with Price Range from frame 18.
5. Build Controller Output selected state from frame 17.
6. Connect all four states to the same in-memory preset object.
7. Build summary renderers that read from live form data instead of duplicate
   mock arrays.
8. Add visual regression targets:
   - root overview;
   - provider selected;
   - price module selected;
   - output behavior selected.
9. Only after the skeleton matches frames, start implementing micro-control
   behavior such as drag reorder, debounce slider behavior, and URL preview.

## Additional What Not To Code Yet For Block 17-20

- Do not implement runtime filtering while building these admin states.
- Do not create a results grid.
- Do not add deep third-party adapters behind `Adapter Placeholder`.
- Do not let manual CSS selectors execute arbitrary scripts or unsafe values.
- Do not make preview or detection depend on Elementor Pro.
- Do not save every inspector change automatically until dirty-state handling
  is explicit.
- Do not add a custom serializer runtime before the URL state contract is
  reviewed.
- Do not build decorative connector lines that do not represent real ownership
  or dependency.

## Block 21-24 Icon Delta

Frames 21-24 are a second pass over the Filter Preset architecture. They expose
the same underlying configuration as frames 17-20, but with more explicit
product screens:

- output behavior as a complete runtime/control surface;
- price range as a module schema editor;
- provider contract as a dedicated builder;
- filter preset as an object map.

These frames introduce stronger runtime and inheritance metaphors. The icon
pack should not duplicate already available filter, provider, pagination, sort,
URL, or status icons.

### Frame 21: Output Behavior Runtime Icons

Create or refine:

- `controller-state-machine`
- `state-feedback-loop`
- `output-behavior-overview`
- `url-state-card`
- `active-chips-card`
- `result-count-card`
- `sorting-card`
- `pagination-card`
- `reset-empty-loading-card`
- `runtime-url-state-card`
- `runtime-ajax-resolver-card`
- `runtime-dom-provider-card`
- `runtime-apply-reset-card`
- `state-idle`
- `state-filtering`
- `state-loading`
- `state-applying`
- `state-updated`
- `throttle-ms`
- `preserve-other-params`
- `effect-note`

### Frame 22: Filter Module Schema Icons

Create or refine:

- `module-schema-document`
- `parent-context-layer`
- `inherited-contract-badge`
- `override-contract-badge`
- `filter-module-schema`
- `parent-context`
- `inherited-setting`
- `override-setting`
- `price-range-schema`
- `module-row-drag`
- `module-row-menu`
- `duplicate-module`
- `delete-module`
- `advanced-tab`
- `data-binding-accordion`
- `bounds-accordion`
- `display-accordion`
- `behavior-accordion`
- `options-counts-accordion`

### Frame 23: Provider Contract Builder Icons

Create or refine:

- `provider-contract-builder`
- `detection-preview-window`
- `resolver-confidence-threshold`
- `provider-builder`
- `detection-preview`
- `parasitic-dom-provider`
- `wordpress-post-link`
- `provider-adapter-placeholder`
- `target-discovery-list`
- `identity-resolver`
- `priority-rule`
- `confidence-high`
- `confidence-medium`
- `confidence-low`
- `confidence-threshold`
- `unresolved-warning`
- `fallback-behavior`
- `data-attributes-summary`

### Frame 24: Filter Preset Object Map Icons

Create or refine:

- `filter-object-map`
- `ownership-spine-connectors`
- `root-object-map`
- `filter-preset-root-map`
- `root-configuration-object`
- `owns-connector`
- `inherits-connector`
- `overrides-connector`
- `context-root`
- `scope-panel`
- `save-contract-panel`
- `data-store-nav`
- `system-nav`

### Icon Delta Production Notes

- The runtime/state-machine icons should look more operational than the
  architecture layer icons, but still share stroke weight and palette.
- Inherited and override badges must be visually distinct. Inherited is calm
  and contract-like; override is coral and action-like.
- Provider detection preview should read as a page/canvas preview, not as a
  generic browser icon.
- Object map and ownership spine icons should make ownership/inheritance feel
  structural, not decorative.
- Repeated concepts are aliases. Do not generate a second bitmap for URL state,
  pagination, sort, chips, provider, or regular status pills.

### Frame 21-24 Asset Production Status

Generated source:

`docs/assets/implementation-toolkit/admin-v0.2/icons/source/frame-21-24-icon-source-sheet-01-chroma.png`

Processed alpha sheet:

`docs/assets/implementation-toolkit/admin-v0.2/icons/processed/frame-21-24-icon-source-sheet-01-alpha.png`

Extracted review pack:

`docs/assets/implementation-toolkit/admin-v0.2/icons/extracted/frame-21-24-pack-01/`

Production WebP output:

`wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/images/icons/`

Generated canonical icons:

- `controller-state-machine`
- `state-feedback-loop`
- `detection-preview-window`
- `parent-context-layer`
- `inherited-contract-badge`
- `override-contract-badge`
- `module-schema-document`
- `options-counts`
- `provider-contract-builder`
- `resolver-confidence-threshold`
- `filter-object-map`
- `ownership-spine-connectors`

Duplicate prevention manifest:

`docs/assets/implementation-toolkit/admin-v0.2/icons/icon-aliases-frame-21-24.json`

The alias manifest maps 73 requested frame-level icon names to these 12 new
canonical icons or already existing plugin icons. It currently has zero missing
targets for frames 21-24.

## Frame 21 Plan: Output Behavior Runtime Surface

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-21.png`

### What This Frame Represents

This frame isolates `Output Behavior` as a full control surface. It is still a
Filter Preset state, but it reads more like a product screen than the compact
architecture builder from frame 17.

The selected object is `URL State` inside Output Behavior. The frame also
introduces two important runtime explanations:

- a flow from URL State to AJAX Resolver to DOM Provider to Apply / Reset;
- a controller state machine: Idle, Filtering, Loading, Applying, Updated.

### Blind Implementation Pass

Implementation would need:

- Toolkit shell with left navigation and top preset actions.
- Breadcrumb: Filter Preset -> Filter Modules -> Output Behavior.
- Output Behavior header:
  - icon;
  - inherited badge;
  - child-of-filter-preset badge.
- Six summary cards:
  - Apply Strategy;
  - URL State selected;
  - Active Chips;
  - Result Count;
  - Sorting;
  - Pagination.
- Full-width Reset / Empty / Loading States row.
- Runtime Flow diagram with state feedback loop.
- Controller State Machine diagram.
- Right inspector for URL State:
  - sync URL;
  - query var format;
  - shareable state;
  - session persistence;
  - clean empty values;
  - replace history;
  - throttle;
  - preserve other params;
  - effect note.

### Visual Pass Against The Frame

This frame is not a generic settings page. Its structure is:

- layer header;
- setting cards;
- runtime explanation panels;
- contextual inspector.

The setting cards act like an architectural dashboard. The selected URL State
card has a coral border and the inspector repeats the same context.

The state machine must be drawn with restrained lines and actual states. It
should not become a decorative diagram that does not correspond to runtime
state names.

### Data Shape Needed

Output behavior:

- `apply_strategy`
- `url_state`
- `active_chips`
- `result_count`
- `sorting`
- `pagination`
- `reset_empty_loading`
- `runtime_flow`
- `state_machine`

URL state:

- `sync_url`
- `query_var_format`
- `shareable_state`
- `session_persistence`
- `clean_empty_values`
- `replace_history`
- `throttle_ms`
- `preserve_other_params`

State machine:

- `idle`
- `filtering`
- `loading`
- `applying`
- `updated`
- `transitions`

### Fragilities

- This frame shows a different shell from earlier frames. Before coding, the
  product shell must be normalized so visual drift does not create multiple
  admin products.
- Query var format must be compatible with the runtime parser.
- Replace History and Preserve Other Params can conflict if not specified
  clearly.
- Throttle and debounce should not both be applied blindly to the same event.
- Runtime flow and state machine should be generated from a shared model, not
  separately hardcoded.

### Acceptance Checks

- `Output Behavior` title is visible with inherited badge.
- URL State card is selected.
- Apply Strategy shows auto apply on, manual button off, debounce 400, update on
  drag on.
- URL State shows sync URL, shareable state, and session persistence on.
- Active Chips, Result Count, Sorting, Pagination, and Reset / Empty / Loading
  States are visible.
- Runtime Flow contains URL State, AJAX Resolver, DOM Provider, Apply / Reset,
  and State Feedback.
- Controller State Machine contains Idle, Filtering, Loading, Applying, Updated.
- Inspector title is `URL State` and includes the Effect explanation panel.

## Frame 22 Plan: Filter Module Schema Price Range

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-22.png`

### What This Frame Represents

This frame treats `Price Range` as a module schema editor. The key idea is
inheritance: provider-level context supplies default values, and the module can
override only what it needs.

The selected object is the Price Range module, with the inspector focused on
its identity section.

### Blind Implementation Pass

Implementation would need:

- Dedicated Filter Module Schema screen.
- Parent Context band:
  - Provider: DOM Provider;
  - Target Listing: Products #1;
  - Item Selector: `.product-card`;
  - URL Sync: Enabled;
  - inherited badges.
- Filter Modules list:
  - Search;
  - Category Checkbox;
  - Price Range selected;
  - Color Swatches;
  - Rating;
  - Sort;
  - Add Module Here drop zone.
- Price Range schema panel with rows:
  - Identity;
  - Data Binding;
  - Bounds;
  - Display;
  - Behavior;
  - Options & Counts.
- Inherited/Override badges per row.
- Right inspector:
  - Settings / Advanced tabs;
  - Identity fields;
  - Data Binding;
  - Bounds;
  - Display;
  - Behavior;
  - Options & Counts.

### Visual Pass Against The Frame

The frame's important structure is not the card styling. It is the inheritance
hierarchy:

- Parent Context applies to all modules.
- Module list selects one child.
- Schema rows show which parts are inherited and which parts override.
- Inspector edits the selected row/object.

The final implementation needs a real inherited/override model. A red badge
alone is not enough.

### Data Shape Needed

Module schema:

- `id`
- `type`
- `enabled`
- `parent_context`
- `sections`
- `override_state`
- `inspector_tab`

Parent context:

- `provider_mode`
- `target_listing`
- `item_selector`
- `url_sync`

Schema section:

- `id`
- `label`
- `summary`
- `inheritance`
- `fields`

Identity fields:

- `label`
- `key`
- `query_var`
- `enabled`
- `show_label`

### Fragilities

- Inherited values must be read-only until overridden.
- Removing an override should restore the provider value without data loss.
- Duplicate module action must generate unique keys/query vars.
- Delete requires confirmation and should not remove module types globally.
- The Add Module Here drop zone can be a button in V0.2; drag/drop can come
  later.

### Acceptance Checks

- Parent Context band is visible and all four context cards show `Inherited`.
- Price Range is selected in the module list.
- Price Range schema panel is coral-selected and enabled.
- Identity, Bounds, Display, and Behavior show override badges.
- Data Binding and Options & Counts show inherited badges.
- Inspector title is `PRICE RANGE`.
- Settings tab is active.
- Identity fields show Label `Price`, Key `price_range`, Query Var `price`,
  Enabled on, Show Label on.
- Legend explains inherited versus override.

## Frame 23 Plan: Provider Contract Builder

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-23.png`

### What This Frame Represents

This is the dedicated Provider Contract Builder state. It expands the provider
contract concept into a step-by-step builder and shows why the plugin does not
need its own results grid: it learns how to target and control existing
listings.

The selected step is `Identity Resolver`.

### Blind Implementation Pass

Implementation would need:

- Toolkit shell with Filters/CPTs/Integrations top nav.
- Provider Contract Builder header and Detection Preview button.
- Five-step provider contract form:
  1. Provider Mode;
  2. Target Discovery;
  3. Item Boundary;
  4. Identity Resolver selected;
  5. Data Availability.
- Provider Mode cards:
  - Parasitic DOM Provider selected;
  - WordPress Post Link;
  - Adapter Placeholder.
- Target Discovery rows with detected targets and selectors.
- Item Boundary selector rows.
- Identity Resolver priority table.
- Data Availability cards.
- Right side:
  - Detection Preview card;
  - Inspector Identity Resolver card;
  - fallback behavior;
  - unresolved warning toggle;
  - resolver confidence threshold slider.

### Visual Pass Against The Frame

This frame is the clearest contract-builder metaphor:

- numbered steps describe a pipeline;
- selected step is coral;
- right inspector edits the selected step;
- preview card shows detected target highlighting.

The UI should not imply that the plugin renders the listing. The Detection
Preview only highlights the existing target and verifies detection confidence.

### Data Shape Needed

Provider contract:

- `provider_mode`
- `target_discovery`
- `item_boundary`
- `identity_resolver`
- `data_availability`
- `detection_preview`

Identity resolver rule:

- `id`
- `rank`
- `label`
- `source`
- `confidence`
- `enabled`

Detection preview:

- `selected_target`
- `target_selector`
- `highlight_enabled`
- `open_page_url`
- `confidence`

Fallback behavior:

- `mode`
- `unresolved_item_warning`
- `confidence_threshold`

### Fragilities

- Highlight on Page cannot be a fake button forever. It needs an editor/frontend
  detection bridge later.
- Resolver order changes can affect runtime item matching; save should be
  explicit.
- Confidence labels are estimates. The UI should avoid overpromising.
- WordPress Post Link and Adapter Placeholder are contracts in V0.2, not full
  adapters.
- Manual selectors and exclude selectors need strict sanitization.

### Acceptance Checks

- Provider Contract Builder title is visible.
- Parasitic DOM Provider is selected.
- Products #1, Products #2, Listing #3, and Manual CSS Selector appear in Target
  Discovery.
- Item Boundary fields include item selector, card selector, exclude nodes, and
  pagination scope.
- Identity Resolver is selected and coral-highlighted.
- Priority table has five rules with confidence badges.
- Data Availability shows data attributes, visible fields, taxonomy hints, and
  meta hints.
- Detection Preview card highlights Products #1.
- Inspector includes Add Rule, fallback behavior, unresolved warning, and
  confidence threshold.

## Frame 24 Plan: Filter Preset Object Map

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-24.png`

### What This Frame Represents

This is the object-map version of the Filter Preset overview. It expresses the
backend hierarchy more directly than the earlier overview:

- Filter Preset is the root configuration object.
- The root owns Identity & Scope, Provider Contract, Data Binding Schema, Filter
  Modules, and Output Behavior.
- Some relationships inherit values.
- Some module relationships override values.

The inspector is focused on `Filter Preset (Root)`.

### Blind Implementation Pass

Implementation would need:

- Toolkit shell with Filters active.
- Preset header with root icon, title, active badge, save button.
- Object map card:
  - root object panel;
  - ownership spine on the left;
  - five layer cards;
  - relationship labels: owns, inherits, overrides.
- Layer cards with compact field chips.
- Inspector with:
  - context banner;
  - Identity;
  - Scope;
  - Save Contract.

### Visual Pass Against The Frame

This is the strongest answer to the user's "skeleton" critique. The frame is
not just a prettier settings page; it shows the object model:

- root object wraps the architecture;
- lines label relationship semantics;
- cards sit inside a containment boundary;
- inspector follows the selected root context.

Implementation should begin from an object graph model:

- nodes;
- edges;
- selected node;
- inspector schema.

The UI can then render that graph as cards, not as isolated form sections.

### Data Shape Needed

Object map:

- `root_node`
- `nodes`
- `edges`
- `selected_node`
- `inspector_context`

Node:

- `id`
- `type`
- `label`
- `summary`
- `status`
- `fields`

Edge:

- `from`
- `to`
- `relationship`
- `inherits`
- `overrides`

Root inspector:

- `identity`
- `scope`
- `save_contract`

### Fragilities

- The generated shell differs from other frames. The implementer must choose a
  single final product shell before coding.
- Object-map lines can become decorative if they are not driven by actual
  relationships.
- Relationship labels must be truthful. Do not show `inherits` unless the child
  actually inherits values from the parent/provider context.
- Save Contract dates and author should come from stored metadata.
- Root object selection should not conflict with selected layer/child states.

### Acceptance Checks

- Header says `Filter Preset: Product Archive`.
- Object map title says `FILTER PRESET OBJECT MAP`.
- Root object card says `Filter Preset` and `Root Configuration Object`.
- Five child layers are visible.
- Ownership spine includes owns/inherits/overrides relationship labels.
- Identity & Scope shows product archive fields.
- Provider Contract shows DOM Provider, target, item, identity.
- Data Binding Schema shows source, key pattern, compare, type, query var.
- Filter Modules shows seven modules.
- Output Behavior shows AJAX, URL Sync, Active Chips, Result Count, Pagination,
  Empty State, Loading State.
- Inspector context says `Filter Preset (Root)`.
- Save Contract shows version, author, created, last saved.

## Block 21-24 Implementation Order

This block should be implemented as a structural refinement pass after the
Filter skeleton from frames 17-20 exists.

1. Normalize the final admin shell so frames 21-24 do not fork the product into
   multiple visual systems.
2. Implement object graph data for Filter Presets:
   - root node;
   - layer nodes;
   - child module nodes;
   - ownership/inheritance/override edges.
3. Render the frame 24 object map from that graph.
4. Render the frame 23 Provider Contract Builder from the same provider node.
5. Render the frame 22 Price Range schema from the same module node and parent
   context.
6. Render the frame 21 Output Behavior runtime surface from the output node.
7. Connect inspector context to selected graph node/section.
8. Add visual QA for:
   - object map;
   - provider builder;
   - price module schema;
   - output behavior runtime/state machine.
9. Only after these states match structurally, implement interactions such as
   drag reorder, detection preview, override removal, and state-machine runtime
   animation.

## Additional What Not To Code Yet For Block 21-24

- Do not fork the admin into four unrelated shells.
- Do not build runtime animation for the state machine yet.
- Do not implement deep adapter behavior behind WordPress Post Link or Adapter
  Placeholder.
- Do not make Detection Preview alter real pages before a safe editor/frontend
  bridge exists.
- Do not implement drag/drop until keyboard-accessible ordering is planned.
- Do not autosave inherited/override changes before dirty state is explicit.
- Do not make object-map connectors decorative; every line must represent a
  data relationship.

## Block 25-28 Icon Delta

Frames 25-28 are a final filter-system pass. They do not justify a new icon
pack by default.

Important correction: an initial generated sprite for this block was rejected
because it duplicated concepts already covered by the canonical icon system.
The duplicated WebPs and extracted pack were removed from the plugin/docs asset
tree. This block should use aliases only unless a future review proves a
missing concept.

### Frame 25: Coverage Board Aliases

Frame 25 is a generated contact/coverage board showing five filter states:

1. Configuration Object Map;
2. Provider Contract Builder;
3. Filter Module Schema;
4. Output Behavior & State;
5. Contextual Preview Modal.

Do not implement this as a new admin screen. Treat it as a visual inventory that
confirms the expected state coverage.

Alias mapping:

- `configuration-object-map` -> `filter-object-map`
- `provider-contract-builder-mini` -> `provider-contract-builder`
- `filter-module-schema-mini` -> `module-schema-document`
- `output-behavior-state-mini` -> `controller-state-machine`
- `contextual-preview-modal-mini` -> `preview`
- `root-architecture-object` -> `filter-object-map`
- `dependency-spine-mini` -> `ownership-spine-connectors`

### Frame 26: Filter Architecture + Preview Aliases

Frame 26 uses an architecture canvas with a live-style controller preview and
right inspector. It introduces no new icon concepts; it combines existing
architecture, preview, target, module, and inspector symbols.

Alias mapping:

- `visual-architecture-builder` -> `filter-object-map`
- `data-model-layer` -> `source-database`
- `query-contract-layer` -> `query-funnel`
- `target-control-layer` -> `target-bullseye`
- `runtime-state-layer` -> `runtime`
- `contextual-preview-modal` -> `preview`
- `selected-price-range` -> `range-sliders`
- `existing-listing-card` -> `existing-cards`
- `active-chips-target` -> `chips`
- `apply-complete` -> `valid`

### Frame 27: Visual Filter Architecture Aliases

Frame 27 is the most diagrammatic version of the filter architecture. It shows
source, query contract, filter layer, target listing, inspector, and runtime
pipeline.

Alias mapping:

- `source-column` -> `source-database`
- `query-contract-column` -> `query-funnel`
- `filter-layer-column` -> `module`
- `target-listing-column` -> `existing-cards`
- `runtime-pipeline-row` -> `runtime`
- `base-query` -> `base-query-layers`
- `constraints` -> `constraints-sliders`
- `context` -> `context-crosshair`
- `input-compare-output-state` -> `binding`
- `publish-action` -> `publish-rocket`

### Frame 28: Preset Library + Chips Editor Aliases

Frame 28 is the only frame in this block that feels like a separate admin
interaction: a preset library/list on the left, filter editor in the center, and
settings drawer on the right.

Even here, the icons are already covered by existing canonicals.

Alias mapping:

- `preset-library-list` -> `filter-funnel`
- `filter-preset-list` -> `filter-funnel`
- `product-archive-filter` -> `filter-funnel`
- `blog-archive-filter` -> `post-type-document`
- `events-filter` -> `admin-screen`
- `directory-filter` -> `existing-cards`
- `knowledge-base-filter` -> `post-type-document`
- `category-chips-module` -> `chips`
- `filter-settings-panel` -> `inspector-sliders`
- `options-editor` -> `options-counts`
- `active-chips-preview` -> `chips`
- `pagination-preview` -> `pagination`
- `export-preset` -> `save-disk`
- `disable-preset` -> `locked`

### Icon Delta Production Status

No production icons should be created for this block.

Duplicate-prevention manifest:

`docs/assets/implementation-toolkit/admin-v0.2/icons/icon-aliases-frame-25-28.json`

The alias manifest maps 64 requested frame-level icon names to existing
canonical icons. It currently has zero missing targets for frames 25-28.

Rejected duplicate pack:

- source sheet removed;
- processed alpha sheet removed;
- extracted review pack removed;
- plugin WebPs removed.

## Frame 25 Plan: Filter State Coverage Board

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-25.png`

### What This Frame Represents

Frame 25 is not a screen state to implement. It is a coverage board showing the
five major Filter Preset states that the admin needs to support:

1. root configuration object map;
2. provider contract builder;
3. filter module schema;
4. output behavior and state;
5. contextual preview modal.

The frame is useful because it exposes whether the system has enough states to
describe the backend hierarchy. It should not become a UI pattern on its own.

### Blind Implementation Pass

No direct implementation pass. Use it as a checklist:

- confirm object map exists;
- confirm provider builder exists;
- confirm module schema editor exists;
- confirm output behavior/runtime state exists;
- confirm contextual preview modal exists.

### Visual Pass Against The Frame

The board shows five different states on one image, which is exactly the
pattern the user rejected earlier when asking for "frames diferentes" versus
"estados do mesmo layout." Treat this as an index/contact sheet only.

The final admin should not show numbered preview frames inside the product UI.

### Data Shape Needed

Coverage record:

- `state_id`
- `source_frame`
- `implemented_by_screen`
- `required_for_v0_2`
- `visual_qa_target`
- `status`

### Fragilities

- If implemented literally, this would create a fake dashboard instead of a
  functional admin.
- It can hide shell drift because the five previews use different shells.
- It should not create new icon or component requirements by itself.

### Acceptance Checks

- Used only as a coverage checklist.
- No admin menu item or runtime screen is created from this frame.
- Every visible state maps to one real frame/state plan elsewhere.
- No new production icons are generated only because this board displays them.

## Frame 26 Plan: Filter Architecture With Contextual Preview

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-26.png`

### What This Frame Represents

Frame 26 combines the full filter architecture with an opened contextual
preview modal and a selected Price Range inspector. It is a stronger version of
the "controller preview only" rule: preview the filter controls and state, not a
new listing/grid.

The selected module is `Price Range`.

### Blind Implementation Pass

Implementation would need:

- Stable Toolkit shell and Filters tab.
- Architecture canvas with five bands:
  - Data Model;
  - Query Contract;
  - Filter Modules;
  - Target Control;
  - Runtime State.
- Selected Price Range module inside Filter Modules.
- Right inspector for Price Range:
  - Data Binding;
  - Bounds;
  - Display;
  - Behavior.
- Controller preview modal:
  - search;
  - category checkboxes;
  - price range;
  - color swatches;
  - rating;
  - sort;
  - active filters;
  - result count;
  - pagination.
- Runtime row:
  - URL State;
  - AJAX Resolver;
  - DOM Update;
  - Apply Complete.

### Visual Pass Against The Frame

This frame is valuable because it places the preview modal beside the selected
module inspector, showing how editing and preview relate.

The modal must feel contextual:

- it is opened from the current preset state;
- it reflects the selected module;
- it previews controller UI only;
- it does not render external listing cards.

The architecture bands are useful, but they should be reconciled with the
object-map/layer-band shell chosen earlier.

### Data Shape Needed

Architecture preview context:

- `selected_module`
- `architecture_bands`
- `preview_state`
- `inspector_context`
- `runtime_state`

Preview state:

- `device`
- `filters`
- `active_filters`
- `result_count`
- `pagination`
- `sort`

Runtime state:

- `url_state`
- `ajax_endpoint`
- `dom_update_target`
- `apply_complete_ms`

### Fragilities

- The preview modal can become too close to a real frontend renderer. Keep it
  as a controller simulation.
- Architecture band names differ from earlier frames. Normalize the final
  vocabulary before coding.
- The inspector and preview must read the same module object, not duplicated
  sample values.
- Apply timing (`512 ms`) should be preview/sample metadata, not a performance
  promise.

### Acceptance Checks

- Data Model, Query Contract, Filter Modules, Target Control, and Runtime State
  bands are visible.
- Price Range is selected inside Filter Modules.
- Preview modal title is `Filter Controller Preview`.
- Modal includes search, category, range, color, rating, sort, active filters,
  result count, reset/apply, and pagination.
- Inspector title is `Price Range`.
- Inspector shows Data Binding, Bounds, Display, and Behavior.
- Runtime row shows URL State, AJAX Resolver, DOM Update, and Apply Complete.

## Frame 27 Plan: Visual Filter Architecture Builder

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-27.png`

### What This Frame Represents

Frame 27 is the most explicit "visual architecture" version of the Filter
Preset builder. It shows four vertical architecture columns plus a runtime
pipeline:

- Source;
- Query Contract;
- Filter Layer;
- Target Listing;
- Runtime.

The selected module is again `Price Range`, and the inspector edits that
module.

### Blind Implementation Pass

Implementation would need:

- Large visual architecture canvas.
- Source column:
  - Provider;
  - Post Type;
  - Taxonomy;
  - Meta.
- Query Contract column:
  - Base Query;
  - Constraints;
  - Context.
- Filter Layer:
  - Search;
  - Category Checkbox;
  - Price Range selected;
  - Color Swatches;
  - Rating;
  - Sort.
- Target Listing column:
  - Existing Cards;
  - Pagination;
  - Result Count;
  - Active Chips.
- Runtime pipeline:
  - URL State;
  - AJAX Resolver;
  - DOM Provider;
  - Reset / Apply.
- Right inspector for selected Price Range.

### Visual Pass Against The Frame

This frame directly answers the structural requirement: the UI should reveal
what influences what.

The implementation should preserve these relationships:

- Source feeds Query Contract.
- Query Contract feeds Filter Layer.
- Filter Layer controls Target Listing.
- Runtime coordinates URL/AJAX/DOM/apply behavior.

The visual canvas is powerful, but it must not become a separate product shell.
It should be a rendering mode of the same object graph introduced in frames
21-24.

### Data Shape Needed

Visual architecture graph:

- `source_nodes`
- `query_contract_nodes`
- `filter_module_nodes`
- `target_listing_nodes`
- `runtime_nodes`
- `edges`
- `selected_node`
- `inspector_context`

Node:

- `id`
- `label`
- `type`
- `status`
- `summary`
- `inputs`
- `outputs`

Edge:

- `from`
- `to`
- `direction`
- `relationship`

### Fragilities

- Connector lines must map to real dependencies.
- The graph can become visually complex on mobile; provide a stacked fallback.
- If this view becomes the default, editing simple presets may feel heavy.
- Filter module reorder must update graph order and output behavior.
- Inspector changes must propagate to the graph and preview.

### Acceptance Checks

- Source, Query Contract, Filter Layer, Target Listing, and Runtime areas are
  visible.
- Source nodes include Provider, Post Type, Taxonomy, and Meta.
- Query Contract contains Base Query, Constraints, Context.
- Price Range is selected and coral-highlighted.
- Each filter module shows Input, Compare, Output State chips.
- Target Listing includes Existing Cards, Pagination, Result Count, Active
  Chips.
- Runtime includes URL State, AJAX Resolver, DOM Provider, Reset / Apply.
- Inspector edits Price Range module settings.

## Frame 28 Plan: Preset Library And Category Chips Editor

Source image:

`docs/assets/implementation-toolkit/admin-v0.2/frames/frame-28.png`

### What This Frame Represents

Frame 28 introduces a preset library/list workflow. It shows multiple filter
presets on the left, the selected preset in the center, and a right settings
drawer for `Category Chips`.

This state is useful for managing multiple presets, but it is a different shell
from the WordPress-admin-contained layout used elsewhere. It should be treated
as a future or alternate view unless the final shell explicitly adopts it.

### Blind Implementation Pass

Implementation would need:

- Left preset library:
  - Product Archive Filter active;
  - Blog Archive Filter draft;
  - Events Filter draft;
  - Directory Filter inactive;
  - Knowledge Base Filter draft.
- Center preset editor:
  - Runtime section;
  - Filters section;
  - expanded Category Chips module;
  - option rows;
  - active chips preview;
  - pagination preview.
- Right settings drawer:
  - module selector;
  - Settings / Style / Advanced tabs;
  - General section;
  - Appearance section;
  - Preview chips.
- Save/disable/export actions.

### Visual Pass Against The Frame

This frame has a polished product feel, but it risks breaking the requirement
to keep WordPress admin chrome visible. The useful ideas are:

- preset library list;
- selected module drawer;
- chips option editor;
- active chips/pagination preview.

The final implementation can borrow those interaction patterns without copying
the standalone shell.

### Data Shape Needed

Preset library:

- `presets`
- `selected_preset_id`
- `filters`
- `status`

Category chips module:

- `type`
- `data_source`
- `options`
- `appearance`
- `preview`

Chip option:

- `value`
- `label`
- `visual`
- `enabled`
- `order`

Appearance:

- `layout`
- `color_source`
- `shape`
- `columns`
- `max_visible`

### Fragilities

- This shell may conflict with WordPress admin chrome and previous frames.
- Option visuals should not become a full taxonomy term manager in V0.2.
- Custom colors need sanitization and accessible contrast checks.
- Preset library selection must protect unsaved changes.
- Style/Advanced tabs could explode scope if treated as full Elementor-style
  controls.

### Acceptance Checks

- Preset list shows at least five presets with statuses.
- Product Archive Filter is selected.
- Runtime provider and target are visible.
- Category Chips module is expanded.
- Options show value, label, visual, enabled, and delete controls.
- Active chips preview shows Electronics, price range, rating, and Clear all.
- Pagination preview is visible.
- Right drawer title is `Filter Settings`.
- Category Chips settings include taxonomy data source, multi-select, columns,
  max visible, layout, color source, shape, and preview.

## Block 25-28 Implementation Order

This block should be used as a reconciliation pass, not as the first
implementation target.

1. Treat frame 25 as coverage evidence only.
2. Choose one final admin shell before implementing frames 26-28.
3. Reuse the object graph model from frames 21-24.
4. Render frame 27's visual architecture as a graph view of the same preset
   data.
5. Render frame 26's preview modal as the contextual preview state for a
   selected module.
6. Extract the useful preset-library interaction from frame 28 without adopting
   its standalone shell wholesale.
7. Implement Category Chips editing only as module configuration, not taxonomy
   management.
8. Add visual QA targets for:
   - visual architecture graph;
   - contextual preview modal;
   - category chips module editor;
   - preset library/list if adopted.

## Additional What Not To Code Yet For Block 25-28

- Do not create a contact-board/dashboard from frame 25.
- Do not generate new icons unless the alias manifest proves a real missing
  canonical concept.
- Do not fork the admin shell into a standalone SaaS app unless that is a
  deliberate product decision.
- Do not render listing cards/results in the preview modal.
- Do not turn Category Chips into a taxonomy term CRUD manager in this phase.
- Do not implement full Style/Advanced systems before the architecture screens
  are stable.
- Do not add drag/drop or export behavior until unsaved-change handling exists.

## Next Block

All saved frames from `frame-01.png` through `frame-28.png` now have a planning
pass. The next useful pass should reconcile the whole plan into a phased
implementation sequence:

- canonical admin shell;
- canonical icon manifest;
- reusable component map;
- first implementation slice;
- QA checklist tied to the saved frames.

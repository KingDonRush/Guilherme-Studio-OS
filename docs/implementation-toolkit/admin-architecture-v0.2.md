# Elementor Implementation Toolkit Admin Architecture V0.2
## Objective

Rebuild the Elementor Implementation Toolkit admin as a real product system
inside the WordPress admin chrome. V0.2 is not a CSS cleanup pass. It defines a
shared admin architecture for configuration objects, contextual inspectors,
preview states, and saved contracts that can grow into runtime modules later.

The plugin must remain self-contained, Elementor Free-compatible, and must not
create its own listing/grid renderer.

## Screens

### Filter Presets

Purpose: configure reusable Filter Controller contracts that the Elementor
widget can consume without forcing every backend detail into Elementor controls.

Required layers:

- Identity & Scope
- Provider Contract
- Data Binding Schema
- Filter Modules
- Controller Output

Required states of the same layout-base:

- preset overview
- provider contract selected
- Price Range module expanded
- controller output selected
- controller preview modal open

Current V0.2 behavior:

- saves to `eit_filter_presets`
- keeps existing sanitization and nonce/capability checks
- keeps existing filter types and structured sort/options rows
- preview renders the controller controls only
- preview does not render a listing/grid

Future runtime boundary:

- deeper provider adapters can be added later for JetEngine, Elementor Pro Loop
  Grid, WooCommerce, or other listing widgets
- V0.2 only formalizes the admin contract and parasitic DOM assumptions

### CPT Manager

Purpose: provide a compact JetEngine-style content model manager for demos and
portfolio builds without cloning all of JetEngine.

Required layers:

- Identity & Labels
- Registration Contract
- Editor Supports
- Taxonomy Layer
- Meta Field Layer
- REST/Admin Exposure

Required states of the same layout-base:

- CPT overview
- registration contract selected
- taxonomy selected
- meta field selected
- content model preview modal open

Current V0.2 behavior:

- saves to `eit_cpt_definitions`
- registers CPTs, taxonomies, meta boxes, and REST-enabled meta through native
  WordPress APIs
- keeps nonce/capability checks and server-side sanitization
- preview renders the content model contract only
- preview does not render frontend or listing output

Future runtime boundary:

- template binding, archive helpers, and WooCommerce-style builders are future
  modules, not part of the current CPT runtime

### Integrations / Superpowers

Purpose: create a real admin area for the Toolkit's broader implementation
modules. These are product modules with saved settings and previews now, not
full runtime integrations yet.

Required modules:

1. Simple Budget Bridge
2. WooCommerce Card Adapter
3. Mobile Filter Panel
4. Listing Target Detector
5. URL State Router
6. Conditional Display Rules
7. Design Token Mapper
8. Editor Handoff Notes
9. QA Scenario Runner
10. Connector Registry

Required state model:

- module overview
- selected module contract
- inspector focused on the selected module settings
- conceptual preview modal
- status visible as active, draft, or degraded

Current V0.2 behavior:

- saves to `eit_integration_patterns`
- exposes configuration, status, preview, and admin contract for each module
- does not implement deep integrations with WooCommerce, JetEngine, Elementor
  Pro, or Simple Budget yet

Future runtime boundary:

- each module can later gain a runtime adapter behind the saved admin contract
- any deep third-party integration remains optional, adapter-based, and not a
  public dependency of the base plugin

## Shared Components

The admin should be implemented as reusable product components, not one giant
screen-specific pile of markup.

Required reusable pieces:

- Toolkit shell
- top bar
- object pill
- architecture canvas
- containment shell
- module card
- contextual inspector
- preview modal
- library strip
- repeater rows
- empty states
- status badges
- icon assets

## Asset Inventory

Final assets belong in:

`wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/images/icons/`

Asset rules:

- WebP output
- transparent background
- cropped by alpha bounding box
- generated from the approved visual direction, then cleaned deterministically
  when needed

Icon groups:

- Core architecture: object, scope, contract, schema, module, output, runtime,
  inspector
- Filters: provider, binding, range, checkbox, swatch, rating, sort, chips,
  pagination
- CPT: post type, labels, registration, supports, taxonomy, meta field, REST,
  rewrite, admin screen
- Integrations: Simple Budget bridge, Woo adapter, mobile panel, detector, URL
  router, conditional rules, token mapper, handoff notes, QA runner, connector
  registry
- States: active, draft, inherited, override, warning, degraded, valid,
  preview, locked

Palette tokens:

- teal: structure and contracts
- purple: modules and configurable layers
- coral: selection, inspector, modal focus
- green: active and valid states
- amber: degraded and warning states
- blue: runtime and URL/state movement

## Visual Acceptance

- WordPress admin chrome remains visible.
- The admin has its own product language instead of default WordPress form
  stacks.
- The same layout-base is reused across states. Generated frames represent
  different states of the same screen, not unrelated conceptual screens.
- Hierarchy is architectural: each layer shows what contains, influences, maps,
  or outputs into the next layer.
- Connectors are minimal, aligned, and meaningful.
- Cards and fields do not overflow.
- The inspector is fixed on desktop and usable on tablet/mobile.
- Modals are contextual and only appear where preview helps the implementer.
- No decorative random lines, leaking boxes, or educational footer blocks.

## Functional Acceptance

- Filter Presets keep saving into `eit_filter_presets`.
- CPT Manager keeps saving into `eit_cpt_definitions`.
- Integrations save into `eit_integration_patterns`.
- All state-changing actions use capability checks and nonces.
- User-controlled values are sanitized on save and escaped on render.
- Preview does not save data.
- Add/remove repeaters work for filters, choices, taxonomies, and meta fields.
- Integration modules can be opened, configured, previewed, and saved.
- The plugin remains self-contained and does not add new dependencies.

## Current Admin Versus Future Runtime

Implemented now:

- admin contracts
- saved configuration
- contextual inspector states
- conceptual previews
- V0.2 asset system and component styling
- native WordPress CPT/tax/meta registration already present in the CPT manager

Deferred:

- deep WooCommerce card adapter runtime
- deep Simple Budget event bridge runtime
- JetEngine or Elementor Pro adapter runtime
- mobile off-canvas frontend behavior
- QA runner automation runtime
- connector registry execution layer
- Theme Builder or JetWooBuilder-style surface

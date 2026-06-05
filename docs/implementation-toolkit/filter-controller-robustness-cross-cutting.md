# Filter Controller Cross-Cutting Robustness Audit

Date: 2026-06-05

Tasks: `TASK-FC-029` through `TASK-FC-033`
Subplan: `SUBPLAN-FC-ROBUSTNESS-AUDIT`

Status: cross-cutting audit complete, implementation not started.

## Scope

This document covers shared contracts that affect all filter types:

- visual containment and overflow;
- dynamic tag field binding and preset persistence;
- CPT fields as Elementor dynamic tag sources;
- domain neutrality;
- layout percentages and row packing.

## TASK-FC-029: Visual Containment And Overflow

### Source Evidence

- Outer layout: `assets/css/eit-frontend.css:44`
- Filter grid span: `assets/css/eit-frontend.css:66`
- Sort/actions full-row behavior: `assets/css/eit-frontend.css:73`
- Field width base: `assets/css/eit-frontend.css:83`
- Range vertical grids: `assets/css/eit-frontend.css:390`
- Mobile full-width fallback: `assets/css/eit-frontend.css:619`
- Per-filter `layout_width` render: `includes/Elementor/Widgets/FilterController.php:147`

### Current Behavior

The outer controller uses a 100-column CSS grid. Each filter group renders
`--eit-filter-column-span`, which means the architecture already supports the
JetEngine-like idea of placing multiple filters on one row by percentage.

This is good, but incomplete. The outer block can be correct while the inner
component overflows. Range is the clearest example because vertical mode can
combine values, current labels, sliders, and ticks into three or four internal
columns.

### Failure Modes

- A filter with `layout_width` below 50 can contain controls wider than its
  assigned span.
- Range vertical can overflow when inputs, labels, ticks, and sliders are all
  visible.
- `--eit-range-input-width` defaults to 140px and can be configured higher,
  which can exceed narrow filter spans.
- Sort and reset actions cannot currently participate in the same percentage
  packing model.
- A valid desktop layout can still fail before the mobile breakpoint.

### Required Next Work

- Add containment rules for every filter anatomy, not only Range.
- Add a CSS contract that internal controls use `min-width: 0`, `max-width:
  100%`, and predictable wrapping.
- Make Range vertical choose a compact fallback when the assigned filter span is
  too narrow.
- Add visual tests that combine each filter type with `25`, `33`, `50`, and
  `100` width.

## TASK-FC-030: Dynamic Tag Binding And Preset Persistence

### Source Evidence

- Dynamic field control: `includes/Elementor/FilterController/ContentControls.php:216`
- Hidden dynamic binding field: `includes/Elementor/FilterController/ContentControls.php:232`
- Preset mapping: `assets/js/eit-editor.js:229`
- Widget setting update: `assets/js/eit-editor.js:376`
- Preset to widget map: `includes/Elementor/FilterController/FilterSettings.php:64`
- Dynamic binding extraction: `includes/Elementor/FilterController/FilterSettings.php:165`
- Dynamic-tag parse path: `includes/Elementor/FilterController/FilterSettings.php:204`
- Preset sanitizer: `includes/Support/FilterPresets.php:293`

### Current Behavior

The code already tries to preserve dynamic bindings in both widget settings and
saved presets. The effective key resolver prefers a plain field binding if it
looks like a field key, then tries to parse Elementor's dynamic binding text,
then falls back to the manual key.

This is directionally correct, but still fragile.

### Failure Modes

- If Elementor changes dynamic tag text serialization, parsing can fail.
- If a chosen tag stores the selected key under an unexpected settings key, the
  resolver falls back silently.
- If the editor fallback runs, a warning appears, but the data-binding contract
  still needs a deterministic fallback state.
- The hidden `field_binding_dynamic` field and `__dynamic__` setting can drift.

### Required Next Work

- Introduce a small `DynamicBindingResolver` class or equivalent seam.
- Store a normalized `resolved_key` snapshot in the preset when saving.
- Keep the raw Elementor dynamic binding for round-trip editor UX.
- Add warnings when dynamic binding exists but no key can be resolved.
- Add tests for widget save, preset save, preset import, and render after reload.

## TASK-FC-031: CPT Fields As Elementor Dynamic Tag Sources

### Source Evidence

- CPT meta definitions: `includes/CPT/CptManager.php:45`
- Meta field registration: `includes/CPT/CptManager.php:309`
- `register_post_meta`: `includes/CPT/CptManager.php:317`
- Elementor parser: `wordpress/wp-content/plugins/elementor/core/dynamic-tags/manager.php`
- Current Toolkit dynamic tag hooks: no local `elementor/dynamic_tags/register`
  hook found in the plugin.

### Current Behavior

The Toolkit can define CPTs and meta fields, and those fields can be registered
with REST visibility. That does not automatically make them appear as a clean,
Toolkit-owned Elementor dynamic tag source.

The current filter binding UX can use Elementor dynamic tags, but the Toolkit
does not yet provide a native list of "fields created by our CPT manager" inside
Elementor.

### Failure Modes

- The user expects Toolkit CPT fields to appear like JetEngine fields.
- Elementor Pro custom field tags depend on the active post/context and license
  behavior, not the Toolkit's full definition registry.
- A preset may save a dynamic binding that works on one editor context and fails
  in another.

### Required Next Work

- Register a Toolkit dynamic tag group.
- Register at least one Toolkit field-key tag for filter binding.
- Source options from `CptManager` definitions, including post type, taxonomy,
  and meta field keys.
- Keep the tag output useful for Elementor, but make the filter binding store the
  selected key deterministically.

## TASK-FC-032: Domain Neutrality

### Source Evidence

- Default widget filters: `includes/Elementor/FilterController/FilterTypes.php:32`
- Default sort labels: `includes/Support/SortOptions.php:17`
- Admin placeholders: `includes/Admin/FilterPresetAdmin.php`
- Listing selectors: `assets/js/eit-editor.js`
- Runtime item detection and enrichment: `assets/js/eit-frontend.js`
- Resolver post enrichment: `includes/Support/FilterResolver.php:152`

### Current Behavior

The system is more generic than it used to be, but some language and defaults
still point toward products, categories, prices, and ratings. This creates a
subtle product risk: the widget can look like a shop filter even when it is
supposed to filter a portfolio, directory, case-study archive, real estate grid,
or CPT listing.

### Failure Modes

- Range is mentally anchored to price because of examples and labels.
- Sort defaults "Lowest value" and "Highest value" assume numeric commerce-like
  values.
- Placeholders still teach users to think in product/category terms.
- Source schema includes `meta`, `taxonomy`, and `post_field`, but resolver logic
  does not yet honor the full source/compare/data-type contract.

### Required Next Work

- Rename defaults to neutral language: numeric range, field value, taxonomy,
  custom field, listing item.
- Make filter rows explicitly choose a field/source contract.
- Keep WooCommerce/Jet selectors as compatibility helpers, not product identity.
- Align preset schema with resolver behavior before exposing advanced source
  controls heavily.

## TASK-FC-033: Layout Percentages And Row Packing

### Source Evidence

- Content control `layout_width`: `includes/Elementor/FilterController/ContentControls.php:324`
- Normalizer clamp: `includes/Elementor/FilterController/FilterSettings.php:156`
- Preset sanitizer: `includes/Support/FilterPresets.php:304`
- Render span: `includes/Elementor/Widgets/FilterController.php:147`
- CSS grid: `assets/css/eit-frontend.css:44`

### Current Behavior

The core mechanism already exists: each filter can define a width from 10 to
100, and the controller places filters in a 100-column grid. This supports the
desired "auto-calculated row packing" direction.

The missing part is product polish:

- no row preview in the editor controls;
- no clear warning when widths produce awkward wrapping;
- no sort width control;
- no actions width/alignment contract;
- no per-filter internal compact mode;
- no grouped "line" concept when a designer wants intentional row breaks.

### Required Next Work

- Promote layout width from a raw per-row number into a designed layout control.
- Add optional row-break behavior.
- Add sort/actions placement rules.
- Add style conditions that only expose layout internals for filter types in use.
- Add tests for width packing and overflow.

## Cross-Cutting Completion Decision

`TASK-FC-029` through `TASK-FC-033` are complete as audit tasks. The next work
must create implementation tasks for containment, binding, CPT dynamic tags,
domain-neutral copy/schema, and layout packing before adding more filter-specific
visual controls.

# Filter Controller Widget-First Direction

Date: 2026-06-04

## Decision

The Filter Controller should become a widget-first feature.

The implementer should be able to build filters directly inside the Elementor
widget, save that configuration as a reusable preset, and later retrieve that
preset from another widget instance. The WordPress admin should show saved
presets, preview what they contain, expose diagnostics, and provide recovery or
light editing, but it should not be the required primary place to build filters.

## Why

Filter setup is contextual. The selected listing, item selector, visible card
structure, data attributes, layout, responsive needs, and styling all belong to
the page being edited in Elementor.

The admin is still useful, but its best role is operational:

- list saved presets;
- show preview and metadata;
- expose target/provider diagnostics;
- help recover, duplicate, rename, or delete presets;
- show whether a preset is used by templates or pages;
- keep reusable filter groups discoverable outside a single Elementor page.

This keeps the plugin different from JetSmartFilters. The plugin is not trying
to become a full query-provider filtering engine. Its stronger position is:
create polished, highly customizable filters for existing Elementor, WooCommerce,
JetEngine, or generic listings by attaching a controller to what already exists.

## Working Model

1. The implementer adds the Filter Controller widget in Elementor.
2. In Content, the implementer chooses the target listing and adds filter items.
3. The widget shows only relevant configuration for the selected filter types.
4. In Style, the widget shows only style sections that apply to the selected
   filter types.
5. The implementer can save the current widget configuration as a preset.
6. The preset appears in the plugin admin with preview, metadata, usage status,
   and diagnostics.
7. Another widget can load that preset, optionally detach/copy it, and then
   customize locally.

## Admin Role

Admin pages should not feel like a second builder.

Keep:

- Post Types manager;
- saved Filter Preset library;
- preset preview/status;
- diagnostics for DOM provider, WordPress enrichment, target selectors, item
  count, post IDs, permalinks, visible text, and data attributes;
- usage metadata;
- duplicate/delete/rename workflows.

Avoid:

- forcing filter construction to start in wp-admin;
- exposing query-engine fields that the runtime does not honor;
- creating a visual builder shell inside wp-admin;
- making the admin compete directly with JetSmartFilters.

## Elementor Widget UX Direction

The widget should become more cadenced.

Content determines Style. If the selected filters are only search and range,
Style should show search and range styling, not every possible filter type.

The widget should support both:

- manual composition: add filters directly in the widget;
- preset composition: load a saved preset and optionally override local styling
  or detach into a local copy.

Useful controls should remain native Elementor controls where possible:

- tabs/sections for Content and Style;
- responsive controls for layout, sizing, spacing, and orientation;
- color, typography, border, box shadow, icons, sliders, choose controls, and
  dimensions using Elementor control APIs;
- frontend settings emitted through stable `data-*` attributes only where the JS
  runtime needs them.

## Customization Backlog

Audit every filter type one by one. The slider/range filter is the first obvious
example, but the same thinking must be applied to search, checkbox, radio,
select, chips, toggle, date, swatch, rating, sort, active chips, result count,
reset/apply buttons, empty state, and pagination.

Range/slider questions:

- Can orientation be horizontal or vertical?
- Can the handle shape change?
- Can the handle use an icon?
- Can track style be solid, dashed, segmented, or custom?
- Can the selected range and unselected track have separate styles?
- Can numbers/ticks appear above or below the track?
- Can min/max labels, current values, prefix/suffix, and units be styled?
- Can mobile behavior differ from desktop?

Global widget questions:

- Which Style sections should appear only when a matching filter type exists?
- Which settings are per filter, per filter type, or global?
- Which settings belong in Content because they change behavior?
- Which settings belong in Style because they change presentation?
- Which settings need responsive controls?
- Which settings require frontend JS and which can be pure Elementor CSS
  selectors?

## Next Step

Do not implement this immediately.

The next planned implementation pass should be a focused Filter Controller UX
audit:

1. inventory every current Content and Style control;
2. map each Style control to the filter type it actually affects;
3. identify controls that should be conditional;
4. identify missing customization by filter type;
5. decide the preset save/load contract;
6. only then edit the widget and admin.

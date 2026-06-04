# TASK-080 Cadenced Elementor Controls

Date: 2026-06-04

## Status

TASK-080 is complete for the first cadence pass.

This task makes the Elementor widget panel more contextual without changing the
frontend render contract. It adds hidden editor state derived from the selected
filter types and uses that state to hide irrelevant Style controls.

## Code Scope

Plugin repository:

- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/ContentControls.php`
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/StyleControls.php`
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/js/eit-editor.js`

## Implementation

`ContentControls` now registers hidden filter-family flags:

- `eit_filter_has_field_controls`
- `eit_filter_has_option_controls`
- `eit_filter_has_range_controls`
- `eit_filter_has_rating_controls`

`eit-editor.js` keeps those flags synced from the widget's `filters` repeater:

- reads the current edited Elementor widget container;
- derives active filter families from repeater row `type` values;
- updates the flags with Elementor's native
  `$e.run( 'document/elements/settings', ... )` command;
- asks Elementor to rerender panel UI without rerendering the frontend preview;
- falls back to hidden input/model updates if the command contract changes.

`StyleControls` now uses those flags and existing state controls to reduce
irrelevant Style panel noise:

- field input styling only appears when search/select/range/date style inputs
  exist;
- Options, Chips & Swatches section appears only for option-like filters;
- Range & Rating section appears only when range or rating filters exist;
- range color and rating color are separated by type flag;
- Active Chips & Count appears only when result count or active chips are
  enabled;
- chip-only colors follow `show_active_chips`;
- count-only color follows `show_result_count`;
- Pagination Style appears only when pagination is not `none`.

## Preserved Contracts

Preserved:

- saved `filters` repeater structure;
- existing filter type names;
- existing frontend HTML;
- existing `data-eit-*` attributes;
- existing frontend JS filtering behavior;
- existing CSS selectors for generated Elementor styles.

Not included yet:

- no new slider styling controls;
- no vertical slider;
- no custom slider handle/icon/ticks;
- no structured option editor replacing the textarea;
- no live browser screenshot verification of the Elementor panel.

## Elementor Evidence

Local Elementor evidence used:

- `Controls_Manager::HIDDEN` exists and is intended for saved non-visual panel
  data.
- `Controls_Stack::is_control_visible()` evaluates normal `condition` directly
  against setting keys.
- `Conditions::check()` supports grouped OR conditions through `conditions`.
- Elementor editor controls update settings through
  `$e.run( 'document/elements/settings', ... )`.
- Elementor 4 can store Style controls in `$stack['style_controls']`, so checks
  must merge `controls` and `style_controls`.

## Verification Run

Plugin checks:

- `composer validate --strict`
- `composer dump-autoload`
- `find . -path ./vendor -prune -o -name '*.php' -print0 | xargs -0 -n1 php -l`
- `find assets/js -name '*.js' -print0 | xargs -0 -n1 node --check`
- `git diff --check`

Autoload checks:

- Composer autoload resolves `ContentControls` and `StyleControls`.
- fallback autoloader resolves `ContentControls` and `StyleControls`.

WordPress smoke:

- confirmed the widget registers the hidden cadence flags and representative
  Content/Style controls;
- result: `cadence-controls-ok:382`;
- tested visibility through Elementor's own `is_control_visible()` for:
  - search-only;
  - range-only;
  - rating-only;
  - result count and active chips disabled;
  - pagination disabled;
- result: `visibility-ok`.

## Result

The widget editor is now structurally ready for deeper filter-type
customization.

The next work should be `TASK-110` or a narrower `TASK-081` range pass:

- add range-specific Style controls;
- verify them visually in the Elementor editor and frontend;
- avoid adding broad sections that ignore the selected filter composition.

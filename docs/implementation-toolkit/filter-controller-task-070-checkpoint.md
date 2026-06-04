# TASK-070 Behavior-Preserving Widget Modularization

Date: 2026-06-04

## Status

TASK-070 is complete.

This task changed plugin source code, but it is intended as a structural
refactor only. It did not intentionally change saved Elementor setting IDs,
rendered HTML, `data-*` attributes, frontend JS behavior, CSS selectors, or the
filter runtime contract.

## Code Scope

Plugin repository:

- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/Widgets/FilterController.php`
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/ContentControls.php`
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/StyleControls.php`

The widget class now keeps the Elementor identity and render path:

- widget name/title/icon/category/dependencies;
- `register_controls()` delegation;
- frontend render;
- per-filter HTML render.

The extracted classes own the editor control registration:

- `ContentControls`
  - Target Listing;
  - Filters repeater;
  - State, Sort & Pagination.
- `StyleControls`
  - Layout;
  - Fields;
  - Options, Chips & Swatches;
  - Range & Rating;
  - Buttons;
  - Active Chips & Count;
  - Pagination;
  - Loading, Empty & Motion.

## Behavior Contract Preserved

Preserved:

- Elementor control IDs and section IDs;
- repeater field IDs;
- default filter set;
- preset source selector behavior;
- frontend available flags for target/runtime controls;
- style selectors scoped to `{{WRAPPER}}`;
- rendered filter DOM and `data-eit-*` attributes;
- Composer PSR-4 autoload and fallback autoloader compatibility.

Not changed:

- no new filter type;
- no conditional Style visibility yet;
- no preset save/load workflow;
- no CSS or JS contract change in this task.

## Elementor Runtime Finding

Elementor 4 stores Style controls separately from regular controls when style
control optimization is active.

The smoke check must inspect both buckets:

- `$stack['controls']`
- `$stack['style_controls']`

Using only `get_controls()` can miss Style controls in this environment.

## Verification Run

Plugin checks:

- `composer validate --strict`
- `composer dump-autoload`
- `find . -path ./vendor -prune -o -name '*.php' -print0 | xargs -0 -n1 php -l`
- `node --check assets/js/eit-frontend.js`
- `git diff --check`

Autoload checks:

- Composer autoload resolves:
  - `EIT\Elementor\FilterController\ContentControls`
  - `EIT\Elementor\FilterController\StyleControls`
- fallback autoloader resolves the same classes.

WordPress smoke:

- WP-CLI confirmed:
  - `EIT\Elementor\FilterController\ContentControls`
  - `EIT\Elementor\FilterController\StyleControls`
  - `EIT\Elementor\Widgets\FilterController`
- reflected `register_controls()` on a widget instance;
- verified representative Content and Style controls exist after registration;
- result: `controls-ok:378`.

## Result

`FilterController.php` is now a small widget facade instead of a mixed
widget/control/render file.

This makes `TASK-080` safer because conditional editor behavior can be added to
`ContentControls` and `StyleControls` without touching the render path at the
same time.

## Next Task

Proceed to `TASK-080`: implement cadenced Elementor controls.

Recommended first implementation step:

- add an `enabled_filter_types` helper setting or equivalent editor-side state;
- use direct existing conditions for simple state controls like
  `show_sort`, `show_apply`, `show_result_count`, `show_active_chips`, and
  `pagination_type`;
- only then hide or reveal type-specific Style sections.

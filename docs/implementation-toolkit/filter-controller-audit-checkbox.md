# Filter Controller Checkbox Audit

Date: 2026-06-04

Task: `TASK-FC-009`
Subplan: `SUBPLAN-FC-AUDIT-CHECKBOX`

Status: audit complete, implementation not started.

## Purpose

Audit checkbox filters as a real multi-select component, not as a generic option
pill with a native checkbox inside it.

Checkbox is the safest "many values can be active" pattern. It should remain
boring enough to be understood instantly, but customizable enough to avoid
looking like a leftover browser form control beside polished Elementor content.

## Source Evidence

- Render branch: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/Widgets/FilterController.php:226`
- Option CSS: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/css/eit-frontend.css:76`
- Option style controls: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/StyleControls.php:303`
- Option parser: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/FilterOptions.php:14`
- JS state collection: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/js/eit-frontend.js:164`
- Resolver semantics: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Support/FilterResolver.php:196`

## Current Anatomy

Checkbox currently renders through the generic fallback branch:

```html
<div class="eit-options eit-options--checkbox" data-eit-options>
  <label class="eit-option eit-option--checkbox">
    <input type="checkbox" name="eit-widget-0[]" value="featured" data-eit-control data-eit-type="checkbox" data-eit-key="category">
    <span>Featured</span>
  </label>
</div>
```

Subelements:

- group label: `.eit-filter-group__label`;
- option list wrapper: `.eit-options.eit-options--checkbox`;
- option item: `.eit-option.eit-option--checkbox`;
- native checkbox input;
- option label text;
- active state: `.eit-option:has(input:checked)` plus JS `.is-active`;
- active filter chip after apply/reset flow.

## Current Behavior Contract

- Multiple checkbox options can be selected.
- JS groups checked checkbox values into one filter payload array.
- Server-side resolver treats checkbox as OR inside the same filter: any
  selected value can match.
- All active filters across different filter groups still combine as AND.
- Reset clears every checked checkbox.

This means checkbox is not just a visual type. It owns "multi-select OR inside
one key" semantics.

## Mechanical Bugs And Risks

1. The component visually behaves like a chip.
   - `.eit-option` is pill-shaped by default.
   - A visible native checkbox inside a pill can read as mixed metaphors.

2. The checkbox mark itself has no styling contract.
   - `accent-color` is applied globally.
   - There is no control for box size, mark color, checked background, or custom
     indicator placement.

3. Focus state is underspecified.
   - Hover changes border.
   - Keyboard focus should clearly target the option and/or input.

4. Disabled and empty states are not documented.
   - There is no per-option disabled state.
   - Empty options are blocked in diagnostics but frontend empty rendering is
     not a designed state.

5. Counts are an admin/preset concept, not a frontend component yet.
   - Presets include `show_count`, but the widget does not render counts per
     option.

## Product Controls To Add

Immediate:

- checkbox layout: stacked, wrapped row, grid;
- checkbox indicator position: left, right, hidden custom;
- checkbox size;
- checkbox gap;
- active border/background/text;
- focus ring;
- option width: auto, equal, full row;
- empty state when no options render.

Later:

- option counts;
- per-option disabled state;
- custom checked icon;
- description/sub-label under option text;
- group max visible options plus "show more";
- compact dense mode for large taxonomies.

## QA Scenario

Guilherme should test:

1. A checkbox filter with 3 options.
2. A checkbox filter with 12+ options.
3. Layout horizontal, vertical, and wrapped.
4. Select several values and confirm active styling is clear.
5. Use keyboard tab/space and confirm focus is visible.
6. Reset and confirm all options visually clear.
7. Check whether the native checkbox plus pill shape feels intentional or
   confused.
8. On mobile, confirm options do not create awkward half-width rows unless that
   is selected intentionally.

Pass criteria:

- multi-select behavior is visually obvious;
- active state is not dependent on color alone;
- checkbox does not look like an unstyled browser input pasted inside a chip;
- large option lists remain scannable.

## Completion Decision

`TASK-FC-009` is complete as an audit task. The next implementation slice should
separate checkbox indicator styling from generic option pill styling before
adding broad option controls.

# Filter Controller Content-Style Cadence Implementation

Date: 2026-06-05

Task: `TASK-FC-021`

Status: implementation complete, Guilherme Elementor QA required.

## Scope

This slice closes the remaining editor UX gap Guilherme called out:

> Style controls should only appear when Content includes the corresponding
> filter.

The project already had hidden editor helper controls such as
`eit_filter_has_range_controls`, but their recalculation depended too much on
the Content repeater being visible in the panel. That made the behavior fragile
when the user switched tabs, imported a preset, or opened Style with stale
helper state.

## Intended Behavior

- Content filter composition drives type-specific Style sections.
- Range Style appears only when a range filter exists.
- Rating Style appears only when a rating filter exists.
- Choice-family Style appears only when checkbox, radio, chips, toggle, swatch,
  or rating exists.
- Field Style controls remain available for text/select/range/date inputs and
  shared filter labels.
- Global sections such as Layout, Buttons, State, Chips/Count, and Pagination
  keep using their direct feature controls.

## Implementation Notes

Plugin changes:

- `assets/js/eit-editor.js`
  - recalculate type flags from `container.settings.get('filters')` even when
    the Content repeater DOM is not visible;
  - keep the panel DOM fallback only for cases where Elementor settings are not
    available;
  - resync type flags immediately after imported preset filters are written
    into widget settings.
- `includes/Elementor/FilterController/StyleControls.php`
  - split the combined Range & Rating section into a Range section and a Rating
    section;
  - keep native Elementor `condition`/`conditions` as the rendering mechanism.

## Verification

Passed:

- Agentic Ops `validate_task` and `validate_subplan`;
- PHP lint;
- `composer validate --strict`;
- `node --check assets/js/eit-editor.js`;
- `git diff --check`;
- static checks for section labels and sync guard behavior.

Still requires Guilherme:

- Elementor editor QA with repeated add/remove/switch filter-type actions;
- confirming the panel refresh feels immediate enough;
- checking whether any section label still feels confusing in context.

## Completion Decision

`TASK-FC-021` is complete as a mechanical editor-cadence slice.

This does not claim final visual approval of the Elementor editor flow. It makes
the code obey the product rule: Content decides Style. Guilherme still owns the
multi-click editor QA because the remaining question is whether Elementor's
panel refresh feels right in real use.

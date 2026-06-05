# Filter Controller Range Slice C Implementation

Date: 2026-06-05

Task: `TASK-FC-020`
Source audit: `docs/implementation-toolkit/filter-controller-audit-range.md`

Status: implementation complete, Guilherme copy review recommended.

## Scope

This slice handles the selected-track honesty issue from the range audit.

The current range uses two native range inputs. That means it can expose native
accent/progress behavior, but it does not produce a reliable combined selected
interval band between min and max across browsers.

Therefore this slice chooses the honest-control path:

- rename the misleading `Selected Track` control;
- describe it as native range accent behavior;
- preserve the existing saved setting key for backward compatibility;
- isolate rating color from range color;
- keep true selected interval fill deferred until a custom-track slice.

Not included:

- custom dual-range slider engine;
- selected interval overlay;
- browser-specific track math;
- range handle icons;
- broader tick/label craft controls.

## Plugin Changes

Changed files:

- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/StyleControls.php`
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/css/eit-frontend.css`

Behavior:

- Elementor no longer promises a true selected track that the current DOM cannot
  render consistently.
- Existing saved `range_track_color` values still color the native range accent.
- Rating text color is controlled by `Rating Color`, not by the range accent
  control.

## Verification

Passed:

- Agentic Ops `validate_task` and `validate_subplan`;
- PHP lint for plugin PHP files;
- `composer validate --strict`;
- `node --check assets/js/eit-frontend.js`;
- `git diff --check`;
- static copy/selector checks.

Still requires Guilherme:

- Elementor editor copy judgment, if the label still feels too technical;
- visual confirmation that the new label feels less misleading in context;
- decision on whether a later true selected interval fill is worth the
  complexity.

## Completion Decision

`TASK-FC-020` is complete as a contract repair.

This does not claim the range has a true selected interval fill. It makes the
current native implementation honest and preserves the future decision: either a
custom dual-range track becomes worth the complexity, or the product continues
with native accent behavior plus deeper handle/tick/label craft controls.

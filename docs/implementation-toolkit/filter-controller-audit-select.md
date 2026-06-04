# Filter Controller Select Audit

Date: 2026-06-04

Task: `TASK-FC-015`
Subplan: `SUBPLAN-FC-AUDIT-SELECT`

Status: audit complete, implementation not started.

## Purpose

Audit select as a native single-select field.

Select is useful when options are numerous or space is limited. It should keep
native reliability while exposing enough styling to avoid feeling disconnected
from the rest of the filter UI.

## Source Evidence

- Select render branch: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/Widgets/FilterController.php:160`
- Field CSS: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/css/eit-frontend.css:65`
- Field style controls: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/StyleControls.php:192`
- Option parser: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/FilterOptions.php:14`
- JS state collection: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/js/eit-frontend.js:201`
- Resolver semantics: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Support/FilterResolver.php:208`

## Current Anatomy

```html
<select class="eit-select" data-eit-control data-eit-type="select" data-eit-key="category">
  <option value="">All</option>
  <option value="premium">Premium</option>
</select>
```

Subelements:

- optional group label;
- native select control;
- placeholder/all option;
- option labels;
- focus state;
- dropdown UI owned by browser/OS;
- active filter chip.

## Current Behavior Contract

- Select is single-select.
- Empty value means no filter.
- Placeholder becomes the empty "All" option label.
- JS sends a scalar value when not empty.
- Server matches the selected token.

## Mechanical Bugs And Risks

1. Native dropdown styling is limited.
   - Browser/OS rendering can differ from Elementor preview expectations.

2. Placeholder text doubles as "All" option.
   - This is practical, but the label needs to be written as an option, not only
     as a placeholder.

3. No custom arrow contract.
   - Native select arrow may clash with the design.

4. No empty-options frontend state.
   - A select with no options renders only the empty option.

5. Long option text has no overflow policy.
   - Native select truncation differs by browser.

## Product Controls To Add

Immediate:

- select arrow style or native arrow choice;
- focus ring;
- field height;
- placeholder/all label control;
- width mode;
- long text handling.

Later:

- enhanced custom select only if native select cannot meet product needs;
- searchable select;
- grouped options;
- option counts;
- icons per option.

## QA Scenario

Guilherme should test:

1. Select with 3 options.
2. Select with 20+ options.
3. Long option labels.
4. Empty placeholder/all state.
5. Keyboard open/select.
6. Mobile native picker behavior.
7. Styling next to search and option chips.

Pass criteria:

- native select feels intentional, not leftover;
- all/empty state is clear;
- browser differences are acceptable;
- mobile picker behavior is not fighting the layout.

## Completion Decision

`TASK-FC-015` is complete as an audit task. The next implementation slice should
polish native select styling before considering custom select complexity.

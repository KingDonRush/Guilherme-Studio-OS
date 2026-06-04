# Filter Controller Search Audit

Date: 2026-06-04

Task: `TASK-FC-014`
Subplan: `SUBPLAN-FC-AUDIT-SEARCH`

Status: audit complete, implementation not started.

## Purpose

Audit search as a text input component with filtering behavior, not just a
plain `<input type="search">`.

Search is often the first control users touch. It must feel immediate,
recoverable, and visually integrated with the surrounding filter system.

## Source Evidence

- Search render branch: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/Widgets/FilterController.php:150`
- Field CSS: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/css/eit-frontend.css:65`
- Field style controls: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/StyleControls.php:192`
- Content controls for placeholder: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/ContentControls.php:226`
- JS state collection: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/js/eit-frontend.js:201`
- Resolver semantics: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Support/FilterResolver.php:190`

## Current Anatomy

```html
<input id="widget-0" class="eit-input eit-input--search" type="search" placeholder="Search..." data-eit-control data-eit-type="search" data-eit-key="">
```

Subelements:

- optional group label;
- native search input;
- placeholder;
- browser clear affordance where supported;
- focus state;
- active filter chip after typing;
- loading state on target.

## Current Behavior Contract

- Search does not require a data key.
- JS sends a scalar value only when the input is not empty.
- Server searches item text plus inferred title.
- Auto-apply can send requests on every input event.
- Reset clears search.

## Mechanical Bugs And Risks

1. No debounce contract.
   - Auto-apply on every input can be noisy on larger listings.

2. Clear action is browser-dependent.
   - Native search clear buttons differ by browser and may not be styleable.

3. No search icon/affordance.
   - Placeholder alone has to explain the control.

4. Focus state depends on generic field styling.
   - There is no dedicated search focus/active treatment.

5. Empty and loading feedback are not local to the field.
   - The target can load, but the search field itself does not communicate
     query progress.

## Product Controls To Add

Immediate:

- search icon on/off and position;
- clear button on/off;
- debounce delay;
- focus ring;
- placeholder typography/color;
- field width mode: full, auto, fixed;
- submit-on-enter versus live search copy.

Later:

- recent searches;
- search result count near field;
- "no query" helper text;
- min characters before apply;
- separate mobile search layout.

## QA Scenario

Guilherme should test:

1. Empty search.
2. Short query with auto-apply.
3. Long query.
4. Clear query using native clear and reset.
5. Keyboard focus and Enter.
6. Mobile keyboard behavior.
7. Search beside other filters in horizontal layout.
8. Loading/motion impression when typing quickly.

Pass criteria:

- search feels responsive but not jittery;
- clear path is obvious;
- focus state is visible;
- search does not look like a default browser input beside polished options.

## Completion Decision

`TASK-FC-014` is complete as an audit task. The next implementation slice should
add debounce/clear/icon contracts before heavy styling.

# Filter Controller Date Audit

Date: 2026-06-04

Task: `TASK-FC-016`
Subplan: `SUBPLAN-FC-AUDIT-DATE`

Status: audit complete, implementation not started.

## Purpose

Audit date as a two-field range component.

Date range is not just two native date inputs. It needs labels, validation,
clear behavior, responsive layout, and clear relationship between "from" and
"to".

## Source Evidence

- Date render branch: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/Widgets/FilterController.php:204`
- Date CSS shared with range: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/css/eit-frontend.css:157`
- Field CSS: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/css/eit-frontend.css:65`
- JS date state: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/js/eit-frontend.js:235`
- JS reset/set date: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/js/eit-frontend.js:507`
- Resolver semantics: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Support/FilterResolver.php:220`

## Current Anatomy

```html
<div class="eit-date-range" data-eit-control data-eit-type="date" data-eit-key="date">
  <input class="eit-input" type="date" data-eit-date-from>
  <input class="eit-input" type="date" data-eit-date-to>
</div>
```

Subelements:

- optional group label;
- date range wrapper;
- from input;
- to input;
- native browser picker icons;
- invalid/inverted range state;
- active filter chip.

## Current Behavior Contract

- Date filter uses one key and two values: `from` and `to`.
- Either field can be empty.
- JS sends a date filter only when at least one date exists.
- Server parses item date and input dates with `strtotime`.
- Reset clears both fields.

## Mechanical Bugs And Risks

1. Inputs have no visible "From" and "To" labels.
   - Placeholder is not available for native date in a reliable way.

2. No inverted range handling.
   - If `from` is after `to`, frontend should guide or normalize.

3. Native date picker differs heavily by browser.
   - Styling and icons are browser-controlled.

4. Shared CSS with range is too generic.
   - `.eit-date-range` shares grid behavior with `.eit-range__values` and
     `.eit-range__sliders`, but it has its own product semantics.

5. Active chip value can be cryptic.
   - The active chip joins object values as `from - to`, without labels.

## Product Controls To Add

Immediate:

- from label and to label;
- date input layout: two columns, stacked, compact;
- separator text/icon;
- invalid range state;
- clear date range action;
- focus ring;
- mobile stacking behavior.

Later:

- custom date picker only if native is inadequate;
- presets: today, this week, this month;
- locale display formatting;
- min/max dates;
- open-ended range copy: "After date", "Before date".

## QA Scenario

Guilherme should test:

1. Empty date range.
2. Only from date.
3. Only to date.
4. From and to date.
5. Inverted date range.
6. Reset and active chip removal.
7. Native picker behavior in desktop and mobile preview.
8. Horizontal and stacked layouts.

Pass criteria:

- from/to relationship is obvious;
- invalid ranges do not silently feel broken;
- native picker differences are acceptable;
- active chip text is understandable.

## Completion Decision

`TASK-FC-016` is complete as an audit task. The next implementation slice should
add labels and invalid-range handling before custom calendar work.

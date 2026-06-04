# Filter Controller Rating Audit

Date: 2026-06-04

Task: `TASK-FC-017`
Subplan: `SUBPLAN-FC-AUDIT-RATING`

Status: audit complete, implementation not started.

## Purpose

Audit rating as a threshold selector, not just a radio list.

The current labels say `5 stars`, `4+ stars`, and so on. The resolver confirms
that rating uses numeric threshold semantics: item rating must be greater than
or equal to the selected value.

## Source Evidence

- Rating render branch: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/Widgets/FilterController.php:209`
- Default rating options: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/FilterOptions.php:42`
- Rating color control: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/StyleControls.php:631`
- JS scalar collection: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/js/eit-frontend.js:180`
- Resolver semantics: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Support/FilterResolver.php:232`

## Current Anatomy

```html
<div class="eit-options eit-options--rating" data-eit-options>
  <label class="eit-option eit-rating-option">
    <input type="radio" name="eit-widget-0" value="4" data-eit-control data-eit-type="rating" data-eit-key="rating">
    <span>4+ stars</span>
  </label>
</div>
```

Subelements:

- rating option wrapper;
- radio input;
- rating label text;
- selected state;
- rating color;
- reset path.

## Current Behavior Contract

- Rating is single-select.
- Rating sends one numeric scalar.
- Server matches `item_rating >= selected_value`.
- Default options encode threshold labels.
- It has no star/icon rendering yet.

## Mechanical Bugs And Risks

1. Rating looks like a generic radio pill.
   - This hides the star/rating mental model.

2. Rating section shares range controls.
   - `Range & Rating` mixes unrelated controls.
   - Range track controls and rating color live together.

3. Threshold semantics are not explained in UI.
   - `4+ stars` means "4 and above", not exact 4.

4. No clear all option.
   - Like radio, rating needs a way back to no rating filter besides full reset.

5. `rating_color` only colors text span.
   - If stars/icons are added later, color control needs a target contract.

## Product Controls To Add

Immediate:

- rating display mode: text, stars, stars + text;
- clear/all option;
- selected style;
- unselected star color;
- active star color;
- threshold copy in editor/admin;
- separate rating style section from range.

Later:

- icon selection;
- half-star display;
- max rating count;
- compact horizontal mode;
- per-option labels;
- hover preview if custom star UI is implemented.

## QA Scenario

Guilherme should test:

1. Default rating options.
2. Select `4+ stars` and confirm expected listings remain.
3. Decide whether exact rating or threshold rating is clear.
4. Reset or clear just rating.
5. Compare text-only versus future star direction.
6. Check keyboard behavior.
7. Confirm rating controls do not appear as random range settings in Elementor.

Pass criteria:

- threshold semantics are clear;
- rating visually reads as rating, not generic radio;
- clear/reset behavior is not awkward;
- style controls are not buried under range.

## Completion Decision

`TASK-FC-017` is complete as an audit task. The next implementation slice should
separate rating from range styling and decide whether rating ships as text,
stars, or both.

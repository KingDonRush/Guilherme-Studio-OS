# Filter Controller Chips Audit

Date: 2026-06-04

Task: `TASK-FC-011`
Subplan: `SUBPLAN-FC-AUDIT-CHIPS`

Status: audit complete, implementation not started.

## Purpose

Audit chips as a compact multi-select component.

Chips should feel like selectable tokens, not like checkboxes with a different
name. They are useful when options are short, scannable, and safe to combine.

## Source Evidence

- Render branch: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/Widgets/FilterController.php:226`
- Option CSS: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/css/eit-frontend.css:76`
- Option style controls: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/StyleControls.php:303`
- JS grouped multi-select: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/js/eit-frontend.js:189`
- Resolver semantics: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Support/FilterResolver.php:196`

## Current Anatomy

```html
<div class="eit-options eit-options--chips" data-eit-options>
  <label class="eit-option eit-option--chips">
    <input type="checkbox" name="eit-widget-0[]" value="featured" data-eit-control data-eit-type="chips" data-eit-key="category">
    <span>Featured</span>
  </label>
</div>
```

Subelements:

- chip list wrapper;
- chip item;
- hidden or visible selection control;
- chip label;
- active state;
- wrapping behavior;
- active filter chips summary.

## Current Behavior Contract

- Chips are multi-select.
- They use checkbox inputs internally.
- JS groups values into an array.
- Resolver treats selected chip values as OR within the same key.

## Mechanical Bugs And Risks

1. Native checkbox remains visible.
   - For a true chip component, the checkbox should usually be visually hidden
     while remaining accessible.

2. Chips use the same `.eit-option` controls as checkbox/radio.
   - This makes chips easy to style, but it prevents chip-specific density,
     height, close icon, and active affordance controls.

3. No overflow strategy.
   - Wrapped chips can become noisy with large option sets.

4. Active state relies heavily on background color.
   - Needs outline/icon/focus alternatives for accessibility and craft.

## Product Controls To Add

Immediate:

- hide native input for chips while keeping accessibility;
- chip layout: wrap, scroll row, grid;
- chip size: compact, default, large;
- chip gap;
- active outline/icon;
- focus ring;
- text truncation;
- full-width mobile behavior.

Later:

- chip icons;
- removable active chip inside the chip itself;
- show more/collapse;
- option counts;
- per-option color tokens;
- drag ordering in editor if option volume grows.

## QA Scenario

Guilherme should test:

1. Chips with 2 short options.
2. Chips with 12+ options.
3. Long labels.
4. Multi-select and reset.
5. Keyboard tab/space behavior after native inputs are visually hidden.
6. Desktop and mobile wrapping.
7. Whether active chips read as selectable tokens, not fake buttons.

Pass criteria:

- chip selection is compact and legible;
- hidden native inputs remain accessible;
- wrapping does not break hierarchy;
- active state is clear without relying only on color.

## Completion Decision

`TASK-FC-011` is complete as an audit task. The next implementation slice should
give chips their own visual contract instead of inheriting checkbox visuals.

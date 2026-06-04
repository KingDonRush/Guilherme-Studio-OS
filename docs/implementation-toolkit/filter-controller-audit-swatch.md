# Filter Controller Swatch Audit

Date: 2026-06-04

Task: `TASK-FC-013`
Subplan: `SUBPLAN-FC-AUDIT-SWATCH`

Status: audit complete, implementation not started.

## Purpose

Audit swatches as visual option selectors.

Swatches carry visual meaning through color or image. That means the component
must handle fallback labels, selected rings, accessibility, and invalid visuals
more carefully than ordinary checkbox options.

## Source Evidence

- Swatch render branch: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/Widgets/FilterController.php:226`
- Swatch visual render: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/Widgets/FilterController.php:238`
- Swatch CSS: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/css/eit-frontend.css:147`
- Visual parser: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/FilterOptions.php:52`
- JS grouped multi-select: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/js/eit-frontend.js:189`
- Resolver semantics: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Support/FilterResolver.php:196`

## Current Anatomy

```html
<label class="eit-option eit-option--swatch">
  <input type="checkbox" name="eit-widget-0[]" value="blue" data-eit-control data-eit-type="swatch" data-eit-key="color">
  <span class="eit-swatch" style="background-color:#14b8a6;" aria-hidden="true"></span>
  <span>Blue</span>
</label>
```

Subelements:

- option wrapper;
- native checkbox input;
- swatch visual chip;
- option label;
- selected state;
- focus state;
- fallback when `visual` is invalid or empty.

## Current Behavior Contract

- Swatch is multi-select.
- It uses checkbox semantics.
- `visual` supports hex colors and image URLs.
- Resolver treats swatch values as OR within one key.

## Mechanical Bugs And Risks

1. Invalid visual becomes an empty swatch.
   - Empty swatches need fallback styling or should not render the swatch node.

2. Selected state is applied to the whole option.
   - A swatch usually needs its own selected ring so color/image selection is
     visible even when text is hidden or minimized.

3. Native checkbox remains visible.
   - For swatches, the visual chip should usually be the primary target.

4. Color-only meaning is risky.
   - Labels or tooltips must remain available for accessibility and clarity.

5. Image URL support needs sizing/fallback rules.
   - Broken image backgrounds are hard to notice without diagnostics.

## Product Controls To Add

Immediate:

- swatch size;
- swatch shape: circle, square, rounded;
- selected ring color/width/offset;
- show label: always, tooltip, visually hidden, none;
- gap between swatch and text;
- invalid visual fallback style;
- focus ring.

Later:

- image fit mode;
- checkerboard/transparent color support;
- per-option tooltip;
- color token presets;
- single-select swatch mode if radio-like color choice is needed.

## QA Scenario

Guilherme should test:

1. Hex color swatches.
2. Image URL swatches.
3. Invalid or empty visual values.
4. Label visible and label hidden directions.
5. Multi-select behavior.
6. Selected ring visibility on dark, light, and saturated colors.
7. Keyboard focus.
8. Mobile tap target size.

Pass criteria:

- swatch visual and label feel like one component;
- selected state is visible on any swatch color/image;
- invalid visuals do not look broken or mysterious;
- labels remain recoverable when visuals carry the main UI.

## Completion Decision

`TASK-FC-013` is complete as an audit task. The next implementation slice should
add a swatch-specific selected ring and invalid visual fallback before deeper
styling.

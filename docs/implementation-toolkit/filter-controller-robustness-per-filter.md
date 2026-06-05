# Filter Controller Per-Filter Robustness Audit

Date: 2026-06-05

Tasks: `TASK-FC-034` through `TASK-FC-043`
Subplan: `SUBPLAN-FC-ROBUSTNESS-AUDIT`

Status: per-filter audit complete, implementation not started.

## Purpose

This audit looks at every filter type as its own component, even when the type
looks simple. The rule is deliberate: simple filters still have anatomy,
interaction states, layout constraints, accessibility needs, and style-control
gaps.

## Shared Findings Across Option-Based Filters

Checkbox, radio, chips, toggle, swatch, and rating currently share too much
generic option styling. The shared `.eit-option` base is useful, but the product
needs type-specific controls and tests.

Common missing states:

- active;
- hover;
- focus-visible;
- disabled;
- empty/no options;
- count available/unavailable;
- clear just this filter;
- keyboard navigation;
- responsive wrap and overflow.

## TASK-FC-034: Range

### Source Evidence

- Render branch: `includes/Elementor/Widgets/FilterController.php:179`
- Range controls: `includes/Elementor/FilterController/StyleControls.php:385`
- Range runtime sync: `assets/js/eit-frontend.js:548`
- Range CSS: `assets/css/eit-frontend.css:175`

### Current Strengths

- Richest style-control set in the widget.
- Supports horizontal and vertical orientation.
- Supports input visibility, input position, track style, handle shape, handle
  border, icon overlay, labels, and ticks.
- Persists generic numeric key, so it is no longer hardcoded to price.

### Remaining Gaps

- It is still implemented as two native range inputs, not one dual-thumb rail.
- Vertical mode can overflow when values, labels, ticks, and sliders are visible.
- Tick labels and current value labels need separate placement contracts.
- Range still needs stronger neutral naming in editor copy.
- It lacks presets for common slider archetypes, such as single rail with two
  points, compact min-max, stepped scale, and no-input display.

### Next Work

Range should move from "many knobs" to "component variants plus advanced
controls". Start with containment and variant presets before adding more visual
decoration.

## TASK-FC-035: Rating

### Source Evidence

- Render branch: `includes/Elementor/Widgets/FilterController.php:244`
- Default options: `includes/Elementor/FilterController/FilterOptions.php:40`
- Rating style: `includes/Elementor/FilterController/StyleControls.php:1037`
- Resolver semantics: `includes/Support/FilterResolver.php:237`

### Current Strengths

- Semantics are clear in code: rating is a numeric threshold.
- It is already a separate filter type.

### Gaps

- It visually renders as generic radio pills, not a rating control.
- There is no star/icon rendering.
- There is no icon selector.
- There is no exact vs threshold mode decision in UI.
- There is no clear single-rating reset.
- Style controls only color the text span.

### Next Work

Add display modes: text, icons, icons plus text. Use Elementor Icons control for
the symbol, with star as the default. Keep threshold semantics explicit in copy
and tests.

## TASK-FC-036: Checkbox

### Source Evidence

- Generic option render branch: `includes/Elementor/Widgets/FilterController.php:258`
- Option styles: `includes/Elementor/FilterController/StyleControls.php:288`
- Multi-state collection: `assets/js/eit-frontend.js:184`
- Token matching: `includes/Support/FilterResolver.php:199`

### Current Strengths

- Supports multi-select.
- Uses native checkbox input, so accessibility has a base.
- Options can be configured from text lines.

### Gaps

- Visual control is just a pill plus native checkbox.
- No checkmark shape, indicator size, indicator position, count, or disabled
  styling.
- Matching is token-like but can behave like broad substring matching.
- No per-option source of counts.

### Next Work

Split checkbox controls from generic option controls. Add indicator controls,
count affordance, empty option state, and stricter resolver semantics.

## TASK-FC-037: Radio

### Source Evidence

- Generic option render branch: `includes/Elementor/Widgets/FilterController.php:258`
- Scalar collection: `assets/js/eit-frontend.js:204`
- Resolver scalar match: `includes/Support/FilterResolver.php:214`

### Current Strengths

- Single-select behavior exists.
- Native radio input is present.

### Gaps

- No all/none option by default.
- No clear just this radio group.
- No radio-dot visual controls.
- No segmented-control variant.
- Selected and focus states rely on generic option styling.

### Next Work

Add clear behavior and visual variants: classic radio list, segmented row, cards,
and compact inline.

## TASK-FC-038: Chips

### Source Evidence

- Generic option render branch: `includes/Elementor/Widgets/FilterController.php:258`
- Default widget filters include chips: `includes/Elementor/FilterController/FilterTypes.php:41`
- Active chips area: `assets/js/eit-frontend.js:393`

### Current Strengths

- Good mental model for compact filtering.
- Multi-select behavior is already available.

### Gaps

- Filter chips and active chips are separate concepts but visually close.
- No icon support inside option chips.
- No count, removable state, compact density, wrap strategy, or overflow mode.
- Needs better distinction between "option chip" and "active filter chip".

### Next Work

Define chips as their own component family, with option chips, selected chips,
active summary chips, and clear/remove affordances.

## TASK-FC-039: Toggle

### Source Evidence

- Toggle branch: `includes/Elementor/Widgets/FilterController.php:250`
- Toggle CSS: `assets/css/eit-frontend.css`
- Scalar collection: `assets/js/eit-frontend.js:204`

### Current Strengths

- Uses native checkbox under the hood.
- Has a switch visual.

### Gaps

- Only one option is practical, but content controls do not make that model
  obvious.
- No switch size, knob, track, on/off label, icon, or alignment controls.
- No "true/false" mapping clarity for non-boolean fields.
- It shares generic option controls even though it is not visually an option
  pill.

### Next Work

Treat Toggle as a boolean filter with explicit value mapping. Add switch-specific
style controls and alignment controls.

## TASK-FC-040: Swatch

### Source Evidence

- Generic option branch with swatch visual: `includes/Elementor/Widgets/FilterController.php:258`
- Swatch visual parser: `includes/Elementor/FilterController/FilterOptions.php:48`
- Swatch CSS: `assets/css/eit-frontend.css`

### Current Strengths

- Supports color hex or URL visual token.
- Has a dedicated visual mark inside the option.

### Gaps

- No swatch size, shape, border, selected ring, image-fit, label placement, or
  accessible-label controls.
- No upload control for swatch images.
- It needs fallback behavior when the visual token is invalid.

### Next Work

Add swatch-specific controls and validation. Preserve text labels for
accessibility even when visual-only display is enabled.

## TASK-FC-041: Search

### Source Evidence

- Search render branch: `includes/Elementor/Widgets/FilterController.php:157`
- Search resolver: `includes/Support/FilterResolver.php:199`
- Generic field styles: `includes/Elementor/FilterController/StyleControls.php:177`

### Current Strengths

- Simple and broadly useful.
- Uses native search input.
- Can search item text/title.

### Gaps

- No search icon or clear icon control.
- No debounce control.
- No placeholder presets by domain.
- No loading/searching visual state.
- No control for searching specific keys vs all indexed text.

### Next Work

Add search-specific icon, clear, debounce, field scope, and loading state
controls.

## TASK-FC-042: Select

### Source Evidence

- Select branch: `includes/Elementor/Widgets/FilterController.php:162`
- Option parser: `includes/Elementor/FilterController/FilterOptions.php:14`
- Generic field styles: `includes/Elementor/FilterController/StyleControls.php:177`

### Current Strengths

- Native select is predictable and accessible.
- Works well for compact one-of-many choices.

### Gaps

- No custom arrow control.
- No placeholder/all label contract.
- No multi-select mode.
- No option group support.
- Limited styling compared with text inputs.

### Next Work

Keep native select as the base, then add arrow, placeholder, all option, compact
width, and optional enhanced select mode only if justified.

## TASK-FC-043: Date

### Source Evidence

- Date render branch: `includes/Elementor/Widgets/FilterController.php:235`
- Date collection: `assets/js/eit-frontend.js:259`
- Date resolver: `includes/Support/FilterResolver.php:225`

### Current Strengths

- Supports from/to range.
- Uses native date inputs.
- Resolver already compares normalized dates.

### Gaps

- No date-specific style section.
- No quick ranges, such as today, this week, this month.
- No date format/display controls.
- No timezone or invalid-date warning.
- No single-date mode.

### Next Work

Add date-specific controls after source binding is more stable. Prioritize clear
from/to labels, icon controls, and quick range presets.

## Separate Module: Sort

### Source Evidence

- Content controls: `includes/Elementor/FilterController/ContentControls.php:362`
- Sort options helper: `includes/Support/SortOptions.php:17`
- Sort render/collection: `includes/Elementor/Widgets/FilterController.php`,
  `assets/js/eit-frontend.js:286`
- Resolver sort: `includes/Support/FilterResolver.php:244`

### Current Strengths

- Sort has been separated from Filters in Content controls.
- Structured sort rows support source, key, data type, and direction.

### Gaps

- Sort still renders as a full-width group.
- It has no deep style model of its own.
- Defaults still imply commerce-like numeric value.
- No dynamic tag/key picker for sort source.
- No preview of what data key exists in the target listing.

### Next Work

Treat Sort as a sibling module to Filters. It needs its own layout width,
alignment, source key selection, display style, and tests.

## Completion Decision

`TASK-FC-034` through `TASK-FC-043` are complete as audit tasks. The next plan
must create shared implementation slices first, then per-filter polish slices in
an order that prevents Range and Rating from consuming all attention.

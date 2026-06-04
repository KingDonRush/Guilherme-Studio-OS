# Filter Controller Range Audit

Date: 2026-06-04

Task: `TASK-FC-006`
Subplan: `SUBPLAN-FC-AUDIT-RANGE`

Status: audit complete, implementation not started.

## Purpose

Audit the range filter as a component system before adding another broad
customization pass.

The current range already works technically, but Guilherme's vertical screenshot
shows the product debt clearly: labels/ticks can become visually strange, the
meaning of "labels" is ambiguous, and switchers do not yet define whether a
subelement should disappear from the DOM, become `display: none`, or stop
reserving layout.

This document separates:

- mechanical bugs;
- product customization controls;
- deferred ideas;
- QA scenarios that require Guilherme's frontend/editor judgment.

No plugin source changes are part of this task.

## Source Evidence

Current implementation references:

- Render anatomy: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/Widgets/FilterController.php:167`
- Range content controls: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/ContentControls.php:252`
- Style controls: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/StyleControls.php:402`
- Normalization: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/FilterSettings.php:100`
- Default range filter: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/FilterTypes.php:47`
- Frontend CSS: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/css/eit-frontend.css:157`
- Frontend JS range state: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/js/eit-frontend.js:214`
- Frontend JS sync: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/js/eit-frontend.js:523`

## Current DOM Anatomy

The range branch renders this structure:

```html
<div class="eit-range eit-range--horizontal|vertical eit-range--track-* ..." data-eit-control data-eit-type="range" data-eit-key="price">
  <div class="eit-range__labels" aria-hidden="true">
    <span data-eit-range-min-label>0</span>
    <span data-eit-range-max-label>10,000</span>
  </div>
  <div class="eit-range__values">
    <input class="eit-input eit-range-number" type="number" data-eit-range-min>
    <input class="eit-input eit-range-number" type="number" data-eit-range-max>
  </div>
  <div class="eit-range__sliders">
    <input class="eit-range-input" type="range" data-eit-range-min-slider>
    <input class="eit-range-input" type="range" data-eit-range-max-slider>
  </div>
  <div class="eit-range__ticks" aria-hidden="true">
    <span>0</span>
    <span>5,000</span>
    <span>10,000</span>
  </div>
</div>
```

The component has these subelements:

- filter group label: `.eit-filter-group__label`, controlled per filter row by
  `show_label`;
- current value labels: `.eit-range__labels`, dynamic min/max text updated by
  JS;
- numeric inputs: `.eit-range__values`, two visible number fields;
- min/max sliders: `.eit-range__sliders`, two native range inputs;
- handles: browser pseudo-elements of `.eit-range-input`;
- base track: browser pseudo-elements of `.eit-range-input`;
- selected/progress track: currently partial and browser-dependent;
- scale ticks: `.eit-range__ticks`, static min/mid/max labels;
- orientation wrapper classes: `.eit-range--horizontal` and
  `.eit-range--vertical`;
- track style classes: `.eit-range--track-solid`, `.eit-range--track-dashed`,
  `.eit-range--track-segmented`.

Important distinction: the UI currently has both "current values" and "scale
ticks". Guilherme's screenshot refers to "labels" in human language, but the
visible `10,000 / 5,000 / 0` rail is probably the tick rail, not the dynamic
current-value rail. The product must name these separately in Elementor.

## Existing Controls

Content tab, per repeater row:

- `range_min`
- `range_max`
- `range_step`
- `show_label`

Style tab, widget-level for range/rating section:

- `range_orientation`
- `range_show_values`
- `range_show_ticks`
- `range_track_style`
- `range_track_color`
- `range_track_base_color`
- `range_track_height`
- `range_vertical_height`
- `range_handle_size`
- `range_handle_shape`
- `range_handle_color`
- `range_value_color`

Current control debt:

- Range and rating share one section label: `Range & Rating`.
- Range controls are widget-level, not per range row.
- `range_value_color` styles both current value labels and scale ticks.
- There is no control for numeric input visibility.
- There is no control for tick count, tick source, tick placement, or tick
  typography.
- There is no control for current-value label placement.
- There is no separate control for min handle versus max handle.
- There is no control for vertical label rail placement.
- There is no explicit "layout reservation" contract for disabled subelements.

## Switcher Contracts

Switcher behavior must be precise enough that Codex can implement it without
guessing.

### Filter Group Label

Control: `show_label`

Current behavior:

- PHP does not render `.eit-filter-group__label` when false.

Required contract:

- Off means the label markup is absent.
- Off must not reserve vertical or horizontal space.
- This label is not the same as range current values or scale ticks.

### Current Value Labels

Control: `range_show_values`

Current behavior:

- PHP always renders `.eit-range__labels`.
- CSS hides it by default.
- `eit-range--show-values` displays it.
- JS always updates its child text.

Required contract:

- Off means no visible rail and no reserved layout gap.
- It may remain in the DOM only if hidden with `display: none`.
- It must not be confused with scale ticks.
- In horizontal mode, default placement should be above the sliders.
- In vertical mode, placement must be configurable: left of sliders, right of
  sliders, outside, or hidden.

### Numeric Inputs

Control: not currently available.

Current behavior:

- `.eit-range__values` is always visible.
- JS uses number inputs as one source of truth and syncs sliders with them.

Required contract:

- A future `range_show_inputs` control should decide whether the user sees the
  number fields.
- If hidden, implementation can keep inputs in the DOM as hidden/visually hidden
  technical controls only if range keyboard/accessibility still works.
- Hidden inputs must not reserve the large left column in vertical layout.
- If inputs are visible, vertical mode needs placement control: left, right,
  above, below, or compact inline.

### Scale Ticks

Control: `range_show_ticks`

Current behavior:

- PHP always renders `.eit-range__ticks`.
- CSS hides it by default.
- `eit-range--show-ticks` displays it.
- Vertical mode turns the tick rail into a column-reverse flex stack.

Required contract:

- Off means no visible tick rail and no reserved layout gap.
- Ticks must be named "Scale Ticks" in UI, not "labels".
- Tick content should be configurable later: min/max only, min/mid/max, fixed
  count, custom tick labels, or step-derived ticks.
- In vertical mode, tick rail placement must be configurable independently from
  current value labels.

### Track Style

Control: `range_track_style`

Current behavior:

- `solid`, `dashed`, and `segmented` alter the native input track backgrounds.
- Patterns are hardcoded against the base track color.

Required contract:

- Track style controls the base track visual only unless a selected-range
  implementation is explicitly added.
- Dashed/segmented density should become configurable later if the product wants
  high craft.

## Vertical Issue Analysis

The screenshot issue is not only a cosmetic bug.

Current vertical CSS uses:

```css
.eit-range--vertical {
    grid-template-areas: "values labels sliders ticks";
    grid-template-columns: minmax(120px, 1fr) auto auto auto;
}
```

This means vertical mode is designed as four possible rails:

- numeric values;
- current value labels;
- sliders;
- scale ticks.

The problem is that the layout template is fixed even when labels or ticks are
disabled. Hidden rails can still influence the visual mental model because the
component remains shaped like a multi-column system. When ticks are enabled,
they sit far to the right in a way that can look detached from the slider. When
current values are disabled but ticks are enabled, a user may say "labels are
still showing" because the tick rail is still a numeric label rail.

Required vertical contract:

- vertical mode must compute or class its grid by enabled subelements;
- if values are off, the left numeric-input rail disappears;
- if current values are off, the current-value rail disappears;
- if ticks are off, the tick rail disappears;
- if both labels and ticks are on, they need distinct placement rules;
- slider rails need a stable center line and predictable gap from text rails;
- number inputs must not dominate width by default on narrow screens;
- long formatted numbers like `10,000`, currency values, or suffix values must
  have overflow rules.

## Browser/Track Reality

The current "Selected Track" control is not fully honest across browsers.

Evidence:

- `range_track_color` sets `accent-color` and CSS variables.
- WebKit track CSS uses only `--eit-range-track-color` for
  `::-webkit-slider-runnable-track`.
- Firefox has `::-moz-range-progress`, so progress color is more visible there.
- Two independent native range inputs do not create a true selected interval
  fill between min and max.

Mechanical implication:

- Chrome/WebKit may not show a true selected range segment.
- Firefox can show progress per input, but not necessarily a combined min-max
  band.
- A polished selected range requires either a custom background calculation or a
  dedicated overlay track.

Product implication:

- If the Elementor UI says "Selected Track", the frontend should actually show
  a selected segment in the supported browsers.
- Until that exists, the control should be documented as handle/accent color or
  the implementation should add real selected-track rendering.

## State Matrix

| State | Expected behavior | Current risk |
| --- | --- | --- |
| Horizontal, no values, no ticks | Sliders and number inputs only, compact grid. | Mostly acceptable. |
| Horizontal, values on | Dynamic min/max values visible near sliders. | Labels share one color control with ticks. |
| Horizontal, ticks on | Scale ticks align to min/mid/max. | Tick count and format are hardcoded. |
| Horizontal, values and ticks on | Two numeric rails must not feel duplicated. | Copy/placement may confuse users. |
| Vertical, no values, no ticks | Sliders plus number inputs only. | Fixed grid may still feel too wide. |
| Vertical, values on | Dynamic min/max values must sit close to handles or chosen rail. | Current right/left meaning is not explicit. |
| Vertical, ticks on | Scale ticks align to min/mid/max without feeling detached. | Screenshot shows detached/right-side rail risk. |
| Vertical, values and ticks on | Two rails require clear placement and spacing. | High clutter risk. |
| Mobile vertical | Layout must avoid four cramped columns. | Current media query keeps four columns. |
| Long values | Text must not overflow or push sliders away. | `min-width: 3ch/4ch` is too small for currency. |
| Min greater than max | JS clamps max to min. | Only one direction is handled; max below min is repaired by raising max. |
| Step mismatch | Inputs/sliders use native constraints. | No audit of decimal/currency precision. |
| Keyboard focus | Native inputs should remain reachable. | Hiding inputs later could break keyboard UX if not planned. |
| RTL/writing mode | Vertical uses `writing-mode: vertical-lr` and `direction: rtl`. | Cross-browser behavior needs screenshot QA. |

## Mechanical Bugs To Fix First

These are code correctness or contract bugs, not taste.

1. Split label semantics in UI copy.
   - `range_show_values` should clearly mean "Current Value Labels".
   - `range_show_ticks` should clearly mean "Scale Ticks".
   - The frontend classes should support that distinction.

2. Make disabled rails stop reserving vertical layout.
   - Vertical grid should not always be `"values labels sliders ticks"`.
   - Use state classes such as `eit-range--has-values`,
     `eit-range--has-ticks`, and future `eit-range--has-inputs`.

3. Add numeric input visibility contract.
   - The numeric inputs are a first-class subelement.
   - A style/product pass cannot ignore them because they dominate vertical
     layout.

4. Correct selected-track behavior.
   - Either implement a real selected range fill or rename the current control
     so the UI does not promise what the CSS does not deliver.

5. Improve mobile vertical behavior.
   - Current mobile CSS keeps four columns.
   - Mobile vertical should probably collapse to sliders plus compact controls,
     or use above/below rails.

6. Add overflow handling for formatted values.
   - `10,000`, currency, percentages, and suffix labels need max width,
     wrapping, or compact formatting.

## Product Controls To Add After Bugs

These controls are justified by the anatomy, not by "more options is better".

Range display:

- show numeric inputs: on/off;
- numeric input placement: left, right, top, bottom;
- numeric input width;
- numeric input typography and spacing;
- current value label placement;
- current value label typography;
- current value label prefix/suffix;
- compact large-number formatting.

Ticks:

- tick placement: start side, end side, above/below for horizontal;
- tick mode: min/max, min/mid/max, custom, step-derived;
- tick count for generated ticks;
- tick typography;
- tick gap from track;
- tick line/marker style.

Track:

- true selected interval fill;
- base track style;
- selected track style;
- dashed/segmented density;
- track radius;
- track shadow or outline;
- separate horizontal/vertical track size.

Handles:

- min handle and max handle color separately;
- handle border color;
- handle border width;
- handle icon or custom symbol;
- handle shadow;
- active/hover/focus states;
- overlap handling when min and max meet.

Orientation/layout:

- per-device orientation;
- vertical rail order;
- vertical rail gap;
- vertical alignment;
- vertical mobile fallback;
- option to stack number inputs below vertical slider on mobile.

## Deferred Ideas

These are valuable but should not enter the next mechanical fix unless the slice
is explicitly expanded.

- Fully custom dual-range slider instead of native range inputs.
- Drag tooltip bubbles pinned to each handle.
- Histogram/availability distribution behind the track.
- Preset range chips such as "$", "$$", "$$$".
- Currency/date/unit formatter abstraction shared with other filters.
- Theme token mapping for range anatomy.
- Per-filter-row style overrides inside the repeater.

## Recommended Implementation Slices

Slice A: repair contract and vertical layout.

- Rename/copy controls for current value labels versus scale ticks.
- Add range wrapper classes for enabled rails.
- Fix vertical grid so hidden rails do not reserve space.
- Add mobile vertical fallback.
- Keep existing controls; no large new customization set yet.

Slice B: numeric input control.

- Add `range_show_inputs`.
- Keep technical inputs accessible if hidden.
- Add input placement and input width controls.
- Verify collect/reset/sync still works.

Slice C: honest selected track.

- Implement a real selected interval fill using CSS variables updated by JS, or
  rename the current control if avoiding custom track math.
- Verify in Chrome/WebKit and Firefox.

Slice D: deeper craft controls.

- Tick modes/count/typography.
- Label placement/typography.
- Handle border/icon/states.
- Track density and radius.

## Guilherme QA Scenario

Codex can do syntax, generated HTML, and simple screenshots. Guilherme owns the
judgment-heavy Elementor/editor QA for this component.

Test in Elementor editor and frontend preview:

1. Add a Filter Controller with only one range filter.
2. Set range min `0`, max `10000`, step `100`.
3. Toggle filter group label off and confirm "Budget Range" disappears without
   leaving a blank band.
4. Set orientation horizontal.
5. Toggle Current Value Labels on/off and confirm only dynamic min/max labels
   are affected.
6. Toggle Scale Ticks on/off and confirm only min/mid/max tick rail is affected.
7. Drag both handles and confirm dynamic labels update when enabled.
8. Set orientation vertical.
9. Repeat current-value and tick toggles; confirm off means no visual rail and
   no weird empty spacing.
10. Check whether ticks feel connected to the slider or detached.
11. Check number inputs: do they dominate the layout, especially vertical?
12. Test desktop, tablet, and mobile preview widths.
13. Test long values if available: currency prefix, `10,000`, `100,000`, and
   decimal steps.
14. Check hover/focus/active handle states for visual polish.
15. Report whether the component feels Elementor-native or like an awkward
   pasted control.

Pass criteria:

- subelements respond only to their own controls;
- no disabled subelement reserves obvious layout;
- vertical mode looks intentional, not like horizontal controls rotated;
- number inputs, labels, ticks, handles, and track read as one component;
- the Style tab exposes only range-relevant controls when range exists.

## Completion Decision

`TASK-FC-006` is complete as an audit task because it:

- maps the range DOM anatomy;
- defines switcher contracts;
- explains the vertical screenshot issue;
- separates mechanical bugs from product customization;
- identifies deferred ideas;
- gives Guilherme a focused QA scenario;
- does not change plugin source.

The next implementation task should begin with Slice A, not with broad visual
customization.

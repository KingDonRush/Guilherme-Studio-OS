# TASK-060 Filter Controller Control Inventory

Date: 2026-06-04

## Status

TASK-060 is complete.

This task did not change plugin source code. It inspected the current
`FilterController` widget, the local Elementor source, frontend CSS, and
frontend JS contracts to decide how the next implementation pass should hide,
split, or expand controls.

## Evidence Base

Local plugin:

- `includes/Elementor/Widgets/FilterController.php`
- `includes/Elementor/FilterController/FilterTypes.php`
- `includes/Elementor/FilterController/FilterSettings.php`
- `includes/Elementor/FilterController/RuntimeConfig.php`
- `assets/js/eit-frontend.js`
- `assets/css/eit-frontend.css`

Local Elementor:

- Elementor active version: `4.0.8`.
- `includes/base/controls-stack.php`
- `includes/controls/repeater.php`
- `includes/widgets/button.php`
- `includes/widgets/traits/button-trait.php`

## Core Finding

The current widget is functionally strong, but the editor is not cadenced.

It has 3 Content sections and 7 Style sections:

- Content:
  - Target Listing;
  - Filters;
  - State, Sort & Pagination.
- Style:
  - Layout;
  - Fields;
  - Options, Chips & Swatches;
  - Range & Rating;
  - Buttons;
  - Active Chips & Count;
  - Loading, Empty & Motion.

The Style panel exposes broad sections even when the current filter composition
does not use those controls.

## Elementor Condition Feasibility

Elementor's local `Controls_Stack::is_control_visible()` evaluates `condition`
against current settings by direct control key.

It supports:

- direct setting checks, such as `show_sort => yes`;
- negative checks, such as `type! => search`;
- simple subkeys, such as `some_control[size]`, when the setting is an
  associative array;
- array containment when the compared instance value is an array.

It does not provide a clean native condition for:

- "show this section if any row in repeater `filters` has `type = range`."

Reason:

- `filters` is a repeater value, therefore a numeric array of row arrays;
- a condition like `filters[type] => range` expects `filters` to be an
  associative array with a `type` key;
- checking `filters => range` would compare a string against an array of rows,
  not against every row's `type`.

Conclusion:

- do not rely on native Elementor `condition` directly against the `filters`
  repeater for type-aware Style sections;
- add an auxiliary widget-level state if type-aware sections are needed.

Recommended helper:

- `enabled_filter_types`, a hidden or non-primary widget setting containing a
  normalized list like `search,range,chips`;
- update it from editor-side code when the repeater changes, or derive it on
  save/render and use an editor sync path;
- use regular Elementor `condition` against `enabled_filter_types` for Style
  sections.

## Content Inventory

### Target Listing

Controls:

- `configuration_source`
  - Type: select.
  - Role: chooses inline widget controls or admin preset.
  - Runtime: affects `FilterSettings::resolve_preset_settings()`.
  - Keep.
- `filter_preset`
  - Type: select.
  - Condition: `configuration_source = preset`.
  - Role: loads saved admin preset.
  - Keep, but future UX should rename/reframe around saved widget presets.
- `target_selector`
  - Type: text.
  - `frontend_available`.
  - Runtime: `RuntimeConfig::targetSelector`; frontend finds target listing.
  - Keep.
- `item_selector`
  - Type: text.
  - `frontend_available`.
  - Runtime: `RuntimeConfig::itemSelector`; frontend item detection override.
  - Keep.
- `auto_apply`
  - Type: switcher.
  - `frontend_available`.
  - Runtime: frontend applies on input/change.
  - Keep.
- `sync_url`
  - Type: switcher.
  - `frontend_available`.
  - Runtime: URL state restore/sync.
  - Keep.
- `per_page`
  - Type: number.
  - `frontend_available`.
  - Runtime: server pagination payload.
  - Keep.

Risk:

- `target_selector` and `item_selector` are implementation-sensitive and should
  remain contextual in the widget, not hidden away in admin.

### Filters

Repeater: `filters`.

Row controls:

- `label`
  - Type: text.
  - Role: visual label and active chip label source.
  - Keep.
- `type`
  - Type: select.
  - Options: search, checkbox, radio, select, chips, toggle, range, date,
    swatch, rating.
  - Role: primary driver for render path and future Style visibility.
  - Keep.
- `key`
  - Type: text.
  - Condition: not search.
  - Runtime: `data-eit-key`; resolver reads `data`, classes, text fallback.
  - Keep, but needs better copy/diagnostics.
- `placeholder`
  - Type: text.
  - Condition: search or select.
  - Runtime: placeholder/all option copy.
  - Keep.
- `options`
  - Type: textarea.
  - Condition: checkbox, radio, select, chips, toggle, swatch, rating.
  - Runtime: parsed by `FilterOptions::parse()`.
  - Keep, but future UX should replace raw textarea with structured row UI.
- `range_min`, `range_max`, `range_step`
  - Type: number.
  - Condition: range.
  - Runtime: range inputs and sliders.
  - Keep.
- `show_label`
  - Type: switcher.
  - Runtime: controls label render.
  - Keep.

Risk:

- The repeater is currently the source of truth for type composition, but
  Elementor Style conditions cannot cleanly ask "does this repeater contain a
  range filter?" without auxiliary state.

### State, Sort & Pagination

Controls:

- `show_result_count`
  - Type: switcher.
  - Runtime: result count render and frontend meta.
  - Keep.
- `result_count_text`
  - Type: text.
  - Condition: `show_result_count = yes`.
  - Runtime: `{count}` display.
  - Keep.
- `show_active_chips`
  - Type: switcher.
  - Runtime: active chips render and frontend removal.
  - Keep.
- `show_sort`
  - Type: switcher.
  - Runtime: sort select render.
  - Keep.
- `sort_label`
  - Type: text.
  - Condition: `show_sort = yes`.
  - Keep.
- `sort_options`
  - Type: textarea.
  - Condition: `show_sort = yes`.
  - Runtime: parsed by `FilterOptions::parse()`.
  - Keep, but future UX should structure it.
- `show_apply`
  - Type: switcher.
  - Runtime: apply button render.
  - Keep.
- `apply_text`
  - Type: text.
  - Condition: `show_apply = yes`.
  - Keep.
- `reset_text`
  - Type: text.
  - Runtime: reset button render.
  - Keep.
- `empty_text`
  - Type: text.
  - Runtime: empty state render.
  - Keep.
- `pagination_type`
  - Type: select.
  - Values: numbers, prev_next, numbers_arrows, none.
  - Runtime: frontend pagination renderer.
  - Keep.
- `previous_text`, `next_text`
  - Type: text.
  - Condition: prev_next or numbers_arrows.
  - Keep.

Risk:

- Style sections for active chips, count, pagination, and apply button should
  condition against these direct controls. This is safe with native Elementor
  conditions.

## Style Inventory

### Layout

Controls:

- `layout_direction`
- `layout_gap`
- `group_gap`
- `controller_background`
- `controller_border`
- `controller_radius`
- `controller_padding`
- `controller_shadow`

Scope:

- global wrapper and form layout.

Keep:

- always visible; it is not tied to a specific filter type.

### Fields

Controls:

- `label_typography`
- `label_color`
- `field_typography`
- `field_text_color`
- `field_background`
- `field_border`
- `field_radius`
- `field_padding`

Selectors:

- `.eit-filter-group__label`
- `.eit-input`
- `.eit-select`

Applies to:

- search;
- select;
- range number fields;
- date fields;
- sort select.

Problem:

- this section does not distinguish search input, select, date, sort select, and
  range numeric fields.

Recommendation:

- keep as shared baseline;
- future split into Search Field, Select/Sort Field, Date Field, and Range Value
  Fields only if the customization pass needs it.

### Options, Chips & Swatches

Controls:

- `option_typography`
- `option_color`
- `option_background`
- `option_active_color`
- `option_active_background`
- `option_border`
- `option_radius`
- `option_padding`

Selectors:

- `.eit-option`
- `.eit-option:has(input:checked)`
- `.eit-option.is-active`

Applies to:

- checkbox;
- radio;
- chips;
- toggle label;
- swatch option wrapper;
- rating option wrapper.

Problem:

- checkboxes, radios, chips, swatches, toggles, and rating rows are styled as
  the same pill pattern.
- there are no specific controls for checkbox mark, radio mark, chip shape,
  swatch size/radius, toggle switch, or rating icon/label style.

Recommendation:

- keep current section as "Choice Options" baseline;
- split future type-specific controls:
  - Checkbox/Radio;
  - Chips;
  - Swatches;
  - Toggle;
  - Rating.

### Range & Rating

Controls:

- `range_track_color`
- `rating_color`

Selectors:

- `.eit-range-input`
- `.eit-rating-option input:checked + span`
- `.eit-rating-option span`

Applies to:

- range;
- rating.

Problem:

- this section mixes two unrelated filter types;
- range only exposes `accent-color`;
- rating is text-based, not icon-rich;
- no support for range orientation, custom handle, track style, ticks, labels,
  units, min/max value display, or responsive behavior.

Recommendation:

- split into `Range` and `Rating`;
- implement range customization first in `PHASE-110`.

### Buttons

Controls:

- `button_typography`
- `button_color`
- `button_background`
- `button_border`
- `button_radius`
- `button_padding`

Selectors:

- `.eit-button`

Applies to:

- reset button;
- optional apply button.

Problem:

- apply and reset are styled together, but reset currently has a separate base
  class `.eit-button--reset`.

Recommendation:

- keep visible because reset always renders;
- add separate Apply and Reset tabs later if design needs it;
- condition apply-specific controls against `show_apply`.

### Active Chips & Count

Controls:

- `meta_typography`
- `chip_color`
- `chip_background`
- `count_color`

Selectors:

- `.eit-result-count`
- `.eit-active-chip`

Applies to:

- active chips;
- result count.

Recommendation:

- condition chip controls against `show_active_chips`;
- condition count controls against `show_result_count`;
- split typography if chips/count need different scale.

### Pagination

Controls:

- `pagination_gap`
- `pagination_color`
- `pagination_background`
- `pagination_active_color`
- `pagination_active_background`

Selectors:

- `.eit-pagination`
- `.eit-page-button`
- `.eit-page-button.is-active`

Recommendation:

- condition whole section against `pagination_type != none`;
- expand later with border, radius, padding, typography, disabled state, and
  arrow-specific controls.

### Loading, Empty & Motion

Controls:

- `transition_duration`
- `loading_opacity`
- `empty_color`

Selectors:

- `.eit-filter-controller`, `.eit-option`, `.eit-button`, `.eit-active-chip`,
  `.eit-page-button`;
- `body .eit-target-is-loading`;
- `.eit-empty-state`.

Recommendation:

- keep global;
- condition empty color only if empty state remains enabled once that becomes a
  toggle;
- loading opacity is target-level and should be treated carefully because its
  selector is global under `body`.

## Filter Type Matrix

Search:

- Content: label, type, placeholder, show_label.
- Runtime: search against visible text/title.
- Current Style: Fields + Layout + state sections.
- Gap: search icon, clear icon, input height, placeholder color, focus state.

Checkbox:

- Content: label, type, key, options, show_label.
- Runtime: token contains.
- Current Style: Options.
- Gap: checkbox mark shape, checked indicator, list vs pill layout.

Radio:

- Content: label, type, key, options, show_label.
- Runtime: token contains.
- Current Style: Options.
- Gap: radio mark, selected indicator, list vs pill layout.

Select:

- Content: label, type, key, placeholder, options, show_label.
- Runtime: token contains.
- Current Style: Fields.
- Gap: select arrow, dropdown-like affordance, width, focus state.

Chips:

- Content: label, type, key, options, show_label.
- Runtime: token contains.
- Current Style: Options.
- Gap: chip density, icon per chip, selected/unselected border, layout mode.

Toggle:

- Content: label, type, key, first option, show_label.
- Runtime: token contains.
- Current Style: Options baseline only.
- Gap: switch width/height, knob size, knob color, on/off labels.

Range:

- Content: label, type, key, min, max, step, show_label.
- Runtime: numeric between min/max.
- Current Style: Fields for numeric inputs, Range & Rating for accent color.
- Gap: orientation, handle, track, dashed/segmented style, ticks, labels,
  units, responsive behavior.

Date:

- Content: label, type, key, show_label.
- Runtime: date between from/to.
- Current Style: Fields.
- Gap: from/to labels, separator, calendar icon, compact/mobile layout.

Swatch:

- Content: label, type, key, options with visual value, show_label.
- Runtime: token contains.
- Current Style: Options plus `.eit-swatch` hardcoded CSS.
- Gap: swatch size, radius, border, image fit, selected ring.

Rating:

- Content: label, type, key, options, show_label.
- Runtime: numeric greater-or-equal.
- Current Style: Options plus Range & Rating color.
- Gap: icon rendering, star size, active/inactive color, threshold copy.

Sort:

- Content: show_sort, sort_label, sort_options.
- Runtime: sort select.
- Current Style: Fields.
- Gap: dedicated Sort style controls or reuse Select style deliberately.

Active Chips:

- Content: show_active_chips.
- Runtime: frontend chip rendering and clear behavior.
- Current Style: Active Chips & Count.
- Gap: remove icon, chip gap, border/radius/padding.

Pagination:

- Content: pagination_type, previous_text, next_text.
- Runtime: frontend pagination.
- Current Style: Pagination.
- Gap: disabled state, radius, padding, border, typography, arrow style.

## Implementation Recommendation

Do not try to make native Elementor conditions inspect repeater rows.

Recommended implementation path for `PHASE-080`:

1. Add a derived widget setting such as `enabled_filter_types`.
2. Keep it invisible or non-primary in the editor.
3. Update it whenever the filter repeater changes.
4. Use native Elementor `condition` on Style sections:
   - Range section: `enabled_filter_types` contains `range`;
   - Choice section: contains any of `checkbox`, `radio`, `chips`, `swatch`,
     `toggle`, `rating`;
   - Date section: contains `date`;
   - Search section: contains `search`.
5. Use direct existing controls for global sections:
   - `show_result_count`;
   - `show_active_chips`;
   - `show_sort`;
   - `show_apply`;
   - `pagination_type`.

## Next Task

Proceed to `TASK-070` before `TASK-080`.

Reason:

- `FilterController.php` still owns too much control-registration detail;
- type-aware Style sections will be easier if control groups are modularized;
- the current inventory gives clean extraction boundaries:
  - target controls;
  - repeater controls;
  - state controls;
  - shared style controls;
  - type-specific style controls.

# Filter Controller Preset Contract Inventory

Date: 2026-06-04

Task: `TASK-FC-001`

Status: complete.

This document defines the current Filter Controller preset contract before the
widget-side save/load work starts. It does not change plugin source code.

## Evidence Base

Local source inspected:

- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Support/FilterPresets.php`
  - option key, blank schema, sanitizer, limits, allowed values, save/delete.
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Admin/FilterPresetAdmin.php`
  - current admin form shape and `admin-post` save/delete/duplicate actions.
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/ContentControls.php`
  - widget Content controls and current preset selector.
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/FilterSettings.php`
  - runtime preset resolution and preset-to-widget mapping.
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/RuntimeConfig.php`
  - runtime config exposed to frontend JS.
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/Widgets/FilterController.php`
  - rendered HTML and `data-eit-*` contracts.
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/FilterController/StyleControls.php`
  - Style controls that must remain local until type audits decide otherwise.
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/js/eit-editor.js`
  - editor-side hidden type flags used to cadence Style controls.
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/js/eit-frontend.js`
  - frontend state collection, URL state, active chips, range/date behavior.
- `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Rest/FilterControllerEndpoint.php`
  and `includes/Support/FilterResolver.php`
  - REST filtering payload and server-side filter execution.

Related existing inventory:

- `docs/implementation-toolkit/filter-controller-task-060-inventory.md`

## Current Storage

Current presets are stored in one WordPress option:

- option key: `eit_filter_presets`;
- shape: associative array keyed by sanitized preset id;
- autoload: disabled through `update_option( ..., false )`;
- hard limits:
  - max filters per preset: `40`;
  - max sort options: `24`;
  - max option lines per filter: `120`.

There is no explicit `schema_version` yet.

## Top-Level Preset Fields

| Field | Current status | Ownership | Notes |
| --- | --- | --- | --- |
| `id` | persisted | preset-owned identity | Sanitized key. Used as array key and Elementor selection value. |
| `name` | persisted | preset-owned identity | Human label for admin and Elementor select. |
| `slug` | persisted | preset-owned identity | Generated from name/id when missing. Not currently runtime-critical. |
| `description` | persisted | preset-owned metadata | Internal admin note only. |
| `provider_mode` | persisted | preset-owned behavior metadata | Saved and displayed, but current runtime still behaves as DOM/listing filter. Keep for future provider routing. |
| `target_selector` | persisted | preset default, widget-overridable | Resolver uses widget value first, preset fallback second. Should not be forced globally. |
| `item_selector` | persisted | preset default, widget-overridable | Same override rule as target selector. |
| `apply_mode` | persisted | preset-owned behavior | Maps to widget `auto_apply`/`show_apply`. |
| `sync_url` | persisted | preset-owned behavior default | Maps to runtime URL sync. |
| `per_page` | persisted | preset-owned behavior default | Maps to runtime pagination payload. |
| `show_result_count` | persisted | preset-owned display behavior | Controls result count render. |
| `result_count_text` | persisted | preset-owned copy | Uses `{count}` token. |
| `show_active_chips` | persisted | preset-owned display behavior | Controls active chip container render. |
| `show_sort` | persisted | preset-owned display behavior | Controls sort select render. |
| `sort_label` | persisted | preset-owned copy | Used when sort is visible. |
| `sort_options` | persisted | preset-owned behavior/copy | Parsed line format `value|Label`. |
| `apply_text` | persisted | preset-owned copy | Used when `apply_mode=button`. |
| `reset_text` | persisted | preset-owned copy | Reset always renders today. |
| `empty_text` | persisted | preset-owned copy | Runtime empty state text. |
| `pagination_type` | persisted | preset-owned behavior | `numbers`, `prev_next`, `numbers_arrows`, `none`. |
| `previous_text` | persisted | preset-owned copy | Used by prev/next pagination modes. |
| `next_text` | persisted | preset-owned copy | Used by prev/next pagination modes. |
| `filters` | persisted | preset-owned structure | List of filter definitions. Disabled filters are saved but skipped when mapped to widget settings. |
| `updated_at` | persisted derived metadata | derived on save | Generated by `current_time( 'mysql' )`. |

Deprecated fields: none.

Unknown fields: none in the current schema. Unknown future fields should be
ignored during runtime resolution and preserved only if a future migration layer
explicitly chooses to do so.

## Per-Filter Preset Fields

| Field | Current status | Ownership | Notes |
| --- | --- | --- | --- |
| `enabled` | persisted | preset-owned structure | Disabled filters remain stored but are skipped by preset-to-widget mapping. |
| `label` | persisted | preset-owned structure/copy | Rendered label when `show_label` is true. |
| `type` | persisted | preset-owned structure | Allowed: search, checkbox, radio, select, chips, toggle, range, date, swatch, rating. |
| `key` | persisted | preset-owned data binding | Used as `data-eit-key`; resolver checks item data/classes/text. |
| `source` | persisted | preset-owned provider metadata | Saved in admin but not mapped into current widget runtime. Future provider routing. |
| `query_var` | persisted | preset-owned URL/provider metadata | Saved in admin but not mapped into current widget runtime. Future URL/provider routing. |
| `compare` | persisted | preset-owned provider metadata | Saved in admin but current resolver behavior is type-driven. Future server/provider routing. |
| `data_type` | persisted | preset-owned provider metadata | Saved in admin but current resolver infers by filter type. Future provider/range/date refinement. |
| `placeholder` | persisted | preset-owned copy | Used by search/select. |
| `options` | persisted | preset-owned structure/copy/visual payload | Line format `value|Label|optional visual`. Parsed by widget. |
| `range_min` | persisted | preset-owned structure | Rendered into range inputs. |
| `range_max` | persisted | preset-owned structure | Rendered into range inputs. |
| `range_step` | persisted | preset-owned structure | Rendered into range inputs. |
| `default_value` | persisted | preset-owned behavior metadata | Saved but not mapped into current widget runtime. Future default-state feature. |
| `empty_behavior` | persisted | preset-owned behavior metadata | Saved but not mapped into current widget runtime. Future empty-state behavior. |
| `show_count` | persisted | preset-owned display metadata | Saved but not mapped into current widget runtime. Future counts feature. |
| `show_label` | persisted | preset-owned display behavior | Mapped to widget `show_label`, then normalized to boolean `showLabel`. |

## Widget Settings Classification

### Preset selector and link state

| Widget setting | Classification | Notes |
| --- | --- | --- |
| `configuration_source` | widget-local link mode | Current values: `widget` or `preset`. This is not part of a preset. |
| `filter_preset` | widget-local link pointer | Stores selected preset id. This is not part of a preset. |

### Target and listing context

| Widget setting | Classification | Notes |
| --- | --- | --- |
| `target_selector` | widget-local override over preset default | Current resolver prefers widget value and falls back to preset value. Keep contextual because page/listing selectors are placement-specific. |
| `item_selector` | widget-local override over preset default | Same rule as target selector. |

### Behavior and display settings

| Widget setting | Classification | Notes |
| --- | --- | --- |
| `auto_apply` | preset-derived in linked mode, widget-owned in widget mode | Derived from preset `apply_mode`. |
| `show_apply` | preset-derived in linked mode, widget-owned in widget mode | Derived from preset `apply_mode`. |
| `sync_url` | preset-derived in linked mode, widget-owned in widget mode | Maps to frontend URL state. |
| `per_page` | preset-derived in linked mode, widget-owned in widget mode | Sent to REST payload as `perPage`. |
| `show_result_count` | preset-derived in linked mode, widget-owned in widget mode | Controls meta render. |
| `result_count_text` | preset-derived in linked mode, widget-owned in widget mode | Runtime copy. |
| `show_active_chips` | preset-derived in linked mode, widget-owned in widget mode | Controls active chip render. |
| `show_sort` | preset-derived in linked mode, widget-owned in widget mode | Controls sort render. |
| `sort_label` | preset-derived in linked mode, widget-owned in widget mode | Runtime copy. |
| `sort_options` | preset-derived in linked mode, widget-owned in widget mode | Parsed by `FilterOptions::parse()`. |
| `apply_text` | preset-derived in linked mode, widget-owned in widget mode | Runtime copy. |
| `reset_text` | preset-derived in linked mode, widget-owned in widget mode | Runtime copy. |
| `empty_text` | preset-derived in linked mode, widget-owned in widget mode | Runtime copy. |
| `pagination_type` | preset-derived in linked mode, widget-owned in widget mode | Runtime pagination behavior. |
| `previous_text` | preset-derived in linked mode, widget-owned in widget mode | Runtime copy. |
| `next_text` | preset-derived in linked mode, widget-owned in widget mode | Runtime copy. |

### Filter composition

| Widget setting | Classification | Notes |
| --- | --- | --- |
| `filters` | preset-derived in linked mode, widget-owned in widget mode | Repeater rows map to renderable filter definitions. |
| `filters.*._id` | widget-derived local id | Preset mapping currently derives from filter key or index. Do not treat as persistent preset identity yet. |
| `filters.*.label` | preset-derived in linked mode, widget-owned in widget mode | Rendered label. |
| `filters.*.type` | preset-derived in linked mode, widget-owned in widget mode | Main render and style-cadence driver. |
| `filters.*.key` | preset-derived in linked mode, widget-owned in widget mode | Runtime data key. |
| `filters.*.placeholder` | preset-derived in linked mode, widget-owned in widget mode | Search/select copy. |
| `filters.*.options` | preset-derived in linked mode, widget-owned in widget mode | Runtime option text/visual payload. |
| `filters.*.range_min` | preset-derived in linked mode, widget-owned in widget mode | Runtime range bound. |
| `filters.*.range_max` | preset-derived in linked mode, widget-owned in widget mode | Runtime range bound. |
| `filters.*.range_step` | preset-derived in linked mode, widget-owned in widget mode | Runtime range step. |
| `filters.*.show_label` | preset-derived in linked mode, widget-owned in widget mode | Render switcher. |

## Local-Only Style Settings

All current Style tab controls remain widget-local for now.

Reason: the product direction is widget-first and Elementor-native. Style settings
belong to the visual instance until the type audits prove which style controls
are reusable design intent rather than placement-specific styling.

Local-only groups:

- layout: `layout_direction`, `layout_gap`, `group_gap`,
  `controller_background`, `controller_border`, `controller_radius`,
  `controller_padding`, `controller_shadow`;
- fields: `label_typography`, `label_color`, `field_typography`,
  `field_text_color`, `field_background`, `field_border`, `field_radius`,
  `field_padding`;
- options: `option_typography`, `option_color`, `option_background`,
  `option_active_color`, `option_active_background`, `option_border`,
  `option_radius`, `option_padding`;
- range/rating: `range_orientation`, `range_show_values`, `range_show_ticks`,
  `range_track_style`, `range_track_color`, `range_track_base_color`,
  `range_track_height`, `range_vertical_height`, `range_handle_size`,
  `range_handle_shape`, `range_handle_color`, `range_value_color`,
  `rating_color`;
- buttons: `button_typography`, `button_color`, `button_background`,
  `button_border`, `button_radius`, `button_padding`;
- active chips/count: `meta_typography`, `chip_color`, `chip_background`,
  `count_color`;
- pagination: `pagination_gap`, `pagination_color`,
  `pagination_background`, `pagination_active_color`,
  `pagination_active_background`;
- state/motion: `transition_duration`, `loading_opacity`, `empty_color`.

Important caveat:

- `range_orientation`, `range_show_values`, `range_show_ticks`, and
  `range_track_style` influence rendered classes/markup, not just generated CSS.
  Keep them local for now, but audit them first in `TASK-FC-006` before deciding
  whether a future preset can carry structural range display settings.

## Derived Runtime Fields

These values are derived and should not be stored as preset fields:

- parsed options from `FilterOptions::parse()`;
- `data-eit-config`;
- `data-eit-filters`;
- frontend `instance`;
- frontend selected state;
- active chips;
- pagination result state;
- URL query state;
- `eit_filter_has_field_controls`;
- `eit_filter_has_option_controls`;
- `eit_filter_has_range_controls`;
- `eit_filter_has_rating_controls`.

The hidden `eit_filter_has_*` controls are editor cadence helpers. They should
stay local widget state and should be recalculated from the selected filters.

## Linked vs Detached Recommendation

### Current behavior

The current runtime already behaves like a linked preset when:

- `configuration_source = preset`;
- `filter_preset` contains an existing preset id.

On render, `FilterSettings::resolve_preset_settings()` loads the saved preset
and maps it into the widget settings. If the preset is missing, it silently
returns the widget settings.

### Recommended linked mode

Linked mode should mean:

- widget stores only `configuration_source = preset` and `filter_preset = <id>`;
- widget reads the current saved preset on render;
- preset edits affect every linked widget;
- widget-local overrides remain limited to placement and visual settings:
  `target_selector`, `item_selector`, Style controls, editor helper flags;
- missing/deleted preset must surface a recoverable editor/admin state, not just
  silently fall back.

Recommended extra metadata for the widget:

- `preset_link_status`: derived in UI, not necessarily persisted;
- `preset_snapshot_hash`: optional, used only to warn that the linked preset has
  changed since the widget was last edited;
- `preset_missing_notice`: derived UI state when `FilterPresets::get()` fails.

### Recommended detached/import mode

Detached mode should mean:

- widget copies the preset-owned fields into local widget controls;
- widget changes `configuration_source` to `widget`;
- widget keeps an optional diagnostic field like `_eit_imported_preset_id`;
- future local edits do not mutate the saved preset;
- saved preset deletion does not affect the detached widget.

Do not store detached widgets as `configuration_source = preset` with copied
fields. That creates ambiguous ownership and invites accidental mutation.

### Recommended save-from-widget mode

Saving from widget to preset should:

- extract only preset-owned fields from the current widget settings;
- ignore Style controls by default;
- allow the user to either:
  - save as new preset and link current widget to it;
  - save as new preset and keep current widget detached;
  - update an existing linked preset only with explicit confirmation.

No save operation should silently overwrite a shared preset.

## Schema Version And Migration Recommendation

Add a non-breaking `schema_version` field on the next preset save path:

- current existing presets without `schema_version` are version `1`;
- new saves should write `schema_version = 2` only if the widget-save feature
  introduces new fields;
- runtime should normalize missing fields with `FilterPresets::blank()` style
  defaults, not require a database migration before old presets can render;
- hard migration through `update_option()` should be delayed until a real field
  transform is needed.

Recommended future normalized preset shape:

- `schema_version`;
- identity: `id`, `name`, `slug`, `description`;
- behavior: `apply_mode`, `sync_url`, `per_page`, `pagination_type`;
- target defaults: `target_selector`, `item_selector`;
- display/copy: result count, active chips, sort, apply/reset/empty/pagination
  copy;
- filters;
- metadata: `created_at`, `updated_at`, optional `created_from`.

## Security-Sensitive Save/Load Fields

Existing admin save path already uses:

- capability gate through admin page capability flow and `assert_can_manage()`;
- nonces through `check_admin_referer()`;
- sanitization in `FilterPresets::save()` and `sanitize_preset()`;
- escaped output in admin/render paths.

Widget-side save/load must preserve the WordPress triangle:

- capability;
- nonce/intent;
- sanitize on save and escape on output.

Required gates for widget-side preset saves:

- only authenticated users;
- require `manage_options` for global preset create/update, or a deliberately
  documented narrower capability if the product chooses one;
- require an Elementor/editor nonce or REST nonce;
- when updating an existing preset, verify the preset exists before overwrite;
- do not trust `filter_preset` or `id` from the browser without `sanitize_key()`;
- cap arrays with the existing max limits.

Sensitive fields and required handling:

| Field group | Risk | Required handling |
| --- | --- | --- |
| preset id/slug | collisions, unexpected overwrite | `sanitize_key`, `sanitize_title`, unique id on create, explicit confirmation on update. |
| selectors | broken JS selectors, accidental broad target | sanitize text, escape attributes, validate/recover invalid selectors in editor/frontend. |
| option visuals | CSS/URL injection if mishandled | keep color/URL validation in `FilterOptions::swatch_style()`, escape style attribute. |
| options text | oversized payload, malformed lines | sanitize textarea, line limits, structured parser later. |
| copy fields | stored output | sanitize text/textarea, escape on render. |
| target/item defaults | global preset affecting many widgets | allow widget override and show linked impact before update. |
| style controls | accidental visual mutation across widgets | exclude from preset saves until a future audited style-preset feature exists. |

The public REST filter endpoint can remain separate from preset persistence. It
accepts frontend filtering payload, not preset-save payload.

## Immediate Implementation Contract

Use this ownership map for the next tasks:

1. `TASK-FC-002` should design the save/load schema from the classifications
   above, not from raw widget settings.
2. `TASK-FC-003` should implement save-from-widget by extracting only
   preset-owned structure and behavior fields.
3. `TASK-FC-004` should keep admin as library, preview, and diagnostics, not as
   the only builder surface.
4. `TASK-FC-005` should implement linked/detached recovery states explicitly.
5. `TASK-FC-006` and the per-type tasks should decide whether any structural
   Style controls deserve future preset ownership.

## Acceptance Result

- Current preset fields are classified.
- Current filter fields are classified.
- Widget composition settings are classified.
- Visual Style settings are explicitly local/deferred.
- Existing saved presets remain readable because no current field is removed or
  made mandatory.
- Save/load implementation is intentionally not started in this task.

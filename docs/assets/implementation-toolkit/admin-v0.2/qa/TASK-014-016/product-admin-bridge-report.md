# Product Admin Bridge QA

Date: 2026-05-18

Scope:
- TASK-014: Elementor bridge templates for filter presets.
- TASK-015: repeatable CPT field builder.
- TASK-016: simplified Filter Preset admin flow.

Outcome:
- Passed local smoke verification.
- The visible admin now treats Filter Presets as reusable behavior that can create Elementor templates.
- The custom post type admin now uses Post Types naming and dynamic repeaters for fields and taxonomies.

WP-CLI smoke:
```text
filters_bridge_visible:ok
filters_repeater_visible:ok
filters_add_button_visible:ok
filters_provider_not_first_glance:ok
cpt_add_field_visible:ok
cpt_advanced_visible:ok
cpt_no_content_models_copy:ok
preset_multiple_filters_saved:ok
filter_template_created:ok
filter_template_post_type:ok
filter_template_role_meta:ok
filter_template_preset_meta:ok
cpt_multiple_fields_saved:ok
cpt_radio_type_saved:ok
cpt_gallery_type_saved:ok
```

Browser smoke:
```text
Filter preset page:
- Add filter changed row count from 1 to 2.
- Elementor bridge was visible.
- Provider Mode was not visible in the first-glance flow.
- Admin JS loaded with ?ver=0.2.1.
- No desktop overflow detected.

CPT/Post Types page:
- Add field changed row count from 1 to 3.
- Add taxonomy changed row count from 0 to 1.
- Content Models copy was absent.
- Radio, image, gallery, datetime, and email field type options were present.
- No desktop overflow detected.
- No mobile overflow detected outside the intended scrollable section tabs.
```

Screenshots:
- `screenshots/filter-preset-bridge-v021.png`
- `screenshots/cpt-field-builder-v021.png`

Checks:
```text
Full plugin PHP lint: pass
node --check assets/js/eit-admin.js: pass
node --check assets/js/eit-frontend.js: pass
node --check assets/js/eit-editor.js: pass
plugin git diff --check: pass
root git diff --check: pass
```

Notes:
- The UI does not promise literal unlimited fields. The browser can add rows dynamically, while the server keeps a safety cap of 80 meta fields per managed post type.
- The bridge creates plugin-owned Elementor library templates, not Elementor Pro Theme Builder conditions.
- A temporary QA admin user was created for browser login and deleted after the smoke run.

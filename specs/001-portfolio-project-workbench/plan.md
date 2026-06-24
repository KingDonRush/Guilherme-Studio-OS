# Implementation Plan: Portfolio Project Workbench

## Technical Approach

Use WordPress-native primitives and small namespaced classes:

- Theme:
  - PSR-4-like autoloader for `GuilhermePortfolio\`.
  - `gp_project` CPT under Appearance.
  - Project configuration metabox on `gp_project`.
  - Assignment metabox on Pages/posts/public CPTs.
  - Admin columns and project filter for Pages.
  - Integration registry that detects optional plugins by constants/functions/classes.

- Simple Budget Plugin:
  - `SBP\Support\Pricing` as the only pricing contract.
  - Meta registration and metaboxes via hooks.
  - Cart renderer consumes Pricing data.
  - Elementor Budget Listing gets a Show Price control.
  - WhatsApp message includes display price/range.
  - EIT integration uses filters only.

- Elementor Implementation Toolkit:
  - Add field catalog extension filters.
  - Add external public meta fields to enrichment.
  - Do not reference SBP classes.

## Data Contract

Theme post meta:

- `_gp_project_mode`
- `_gp_project_surfaces`
- `_gp_project_integrations`
- `_gp_project_notes`
- `_gp_project_items`
- `_gp_project_relations`
- `_gp_project_suggestions`
- `_gp_project_id`
- `_gp_project_role`

SBP post meta:

- `_sbp_price_mode`
- `_sbp_price`
- `_sbp_price_min`
- `_sbp_price_max`
- `_sbp_price_currency`
- `_sbp_price_unit`
- `_sbp_price_label`

EIT filters:

- `eit_toolkit_field_catalog_entries`
- `eit_toolkit_public_meta_fields_for_post_type`

## Verification

- PHP lint on changed PHP files.
- Product verify scripts where available.
- `git diff --check`.
- WP-CLI smoke for `gp item`, `gp relation`, `gp suggestion`, and `gp topology`.
- WordPress admin visual smoke for the Workbench page.
- Final git status for root, `wordpress`, SBP, and EIT repositories.

## Rollback

- Disable project workbench by removing the theme service registration.
- SBP pricing fields are additive post meta; old carts keep working.
- EIT filters are additive; existing filter presets remain compatible.

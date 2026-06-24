# Implementation Plan: Portfolio Workbench

## Technical Approach

Use WordPress-native primitives and small namespaced classes. The next implementation phase is a context-first correction: the Workbench operating unit is a context, not a project ID.

- Theme:
  - PSR-4-like autoloader for `GuilhermePortfolio\`.
  - `Context` value object or equivalent array contract for `root`, `project:<id>`, and future `page:<id>`/`section:<slug>`.
  - `ContextResolver` that maps context IDs to storage, labels, capabilities, root/project payloads and missing states.
  - Root/frontpage context stored separately from projects and always available.
  - `gp_project` CPT as internal storage for nested project contexts, not as the universal Workbench root.
  - Project configuration through Workbench-native forms and WP-CLI, not through a visible standalone CPT UI.
  - Assignment metabox on Pages/posts/public CPTs.
  - Admin columns and project filter for Pages.
  - Frontpage setup service that uses WordPress APIs/options for `show_on_front`, `page_on_front`, and `page_for_posts`.
  - Page creator service that creates normal WordPress pages and attaches them to a chosen context.
  - Code-created page registry for page definitions that can be materialized through admin/WP-CLI.
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

Workbench context IDs:

- `root`
- `project:<id>`
- Future-compatible: `page:<id>`, `section:<slug>`

Root/frontpage context options:

- `gp_workbench_root_config`
- `gp_workbench_root_items`
- `gp_workbench_root_relations`
- `gp_workbench_root_suggestions`

WordPress frontpage/blog options:

- `show_on_front`
- `page_on_front`
- `page_for_posts`

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

Shared item/relation/suggestion shape:

- Stores must accept a resolved context object.
- Project context storage may remain post-meta backed.
- Root context storage should be option-backed with `autoload = false` where supported.
- UI and CLI payloads must expose `context_id` and `context_type`.

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

Code-created page registry:

- Registry entries must include stable slug, label, intended context, role, source, and optional default page status.
- Materialization must create a normal WordPress page through `wp_insert_post`.
- Setting as frontpage or posts page must remain explicit.

## Workbench Flows

### Root/frontpage default

1. Resolve `context=root`.
2. Read WordPress `page_on_front`.
3. If a front page exists, render it as root context with settings, items, relations, suggestions and providers.
4. If no front page exists, render root setup actions: use existing page or create new page.
5. Never require a `gp_project` record to render the Workbench.

### Frontpage setup

1. User selects existing page or creates a new page.
2. User explicitly chooses `Set as portfolio front page`.
3. Service updates `show_on_front=page` and `page_on_front=<page id>`.
4. Workbench redirects back to `context=root`.

### Blog split

1. Portfolio-wide blog uses WordPress `page_for_posts`.
2. Project-local blog index is a project context item/relation.
3. Project-local blog actions must not write `page_for_posts`.

### Context mutation

1. Admin forms submit `context_id`, not only `project_id`.
2. WP-CLI commands accept `--context=<context id>` or a positional context argument.
3. Stores resolve context before reading/writing.
4. Capability and nonce checks remain at the admin action boundary.

## Verification

- PHP lint on changed PHP files.
- Product verify scripts where available.
- `git diff --check`.
- Admin smoke: zero projects plus configured front page renders `context=root`.
- Admin smoke: no front page renders setup actions without project gate.
- Admin smoke: root settings can be saved without a project.
- WP-CLI smoke for root topology.
- WP-CLI smoke for existing page frontpage setup.
- WP-CLI smoke for new page creation with optional frontpage assignment.
- WP-CLI smoke proving project blog index does not mutate `page_for_posts`.
- WP-CLI smoke for `gp item`, `gp relation`, `gp suggestion`, and `gp topology`.
- WordPress admin visual smoke for the Workbench page.
- Final git status for root, `wordpress`, SBP, and EIT repositories.

## Rollback

- Disable Workbench by removing the theme service registration.
- Root options are additive; deleting Workbench options should not delete WordPress pages.
- Frontpage/posts-page assignment uses native WordPress options and can be changed through Settings > Reading.
- SBP pricing fields are additive post meta; old carts keep working.
- EIT filters are additive; existing filter presets remain compatible.

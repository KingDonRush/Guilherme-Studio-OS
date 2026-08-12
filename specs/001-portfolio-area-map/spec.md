# Feature Specification: Portfolio Area Map

**Feature Branch**: `codex/studio-os-v1`
**Created**: 2026-06-23
**Reset**: 2026-06-24
**Status**: Draft after legacy surface rejection
**Input**: Guilherme needs a WordPress-native admin portal that reduces cognitive load by grouping existing WordPress objects into arbitrary human areas such as Portfolio, Mina Forma, Ecommerce 3D, plugin cases, clients, or future project scopes.

## 1. Summary

Portfolio Area Map is a theme-owned wp-admin surface for seeing and opening the WordPress objects that belong to a human-defined area.

It is not a builder, diagram, scanner, provider dashboard, automation engine, or replacement for WordPress screens. It is a curated ownership map: Guilherme or Codex creates an area, attaches existing objects to it, and then uses the map to open the correct native WordPress, Elementor, Theme Builder, menu, taxonomy, post type, or admin screen.

The code does not need to understand what an area means. The meaning is human and operational. The system only stores the association and exposes safe shortcuts.

## 2. Context

One WordPress install will host multiple portfolio proofs and site structures. Pages, custom post types, templates, menus, cases, posts, and taxonomies will be mixed in native WordPress screens. That is powerful, but it creates avoidable mental overhead:

- Pages are listed globally.
- Post types are managed in separate menus.
- Elementor and Theme Builder are opened elsewhere.
- Menus, taxonomies, archives, and templates can affect one area without being visible near it.
- Codex needs a clean WP-CLI path to manage associations without editing raw meta.

The map exists to answer one question quickly: "What belongs to this area, and where do I click to edit it?"

## 3. Problem

Guilherme should not need to mentally remember which pages, content structures, templates, menus, or editor screens belong to Mina Forma, Portfolio, Ecommerce 3D, or any future client/project scope.

The admin surface must make that ownership visible at a glance and route editing to the native place where it already happens.

## 4. Goals

- Provide a WordPress-native `Mapa do Portfólio` admin page as a top-level wp-admin menu.
- Let Guilherme create arbitrary areas with title, slug, notes, status, and ordering.
- Let Guilherme attach existing WordPress objects or admin destinations to an area.
- Let Guilherme detach items without deleting the underlying WordPress object.
- Provide direct actions for native editing: normal edit, Elementor edit, view, admin list, add-new screen, Theme Builder, menus, taxonomies, and custom admin URLs when explicitly stored.
- Make one selected area visually dominant, with secondary groups for pages, content, presentation, navigation, and references.
- Keep Theme Builder useful but visually secondary: a set of links to the relevant native editor, not a recreated template manager.
- Keep the primary surface close to a calibrated one-screen wp-admin tool where possible.
- Prevent WordPress/core/plugin notices from pushing the map downward.
- Expose equivalent WP-CLI operations so Codex can maintain the same associations.
- Keep the implementation modular, PSR-4-like, low cognitive load, and free of hardcoded plugin-specific panels.

## 5. Non-Goals

- Do not build a page builder.
- Do not build a project management system.
- Do not create a file explorer, graph canvas, sitemap, relation engine, provider dashboard, or dynamic-tag scanner.
- Do not recreate Elementor, Theme Builder, menus, CPT creation, taxonomy editing, or page editing.
- Do not automatically infer ownership from scans.
- Do not fabricate clients, pages, cases, posts, pricing, or campaign data.
- Do not hardcode Simple Budget, Implementation Toolkit, LinkedIn, GitHub, or communication-provider panels into this surface.
- Do not make creating an area a prerequisite for seeing portfolio/root information if a default area can be shown.
- Do not let global WordPress/plugin notices define the layout height.

## 6. Users And Stakeholders

- **Guilherme**: uses the map to avoid mental navigation overhead while building portfolio proofs and client/project scopes.
- **Codex/AI agent**: uses WP-CLI to read and maintain the same area associations without raw database/meta edits.
- **Future maintainer**: needs a small, readable, WordPress-native feature boundary.
- **Portfolio visitor**: does not use this admin surface directly.

## 7. Scope

### Included

- Internal area records.
- Area item storage.
- Admin page under Appearance or the theme menu.
- Area switcher.
- Selected-area overview.
- Grouped item display.
- Attach existing item form.
- Detach item action.
- Native edit/open actions.
- Theme Builder destination item type.
- WP-CLI commands for areas and area items.
- Scoped admin CSS for a single-screen map layout.
- Notice containment for this screen only.
- Admin and WP-CLI smoke checks.

### Not Included

- Automatic scans.
- Provider suggestions.
- Relationship graph.
- New frontend rendering.
- Content generation.
- External network calls.
- Deep Elementor document parsing.
- Migration of real production data unless explicitly requested.

## 8. Product Principles

- **Area-first**: the unit is a human area, not a technical object.
- **Portal, not builder**: editing happens where WordPress already edits.
- **Manual ownership**: an item belongs to an area only after explicit attachment.
- **Detach is not delete**: removing association must not delete content.
- **Native WordPress trust**: use capabilities, nonces, admin URLs, buttons, tables, and notices correctly.
- **Visual hierarchy over listing density**: the selected area must be understood before individual rows matter.
- **No provider favoritism**: plugins may have their own screens, but this map stores generic destinations.
- **CLI parity**: every mutable association has a WP-CLI equivalent.
- **One-screen intent**: the default desktop target is a calibrated wp-admin viewport, not a scroll-first dashboard.

## 9. Main Flow

1. Guilherme opens `Mapa do Portfólio` in wp-admin.
2. The screen shows a default area, or the first created area.
3. Guilherme chooses another area from a compact side rail.
4. The selected area shows a clear title, status, short notes, and count badges.
5. The map groups attached items by simple operational category:
   - Pages
   - Content
   - Presentation
   - Navigation
   - Admin destinations
   - References
6. Guilherme clicks an item action such as `Editar`, `Elementor`, `Ver`, `Abrir`, or `Novo`.
7. WordPress opens the native destination for that item.
8. Guilherme can attach or detach items from the area.
9. Codex can perform the same area/item operations through WP-CLI.

## 10. User Scenarios

### Scenario 1: Mina Forma Implementation

Guilherme opens the map, selects `Mina Forma`, and immediately sees the associated Home, Sobre, Serviços, Contato, post type, taxonomy, menu, and Theme Builder destinations.

### Scenario 2: Portfolio Root

Guilherme selects `Portfolio` and sees the portfolio home page, plugin pages, case pages, blog entry points, and relevant admin destinations without searching through the global Pages list.

### Scenario 3: Theme Builder Shortcut

Guilherme sees `Header Mina Forma`, `Footer Mina Forma`, and `Archive Blog` under Presentation. Each item has a lightweight `Abrir` action that routes to the native Theme Builder/editor destination.

### Scenario 4: Codex Maintenance

Codex creates or updates the `Mina Forma` area through WP-CLI, attaches an existing page, attaches a post type destination, lists the area, and records the smoke result without direct meta edits.

## 11. Functional Requirements

- **FR-001**: The theme MUST provide a `Mapa do Portfólio` wp-admin page.
- **FR-002**: The system MUST store area records with title, slug, status, notes, and order.
- **FR-003**: The system MUST allow area creation, update, listing, and trash/removal through wp-admin.
- **FR-004**: The system MUST allow the same area operations through WP-CLI.
- **FR-005**: The system MUST allow existing WordPress posts/pages/CPT records to be attached to an area.
- **FR-006**: The system MUST allow post type, taxonomy, menu, Theme Builder destination, media, and custom admin URL references to be attached as area items.
- **FR-007**: The system MUST store item category, role, label, object type, object ID or URL, notes, and ordering.
- **FR-008**: The system MUST group area items visually by category.
- **FR-009**: The system MUST provide native action links where applicable: edit, Elementor, view, admin list, add new, open menu screen, open taxonomy screen, open Theme Builder destination, or open stored admin URL.
- **FR-010**: The system MUST detach area items without deleting the underlying WordPress object.
- **FR-011**: The admin UI MUST make the selected area the highest-weight visual object.
- **FR-012**: The admin UI MUST make Theme Builder shortcuts visible but visually secondary to the area's primary pages/content.
- **FR-013**: The admin UI MUST show concise badges and icon tips instead of long explanatory blocks.
- **FR-014**: The admin UI MUST not display hardcoded plugin integration panels.
- **FR-015**: The admin UI MUST not require a created area before it can display useful default portfolio/root orientation.
- **FR-016**: WP-CLI MUST expose area item list, attach, update, detach, and open-link/report operations.
- **FR-017**: Mutations MUST use WordPress APIs and must not rely on raw database writes.

## 12. Non-Functional Requirements

- **NFR-001**: Admin UI MUST follow native WordPress admin conventions.
- **NFR-002**: Admin UI MUST remain usable on standard desktop and tablet wp-admin widths.
- **NFR-003**: The primary layout SHOULD target the calibrated available wp-admin viewport height on desktop.
- **NFR-004**: Global WordPress/plugin notices MUST NOT push the map downward on this screen.
- **NFR-005**: Notice handling MUST be scoped to this screen and MUST NOT globally suppress notices elsewhere.
- **NFR-006**: Theme code MUST remain modular and namespaced with the existing PSR-4-like autoloader.
- **NFR-007**: No new admin class should become a god file; split storage, links, actions, rendering, CLI, and CSS responsibilities.
- **NFR-008**: All user input MUST be sanitized by type.
- **NFR-009**: All admin output MUST be escaped by context.
- **NFR-010**: All admin mutations MUST enforce capability checks and nonce checks.
- **NFR-011**: All WP-CLI mutations MUST use WordPress APIs.
- **NFR-012**: The feature MUST not require external network access.

## 13. Business Rules

- **BR-001**: Areas are arbitrary human scopes.
- **BR-002**: Area membership is explicit, not inferred.
- **BR-003**: Detaching an item removes only the association.
- **BR-004**: The map may link to native creation screens, but it does not own the lifecycle of created content.
- **BR-005**: Admin notices are operational signals, not layout anchors.
- **BR-006**: A plugin-specific capability can be represented only as a generic item or admin destination unless a separate spec approves deeper integration.
- **BR-007**: Codex should operate area associations through WP-CLI, not raw manual edits.

## 14. Data And Entities

### Area

- `id`
- `title`
- `slug`
- `status`
- `notes`
- `order`
- `created_at`
- `updated_at`

### Area Item

- `id`
- `area_id`
- `category`
- `role`
- `label`
- `type`
- `object_type`
- `object_id`
- `admin_url`
- `notes`
- `order`
- `created_at`
- `updated_at`

## 15. Item Types

- `post`
- `post_type`
- `taxonomy`
- `menu`
- `theme_builder`
- `media`
- `admin_url`
- `reference`
- `custom`

## 16. Admin Actions

- Create area.
- Update area.
- Trash or remove area.
- Attach existing item.
- Update item metadata.
- Detach item.
- Open native destination.

## 17. WP-CLI Interface

Expected commands:

```text
wp gp area list
wp gp area get <area>
wp gp area create <title> [--slug=<slug>] [--status=<status>] [--notes=<notes>]
wp gp area update <area> [--title=<title>] [--status=<status>] [--notes=<notes>] [--order=<n>]
wp gp area delete <area> [--force]

wp gp area-item list <area>
wp gp area-item attach <area> --type=<type> --label=<label> [--object-id=<id>] [--object-type=<type>] [--category=<category>] [--role=<role>] [--admin-url=<url>] [--notes=<notes>]
wp gp area-item update <area> <item-id> [...]
wp gp area-item detach <area> <item-id>
wp gp area-item links <area> <item-id>
```

## 18. Error Handling

- Missing capability: reject with a WordPress-native error.
- Invalid nonce: reject with a WordPress-native error.
- Unknown area: show a compact empty/error state with a create-area action.
- Unknown item: keep the area visible and show item-level failure.
- Invalid object ID: do not attach the item.
- Unsafe admin URL: reject external or non-admin URLs unless explicitly allowed by a future rule.
- Native destination unavailable: show the item without that action link.

## 19. Acceptance Criteria

### Area Visibility

**Given** at least one area exists
**When** Guilherme opens `Mapa do Portfólio`
**Then** the selected area is visually dominant and its attached items are grouped by category.

### No Builder Behavior

**Given** an area item points to an existing page
**When** Guilherme clicks `Editar` or `Elementor`
**Then** WordPress opens the native editor destination and the map does not attempt to edit the page inline.

### Theme Builder Shortcut

**Given** a Theme Builder destination is attached
**When** Guilherme clicks `Abrir`
**Then** WordPress opens the stored native admin destination for that template/surface.

### Safe Detach

**Given** a page is attached to an area
**When** Guilherme detaches the item
**Then** the association is removed and the page still exists.

### CLI Parity

**Given** Codex attaches an existing page through WP-CLI
**When** the admin map is opened
**Then** the item appears in the selected area with equivalent action links.

### Single-Screen Intent

**Given** a logged-in admin viewport with normal admin chrome
**When** the map loads on desktop
**Then** the primary selected-area composition fits the calibrated available height unless content volume requires intentional internal scrolling.

### Notice Containment

**Given** WordPress or plugins emit admin notices
**When** the map loads
**Then** those notices do not push the primary map downward or break the one-screen composition.

## 20. Decisions Taken

- The feature name is `Portfolio Area Map`.
- The top-level wp-admin menu label is `Portfólio`.
- The user-facing page title is `Mapa do Portfólio`.
- The operating unit is an arbitrary human area.
- The feature is a portal and ownership map, not a builder.
- Theme Builder support is a native shortcut, not a template-management clone.
- Plugin-specific integration panels are out of scope.
- `100vh` behavior must be calibrated inside wp-admin and protected from forced notices.

## 21. Open Questions

- Exact storage choice: hidden CPT versus option-backed registry.
- Exact menu placement: Appearance submenu versus theme top-level submenu.
- Whether the first implementation keeps compatibility with old records or intentionally starts fresh.
- Whether Theme Builder destinations are stored as explicit admin URLs or discovered from Elementor documents in a later feature.

## 22. Validation Plan

- PHP lint for changed theme files.
- WP-CLI smoke for area create/list/get/update/delete.
- WP-CLI smoke for item attach/list/update/detach.
- Admin render smoke for `Mapa do Portfólio`.
- Logged-in visual smoke at target desktop viewport.
- Notice containment smoke with a simulated admin notice.
- `git diff --check`.

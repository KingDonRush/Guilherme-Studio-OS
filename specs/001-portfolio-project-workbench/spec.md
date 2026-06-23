# Feature Specification: Portfolio Project Workbench

**Feature Branch**: `codex/studio-os-v1`
**Created**: 2026-06-23
**Status**: Draft for implementation
**Input**: Guilherme needs a WordPress-native place in the portfolio theme to create and manage portfolio projects, group Pages/posts/CPT entries by project, choose each project's content behavior, and bridge current plugins without mental bookkeeping.

## User Scenarios & Testing

### Scenario 1: Manage A Portfolio Project

Guilherme opens WordPress admin, goes to the theme-owned project area, creates a project, and chooses whether that project behaves as a one page, multi-page site, blog, catalog/CPT system, or hybrid implementation.

**Acceptance**:

- A `gp_project` record exists in wp-admin under Appearance/Theme context.
- The project stores a mode, enabled content surfaces, enabled plugin integrations, and notes.
- Saved values survive reload and are sanitized.

### Scenario 2: Stop Remembering Which Page Belongs To Which Project

Guilherme opens Pages and can see/filter which project each page belongs to instead of remembering this manually.

**Acceptance**:

- Pages, posts, and public post types can be assigned to a portfolio project.
- Pages list shows Project and Project Role columns.
- Pages list has a project filter.
- The assignment is stored as post meta and is queryable.

### Scenario 3: Bridge Plugins Without Tight Coupling

The theme can detect Simple Budget Plugin, Elementor Implementation Toolkit, and 3D Viewer for Elementor as optional integrations and expose their availability/project usage without hard dependencies.

**Acceptance**:

- Missing plugins do not fatal.
- Integration status is visible in the project edit surface.
- Integration usage is saved as project configuration.

### Scenario 4: Price And Price Range Are Real Budget Fields

Mina Forma can keep prices/ranges because SBP provides first-class price metadata and EIT can discover/filter those fields.

**Acceptance**:

- SBP registers price metadata for supported product post types.
- SBP cart rendering can display fixed price or price range.
- SBP WhatsApp payload includes price/range when available.
- EIT exposes SBP price fields in its filter catalog by hook, without requiring SBP classes directly.

## Requirements

### Functional Requirements

- **FR-001**: The theme MUST register a `gp_project` custom post type for portfolio project definitions.
- **FR-002**: The project edit screen MUST store a sanitized project mode from an allowlist.
- **FR-003**: The project edit screen MUST store enabled content surfaces: pages, posts, singles, custom post types, and CCT/filter-driven listings.
- **FR-004**: The project edit screen MUST store enabled integrations: Simple Budget, Implementation Toolkit, and 3D Viewer.
- **FR-005**: The theme MUST add a post metabox to assign supported content entries to one project and one project role.
- **FR-006**: Pages admin MUST show project assignment and role columns.
- **FR-007**: Pages admin MUST support filtering by project.
- **FR-008**: Theme admin code MUST use capability checks, nonces, typed sanitization, and escaped output.
- **FR-009**: Theme code MUST be modular and namespaced, with a PSR-4-like autoloader under the theme.
- **FR-010**: SBP MUST register price metadata for product post types and expose helper methods for fixed and ranged pricing.
- **FR-011**: SBP MUST render price/range in budget listing items when enabled.
- **FR-012**: SBP MUST include price/range in generated WhatsApp budget lines when available.
- **FR-013**: EIT MUST expose extension filters for external meta field providers.
- **FR-014**: SBP MUST use EIT extension filters to publish its price meta fields as filterable numeric fields.
- **FR-015**: SBP MUST let Guilherme define additional `__SBP` budget value fields from wp-admin without code changes.
- **FR-016**: SBP MUST expose the same admin settings and `__SBP` budget value fields through WP-CLI commands.
- **FR-017**: SBP custom budget value fields MUST be option-backed, bounded, sanitized, post-meta registered, and discoverable by EIT when marked filterable.
- **FR-018**: The theme project workbench MUST expose project creation, project configuration, and content assignment through WP-CLI using the same repository sanitization as wp-admin.
- **FR-019**: Project modes, surfaces, roles, and integration providers MUST be dynamic WordPress registries exposed through filters, not closed hardcoded lists.
- **FR-020**: Project integrations MUST use a normalized provider contract with provider slug, label, description, capabilities, status, source, and active state.
- **FR-021**: Project configuration and assignment metadata MUST be registered with WordPress meta APIs for editor, REST, and WP-CLI consistency.

### Non-Goals

- Build a full visual project builder.
- Replace Elementor page creation.
- Replace Implementation Toolkit CPT management.
- Add real Mina Forma content data.
- Send external messages.

## Key Entities

- **Portfolio Project**: Theme-owned WordPress object representing one portfolio implementation/case/site/plugin demo.
- **Project Assignment**: Post meta linking a Page/post/CPT item to one Portfolio Project and a role.
- **Project Mode**: Allowlisted behavior model: one page, multi-page site, blog, catalog/CPT, hybrid.
- **Project Registry**: WordPress-filtered catalog for modes, surfaces, roles, and integration providers.
- **Integration Provider**: Normalized provider declaration for optional plugin/product bridges, including capabilities and status.
- **SBP Pricing**: Post meta fields for display mode, fixed price, minimum price, maximum price, currency, unit, and label.
- **SBP Budget Value Field**: Option-backed field definition under the `__SBP` namespace that can add custom post meta such as material cost, area, package, or price drivers.
- **EIT External Field Contract**: Filters that let external plugins publish filterable fields into the Toolkit catalog.

## Security & Quality Constraints

- All admin mutation paths require capability and nonce checks.
- No direct plugin-to-plugin includes across product boundaries.
- Missing optional plugins must degrade to inactive status.
- Repeated configuration arrays are bounded and sanitized.
- Public output escapes all values.
- Code must stay modular; no new 800+ line admin god file.

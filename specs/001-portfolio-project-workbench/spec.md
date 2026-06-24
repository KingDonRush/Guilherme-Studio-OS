# Feature Specification: Portfolio Workbench

**Feature Branch**: `codex/studio-os-v1`
**Created**: 2026-06-23
**Updated**: 2026-06-23
**Status**: Draft for implementation
**Input**: Guilherme needs the portfolio theme to provide a WordPress-native, visual, manual workbench for curating portfolio context, projects, attached content, plugin provider data, and relations without creating a new builder.

## 1. Summary

Portfolio Workbench is a WordPress admin surface inside the portfolio theme that helps Guilherme see and curate how the portfolio front page, portfolio projects, pages, content structures, menus, Elementor presentation pieces, dynamic data, and plugin providers relate to each other.

The workbench is not a page builder, site builder, or automation engine. It is a manual aggregator and operating surface for existing WordPress objects and plugin-provided capabilities. Codex may automate work through WP-CLI, but the workbench itself must not silently mutate content based on scans or suggestions.

## 2. Context

The portfolio theme is the visible proof layer for Guilherme's WordPress work. The portfolio front page is the contextual root. It can contain arbitrary portfolio sections such as Featured Work, Plugin Pages, Demo Sites, and case groups. Some of those sections contain projects. Each project can itself contain pages, content structures, presentation templates, provider data, and manual relations.

Current WordPress admin surfaces make it easy to lose context:

- Pages are listed globally, without a clear project view.
- CPTs and CCTs may belong to a project but are managed elsewhere.
- Menus and Theme Builder templates can affect a project without being visible near the project.
- Plugin capabilities are available in separate plugin screens.
- Codex needs clean WP-CLI operations to manage this structure without editing raw meta manually.

## 3. Problem

Guilherme needs to stop mentally tracking which WordPress objects belong to which portfolio project and how those objects relate. He also needs Codex to operate the same project structure through WP-CLI without bypassing WordPress contracts.

The system should make portfolio composition visible and manageable without turning into a complex diagram, a filesystem explorer, a replacement for Elementor, or a new content model that competes with WordPress.

## 4. Goals

- Provide a WordPress-native workbench for curating portfolio projects and attached objects.
- Treat the portfolio front page as the contextual root of portfolio composition.
- Let projects act as manually curated groups of existing WordPress/plugin objects.
- Support project composition by categories: Entry, Pages, Content, Presentation, Data, Evidence, Providers, Suggestions, Relations.
- Let Guilherme attach existing pages, posts, CPT records, CCT records, menus, Theme Builder templates, dynamic data, and provider hints to a project.
- Let Guilherme mark manual relations between attached objects.
- Keep suggestions pending until explicitly marked or ignored.
- Make the UI visual, cozy, clean, modern, and native to wp-admin.
- Expose equivalent WP-CLI operations for Codex.
- Keep SBP price/range data and EIT filter catalog discoverable through provider contracts.

## 5. Non-Goals

- Do not build a full visual page builder.
- Do not replace Elementor page editing.
- Do not replace Implementation Toolkit CPT/CCT management.
- Do not automatically modify menus, templates, pages, CPTs, CCTs, or plugin settings from scans.
- Do not use a graph canvas, explorer tree, sitemap, flowchart, or diagram-heavy interface as the primary UI.
- Do not include the 3D Viewer provider in the first implementation beyond optional future provider readiness.
- Do not invent real Mina Forma data, pages, clients, or pricing values.
- Do not send external messages.

## 6. Users And Stakeholders

- **Guilherme**: manages portfolio projects, pages, plugin demos, and proof of implementation.
- **Codex/AI agent**: operates the same structure through WP-CLI and records relations without raw manual edits.
- **Future maintainer**: needs clear WordPress-native contracts and modular code.
- **Portfolio visitor**: indirectly benefits from a coherent portfolio, but does not use this admin surface.

## 7. Scope

### Included

- Theme-owned project records.
- Visual admin workbench for portfolio composition.
- Manual attachment of existing WordPress/plugin objects.
- Manual project relations.
- Pending suggestions inbox.
- Provider registry for plugin capabilities.
- WP-CLI commands for all mutable workbench operations.
- SBP pricing/value-field capability as provider data.
- EIT field catalog/provider capability as provider data.
- Registered WordPress meta for project configuration and assignments.

### Not Included

- Automatic project generation.
- Automatic menu/template mutation.
- Full Elementor Theme Builder parsing beyond provider-reported/manual records.
- Deep dynamic tag analysis in V1.
- 3D Viewer management in V1.
- Frontend rendering changes to the portfolio.

## 8. Product Principles

- **Manual-first**: scans and provider data may suggest, but only explicit action saves.
- **WordPress-native**: use CPTs, post meta, registered meta, admin screens, tables, buttons, notices, capabilities, and nonces.
- **Visual but not diagrammatic**: use category modules, badges, icons, chips, inspector panels, and compact relation strips instead of graphs or file trees.
- **CLI parity**: anything meaningful the UI can mutate must have a WP-CLI equivalent.
- **No raw bypass**: Codex must use WP-CLI or WordPress APIs, not ad hoc database/meta edits.
- **Provider contracts over tight coupling**: plugins expose capabilities; the theme does not include plugin internals directly.

## 9. Main Flow

1. Guilherme opens `Portfolio Workbench` in wp-admin.
2. The screen shows the current context: `Portfolio Front Page`.
3. Guilherme selects a project context, such as `Featured Work / Mina Forma`.
4. The workbench shows visual category modules:
   - Entry
   - Pages
   - Content
   - Presentation
   - Data
   - Evidence
5. Guilherme attaches existing objects or creates a normal WordPress page from the workbench.
6. Guilherme marks roles and relations manually.
7. Provider data and scan output appear as suggestions.
8. Suggestions remain pending until Guilherme/Codex marks or ignores them.
9. Codex can perform the same actions through WP-CLI.

## 10. User Scenarios And Testing

### Scenario 1: Curate Portfolio Front Page Context

Guilherme opens the workbench and sees the portfolio front page as the current root context, with sections such as Featured Work, Plugin Pages, and Demo Sites.

**Acceptance**:

- The UI shows `Portfolio Front Page` as the contextual root.
- The UI can show a selected nested context such as `Front Page / Featured Work / Mina Forma`.
- The UI does not represent the hierarchy as an explorer tree or graph.

### Scenario 2: Manage A Project As A Curated Group

Guilherme selects `Mina Forma` and sees attached pages, content structures, presentation objects, data providers, and evidence grouped by category.

**Acceptance**:

- The project has a persistent record.
- Attached items are grouped into visual category modules.
- Each item shows type badges such as page, CPT, CCT, menu, template, provider, confirmed, suggested, inherited, or manual.

### Scenario 3: Attach Existing WordPress Objects

Guilherme attaches an existing page, CPT, CCT, menu, template, or provider datum to a project without creating a new builder object.

**Acceptance**:

- The attachment stores a project association and item role/state.
- The original WordPress object remains managed by its normal WordPress/plugin surface.
- The same operation is available through WP-CLI.

### Scenario 4: Mark Manual Relations

Guilherme marks that one item relates to another, such as `Primary Menu -> links to -> Gallery` or `Mina Projects CPT -> feeds -> Mina Archive`.

**Acceptance**:

- Relations are explicit records, not inferred as confirmed facts.
- Relations can be listed, edited, removed, marked confirmed, or ignored.
- Relations can be created through UI and WP-CLI.

### Scenario 5: Review Pending Suggestions

A scan or provider reports a possible relation. Guilherme reviews it and marks or ignores it.

**Acceptance**:

- Suggested relations do not alter content automatically.
- Suggested relations have provider/source metadata.
- Suggested relations can be promoted to confirmed relations.
- Ignored suggestions no longer appear as pending.

### Scenario 6: Use Provider Data Without Tight Coupling

SBP exposes price/range fields and EIT exposes filter/catalog data as provider capabilities. The workbench can show those provider hints without including plugin internals.

**Acceptance**:

- Provider definitions include provider slug, label, description, capabilities, active state, status, and source.
- Missing providers do not fatal.
- Provider data can be shown as available, suggested, confirmed, missing, or ignored.

### Scenario 7: Codex Operates Through WP-CLI

Codex creates/updates a project, attaches pages/CPTs/provider data, marks relations, reviews suggestions, and reads topology using WP-CLI commands.

**Acceptance**:

- UI mutation paths have equivalent WP-CLI commands.
- WP-CLI commands call WordPress APIs and shared sanitization.
- No successful workflow requires raw SQL or direct manual post meta edits.

## 11. Functional Requirements

- **FR-001**: The theme MUST provide a `Portfolio Workbench` wp-admin surface.
- **FR-002**: The workbench MUST treat the portfolio front page as the root contextual object.
- **FR-003**: The theme MUST register a project record type for curated portfolio projects.
- **FR-004**: A project MUST be able to represent a portfolio case, plugin page, demo site, product proof, client-like demo, or arbitrary portfolio group.
- **FR-005**: A project MUST be able to store a mode, role, parent context, status, notes, and enabled categories.
- **FR-006**: Project modes, surfaces, roles, categories, and providers MUST be registered through dynamic WordPress registries or filters.
- **FR-007**: The workbench MUST support the following first-class visual categories: Entry, Pages, Content, Presentation, Data, Evidence, Providers, Suggestions, Relations.
- **FR-008**: The workbench MUST allow existing WordPress pages to be attached to a project.
- **FR-009**: The workbench MUST allow existing posts and public CPT records to be attached to a project.
- **FR-010**: The workbench MUST allow CCT-like/provider records to be represented as attached project items when exposed by a provider.
- **FR-011**: The workbench MUST allow menus and menu items to be represented as project items or suggestions.
- **FR-012**: The workbench MUST allow Theme Builder-related objects to be represented as project items or suggestions when manually attached or provider-reported.
- **FR-013**: The workbench MUST allow dynamic data/provider fields to be represented as project items or suggestions.
- **FR-014**: The workbench MUST allow Guilherme/Codex to create normal WordPress pages from the workbench and immediately attach them to a project.
- **FR-015**: The workbench MUST allow manual relations between project items.
- **FR-016**: A relation MUST include source, relation type, target, provider/source, state, and notes.
- **FR-017**: Relation states MUST include at least suggested, confirmed, ignored, and needs_review.
- **FR-018**: Suggestions MUST remain pending until explicitly marked or ignored.
- **FR-019**: The primary UI MUST be visual and category-based, using icons, badges, chips, inspector details, compact relation strips, and hover tips.
- **FR-020**: The primary UI MUST NOT be an explorer tree, graph canvas, flowchart, sitemap, or listing-heavy database screen.
- **FR-021**: Tips MUST be embedded in icons, category labels, badges, compact hover tooltips, and small inline hints instead of long explanatory text.
- **FR-022**: The UI MUST include a selected-item inspector for context, metadata, and actions.
- **FR-023**: The UI MUST include a suggestion inbox.
- **FR-024**: The UI MUST include a compact recent relations area.
- **FR-025**: A full relations list MAY exist in a secondary tab, but MUST NOT dominate the overview screen.
- **FR-026**: The theme MUST expose WP-CLI commands for project creation, updates, attachment, detachment, relations, suggestions, and topology reads.
- **FR-027**: WP-CLI commands MUST use shared WordPress APIs and sanitization logic.
- **FR-028**: SBP MUST expose price/range/value-field capability to the workbench through provider-compatible data.
- **FR-029**: EIT MUST expose filter/catalog capability to the workbench through provider-compatible data.
- **FR-030**: The 3D Viewer MUST remain out of V1 management scope, but the provider model MUST allow future registration.

## 12. Non-Functional Requirements

- **NFR-001**: Admin UI MUST follow native WordPress admin conventions.
- **NFR-002**: Admin UI MUST remain usable on standard desktop and tablet wp-admin widths.
- **NFR-003**: Theme code MUST remain modular and namespaced with the existing PSR-4-like autoloader.
- **NFR-004**: No new admin class should become a large god file; new responsibilities MUST be split by registry, storage, UI, CLI, provider, or relation service as needed.
- **NFR-005**: All user input MUST be sanitized by type.
- **NFR-006**: All admin output MUST be escaped by context.
- **NFR-007**: All admin mutation paths MUST enforce capability checks and nonce checks.
- **NFR-008**: All WP-CLI mutation paths MUST enforce WordPress capability assumptions where relevant and use WordPress APIs.
- **NFR-009**: Provider failures MUST degrade gracefully.
- **NFR-010**: The workbench MUST not require external network access.

## 13. Business Rules

- **BR-001**: The portfolio front page is the default root context.
- **BR-002**: A project is a curated group of existing or newly created WordPress/plugin objects.
- **BR-003**: A project does not own the lifecycle of attached WordPress/plugin objects unless explicitly created through the workbench.
- **BR-004**: Suggestions are not facts until marked.
- **BR-005**: Provider data is read-only until attached or marked by an explicit action.
- **BR-006**: Codex should operate project structure through WP-CLI, not raw manual edits.
- **BR-007**: 3D Viewer is deferred from V1 provider operations.

## 14. Inputs And Outputs

### Inputs

- Existing WordPress pages, posts, CPT records, menus, templates, and media references.
- Existing provider data from SBP and EIT.
- Manual project configuration.
- Manual relation records.
- Pending suggestion records.
- WP-CLI commands from Codex or Guilherme.

### Outputs

- Project overview.
- Attached item groups.
- Manual relations.
- Pending suggestions.
- Provider capability/status display.
- WP-CLI-readable topology report.

## 15. Data And Entities

- **Portfolio Context**: root or section-level context such as front page, Featured Work, Plugin Pages, Demo Sites.
- **Portfolio Project**: curated project/group inside the portfolio context.
- **Project Item**: attached object reference. Can represent page, post, CPT record, CCT/provider record, menu, menu item, template, dynamic field, asset, link, or evidence.
- **Project Relation**: manual or suggested relation between two project items.
- **Provider**: plugin/theme/core source that exposes capabilities or suggested data.
- **Suggestion**: pending proposed attachment or relation.
- **Badge**: UI label conveying item type, state, source, or behavior.

## 16. System States

### Project States

- draft
- active
- curated
- archived

### Item States

- attached
- suggested
- confirmed
- ignored
- missing
- inherited

### Relation States

- suggested
- confirmed
- ignored
- needs_review

## 17. Error Handling

- If an attached object no longer exists, show it as missing and allow detach/remove.
- If a provider is inactive, show provider status as missing/inactive without fatal.
- If a WP-CLI command receives an invalid project ID, return a stable non-zero exit code and useful error.
- If a WP-CLI command receives an invalid object reference, reject the mutation.
- If a relation references missing items, keep the relation visible with a missing state until resolved.
- If a scan fails, store no confirmed changes and return/report a failed suggestion scan.

## 18. Edge Cases

- A page can belong to more than one portfolio context only if explicitly supported; V1 should assume one primary project attachment.
- A menu can link to pages from multiple projects.
- A Theme Builder template can affect multiple projects.
- A provider can be active but return no usable data.
- A suggested relation can become stale when the target object is deleted.
- A project can exist without pages.
- A project can be a plugin page without CPT/CCT structures.
- A project can be content-structure-heavy with few normal pages.

## 19. Integrations And Dependencies

- **WordPress Core**: CPTs, post meta, menus, admin UI, WP-CLI, pages/posts, capabilities, nonces.
- **Portfolio Theme**: workbench UI, project records, item/relation storage, provider registry.
- **Simple Budget Plugin**: price/range/value-field provider capability.
- **Elementor Implementation Toolkit**: CPT/CCT/filter/catalog provider capability.
- **Elementor Theme Builder**: manually attached or provider-reported presentation context.
- **3D Viewer**: deferred from V1 operations.

## 20. Constraints

- Must run locally inside the current WordPress runtime.
- Must preserve existing WordPress editing flows.
- Must not introduce a JS framework unless separately approved.
- Must avoid heavy custom app-shell UI.
- Must keep UI tips compact and embedded.
- Must expose clean WP-CLI operations before relying on Codex automation.

## 21. Acceptance Criteria

### AC-001: Root Context

**Given** the workbench is opened in wp-admin
**When** no project is selected
**Then** the workbench shows `Portfolio Front Page` as the root context.

### AC-002: Visual Category Overview

**Given** a project has attached items
**When** Guilherme opens the project overview
**Then** attached items are grouped into visual categories with icons, badges, and compact chips.

### AC-003: No Diagram Primary UI

**Given** the overview screen is loaded
**When** the primary project structure is displayed
**Then** it is not shown as a graph, explorer tree, flowchart, sitemap, or connector-line diagram.

### AC-004: Manual Attachment

**Given** an existing WordPress page exists
**When** Guilherme attaches it to a project
**Then** the page appears in the project category selected by Guilherme and stores a sanitized project association.

### AC-005: Manual Relation

**Given** two project items exist
**When** Guilherme marks a relation between them
**Then** the relation is stored with source, relation type, target, provider/source, state, and notes.

### AC-006: Pending Suggestion

**Given** a scan or provider reports a possible relation
**When** the report is shown
**Then** it appears as a pending suggestion and does not change content automatically.

### AC-007: Provider Contract

**Given** SBP or EIT is active
**When** the workbench reads providers
**Then** each provider reports normalized slug, label, description, capabilities, status, source, and active state.

### AC-008: WP-CLI Parity

**Given** an operation can mutate projects, attachments, relations, or suggestions in the UI
**When** Codex performs the same operation through WP-CLI
**Then** the result is equivalent and uses the same sanitization/storage contract.

### AC-009: CLI-First Agent Operation

**Given** Codex needs to organize a project
**When** Codex needs to create/attach/mark relations
**Then** Codex can complete the workflow through WP-CLI without raw meta edits.

### AC-010: Missing Provider

**Given** a provider plugin is inactive
**When** the workbench loads
**Then** the provider appears as missing/inactive and the screen does not fatal.

## 22. Success Metrics

- Guilherme can understand project composition without opening global Pages/CPT screens first.
- Codex can create and organize a project through WP-CLI without raw manual edits.
- Suggestions remain pending until explicitly marked.
- UI overview is visually scannable without a diagram or giant table.
- SBP price fields and EIT filter/catalog data can appear as provider hints.
- Missing providers do not break the admin screen.

## 23. Risks

- The UI can drift back into diagram/explorer/list-heavy shape.
- Provider contracts can become too broad if every plugin exposes arbitrary data.
- Manual relations can become noisy without states and pruning.
- Theme Builder/dynamic tag detection can be brittle if treated as automatic truth.
- WP-CLI can become inconsistent if commands are added ad hoc per plugin.

## 24. Decisions Taken

- The workbench is manual-first.
- The front page is the root portfolio context.
- Projects are nested curated groups, not the universal root.
- The UI must be visual/category-based, not diagram-based.
- Suggestions are pending by default.
- Codex automation must go through WP-CLI.
- 3D Viewer is deferred from V1 operations.
- SBP and EIT are relevant providers for V1.

## 25. Assumptions

- WordPress admin is the correct host surface.
- CPT + registered meta is the correct foundation for project records.
- Manual relation records are enough for V1; complex auto-detection can wait.
- Provider registries can represent SBP/EIT data without tight coupling.
- Existing pages/CPTs/CCTs/templates remain managed by their native surfaces.

## 26. Open Questions

- Should project items be stored as post meta on source objects, a project-owned relation array, a dedicated internal CPT, or a hybrid?
- Should a page be allowed to belong to multiple projects?
- Which Elementor Theme Builder data can be read safely without brittle parsing?
- What is the minimum EIT WP-CLI surface needed for clean Codex operation?
- What is the minimum SBP WP-CLI surface beyond settings/value fields?

## 27. Future Out Of Scope

- Visual graph view as optional secondary analysis.
- Automatic Theme Builder relation detection.
- Automatic dynamic tag dependency parsing.
- 3D Viewer provider management.
- Client project management beyond portfolio curation.
- Bulk migration/import from existing portfolio pages.

## 28. Validation Plan

- PHP lint for changed theme/plugin files.
- `git diff --check`.
- WP-CLI smoke for project create/update/get/delete.
- WP-CLI smoke for attach/detach item.
- WP-CLI smoke for relation add/list/update/remove.
- WP-CLI smoke for suggestion add/list/mark/ignore.
- WP-CLI smoke for topology report.
- Admin browser smoke for overview screen.
- Admin browser smoke for hover tips/badges.
- Admin browser smoke for missing provider state.
- `npm run studio -- --json validate`.
- `npm run studio -- --json wordpress health`.

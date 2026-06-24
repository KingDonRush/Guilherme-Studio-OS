# Feature Specification: Portfolio Workbench

**Feature Branch**: `codex/studio-os-v1`
**Created**: 2026-06-23
**Updated**: 2026-06-24
**Status**: Draft for context-first correction
**Input**: Guilherme needs the portfolio theme to provide a WordPress-native, visual, manual workbench for curating the portfolio front page, nested projects, attached content, plugin provider data, generated pages, blog structures and relations without creating a new builder.

## 1. Summary

Portfolio Workbench is a WordPress admin surface inside the portfolio theme that helps Guilherme see and curate how the portfolio front page, portfolio projects, pages, code-created pages, content structures, menus, Elementor presentation pieces, dynamic data, blog structures, and plugin providers relate to each other.

The workbench is not a page builder, site builder, or automation engine. It is a manual aggregator and operating surface for existing WordPress objects, pages created through WordPress APIs, and plugin-provided capabilities. Codex may automate work through WP-CLI, but the workbench itself must not silently mutate content based on scans or suggestions.

The root context is the portfolio front page. Projects are nested contexts under that root, not a precondition for using the workbench.

## 2. Context

The portfolio theme is the visible proof layer for Guilherme's WordPress work. The portfolio front page is the contextual root. It can contain arbitrary portfolio sections such as Featured Work, Plugin Pages, Demo Sites, blog entry points, generated pages, and case groups. Some of those sections contain projects. Each project can itself contain pages, content structures, presentation templates, provider data, project-specific blog emulation, and manual relations.

The front page must be configurable as a first-class context, with a configuration surface as rich as project contexts where appropriate. Guilherme can use an existing page as the front page, create a new page and set it as the front page, or later attach pages created through code/CLI as root or project items.

Current WordPress admin surfaces make it easy to lose context:

- Pages are listed globally, without a clear project view.
- CPTs and CCTs may belong to a project but are managed elsewhere.
- Menus and Theme Builder templates can affect a project without being visible near the project.
- Plugin capabilities are available in separate plugin screens.
- Codex needs clean WP-CLI operations to manage this structure without editing raw meta manually.

## 3. Problem

Guilherme needs to stop mentally tracking which WordPress objects belong to the portfolio root, which objects belong to nested portfolio projects, and how those objects relate. He also needs Codex to operate the same context structure through WP-CLI without bypassing WordPress contracts.

The system should make portfolio composition visible and manageable without turning into a complex diagram, a filesystem explorer, a replacement for Elementor, or a fake project model that competes with the portfolio front page.

## 4. Goals

- Provide a WordPress-native workbench for curating the portfolio root, portfolio projects, and attached objects.
- Treat the portfolio front page as the configurable contextual root of portfolio composition.
- Allow root/frontpage configuration without requiring any project records.
- Let Guilherme choose an existing page or create a new page and set it as the portfolio front page.
- Let projects act as manually curated groups of existing WordPress/plugin objects.
- Support context composition by categories: Entry, Pages, Content, Presentation, Data, Evidence, Providers, Suggestions, Relations.
- Let Guilherme attach existing pages, code-created pages, posts, CPT records, CCT records, menus, Theme Builder templates, dynamic data, and provider hints to the root or to a project.
- Separate portfolio-wide blog configuration from project-local blog emulation.
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
- Do not create a fake `Home` project just to compensate for missing root-context support.
- Do not make project creation a precondition for viewing or configuring the portfolio front page.
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

- Context-first Workbench read and mutation model.
- Configurable portfolio root/frontpage context.
- Existing-page and new-page frontpage setup.
- Theme-owned project records as nested contexts.
- Visual admin workbench for portfolio composition.
- Manual attachment of existing WordPress/plugin objects.
- Manual root/project relations.
- Pending suggestions inbox.
- Provider registry for plugin capabilities.
- WP-CLI commands for all mutable workbench operations.
- WP-CLI commands for frontpage setup and context topology.
- Registration and attachment of pages created through code/CLI.
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
- Replacing WordPress global `page_for_posts` with a project-local blog setting.

## 8. Product Principles

- **Context-first**: `root`, `project:<id>`, and future contexts are the operating unit. `project_id` is an implementation detail only for project contexts.
- **Manual-first**: scans and provider data may suggest, but only explicit action saves.
- **WordPress-native**: use CPTs, post meta, registered meta, admin screens, tables, buttons, notices, capabilities, and nonces.
- **Visual but not diagrammatic**: use category modules, badges, icons, chips, inspector panels, and compact relation strips instead of graphs or file trees.
- **CLI parity**: anything meaningful the UI can mutate must have a WP-CLI equivalent.
- **No raw bypass**: Codex must use WP-CLI or WordPress APIs, not ad hoc database/meta edits.
- **Provider contracts over tight coupling**: plugins expose capabilities; the theme does not include plugin internals directly.
- **No fake roots**: the root context is the WordPress portfolio front page, not a special project post.

## 9. Main Flow

1. Guilherme opens `Portfolio Workbench` in wp-admin.
2. The screen shows the current context: `Portfolio Front Page`, even when there are zero projects.
3. If no front page exists or Guilherme wants to change it, he chooses an existing page or creates a new normal WordPress page.
4. Guilherme can use a prominent `Set as portfolio front page` action for a selected or newly created page.
5. Guilherme can configure the root/frontpage context: mode, operational status, notes, surfaces, providers, attached items, relations, suggestions, and evidence.
6. Guilherme selects or creates a nested project context, such as `Featured Work / Mina Forma`.
7. The workbench shows visual category modules:
   - Entry
   - Pages
   - Content
   - Presentation
   - Data
   - Evidence
8. Guilherme attaches existing objects or creates a normal WordPress page from the workbench.
9. Guilherme chooses whether a page belongs to the root, a project, the portfolio blog, or a project-local blog index.
10. Guilherme marks roles and relations manually.
11. Provider data and scan output appear as suggestions.
12. Suggestions remain pending until Guilherme/Codex marks or ignores them.
13. Codex can perform the same actions through WP-CLI.

## 10. User Scenarios And Testing

### Scenario 1: Curate Portfolio Front Page Context

Guilherme opens the workbench and sees the portfolio front page as the current root context, with sections such as Featured Work, Plugin Pages, and Demo Sites.

**Acceptance**:

- The UI shows `Portfolio Front Page` as the contextual root.
- The root context is visible even when no `gp_project` records exist.
- The root context has its own configurable settings and attached items.
- The UI can show a selected nested context such as `Front Page / Featured Work / Mina Forma`.
- The UI does not represent the hierarchy as an explorer tree or graph.

### Scenario 1A: Choose Or Create The Front Page

Guilherme decides whether the portfolio front page should use an existing WordPress page or a newly created page.

**Acceptance**:

- The UI offers `Use existing page` and `Create new page` paths.
- A selected existing page can be set as the front page through an explicit, prominent action.
- A newly created page can be set as the front page during creation or immediately after creation.
- Setting the front page updates WordPress core options through WordPress APIs.
- The workbench returns to `context=root` after front page setup.

### Scenario 1B: Separate Portfolio Blog From Project Blog

Guilherme may create a blog for the whole portfolio while also emulating blog-like structures inside individual projects.

**Acceptance**:

- A page can be set as the portfolio posts page only through an explicit portfolio-wide action.
- A project-local blog index is attached as a project item/relation and does not overwrite WordPress `page_for_posts`.
- UI labels distinguish `portfolio posts page`, `project blog index`, `project page`, and `front page`.

### Scenario 2: Manage A Project As A Curated Group

Guilherme selects `Mina Forma` and sees attached pages, content structures, presentation objects, data providers, and evidence grouped by category.

**Acceptance**:

- The project has a persistent record.
- Attached items are grouped into visual category modules.
- Each item shows type badges such as page, CPT, CCT, menu, template, provider, confirmed, suggested, inherited, or manual.

### Scenario 3: Attach Existing WordPress Objects

Guilherme attaches an existing page, code-created page, CPT, CCT, menu, template, or provider datum to the root or to a project without creating a new builder object.

**Acceptance**:

- The attachment stores a context association and item role/state.
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

Codex configures the root, creates/updates a project, creates pages, attaches pages/CPTs/provider data, marks relations, reviews suggestions, and reads topology using WP-CLI commands.

**Acceptance**:

- UI mutation paths have equivalent WP-CLI commands.
- WP-CLI commands call WordPress APIs and shared sanitization.
- No successful workflow requires raw SQL or direct manual post meta edits.

## 11. Functional Requirements

- **FR-001**: The theme MUST provide a `Portfolio Workbench` wp-admin surface.
- **FR-002**: The workbench MUST treat the portfolio front page as the root contextual object and MUST render it without requiring a project.
- **FR-003**: The theme MUST register a project record type for curated portfolio projects.
- **FR-004**: A project MUST be able to represent a portfolio case, plugin page, demo site, product proof, client-like demo, or arbitrary portfolio group.
- **FR-005**: A project MUST be able to store a mode, role, parent context, status, notes, and enabled categories.
- **FR-006**: Context modes, surfaces, roles, categories, and providers MUST be registered through dynamic WordPress registries or filters.
- **FR-007**: The workbench MUST support the following first-class visual categories: Entry, Pages, Content, Presentation, Data, Evidence, Providers, Suggestions, Relations.
- **FR-008**: The workbench MUST allow existing WordPress pages to be attached to the root or to a project.
- **FR-009**: The workbench MUST allow existing posts and public CPT records to be attached to the root or to a project.
- **FR-010**: The workbench MUST allow CCT-like/provider records to be represented as attached context items when exposed by a provider.
- **FR-011**: The workbench MUST allow menus and menu items to be represented as context items or suggestions.
- **FR-012**: The workbench MUST allow Theme Builder-related objects to be represented as context items or suggestions when manually attached or provider-reported.
- **FR-013**: The workbench MUST allow dynamic data/provider fields to be represented as context items or suggestions.
- **FR-014**: The workbench MUST allow Guilherme/Codex to create normal WordPress pages from the workbench and immediately attach them to a chosen context.
- **FR-015**: The workbench MUST allow manual relations between context items.
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
- **FR-026**: The theme MUST expose WP-CLI commands for context reads, root configuration, frontpage setup, project creation, project updates, attachment, detachment, relations, suggestions, and topology reads.
- **FR-027**: WP-CLI commands MUST use shared WordPress APIs and sanitization logic.
- **FR-028**: SBP MUST expose price/range/value-field capability to the workbench through provider-compatible data.
- **FR-029**: EIT MUST expose filter/catalog capability to the workbench through provider-compatible data.
- **FR-030**: The 3D Viewer MUST remain out of V1 management scope, but the provider model MUST allow future registration.
- **FR-031**: The root/frontpage context MUST support configuration comparable to project configuration where relevant: mode, operational status, notes, enabled surfaces, providers, attached items, relations, suggestions, and evidence.
- **FR-032**: The workbench MUST support selecting an existing WordPress page and setting it as the portfolio front page.
- **FR-033**: The workbench MUST support creating a normal WordPress page and optionally setting it as the portfolio front page.
- **FR-034**: Setting the portfolio front page MUST update WordPress core options `show_on_front` and `page_on_front` through WordPress APIs.
- **FR-035**: The workbench MUST support setting a portfolio-wide posts page through an explicit separate action that updates `page_for_posts`.
- **FR-036**: A project-local blog index MUST be modeled as a project item/relation and MUST NOT update WordPress `page_for_posts`.
- **FR-037**: Pages created by code/CLI MUST be representable as attachable Workbench items with source metadata.
- **FR-038**: The UI MUST make frontpage actions prominent when the selected or created object is a WordPress page.
- **FR-039**: The root context MUST be represented as `root` in UI payloads and CLI commands.
- **FR-040**: Project contexts MUST be represented as `project:<id>` in UI payloads and CLI commands.

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
- **NFR-011**: A zero-project WordPress install with a front page MUST still render a useful Workbench screen.
- **NFR-012**: Context handling MUST avoid branching explosions; shared storage and view services should accept a context object rather than duplicating root/project code paths.

## 13. Business Rules

- **BR-001**: The portfolio front page is the default root context.
- **BR-002**: The root/frontpage context is configurable and operable even when no project exists.
- **BR-003**: A project is a curated group of existing or newly created WordPress/plugin objects nested under the portfolio root.
- **BR-004**: A project does not own the lifecycle of attached WordPress/plugin objects unless explicitly created through the workbench.
- **BR-005**: Suggestions are not facts until marked.
- **BR-006**: Provider data is read-only until attached or marked by an explicit action.
- **BR-007**: Codex should operate Workbench context through WP-CLI, not raw manual edits.
- **BR-008**: 3D Viewer is deferred from V1 provider operations.
- **BR-009**: A page can be assigned to root/frontpage, portfolio posts page, project page, or project blog index only through explicit actions with distinct labels.
- **BR-010**: Setting a project-local blog index must not update the global WordPress posts page.
- **BR-011**: A fake project must never be created only to represent Home/root.

## 14. Inputs And Outputs

### Inputs

- Existing WordPress pages, posts, CPT records, menus, templates, and media references.
- Existing WordPress front page and posts page options.
- Pages created through Workbench, WP-CLI, or code registration.
- Existing provider data from SBP and EIT.
- Manual root/frontpage configuration.
- Manual project configuration.
- Manual relation records.
- Pending suggestion records.
- WP-CLI commands from Codex or Guilherme.

### Outputs

- Root/frontpage overview.
- Project overview.
- Attached item groups.
- Manual relations.
- Pending suggestions.
- Provider capability/status display.
- WP-CLI-readable topology report.

## 15. Data And Entities

- **Workbench Context**: the operating scope for Workbench data and actions. V1 contexts are `root` and `project:<id>`. Future contexts can include `page:<id>` or `section:<slug>`.
- **Portfolio Root / Frontpage Context**: the root Workbench context backed by the WordPress portfolio front page and root-level configuration.
- **Portfolio Project**: curated project/group inside the portfolio context.
- **Context Item**: attached object reference. Can represent page, code-created page, post, CPT record, CCT/provider record, menu, menu item, template, dynamic field, asset, link, project, blog index, or evidence.
- **Context Relation**: manual or suggested relation between two context items.
- **Frontpage Setup**: action flow that selects or creates a WordPress page and stores it as the portfolio front page.
- **Portfolio Posts Page**: WordPress global posts page stored in `page_for_posts`.
- **Project Blog Index**: project-local page/item that emulates a blog index without touching `page_for_posts`.
- **Code-Created Page Definition**: registered page intent created by code/CLI and materialized through WordPress page APIs.
- **Provider**: plugin/theme/core source that exposes capabilities or suggested data.
- **Suggestion**: pending proposed attachment or relation.
- **Badge**: UI label conveying item type, state, source, or behavior.

## 16. System States

### Context Types

- root
- project
- page
- section

### Context States

- active
- draft
- needs_setup
- missing_frontpage
- archived

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
- If no front page is configured, render root context in `needs_setup` state with existing-page and new-page actions.
- If the configured front page was deleted or is not readable, render root context in `missing_frontpage` state and allow replacement.
- If a provider is inactive, show provider status as missing/inactive without fatal.
- If a WP-CLI command receives an invalid context or project ID, return a stable non-zero exit code and useful error.
- If a WP-CLI command receives an invalid object reference, reject the mutation.
- If a relation references missing items, keep the relation visible with a missing state until resolved.
- If a scan fails, store no confirmed changes and return/report a failed suggestion scan.
- If setting the front page fails, do not attach the page as confirmed frontpage; return a failure notice and keep the page as a normal page.

## 18. Edge Cases

- A page can belong to more than one portfolio context only if explicitly supported; V1 should assume one primary project attachment.
- The portfolio root can exist before any project exists.
- A front page can be missing, draft, private, or published; each state should be visible.
- A newly created page can be attached without becoming the front page.
- A newly created page can become the front page in the same flow only through an explicit checkbox/action.
- A portfolio posts page and a project blog index can both exist; they are different concepts.
- A menu can link to pages from multiple projects.
- A Theme Builder template can affect multiple projects.
- A provider can be active but return no usable data.
- A suggested relation can become stale when the target object is deleted.
- A project can exist without pages.
- A project can be a plugin page without CPT/CCT structures.
- A project can be content-structure-heavy with few normal pages.

## 19. Integrations And Dependencies

- **WordPress Core**: CPTs, options, post meta, menus, admin UI, WP-CLI, pages/posts, `show_on_front`, `page_on_front`, `page_for_posts`, capabilities, nonces.
- **Portfolio Theme**: workbench UI, context resolver, root config, project records, item/relation storage, provider registry.
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
- Must not require creating a project before configuring the portfolio root/frontpage.

## 21. Acceptance Criteria

### AC-001: Root Context

**Given** the workbench is opened in wp-admin
**When** no project is selected
**Then** the workbench shows `Portfolio Front Page` as the root context, including root settings and root items.

### AC-001A: Zero Project Root

**Given** WordPress has a configured front page
**And** there are zero `gp_project` records
**When** Guilherme opens Portfolio Workbench
**Then** the workbench renders the root/frontpage context instead of a project creation gate.

### AC-002: Visual Category Overview

**Given** a project has attached items
**When** Guilherme opens the project overview
**Then** attached items are grouped into visual categories with icons, badges, and compact chips.

### AC-002A: Root Category Overview

**Given** the root/frontpage context has attached items
**When** Guilherme opens the root overview
**Then** attached items are grouped into visual categories with icons, badges, and compact chips.

### AC-003: No Diagram Primary UI

**Given** the overview screen is loaded
**When** the primary context structure is displayed
**Then** it is not shown as a graph, explorer tree, flowchart, sitemap, or connector-line diagram.

### AC-004: Manual Attachment

**Given** an existing WordPress page exists
**When** Guilherme attaches it to the root or a project
**Then** the page appears in the selected context category and stores a sanitized context association.

### AC-005: Manual Relation

**Given** two context items exist
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

**Given** an operation can mutate root/project contexts, attachments, relations, or suggestions in the UI
**When** Codex performs the same operation through WP-CLI
**Then** the result is equivalent and uses the same sanitization/storage contract.

### AC-008A: Root CLI Parity

**Given** an operation can mutate the root/frontpage context in the UI
**When** Codex performs the same operation through WP-CLI
**Then** the result is equivalent and uses the same sanitization/storage contract.

### AC-009: CLI-First Agent Operation

**Given** Codex needs to organize the root or a project
**When** Codex needs to create pages, attach items, or mark relations
**Then** Codex can complete the workflow through WP-CLI without raw meta edits.

### AC-010: Missing Provider

**Given** a provider plugin is inactive
**When** the workbench loads
**Then** the provider appears as missing/inactive and the screen does not fatal.

### AC-011: Existing Page Frontpage Setup

**Given** an existing WordPress page is selected in the Workbench
**When** Guilherme chooses `Set as portfolio front page`
**Then** WordPress stores `show_on_front=page` and `page_on_front=<selected page id>`.

### AC-012: New Page Frontpage Setup

**Given** Guilherme creates a page from the Workbench
**When** the `Set as portfolio front page` option is selected
**Then** WordPress creates the page, sets it as the portfolio front page, and returns to `context=root`.

### AC-013: Portfolio Posts Page

**Given** an existing or newly created page is selected
**When** Guilherme chooses `Set as portfolio posts page`
**Then** WordPress stores that page in `page_for_posts` and does not change any project-local blog index.

### AC-014: Project Blog Index

**Given** a project context is selected
**When** Guilherme attaches a page as `project blog index`
**Then** the page becomes a project item/relation and WordPress `page_for_posts` remains unchanged.

## 22. Success Metrics

- Guilherme can understand project composition without opening global Pages/CPT screens first.
- Guilherme can understand and configure the portfolio front page without creating a project.
- Codex can create and organize a project through WP-CLI without raw manual edits.
- Codex can configure root/frontpage and create/set pages through WP-CLI without raw option/meta edits.
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
- Context handling can drift back into project-only APIs if stores keep accepting only `project_id`.
- Frontpage setup can accidentally overwrite portfolio blog or project blog semantics if labels/actions are not explicit.

## 24. Decisions Taken

- The workbench is manual-first.
- The front page is the root portfolio context.
- The root/frontpage context is configurable and must work with zero projects.
- Projects are nested curated groups, not the universal root.
- Existing pages and newly created pages are both valid frontpage candidates.
- Portfolio blog and project-local blog index are distinct concepts.
- The UI must be visual/category-based, not diagram-based.
- Suggestions are pending by default.
- Codex automation must go through WP-CLI.
- 3D Viewer is deferred from V1 operations.
- SBP and EIT are relevant providers for V1.

## 25. Assumptions

- WordPress admin is the correct host surface.
- CPT + registered meta is the correct foundation for project records.
- WordPress options are the correct foundation for WordPress-native frontpage/posts-page assignment.
- Option-backed storage is acceptable for root context data because root is a singleton context.
- Manual relation records are enough for V1; complex auto-detection can wait.
- Provider registries can represent SBP/EIT data without tight coupling.
- Existing pages/CPTs/CCTs/templates remain managed by their native surfaces.

## 26. Open Questions

- Should non-project context items be stored in option-backed root arrays, a dedicated internal CPT, or a hybrid once root data grows?
- Should a page be allowed to belong to multiple projects?
- What is the exact filter/API shape for registering code-created page definitions?
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
- Full custom page-generation framework beyond registering and materializing specific page definitions.

## 28. Validation Plan

- PHP lint for changed theme/plugin files.
- `git diff --check`.
- Admin smoke: zero-project WordPress install with configured front page renders `context=root`.
- Admin smoke: no configured front page renders setup actions instead of project gate.
- WP-CLI smoke for `gp context root` or equivalent root topology report.
- WP-CLI smoke for existing page frontpage setup.
- WP-CLI smoke for new page creation with optional frontpage assignment.
- WP-CLI smoke proving project blog index does not mutate `page_for_posts`.
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

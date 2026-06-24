# Tasks: Portfolio Workbench

## Foundation Already Completed

- [X] T001 Add Spec Kit feature artifacts.
- [X] T002 Add theme autoloader and bootstrap service registration.
- [X] T003 Add `gp_project` CPT under Appearance.
- [X] T004 Add project configuration metabox.
- [X] T005 Add content assignment metabox.
- [X] T006 Add Pages columns and project filter.
- [X] T007 Add theme admin CSS scoped to project screens.
- [X] T008 Add SBP Pricing support class and hook it into bootstrap.
- [X] T009 Add SBP pricing metabox and meta registration.
- [X] T010 Render price/range in SBP cart listing and WhatsApp message.
- [X] T011 Add Elementor Budget Listing show-price controls.
- [X] T012 Add EIT field catalog extension filters.
- [X] T013 Publish SBP price fields into EIT through filters.
- [X] T014 Add option-backed `__SBP` custom budget value field catalog.
- [X] T015 Expose custom budget value field management in the SBP settings panel.
- [X] T016 Add `wp sbp` WP-CLI commands for settings and `__SBP` value fields.
- [X] T017 Add `wp gp project` commands for theme-owned portfolio projects.
- [X] T018 Add `wp gp assignment` commands for content-to-project assignment.
- [X] T019 Add dynamic registries for project modes, surfaces, roles and integration providers.
- [X] T020 Normalize integration providers with status, capabilities, provider slug and source.
- [X] T021 Register project and assignment meta through WordPress meta APIs.

## New Workbench Scope

- [X] T022 Rename/spec-align the feature surface from Project Workbench to Portfolio Workbench where appropriate.
- [X] T023 Add project categories registry: Entry, Pages, Content, Presentation, Data, Evidence, Providers, Suggestions, Relations.
- [X] T024 Add Project Item storage for attached existing WordPress/plugin objects.
- [X] T025 Add Project Relation storage with source, relation type, target, provider/source, state and notes.
- [X] T026 Add Suggestion storage with provider/source, payload, state and review actions.
- [X] T027 Add visual wp-admin overview screen using category modules, badges, chips, inspector and compact relation strip.
- [X] T028 Add hover-tip UI pattern for icons, badges and category labels.
- [X] T029 Add manual attach/detach UI actions with capability and nonce checks.
- [X] T030 Add manual relation mark/edit/remove UI actions with capability and nonce checks.
- [X] T031 Add suggestion mark/ignore UI actions with capability and nonce checks.
- [X] T032 Add `wp gp item attach|detach|list` commands.
- [X] T033 Add `wp gp relation add|list|update|remove` commands.
- [X] T034 Add `wp gp suggestion list|mark|ignore` commands.
- [X] T035 Add `wp gp topology <project>` read command for Codex.
- [X] T036 Add provider adapter for SBP value fields and price/range fields.
- [X] T037 Add provider adapter for EIT field catalog and filter data.
- [X] T038 Add admin smoke checks for overview, badges, tips, suggestions and missing provider state.
- [X] T039 Add WP-CLI smoke checks for create/attach/relation/suggestion/topology workflows.
- [X] T040 Update acceptance evidence after implementation.

## Follow-up Closure

- [X] T041 Add Workbench page creation flow that creates a normal WordPress page and immediately attaches it to the selected project.
- [X] T042 Promote marked relation suggestions into confirmed relation records when the suggestion payload includes source, relation and target.
- [X] T043 Add admin and WP-CLI smoke evidence for page creation and suggestion promotion.
- [X] T044 Make `gp_project` an internal storage post type by removing its standalone wp-admin UI/menu.
- [X] T045 Replace legacy project editor links with Workbench-native project create/update forms and context links.
- [X] T046 Add smoke evidence that Workbench render has no `gp_project` legacy create/edit links.

## Context-First Correction

- [ ] T047 Add `Context` contract for `root`, `project:<id>` and future-compatible `page:<id>`/`section:<slug>` context IDs.
- [ ] T048 Add `ContextResolver` that resolves labels, type, storage, capabilities, configured frontpage state and missing/setup states.
- [ ] T049 Add option-backed root/frontpage config storage with mode, operational status, notes, surfaces and integrations.
- [ ] T050 Refactor item, relation and suggestion stores to accept a resolved context instead of a raw `project_id`.
- [ ] T051 Preserve project-backed storage for `project:<id>` contexts while adding root option-backed storage for `root`.
- [ ] T052 Add `TopologyService::root()` or equivalent context topology method that returns root settings, items, relations, suggestions, providers and frontpage state.
- [ ] T053 Change Workbench admin default route to render `context=root` when no project/context is selected.
- [ ] T054 Replace project-only toolbar with context-aware selector that keeps `Portfolio Front Page` as the first/default context.
- [ ] T055 Replace `Project settings` with generic `Context settings`, using project-specific fields only inside `project:<id>` contexts.
- [ ] T056 Add root setup UI for `Use existing page` and `Create new page` when no frontpage is configured.
- [ ] T057 Add prominent `Set as portfolio front page` action for existing or newly created WordPress pages.
- [ ] T058 Add explicit `Set as portfolio posts page` action and keep it visually distinct from project-local blog actions.
- [ ] T059 Add project-local `blog index` attach role/action that does not mutate WordPress `page_for_posts`.
- [ ] T060 Extend page creation flow to accept `context_id`, optional `set_frontpage`, optional `set_posts_page`, and source metadata.
- [ ] T061 Add code-created page registry for stable page definitions that can be materialized through admin and WP-CLI.
- [ ] T062 Refactor admin forms/actions to submit and validate `context_id` instead of requiring `project_id` for every mutation.
- [ ] T063 Add WP-CLI context commands: root topology, frontpage set, posts-page set, context item attach/detach, context relation add/update/remove and context suggestion mark/ignore.
- [ ] T064 Keep legacy `wp gp item <project_id>` compatibility only as a thin adapter to `context=project:<id>` or document its removal before implementation.
- [ ] T065 Add admin smoke: configured frontpage plus zero projects renders root context and never shows a project creation gate.
- [ ] T066 Add admin smoke: missing frontpage renders setup actions without requiring a project.
- [ ] T067 Add WP-CLI smoke: existing page can be set as portfolio frontpage.
- [ ] T068 Add WP-CLI smoke: newly created page can be attached to root and optionally set as frontpage.
- [ ] T069 Add WP-CLI smoke: project blog index attach does not mutate `page_for_posts`.
- [ ] T070 Update canonical evidence after context-first correction.

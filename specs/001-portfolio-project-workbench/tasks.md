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

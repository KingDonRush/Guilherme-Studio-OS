# Tasks: Portfolio Area Map

## Reset Boundary

- [X] T001 Rename the feature package from the rejected legacy surface to `Portfolio Area Map`.
- [X] T002 Replace the legacy feature specification with the area-map contract.
- [X] T003 Decide storage: hidden `gp_area` CPT or option-backed area registry.
- [X] T004 Decide whether old local records are migrated, ignored, or explicitly removed.

## Core Model

- [X] T005 Add area record model with title, slug, status, notes, order and timestamps.
- [X] T006 Add area item model with category, role, label, type, object reference, admin URL, notes, order and timestamps.
- [X] T007 Add sanitizer/validator for area and area-item payloads.
- [X] T008 Add destination resolver for native WordPress links: edit, Elementor, view, admin list, add new, taxonomy, menu, Theme Builder and stored admin URL.
- [X] T009 Reject unsafe external/custom URLs unless a future rule explicitly allows them.

## Admin Surface

- [X] T010 Add `Mapa do Portfólio` as a top-level wp-admin page.
- [X] T011 Render area switcher with a compact side rail.
- [X] T012 Render selected-area overview as the highest-weight visual object.
- [X] T013 Render grouped item sections: Pages, Content, Presentation, Navigation, Admin destinations and References.
- [X] T014 Add attach-existing-item form without creating or editing the underlying object inline.
- [X] T015 Add detach action that removes only the association.
- [X] T016 Add native action buttons for each supported destination.
- [X] T017 Add Theme Builder shortcut item rendering with lighter visual weight than pages/content.
- [X] T018 Add compact badges and icon tips instead of explanatory blocks.
- [X] T019 Add scoped admin CSS for a calibrated single-screen desktop layout.
- [X] T020 Contain WordPress/plugin notices on this screen so they do not push the map downward.

## WP-CLI

- [X] T021 Add `wp gp area list|get|create|update|delete`.
- [X] T022 Add `wp gp area-item list|attach|update|detach|links`.
- [X] T023 Ensure WP-CLI mutations use WordPress APIs and never raw meta/database writes.
- [X] T024 Ensure Codex can fully maintain associations through WP-CLI without manual admin clicks.

## Legacy Removal

- [X] T025 Remove legacy feature names from admin labels, menu slugs, CSS handles, CSS classes and PHP comments.
- [X] T026 Replace old project-centered storage names with area-centered names, preserving only deliberate compatibility shims if approved.
- [X] T027 Remove provider/suggestion/relation/page-creation UI paths from the primary surface.
- [X] T028 Rename admin screenshots/evidence titles to `Portfolio Area Map` / `Mapa do Portfólio`.

## Verification

- [X] T029 Review the implementation against `docs/studio-os/implementation/04-spec-kit-clean-code-flow.md`.
- [X] T030 Run PHP lint on changed theme files.
- [X] T031 Run WP-CLI smoke for area create/list/get/update/delete.
- [X] T032 Run WP-CLI smoke for item attach/list/update/detach/links.
- [X] T033 Run admin render smoke for the map page.
- [X] T034 Run logged-in visual smoke at target desktop viewport.
- [X] T035 Run notice-containment smoke with a simulated admin notice.
- [X] T036 Update canonical evidence after implementation.
- [X] T037 Run `git diff --check`.

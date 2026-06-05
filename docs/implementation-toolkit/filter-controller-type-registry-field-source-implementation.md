# Filter Controller Type Registry And Field-Source Implementation

Date: 2026-06-05

Task: `TASK-FC-045`
Phase: `PHASE-FC-007`

Status: implemented in plugin source, pending human visual QA for later UI
polish tasks.

## What Changed

This slice implemented the shared foundation recommended by
`filter-controller-robustness-synthesis.md`.

Plugin changes:

- added `FilterTypeRegistry`;
- added `FieldBindingResolver`;
- made `FilterTypes` delegate type labels/keys to the registry;
- made `FilterSettings` use the resolver for effective key contracts;
- made presets persist `resolved_key` and `key_source` while preserving legacy
  `key`, `field_binding`, and `field_binding_dynamic`;
- exposed filter type metadata in `eitEditorConfig.filterTypes`;
- made editor style-cadence flag logic consume registry metadata instead of
  hardcoded type arrays;
- rendered field contract metadata on each filter group as:
  - `data-eit-field-source`;
  - `data-eit-key-source`;
  - `data-eit-resolved-key`;
- bumped the plugin version to `0.2.15`.

## Compatibility Contract

Legacy behavior preserved:

- widgets with only `key` still render the same effective `data-eit-key`;
- widgets with plain `field_binding` still prefer that value when it looks like
  a valid field key;
- widgets with Elementor dynamic binding still try Elementor dynamic-tag parsing;
- manual key remains the fallback when binding and snapshot resolution fail.

New behavior:

- presets now store a normalized `resolved_key` snapshot;
- presets now store `key_source`, describing how the effective key was found;
- a stored snapshot is only used when there is still binding context, so stale
  hidden values do not keep a cleared filter alive by themselves.

## Deferred Work

This task did not implement:

- Toolkit CPT fields as Elementor dynamic tag providers;
- resolver semantics for `source`, `compare`, and `data_type`;
- per-filter visual redesign;
- new granular Style sections for every filter type.

Those remain separate follow-up slices because each changes either Elementor UI,
runtime filtering behavior, or visual QA scope.

## Verification

Verification belongs in the final task report, but the intended minimum is:

- Agentic Ops phase/subplan/task validation;
- PHP lint for changed PHP files;
- JS syntax check for `assets/js/eit-editor.js`;
- `composer validate --strict`;
- `git diff --check`;
- plugin git status, commit, and push.

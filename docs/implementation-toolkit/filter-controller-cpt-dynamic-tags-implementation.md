# Filter Controller CPT Dynamic Tags Implementation

## Why this slice exists

Manual filter keys are fragile. They make the widget depend on the implementer remembering the exact data key, and they do not explain which Toolkit-managed CPT field a filter is supposed to target.

This slice adds the first practical bridge:

- Toolkit CPT definitions become selectable Elementor dynamic tag settings.
- The dynamic tag returns the selected field key so the existing `FieldBindingResolver` can resolve it.
- The filter runtime can read public Toolkit-managed meta values from public posts when the item has a post ID.

## Boundaries

In scope:

- field catalog sourced from `CptManager::all()`;
- Elementor dynamic tag group and tag registration;
- compatibility with serialized Elementor dynamic tag settings;
- public runtime enrichment for Toolkit meta fields marked `show_in_rest`.

Out of scope:

- per-filter visual redesign;
- arbitrary third-party custom field discovery;
- sort-field builder depth;
- complex Elementor editor visual QA, which remains Guilherme's QA boundary.

## Runtime security rule

The filter endpoint is public. Because of that, runtime meta enrichment must not read arbitrary meta keys.

Allowed automatic meta lookup:

- the listing item has a public `postId`;
- the post type is managed by the Toolkit;
- the field exists in that CPT definition;
- the field is marked `show_in_rest`.

The endpoint still returns IDs and counts, not raw meta payloads, but filtering behavior can reveal information indirectly. The `show_in_rest` gate is the minimum public-exposure contract.

## Verification target

The implementation is considered valid when:

- Elementor registers the Toolkit dynamic tag group and tag;
- a serialized Toolkit tag with `settings.key` resolves through `FieldBindingResolver`;
- PHP lint, Composer validation, Agentic Ops schemas, WP-CLI smoke checks, and `git diff --check` pass.

## Verification results

Completed in the local WordPress environment:

- PHP lint passed for changed PHP files.
- `composer validate --strict` passed.
- Agentic Ops `validate_task`, `validate_subplan`, and `validate_phase` passed.
- WP-CLI confirmed `eit-toolkit-field-key` registers under the Toolkit dynamic tag group.
- WP-CLI confirmed a serialized Toolkit tag resolves to `_project_type` with `key_source=dynamic_binding`.
- WP-CLI runtime smoke confirmed public Toolkit meta (`show_in_rest=true`) filters and private Toolkit meta (`show_in_rest=false`) does not.
- `git diff --check` passed.

# Frame-Driven UI QA Protocol

## Purpose

When a UI is based on approved generated frames, the frame is not a loose mood
reference. It is the practical product target.

This protocol prevents the agent from finishing a visual implementation before
looking at the result with browser evidence and comparing it against the source
frame.

## Non-Negotiable Rule

A UI/frame task is not done until the same assistant turn includes:

1. the implemented code change;
2. browser render through the real app when available;
3. screenshot evidence saved into the project;
4. visual comparison against the approved frame;
5. corrections for obvious mismatches found in that comparison;
6. final validation commands after corrections.

Do not defer screenshot QA to a later output. If screenshot QA is blocked, stop
the task and report the blocker as the task result.

## When This Applies

Use this protocol for:

- WordPress admin screens based on generated frames;
- Elementor widget/editor UI based on generated frames;
- frontend pages based on generated frames;
- modals, drawers, inspectors, dashboards, cards, filter panels, previews, and
  responsive states whose target came from an approved image;
- asset packs where icons, palette, or states were derived from approved frames.

## Required Task Shape

Every visual task must be scoped as one closed target:

- one screen state;
- one modal state;
- one responsive viewport;
- one component family;
- one visible defect cluster.

Do not batch unrelated visual states into one unchecked implementation pass.

## Evidence Folder

Save visual QA evidence under:

`docs/assets/<project-or-plugin>/<feature>/qa/<task-id>/`

Use stable names:

- `source-frame.png` or a note pointing to the source frame path;
- `desktop-before.png` when useful;
- `desktop-after.png`;
- `mobile-after.png` when responsive behavior is in scope;
- `modal-after.png` when a modal/drawer is in scope.

Do not leave screenshots in the repository root.

## Vision Checklist

Before closing the task, inspect the source frame and the implementation
screenshot for:

- WordPress admin chrome presence and containment;
- top navigation, selected tab, actions, and object pill;
- canvas proportions and major grid tracks;
- inspector position, stickiness, width, scroll behavior, and selected context;
- hierarchy ownership: what contains, inherits, overrides, or controls what;
- selected state color, border, icon, and active panel;
- connector lines or deliberate absence of decorative lines;
- card padding, border radius, and overflow;
- typography scale, line wrapping, and truncated text;
- form control density and label hierarchy;
- modal scope: preview shows only what the frame intends to preview;
- mobile/tablet overflow, stacking, tap target size, and modal usability;
- hallucinated frame details that should be translated into clean deterministic
  UI instead of copied literally;
- console errors and horizontal overflow.

## Handling Frame Hallucinations

When a source frame contains impossible, inconsistent, or hallucinated details:

1. keep the architectural intent;
2. remove visual noise;
3. use existing WordPress/plugin controls where possible;
4. preserve containment and hierarchy;
5. record the interpretation in the task summary.

Do not use hallucinations as an excuse to drift into a generic WordPress
settings page.

## Pass/Fail Standard

Pass means:

- the implemented state is recognizably the same product layout as the source
  frame;
- the architecture hierarchy is readable without explanatory copy;
- no obvious overlap, clipping, broken text, or stray placeholder UI remains;
- the screenshot evidence is saved;
- lint or targeted functional validation passes.

Fail means:

- the frame was not opened or inspected;
- no screenshot was taken;
- the screenshot was taken but not reviewed;
- mismatches were found and left unaddressed without an explicit blocker;
- the task closes on lint alone.

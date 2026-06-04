# Filter Controller Toggle Audit

Date: 2026-06-04

Task: `TASK-FC-012`
Subplan: `SUBPLAN-FC-AUDIT-TOGGLE`

Status: audit complete, implementation not started.

## Purpose

Audit toggle as a binary filter component.

Toggle is not a list option. It represents one on/off condition, usually a
single boolean or "only show X" filter. Its anatomy and accessibility are
different from checkbox/chips even though it uses a checkbox input internally.

## Source Evidence

- Toggle render branch: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Elementor/Widgets/FilterController.php:219`
- Toggle CSS: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/css/eit-frontend.css:112`
- Hidden toggle input CSS: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/css/eit-frontend.css:133`
- JS scalar collection: `wordpress/wp-content/plugins/elementor-implementation-toolkit/assets/js/eit-frontend.js:180`
- Resolver semantics: `wordpress/wp-content/plugins/elementor-implementation-toolkit/includes/Support/FilterResolver.php:208`

## Current Anatomy

```html
<label class="eit-option eit-toggle">
  <input type="checkbox" value="yes" data-eit-control data-eit-type="toggle" data-eit-key="featured">
  <span class="eit-toggle__switch" aria-hidden="true"></span>
  <span>Featured</span>
</label>
```

Subelements:

- wrapper label;
- hidden checkbox input;
- switch track;
- switch thumb;
- label text;
- checked state;
- focus/hover state;
- optional group label.

## Current Behavior Contract

- Toggle reads only the first configured option.
- It sends a scalar value when checked.
- It sends nothing when unchecked.
- Server resolver treats it like a single token match.

## Mechanical Bugs And Risks

1. Only the first option is used.
   - This is valid for a binary toggle, but needs explicit UI copy.

2. Focus state is not visible enough.
   - The input is opacity-hidden and pointer-disabled.
   - The wrapper needs a strong focus-visible style.

3. Toggle inherits `.eit-option` active background.
   - Checked state can recolor the whole row and the switch, which may be too
     loud or redundant.

4. No off-label or value semantics.
   - A toggle can mean "Featured only", "In stock", "On sale", or "Has video".
   - The label has to carry the condition clearly.

## Product Controls To Add

Immediate:

- switch size;
- switch track on/off color;
- thumb color;
- thumb size;
- label position: left/right;
- row layout: inline, full row, card-like;
- focus ring on wrapper/switch;
- option copy helper: "Toggle uses the first option value."

Later:

- icons inside track;
- on/off text;
- disabled state;
- default checked value;
- grouped toggle list mode if multiple toggles become common.

## QA Scenario

Guilherme should test:

1. Toggle with one option.
2. Toggle with multiple options configured and confirm UI explains first-option
   behavior.
3. Click label text and switch.
4. Keyboard tab/space.
5. Active state: does the whole pill recolor too much?
6. Mobile full-width and inline behavior.
7. Reset.

Pass criteria:

- on/off state is obvious;
- focus is visible;
- the label clearly expresses the filtered condition;
- the component does not look like a generic pill with a switch pasted inside.

## Completion Decision

`TASK-FC-012` is complete as an audit task. The next implementation slice should
separate toggle switch styling from generic option styling.

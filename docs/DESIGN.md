# Design System

## Status

This document defines stable visual constraints for future exploration. It does
not approve the current coded home or Simple Budget case composition.

## Theme

The portfolio is a human professional profile with technical evidence, not a
software interface.

The visual system should balance:

- personal presence and approachability;
- precise, spacious presentation;
- visible WordPress and implementation expertise;
- enough variation for each project to retain its own identity.

Dark and light surfaces may coexist, but the split must serve hierarchy rather
than become the entire visual idea.

## Identity Hierarchy

The required identity lockup is:

1. `Guilherme Silva` as the dominant name.
2. GitHub logo plus `kingdonrush` on the line below.

The technical signature must:

- be smaller and quieter than the name;
- remain legible;
- function as a single hyperlink;
- point to Guilherme's GitHub profile;
- never share the same size, weight, or baseline as the commercial name.

## Color Strategy

Use tinted neutrals rather than pure black or pure white.

Current direction:

- a deep, chromatic dark for personal or technical framing;
- a warm off-white for reading and project evidence;
- cyan as the primary continuity accent;
- violet as a secondary technical accent;
- a warm accent only when it clarifies a project or primary action.

Exact colors and proportions remain open until a new visual direction is
approved. Do not copy colors from the rejected implementation as canonical
tokens.

## Typography

Use a distinctive sans-serif system with strong weight and scale contrast.

Requirements:

- the name may use an expressive display treatment;
- case headlines must remain direct and readable;
- cards and body text prioritize clarity;
- monospace is limited to genuine metadata, code, or technical identifiers;
- `kingdonrush` must not become visually louder through a decorative font;
- body line length should stay around 65 to 75 characters.

The final font family is intentionally unresolved.

## Imagery

### Portrait

Use Guilherme's approved portrait. Do not generate a replacement person or
alter recognizable identity.

### Project Evidence

Prefer real screenshots, faithful interface states, product captures, or
purpose-built images that prove the project's actual differentiator.

When CSS, HTML, or JavaScript would produce a fake-looking visual, pause the
implementation and create, capture, treat, optimize, and register the required
asset before continuing.

### Plugin Case Imagery

The primary case image must communicate the plugin's differentiator.

For Simple Budget, the visual thesis is implementation flexibility:

- two Elementor widgets;
- an editable cart template;
- behavior that adapts to the project's layout and content.

Furniture or a fictional catalog can demonstrate usage, but must not become the
case page's main identity.

## Layout

- Establish one dominant visual anchor per viewport.
- Define the first three eye stops before styling.
- Give each section one question, one dominant message, and one evidence unit.
- Use progressive disclosure for technical depth.
- Reduce prose around dense screenshots.
- Prefer Elementor-compatible containers, grids, and responsive behavior.
- Do not rely on brittle overlaps, collage layouts, or absolute positioning for
  core meaning.

## Components

### Project Cards

Cards are valid for independent projects and comparison. They must not become
the grammar for every section.

Each project card should contain only:

- a meaningful preview;
- project name;
- concise role or value statement;
- relevant stack evidence;
- one clear path to the case.

### Calls To Action

Client-facing actions use Guilherme Silva's professional voice. GitHub actions
use the GitHub logo and technical identity.

### Accordions And Carousels

- Accordions are for optional technical detail.
- Carousels are for sequential or alternative evidence.
- Neither may hide the page thesis.
- Do not combine arrows, dots, counters, labels, and instructions unless each
  has a distinct navigation purpose.

## Motion

Motion should clarify hierarchy or state changes.

- Respect `prefers-reduced-motion`.
- Avoid decorative looping motion.
- Do not animate layout properties.
- Use restrained easing and short transitions for interface feedback.

## Responsive Behavior

Mobile is a recomposed layout, not merely a stacked desktop screen.

- Preserve the identity hierarchy.
- Keep the portrait and name readable without text overflow.
- Ensure evidence remains inspectable.
- Remove or defer secondary metadata before reducing essential text to
  unreadable sizes.
- Keep navigation and calls to action reachable without visual competition.

## Absolute Rejections

Reject a direction when it contains:

- repeated generic feature cards;
- decorative arrows or connector lines explaining obvious relationships;
- fake browser windows or fake Elementor controls;
- dense prose beside dense imagery;
- several simultaneous focal points;
- generic gradients, glows, grids, or shadows compensating for weak structure;
- terminal snippets, code rain, WordPress watermarks, or technical confetti;
- demo-brand imagery dominating a portfolio plugin case;
- `kingdonrush` without the GitHub logo and hyperlink;
- unsupported plugin features or inaccurate Elementor interfaces;
- a layout that cannot be reproduced credibly in WordPress.

## Open Design Decisions

- final font family;
- final palette values and color ratios;
- final home composition;
- final plugin-case composition;
- final tagline;
- priority of remote employment, agency partnership, or direct freelance work
  in the primary call to action.

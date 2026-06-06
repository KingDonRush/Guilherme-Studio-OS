# Modularization Policy

## Goal

The brain must stay small enough to load selectively.

Plugin source code must stay small enough to reason about safely. This applies
to the entire plugin: admin pages, CPT managers, REST endpoints, Elementor
widgets, support classes, assets, scripts, tests, and future modules. Large
files make AI-assisted work brittle because each patch has to re-parse too many
unrelated controls, selectors, render branches, and edge cases.

## Soft Limits For Brain Files

Split a file when it reaches any of these signs:
- more than about 220 lines;
- more than one domain of concern;
- repeated sections that would be easier as a folder;
- a task-specific object starts living beside a policy;
- the file becomes hard to skim in under one minute.

## Harder Limits For Plugin Source

For authored plugin/theme/source files, use these limits:

- 200 to 400 lines is the normal acceptable range.
- Prefer modules around 200 to 320 lines.
- Orchestrator/facade files should usually stay under 200 lines.
- At 400 lines, pause and decide whether the file needs a submodule split.
- Above 450 lines, do not add new feature work until a split task exists.
- Above 800 lines, treat the file as an active architecture problem.
- Above 1200 lines, treat it as blocking debt for new UI/control complexity.

Exceptions are allowed only for generated files, third-party vendor code,
temporary fixtures, or migration files that are explicitly marked as such.

## Deep Split Pattern

For complex product surfaces, split by:

1. Domain: the broad responsibility, such as `StyleControls`.
2. Subdomain: the family or filter type, such as `Types/Range`.
3. Implementation block: the specific concern, such as `HandleStyleControls`.

Example for the Filter Controller:

```text
includes/Elementor/FilterController/StyleControls.php
includes/Elementor/FilterController/StyleControls/Shared/Layout/LayoutStyleControls.php
includes/Elementor/FilterController/StyleControls/Shared/Option/OptionStateStyleControls.php
includes/Elementor/FilterController/StyleControls/Types/Range/RangeInputStyleControls.php
includes/Elementor/FilterController/StyleControls/Types/Range/RangeHandleStyleControls.php
includes/Elementor/FilterController/StyleControls/Types/Rating/RatingIconStyleControls.php
includes/Elementor/FilterController/StyleControls/Types/Rating/RatingStateStyleControls.php
```

Do not split only one level when the module still contains several real
subdomains. `RangeStyleControls.php` is acceptable only as an orchestrator if
range input, track, handle, vertical layout, labels, and ticks are separate
blocks.

## Brain Split Pattern

Use folders by concern:
- `operational/<topic>.md`
- `strategy/<topic>.md`
- `projects/<project>.md`
- `memory/<topic>.md`
- `tools/<tool>.md`

## What Not To Do

- Do not put plugin code in `.ai/`.
- Do not put generated reports in `.ai/` unless they are compact decision memory.
- Do not turn `.ai/` into a dumping ground for screenshots, exports, zips, or
  downloaded packages.
- Do not create one giant master context file.

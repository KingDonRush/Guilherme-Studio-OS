# Modularization Policy

## Goal

The brain must stay small enough to load selectively.

## Soft Limits

Split a file when it reaches any of these signs:
- more than about 220 lines;
- more than one domain of concern;
- repeated sections that would be easier as a folder;
- a task-specific object starts living beside a policy;
- the file becomes hard to skim in under one minute.

## Split Pattern

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


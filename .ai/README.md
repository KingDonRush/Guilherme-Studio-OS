# AI Brain

This directory is the operational brain for the project.

It may contain:
- operating protocols;
- strategy notes;
- decision memory;
- project diagnostics;
- research plans;
- task templates;
- tool policies.

It must not contain:
- WordPress core;
- plugin source files;
- theme source files;
- generated pages;
- design exports;
- project deliverables;
- build artifacts;
- credentials.

## Reading Order

For every new task, read only what is needed:

1. `../AGENTS.md`
2. `operational/core-loop.md`
3. `operational/git-protocol.md`
4. `operational/evidence-first.md` when working on WordPress, Elementor,
   WooCommerce, plugin behavior, or public technical claims
5. `operational/elementor-evidence-map.md` when the task touches Elementor
   widgets, controls, editor behavior, or Elementor implementation details
6. relevant project or strategy file

## Folder Map

- `operational/`: how the AI should work.
- `strategy/`: portfolio and market logic.
- `projects/`: compact project dossiers and improvement direction.
- `memory/`: durable decisions, open questions, and assumptions.
- `tools/`: tool and MCP policy.
- `templates/`: reusable thinking structures.

## Adaptation Rule

When a file grows too large or starts mixing concerns, split it. The brain should
be easy to load in small pieces.

MCP setup belongs here because it is operational infrastructure for the AI, not
project output. Keep credentials out of git.

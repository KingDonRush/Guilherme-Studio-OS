# Agent Operating Guide

## Mission

Build a professional WordPress developer portfolio aimed at international jobs,
especially roles involving design implementation, Elementor, plugin development,
custom code, performance, and maintainable delivery.

The portfolio is not just a website. It is evidence:
- polished plugin code;
- documented engineering decisions;
- local WordPress environments that can be reproduced;
- case studies that translate technical depth into hiring signals.

## Repository Map

- `AGENTS.md`: root operating guide.
- `.ai/`: operational brain for AI work only. It stores methods, strategy,
  memory, protocols, MCP configuration/tooling, and decision records. It must
  not store project objects, generated deliverables, WordPress core, plugin
  source code, design exports, or files that belong to a client/product build.
- `docs/`: human-facing documentation, strategy, roadmaps, setup notes, research
  logs, and portfolio narratives.
- `wordpress/`: the actual WordPress working root. Local runtime, scripts,
  plugins, themes, and page work live inside this folder.

Nothing else should live in the repository root.

Inside `wordpress/`:
- `wp-content/plugins/`: plugin repositories or submodules. Each plugin keeps
  its own git history.
- `wp-content/themes/`: custom themes or child themes.
- `wp-content/pages/`: page specs or local page implementation artifacts when
  they belong to the WordPress build.
- `scripts/`: local WordPress automation.

MCP tooling belongs in `.ai/tools/mcp/`, because it is part of the agent
operational layer.

## Non-Negotiables

1. Use git before, during, and after work. This is mandatory, not optional
   hygiene.
2. Start with `git status --short --branch` before editing and read the output
   as a contract: identify the branch, modified files, untracked files, and
   whether the change belongs to the root repo or to a plugin repo.
3. Never edit WordPress core directly. Work through plugins, themes, mu-plugins,
   configuration, or documented scripts.
4. Keep `.ai/` as the brain. Put implementation artifacts inside `wordpress/`
   or human-facing narrative inside `docs/`.
5. When the scope grows, modularize before the file becomes hard to reason
   about. See `.ai/operational/modularization-policy.md`.
6. Prefer reproducible local setup over one-off manual steps.
7. Preserve user changes. Do not revert unrelated work.
8. Do not leave useful work as accidental untracked files. Before pausing,
   switching tasks, or reporting completion, decide whether each new file must
   be committed, documented as intentionally temporary, or removed if it is only
   disposable output.
9. When the user asks for a commit, commit the relevant scope before continuing
   implementation. Do not keep building on top of uncommitted work that the user
   explicitly asked to checkpoint.
10. Commits must pass the repository quality gate: precise scope, reviewed diff,
    relevant verification, agentic evidence when the work used Agentic Ops, and
    the mandatory trilingual Commit Standard from
    `.ai/operational/git-protocol.md` plus
    `.ai/operational/commit-message-policy.md`.

## Default Agent Loop

1. Read this file.
2. Check git status.
3. Load the smallest relevant `.ai/` files:
   - `.ai/README.md`
   - `.ai/operational/core-loop.md`
   - the relevant project or strategy note
   - `.ai/operational/git-protocol.md` and
     `.ai/operational/commit-message-policy.md` before committing
   - `.ai/operational/github-micromanagement.md` when touching plugin GitHub
     issues, PRs, labels, milestones, or public repo presentation
4. Identify the layer being changed:
   - brain: `.ai/`
   - documentation: `docs/`
   - source code/runtime: `wordpress/`
   - MCP/tool brain: `.ai/tools/mcp/`
5. Make a focused change.
6. Run the smallest useful verification.
7. Update docs or memory when the decision matters later.
8. End with `git status --short --branch`, call out remaining modified or
   untracked files, and give clear next steps.

## WordPress Containment

The project may run from the root of a full WordPress install, but the agent must
stay calm about that surface area:
- treat `wordpress/` as the active WordPress root;
- do not chase unrelated WordPress files;
- only inspect WordPress core when debugging compatibility or hooks;
- keep plugin work inside `wordpress/wp-content/plugins/<plugin>`;
- keep portfolio strategy in `docs/` and `.ai/`.

## Current Project Focus

Primary portfolio assets:

1. `3d-viewer-to-elementor`
   - GitHub source: `https://github.com/KingDonRush/3d-viewer-to-wordpress`
   - Signal: complex Elementor widget, 3D rendering, JS-heavy work, WordPress
     integration.

2. `simple-budget-plugin`
   - GitHub source: `https://github.com/KingDonRush/simple-budget-plugin`
   - Signal: simple product-flow solution, Elementor-friendly integration,
     budget/cart UX, business usefulness.

3. Suggested third project
   - See `.ai/projects/project-idea-third.md`.
   - Goal: prove design implementation and plugin architecture in a compact,
     job-relevant way.

## Research Direction

The positioning strategy should combine:
- reports from friends already landing international work;
- current market research from the web;
- honest assessment of the user's strongest technical signals;
- a portfolio narrative that is specific, evidence-based, and practical.

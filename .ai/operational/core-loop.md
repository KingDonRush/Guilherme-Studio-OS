# Core Loop

## Purpose

Keep the AI methodical while working inside a large WordPress surface area.

## Loop

1. Locate yourself:
   - run `pwd`;
   - run `git status --short --branch`;
   - identify whether you are in the root repo or inside a plugin repo.

2. Load context:
   - read `AGENTS.md`;
   - read only the `.ai/` files relevant to the current task;
   - read `operational/evidence-first.md` before WordPress, Elementor,
     WooCommerce, plugin, or public portfolio capability work;
   - inspect existing code before proposing abstractions.

3. Classify the task:
   - strategy;
   - setup;
   - plugin polish;
   - WordPress runtime;
   - portfolio content;
   - research;
   - release/publishing.

4. Define the smallest useful outcome:
   - one setup milestone;
   - one bug fixed;
   - one documented decision;
   - one testable improvement.

5. Execute:
   - edit in the proper layer;
   - keep `.ai/` free of implementation artifacts;
   - avoid broad refactors unless they are needed.

6. Verify:
   - run targeted commands;
   - use WordPress, WP-CLI, browser, or tests as appropriate;
   - cite official docs, local source, schema, command output, or browser
     evidence for implementation-relevant claims;
   - record verification gaps honestly.
   - when a UI is based on an approved frame, follow
     `frame-driven-ui-qa.md` before closing the task; lint/render checks alone
     do not close a visual task.

7. Preserve memory:
   - update docs for human-facing knowledge;
   - update `.ai/memory/` for durable agent assumptions or decisions.

8. Close:
   - run git status;
   - summarize changes;
   - name the next concrete move.

# Admin V0.2 Agentic Ops MCP Adaptation

This adapts the Elementor Implementation Toolkit Admin V0.2 plan to the
Agentic Ops MCP flow.

The machine-readable operational contract is:

`docs/implementation-toolkit/admin-v0.2-agentic-ops-plan.json`

## MCP Position

The current workspace inspection says:

- `.agentic-ops/` does not exist yet;
- `AGENTS.md` exists;
- Agentic Ops should use `overlay` mode;
- the safe init command is:

```bash
aops init --non-destructive --overlay --preset cms_wordpress_elementor_low_code
```

Do not run a destructive or replacing init. The existing repository operating
guide remains authoritative.

## Preset

Use a hybrid method:

- primary: `cms_wordpress_elementor_low_code`;
- secondary: `visual_front_end_first`.

The CMS preset owns WordPress containment, plugin behavior, nonces,
capabilities, sanitization, escaping, Elementor compatibility, and
reuse-before-custom-code checks.

The visual preset owns frame inventory, component extraction, responsive
behavior, screenshot QA, and frame-drift notes.

## Source Mapping

Agentic Ops should treat these files as inputs:

- `docs/implementation-toolkit/admin-v0.2-source-of-truth.md`;
- `docs/implementation-toolkit/admin-v0.2-frame-implementation-plan.md`;
- `docs/assets/implementation-toolkit/admin-v0.2/icons/canonical-icon-manifest.json`;
- `docs/assets/implementation-toolkit/admin-v0.2/frames/`;
- existing QA reports under `docs/assets/implementation-toolkit/admin-v0.2/qa/`.

The source-of-truth document wins when generated frames disagree. The frame
implementation plan is supporting reasoning, not the execution structure.

## Operational Sequence

1. Inspect workspace with `mcp__agentic_ops__.inspect_workspace`.
2. Confirm overlay command with `mcp__agentic_ops__.suggest_non_destructive_init`.
3. Validate `admin-v0.2-agentic-ops-plan.json` with
   `mcp__agentic_ops__.validate_plan`.
4. If overlay creation is accepted, run the non-destructive init command.
5. Import or recreate the plan, phases, tasks, tests, decisions, and handoff in
   `.agentic-ops/`.
6. Validate each phase/task/test before touching plugin source.
7. Execute the first implementation slice only:
   Filter Preset admin architecture, shared primitives, and controller-only
   preview modal.
8. Run Playwright screenshot QA and console checks.
9. Create an Agentic Ops snapshot and export the operational plan.

## Scope Locks

First slice:

- WordPress-contained Toolkit shell;
- canonical icon renderer;
- shared badges, chips, bands, inspector, and preview modal primitives;
- Filter Preset states from the primary frames;
- controller-only preview modal.

Deferred:

- runtime filtering;
- frontend listing/grid renderer;
- deep WooCommerce, JetEngine, Elementor Pro, or Simple Budget adapters;
- real QA automation runner inside the plugin;
- frontend design token export;
- CPT and Integrations frames until the first slice passes QA.

## Handoff Rule

The next agent should not start by editing PHP/CSS. It should start by
validating the Agentic Ops plan, accepting or rejecting root overlay creation,
and then locking the source contract before implementation.

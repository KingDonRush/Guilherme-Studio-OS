# Evidence-First WordPress Work

## Purpose

Stop treating WordPress, Elementor, WooCommerce, and plugin behavior as memory
problems. Treat them as evidence problems.

## Rule

For implementation-relevant claims, do not rely on unstated inference.

Before changing code, designing a feature, documenting a capability, or naming a
stack decision, verify it through at least one of these evidence types:

- official documentation;
- local source code;
- local WordPress/WP-CLI output;
- Elementor schema/control output;
- browser console/network evidence;
- reproducible test result;
- upstream repository or plugin page.

If verification is not available within the current scope, mark the statement as
an assumption and keep it out of public-facing claims until checked.

## Elementor-Specific Evidence

Prefer these sources before implementing or describing Elementor behavior:

- official Elementor documentation;
- installed Elementor version and local plugin source;
- widget/control schema from the local environment;
- Elementor MCP output when available;
- WP-CLI commands such as Elementor CSS regeneration;
- Playwright console and network snapshots for rendered pages.

Use `.ai/operational/elementor-evidence-map.md` as the current local reference
index before Elementor plugin or implementation work.

## Portfolio Copy Guard

Do not claim a plugin, integration, SEO tool, performance result, metric,
certification, client outcome, or compatibility promise unless it has evidence.

Good:

- "Rank Math is the provisional SEO badge because WordPress.org lists Elementor
  and WooCommerce SEO relevance."
- "The 3D Viewer card should show Three.js because the plugin uses Three.js in
  the implementation."

Bad:

- "This is the best SEO plugin."
- "This plugin is production-ready."
- "Elementor supports this control" without checking docs, schema, or local
  source.

## Recordkeeping

When the evidence changes future behavior, record it in the relevant place:

- `.ai/memory/decisions.md` for durable operating decisions;
- `docs/` for human-facing documentation or portfolio strategy;
- the plugin repository docs when the fact belongs to a plugin.

# WordPress Containment

## Principle

WordPress is large enough to create false urgency. The agent must work from
explicit boundaries.

## Source Boundaries

- Plugin source: `wordpress/wp-content/plugins/<plugin-name>/`
- Theme source: `wordpress/wp-content/themes/<theme-name>/`
- Runtime WordPress: `wordpress/`
- Page implementation artifacts: `wordpress/wp-content/pages/`
- Human docs: `docs/`
- Agent brain: `.ai/`

## Rules

- Do not modify files under `wordpress/wp-admin` or `wordpress/wp-includes`.
- Do not commit generated WordPress core files.
- Work inside the real WordPress tree under `wordpress/`.
- Use WP-CLI for installation, activation, flushing, and inspection.
- Use browser verification for Elementor editor behavior and frontend behavior.

## Debugging Order

1. Confirm plugin is loaded.
2. Confirm Elementor is active.
3. Confirm hooks/assets are enqueued only in needed contexts.
4. Check browser console.
5. Check WordPress debug logs.
6. Inspect plugin code.
7. Only inspect WordPress core when hook behavior is unclear.

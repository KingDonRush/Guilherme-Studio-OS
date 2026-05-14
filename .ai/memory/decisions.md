# Decisions

## 2026-05-14

- The root repository is the orchestration layer for portfolio strategy,
  environment, docs, and AI brain.
- Plugin source lives in `wordpress/wp-content/plugins/` and should keep
  separate git history.
- WordPress local runtime lives in `wordpress/`; generated core/runtime files are
  ignored, but setup/tooling inside `wordpress/` is tracked.
- `.ai/` is reserved for the AI brain and must not store project deliverables.
- Initial local environment will use Docker Compose with WordPress, MySQL, and
  WP-CLI.
- The root directory should contain only `AGENTS.md`, `.ai/`, `docs/`, and
  `wordpress/`.

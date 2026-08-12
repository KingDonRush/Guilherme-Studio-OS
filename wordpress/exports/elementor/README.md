# Elementor Source Exports

These files are deterministic, sanitized projections of the Elementor layout
source stored in the local WordPress database.

Use [`manifest.json`](manifest.json) first. It inventories all current pages and
Elementor library entries and identifies each rendering authority. Records with
Elementor layout data link to one JSON file under [`sources/`](sources/).

Each source export retains:

- local post ID, because Elementor conditions and widgets may reference it;
- title, slug, status, parent and route;
- PHP or Elementor rendering authority;
- page template, template type, conditions and stable page settings;
- decoded `_elementor_data` in its original element order;
- post content when present;
- plugin-owned role metadata required to interpret a template.

The export deliberately removes or omits:

- the local site URL and upload URL;
- edit locks and editor identity;
- generated CSS, screenshots, element cache and page asset cache;
- migrations and other transient runtime metadata;
- the WordPress database itself.

This is an inspection and handoff surface, not a database backup. Rebuild it
with `wordpress/scripts/export-elementor-source.php` after Elementor content or
Theme Builder conditions change.

# Versioned WordPress Surface

This directory contains the reproducible, Guilherme-owned part of the local
WordPress environment. It is not a copy of a complete WordPress installation.

## Start Here

- Theme implementation map:
  [`wp-content/themes/guilherme-portfolio/README.md`](wp-content/themes/guilherme-portfolio/README.md)
- Versioned Elementor page and template sources:
  [`exports/elementor/README.md`](exports/elementor/README.md)
- Local environment definition: [`docker-compose.yml`](docker-compose.yml)
- Reproducible setup and content operations: [`scripts/`](scripts/)

## Rendering Truth

The current frontend has two source layers:

| Surface | Source of truth | Entrypoint |
| --- | --- | --- |
| Portfolio home | PHP theme | `wp-content/themes/guilherme-portfolio/front-page.php` |
| Simple Budget case page | PHP theme | `wp-content/themes/guilherme-portfolio/page-simple-budget-plugin.php` |
| Generic WordPress pages | PHP theme frame plus post content | `page.php` or `index.php` |
| Elementor pages | Versioned `_elementor_data` plus a PHP frame | `exports/elementor/sources/` and `page-templates/` |
| Elementor Theme Builder header/footer/loops | Versioned Elementor template source | `exports/elementor/sources/` |
| Elementor template preview | PHP theme | `single-elementor_library.php` |

The theme is therefore present and auditable, but the rendered site is not
represented by PHP template files alone. Elementor stores layout structure in
WordPress post metadata. The sanitized JSON exports under
`exports/elementor/` make that database-owned source inspectable by GitHub and
external agents without committing the database.

## Important Non-Claims

- There is no current `single-project.php`. Do not infer one.
- Portfolio project cards on the PHP home read the `projects` CCT through the
  independently versioned Elementor Implementation Toolkit plugin.
- Several project pages in the local database are placeholders and fall back to
  the generic page template.
- Mina Forma has approved route mockups and assets beyond the routes currently
  implemented in the local Elementor database. Design approval is not evidence
  that a route has already been implemented.
- WordPress core, uploads, generated Elementor CSS/cache, third-party plugins,
  secrets, and the database remain intentionally excluded.

## Rebuild the Elementor Export

With the local environment available, run from the repository root:

```bash
docker compose -f wordpress/docker-compose.yml --env-file wordpress/.env run --rm \
  --user "$(id -u):$(id -g)" wpcli \
  eval-file scripts/export-elementor-source.php
```

The exporter rewrites only `wordpress/exports/elementor/manifest.json` and the
JSON files inside `wordpress/exports/elementor/sources/`. It removes local site
and upload URLs and excludes transient Elementor caches and edit locks.

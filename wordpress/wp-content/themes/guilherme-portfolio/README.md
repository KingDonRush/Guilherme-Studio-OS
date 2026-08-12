# Guilherme Portfolio Theme

This is the complete source of the custom theme currently active in the local
portfolio WordPress environment. It is one rendering layer of the site; pages
built with Elementor also depend on the versioned exports in
[`../../../exports/elementor/`](../../../exports/elementor/).

## Frontend Entrypoints

| File | Responsibility |
| --- | --- |
| `front-page.php` | Custom PHP portfolio home and selected-work interface |
| `page-simple-budget-plugin.php` | Custom PHP Simple Budget case page |
| `page.php` | Generic page frame and `the_content()` rendering |
| `index.php` | WordPress fallback rendering |
| `page-templates/elementor-canvas.php` | Elementor content without the theme header/footer |
| `page-templates/elementor-frame.php` | Elementor content with the theme header/footer |
| `single-elementor_library.php` | Direct preview for Elementor library templates; not a project single |
| `header.php` / `footer.php` | Theme navigation and footer frame |

## Runtime and Data Dependencies

- `functions.php` registers theme supports, assets, navigation, Elementor slots,
  and portfolio helpers.
- `src/Theme.php` boots the wp-admin Area Map and its repositories/CLI.
- `front-page.php` calls `gp_portfolio_projects()`, which reads the `projects`
  CCT through the Elementor Implementation Toolkit. If that independent plugin
  is unavailable, the theme deliberately renders an empty state.
- Elementor-built pages, headers, footers, and loops enter the PHP frame through
  `the_content()` or Elementor APIs. Their inspectable layout source lives in
  `../../../exports/elementor/sources/`.
- Mina Forma production assets and shared CSS live under `assets/images/mina-forma/`
  and `assets/css/mina-forma-kit.css`.

## Known Boundaries

There is no `single-project.php` in the current architecture. Older Project and
Workbench PHP classes were removed when the admin model moved to Areas. A future
project-detail implementation must be evidenced by a new template, an Elementor
Theme Builder condition/export, or an explicit route contract; agents must not
invent one from the portfolio records.

The theme repository surface is complete, but it is not a standalone database
snapshot. WordPress content, menus, Elementor post metadata, CCT rows, plugin
code, and uploads have separate ownership and lifecycle boundaries.

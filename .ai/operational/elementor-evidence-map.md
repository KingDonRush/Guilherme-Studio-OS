# Elementor Evidence Map

Date: 2026-05-15

## Local Baseline

WP-CLI check in `wordpress/`:

```bash
docker compose run --rm wpcli plugin list --fields=name,status,version --format=table
```

Relevant active plugins:

- `elementor` version `4.0.8`
- `elementor-mcp` version `1.5.1`
- `mcp-adapter` version `0.5.0`
- `3d-viewer-to-elementor` version `1.0.0`
- `simple-budget-plugin` version `2.0.1`

Treat this as the current local truth, not as a global Elementor assumption.

## Verified Reference Links

Elementor UI/customization:

- Advanced tab:
  <https://elementor.com/help/advanced-tab/>
  - Use this as evidence for CSS ID / CSS Classes placement in the Advanced
    panel.
- Regenerate CSS / Clear Files & Data:
  <https://elementor.com/help/regenerate-css-data/>
  - Use this when debugging missing or stale Elementor-generated CSS files.
- Custom icons:
  <https://elementor.com/help/custom-icons-pro/>
  - Use this before deciding whether a custom SVG/icon pack should be uploaded
    directly or implemented with native Elementor/Font Awesome icons.

Elementor development:

- Developer docs index:
  <https://developers.elementor.com/docs/>
- Editor controls:
  <https://developers.elementor.com/docs/editor-controls/index.html>
  - Controls are the source of widget panel settings and preview changes.
- Widget settings:
  <https://developers.elementor.com/docs/widgets/widget-settings/index.html>
  - Use this before reading saved widget control data.
- Scripts and styles:
  <https://developers.elementor.com/docs/scripts-styles/>
  - Use this before registering or enqueueing frontend/editor assets.
- Hooks:
  <https://developers.elementor.com/docs/hooks/>
  - Use this before extending editor/frontend behavior.
- Dynamic tags:
  <https://developers.elementor.com/docs/dynamic-tags/>
  - Dynamic tag claims need extra care. Elementor documents that active dynamic
    tags are a Pro feature, so do not promise dynamic-tag UX unless the local
    plugin/license context proves it.

## Operating Rules

- Do not assume a control exists because it sounds standard. Check docs, local
  source, schema, or MCP output.
- Do not assume Elementor Pro behavior in a free local environment.
- Do not assume an editor fix also works on the frontend; verify both.
- For custom widgets, separate evidence for:
  - PHP widget/control registration;
  - frontend render output;
  - editor preview behavior;
  - script/style registration;
  - responsive controls and CSS generation.
- For visual implementation, CSS ID and CSS Classes belong in Advanced settings,
  but exact selector behavior must be checked in the rendered DOM before wiring
  plugin logic to it.

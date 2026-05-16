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
- `simple-budget-plugin` version `3.0.0`

Treat this as the current local truth, not as a global Elementor assumption.

## Local Icon Baseline

Checked on 2026-05-15 against local Elementor files:

- Font Awesome Free `5.15.3` is bundled at
  `wordpress/wp-content/plugins/elementor/assets/lib/font-awesome/`.
- Elementor eicons are bundled at
  `wordpress/wp-content/plugins/elementor/assets/lib/eicons/`.
- Font Awesome local brand/solid/regular JSON confirms native availability for:
  WordPress, Elementor, LinkedIn, WhatsApp, Instagram, GitHub, PHP,
  JavaScript, CSS3, Git, Yoast, envelope, eye, puzzle-piece, briefcase,
  desktop, code, shopping-cart, and performance via `tachometer-alt`.
- Elementor eicons CSS/JSON confirms local Elementor icons for WordPress,
  Elementor, WooCommerce, cart, code, and desktop.
- No local Font Awesome/eicons match was found for ACF, Crocoblock,
  Three.js, or Rank Math.
- Yoast is available locally as Font Awesome `brands:yoast`; do not generate a
  duplicate Yoast raster icon unless a later visual direction explicitly needs
  a non-native custom mark.

For portfolio visuals, do not generate duplicate icons for the confirmed local
native set. Use generated or externally verified custom assets only for missing
icons.

3D Viewer stack evidence:

- `wordpress/wp-content/plugins/3d-viewer-to-elementor/assets/js/viewer-core.js`
  imports `three`, `GLTFLoader`, `DRACOLoader`, and `OrbitControls`.
- `wordpress/wp-content/plugins/3d-viewer-to-elementor/src/Includes/Enqueue.php`
  maps `three` to jsDelivr `three@0.158.0`.

Therefore the portfolio 3D Viewer badge should say Three.js, not generic `3D`.

## Elementor Free Template Builder Pattern

Checked during `simple-budget-plugin` v2.2.0 work on 2026-05-15:

- Elementor Free exposes local templates through the `elementor_library` post
  type and Elementor documents.
- A plugin can create and mark its own templates with post meta, redirect the
  user into the Elementor editor, then render only those validated templates on
  the frontend with Elementor's frontend renderer.
- Elementor Canvas is the correct editor surface for plugin-owned modal or
  fragment templates because the local Elementor page-template module describes
  Canvas as no header/footer, while Full Width includes header and footer.
- For Simple Budget cart modal templates, create or normalize the document as an
  Elementor library `page` template and set both `_wp_page_template` and the
  Elementor page setting `template` to `elementor_canvas`.
- This pattern gives implementers an Elementor-native editing surface without
  making the public plugin depend on Elementor Pro Theme Builder or Pro
  dynamic-tag behavior.
- During `simple-budget-plugin` v2.3.0 work, the plugin architecture was kept
  focused by assigning item-scoped behavior to `Budget Listing` and opener/global
  behavior to `Budget Button`. Remove and quantity controls need row context;
  modal/drawer presentation can remain a configurable shell around the same
  Elementor template content.
- Local Elementor Button source (`includes/widgets/traits/button-trait.php`)
  places native `icon_align` and `icon_indent` in content controls. Simple
  Budget intentionally groups those same control IDs under `Style > Icon` for
  its implementer workflow while keeping Elementor-compatible button markup and
  selector behavior.
- Local Elementor Icon Box source (`includes/widgets/icon-box.php`) uses a
  visual `CHOOSE` control for Start, End, Top, and Bottom positioning. Simple
  Budget should mirror that control style for `Budget Listing` remove-button
  positioning, but keep the existing `remove_position` setting ID so saved
  templates remain compatible.
- For Simple Budget cart shell dimensions, use Elementor's responsive control
  API and pass `data-sbp-panel-width`, `data-sbp-panel-width-tablet`, and
  `data-sbp-panel-width-mobile` to the frontend. The popup shell is outside the
  widget wrapper, so selector-only responsive CSS is not enough for this runtime
  path.
- Extend that same approach to strategic runtime options whose effect is outside
  Elementor's generated wrapper CSS: cart shell type, cart shell animation,
  overlay opacity, and listing remove-button position. Use responsive controls,
  emit explicit desktop/tablet/mobile `data-*` attributes, then resolve the
  active value in frontend JavaScript with Elementor breakpoints when available.
- When the plugin has a native Elementor widget flow, avoid keeping shortcode or
  fixed-ID button compatibility as a permanent public API. If a required
  template is missing, show a setup prompt that directs implementers to the
  plugin-owned template builder rather than rendering a second legacy cart UI.

Use this as the default architecture for free-Elementor plugin surfaces that
need rich layout editing: plugin admin owns creation/discovery, Elementor owns
layout editing, widgets own template selection, and frontend code owns
validation, rendering, and fallback behavior.

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

# Visual Asset Generation Policy

## Rule

When the task is to create or refine visual assets for the portfolio, use
imagegen as the source-of-truth generation step.

This applies to:

- hero concepts;
- profile treatments;
- icon packs with visual style requirements;
- textured backgrounds;
- decorative shapes;
- visual dividers;
- card artwork;
- raster assets intended to match an approved image direction.

## CLI Boundary

CLI tools may be used for file operations only:

- copying files;
- cropping already-approved generated assets;
- removing chroma key from already-approved generated assets;
- syncing assets into WordPress;
- importing files into the Media Library;
- validating image dimensions or MIME types;
- optimizing exported files after approval;
- generating implementation wrappers from already-approved assets.

CLI tools must not be used as the primary visual creator when fidelity matters.

## SVG / CSS Boundary

Handwritten SVG or CSS is acceptable only for:

- technical placeholders;
- simple geometric implementation masks;
- layout experiments;
- production implementation after an imagegen-approved visual direction exists.

This exception does not apply to icons.

Icons are a strict asset category in this project:

- use icons already available from WordPress, Elementor, the current theme, or
  an explicitly approved local icon package; or
- create the icon through imagegen, then process, optimize, and register it as a
  normal asset.

Do not draw new icons with handwritten SVG, CSS, canvas, HTML, emoji, ASCII, or
ad hoc code. Do not generate icon path data locally. Do not treat a coded icon
as a final asset because it is "simple".

Handwritten SVG/CSS assets must be labeled as implementation placeholders unless
the user explicitly approves them as final.

## Current Correction

The portfolio SVG icon pack and `profile-edge-wave.svg` were created manually.
Treat them as technical placeholders, not final visual assets.

For the final portfolio implementation, regenerate or refine the relevant visual
assets with imagegen first, then use CLI only to place, import, optimize, or wire
them into WordPress.

## WordPress Media Format Rule

Do not import PNG implementation assets into WordPress Media Library.

For portfolio assets that will be used in WordPress:

- use WebP for raster images, transparent cutouts, textured backgrounds, and
  generated icons;
- use SVG only when the asset is intentionally vector and safe/sanitized for the
  chosen implementation path;
- treat PNG as a temporary/intermediate format for imagegen output, chroma-key
  removal, inspection, or archival source references only.

Before importing raster assets into WordPress:

- crop transparent assets to their alpha bounding box unless a specific canvas
  size is required by the layout;
- export optimized WebP;
- validate MIME, dimensions, alpha channel, and file size;
- import the WebP file, not the PNG source.

## Approved Image Promotion Rule

Explicit user approval promotes an implementation-bound raster image into the
WordPress delivery pipeline. Do not leave an approved site asset only as a PNG,
in the imagegen cache, or outside the Media Library.

For every approved raster image intended for a public WordPress page:

1. Preserve the original generated PNG, chroma source, or other editable source
   inside the project assets folder.
2. Create a production WebP with:
   - dimensions appropriate to its actual display role;
   - alpha preserved when the asset is transparent;
   - visually lossless practical compression;
   - no accidental empty canvas or background residue.
3. Use a semantic, lowercase, hyphen-separated filename that describes the
   subject and role without keyword stuffing.
4. Prepare SEO/accessibility metadata:
   - human-readable attachment title;
   - concise, factual alt text describing the visible subject or function;
   - caption only when the page needs a visible caption;
   - description only when it adds useful editorial context.
5. Import the WebP into the WordPress Media Library unless an equivalent
   attachment already exists.
6. Verify attachment ID, URL, MIME type, dimensions, file size, title, and alt
   text after import.
7. Record the production path and attachment ID in the relevant asset manifest.

Exceptions:

- chroma sources, extraction PNGs, and archival originals are not imported;
- full-page mockups used only as Elementor implementation references are not
  imported unless the page will display the mockup itself;
- screenshots remain PNG when legibility requires lossless text rendering, but
  they still receive semantic filenames, metadata, and Media Library import
  when approved for public display.

Treat approval as the trigger. Do not wait for a later cleanup or implementation
request to finish optimization and Media Library registration.

## Generated Image Persistence Rule

When any generated image becomes part of practical work, save it into the
project immediately instead of leaving it only in Codex/imagegen cache.

Treat the user's intent to save as explicit or implicit. Save generated images
when the user:

- approves a direction;
- asks to implement, code, use, extract, crop, convert, or turn it into assets;
- asks for frames, states, icons, layouts, mockups, references, or variants that
  are meant to guide implementation;
- reacts as if the image is now the source of truth for the next step.

Default persistence behavior:

1. Copy the original generated source image into a project-owned assets folder.
2. Use clear semantic names when the frame meaning is known.
3. If the meaning is not fully known yet, use stable numbered names and create a
   contact sheet or manifest so the user can point at frames by number.
4. Preserve source PNGs for design review in `docs/assets/...`.
5. Export production-ready WebP/SVG/etc. separately only when wiring into
   WordPress, plugin assets, or frontend code.
6. Record where the saved files live before moving to implementation.

Do not wait for a later cleanup pass to save images the user clearly wants to
put into practice. The cache path is not the project source of truth.

## Asset Registry Rule

The portfolio asset source of truth lives in `docs/assets/`.

## Root Zero-Asset Rule

Never leave generated images, screenshots, exports, ZIPs, or visual references in
the repository root.

The root may contain only top-level project files such as `AGENTS.md`, docs
entry points, repository configuration, and other structural files explicitly
allowed by the project guide.

If an image or visual file is created during exploration, QA, browser capture,
imagegen review, Lovable handoff, or WordPress verification, move it immediately
to the correct folder:

- `docs/assets/sources/imagegen/` for raw generated sources;
- `docs/assets/sources/screenshots/` for browser or QA screenshots;
- `docs/assets/<project>/` for project-scoped candidates and approved assets;
- `docs/assets/distribution/` for ZIPs, README media, Open Graph, social, or
  external handoff packages;
- `wordpress/wp-content/...` only when the file is an implementation asset
  actively used by the WordPress runtime.

When the destination is not clear yet, use a dated quarantine folder under
`docs/assets/sources/` and add a short README explaining why the files are
there. Do not keep them in the root while deciding.

Before pausing, switching tasks, or reporting completion, run a root asset check
and resolve every hit:

```bash
find . -maxdepth 1 -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' -o -iname '*.svg' -o -iname '*.gif' -o -iname '*.zip' \) -print
```

Before creating, promoting, importing, or distributing visual assets, use:

- `.ai/operational/asset-registry-protocol.md` for the reasoning checklist;
- `docs/assets/README.md` for the folder contract;
- `docs/assets/asset-taxonomy.md` for function, channel, status, source, and
  implementation-role tags;
- `docs/assets/asset-manifest.json` for active, approved, production,
  WordPress-imported, or distribution-bound assets.

Do not put portfolio visual assets in the repository root. The root remains for
top-level project structure only.

When an asset becomes active work, register it if it is any of these:

- approved by Guilherme;
- referenced by WordPress, Elementor, a theme, a mu-plugin, or plugin code;
- imported into the WordPress Media Library;
- reused across pages or projects;
- prepared for GitHub README, GitHub social preview, release notes, social
  media, Open Graph, or another external distribution channel;
- used as visual proof for a case study.

The manifest does not need to track every exploratory draft. It should track
assets with practical consequence.

Manifest entries must classify assets by:

- `functions`: identity, product, context, proof, iconography, texture-depth,
  composition, interaction-state, roleplay, implementation;
- `channels`: portfolio-site, wordpress-runtime, wordpress-media,
  elementor-reference, github-readme, github-social-preview, release-notes,
  social-post, case-study, demo-site, archive-source;
- `status`: idea, candidate, approved, production, imported, superseded,
  rejected, source;
- `source_type`: imagegen, screenshot, extracted, chroma, transparent-cutout,
  svg-code, external-reference, manual-composite;
- `implementation_role`: background, hero, profile, icon, badge, card-art,
  product-image, screenshot, browser-frame, device-frame, texture, overlay,
  divider, thumbnail, opengraph, readme-banner, readme-proof.

For GitHub distribution, treat assets as part of the public plugin evidence
pack, not as leftover page art. Prefer real editor screenshots, frontend
behavior captures, README hero media, flow frames, and social preview images
that are grounded in verified plugin behavior.

## No Code-Created Icons

Codex must not create new icon artwork through code in this repository.

Allowed icon sources:

1. native WordPress, Elementor, or theme icons already present locally;
2. official/local icon assets already approved for the project;
3. imagegen-created icons, followed by the normal source, extraction,
   optimization, manifest, and WordPress Media Library pipeline when they become
   implementation-bound.

Forbidden icon sources:

- handwritten SVG;
- CSS-only icons;
- canvas-drawn icons;
- HTML character/emoji icons used as visual artwork;
- locally generated path data;
- improvised geometric symbols in code.

If an icon is missing from WordPress/Elementor/local approved assets, pause the
implementation, generate the icon with imagegen, process it as an asset, and
continue only after it is saved in the appropriate `docs/assets/` path.

## Approved Layout To Asset Pipeline

When a generated layout is being used as the visual source for a WordPress,
Elementor, or plugin interface, follow this sequence:

1. Generate a full layout/concept image first.
2. Wait for explicit user approval of that exact direction.
3. After approval, derive the production assets from that visual language:
   icons, palette, spacing, states, highlights, surfaces, and structural motifs.
4. For transparent icons or cutouts, prefer this project pipeline:
   - generate or derive the asset from the approved visual direction;
   - use a flat removable background when native transparency is unavailable;
   - remove the background locally;
   - crop to the alpha bounding box so the file ends at the last visible pixel;
   - export optimized WebP for WordPress usage.
   - run the global `approved-asset-fidelity` skill when an asset is extracted
     from an approved mockup or must preserve reference-specific geometry,
     shadows, and composition;
   - require its four-edge alpha check before promoting the asset.
5. Use code-native drawing only as the deterministic cleanup layer after the
   imagegen-approved direction exists. This is acceptable for removing visual
   hallucinations, aligning icon proportions, or making a repeatable asset pack.
6. Do not treat this as a replacement for the imagegen skill. It is a project
   workflow that ties image approval, asset extraction, and implementation
   together without overriding other image-related skills or policies.

This workflow is the preferred balance for custom UI systems in this portfolio:
imagegen defines the approved visual direction, then local deterministic work
turns that direction into clean, transparent, tightly cropped implementation
assets.

An approved mockup is a visual contract, not loose inspiration. When the exact
asset already exists inside it, deterministic extraction takes precedence over
regeneration. Generative output that changes proportions, object count, visual
weight, or internal placement must be rejected even when it looks polished.

## Micro-Component Asset Method

For portfolio pages, demo sites, case studies, and WordPress/Elementor visual
work, "micro-components" means practical visual assets that complete a designed
page, not invented conceptual objects. Do not generate abstract components just
because a composition could be described metaphorically.

Use this method as an image-first design loop:

1. Define the route job, content hierarchy, verified behavior, design-system
   boundary, and Elementor feasibility constraints.
2. Generate the complete page as one coherent visual reference.
3. Audit hierarchy, density, product truth, route boundaries, and Elementor
   feasibility before presenting the image.
4. Iterate on that page image until Guilherme explicitly approves it.
5. Only after approval, decompose the page into:
   - Elementor/WordPress-native elements;
   - CSS/JS/SVG implementation elements;
   - existing icon-library elements;
   - real screenshots;
   - raster assets that must be generated or extracted.
6. Generate, capture, extract, treat, optimize, and register only the assets in
   the final category or assets Guilherme explicitly requests.
7. Produce an Elementor-oriented handoff. Guilherme owns final implementation
   and visual tuning unless he explicitly delegates code.

Do not start HTML, theme, or Elementor implementation during the visual-design
phase. Do not generate a speculative asset pack before the complete page
direction is approved.

Preferred micro-component asset types:

- profile photos, avatar treatments, portraits, and people cutouts;
- product photos, product mockups, object cutouts, and scene imagery;
- hero/background images when CSS gradients or fake UI panels look cheap;
- texture plates, lighting overlays, paper/material surfaces, shadows, glows,
  transparent effects, and atmospheric depth layers;
- bespoke icon packs when existing Elementor/WordPress/icon-library options do
  not match the approved visual direction;
- stack/product/project badges that need a consistent custom visual language;
- screenshots, device mockups, browser frames, and visual proof assets when
  real captures are unavailable or need presentation treatment;
- decorative but meaningful motifs that are image-like rather than layout-like,
  such as a portrait edge treatment, portfolio background plate, or product
  silhouette;
- chroma-key sources and transparent PNG/WebP cutouts that will be cropped,
  optimized, and placed by code;
- media-library-ready images that will be displayed publicly in WordPress.

Do not use imagegen for:

- normal cards, grids, columns, accordions, tabs, buttons, navs, lists, spacing,
  dividers, simple icons, or connector lines that code can produce reliably;
- fake screenshots of Elementor controls when fidelity to the real editor
  matters and a real screenshot or deterministic recreation is available;
- abstract metaphor objects that do not map to a visible page need;
- one-off filler imagery created before the page has an actual asset gap;
- full asset packs generated before the page reveals where the assets are
  actually needed;
- text-heavy UI assets where the image model may hallucinate labels, prices,
  controls, or feature claims.

When a composition needs lines that follow points, anchors, cards, or visual
nodes, prefer a coded layer:

- place the real micro-assets as HTML elements;
- expose anchor points with data attributes;
- draw connectors with SVG or canvas based on the element positions;
- update paths on resize and carousel/state changes;
- keep the generated imagery responsible for texture and subject matter, not
  for layout mechanics.

Decision rule:

If the page can express the element cleanly with code, code it. If code makes
the element look cheap, fake, photographic-but-not-photographic, or visually
underpowered, generate a micro-asset and compose it with code.

## Multi-Frame Image Requests

Do not collapse multi-frame requests into a single storyboard board unless the
user explicitly asks for one combined image, contact sheet, board, or grid.

Default behavior:

- "5 imagens", "5 versões", or a correction after a storyboard mistake means
  generate five separate image files.
- "5 frames" should be clarified from context. If the user is asking to inspect
  details/minutiae, prefer separate images because each frame needs enough room
  to be useful.
- A single combined board is acceptable only when the user asks for a storyboard,
  comparison sheet, contact sheet, or one image containing multiple frames.

For UI/product mockups, separate frames should share a coherent visual system
but each image should focus on one structural view deeply enough to guide
implementation.

## Portfolio Website Mockup Packs

When Guilherme asks for pages, sites, demos, or visual directions for portfolio
website work, first classify whether the request is for implementation or for
images. In the portfolio-site workflow, the default output is image/mockup
generation, not HTML/CSS/WordPress implementation. Guilherme builds public site
pages in Elementor; Codex should only implement UI code for WordPress/plugin
admin surfaces unless Guilherme explicitly asks otherwise.

Before generating or presenting any public-site mockup, run the global
`ux-ui-design-director` skill. It is the mandatory structural gate for:

- defining the page's one job, memorable truth, first three eye stops, content
  budget, evidence plan, and Elementor implementation map before generation;
- separating portfolio-case identity from fictional demo-site identity;
- rejecting the first generation when hierarchy, density, information
  duplication, AI-convergence, or implementation feasibility is weak;
- inspecting the actual output before showing it to Guilherme.

Do not present a mockup merely because it follows the written section list.
Structure, hierarchy, and evidence must pass the skill's review gate first.

For plugin or project demos, separate the pack into two design systems before
generating:

1. Portfolio case frame:
   - belongs to Guilherme's portfolio;
   - may use the portfolio visual language, author identity, stack, decisions,
     evidence, and links to the demo.
2. Fictional demo site frames:
   - belong to a roleplay company/client site;
   - must use their own brand identity, header, copy, imagery, and visual
     rhythm;
   - must not inherit portfolio navigation, `kingdonrush`, GitHub links,
     technical proof sections, plugin explanation, or developer stack badges.

Before generating a multi-page demo, state the frame map in plain language.
Common frames are:

- portfolio case page;
- fictional company/institutional landing page;
- search or listing results page;
- single product/post/detail page;
- optional interaction state frames when requested.

Do not compress these views into one image. The institutional landing page
should behave like a normal company page: introduce the company, communicate the
offer, show a few paths or highlighted items, and guide visitors to the listing
or detail pages. Search controls, dense result listings, product detail content,
and interaction states belong in their own frames unless the user explicitly
asks to combine them.

For demo frames that showcase a plugin, keep the plugin mostly invisible inside
the fictional site. Show the user-facing behavior the plugin enables, but do
not write plugin marketing copy inside the fictional company page. Capability
claims still need local evidence from the plugin source or docs before they
appear in any frame.

## Same-Layout State Frames

When the user asks for "frames de estados" or corrects a multi-frame request as
states of the same layout, do not create different conceptual screens. Generate
separate images that preserve the same base composition, platform context,
navigation, proportions, and information architecture. Only the selected object,
panel state, modal/drawer state, validation state, or preview state should
change.

For WordPress/Elementor plugin admin mockups:

- keep the WordPress admin context visible unless the user explicitly asks for a
  standalone product shell;
- keep the same Toolkit top bar, WP admin sidebar, canvas, and inspector between
  state frames;
- vary states such as default, selected module, expanded settings, preview modal,
  validation/error, add/reorder, or loading;
- do not reinterpret each frame as a different page or feature area unless the
  user explicitly asks for that.

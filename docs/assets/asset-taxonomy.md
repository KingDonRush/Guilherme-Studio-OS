# Asset Taxonomy

This taxonomy prevents visual work from becoming a pile of unrelated images.
Classify assets by function, channel, lifecycle, and implementation role before
using them in a public page or distribution surface.

## Core Principle

Code owns structure, behavior, layout, and responsive mechanics.

Generated or captured assets own identity, realism, subject matter, texture,
visual proof, channel presentation, and page atmosphere.

## Function Taxonomy

Use one or more `function` tags.

### `identity`

Assets that identify Guilherme, a portfolio case, a plugin, or a fictional demo
brand.

Examples:

- profile photo, avatar, portrait cutout;
- personal badge, monogram, signature, availability badge;
- project logo, fictional company logo, case mark;
- author/profile image for README or social previews.

### `product`

Assets that show a product, service, offer, or catalog item.

Examples:

- product photo, product cutout, object mockup;
- package, physical item, material variant;
- catalog thumbnail, service-package image;
- before/after product state.

### `context`

Assets that establish the place, environment, or world around the page.

Examples:

- hero background, office/showroom/store scene;
- desk, wall, room, landscape, city, studio;
- institutional imagery for a fictional company;
- environment where a service or product is used.

### `proof`

Assets that prove execution, implementation, or product behavior.

Examples:

- real screenshot, treated screenshot, browser frame;
- plugin/editor capture, frontend state capture;
- README proof image, demo GIF frame, comparison image;
- device mockup when it shows real work rather than decoration.

### `iconography`

Assets that compress meaning into symbols.

Examples:

- stack icons, custom badges, project badges;
- feature icons, category icons, filter icons;
- social/contact icons when native icon libraries do not fit;
- process symbols and visual labels.

Iconography has a stricter source rule than other assets. New icon artwork must
come from an existing WordPress/Elementor/theme/approved local icon asset or
from imagegen. Do not create new icons through handwritten SVG, CSS, canvas,
HTML characters, emoji, or generated path data.

### `texture-depth`

Assets that make the page feel tactile, lit, layered, or less flat.

Examples:

- glow, shadow, grain, paper, glass, acrylic, metal, fabric;
- lighting plate, atmospheric overlay, transparent effect;
- section background plate, vignette, depth layer.

### `composition`

Assets that shape the page visually without being normal UI primitives.

Examples:

- portrait edge treatment, hero split, visual mask;
- product silhouette, rich divider, art-directed frame;
- background motif, custom section plate.

### `interaction-state`

Assets that show a specific UI or product state.

Examples:

- modal/drawer open state, empty state, loading state;
- success/error state, selected item state;
- cart/review state, carousel state, expanded detail preview.

### `roleplay`

Assets that belong to a fictional client/company/demo world.

Examples:

- fictional company photo, product line, team, facility;
- demo brand imagery;
- institutional, catalog, search, and detail-page imagery that must not inherit
  Guilherme's portfolio identity.

### `implementation`

Assets created for actual delivery, not just ideation.

Examples:

- WebP production export, transparent cutout, Open Graph image;
- WordPress Media Library asset, README banner, thumbnail;
- chroma source, alpha PNG, source screenshot, optimized derivative.

## Channel Taxonomy

Use one or more `channel` tags.

- `portfolio-site`: public portfolio pages.
- `wordpress-runtime`: files referenced by the local WordPress build.
- `wordpress-media`: assets imported into the WordPress Media Library.
- `elementor-reference`: mockups or references Guilherme will rebuild in Elementor.
- `github-readme`: README images, banners, screenshots, or badges.
- `github-social-preview`: repository social preview / Open Graph image.
- `release-notes`: media for changelogs, release posts, or announcements.
- `social-post`: LinkedIn, Instagram, X/Twitter, or similar posts.
- `case-study`: long-form project narrative.
- `demo-site`: fictional/client/demo site imagery.
- `archive-source`: source, chroma, raw screenshot, or generated original.

## Lifecycle Taxonomy

Use exactly one lifecycle `status`.

- `idea`: rough visual reference or prompt output, not approved.
- `candidate`: plausible direction under review.
- `approved`: Guilherme approved the visual direction or asset.
- `production`: optimized and ready for a public surface.
- `imported`: production asset imported into WordPress Media Library.
- `superseded`: replaced by a newer asset.
- `rejected`: kept only for context or evidence of a rejected direction.
- `source`: raw editable/generation/capture source.

## Source Taxonomy

Use one or more `source_type` values.

- `imagegen`: generated raster image.
- `screenshot`: real capture from browser, WordPress, Elementor, or GitHub.
- `extracted`: cropped/extracted from an approved mockup.
- `chroma`: chroma-key generation source.
- `transparent-cutout`: alpha PNG/WebP cutout.
- `svg-code`: deterministic SVG/code-native asset. Not allowed for newly
  created icons; retained only for historical assets, implementation masks, or
  non-icon technical shapes.
- `external-reference`: third-party reference that must not be treated as owned.
- `manual-composite`: assembled from multiple owned assets.

## Implementation Role

Use one or more `implementation_role` values.

- `background`
- `hero`
- `profile`
- `icon`
- `badge`
- `card-art`
- `product-image`
- `screenshot`
- `browser-frame`
- `device-frame`
- `texture`
- `overlay`
- `divider`
- `thumbnail`
- `opengraph`
- `readme-banner`
- `readme-proof`

## Micro-Component Decision Checklist

Before generating or using an asset, answer:

1. Is this structure, layout, text, spacing, or interaction? Use code or
   Elementor.
2. Is this a line that follows points, cards, anchors, or moving state? Use
   SVG/canvas/JS, unless it is an icon.
3. Does this require a face, product, place, material, texture, lighting,
   atmosphere, or visual identity? Use imagegen or a real captured asset.
4. Is this a new icon? Use an existing WordPress/Elementor/theme/approved asset
   or generate it with imagegen. Never draw it in code.
5. Does this need fidelity to Elementor, WordPress, GitHub, or plugin behavior?
   Prefer real screenshots or deterministic reconstruction.
6. Will this be public in WordPress? Promote to WebP, SEO metadata, and Media
   Library after approval.
7. Will this be used outside the website? Assign GitHub/social/Open Graph
   channel metadata.

## Directory Convention

Use this convention for new or migrated project-specific assets:

```text
docs/assets/
  INDEX.md
  SYSTEM.md
  packs/
    <project-or-site>/
      README.md
      ASSET_MAP.md
      prompts/
      mockups/
      sources/
      production/
      wordpress/
      manifests/
      deprecated/
  shared/
    identity/
    icons/
    textures/
    backgrounds/
  distribution/
    github/<project>/
    social/<campaign-or-project>/
    opengraph/<project-or-page>/
  sources/
    imagegen/<project-or-date>/
    screenshots/<project-or-date>/
    chroma/<project-or-date>/
```

`packs/<slug>/` is the human entrypoint. Legacy locations such as `portfolio/`,
`simple-budget-demo/` and `sources/` may remain until a dedicated migration
updates references and manifests. Do not move old assets only to satisfy this
convention unless the move is part of a deliberate cleanup.

## Required Manifest Fields

Every manifest entry for an active asset should include:

- `id`
- `title`
- `project`
- `status`
- `functions`
- `channels`
- `source_type`
- `implementation_role`
- `tags`
- `files`
- `approved`

Use optional fields for:

- WordPress attachment metadata;
- alt text;
- prompt/source notes;
- superseded asset IDs;
- related GitHub repository;
- dimensions, MIME type, and file size.

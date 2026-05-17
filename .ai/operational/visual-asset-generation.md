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

# Lovable Prompt

Implement the attached Guilherme Silva portfolio homepage from the supplied
reference image and asset package.

## Objective

Create a professional, production-quality WordPress developer portfolio home.
It must communicate two capabilities immediately:

1. Custom WordPress systems and plugin development.
2. Design-to-WordPress implementation.

The desktop composition must fit completely inside one `100svh` viewport at
approximately `1672x941`. Do not add a header, footer, or extra sections.

## Fidelity

- Treat `reference/portfolio-home-100vh-approved-v1.png` as the composition,
  hierarchy, proportion, color, and spacing reference.
- Rebuild the interface as semantic responsive code.
- Never use the full mockup or any `reference-panels/*` file as a page
  background or flattened final card.
- The reference-panel crops are inspection aids only.
- Use the production media under `assets/` for actual imagery.
- Preserve Guilherme's face and portrait exactly. Do not regenerate, reshape,
  mirror, or expand his body.

## Desktop Structure

Build a two-zone technical casebook:

- Left identity panel: approximately 23% of the viewport.
- Right selected-work area: approximately 77%.
- Use a thin cyan registration divider.
- Near-black technical canvas, warm off-white surfaces, black typography, cyan
  accents, restrained green status dot, subtle texture.

### Identity

Include:

- `OPEN TO REMOTE ROLES + SELECT PROJECTS`
- Approved portrait from
  `assets/identity/guilherme-silva-profile-cutout.webp`
- `Guilherme Silva`
- GitHub icon and `kingdonrush`, visually secondary
- `WordPress Developer`
- `Custom Plugins`
- `Elementor`
- `WooCommerce`
- `Design Implementation`
- `Maintainable WordPress systems and responsive, client-ready builds.`
- LinkedIn, WhatsApp, Email, Instagram, and GitHub actions

Use the portrait inside a fixed crop. No text may overlap the face.

### Selected Work

Top metadata:

- `SELECTED WORK / 2026`
- `Discuss a project`

Category:

- `01 / CUSTOM WORDPRESS SYSTEMS`

Feature **Simple Budget Plugin** as the dominant project. Rebuild its preview
with HTML/CSS:

- Elementor-like editor panel with `Content`, `Style`, and `Advanced`
- Budget Button controls
- Product block using the provided meeting-pod image
- `Add to quote`
- Budget Listing with provided product media
- Cart-template preview

Copy:

- `Composable quote workflows for Elementor projects.`
- WordPress, Elementor, PHP, and JavaScript marks
- One GitHub action
- `View case`

Secondary modules:

1. `3D Viewer for Elementor`
   - Use the provided lounge-chair asset.
   - Build the viewport controls and material panel as HTML/CSS.
   - WordPress, Elementor, JavaScript, Three.js.
   - One GitHub action and `View case`.
2. `WooCommerce Toolkit for Elementor`
   - Rebuild the widget matrix as HTML/CSS.
   - Product Grid, Product Carousel, Add to Cart, Mini Cart, Checkout, Cart,
     Filters, Wishlist, Product Tabs.
   - WooCommerce, Elementor, PHP, JavaScript.
   - One GitHub action and `View case`.

Second category:

- `02 / DESIGN-TO-WORDPRESS BUILDS`

Create three compact proof panels:

1. `Landing Page Implementation`
   - Labels: `DESIGN`, `WORDPRESS`, `MOBILE`
   - Use `assets/architecture/landing-page-office-blue-hour.webp`
   - `Design fidelity · responsive Elementor build`
2. `Institutional Website`
   - Labels: `FRONTEND`, `CONTENT MODEL`
   - Use `assets/architecture/institutional-office-daylight.webp`
   - `Structured content · reusable page system`
3. `WooCommerce Store`
   - Labels: `CATALOG`, `FILTERS`, `MOBILE`
   - Use the provided product assets.
   - Do not show prices.
   - `Custom templates · filters · performance`

Use `View case` only for these three implementation projects. Do not add GitHub
icons to them.

## Engineering Requirements

- React and TypeScript using Lovable's normal stack.
- Semantic HTML and reusable components.
- CSS Grid/Flexbox with stable explicit dimensions.
- `height: 100svh` and `overflow: hidden` only for sufficiently large desktop
  viewports where all content fits.
- At narrower widths, switch to normal vertical scrolling and intentional
  stacking. Do not scale the whole page down.
- Use `clamp()` only for bounded spacing/type adjustments, not viewport-width
  font scaling.
- Use only bundled/approved icons or icons already available in the target
  WordPress/Elementor/theme environment.
- If a required icon is missing or visually weak, create it through imagegen and
  process it as an asset before implementation.
- Do not create new icons with Lucide, Simple Icons, handwritten SVG, CSS,
  canvas, HTML characters, emoji, generated path data, or improvised code.
- Accessible labels, keyboard focus, useful alt text, and WCAG AA contrast.
- Respect `prefers-reduced-motion`.
- Avoid unnecessary dependencies and animation.

## Rejections

Do not:

- invent prices, metrics, clients, certifications, or years of experience;
- invent plugin controls or admin screens;
- add dashboards, terminal windows, code rain, generic gradients, glows, or
  decorative connector arrows;
- repeat GitHub icons;
- turn every area into an identical rounded card;
- flatten reference panels into images;
- crop or overflow content outside the desktop viewport;
- replace supplied media with stock images.

First implement the desktop reference accurately, then add tablet and mobile
recomposition without changing the desktop hierarchy.

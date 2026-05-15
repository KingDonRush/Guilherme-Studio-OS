# Portfolio Systems Concept

Date: 2026-05-14

Status: concept only. Do not implement with Elementor MCP. Use Elementor,
Playwright, browser snapshots, and MCP tooling later only for manual QA, bug
checks, and visual inspection.

## Core Decision

The portfolio should not feel like a collection of disconnected demo pages. It
should feel like a small WordPress studio lab with seven proof systems:

1. Portfolio home: the hiring funnel.
2. `simple-budget-plugin` demo: quote/catalog workflow proof.
3. `3d-viewer-to-elementor` page: advanced plugin and JavaScript proof.
4. WooCommerce interaction layer: JetWooBuilder-style product action, filter,
   and template proof.
5. Design implementation landing page: design-to-WordPress proof.
6. Institutional website: multipage client-site proof.
7. WooCommerce store: ecommerce proof.

Public copy should be English-first because the goal is international work.
Internal notes can stay in Portuguese.

## Acceptance Standard

Every system must answer one recruiter/client question within a few seconds:

- Can this developer implement a polished design?
- Can this developer work with Elementor without creating fragile hacks?
- Can this developer write useful WordPress plugins?
- Can this developer handle WooCommerce and dynamic templates?
- Can this developer explain decisions, QA, and performance tradeoffs?

A page fails if it only looks decorative. Each page needs visible proof: real
page structure, dynamic behavior, filters, product data, plugin controls, code
angle, QA notes, or implementation constraints.

## Research Signals Behind The Direction

Recent WordPress hiring signals point to a mixed profile: frontend taste,
Elementor/WooCommerce delivery, PHP/JS/CSS skill, performance, SEO, QA, and
handoff documentation.

- Toptal frames WordPress developers as both theme/plugin builders and people
  who can turn responsive design into working themes/plugins:
  https://www.toptal.com/developers/wordpress/job-description
- A WordPress Jobs post from 2026-05-11 asks for Elementor Pro, WooCommerce,
  custom pages, conversion checkout, SEO/schema, Core Web Vitals, QA, docs, and
  portfolio links:
  https://jobs.wordpress.net/job/wordpress-elementor-woocommerce-developer/
- Elementor's WooCommerce Builder supports product single/archive templates and
  menu cart patterns, but requires Elementor Pro:
  https://elementor.com/help/woocommerce-widgets-pro/
- WooCommerce core checkout blocks are customizable but dynamic; WooCommerce
  warns against relying on internal block HTML structure for CSS:
  https://woocommerce.com/document/woocommerce-store-editing/customizing-cart-and-checkout/checkout-block/
  https://developer.woocommerce.com/docs/theming/block-theme-development/cart-and-checkout/

## System 1: Portfolio Home

Working name: `[Your Name] - WordPress Implementation Engineer`

Purpose: make the visitor understand the positioning immediately, then route
them to proof.

Target signal:
- WordPress developer who implements designs, creates Elementor-compatible
  solutions, builds plugins, and understands WooCommerce/performance.

Page role:
- Main homepage at `/`.
- Not a generic personal landing page.
- It is a proof index with a strong personal position.

Sections:
- Hero: role, concise value proposition, primary CTA to case studies, secondary
  CTA to GitHub.
- Proof tracks: Plugin Engineering, Elementor Implementation, WooCommerce,
  Performance/QA.
- Featured work: Simple Budget, 3D Viewer, Design Landing, Ecommerce.
- Process: brief delivery loop from design/spec to WordPress implementation.
- Technical stack: WordPress, Elementor, WooCommerce, PHP, JS, CSS, Git.
- Contact CTA: international-friendly, direct, English copy.

Visual concept:
- Clean technical editorial style.
- White/off-white base, dark ink text, restrained accent colors.
- Use real screenshots/mockups from the demo systems once they exist.

## System 2: Simple Budget Plugin Demo

Working name: `QuoteFlow Catalog`

Fictional business: a custom commercial interiors supplier where products need
budget requests instead of immediate checkout.

Purpose: prove that `simple-budget-plugin` solves a real business flow while
preserving Elementor design freedom.

Required pages:

1. Plugin presentation page: `/work/simple-budget-plugin/`
2. Product archive/search page: `/budget-demo/products/`
3. Product single page: `/budget-demo/products/acoustic-meeting-pod/`

### Plugin Presentation Page

Target signal:
- I can explain a plugin as a product, not only as code.

Sections:
- Problem: quote-based businesses often lose leads between product browsing and
  manual contact.
- Solution: Elementor buttons can become quote actions through CSS IDs or a
  future explicit widget.
- Flow preview: browse products, add to quote, review modal, send via WhatsApp,
  email, Telegram, or configurable URL.
- Integration proof: shows the CSS hook mode with IDs such as
  `add-to-cart-button` and `open-cart-button`.
- Roadmap: destination adapters, admin settings, message templates, optional
  Elementor widget mode.

### Archive/Search Page

Target signal:
- I can build a real catalog/search experience, not a static grid.

Layout:
- Header with quote/cart button.
- Search input.
- Filter sidebar or top filter bar.
- Product grid/list toggle.
- Result count and sort control.
- Product cards with metadata and "Add to quote" actions.

Filters:
- Category: pods, workstations, lighting, storage.
- Use case: meeting room, reception, open office, retail.
- Lead time: 2 weeks, 4 weeks, custom.
- Material: oak, steel, acoustic felt, recycled plastic.
- Budget range.

Portfolio proof:
- Product metadata should come from CPT/meta fields.
- Buttons should demonstrate the plugin hook behavior.
- Empty state and active filter chips should be designed.

### Product Single Page

Target signal:
- I can design dynamic single templates that feel like product pages without
  forcing WooCommerce where a quote flow is better.

Sections:
- Product hero with image/gallery, title, short description, metadata, and add
  to quote button.
- Specifications table.
- Options/variants displayed as product metadata.
- Use-case gallery.
- Related products.
- Quote drawer/modal state.
- Message preview showing what gets sent to the chosen destination.

Visual concept:
- Premium B2B catalog.
- Warm industrial palette: ivory, charcoal, steel, muted green, and one sharp
  CTA color.
- Realistic product imagery, not abstract stock backgrounds.

## System 3: 3D Viewer Plugin Page

Working name: `3D Viewer for Elementor`

Purpose: prove complex plugin engineering and JavaScript-heavy Elementor work.

Page:
- `/work/3d-viewer-to-elementor/`

Target signal:
- I can build and debug advanced widgets where frontend rendering, editor
  preview, asset loading, and performance all interact.

Sections:
- Hero with a visible 3D/product preview area.
- Use cases: product showcase, architecture, furniture, education, portfolio.
- Controls panel mockup: model file, camera, lighting, auto-rotate,
  environment, poster/fallback.
- Editor vs frontend behavior: explain the stability challenge.
- Performance section: safe defaults, explicit optimization choices, no
  hardcoded overengineering.
- QA matrix: editor, frontend, mobile, file size, GLB/GLTF, fallback image.
- GitHub/code CTA.

Visual concept:
- High-contrast technical page with real 3D object visuals.
- Avoid vague futuristic decoration. The object must be inspectable.
- Use one excellent model as the visual anchor.

## System 4: WooCommerce Interaction Layer

Working name: `WooCommerce Interaction Layer for Elementor`

Purpose: prove practical ecommerce superpowers for implementers, not a full
shop builder.

Page:
- `/work/woocommerce-interaction-layer/`

Target signal:
- I can extend Elementor layouts with compact WooCommerce actions that work in
  real client sites.

Sections:
- Hero with add-to-cart, buy-now, and cart trigger examples.
- Where the pain lives: single product, archive, header, and custom landing
  pages.
- Feature blocks for action widgets, filter widgets, and direct checkout flows.
- Integration notes showing how Elementor hooks, CSS IDs, or widget output
  solve the placement problem.
- Comparison section: what the plugin does versus Elementor Pro basics and why
  it stays lightweight.
- QA section for variable products, AJAX behavior, mobile tap targets, and
  empty cart states.

Visual concept:
- Energetic, practical, product-focused UI.
- Less “builder suite,” more “hands-on utility belt.”
- Use clear product buttons, filter chips, and cart drawer cues.

## System 5: Design Implementation Landing Page

Working name: `RelayDesk Launch Page`

Fictional product: a B2B scheduling/helpdesk SaaS for small service teams.

Purpose: prove that a supplied design can become a polished WordPress/Elementor
landing page.

Page:
- `/landing/relaydesk/`

Target signal:
- I can implement a modern conversion landing page with responsive fidelity,
  clean spacing, readable hierarchy, and reusable sections.

Sections:
- Hero with product UI image/background, headline, CTA, and proof badges.
- Problem/solution.
- Feature bands with iconography.
- UI screenshot area.
- Integrations strip.
- Pricing or plan comparison.
- Testimonials.
- FAQ.
- Final CTA.

Visual concept:
- SaaS-like, sharp, polished, not a generic agency template.
- The page should look implementable from a Figma file.
- Later, create a small "design implementation note" comparing intended design,
  WordPress build, responsive decisions, and QA.

## System 6: Institutional Website

Working name: `Lumina Dental Studio`

Fictional business: a modern dental clinic. This domain is useful because it
needs trust, local SEO, services, privacy/compliance, blog content, and contact
conversion.

Purpose: prove standard client-site delivery across multiple pages.

Pages:

1. Home: `/institutional/lumina-dental/`
2. Services: `/institutional/lumina-dental/services/`
3. Service detail SEO page: `/institutional/lumina-dental/services/dental-implants/`
4. About: `/institutional/lumina-dental/about/`
5. Blog: `/institutional/lumina-dental/blog/`
6. Contact: `/institutional/lumina-dental/contact/`
7. Privacy/LGPD: `/institutional/lumina-dental/privacy-lgpd/`

Why seven pages:
- The extra service detail page is the SEO proof. A services index is not
  enough to prove local/organic page structure.

Target signal:
- I can build client sites with navigation, internal linking, content hierarchy,
  forms, trust sections, SEO pages, and legal/privacy pages.

Visual concept:
- Calm healthcare brand, not sterile.
- White, soft green, warm coral, deep text, real clinic/person imagery.
- Accessibility and readability matter more than decoration.

SEO proof:
- Service detail has FAQ, schema-ready content blocks, internal links, and CTA.
- Blog has category/archive structure.
- Contact has local intent, map area, hours, and form.
- Privacy/LGPD explains data handling for forms and analytics in plain language.

## System 7: WooCommerce Store

Working name: `Aster Gear Co.`

Fictional business: premium desk/work gear with variable products, bundles, and
accessories.

Purpose: prove WooCommerce delivery with catalog, product, cart, checkout, and
account flows.

Core pages:
- Store home: `/shop/`
- Product archive/category: `/shop/workspace-gear/`
- Product single: `/product/modular-desk-kit/`
- Cart: `/cart/`
- Checkout: `/checkout/`
- My account: `/my-account/`
- Order received/thank you state.

Target signal:
- I can build ecommerce experiences with product data, variations, filters,
  checkout UX, mobile responsiveness, performance, and maintainability.

Features to demonstrate:
- Variable products: finish, size, bundle options.
- Product filters: category, price, material, color, availability.
- Product badges: new, best seller, limited stock.
- Mini cart/header cart.
- Cross-sells and related products.
- Cart and checkout pages with conversion-focused layout.
- Basic SEO: product metadata, category copy, internal links.

WooCommerce + Elementor approach:
- Best paid/official route: Elementor Pro WooCommerce Builder for product
  single/archive/menu cart if a license is available.
- No-cost route: WooCommerce core blocks plus a custom theme layer for stable
  checkout/cart styling.
- Elementor-free builder candidates to test later: Magical Shop Builder,
  ShopEngine, and ShopPress. Do not install blindly; test lock-in, performance,
  active maintenance, free feature limits, and frontend output before choosing.
- Avoid pirated/unofficial Elementor Pro clones.

Visual concept:
- Product-led ecommerce with crisp product photography.
- Editorial product detail pages, compact archive filters, and high-trust
  checkout.
- Use multiple accent colors through product imagery instead of one-note UI.

## Asset Direction For The Next Phase

Generate or source assets after this concept is approved.

Asset rule:
- Every portfolio image must be scalable as a system. Leave room for future
  sites, modules, or cards. Do not make a composition that only works for one
  fixed set of six items.
- Prefer modular layouts, grouped panels, and thematic sections that can grow.
- The visuals can be caricatural or personality-rich, but they must still read
  like usable interface systems for a developer/implementer.
- For the public hero, prefer a strong 100vh-style first screen with a compact
  bio block and bolder contrast or color accents. Avoid a mostly white, overly
  sober presentation.
- The image must read as the final public portfolio seen by clients and
  recruiters, not as internal software. Do not include add-project controls,
  empty editable slots, admin dashboards, builder sidebars, placeholder rails,
  or any UI that implies the visitor is managing the portfolio.
- Scalability should come from public layout patterns: repeatable case-study
  cards, section rhythm, category navigation, content grids, and responsive
  spacing.

Simple Budget:
- 8 to 12 product images for commercial interior products.
- One archive/search mockup image.
- One quote modal/mockup image.

3D Viewer:
- One inspectable 3D/product hero visual.
- One editor controls mockup.
- One performance/QA visual.

Landing page:
- SaaS UI hero screenshot.
- Supporting UI cards/screens.

Institutional:
- Clinic interior images.
- Doctor/team portraits.
- Service-specific imagery.

WooCommerce:
- 12 to 16 product images.
- Product detail gallery.
- Lifestyle workspace images.

Portfolio home:
- Use screenshots from the systems above instead of unrelated stock images.

## Build Order

1. Approve concepts and visual direction.
2. Generate visual references/assets for each system.
3. Create page-by-page wireframes and acceptance checklists.
4. Implement manually in WordPress/Elementor or with code where appropriate.
5. Use browser snapshots/Playwright only for QA and bug finding.
6. Convert each finished system into a short English case study.

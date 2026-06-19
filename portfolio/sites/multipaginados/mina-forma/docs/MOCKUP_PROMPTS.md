# Mina Forma Mockup Prompts

Institutional demo site for the portfolio. This site proves the Simple Budget
Plugin only through the public project-planning page. It does not absorb the
landing demo or the ecommerce demo.

## Rules

- Brand: `Mina Forma`, a fictional commercial interiors and architecture studio.
- Purpose: institutional WordPress/Elementor demo with one natural SBP flow.
- SBP appears only on `Plan your project / Orcamento`.
- Ecommerce and 3D viewer stay out of this site.
- Implementation Toolkit can be implied through structured content, filters,
  templates, loops and reusable page types.
- Visual language: warm off-white paper, ink charcoal, cyan technical accent,
  clay/orange editorial accent, square borders, tactile architectural imagery,
  condensed display typography and Elementor-feasible sections.

## Generated Images

Asset generation inventory: [`ASSET_INVENTORY.md`](../assets/manifests/ASSET_INVENTORY.md).
Generated asset run index: [`GENERATED_ASSETS_INDEX.md`](../assets/manifests/GENERATED_ASSETS_INDEX.md).
Generation manifests: [`batch-5-lineart.md`](../assets/manifests/generation/batch-5-lineart.md).

| Asset | Role | Checksum |
| --- | --- | --- |
| `mina-forma-art-direction-guide-v1.png` | Visual guide | `255f491fc30b8e12df8cccbe9d2827188e87f9adfcf76fb85db461ce71de352e` |
| `mina-forma-home-mockup-v1.png` | Home | `3ac8f4bd2f5c12b538d1bc29cbc11026fd8d2ab286f9631e5e1c5cfdc581a47a` |
| `mina-forma-about-mockup-v1.png` | About | `fbc77950ab909799e1fa0e5b85eea0ecb6f53a6314f773b694ac260b80612d6d` |
| `mina-forma-services-listing-mockup-v1.png` | Services listing | `37e0538c8a63339e4e1dba6224db7f1b2272f753c77884f1d41c523759814480` |
| `mina-forma-service-detail-mockup-v1.png` | Service detail | `5d89c6888194d06bd6cfec8f3a1925ce4b7b66a7120c6c5985a0963897c2879e` |
| `mina-forma-projects-cases-listing-mockup-v1.png` | Projects / cases listing | `94f5d4c8d6038d0a09e3d9083075a637f5e9accb653f91abf9e74204b5ee6d89` |
| `mina-forma-case-aurora-cafe-mockup-v1.png` | Case detail | `00376fea55dcdcb1e52b7ad097402cf40cf74fe62078c10d30953de93fc881d6` |
| `mina-forma-plan-your-project-orcamento-mockup-v1.png` | SBP proof page | `ccfa3e7894b3e6082760a1bab2f1887c04a41e23e992317bf20aabb49a4327a6` |
| `mina-forma-contact-mockup-v1.png` | Contact | `90909cb90de4aa65a2394158b48aad8c986489d28a6072fa1aaa5b091877c585` |

## Guide Prompt

```text
Create a high-fidelity visual art direction board for a fictional institutional
WordPress website demo called "Mina Forma", an interior architecture and
commercial-space design studio. This board will guide 8 full-page website
mockups that will later be implemented in Elementor.

Use case: ui-mockup / website art direction guide.
Canvas: 16:9 horizontal board, crisp and readable, not a screenshot of a live
product.

Composition: split the board into a coherent system preview, not repeated
generic cards. Left third: a strong first-viewport website hero fragment with
navigation, large editorial headline, warm off-white background, one
architectural interior photograph placeholder/collage area, and a clear CTA.
Middle third: modular content examples: service row, project case preview,
quote-builder teaser for a proposal page, and typography hierarchy samples.
Right third: component and material language: palette swatches, buttons, tags,
form fields, quote-list item tiles, image masks, and spacing notes represented
visually.

Brand character: precise, tactile, architectural, commercially mature, handmade
but technical. It should feel like a serious boutique studio that designs cafes,
clinics, stores, studios, and service spaces. Not a generic agency, not SaaS,
not dashboard, not luxury-hotel cliche.

Visual system: warm architectural off-white paper, deep ink charcoal, cyan
technical accent, muted clay/orange accent, a restrained violet secondary
accent. Use square or nearly square corners, strong black/ink borders, fine grid
logic, generous whitespace, asymmetric composition, typography with bold
condensed sans display and clear sans body. Borders and shadows should feel
physically printed and portfolio-adjacent, similar in spirit to a crafted
WordPress portfolio surface.

Imagery: realistic interior-design project photography placeholders, material
samples, plans, sketches, fabric, wood, stone, metal, shopfront details. Keep
imagery structural, not decorative. Use realistic cropped spaces and tactile
surfaces.

SBP integration cue: include a small proposal/quote-builder component preview
with item rows, quantities, and a total area, but do not make the whole board a
plugin page. It should look like a natural "Plan your project" page in an
institutional site.

Text handling: include only a few legible exact words: "Mina Forma", "Spaces
that quote clearly", "Services", "Projects", "Plan your project", "Proposal".
Other copy may be represented as clean typographic blocks.

Constraints: Elementor-feasible layout, WordPress institutional site, no fake
browser chrome, no 3D products, no ecommerce cart, no plugin dashboard UI, no
repeated icon card grid, no dark black background, no glossy gradients, no
decorative arrows, no lorem ipsum paragraphs.

Mood: confident, architectural, direct, useful.
Format: 16:9.
```

## Page Prompts

### 1. Home

```text
Generate a complete full-page HOME website mockup for the fictitious
institutional demo website "Mina Forma", a commercial architecture and interiors
studio. Use a vertical website screenshot format with no browser chrome.

Direction: warm off-white background, ink charcoal typography, cyan accent,
clay/orange accent, crisp square borders, editorial condensed display type,
tactile architectural photography, and an Elementor-feasible layout.

Page goal: create a strong first impression for a sharp commercial
architecture/interiors studio and guide visitors toward the CTA "Plan your
project". This is not the Simple Budget Plugin detail page; include only a CTA
toward planning.

Include: slim header with Mina Forma logo, nav links Studio, Services, Projects,
Method, Contact, and outlined CTA "Plan your project"; powerful hero with
headline "Commercial spaces with a sharper plan.", supporting copy, proof strip,
and large architectural image; visual proof strip with materials, plans, and
built interior crops; services summary with Interior concept, Commercial layout,
Implementation package; featured projects with Retail fit-out, Cafe counter
system, Studio reception; CTA band "Plan the scope before the build starts.";
minimal footer.

Avoid: ecommerce, 3D viewer, dashboard, fake browser chrome, plugin admin UI,
detailed SBP quote list, pricing table, device mockups, generic card grid,
purple/blue gradients, rounded SaaS pills.

Make it feel editorial, architectural, practical, premium, and implementable in
Elementor using containers, image widgets, text widgets, buttons,
loop/query-like project cards, and responsive grids.
```

### 2. About

```text
Create a high-fidelity full-page website mockup for the fictional institutional
demo site "Mina Forma". Use the visible Mina Forma guide image as style
reference only: warm off-white paper background (#F6F3EC), ink charcoal
typography (#111214), cyan accent (#00B8C6), clay/orange accent (#ED744E),
square borders, editorial condensed display type, thin architectural linework,
tactile architectural photography, and Elementor-feasible container/grid layout.

Use case: ui-mockup / complete desktop webpage art direction for a WordPress and
Elementor institutional site.
Page: ABOUT.
Single page job: tell the studio's history, method, and mature posture without
showing products, plugins, quote tools, ecommerce, 3D viewers, dashboards,
browser chrome, or generic feature-card grids.
Format: tall full-page desktop website screenshot mockup, about 1440px wide by
2600px tall, one continuous scroll page on a flat canvas, no browser UI.

Composition and scan order:
1. Header: left wordmark "Mina Forma"; nav items "Services", "Projects",
"Method", "About", "Contact"; square outlined button "Let's talk".
2. Hero: large condensed headline "SPACES WITH A HUMAN MEASURE". Eyebrow:
"ABOUT MINA FORMA". Supporting paragraph: "We shape commercial interiors with
restraint, material honesty, and operational clarity." Right side: tactile
architectural studio photo with material samples, warm concrete, wood slats,
sketches, and cropped human presence.
3. Manifesto: heading "A quieter way to build presence", short editorial text,
vertical material image strip, square borders, clay accent rule.
4. Studio method: horizontal process bands: "Listen", "Shape", "Specify",
"Support", with line icons, short copy, cyan underline.
5. Timeline: compact linear timeline: "2018", "2020", "2023", "Now", with thin
rules and atelier/pinboard image.
6. Principles: three editorial blocks: "Use materials honestly", "Design for
daily work", "Leave room for change".
7. Human process: large photo around plans/material boards, headline "From first
conversation to working space", CTA "Start a conversation".
8. Footer: dark ink footer with square "M" mark, short statement, links, and
architectural blueprint linework.

Visual rules: keep square borders, no rounded cards, no floating glass panels,
no gradients, no blobs, no fake browser chrome. Keep the page institutional and
mature, not startup/SaaS. Use photography structurally: interiors, studio desk,
material samples, plans, wood slats, concrete, clay fabric accents, real shadows
and texture. Use cyan only as action/accent, clay/orange as editorial emphasis,
charcoal for structure. Do not include Simple Budget Plugin, quote list preview,
pricing table, cart, ecommerce product grid, 3D model, dashboard UI, analytics
charts, fake laptop frames, or a generic icon-card grid. Make all sections
implementable in Elementor using containers, grids, image masks, text widgets,
button widgets, and simple custom CSS.
```

### 3. Services Listing

```text
Create a complete full-page website mockup image for the fictional institutional
architecture/interior studio "Mina Forma".

Use case: ui-mockup / website art direction.
Asset type: full-page desktop website mockup for Elementor/WordPress
implementation, around 1440px wide and 2200px tall, shown as a clean page image
with no browser chrome.

Page: SERVICES / SERVICES LISTING.
Primary job: show a public services listing page for a high-end but grounded
institutional studio, proving WordPress/CCT-style structured content with
categories, filters, short descriptions, and links to individual service pages.
It must feel like a real public website, not a dashboard.

Visual continuity: follow the established Mina Forma guide style: warm off-white
paper background (#F6F3EC), ink charcoal text (#111214), cyan accent (#00B8C6),
clay/orange accent (#ED7A4E), concrete neutral (#D9D6CF), square black borders,
editorial condensed display typography, compact utility labels, tactile
architectural photography, crisp Elementor-feasible sections, strong but
restrained graphic layout.

Page composition:
1. Top header with text logo "Mina Forma" on the left, navigation links
"Services", "Projects", "Plan your project", "About", "Contact", and a square
bordered button "Let's talk".
2. First viewport: large editorial headline "SERVICES FOR SPACES THAT WORK" in
tall condensed black display type on the left. Supporting copy underneath:
"Planning, detailing and implementation support for commercial interiors." On
the right, an architectural photo crop: warm interior material samples, joinery
details, plans, stone, wood, metal, and soft natural light.
3. Below hero: a horizontal services category rail with square border treatment
and compact filters. Include categories: "All", "Concept", "Interior",
"Technical", "Furniture", "Site". The active filter uses cyan underline or cyan
block.
4. Main services listing: varied editorial list layout, not a generic equal card
grid. Use 6 service entries with different widths/heights and clear hierarchy.
Each entry has a small line icon, category label, service title, 2-line
description, short metadata like "Scope", "Deliverable", or "Template", and a
text link "View service".
5. Add one clay/orange highlighted service block for "Furniture & Joinery" with
tactile close-up photo of wood slats or cabinet detail.
6. Add a mid-page band "How services connect" showing a simple public-facing
sequence: "Brief", "Plan", "Detail", "Implement". This should look like website
content, not a workflow dashboard.
7. Add a bottom CTA band with black ink background, fine architectural line
drawing texture, text "Need a clear scope before quoting?" and a button "Plan
your project".
8. Footer with compact brand mark "M", short studio statement, and small links.

Content and UI constraints: do not include Simple Budget Plugin, quote list,
pricing table, cart controls, ecommerce, product cards, 3D viewer, admin or
dashboard widgets, fake browser chrome, phone mockups, analytics charts, or a
generic grid of identical cards. Keep the design implementable in Elementor:
sections, containers, image masks, icon rows, text cards, filters, and CTA bands.
Use mostly legible text blocks and credible labels, but prioritize visual
hierarchy and layout fidelity over tiny copy accuracy. Maintain generous
breathing room, square corners, hard borders, controlled accent colors, and
architecture/interior material photography.

Mood: sharp editorial, tactile, structured, commercial interior architecture,
serious but not fake-luxury.
Format: vertical full-page desktop website mockup, 2:3 aspect ratio or taller.
```

### 4. Service Detail

```text
Generate a complete full-page mockup for the fictitious institutional demo site
"Mina Forma". Page type: SERVICE DETAIL. Example service: "Commercial Interior
Concept".

Follow the established Mina Forma art direction: warm off-white paper
background, ink charcoal typography, cyan accent, clay/orange accent, square
black borders, editorial condensed display type, tactile architectural
photography, gridded editorial layout, Elementor-feasible sections.

Page goal: sell/explain one service template clearly. It must show the service
problem, the solution, stages/steps, materials, deliverables, related projects,
and a CTA to plan a proposal. CTA may say "Plan your project" or "Start your
proposal", but do not show the Simple Budget Plugin interface in detail.

Include: header, large service hero, problem/outcome block, 4-step process,
material swatches, deliverables, related projects, final CTA, and dark footer.
No browser chrome, no ecommerce, no 3D viewer, no dashboard. Use real-looking
tactile photos, architectural sketches, material swatches and editorial spacing.
The design should be implementable with Elementor containers, grids, image
masks/crops, tabs/cards and responsive stacking.
```

### 5. Projects / Cases Listing

```text
Create a full-page website mockup image for a fictional institutional demo site
named "Mina Forma".

Route: "Projetos / Cases Listing". Show a filterable institutional project
gallery for cafes, clinics, stores, and studios. The page must feel like an
architectural/interior implementation portfolio, not ecommerce, not a dashboard,
not a generic card grid.

Visual direction: warm off-white background, ink charcoal text, cyan accent,
clay/orange accent, square black borders, subtle tactile paper texture,
restrained shadows, editorial condensed display typography, clean
Elementor-feasible grid containers.

Photography: tactile architectural photography with warm cafes, clinical
interiors, retail storefronts, creative studios, material samples, natural
light, concrete, glass, wood, tiles, signage, furniture details. Images must
feel inspectable and documentary.

Composition: compact header with "MINA FORMA", navigation, and outlined CTA.
First viewport with label "Projetos / Cases", large headline "Projetos que
mostram espaco em uso", supporting copy, and a large architectural hero photo.
Add filter controls for "Todos", "Cafes", "Clinicas", "Lojas", "Studios", plus
secondary attributes like "Reforma", "Identidade", "Fluxo", "Atendimento".

Below: one large featured case preview, then an asymmetric gallery with 6 to 8
project previews. Include project names like "Cafe Pedra Clara", "Clinica Lume",
"Loja Terral", "Studio Norte", "Cafe Linha", "Clinica Arco", "Atelie Mercado".
Add a proof strip and a final CTA section.

Implementation constraints: feasible in WordPress and Elementor using
containers, grids, loop items, taxonomy filters, image widgets, headings, text,
and buttons.

Do not include Simple Budget Plugin, SBP, budget widgets, quote lists, cart
flow, 3D viewer, ecommerce products, prices, dashboards, fake browser UI,
gradient blobs, round icon badges, generic SaaS feature rows, or a stock-like
card grid.
```

### 6. Case Detail

```text
Create a complete full-page website mockup image for a fictional institutional
demo website called "Mina Forma".

Use case: ui-mockup / website art direction.
Asset type: full desktop webpage mockup for a WordPress and Elementor
implementation reference.
Reference style: follow the visible Mina Forma guide image: warm off-white paper
background (#F6F3EC), ink charcoal (#111214), cyan accent (#00B8C6),
clay/orange accent (#ED744E), square black borders, crisp editorial grid,
condensed architectural display typography, tactile commercial interior
photography, thin technical lines, monochrome architectural icons, no rounded
SaaS cards.

Page: CASE INDIVIDUAL.
Project example: "Aurora Cafe".
Primary job: show a detailed project case template with briefing, challenge,
intervention, gallery, specs, related services, and result. It should prove a
WordPress case-detail template, not a plugin page.

Strict constraints: do not include Simple Budget Plugin, SBP, ecommerce, 3D
viewer, dashboard, app UI, browser frame, fake analytics, floating glass cards,
gradients, blobs, rounded cards, dark hero overlay, or generic SaaS aesthetics.
Full page only.
```

### 7. Plan Your Project / Orcamento

```text
Create a high-fidelity complete full-page website mockup image for the fictional
institutional demo website "Mina Forma".

Page: PLAN YOUR PROJECT / ORCAMENTO.
Primary job: prove the Simple Budget Plugin naturally inside the institutional
site. This must feel like a public "plan your project" page for an
architecture/interiors studio, not a plugin sales page, not a plugin admin
screen, and not a dashboard.

Visual continuity: follow the established Mina Forma guide and sibling mockups:
warm off-white paper background, ink charcoal typography, cyan accent,
clay/orange accent, concrete neutral, square black borders, editorial condensed
display type, compact utility labels, tactile architectural material
photography, thin technical rules, gridded editorial layout, restrained shadows,
Elementor-feasible containers and grids.

Required structure: header with Mina Forma nav and CTA; first viewport with
headline "Build a clearer scope before the first quote."; material/plan
photography; proof strip for scope, quantities, estimated range and contact;
embedded public Simple Budget Plugin flow with selectable project items,
quantity controls, useful empty state, selected-item summary, estimated range,
lightweight contact form and "Send project request" CTA; explanatory section
"How we read your scope"; related services strip; dark footer.

SBP truth constraints: depict only a public quote/request flow with selectable
items, quantity controls, empty state, selected-item summary, estimated
total/range, and send/contact CTA. Do not depict plugin settings, WordPress
admin, analytics, payment checkout, ecommerce cart, real payment, account login,
CRM, or backend dashboard.

Strict exclusions: no ecommerce, no 3D viewer, no product catalog, no fake
browser chrome, no laptop/device mockup, no dashboard UI, no SaaS pricing cards,
no floating glass panels, no gradients, no blobs, no rounded pill-heavy UI, no
generic three-card feature grid, no plugin sales copy.

Implementation constraints: make the layout reproducible in Elementor with
containers, grids, image widgets, text widgets, buttons, form widgets, loop-like
item cards, and the Simple Budget Plugin widgets embedded in a public page.

Mood: editorial, architectural, practical, premium but grounded, commercial
interior studio, tactile materials, serious proposal planning.
Format: vertical full-page desktop website mockup, approximately 1440px wide by
2600px tall.
```

### 8. Contact

```text
Create a complete high-fidelity full-page website mockup image for the fictional
institutional demo site "Mina Forma".

Use case: ui-mockup.
Asset type: full desktop webpage mockup for WordPress and Elementor
implementation reference, vertical full-page screenshot style, around 1440px
wide by 2600px tall, no browser chrome.

Style reference: follow the established Mina Forma guide and sibling mockups:
warm off-white paper background (#F6F3EC), ink charcoal typography (#111214),
cyan accent (#00B8C6), clay/orange accent (#ED744E), concrete neutral (#D9D6CF),
crisp square black borders, editorial condensed display typography, compact
utility labels, tactile architectural photography, thin architectural linework,
serious commercial interior studio tone. Keep the layout feasible with Elementor
containers, grids, form widgets, image widgets, text widgets, icon lists,
buttons, and simple custom CSS.

Page: CONTACT.
Primary job: institutional closing page that helps a visitor start a
conversation or begin a project proposal. It should feel like a real
architecture/interior studio contact page, not a plugin demo.

Include: hero contact orientation, contact channels, main form, light project
summary intake, Belo Horizonte studio presence, quick questions, dark final CTA,
compact footer.

Strict constraints: do not include Simple Budget Plugin, SBP labels, detailed
quote builder, quote list, pricing table, cart flow, ecommerce, 3D viewer,
product cards, dashboard widgets, analytics, fake browser chrome, laptop
mockups, phone mockups, purple/blue gradients, bokeh/orb decorations, floating
glass panels, rounded SaaS pills, or a generic equal card grid.

Mood: sharp editorial, warm, grounded, architectural, commercially useful,
premium without being fake-luxury.
```

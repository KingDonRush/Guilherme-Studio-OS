# Projects Listing Direction Contract

Status: locked by approval on 2026-07-14

## Route

- Route: `/projects`
- Page job: help visitors scan the studio's work, find a project relevant to their space and open one detailed case.
- Audience moment: the visitor understands Mina Forma's positioning and now needs concrete spatial evidence across different commercial typologies.
- Memorable truth: these spaces are designed to hold up in daily use, not only in photographs.
- Primary action: `VIEW CASE`

## Hierarchy

- First eye stop: `PROJECTS / CASES` and the display title `SPACES PROVEN IN DAILY USE.`
- Second eye stop: the featured `AURORA CAFÉ` project photograph.
- Third eye stop: the featured-project caption and `VIEW CASE` action.
- Section map:
  1. shared header;
  2. compact editorial intro without photography;
  3. one restrained typology filter row;
  4. featured Aurora Café case with one dominant image and an editorial text rail;
  5. flat three-column catalog of six further projects in two bands;
  6. flat proof strip connecting flow, identity, material and daily use;
  7. shared dark CTA and light footer.
- Content budget: one claim and one short paragraph in the intro; one sentence per project; no repeated explanatory paragraphs around dense photography.
- Primary evidence: inspectable documentary interior photography with explicit project name, typology and case link.

## Relationship

- Sibling relationship: inherits the approved Services and Commercial Layout visual system while functioning as a browsing/index surface rather than a service explanation.
- Composition that must not be copied: Home v2 photo hero; old Projects v1 text-left/photo-right hero; Services horizontal service rows; Commercial Layout technical-plan opening.
- Protected shared language: warm paper field, charcoal condensed display type, orange numbering, restrained cyan rules, continuous outer rails, square geometry, flat separators, shared header/CTA/footer.
- Deliberate risk: a photo-free oversized title gives the page identity before the featured case, while the selected-work grid stays deliberately regular and quiet.

## Implementation

- Elementor map:
  - header/footer: shared Theme Builder surfaces and real WordPress Nav Menu;
  - intro: Grid Container with Heading and Text Editor widgets;
  - filters: Taxonomy Filter or linked Button/Text widgets with square styling and one active state;
  - featured case: two-column Grid Container with one Image widget, editable metadata, Heading, Text Editor and Button/Text link;
  - project index: three-column Loop Grid or repeated Containers using one reusable loop-item structure with flat captions and no card surface;
  - proof strip: flat Grid Container with editable headings and copy;
  - CTA: shared dark Container with Heading, Text Editor and Button.
- Editable text: navigation, title, intro, filter labels, project numbers, project names, typologies, captions and every action.
- Media assets: one individual image per project plus optional dark CTA blueprint linework.
- CSS/container treatments: page rails, section separators, grid spans, image aspect ratios, caption rules and active-filter underline.
- Responsive recomposition: filters wrap as accessible square controls; feature becomes image then copy; project spans collapse into a single ordered list; captions remain attached to their images.

## Treatment budgets

- Border contract: continuous outer rails and full-width section separators are mandatory; captions may use one top/bottom rule; no framed card around every project.
- Shadow budget: zero UI/card shadows; only natural photographic depth inside images.
- Texture budget: subtle paper field across the page; visible materiality belongs inside project photography; no distressed overlays on text.
- Image density: the featured viewport has one dominant photograph; the selected-work index may show one three-image row at a time with equal visual treatment.
- CTA emphasis: featured `VIEW CASE` and final orange `PLAN YOUR PROJECT` own action contrast; filters and secondary links remain quiet.

## Locks

- Locked header text: `Mina Forma`, `Studio`, `Services`, `Projects`, `Method`, `About`, `Contact`, `PLAN YOUR PROJECT`.
- Locked route text: `PROJECTS / CASES`, `SPACES PROVEN IN DAILY USE.`, `ALL`, `CAFÉS`, `CLINICS`, `RETAIL`, `STUDIOS`, `FEATURED CASE / 01`, `AURORA CAFÉ`, `VIEW CASE`, `SELECTED WORK`, `CLÍNICA LUME`, `LOJA TERRAL`, `STUDIO NORTE`, `CAFÉ LINHA`, `CLÍNICA ARCO`, `ATELIÊ MERCADO`, `WHAT THE WORK HOLDS`, `FOUND A PROJECT CLOSE TO YOURS?`.
- Prohibited content: Home-style hero photo, two filter rows, uniform boxed card grid, free-floating collage, rounded cards, gradients, UI shadows, project metrics, prices, dashboards, ecommerce, plugin UI, 3D viewer, invented navigation or legal links.
- Geometry authority: `geometry.yaml` in this contract folder.
- Visual authority: approved Services listing and Commercial Layout; old Projects v1 controls only project names and content categories.
- Acceptance statement: the route reads immediately as a browsable project index, gives Aurora Café clear featured priority, preserves project variety and remains feasible with stable Elementor/Loop Grid structures.

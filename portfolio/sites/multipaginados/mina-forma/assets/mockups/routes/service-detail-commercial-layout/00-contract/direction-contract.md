# Commercial Layout Service Detail Direction Contract

Status: locked by approval on 2026-07-14

## Route

- Route: `/services/commercial-layout`
- Page job: help a visitor decide whether commercial layout planning fits their operational problem and understand what spatial direction they receive.
- Audience moment: the visitor arrived from service row `02` and already understands the service family; now they need concrete evidence, scope and a next action.
- Memorable truth: a commercial layout turns routines, circulation and constraints into spatial logic before construction begins.
- Primary action: `PLAN THE SPACE`

## Hierarchy

- First eye stop: orange service code `02` and the display title `COMMERCIAL LAYOUT`.
- Second eye stop: a large, inspectable annotated floor plan used as primary evidence.
- Third eye stop: the outcome statement and `PLAN THE SPACE` action.
- Section map:
  1. shared header;
  2. compact editorial service masthead without a dominant photograph;
  3. layout-as-evidence band with plan and operational callouts;
  4. four problems the layout resolves in a flat editorial list;
  5. four-step layout process;
  6. asymmetric deliverables evidence;
  7. applied Aurora Café plan-to-place case;
  8. shared dark CTA and light footer.
- Content budget: one claim, one supporting paragraph and one CTA in the masthead; one question and one evidence unit per following section.
- Primary evidence: annotated commercial floor plan with entry, customer path, service flow and storage logic.

## Relationship

- Sibling relationship: visually follows the approved Services listing and shared Home v2 system, but deepens only service row `02`.
- Composition that must not be copied: Home v2 `text-left + dominant interior-photo-right` hero; Services listing horizontal service-row index.
- Protected shared language: warm paper field, charcoal condensed display type, orange service numbers, restrained cyan rules, continuous outer rails, square geometry, tactile architectural imagery, shared header/CTA/footer.
- Deliberate risk: the first strong visual is a technical floor plan rather than a finished interior. This makes the route more specific and evidence-led while postponing atmosphere until the applied-case section.

## Implementation

- Elementor map:
  - header: existing Theme Builder header and WordPress Nav Menu;
  - masthead: Grid Container with Heading, Text Editor and Button widgets;
  - plan evidence: two-column Grid Container with editable callout list and one Image widget;
  - problems and process: nested Containers with Heading/Text Editor widgets and border separators;
  - deliverables: asymmetric Grid Containers with individual Image widgets and editable captions;
  - applied case: two-column Container with Image widgets, Heading, Text Editor and Button;
  - CTA/footer: shared Theme Builder surfaces after visual approval.
- Editable text: every heading, label, paragraph, service number, caption, navigation item and action.
- Media assets: annotated plan, planning still life, deliverable boards and Aurora Café interior photography.
- CSS/container treatments: continuous page rails, section borders, grid alignment, image crops and restrained cyan underline accents.
- Responsive recomposition: masthead stacks title before copy; plan callouts move above the plan; process becomes a vertical bordered sequence; deliverables and case evidence stack without overlap.

## Treatment budgets

- Border contract: continuous outer rails and full-width section separators are mandatory; inner borders only organize lists or evidence; decorative boxes around every text group are forbidden.
- Shadow budget: zero UI/card shadows; only natural contact shadows inside photographic assets; the final dark CTA remains flat.
- Texture budget: subtle warm paper across the page; material texture lives inside imagery; no extra distressed overlays on text surfaces.
- Image density: maximum one strong photograph plus one technical evidence image per viewport; technical drawings may remain visually quiet.
- CTA emphasis: orange owns the primary action; cyan is limited to active navigation, short rules and minor link emphasis.

## Locks

- Locked header text: `Mina Forma`, `Studio`, `Services`, `Projects`, `Method`, `About`, `Contact`, `PLAN YOUR PROJECT`.
- Locked route text: `SERVICE / 02`, `COMMERCIAL LAYOUT`, `PLAN THE SPACE`, `LAYOUT AS EVIDENCE`, `THE SPACE HAS TO WORK BEFORE IT LOOKS FINISHED.`, `WHAT GETS SOLVED`, `HOW THE LAYOUT TAKES SHAPE`, `WHAT YOU RECEIVE`, `FROM PLAN TO PLACE`, `AURORA CAFÉ`, `PLAN BEFORE THE BUILD STARTS.`
- Prohibited content: Home-style photo hero, card wall, gradients, blue/petrol panels, rounded cards, UI shadows, prices, dashboards, ecommerce, plugin UI, fake metrics, 3D viewer, invented navigation or legal links.
- Geometry authority: `geometry.yaml` in this contract folder.
- Visual authority: approved Services listing for rails/type/spacing discipline; Home v2 for shared brand system only; old Service Detail v1 for content atoms only.
- Acceptance statement: the route reads immediately as an individual service detail, explains operational layout through evidence, remains clearly related to Mina Forma and can be built with stable Elementor containers and widgets.

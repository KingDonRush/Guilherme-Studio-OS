# Candidate 01 Prompt — Plan as Primary Evidence

## Generation declaration

```text
STATE: CANDIDATE
PARENT: old Service Detail v1, content atoms only
CHANGE: establish a new evidence-led Commercial Layout detail page
PRESERVE: approved Mina Forma visual system, shared header/footer language, flat rails, warm paper, orange numbers, restrained cyan rules
AUTHORITIES: Services final = visual language; Home v2 = shared brand only; old Service Detail v1 = content inventory only; new geometry contract = composition authority
GEOMETRY: conceptual canvas 1440x3200; header 92px; masthead ends at y=562; plan evidence starts at y=562 and is visibly underway before the y=900 fold
TEXT CONTRACT: only the listed header, section, item and CTA strings; no invented menu, legal, pricing or contact copy
ELEMENTOR INTENT: editable Heading/Text Editor/Button/Nav Menu widgets, stable Grid Containers, individual Image widgets, borders from containers, no rasterized UI text
CONSTRAINTS: complete desktop page; no Home-style photo hero; no card wall; no rounded UI; no gradients; no UI shadows; no overlapping collage that requires absolute positioning
SUCCESS TEST: it reads instantly as service 02 detail, the plan is the strongest evidence, photography supports rather than defines the route, and the page is feasible in Elementor
```

## Imagegen prompt

Create a polished, complete full-page desktop website mockup for the fictional commercial interior architecture studio `Mina Forma`.

Use case: ui-mockup.
Asset type: full-page route mockup for `/services/commercial-layout`, later implemented manually in WordPress and Elementor.

Reference roles:
- Image 1 is the approved Services listing and controls the visual language: page rails, warm paper field, condensed display typography, orange service numbers, restrained cyan rules, flat borders, header and footer discipline.
- Image 2 is Home v2 and controls only the broader Mina Forma brand family and shared CTA/footer character. Do not copy its text-left/photo-right hero composition.
- Image 3 is the old Service Detail v1 and controls content categories only. Do not copy its hero, stepped photo mask, dense cards or section geometry.
- Image 4 is the art-direction guide and controls palette, material photography and architectural specificity.

Page job: explain one service deeply enough that a commercial-space owner can judge fit, understand the outputs and choose the next step.
Memorable truth: operational flow becomes spatial logic before construction begins.

Overall visual system:
- warm off-white paper background, subtle natural grain;
- ink-charcoal typography with an extra-condensed architectural display face for major headings;
- clay-orange for service number `02`, numbered steps and the primary CTA;
- cyan only for the active navigation underline, short technical rules and minor links;
- square corners, continuous thin charcoal outer rails and full-width section separators;
- tactile architectural photographs and precise floor-plan imagery;
- editorial density that alternates technical/dense evidence with quiet text space.

Treatment budgets:
- Border contract: outer rails and section separators are continuous; inner borders organize only lists and evidence.
- Shadow budget: zero interface or card shadows; only natural contact shadows within photographs.
- Texture budget: paper texture on the page and material texture inside imagery only.
- Image density: at most one strong photograph plus one quiet technical drawing in any viewport.
- CTA emphasis: orange owns the primary action; cyan remains secondary.

Conceptual composition canvas: 1440x3200. Target first viewport: 1440x900.
- Header: y=20–112, compact and identical in character to the approved Services page.
- Masthead: y=112–562. No photograph. Use an asymmetric editorial grid: large service code and title on the left, concise explanation and orange action on the right.
- Plan evidence begins at y=562 and is clearly visible before the y=900 fold.
- Keep all images inside fixed boxes. Images must never increase their parent section height.

Header strings, verbatim and no extras:
`Mina Forma`, `Studio`, `Services`, `Projects`, `Method`, `About`, `Contact`, `PLAN YOUR PROJECT`.

Masthead:
- small orange label `SERVICE / 02`;
- very large two-line title `COMMERCIAL LAYOUT`;
- supporting line `SPACE PLANNING FOR FLOW, OPERATION AND DAILY USE.`;
- short paragraph: `We translate routines, circulation and constraints into a layout that supports people, service and growth before the build begins.`;
- orange button `PLAN THE SPACE`.
The masthead must feel like an internal editorial title page, never like a Home hero.

Section 1 — technical evidence:
- label `LAYOUT AS EVIDENCE`;
- headline `THE SPACE HAS TO WORK BEFORE IT LOOKS FINISHED.`;
- left rail with four editable callouts: `ENTRY`, `CUSTOMER PATH`, `SERVICE FLOW`, `STORAGE`;
- one large, inspectable off-white commercial floor plan on the right, showing a compact café or hospitality layout with circulation markings and a pen/ruler at the edge. The plan is one future raster asset inside an Image widget; labels remain separate Elementor text.
- composition must be open and technical, not a boxed photo card.

Section 2 — flat editorial list:
- heading `WHAT GETS SOLVED`;
- four horizontally aligned list items separated by thin vertical rules, not cards:
  `01 CIRCULATION`, `02 OPERATION`, `03 CAPACITY`, `04 ADAPTATION`;
- very short supporting copy beneath each title; orange numbers, charcoal titles.

Section 3 — process:
- heading `HOW THE LAYOUT TAKES SHAPE`;
- four steps in one flat sequence with strong spacing and thin separators:
  `01 BRIEF THE ROUTINE`, `02 MAP THE SPACE`, `03 TEST THE FLOW`, `04 ISSUE THE DIRECTION`;
- use one restrained top-down planning still life across part of the section: hands testing tracing-paper overlays on a plan with a scale ruler and pencil. Keep it in one fixed Image-widget rectangle and do not add UI cards.

Section 4 — deliverables:
- heading `WHAT YOU RECEIVE`;
- asymmetric evidence composition rather than an equal grid: one larger plan/drawing image and two smaller documentary crops, balanced with editable labels;
- exact labels: `ZONING PLAN`, `FURNITURE LAYOUT`, `CIRCULATION NOTES`, `IMPLEMENTATION BRIEF`;
- imagery: plan sheets, tracing overlays, clear specification notes and a small material cue. Avoid unreadable fake forms and avoid invented data.

Section 5 — applied case:
- label `FROM PLAN TO PLACE`;
- title `AURORA CAFÉ`;
- pair one finished warm café interior photograph with a smaller corresponding plan fragment, showing the transition from layout logic to lived space;
- short supporting copy and text link `VIEW PROJECT`;
- use warm wood, pale stone, charcoal metal, natural light and real operational details. The interior is documentary, not luxury stock photography.

Final dark CTA band:
- cyan label `PLAN FIRST`;
- large heading `PLAN BEFORE THE BUILD STARTS.`;
- short sentence `Bring the routine, constraints and ambition. We’ll shape the spatial logic.`;
- orange button `PLAN YOUR PROJECT`;
- very restrained blueprint linework in the dark background, with flat treatment and no glow.

Footer: repeat the approved Services footer structure and visual discipline. Keep it light, compact and editable. Use only recognizable Mina Forma headings and concise lines; avoid invented legal or contact details if exact text is not visible.

The page must survive a squint test with these eye stops: `02 / COMMERCIAL LAYOUT`, the annotated floor plan, then the orange action. Keep body text readable, sections breathable and the entire composition credible as nested Elementor Containers, Heading/Text Editor/Image/Button widgets and shared Theme Builder header/footer surfaces.

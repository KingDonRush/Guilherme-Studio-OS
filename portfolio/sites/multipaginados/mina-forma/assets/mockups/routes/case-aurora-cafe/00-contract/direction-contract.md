# Aurora Café — direction contract

## Route job

`/projects/aurora-cafe` must prove how Mina Forma turned a compact hospitality brief into a space that is easier to enter, understand, operate and revisit. The page receives a visitor who already saw Aurora Café in the Projects listing and now wants depth, evidence and confidence before planning a project.

The memorable truth is: **one clear spatial move reorganized the service flow and made the room warmer and easier to use.**

Primary action: `PLAN YOUR PROJECT`.

## Template-family role

Aurora Café is the seed case used to approve the **Single Case** visual family. After approval, this page structure becomes one Elementor Theme Builder template rather than a manually rebuilt page for every project.

The reusable contract is:

- **fixed by the template:** outer rails, masthead geometry, narrative sequence, plan-to-place relationship, gallery rhythm, project-system band, outcome structure, CTA and footer;
- **dynamic per case:** case number, title, location, typology, thesis, area, completion date, services, brief, challenge, response, plan, callouts, gallery, materials and qualitative outcomes;
- **generated per case:** only the photographs, plan/diagram, material imagery and other non-native visual assets required by that project;
- **conditional:** plan, material strip or secondary gallery groups may disappear cleanly when a case lacks that evidence, without leaving empty regions;
- **exceptional:** a new full-page mockup direction is justified only when a case's real narrative cannot fit the approved structure without weakening it.

Preferred implementation target: a Theme Builder `Single Case` template applied to the future canonical project/case content type. The exact display condition depends on the content model adopted during implementation; this visual phase must not hard-code a WordPress structure prematurely.

This means the Aurora approval freezes a **system**, not only one route. Other cases must vary through content and asset packs, not through arbitrary new layouts.

## Protected hierarchy

The first three eye stops are:

1. `CASE / 01` and `AURORA CAFÉ`;
2. the project thesis and compact metadata;
3. one wide establishing image placed below the masthead.

The opening is a compact, photo-free project dossier. It must not use the Home recipe of a headline beside a dominant photograph. No text may sit over photography.

## Required page sequence

1. Shared header with `Projects` active.
2. Compact case-dossier masthead.
3. Wide establishing image of Aurora Café.
4. Flat three-column narrative: `THE BRIEF`, `THE CHALLENGE`, `THE RESPONSE`.
5. `THE SPATIAL MOVE`: a large plan plus four legible callouts.
6. `THE SPACE IN USE`: an asymmetric three-image gallery.
7. `PROJECT SYSTEM`: facts, materials and services applied.
8. `WHAT CHANGED`: three qualitative outcomes without invented metrics.
9. Shared dark CTA and light footer.

## Locked copy

### Header

- `Mina Forma`
- `Studio`
- `Services`
- `Projects`
- `Method`
- `About`
- `Contact`
- `PLAN YOUR PROJECT`

### Masthead

- Eyebrow: `CASE / 01`
- Title: `AURORA CAFÉ`
- Context: `HOSPITALITY · SÃO PAULO`
- Thesis: `A COMPACT CAFÉ SHAPED FOR CLEARER FLOW, WARMTH AND REPEAT VISITS.`
- Metadata: `128 M²`, `COMPLETED 2026`, `INTERIOR CONCEPT + COMMERCIAL LAYOUT`

### Narrative

- `THE BRIEF`
- `Create a compact café that feels calm, distinct and easy to use throughout the day.`
- `THE CHALLENGE`
- `A narrow arrival and an unclear counter sequence compressed customers and service into the same path.`
- `THE RESPONSE`
- `One continuous counter line separates ordering, pickup and seating while preserving an open view through the room.`

### Spatial move

- `THE SPATIAL MOVE`
- `OPEN THE ARRIVAL. CLARIFY THE COUNTER. FREE THE CUSTOMER PATH.`
- Callouts: `ARRIVAL`, `QUEUE`, `SERVICE`, `SEATING`

### Gallery and system

- `THE SPACE IN USE`
- Captions: `COUNTER`, `SEATING`, `MATERIAL DETAIL`
- `PROJECT SYSTEM`
- Labels: `AREA`, `SCOPE`, `MATERIALS`, `SERVICES APPLIED`
- Materials: `OAK`, `LIME PLASTER`, `PALE STONE`, `BLACK METAL`, `CLAY UPHOLSTERY`

### Outcomes and CTA

- `WHAT CHANGED`
- `CLEARER SERVICE PATH`
- `MORE LEGIBLE ARRIVAL`
- `WARMER SEATING RHYTHM`
- CTA eyebrow: `START WITH THE SPACE`
- CTA title: `PLAN A SPACE THAT WORKS LIKE THIS.`
- CTA body: `Bring the routine, constraints and ambition. We’ll shape the right spatial logic.`
- CTA button: `PLAN YOUR PROJECT`

## Visual and treatment budgets

- Preserve the shared outer rails and full-width section separators.
- Use inner rules only to organize evidence; do not turn the story into a wall of cards.
- Use no UI/card shadows. Natural photographic shadows are allowed.
- Keep paper texture on the page and material texture inside photographs.
- Show at most two strong photographs in one viewport, with one clearly dominant.
- Orange owns case numbering and the primary CTA. Cyan owns active navigation and minor rules.
- Use no rounded cards, gradients, dark photo overlays, dashboard language or invented performance metrics.

The deliberate visual risk is documentary sequencing: **wide establishing image → technical plan → close-up gallery**. That rhythm makes the page a case study instead of a generic promotional landing page.

## Elementor construction

- Header and footer: shared Theme Builder templates; WordPress Nav Menu for real navigation.
- Page body: one reusable Theme Builder `Single Case` template populated by dynamic fields.
- Masthead: Grid Container with editable Heading and Text Editor widgets.
- Establishing image: one individual Image widget.
- Narrative and outcomes: flat Grid Containers; separators made with container borders.
- Spatial move: two-column Grid Container with one plan Image widget and editable text callouts.
- Gallery: Grid Containers with three individual Image widgets; no absolute positioning.
- Project system: Containers, Heading and Text Editor widgets; material images remain individual assets when produced.
- CTA: shared dark Container with editable copy and Button widget.

Dynamic-field groups should be defined before implementation so repeated case content is entered canonically instead of baked into individual Elementor pages. Optional evidence groups must use template conditions or a content-model fallback, not manual deletion per case.

The mockup must not require a full-page raster, text baked into photographs, fragile negative margins or image-controlled section heights.

## Rejection conditions

Reject the candidate if:

- the opening resembles the Home or Services hero;
- a photograph competes beside the title in the masthead;
- the page becomes a sequence of boxed cards;
- the plan reads as decoration instead of causal evidence;
- the gallery overwhelms the narrative or repeats the same camera angle;
- any quantitative result is invented;
- the CTA or footer diverges from the approved route family;
- the layout would require fragile Elementor positioning.

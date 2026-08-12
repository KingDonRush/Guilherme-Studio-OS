# Commercial Layout Elementor Handoff

Status: visual contract approved; assetization pending

## Approved reference

- Route: `/services/commercial-layout`
- Mockup: `../02-approved/service-detail-commercial-layout__desktop__approved.png`
- Dimensions: `864x1821`, RGB
- SHA-256: `edcbe6e6c54003f735659f8a9f5555eb2b29cb41506fb8170d0fabb594ce3188`

Do not begin implementation from the old flat-folder Service Detail v1. The
approved route image above is the authority.

## Section order

1. shared header;
2. compact service masthead;
3. layout-as-evidence plan section;
4. four operational outcomes;
5. four-step layout process and planning photograph;
6. asymmetric deliverables evidence;
7. Aurora Café plan-to-place case;
8. shared dark CTA;
9. shared light footer.

## Elementor ownership

- Header and footer: shared Theme Builder surfaces; real navigation uses the
  WordPress Nav Menu widget.
- Masthead: Grid Container with Heading, Text Editor and Button widgets. Keep
  `02`, all headings and copy editable.
- Plan evidence: two-column Grid Container. Callout labels and descriptions are
  editable text; the annotated plan is an individual Image widget asset.
- Outcomes and process: nested Containers with Heading/Text Editor widgets and
  border separators. Do not rasterize the text or use Spacer widgets to force
  alignment.
- Deliverables: asymmetric Grid Containers with one Image widget per visual and
  editable captions.
- Applied case: responsive Grid Container with individual interior and plan
  images, editable copy and a link/button to the case route.
- CTA: shared dark Container treatment with editable text and Button; blueprint
  linework becomes its own asset only during assetization.

## Geometry and responsive rules

- Desktop imagery has explicit aspect ratios and max heights; media must not
  grow its parent section.
- Tablet recomposes wide rows into two bands without changing content order.
- Mobile stacks title before copy, callouts before plan, and converts the
  process into a vertical bordered sequence.
- Use Grid/Flex Containers as structure. Avoid absolute positioning, overflow
  tricks and fixed viewport-height sections.

## Locked treatments

- Continuous page rails and full-width section separators.
- Warm paper field, charcoal type, orange service numbering and restrained cyan
  rules.
- Zero card/UI shadows; only natural contact shadows inside photographs.
- No Home-style photographic hero, rounded cards, blue panels or equal card
  wall.

## Assetization boundary

Assetization happens after the planned route mockups are frozen. Generate each
photo, plan, drawing fragment and blueprint treatment separately from this
approved visual contract. Do not crop the full-page mockup into a source sheet.

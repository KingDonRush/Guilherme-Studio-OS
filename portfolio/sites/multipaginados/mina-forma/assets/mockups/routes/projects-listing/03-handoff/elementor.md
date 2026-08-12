# Projects Listing Elementor Handoff

Status: visual contract approved; assetization pending

## Approved reference

- Route: `/projects`
- Mockup: `../02-approved/projects-listing__desktop__approved.png`
- Dimensions: `864x1821`, RGB
- SHA-256: `9b7e1a90a10abea606ae92882a687280633ea17c36e35dbb25be5ddfd5d660a3`

Do not implement from the old flat-folder Projects v1. The approved route image
above is the authority.

## Section order

1. shared header;
2. photo-free editorial projects intro;
3. single typology filter row;
4. featured Aurora Café case;
5. two flat rows of three selected projects;
6. four-column proof strip;
7. shared dark CTA;
8. shared light footer.

## Elementor ownership

- Header/footer: shared Theme Builder surfaces; navigation remains a real
  WordPress Nav Menu.
- Intro: Grid Container with Heading and Text Editor widgets. Keep every label
  and sentence editable.
- Filters: Elementor Taxonomy Filter when the project content model supports
  it; otherwise use real category links. Preserve square styling and a single
  active cyan underline. Do not use pill controls.
- Featured case: two-column Container with one wide Image widget and an editable
  metadata/copy/action rail.
- Selected work: three-column Loop Grid on desktop using one reusable loop item.
  The item contains Image, project number, title, typology, one-line summary and
  link. No card background, radius or shadow.
- Proof strip: four-column flat Grid Container with vertical border separators.
- CTA: shared dark Container with editable text and Button; blueprint linework
  remains a separate future asset.

## Geometry and responsive rules

- Featured image uses an explicit wide aspect ratio and must not define the
  section height.
- Selected-work images use one consistent aspect ratio across the approved
  three-column rows.
- Tablet may use two columns; mobile becomes one ordered project list with each
  caption attached to its image.
- Filters may wrap at smaller widths without becoming a dropdown unless content
  growth later requires one.
- Use Grid/Flex Containers and Loop Grid. Avoid absolute positioning, overflow
  tricks and Spacer widgets.

## Locked treatments

- Photo-free oversized opening and one filter row.
- Aurora Café owns the only featured-project scale.
- Continuous page rails, full-width separators and flat project items.
- Warm paper, charcoal type, orange numbering and restrained cyan rules.
- Zero card/UI shadows, rounded cards, dark photo overlays or decorative
  gradients.

## Assetization boundary

Generate one project photograph per final project item and a separate CTA
blueprint treatment after the planned route mockups are frozen. The approved
full-page image is the visual contract, not a crop sheet.

# Services Listing Direction Contract

Status: locked by v24 approval

## Route job

Present the studio's three service tracks as an editorial index and make the
next service choice obvious without repeating the Home's hero formula.

## Protected invariants

- Header and footer inherit the shared Home v2/Theme Builder contract.
- The opening is editorial copy, not `text + dominant hero photo`.
- The three services are horizontal rows in the first content block.
- Orange numbers remain in a fixed left column.
- Service photography is an open still life on the off-white field.
- Photography never defines row height.
- Outer rails and section separators remain continuous.
- Bordered structure stays flat; shadow is not a global treatment.
- Material Logic, process, deliverables, CTA and footer remain distinct jobs.

## Forbidden interpretations

- second Home hero;
- equal card wall;
- blue/petrol image panels;
- photo behind the service numbers;
- boxed service thumbnails;
- shadow on every bordered group;
- images that push the next section downward;
- invented header, footer or legal copy.

## Elementor map

Each service row is a fixed desktop Grid Container:

- number: Heading in its own column;
- divider: container border;
- title: Heading;
- description: Text Editor;
- still life: Image widget or background media with explicit max-height;
- action label: Heading/Text;
- action: Button or linked Text widget;
- row separation: container borders, not Spacer widgets.

At tablet the row may recompose into two bands. Mobile may use automatic height,
but desktop media must never determine parent height.

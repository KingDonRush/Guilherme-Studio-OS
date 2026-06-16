# Portfolio Viewport Contract

This contract exists because some portfolio surfaces are designed as fixed
stage compositions, not normal scrolling sites.

## Principle

If a surface is designed as `100vh`, it must remain one viewport. It cannot
become scrollable because the browser chrome, viewport height, WordPress admin
bar, or a 30px vertical difference changed the available space.

If the content needs scroll, design it intentionally as a site-mode page instead
of letting a fixed-stage page fail into scroll.

## Modes

### Fixed Stage

Use for the portfolio home desktop composition and single-viewport case
presentations.

Rules:

- Use `--gp-viewport-height`, not raw `100vh`, `100svh`, or `100dvh`.
- `--gp-viewport-height` must subtract the WordPress admin bar when present.
- Do not set `min-height` above the viewport height.
- Do not use `height: max(<fixed px>, 100vh)` on the stage.
- Do not set `body` or the stage to `overflow: auto`.
- Compact by vertical range before hiding or clipping important content.
- Reduce secondary copy, rail density, thumbnails, gaps, and controls before
  reducing the main identity or primary evidence.

Current fixed-stage ranges:

| Surface | Width range | Height ranges |
| --- | --- | --- |
| Portfolio home | `>= 981px` | default, `<= 830px`, `<= 700px`, `<= 610px` |
| Simple Budget case | `>= 1341px` | default, `<= 850px`, `<= 720px`, `<= 610px` |

### Site Mode

Use when the surface genuinely needs document flow, reading sequence, or many
stacked sections.

Rules:

- Scrolling is intentional and designed.
- The layout should not pretend to be a fragile `100vh` composition.
- The first viewport still needs a clear job, but later content can live below.
- Mobile column layouts should be treated as site mode unless a separate compact
  fixed-stage design is specified.

## WordPress Admin Bar

WordPress injects a top admin bar for logged-in users:

- desktop admin bar: `32px`;
- mobile admin bar: `46px`.

Fixed-stage pages must subtract this from the stage height. In CSS this is
handled by:

- `--gp-admin-bar-height`;
- `--gp-viewport-height`;
- `body.admin-bar`.

## Verification Matrix

Before considering a fixed-stage page acceptable, test with and without the
WordPress admin bar.

Required desktop heights:

- `900px`;
- `768px`;
- `700px`;
- `610px`;
- `580px`.

Required widths:

- `1440px`;
- `1366px`;
- `1180px` for portfolio home;
- `1024px` for portfolio home stage boundary.

Checks:

- document scroll height must not exceed viewport height in fixed-stage mode;
- horizontal overflow must be false;
- `body` overflow must not be `auto` in fixed-stage mode;
- WordPress admin bar simulation must not create page scroll;
- primary identity and primary evidence must remain visible;
- optional copy may clamp before the page becomes scrollable.

## Rule Of Thumb

A fixed-stage page should fail by becoming denser, not by becoming scrollable.


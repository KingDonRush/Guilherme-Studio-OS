# Portfolio Visual Direction

Date: 2026-05-15

Status: active direction for concept art, design prompts, and later
implementation.

## Current Provisional Baseline

Use `docs/assets/portfolio/provisional/portfolio-hero-provisional-v1.png` as
the current matured-but-provisional visual baseline.

Known issues to improve in the next pass:

- `See project` should not sit awkwardly under project symbols or fight the
  card content. Prefer a hover/focus reveal with an eye icon and `See project`.
- GitHub should be a separate small action on plugin/system cards, not the
  primary card label.
- The 3D Viewer stack badge should use Three.js, not a generic `3D` badge.
- The SEO badge should name a real SEO plugin when the case study depends on
  one. Current provisional default: Rank Math, because it has documented
  Elementor and WooCommerce relevance in the portfolio context.
- The vertical wave between the dark bio area and light project grid can use
  `docs/assets/portfolio/shapes/profile-edge-wave.svg` as a CSS-positioned
  divider if native Elementor shape dividers are not enough.

## Core Direction

The portfolio should feel like a personal professional profile for a WordPress
developer, not like an agency site, dashboard, admin tool, or generic SaaS
landing page.

The best visual territory is:

- Discord-like human energy: social, direct, approachable, online, easy to
  contact.
- OpenAI-like restraint: precise, spacious, premium, serious, calm, and clean.

This is inspiration only. Do not copy Discord or OpenAI brand assets, logos,
illustration language, exact colors, or product UI.

## First Screen

Use a full first-screen composition, not a tall page screenshot.

Preferred structure:

- Left profile area: dark, rich, personal, with Guilherme's photo, name,
  `kingdonrush`, compact role statement, availability, short bio, and social
  links.
- Right projects area: light, clean, modular grid with six visible cards:
  three custom WordPress systems and three design-to-WordPress builds.
- Transition between areas: soft curve, diagonal, glow, layered surface, or
  another controlled shape that prevents a harsh black/white split.

No header is needed in the hero concept. Navigation can exist later in the real
site, but it should not compete with the first visual study.

## Content Signals

Confirmed public identity:

- Name: Guilherme Silva
- Handle: `kingdonrush`

Confirmed role signals:

- WordPress Developer
- Elementor Implementation
- WooCommerce
- Custom Solutions
- Jobs + Freelance

Confirmed stack:

- WordPress
- Elementor
- WooCommerce
- ACF
- Crocoblock
- PHP
- JS
- CSS
- Git

Do not display the full stack as a large global chip strip in the profile area.
That overloads the bio. Use the profile area for identity, positioning, contact,
and availability.

Show stack signals at project-card level instead. Each card should carry only
the technologies that help explain that specific project.

Social/contact icons to represent in the profile area:

- LinkedIn
- WhatsApp
- Email
- Instagram
- GitHub

Do not invent clients, job titles, years of experience, certifications, metrics,
awards, or personal history.

## Selected Projects

Use `Selected Projects` as the main work-area heading.

Place one general CTA in the heading row:

- `Discuss a project`

Do not place separate CTAs in each category heading. The main CTA should cover
freelance conversations, agency work, and hiring conversations without sounding
like a generic sales banner.

### Custom WordPress Systems

This category proves logic, extensibility, plugin architecture, Elementor
widgets, WooCommerce actions, and custom WordPress behavior.

1. Simple Budget Plugin
2. 3D Viewer for Elementor
3. WooCommerce Toolkit for Elementor

Plugin/system cards may show both:

- `See project`
- GitHub icon/button when public code exists.

Plugin/system cards should also include compact project-level stack badges such
as WordPress, Elementor, WooCommerce, PHP, JS, Three.js, or Git when relevant.
Keep these badges subtle and scannable.

Each card should have a subtle unique accent color, such as a thin border,
short top rule, or restrained glow. Keep the intensity around 3-4/10: enough to
separate cards and add personality, but not enough to look like gamer neon or a
busy AI-generated interface.

### Design-to-WordPress Builds

This category proves polished implementation, design translation, responsive
delivery, WooCommerce builds, page structure, performance, and client-ready
site execution.

1. Landing Page Implementation
2. Institutional Website
3. WooCommerce Store

Implementation/build cards should show `See project` only. Do not add GitHub
icons to site/build cards unless a specific public code repository is part of
that case study.

Implementation/build cards should include small stack badges when useful, for
example Elementor, WordPress, WooCommerce, ACF, CSS, Rank Math SEO, or
performance. These badges should support the case study, not become a second
navigation system.

Implementation/build cards should also follow the unique accent-color rule.
Prefer soft, project-relevant accents over large color fills.

Cards must feel public-facing and final. Do not include add buttons, empty
project slots, builder handles, editable placeholders, software controls, fake
browser chrome, or dashboard affordances.

## Typography

Avoid a default Roboto-like look, especially in tags, filters, and supporting
labels.

Good directions:

- Space Grotesk
- Geist
- Sora
- Manrope
- Inter Tight

Use a strong display treatment for `Guilherme Silva`, but keep cards and body
copy highly readable.

## Background Rules

The background should be thematic, not noisy.

Allowed:

- subtle gradients;
- controlled glow;
- quiet geometric structure;
- depth from layered surfaces;
- very soft texture only if it does not compete with text;
- a few large brand-neutral shapes inspired by product/community design.

The left profile background should not be flat black. Use restrained depth:
soft radial glow, subtle mesh, quiet curves, or a premium gradient field at
roughly 3-4/10 intensity. This should support the portrait and bio, never fight
the copy.

Avoid:

- random code snippets;
- fake terminal windows;
- fake Mac windows;
- WordPress watermarks behind text;
- dotted patterns everywhere;
- technical confetti;
- stickers, hearts, coffee, pens, desk props, or designer moodboard objects;
- decorative UI that makes the page look like software instead of a portfolio.

## Acceptance Criteria For The Next Image

The next visual is acceptable only if:

- the left profile area feels richer than a plain business card;
- the left profile area has enough breathing room and does not carry a full
  global tech-stack strip;
- the left profile background has subtle depth without becoming decorative
  noise;
- the portrait has no `Online` badge or status label over it;
- the right card grid stays scalable for future projects;
- each project card has a restrained unique accent color or border treatment;
- the split between dark and light areas feels intentional and polished;
- the design has personality without becoming messy;
- the viewer understands the professional offer within five seconds;
- there is no invented biography, fake project, fake metric, or wrong name;
- the result does not look AI-generated through background clutter.

## Next Step

Generate one high-fidelity hero concept using Guilherme's approved headshot as
the only personal reference.

After that, review it against this document before creating more variants. If
the concept works, convert it into an implementation brief for the real
WordPress/Elementor build.

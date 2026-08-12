# Implementation Plan: Portfolio Area Map

## Objective

Build a small WordPress-native admin portal that maps arbitrary human areas to existing WordPress objects and native editor destinations.

The implementation must not recreate content editing, project management, provider discovery, Elementor management, or relationship analysis. It should reduce cognitive load by answering: "what belongs here, and where do I click?"

## Chosen Admin Recipe

Use a WordPress-native list/detail manager with custom admin-post forms:

- top-level wp-admin page with a native Dashicon;
- capability checks on every render and mutation;
- nonce checks on every admin-post action;
- sanitized payloads;
- escaped output;
- scoped admin CSS only on this screen;
- WP-CLI parity for all mutable associations.

## Clean Code Lens

- Intention: reduce WordPress admin cognitive load by mapping human areas to
  existing native destinations.
- Behavior contract: attach/detach associations and open native destinations;
  do not edit underlying WordPress objects inline.
- Responsibility boundary: area records, item associations, destination links,
  admin rendering, admin actions and WP-CLI commands stay in separate modules.
- Complexity budget: no provider suggestions, relationship graph, inline page
  creation, dynamic-tag scanning or project-management lifecycle in this slice.
- Dependency policy: use WordPress APIs and existing theme autoloading; add no
  third-party dependency.
- Error behavior: invalid area, invalid item, unsafe URL or missing native
  destination must fail visibly without deleting content.
- Testability: WP-CLI lifecycle smokes, admin render smoke, notice containment
  smoke, PHP lint and `git diff --check`.
- Exception/debt: any compatibility shim for old local records must be explicit
  and have a removal trigger.

## Proposed Modules

```text
src/Areas/
  AreaPostType.php or AreaRegistry.php
  AreaRepository.php
  AreaItemRepository.php
  AreaSanitizer.php
  DestinationResolver.php

src/Areas/Admin/
  AreaMapPage.php
  AreaMapActions.php
  Views/
    AreaSwitcherView.php
    AreaHeaderView.php
    ItemGroupView.php
    AttachItemView.php

src/CLI/
  AreaCommand.php
  AreaItemCommand.php

assets/css/admin-area-map.css
```

The exact storage choice remains open until implementation starts. If old local records do not contain real user data, prefer starting with clean area-centered storage instead of compatibility-heavy naming.

## Data Boundary

### Area

Stores the human scope:

- title;
- slug;
- status;
- notes;
- order.

### Area Item

Stores the association and shortcut metadata:

- category;
- role;
- label;
- type;
- object type;
- object ID;
- admin URL;
- notes;
- order.

Area items never own the underlying WordPress object lifecycle.

## UI Structure

1. Page title: `Mapa do Portfólio`.
2. Short helper line explaining that the map organizes and opens native WordPress places.
3. Area side rail.
4. Selected area header with badges.
5. Primary grouped items:
   - Pages;
   - Content;
   - Presentation;
   - Navigation;
   - Admin destinations;
   - References.
6. Compact attach-existing-item form.
7. Native action buttons on each item.

Theme Builder links live under Presentation and keep lower visual weight than primary pages/content.

## Layout Contract

The desktop target is a calibrated wp-admin single-screen tool:

- account for admin menu, admin bar and browser chrome;
- use the available content height, not naive browser `100vh`;
- isolate or collapse forced WordPress/plugin notices on this screen;
- use internal scrolling only when item volume requires it;
- never let global notices decide the page rhythm.

## WP-CLI Contract

Expected commands:

```text
wp gp area list
wp gp area get <area>
wp gp area create <title>
wp gp area update <area>
wp gp area delete <area>
wp gp area-item list <area>
wp gp area-item attach <area>
wp gp area-item update <area> <item-id>
wp gp area-item detach <area> <item-id>
wp gp area-item links <area> <item-id>
```

These commands are the path Codex should use for routine association work.

## Migration Stance

Before coding, inspect whether the old local records contain useful data:

- if empty or disposable, remove old naming and start clean;
- if useful, add a small one-time migration command;
- do not keep old names just for comfort.

## Verification

- PHP lint changed theme files.
- WP-CLI smoke for area lifecycle.
- WP-CLI smoke for area item lifecycle.
- Admin render smoke for `Mapa do Portfólio`.
- Visual smoke at logged-in desktop viewport.
- Simulated notice containment smoke.
- `git diff --check`.

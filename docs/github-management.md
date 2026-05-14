# GitHub Management

This workspace manages each plugin repository as a public portfolio asset.

## Current Repositories

| Plugin | Local path | Remote | Branch |
| --- | --- | --- | --- |
| 3D Viewer to Elementor | `wordpress/wp-content/plugins/3d-viewer-to-elementor` | `https://github.com/KingDonRush/3d-viewer-to-wordpress` | `main` |
| Simple Budget Plugin | `wordpress/wp-content/plugins/simple-budget-plugin` | `https://github.com/KingDonRush/simple-budget-plugin` | `master` |

## Remote Action Status

Local `gh` is not authenticated yet. Remote issue/label/milestone creation is
blocked until GitHub auth is available.

The local repository governance files are still useful immediately because they
will appear on GitHub after push and standardize how issues and PRs are created.

## Commit Messages

GitHub does not provide separate translated commit-message fields. Every new
commit should include Portuguese, Spanish, and English in the commit message
itself, using the workspace policy in `.ai/operational/commit-message-policy.md`.

## What Is Prepared Locally

Each plugin should carry:

- issue templates;
- PR template;
- label manifest;
- GitHub management doc;
- milestone plan.

## First Remote Actions After Auth

For each plugin:

1. Create labels from `.github/labels.yml`.
2. Create milestones:
   - `M0 - Repository Control`
   - `M1 - Stability`
   - `M2 - Product Polish`
   - `M3 - Portfolio Evidence`
3. Create initial audit issues.
4. Open a PR for repo governance files if they are not pushed directly.

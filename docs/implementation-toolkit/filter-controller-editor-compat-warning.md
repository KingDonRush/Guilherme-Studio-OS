# Filter Controller Editor Compatibility Warning

Date: 2026-06-05

Task: `TASK-FC-025`

Status: implementation complete, Guilherme Elementor QA required.

Plugin commit: `20d6eba` pushed to
`https://github.com/KingDonRush/elementor-implementation-toolkit` on `main`.

## Trigger

Guilherme raised the maintenance risk clearly: the Filter Controller editor
integration currently depends on Elementor panel behavior that may change in a
future Elementor update. If fallback behavior runs silently, it becomes harder
to know whether the widget is healthy, partially adapted, or only appearing
healthy because the toolkit patched the editor panel in place.

## Fix

Plugin changes:

- `assets/js/eit-editor.js`
  - records editor fallback reasons once per session;
  - writes a browser `console.warn` with the specific fallback reason;
  - renders an editor-only compatibility warning inside the Elementor panel;
  - keeps the warning alive across panel rerenders;
  - marks fallback usage for:
    - Elementor settings command failure;
    - Style state command failure;
    - Style panel DOM cadence.
- `assets/css/eit-editor.css`
  - adds a compact warning style that reads as caution, not fatal error.
- `includes/Support/Assets.php`
  - exposes localized warning title and message through `eitEditorConfig`.
- `elementor-implementation-toolkit.php`
  - bumps plugin asset version to `0.2.7`.

## Boundary

This slice does not remove the fallback. It makes fallback usage visible and
diagnosable. The frontend output and saved widget settings remain controlled by
the existing Filter Controller contract.

The warning itself is editor-only and best-effort because it still anchors into
Elementor's panel DOM. That is acceptable for this slice because the goal is
operational transparency, not replacing Elementor's control system.

## Verification

Passed:

- `mcp__agentic_ops__validate_task` for `TASK-FC-025`;
- `node --check assets/js/eit-editor.js`;
- `node --check assets/js/eit-frontend.js`;
- `node --check assets/js/eit-admin.js`;
- PHP lint for plugin PHP files;
- `composer validate --strict`;
- `git diff --check` in plugin and root;
- public GitHub push gate for one ahead commit.

Not run:

- Browser/Elementor visual QA. This is Guilherme's QA boundary for nuanced
  editor placement and repeated-interaction behavior.

## QA Notes

Guilherme should confirm:

- the warning appears when the Style panel cadence fallback is active;
- the warning does not feel like a fatal error;
- the warning does not obscure important controls;
- after an Elementor editor refresh, the asset version `0.2.7` is loaded.

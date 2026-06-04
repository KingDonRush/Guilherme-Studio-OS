# Elementor Implementation Toolkit Git History Remediation Subplan

Date: 2026-06-04

## Objective

Turn the current unpublished Elementor Implementation Toolkit history into a
GitHub-ready history without losing work, hiding risk, or normalizing reactive
cleanup as the default workflow.

This is a plan only. Do not execute the history rewrite/push until Guilherme
explicitly approves the execution step.

Execution status: completed after Guilherme approval on 2026-06-04.

## Current State

Repository:

`wordpress/wp-content/plugins/elementor-implementation-toolkit`

Observed state:

- Branch: `main`
- Remote: `origin/main`
- Remote URL: `https://github.com/KingDonRush/elementor-implementation-toolkit.git`
- Local branch is ahead of `origin/main` by 15 commits.
- Working tree also has uncommitted widget-first work:
  - PSR-4 Composer support
  - Filter Controller modularization
  - Elementor cadenced controls
  - range slider style/customization pass
  - frontend/browser evidence adjustments

The root repository also has separate local-only planning and evidence changes.

## Execution Result

Executed on 2026-06-04.

Backup and preservation:

- Backup branch: `codex/eit-pre-public-history-20260604`
- Backup commit: `7c724ca`
- Working tree patch: `/tmp/eit-working-tree-before-public-history-20260604.patch`

Public branch:

- Recompose branch: `codex/eit-public-history-20260604`
- Pushed target: `origin/main`
- Push result: `b1efdc4..a7ff90f HEAD -> main`

Final public commits:

```text
a7ff90f plugin(filter-controller): modularize widget-first controls / modulariza controles widget-first / modulariza controles widget-first
b87b771 plugin(admin): stabilize filter preset admin / estabiliza admin de presets / estabiliza admin de presets
```

Local plugin state after execution:

- `main` is aligned with `origin/main`.
- `codex/eit-pre-public-history-20260604` remains as the recovery branch.
- `codex/eit-public-history-20260604` remains as the clean publication branch.

Verification executed:

- `composer validate --strict`
- `find . -path ./vendor -prune -o -name "*.php" -exec php -l {} +`
- `node --check assets/js/eit-frontend.js`
- `node --check assets/js/eit-editor.js`
- `composer dump-autoload`
- Composer autoload smoke for `EIT\Elementor\FilterController\StyleControls`
- Fallback autoload smoke for `EIT\Elementor\FilterController\ContentControls`
- WP-CLI control smoke: `range-controls-ok:272`
- WP-CLI render smoke: `range-render-ok:1248`
- `git diff --check`
- `git diff --stat codex/eit-pre-public-history-20260604` returned no diff

Frontend/editor QA note:

- Guilherme remains final QA for Elementor editor interaction, motion, visual
  hierarchy, and multi-screen frontend nuance.

## Analysis

The problem is not that 15 local commits exist. The problem is that those commits
sit directly on the public branch while still unpublished, and the current
working tree adds another large slice on top.

For a portfolio-facing GitHub repo, pushing this as-is would make the public
history read like raw agent progress instead of intentional engineering
delivery.

The right correction is a controlled publication recompose:

- preserve the current state before touching history;
- classify the old commits by product/technical outcome;
- create a clean publication branch from `origin/main`;
- replay the work as a small number of public commits;
- verify the recomposed branch;
- push only after the public history gate passes.

## Target Public History

Proposed public commits:

1. `plugin(admin): stabilize filter preset admin / estabiliza admin de presets / estabiliza admin de presets`
   - Covers the already committed Admin V0.2 work currently sitting in the 15
     unpublished commits.
   - Technical layer: admin UI, preset state views, preview modal, admin
     component splitting.

2. `plugin(filter-controller): modularize widget-first controls / modulariza controles widget-first / modulariza controles widget-first`
   - Covers the current uncommitted PSR-4 and Filter Controller modularization
     work.
   - Technical layer: Composer autoload, widget facade, content/style control
     classes, runtime config helpers.

3. `plugin(filter-controller): add cadenced range styling / adiciona estilo cadenciado de range / agrega estilo cadenciado de range`
   - Covers cadenced Elementor controls, range slider style options, frontend JS
     sync, and CSS fixes from browser evidence.
   - Technical layer: Elementor controls, editor JS, frontend JS, range CSS.

If the diff review shows the widget-first work is too intertwined for commits 2
and 3, collapse them into one public commit rather than force a fake split.

## Safety Procedure

Before any rewrite or push:

1. Run status in the root repo and plugin repo.
2. Create a backup branch from the current plugin `main`.
3. Create a binary patch of the current plugin working tree in `/tmp`.
4. Record untracked plugin files explicitly.
5. Optionally make a temporary WIP commit on the backup branch only, so the full
   current state is recoverable without relying only on patch files.

Suggested backup names:

- `codex/eit-pre-public-history-20260604`
- `/tmp/eit-working-tree-before-public-history-20260604.patch`

## Recompose Procedure

1. Create a clean branch from `origin/main`:
   - `codex/eit-public-history-20260604`
2. Re-apply the Admin V0.2 work as the first public commit.
3. Re-apply the widget-first modularization and range work as one or two public
   commits according to the target history above.
4. Use the mandatory trilingual commit message format from
   `.ai/operational/commit-message-policy.md`.
5. Keep root docs/evidence out of plugin commits.

Preferred techniques:

- `git cherry-pick --no-commit` for commit ranges when the groups are clean.
- `git merge --squash` from the backup branch when the group should become one
  publication unit.
- Avoid `git reset --soft origin/main` as the default method.

## Verification Gate

Before push:

- `composer validate --strict`
- PHP lint for plugin PHP files outside `vendor`
- `node --check assets/js/eit-frontend.js`
- `node --check assets/js/eit-editor.js`
- WP-CLI control/render smoke checks for Filter Controller
- `git diff --check`
- `git log --oneline origin/main..HEAD`
- `git diff --stat origin/main..HEAD`

Manual/frontend QA remains Guilherme's final responsibility for Elementor editor
flows, motion, hierarchy, and interaction-heavy visual judgment.

## Push Plan

After verification and approval:

1. Push the clean publication branch to GitHub.
2. If the clean branch is based on `origin/main`, push it to `origin/main` as a
   fast-forward update.
3. Align local `main` to the pushed history only after the backup branch exists
   and the push succeeds.
4. Keep the backup branch until Guilherme confirms the GitHub history is
   acceptable.

## Completion Criteria

This subplan is complete only when:

- the current local plugin state is recoverable from a backup branch and patch
  evidence;
- the public branch contains the approved small set of publication commits;
- the verification gate passes on the recomposed branch;
- the push either succeeds or is deliberately deferred with a documented reason;
- local `main` is aligned to the accepted public history after push, or the
  remaining divergence is explicitly documented;
- the root repository records the evidence and decision separately from plugin
  source history.

## Stop Conditions

Stop and ask before pushing if:

- the recompose branch requires a force push;
- verification fails;
- untracked plugin files cannot be clearly assigned;
- the recomposed history drops behavior from the current local branch;
- root docs/evidence would be accidentally mixed into plugin commits;
- GitHub remote state changed unexpectedly after fetch.

## Follow-Up Policy Work

This subplan depends on the new operational policy:

`.ai/operational/git-github-publication-policy.md`

Future plugin work must declare a Git mode and commit map before accumulating
many local commits on a public branch.

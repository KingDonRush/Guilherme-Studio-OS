# GitHub Micromanagement Protocol

## Purpose

Every plugin repository must be managed like a public proof-of-work asset, not
like a loose code folder.

The AI is responsible for keeping the GitHub surface organized:
- issues;
- labels;
- milestones;
- PR templates;
- release checklists;
- README/case-study gaps;
- evidence needed for the portfolio.

## Current Constraint

`gh` is not authenticated locally yet. Remote mutations such as creating issues,
labels, milestones, project boards, and PRs require `gh auth login` or an
available GitHub connector session.

Until authentication is available, prepare repository-local `.github/` files and
maintain the intended remote state in docs.

## Per-Plugin GitHub Surface

Each plugin should have:

- `.github/ISSUE_TEMPLATE/` with specific forms;
- `.github/PULL_REQUEST_TEMPLATE.md`;
- `.github/labels.yml` as the label source of truth;
- `docs/github-management.md` describing milestones, issue plan, and release
  gates;
- a clean README in English before public positioning starts.

## Commits

Commit messages must be trilingual. GitHub will display the first line in the
commit list, so the subject line itself should include Portuguese, Spanish, and
English separated by slashes.

## Operating Loop

1. Enter the plugin repository.
2. Run `git status --short --branch`.
3. Check current branch and remote.
4. Sync the GitHub management files.
5. Create or update issues according to the milestone plan.
6. Work one issue at a time.
7. Open PRs with proof: commands run, screenshots when relevant, and manual QA.
8. Keep root docs updated only for cross-plugin strategy.

## Label Taxonomy

- `type:bug`
- `type:feature`
- `type:refactor`
- `type:docs`
- `type:qa`
- `area:elementor`
- `area:wordpress`
- `area:frontend`
- `area:performance`
- `area:settings`
- `area:github`
- `priority:p0`
- `priority:p1`
- `priority:p2`
- `status:needs-audit`
- `status:ready`
- `status:blocked`
- `portfolio:evidence`

## Milestone Pattern

Use the same milestone logic across plugins:

- `M0 - Repository Control`: templates, labels, docs, CI/readme audit.
- `M1 - Stability`: bug fixes and predictable behavior.
- `M2 - Product Polish`: settings, UX controls, docs, demos.
- `M3 - Portfolio Evidence`: screenshots, case study, release notes.

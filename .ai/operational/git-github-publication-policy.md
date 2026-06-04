# Git And GitHub Publication Policy

## Purpose

Prevent reactive history cleanup. Codex must decide the Git/GitHub operating mode
before accumulating commits, especially inside public plugin repositories.

This policy complements:

- `.ai/operational/git-protocol.md`
- `.ai/operational/commit-message-policy.md`
- `.ai/operational/github-micromanagement.md`

## Current Lesson

The Elementor Implementation Toolkit reached an unpublished `main` state with
many local commits plus a dirty working tree. That is not a code failure by
itself, but it is a workflow failure for a portfolio-facing GitHub repository.

The root cause is not "too many commits"; the root cause is mixing three
different histories:

- local working checkpoints;
- implementation evidence;
- public GitHub history.

When those are not separated before work starts, later squashing becomes a
repair step instead of a designed publication step.

## Repository Classes

### Local Root Repository

The workspace root is local orchestration unless Guilherme explicitly publishes
it. It stores strategy, docs, Agentic Ops evidence, memory, and environment
coordination.

Default behavior:

- Commit planning/evidence locally.
- Do not push unless the root gains a remote and Guilherme explicitly asks.
- Never mix plugin source commits into the root repo.

### Public Plugin Repositories

The portfolio-facing plugin repositories are public proof-of-work assets:

- `elementor-implementation-toolkit`
- `simple-budget-plugin`
- `3d-viewer-to-elementor`

Default behavior:

- Treat `main`/`master` as public presentation history.
- Commit messages must follow the trilingual commit policy.
- Pushes should represent coherent publication units, not raw agent progress.
- GitHub README, release notes, issues, and evidence are part of the delivery
  surface when the plugin is being positioned publicly.

### Auxiliary Upstream Repositories

Repos such as `mcp-adapter` and `elementor-mcp` are not portfolio plugin repos
unless Guilherme explicitly makes them part of this project scope.

Default behavior:

- Do not mutate or push them during portfolio plugin work.
- Report dirty state if discovered.

## Required Git Mode Declaration

Before coding in any public plugin repository, Codex must choose and state one
of these modes:

1. `hotfix`: one narrow public commit, usually a bug fix.
2. `public-unit`: one coherent feature/refactor/documentation unit, expected to
   become one to three public commits.
3. `checkpoint-branch`: uncertain or multi-step work where local checkpoints are
   useful, but public history will be curated before merge/push.
4. `release`: version/tag/release-note work after implementation is complete.

If the work is expected to last multiple sessions, touch several subsystems, or
produce more than three commits, default to `checkpoint-branch`, not direct work
on public `main`.

## Commit Map Before Work

For `public-unit`, `checkpoint-branch`, and `release`, Codex must draft a commit
map before the first commit.

The commit map should name:

- intended public commits;
- files or layers each commit may contain;
- verification required for each commit;
- whether root docs/evidence need their own separate commit;
- whether GitHub push is expected in the same session.

Example:

```text
Plugin commit 1: refactor filter controller into PSR-4 helpers
Plugin commit 2: add cadenced Elementor controls and range styling
Root commit 1: record Agentic Ops evidence and project decision
Push: plugin only, after Guilherme approves frontend QA
```

## Public History Gate

Before pushing a public plugin repository, Codex must check:

- `git fetch --prune`
- `git status --short --branch`
- current branch and remote URL
- ahead/behind count
- `git log --oneline origin/<branch>..HEAD`
- `git diff --stat origin/<branch>..HEAD`
- working tree status
- required verification commands
- whether the commit count matches the declared Git mode

If the branch is ahead by more than three commits for one feature or one
delivery slice, Codex must stop and propose a publication plan before pushing.

## Planned History Curation

History curation is allowed when it is planned, backed up, and still local.

Allowed tools:

- feature branches;
- backup branches;
- worktrees;
- `git commit --fixup` plus planned autosquash;
- `git cherry-pick --no-commit` onto a clean publication branch;
- `git merge --squash` onto a clean publication branch;
- patch files in `/tmp` as extra evidence.

Avoid using `git reset --soft origin/main` as the default cleanup pattern. It is
acceptable only as an explicitly approved recovery move after a backup branch
and evidence patch exist.

Never use destructive history commands as a reflex. If public history or user
work can be affected, pause and get explicit approval.

## Push Policy

Default push rules:

- Root repo: no push unless explicitly published.
- Public plugin repo: push after the public history gate passes.
- Auxiliary repo: no push unless the task is explicitly about that repo.

If GitHub is part of the current work, Codex must keep GitHub-facing artifacts
in view: README, release notes, PR/release plan, screenshots, and issue/milestone
state when relevant.

## Handoff Language

Final answers after Git work must distinguish:

- local commit created;
- remote push completed;
- repository still dirty;
- untracked evidence intentionally left uncommitted;
- user QA still required;
- public release still pending.

Do not call a plugin "ready" when only local commits exist.

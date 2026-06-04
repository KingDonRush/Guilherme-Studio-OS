# Git Protocol

## Always

- Check status before changes with `git status --short --branch`.
- Treat the status output as part of the task context: branch, staged files,
  modified files, untracked files, and repository boundary.
- Keep root orchestration changes in the root repository.
- Keep plugin code changes inside each plugin repository.
- Never overwrite uncommitted user work.
- Prefer small, named branches when work becomes more than setup.
- Do not let important artifacts live only as untracked files. Mockups,
  screenshots, evidence reports, plans, and generated design references must be
  either committed, explicitly marked as temporary, or moved out of the repo.
- Run status again before any commit, before changing task direction, and before
  the final response.

## Checkpoints

Use these checkpoints by default:

1. Start: run `git status --short --branch` before edits.
2. During: after creating files or completing a meaningful slice, run targeted
   status for the affected paths.
3. Before commit: inspect the diff and confirm no unrelated user changes are
   included.
4. After commit: run status again and report whether the tree is clean or what
   remains.
5. Handoff: if anything remains uncommitted or untracked, name it explicitly and
   say why it remains.

If the user says "commit before continuing", stop feature work, stage only the
intended scope, commit it, then continue.

## Commit Quality Gate

Do not create a commit just because files changed. A commit is acceptable only
when it meets the workspace quality standard:

1. Scope is intentional: staged files belong to the same task, repository, and
   layer. Root orchestration, plugin source, generated evidence, and temporary
   artifacts are not mixed accidentally.
2. Diff is reviewed: inspect `git diff` and `git diff --staged` for unrelated
   user changes, debug leftovers, accidental deletions, generated noise, and
   untracked files that should have been included.
3. Verification is recorded: run the smallest meaningful checks for the change,
   or state `Not run:` with the reason in the commit body.
4. Agentic Ops evidence is synchronized when Agentic Ops drove the work: task
   status, evidence paths, snapshots, handoff notes, or validation gaps must not
   contradict the committed code or docs.
5. Message quality follows the mandatory Commit Standard below and
   `.ai/operational/commit-message-policy.md`: conventional prefix, trilingual
   subject, PT/ES/EN body, technical layer, and verification.

If any item fails, do not commit yet. Fix the scope, run or document
verification, or split the commit.

## Publication Policy

Before accumulating commits in a public plugin repository, load
`.ai/operational/git-github-publication-policy.md` and declare the Git mode:
`hotfix`, `public-unit`, `checkpoint-branch`, or `release`.

If one feature or delivery slice is ahead of its remote by more than three
commits, do not push reflexively. Stop and create a publication plan or subplan
first. History cleanup is allowed only while unpublished, backed up, and planned.

## Root Repository

The root repo tracks:
- agent brain;
- docs;
- environment setup;
- tool configuration;
- submodule or clone map.

It should not track WordPress core, uploads, generated caches, or dependency
folders. The root directory should contain only `AGENTS.md`, `.ai/`, `docs/`,
and `wordpress/`.

The root repository may remain local-only unless the user explicitly asks to
publish it. Its job is orchestration, evidence, planning, local WordPress
runtime, and portfolio assembly.

## Plugin Repositories

Every plugin must be treated as its own repository, not as ordinary root-repo
content. If a plugin does not already have a repository, initialize a separate
repo for it and publish it to GitHub before treating it as a portfolio asset.
Existing plugins should preserve their original GitHub remote and history. When
changing a plugin:

1. enter `wordpress/wp-content/plugins/<plugin-name>`;
2. run `git status --short --branch`;
3. create or confirm a branch;
4. edit and test locally;
5. commit inside that plugin repo;
6. push/post the plugin repository to GitHub when the work is meant to be public
   portfolio evidence;
7. only then update root docs or orchestration references.

Known current plugin repositories:
- `simple-budget-plugin`: already has a GitHub repository.
- `3d-viewer-to-elementor`: already has a GitHub repository.

GitHub presentation is part of plugin work. Public plugin repositories should
receive polished README assets, screenshots, demo GIFs or video captures,
release notes, and links back from the portfolio site when they become evidence
assets.

## Commit Standard

Use concise conventional prefixes. Choose the closest honest prefix for the
change:
- `docs:`
- `setup:`
- `ai:`
- `plugin:`
- `fix:`
- `test:`
- `chore:`

Every new commit must follow this multilingual shape and
`.ai/operational/commit-message-policy.md`:

```text
type: mensagem em portugues / mensaje en espanol / message in English

PT: Mensagem em portugues.
ES: Mensaje en espanol.
EN: Message in English.

Technical:
- Camada, comportamento, familia de arquivos ou API tocada.

Verification:
- `comando executado` or `Not run: motivo`.
```

GitHub does not translate commit messages automatically, so the multilingual
content must live in the commit message itself.

Do not replace this with a single-language or generic subject such as
`fix: update css`, `docs: update files`, or `chore: changes`. If the change is
tiny, the body may be shorter, but it must still preserve the multilingual
commit shape unless a stricter local repository rule says otherwise.

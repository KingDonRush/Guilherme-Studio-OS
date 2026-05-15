# Git Protocol

## Always

- Check status before changes.
- Keep root orchestration changes in the root repository.
- Keep plugin code changes inside each plugin repository.
- Never overwrite uncommitted user work.
- Prefer small, named branches when work becomes more than setup.

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
2. run status;
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

Use concise conventional prefixes when possible:
- `docs:`
- `setup:`
- `ai:`
- `plugin:`
- `fix:`
- `test:`
- `chore:`

Every new commit must follow `.ai/operational/commit-message-policy.md`:

```text
type: mensagem em portugues / mensaje en espanol / message in English

PT: Mensagem em portugues.
ES: Mensaje en espanol.
EN: Message in English.
```

GitHub does not translate commit messages automatically, so the multilingual
content must live in the commit message itself.

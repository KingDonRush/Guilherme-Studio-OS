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

## Plugin Repositories

Each plugin should preserve its original GitHub remote and history. When changing
a plugin:

1. enter `wordpress/wp-content/plugins/<plugin-name>`;
2. run status;
3. create or confirm a branch;
4. edit and test locally;
5. commit inside that plugin repo;
6. only then update root docs or orchestration references.

## Commit Standard

Use concise conventional prefixes when possible:
- `docs:`
- `setup:`
- `ai:`
- `plugin:`
- `fix:`
- `test:`
- `chore:`

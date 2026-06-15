# Migration Plan to Guilherme Studio OS

Status: authorized and in progress on `codex/studio-os-v1`
Migration type: in-place root transformation with staged ownership changes

## Objective

Transform the current WordPress/portfolio workspace into the private
coordinator repository for Guilherme Studio OS without losing current work,
corrupting nested repositories, exposing secrets, or allowing the old structure
to dictate the new one.

The root directory may be renamed after internal paths and tooling are stable.
Renaming is the final cosmetic operation, not the first architectural one.

## Non-Negotiable Rules

- No migration begins from an unclassified dirty state.
- No nested Git repository is moved without its own checkpoint and identity
  verification.
- No WordPress runtime is considered backed up without database and persistent
  content.
- `.agentic-ops/` is deleted without importing any of its artifacts.
- Existing `.ai/` content is audited item by item; it is neither blindly kept
  nor blindly deleted.
- Secrets are never moved into Git.
- Every phase has entry, evidence, rollback, and exit criteria.
- Migration and feature development do not share a commit.

## Target Root

```text
guilherme-studio-os/
├── AGENTS.md
├── README.md
├── package.json
├── studio.config.yaml
├── apps/
├── packages/
├── data/
├── clients/
├── products/
├── portfolio/
├── marketing/
├── sales/
├── career/
├── operations/
├── templates/
├── docs/
├── runtime/               # ignored
└── archive/
```

The target layout is introduced only after records and repository ownership are
defined.

## Phase M0: Authorization and Freeze

### Entry

- Studio OS specification reviewed.
- Migration decision approved by Guilherme.
- No critical client delivery requires an unstable workspace.

### Actions

1. Create a dedicated migration branch.
2. Record root and nested repository states.
3. Pause unrelated structural edits.
4. Identify all running WordPress/Docker processes.
5. Record disk space and backup destinations.
6. Define abort criteria.

### Evidence

- branch and status captures;
- migration run record;
- approved plan version;
- list of excluded concurrent work.

### Rollback

No mutation has occurred.

## Phase M1: Protect Current Value

### Actions

1. Classify every modified and untracked root item.
2. Commit coherent current work in its correct repository or create a local
   immutable checkpoint when not ready for commit.
3. Preserve a local immutable mirror for the coordinator.
4. Keep the coordinator without a remote during V1.
5. Checkpoint each owned plugin repository.
6. Preserve and classify `elementor-mcp` local modifications.
7. Back up WordPress database, uploads/volumes, and non-reproducible state.
8. Create checksummed backup manifest.
9. Test restore into an alternate location.

### Hard gate

No structural move until restore evidence passes.

### Rollback

Restore coordinator and each nested repository to recorded commits; restore
WordPress from backup.

## Phase M2: Establish Registry and Ownership Map

### Actions

1. Assign stable IDs to current products, portfolio site, repositories, and
   environments.
2. Create provisional registry records.
3. Map every current path to target owner and target path.
4. Classify third-party repositories and plugins.
5. Scan scripts, docs, Compose, and WordPress configuration for absolute or
   relative path dependencies.
6. Generate proposed coordinator ignore rules.
7. Dry-run the ignore rules against current files.

### Required mapping

```yaml
source_path:
target_owner_id:
target_path:
content_class:
git_boundary:
preservation_action:
path_references:
verification:
```

### Exit

Every moved item has one owner. No `misc`, `old`, or generic dumping directory
is accepted as a target.

## Phase M3: Remove Agentic Ops

### Scope

- `.agentic-ops/`;
- Agentic Ops-specific generated state;
- Agentic Ops-specific docs when they have no independently approved value.

### Actions

1. Verify Phase M1 checkpoint is recoverable.
2. Produce a deletion-only diff for `.agentic-ops/`.
3. Confirm no Studio OS document or script depends on it.
4. Delete `.agentic-ops/`, including untracked snapshots.
5. Remove references that imply it is active.
6. Remove `docs/agentic-ops/` unless a separate decision retains a specific
   human-authored fact outside that framing.
7. Commit deletion as an isolated migration commit.

### Explicit exclusion

Do not:

- convert Agentic Ops tasks into Studio tasks;
- import snapshots;
- preserve schemas;
- copy readiness/drift concepts by default;
- generate a historical archive inside the new root.

Git history and the Phase M1 checkpoint are sufficient recovery mechanisms.

### Verification

- no active path or documentation link references `.agentic-ops`;
- Studio specification and current work remain;
- root validation passes.

## Phase M4: Introduce Studio Skeleton

### Actions

1. Add root `.gitignore` with explicit independent-repository and runtime rules.
2. Add `studio.config.yaml`.
3. Create target domain directories with README ownership contracts where
   needed.
4. Move `docs/studio-os/` into its final documentation location if the approved
   target differs.
5. Create canonical registry and operator identity records.
6. Keep runtime generated paths ignored.
7. Add templates for client, engagement, project, task, evidence, and run.

### Verification

- root status shows canonical files but not runtime or nested working trees;
- schema validation can run manually or through the first bootstrap script;
- no source content has been moved yet without mapping.

## Phase M5: Reassign `.ai/` Knowledge

### Method

For each file, classify:

- normative decision;
- reusable workflow;
- repository-specific instruction;
- portfolio/product strategy;
- historical context;
- duplicate;
- obsolete.

### Provisional mapping

| Current area | Candidate owner |
|---|---|
| `.ai/operational/` | `operations/`, `docs/`, or repository-local instructions |
| `.ai/strategy/` | `portfolio/`, `marketing/`, `sales/`, or `career/` |
| `.ai/projects/` | owning `products/` or `portfolio/` entities |
| `.ai/templates/` | `templates/` |
| `.ai/tools/` | `packages/adapters/`, `operations/tools/`, or repository-local tooling |
| `.ai/memory/` | decisions, learnings, or discard after deduplication |

### Rules

- Rewrite content to its owner instead of preserving AI-centric location.
- Do not duplicate one decision across several domains.
- Historical conversational narrative is not canonical unless it changes a
  future action.
- Delete `.ai/` only after all retained material has an owner and links are
  updated.

### Commit strategy

Use small ownership-based commits, not one mechanical directory move.

## Phase M6: Separate Product Repositories

### Products

- Simple Budget Plugin;
- 3D Viewer for Elementor;
- Elementor Implementation Toolkit.

### Actions per repository

1. verify checkpoint, branch, remote, and clean/known state;
2. create product record and repository registration;
3. create target product directory;
4. move or re-clone repository into `products/<slug>/repository`;
5. verify Git root, HEAD, branches, tags, remotes, and status;
6. update WordPress development mount/link;
7. update scripts and documentation;
8. verify plugin activation and relevant runtime behavior;
9. confirm coordinator ignores repository working tree;
10. retain old path until verification, then remove it.

External repositories remain registered as dependencies or contribution
worktrees and are not represented as owned products.

### Rollback

Return repository to old path and restore old WordPress mount configuration.

## Phase M7: Create Independent Portfolio Site Repository

### Scope

- current WordPress orchestration;
- `guilherme-portfolio` theme;
- custom portfolio mu-plugins/pages/scripts;
- runtime dependency declarations;
- portfolio asset registration and setup.

### Actions

1. create portfolio site project and repository record;
2. initialize independent Git only after current untracked theme work is
   checkpointed;
3. move versioned site surface;
4. retain WordPress core/runtime as reproducible or ignored state;
5. mount/link owned product repositories;
6. restore database and media into the new environment;
7. verify home, plugin case routes, admin, Elementor compatibility, and assets;
8. update coordinator registry;
9. remove old runtime only after successful alternate-path verification.

### Boundary

Portfolio site implementation history belongs to the site repository. Portfolio
case records, marketing strategy, and business evidence remain coordinator data.

## Phase M8: Reassign Documentation and Assets

### Documentation

Move documents by owner:

- product technical docs to product repository or product record;
- portfolio strategy to `portfolio/`;
- marketing strategy to `marketing/`;
- operational policies to `operations/`;
- implementation-toolkit plans to the product owner;
- historical material to `archive/` only when retention has a purpose.

### Assets

For every asset family:

- owner;
- source;
- approved derivative;
- public/private classification;
- WordPress media relation;
- distribution target;
- checksum;
- storage and backup strategy.

Decide whether large binary sources remain in Git, use Git LFS, move to encrypted
backup, or remain in an owned site repository. Do not move 204 MB of assets
mechanically.

### Verification

- no broken document links;
- case claims still resolve evidence;
- asset manifests resolve actual files;
- public exports contain no confidential metadata.

## Phase M9: Bootstrap Studio Runtime

Only after the data and ownership migration is stable:

1. initialize TypeScript workspace;
2. implement schemas and validation;
3. implement registry reads;
4. import canonical records through validation;
5. build derived SQLite;
6. compare projected counts and relationships;
7. implement first CLI commands;
8. retain manual workflow fallback.

Runtime implementation follows the topological roadmap in the Master PRD.

## Phase M10: Root Rename

Rename the physical directory only after:

- no script assumes the old absolute path;
- Docker mounts use valid paths;
- registry paths are root-relative;
- IDE, MCP, and automation configuration are updated;
- all Git roots remain valid;
- backup and rollback exist.

Suggested final directory name:

```text
Guilherme-Studio-OS
```

The private Git repository name may use:

```text
guilherme-studio-os
```

### Verification

- `studio inspect`;
- root and nested Git statuses;
- portfolio WordPress start and health;
- product plugin mount and activation;
- documentation links;
- backup paths.

## Commit and Promotion Strategy

Each phase:

1. begins from recorded state;
2. produces one or more coherent commits;
3. verifies its own ownership boundary;
4. is pushed to the private coordinator only after review;
5. does not mix independent repository commits.

Suggested commit sequence:

```text
docs(studio): approve migration map
chore(studio): remove legacy agentic ops state
chore(studio): establish coordinator skeleton
docs(studio): reassign operational knowledge
chore(products): register independent repositories
chore(portfolio): separate site repository
chore(studio): reassign documentation and assets
feat(studio): bootstrap schemas and registry
```

Actual commit messages follow the repository's active commit policy at execution
time.

## Abort Conditions

Abort and restore when:

- a nested repository HEAD or remote no longer matches;
- valuable untracked work cannot be accounted for;
- WordPress restore fails;
- coordinator ignore rules hide canonical records;
- a secret enters staged content;
- scripts still mutate the old location unexpectedly;
- a phase mixes unrelated active client or portfolio work;
- disk or backup capacity is insufficient.

## Final Migration Acceptance

- root operates as private coordinator;
- Agentic Ops is absent and unreferenced;
- retained `.ai/` knowledge has domain ownership;
- owned products keep independent Git histories;
- portfolio WordPress is an independent repository and reproducible environment;
- registry resolves all repositories and environments;
- coordinator cannot accidentally stage nested working trees;
- canonical data validates;
- SQLite rebuilds;
- portfolio and plugin development still run;
- backup and alternate-path restore pass;
- no secret enters Git;
- old root path can be retired.

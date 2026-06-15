# Current-State Inventory

Status: observed baseline
Observation date: 2026-06-14
Historical workspace at observation time: previous local WordPress workspace
under the user desktop development directory.

Current coordinator workspace after root rename:
`/home/kingdonrush/Área de trabalho/Dev/Guilherme-Studio-OS`

This inventory records the current root without treating its layout as the
future architecture. It must be refreshed immediately before migration.

## Root Repository

Observed:

- Git root is the current workspace path.
- Branch is `codex/admin-v02-method-and-evidence`.
- No Git remote is currently configured for the coordinator root.
- The worktree contains modified and untracked user work.
- The root has no `.gitignore`.
- Tracked top-level counts:
  - `docs/`: 378 files;
  - `.agentic-ops/`: 202 files;
  - `.ai/`: 53 files;
  - `wordpress/`: 16 files;
  - `AGENTS.md`: 1 file.

Current dirty-state examples:

- modified operational and portfolio documentation;
- modified `wordpress/.gitignore`;
- untracked asset governance and asset outputs;
- untracked Studio OS specification;
- untracked WordPress scripts, mu-plugin, page artifacts, and theme;
- untracked `.agentic-ops` snapshot.

This dirty state is valuable work, not migration noise. It must be classified
and checkpointed before any structural move.

## Current Top-Level Areas

### `.ai/`

Observed size: approximately 884 KB.

Contains:

- operational policies;
- memory and decisions;
- project notes;
- strategy;
- templates;
- tools and MCP-related material.

Assessment:

- potentially valuable source material;
- responsibilities are mixed under an AI-centric container;
- must be audited and reassigned to domain owners;
- not deleted wholesale;
- does not remain the final universal “brain” directory.

### `.agentic-ops/`

Observed size: approximately 2.9 MB.

Contains:

- plans;
- tasks;
- phases;
- snapshots;
- readiness;
- drift;
- patches;
- handoffs;
- tests;
- adapters;
- generated analysis.

Assessment:

- explicitly excluded from Guilherme Studio OS;
- 202 files are currently tracked;
- at least one additional snapshot is untracked;
- future migration deletes the directory without importing, translating, or
  preserving its artifacts as Studio records;
- deletion requires a recoverable pre-migration Git checkpoint, but no
  artifact-by-artifact migration.

Related `docs/agentic-ops/` content is historical and is also excluded unless a
separate human decision identifies an independently valuable fact. The default
is removal, not migration.

### `docs/`

Observed size: approximately 205 MB.

Major content:

- portfolio strategy and visual direction;
- plugin and WordPress notes;
- implementation-toolkit planning;
- asset governance and sources;
- current Studio OS specification;
- Agentic Ops-related historical docs.

`docs/assets/` accounts for approximately 204 MB and dominates repository size.

Assessment:

- contains human-facing strategy and evidence worth preserving;
- current broad `docs/` ownership is too generic for the future root;
- asset binaries require a storage/distribution decision before migration;
- Studio OS specification is the normative migration source;
- existing documents are evidence or historical input unless adopted by a
  domain owner.

### `wordpress/`

Observed size: approximately 333 MB.

Contains:

- a full local WordPress installation;
- Docker Compose and setup scripts;
- local `.env` ignored by `wordpress/.gitignore`;
- custom mu-plugins and page artifacts;
- custom and third-party themes/plugins;
- nested independent Git repositories.

Only 16 WordPress orchestration and structure files are currently tracked by
the coordinator.

Assessment:

- this runtime primarily serves the portfolio and plugin demos;
- WordPress core and runtime data are not future coordinator responsibilities;
- the portfolio WordPress site should become an independent site repository;
- owned plugin repositories should become registered product repositories;
- third-party plugins remain runtime dependencies, not Studio products.

## Nested Git Repositories

### Owned products

| Path | Branch | Remote | Current state |
|---|---|---|---|
| `wordpress/wp-content/plugins/3d-viewer-to-elementor` | `main` | `https://github.com/KingDonRush/3d-viewer-to-wordpress` | clean relative to upstream |
| `wordpress/wp-content/plugins/elementor-implementation-toolkit` | `codex/cct-listing-provider` | `https://github.com/KingDonRush/elementor-implementation-toolkit.git` | clean working tree on feature branch |
| `wordpress/wp-content/plugins/simple-budget-plugin` | `master` | `https://github.com/KingDonRush/simple-budget-plugin` | clean relative to upstream |

### External or upstream repositories

| Path | Branch | Remote | Current state |
|---|---|---|---|
| `wordpress/wp-content/plugins/elementor-mcp` | `main` | `https://github.com/msrbuilds/elementor-mcp` | two modified files |
| `wordpress/wp-content/plugins/mcp-adapter` | `trunk` | `https://github.com/WordPress/mcp-adapter` | clean relative to upstream |

The `elementor-mcp` modifications must be classified before relocation or
dependency refresh. They must not be discarded as vendor noise.

The coordinator index currently tracks only
`wordpress/wp-content/plugins/.gitkeep`, not the nested repository contents.

## Themes

Observed:

- `guilherme-portfolio`;
- `hello-elementor`;
- WordPress default themes.

No theme under `wordpress/wp-content/themes/` is currently an independent Git
repository.

`guilherme-portfolio` is untracked in the coordinator worktree and is
selectively allowed by `wordpress/.gitignore`.

Assessment:

- portfolio theme is valuable implementation work;
- it requires an intentional checkpoint before migration;
- it should become part of an independent portfolio WordPress site repository,
  not remain accidental untracked coordinator content.

## Current Ignore Behavior

The root has no `.gitignore`.

`wordpress/.gitignore`:

- ignores WordPress runtime by default;
- tracks orchestration scripts and selected custom artifacts;
- ignores `.env`, dependencies, logs, and cache;
- selectively tracks the portfolio theme, Simple Budget case page, and local
  mu-plugins;
- does not make owned plugin repositories part of the coordinator index.

Observed:

- `wordpress/.env` is ignored by `wordpress/.gitignore`.

Risk:

- future root-level directories and independent repos do not yet have an
  explicit coordinator ignore policy;
- adding a broad root ignore without a dry run could hide canonical records.

## Current Documentation and Asset Risks

- Asset binaries materially increase coordinator repository size.
- Source, optimized, extracted, and distributed variants may coexist.
- Existing asset policy work is currently modified or untracked.
- Some documents describe older portfolio approaches and may conflict with the
  Studio OS authority hierarchy.
- Agentic Ops documents may appear authoritative by location despite being
  explicitly excluded.

Migration must classify assets by owner, provenance, publication, and backup
policy before relocating them.

## Current Operational Assets Worth Auditing

Likely reusable inputs:

- `.ai/operational/` policies;
- `.ai/memory/decisions.md`;
- `.ai/strategy/`;
- `.ai/projects/`;
- asset taxonomy and registry protocol;
- portfolio strategy, product, design, and visual direction;
- implementation-toolkit documentation;
- local WordPress setup scripts;
- plugin repository histories;
- portfolio theme and case implementation;
- current media and approved visual assets.

“Worth auditing” does not mean “migrate unchanged.”

## Risks Before Migration

1. Structural moves could obscure or lose untracked portfolio/theme work.
2. Root has no remote backup.
3. External `elementor-mcp` has local modifications.
4. Asset volume may create slow or inappropriate Git history.
5. Nested repository paths are embedded in scripts or WordPress runtime.
6. Full WordPress state depends on database and persistent data not represented
   by coordinator Git.
7. `.agentic-ops/` deletion is large and must be isolated from unrelated work.
8. Existing documentation may contain useful decisions mixed with obsolete
   structure.

## Inventory Exit Criteria

Before migration begins, refresh and attach:

- complete root status and diff summary;
- coordinator remote and backup status;
- nested repository status/remotes;
- checksums or archive of valuable untracked work;
- WordPress database and volume backup;
- asset inventory and size policy;
- script path references;
- explicit classification of `elementor-mcp` modifications;
- approved migration branch and rollback point.

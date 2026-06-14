# Repository, WordPress, and Environment Topology

Status: normative production topology
Scope: coordinator repository, independent code histories, WordPress runtimes,
Docker environments, and external remotes

## Topology Principle

The Studio coordinator knows where work lives and what state it is in. It does
not flatten independent products, client sites, and WordPress runtimes into one
Git history.

The correct boundary is based on ownership and release lifecycle:

- Studio policies and canonical business records share the coordinator repo;
- independently released plugins use independent repositories;
- each client or owned WordPress site with its own delivery lifecycle uses its
  own repository;
- generated runtime data and secrets do not enter Git;
- the global registry connects the boundaries.

## Repository Classes

### Coordinator repository

Contains:

- Constitution and product specification;
- canonical operational records;
- Studio Core, CLI, MCP, and panel source;
- templates and schemas;
- non-secret registry entries;
- migration and operational documentation.

Visibility: private.

### Product repository

Contains one independently released plugin, tool, package, or application.

Owns:

- product source;
- tests;
- release metadata;
- product-specific technical documentation;
- public issue and release history.

Does not own:

- private prospect data;
- campaign pipeline;
- client contracts;
- Studio-wide agent policy.

### WordPress site repository

Contains the versioned custom surface of one site or site family:

- custom themes;
- custom plugins and mu-plugins;
- configuration templates;
- environment scripts;
- content exports or setup scripts when justified;
- tests and deployment notes.

It does not version WordPress core, secrets, cache, generated uploads, or
third-party dependencies unless an explicit packaging strategy requires them.

### External or vendor repository

Registered for inspection or contribution but not owned by Guilherme. The
registry records ownership and permitted actions. Studio automation must not
assume push authority.

## Proposed Ownership Topology

```text
guilherme-studio-os/                 # private coordinator Git
├── products/
│   ├── simple-budget-plugin/
│   │   ├── product.yaml
│   │   ├── repository/              # independent Git, ignored by coordinator
│   │   ├── evidence/
│   │   └── operations/
│   ├── 3d-viewer-to-elementor/
│   │   └── repository/              # independent Git
│   └── elementor-implementation-toolkit/
│       └── repository/              # independent Git
├── portfolio/
│   ├── portfolio.yaml
│   ├── cases/
│   └── site/
│       ├── project.yaml
│       └── wordpress/               # independent site Git
└── clients/
    └── <client>/
        └── engagements/
            └── <engagement>/
                └── deliverables/
                    └── <site>/
                        ├── deliverable.yaml
                        └── wordpress/ # independent site Git
```

The physical placement may be adjusted during migration if a repository cannot
be moved safely. Registry identity and ownership matter more than cosmetic
uniformity.

## Coordinator Ignore Boundary

The coordinator must ignore independent repository working trees through
specific generated or maintained rules. It must not use a broad rule that hides
canonical product records beside them.

Example intent:

```text
products/*/repository/
portfolio/site/wordpress/
clients/*/engagements/*/deliverables/*/wordpress/
runtime/
```

Before an ignore rule is introduced, `studio repo inspect` must prove which
files will stop appearing in coordinator status.

The coordinator never stages nested `.git` directories.

## Submodule Decision

Default: no submodules.

Use a submodule only when the coordinator must pin and review an exact external
repository commit as part of its own reproducible state. Convenience,
discoverability, or “keeping repositories together” is insufficient.

A submodule decision must document:

- why a registry link is insufficient;
- who updates the pin;
- CI behavior;
- cloning and onboarding cost;
- branch and release implications;
- recovery behavior when the remote is unavailable.

## Git Operation Protocol

Before any mutation:

1. resolve repository ID;
2. print or return registered path;
3. discover actual Git root;
4. compare expected and actual roots;
5. inspect branch, status, remotes, upstream, and nested worktrees;
6. classify existing changes as task-related, user-owned, generated, or
   unknown;
7. refuse destructive cleanup of unknown changes;
8. execute only within the target root;
9. verify status and relevant diff afterward;
10. register execution evidence.

Commits belong to the repository whose behavior changed. A coordinator record
update and a plugin implementation change are separate commits in separate
histories.

## WordPress Runtime Model

Each WordPress environment declares:

- owner project or deliverable;
- local path;
- container or native runtime;
- WordPress and PHP compatibility targets;
- database service;
- upload/media storage;
- custom code repositories;
- third-party dependency installation method;
- URLs and ports;
- secret references;
- seed/setup commands;
- backup and restore procedures;
- health checks.

## Versioned WordPress Surface

Recommended versioned content:

- `docker-compose.yml` or equivalent environment definition;
- `.env.example` without secrets;
- custom theme source;
- owned plugins and mu-plugins, preferably as independent repos when released
  separately;
- Composer/npm lock files where used;
- setup and seed scripts;
- WP-CLI automation;
- database schema or content fixtures that are intentionally reproducible;
- documentation and tests.

Ignored runtime content:

- WordPress core when fetched during setup;
- generated cache;
- logs;
- database files;
- actual `.env`;
- secret exports;
- session files;
- transient generated media;
- vendor/node modules when reproducible from lockfiles.

Uploads require an explicit policy. Portfolio demo assets may be reproducibly
registered from an asset source directory. Client uploads generally require
private volume backup rather than public Git.

## Plugin Mounting and Development

An owned plugin repository may be mounted or linked into a WordPress runtime
for development. The registry must record:

- plugin repository ID;
- runtime environment ID;
- mount or link mode;
- expected target path;
- activation state;
- compatibility constraints.

The runtime must not accidentally commit the mounted plugin into the site
repository.

## Docker Environment Contract

Required commands or adapter operations:

```text
environment inspect
environment start
environment stop
environment health
environment wp
environment backup
environment restore
```

Starting an environment validates:

- registered compose path;
- required secret references exist;
- requested ports are available or a deterministic alternate is selected;
- volumes are known;
- services become healthy;
- the observed URL is recorded.

Stopping an environment does not remove volumes by default.

## WordPress Backup Contract

A complete WordPress backup includes:

- database export;
- persistent uploads or media volume;
- non-reproducible local files;
- environment definition;
- custom code repository references and revisions;
- manifest with checksums;
- WordPress/PHP/database versions;
- restore instructions.

Docker image layers and Git remotes do not substitute for the database and
volume backup.

## Restore Rehearsal

At least one representative WordPress environment must periodically be restored
to an alternate path and alternate port:

1. create clean target;
2. restore database;
3. restore media volume;
4. install or resolve custom repositories;
5. apply configuration from secret references;
6. start services;
7. run WordPress health checks;
8. validate critical routes and admin access;
9. record checksums, screenshots, and command evidence;
10. destroy rehearsal environment only after evidence is retained.

## Portfolio and Demo Sites

The portfolio, plugin case pages, and plugin demo sites are distinct products
or deliverables even when one WordPress runtime hosts several routes.

The registry must distinguish:

- public route;
- owning case or product;
- implementation owner;
- design source;
- evidence source;
- release/deployment state.

A case cannot claim a demo feature merely because both routes share a runtime.

## Client Multi-Site Engagement

One paid engagement may contain several WordPress deliverables. Each site has:

- its own deliverable record;
- its own project state;
- its own repository or an explicit shared-repository decision;
- independent acceptance evidence;
- links to shared contract and payment terms.

Commercial completion and technical completion remain separate states.

## Repository Health Projection

The Studio dashboard may project:

- reachable path;
- expected versus actual Git root;
- current branch;
- clean or dirty state;
- ahead/behind;
- remote availability;
- untracked valuable files;
- last commit and push;
- dependency health;
- test command availability;
- associated active work.

Health is observational. The dashboard does not auto-clean repositories.

## Migration Safety

No repository is moved until:

- its status is captured;
- valuable untracked work is classified;
- a recoverable checkpoint exists;
- remotes are verified;
- target ignore rules are tested;
- old and new paths are mapped;
- scripts and registry entries are updated;
- post-move Git identity matches.

The current dirty workspace makes this a hard prerequisite, not a suggestion.

## Acceptance Criteria

- Every owned repository has one registry record and owner entity.
- Git operations fail on root mismatch.
- Coordinator status does not absorb independent working trees.
- One WordPress environment can be created from versioned definitions.
- Database and volume restore succeeds in an alternate path.
- A plugin can be developed from its own repository while mounted into a
  registered WordPress runtime.
- Multi-site engagements preserve independent technical and acceptance state.

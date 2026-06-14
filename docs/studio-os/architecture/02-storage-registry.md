# Canonical Storage and Global Registry

Status: normative data architecture
Scope: human-readable truth, derived indexes, identity, references, atomicity,
and repository/environment discovery

## Storage Principle

Canonical state must remain readable, reviewable, diffable, portable, and
recoverable without a running Studio application.

Therefore:

- YAML stores structured entity state;
- Markdown stores narratives, briefs, decisions, and human reasoning;
- append-only YAML or JSON Lines stores audit events where ordering matters;
- binary assets remain files governed by manifests;
- SQLite stores derived query projections only;
- secret values live outside the repository and are referenced indirectly.

Human readability does not mean arbitrary formatting. Canonical records follow
versioned schemas and deterministic serialization rules.

## Canonical Record Envelope

Every YAML entity uses the common envelope:

```yaml
api_version: studio.guilherme.dev/v1
kind: Engagement
metadata:
  id: eng_20260614_example
  slug: example
  revision: 4
  created_at: 2026-06-14T12:00:00-03:00
  updated_at: 2026-06-14T15:30:00-03:00
  owner_id: per_20260614_guilherme-silva
  classification: confidential
  schema_version: 1
  archived_at: null
spec: {}
relations: []
extensions: {}
```

Rules:

- `id` is immutable;
- `slug` may change;
- `revision` increases by one per committed mutation;
- timestamps use RFC 3339 with explicit offset;
- unknown top-level fields fail validation;
- extension keys require a namespace such as `github.issue`;
- relations use IDs and relation types, not embedded copies of another entity;
- canonical serializer preserves meaningful prose but normalizes structural
  ordering.

## Narrative Pairing

An entity may pair structured state with one or more narratives:

```text
engagement.yaml
brief.md
scope.md
handoff.md
decisions/
```

The YAML record references narrative paths and their purpose. Narrative files
do not silently redefine lifecycle state, money, authority, or ownership.
Conflicts are resolved in favor of validated structured fields until a
deliberate mutation updates them.

## Canonical Directory Ownership

Directory placement follows the entity that owns the information:

- person identity: `data/people/`;
- organization identity: `data/organizations/`;
- repository and environment registry: `data/registry/`;
- client relationship: `clients/<client>/`;
- paid work: inside the owning client engagement;
- product work: `products/<product>/`;
- public proof: `portfolio/cases/<case>/`;
- opportunity: `sales/opportunities/<opportunity>/`;
- job application: `career/applications/<application>/`;
- campaign: `marketing/campaigns/<campaign>/`;
- cross-domain evidence: `data/evidence/`;
- agent execution: `operations/agent-runs/`.

A physical path is not the entity identity. Moving a record updates its
registry path without changing its ID.

## Global Registry

The registry resolves stable IDs to local and external resources.

Registry categories:

```text
data/registry/
├── entities/
├── repositories/
├── environments/
├── external-resources/
└── registry.yaml
```

### Entity registry entry

```yaml
entity_id: prod_20260614_simple-budget-plugin
kind: Product
canonical_path: products/simple-budget-plugin/product.yaml
classification: internal
status: active
```

### Repository registry entry

```yaml
api_version: studio.guilherme.dev/v1
kind: RepositoryRegistration
metadata:
  id: repo_20260614_simple-budget-plugin
  revision: 1
spec:
  owner_entity_id: prod_20260614_simple-budget-plugin
  local_path: products/simple-budget-plugin/repository
  expected_git_root: products/simple-budget-plugin/repository
  vcs: git
  visibility: public
  default_branch: master
  remotes:
    - name: origin
      url: https://github.com/KingDonRush/simple-budget-plugin
  management_mode: independent
  backup_policy: remote_plus_local
  health_policy: product_repository
```

### Environment registry entry

```yaml
api_version: studio.guilherme.dev/v1
kind: EnvironmentRegistration
metadata:
  id: env_20260614_portfolio-local
spec:
  owner_project_id: prj_20260614_portfolio-site
  type: wordpress_docker
  local_path: portfolio/site/wordpress
  compose_file: docker-compose.yml
  url: http://localhost:8080
  database:
    backup_adapter: docker-volume
  uploads:
    backup_adapter: docker-volume
  secret_reference: secrets://portfolio-local
```

## Registry Resolution

Before an operation touches a path:

1. resolve entity or repository ID;
2. normalize the registered path against the Studio root;
3. reject traversal outside the permitted root unless the registration
   explicitly allows an external absolute path;
4. resolve symlinks;
5. discover the actual Git root when applicable;
6. compare it with `expected_git_root`;
7. inspect branch, worktree state, remotes, and nested repositories;
8. return an observation, not a silent correction.

Changing a registered path is an explicit registry mutation. Automatic scans
may propose registrations but do not rewrite ownership.

## Nested Git Policy

The coordinator repository tracks records about independent repositories, not
their `.git` directories or accidental working-tree contents.

Default model:

- independent Git repositories;
- registered local paths;
- ignore rules at the coordinator boundary;
- health inspection from the correct Git root;
- separate commit and release history.

Submodules are opt-in because they add a pinned commit relationship and
workflow obligations. They require a decision record defining why a repository
must be version-pinned by the coordinator.

Before moving or registering a nested repository, the migration must record:

- current root;
- branch;
- remotes;
- status;
- untracked files;
- submodules or nested repositories inside it;
- whether its remote can reconstruct all valuable data.

## Event Store

Audit-relevant mutations emit immutable events:

```yaml
event_id: evt_20260614_example
event_type: engagement.state_changed
schema_version: 1
occurred_at: 2026-06-14T15:30:00-03:00
actor_id: per_20260614_guilherme-silva
command_id: cmd_20260614_example
entity_id: eng_20260614_example
from_revision: 3
to_revision: 4
payload:
  from_state: ready
  to_state: in_progress
evidence_refs:
  - evd_20260614_deposit
```

Events support audit and reconstruction of history, but V1 entity state is not
rebuilt solely by replaying all events. Current canonical records remain the
state source. This avoids imposing full event sourcing before it earns its
cost.

## Atomic File Operations

Each mutation creates an operation manifest in ignored runtime storage:

```text
runtime/transactions/<command-id>/
├── manifest.yaml
├── before/
├── staged/
└── status
```

The manifest records:

- files read and their checksums;
- files to write;
- expected revisions;
- generated events;
- transaction stage;
- repair guidance.

Writes occur through a temporary file in the destination filesystem, followed
by validation and atomic rename. Multi-file mutations are narrow and protected
by a transaction manifest. A failure never triggers best-effort deletion of
the last known-good file.

## Concurrency and Locks

V1 assumes one primary local operator but must tolerate overlapping processes.

- Entity mutations use a lock keyed by entity ID.
- Registry mutations use a registry lock.
- Projection rebuild uses a projection lock.
- Locks include owner PID, command ID, acquired time, and expiration policy.
- Stale locks are inspected and recovered, not blindly removed.
- Every mutation includes expected revision.

Concurrency conflicts fail closed and return the current revision.

## SQLite Projection

Default location:

```text
runtime/studio.sqlite
```

Minimum projection tables:

- `entities`;
- `relations`;
- `entity_search`;
- `events`;
- `next_actions`;
- `repository_health`;
- `pipeline_facts`;
- `evidence_links`;
- `projection_metadata`.

Each projected row records source path, source revision, checksum, schema
version, and indexed time.

SQLite contains no secret value and no canonical attachment binary. Sensitive
searchable values are minimized and classified.

## Deterministic Rebuild

`studio sync --rebuild`:

1. validates Studio configuration;
2. creates a new SQLite file beside the current one;
3. scans canonical roots in deterministic order;
4. validates every record;
5. detects duplicate IDs, broken relations, and classification violations;
6. projects valid records and events;
7. compares counts and checksums;
8. atomically swaps the new projection;
9. preserves the old projection temporarily for recovery;
10. emits a rebuild report.

If any canonical record is invalid, the existing projection stays active and
the command exits non-zero. A partial rebuild is never promoted.

## Incremental Projection

After a canonical mutation:

- project the changed entity, relations, and affected aggregates;
- store the canonical checksum;
- invalidate dependent views;
- emit projection revision;
- fall back to full rebuild when dependency impact cannot be proven.

Performance is secondary to correctness in V1.

## Secret References

Canonical records may store opaque references:

```yaml
credential_ref: secrets://github/kingdonrush
```

They may not store:

- token fragments;
- masked values that still reveal structure unnecessarily;
- shell commands containing secrets;
- provider cookies;
- recovery codes;
- plaintext encrypted blobs without a separate key boundary.

Secret resolution occurs only inside a narrow adapter after authority checks.
The resolved value is never returned to agents or logged.

## Backup Ownership

The coordinator backup manifest distinguishes:

- canonical coordinator data recoverable from private Git;
- independent repositories recoverable from remotes;
- dirty or local-only repository work requiring filesystem backup;
- WordPress database and upload volumes;
- confidential documents requiring encrypted backup;
- external secret-store backup handled separately.

“Pushed to Git” is not a complete WordPress backup.

## Storage Verification

Required tests:

- round-trip every schema fixture;
- reject duplicate immutable IDs;
- preserve valid record on interrupted write;
- detect stale revision;
- rebuild SQLite twice with identical logical output;
- reject a symlink escape;
- reject a mismatched Git root;
- repair projection after simulated post-write failure;
- reject secret fixtures before canonical write;
- restore canonical data and rebuild projection in a clean alternate path.

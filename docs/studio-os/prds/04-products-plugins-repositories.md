# PRD 04: Products, Plugins, and Repositories

## Product Job

Manage owned WordPress products as long-lived technical and commercial assets,
connecting code, releases, demos, documentation, evidence, cases, and market
distribution.

## Capabilities

### Product registry

- Record product thesis, target user, problem, differentiation, status, and
  economic role.
- Link repositories, packages, demos, cases, offers, and campaigns.
- Separate roadmap claims from implemented features.

### Repository registry

- Register local path, Git root, remotes, ownership, visibility, default
  branch, release model, runtime relationship, and health commands.
- Detect nested repository boundaries.
- Prevent root staging of registered child repositories.
- Track dirty state without copying Git as canonical data.

### Product development

- Connect decisions, plans, tasks, tests, security reviews, and releases.
- Enforce repository-local instructions and quality gates.
- Detect monolithic files and architecture debt using configurable thresholds.
- Require explicit public API and compatibility notes for plugin changes.

### Release management

- Prepare version, changelog, compatibility, migration notes, assets, tests,
  and publication payload.
- Publish only after confirmation.
- Link the release to commit, tag, package, GitHub URL, and evidence.

### Demo and evidence

- Register demonstration environments and scenarios.
- Keep fictional demo brands separate from product case identity.
- Convert verified capabilities into evidence and case seeds.

### Repository health

- Inspect status, branches, remotes, dependency state, test commands, untracked
  files, documentation, and release readiness.
- Report rather than mutate unless a specific action is authorized.

## Canonical Structure

```text
products/<product>/
├── product.yaml
├── roadmap/
├── decisions/
├── releases/
├── demos/
├── evidence/
├── marketing/
└── repositories.yaml
```

Source repositories remain independent and are referenced by registry ID.

## Public Interfaces

```text
createProduct()
registerRepository()
inspectRepository()
recordProductDecision()
planRelease()
verifyRelease()
prepareReleasePublication()
recordPublishedRelease()
registerDemo()
seedPortfolioCase()
```

## Dependencies

- Depends on registry, Git adapter, evidence, assets, tasks, decisions, and
  external-action gates.
- Case creation depends on portfolio PRD.
- Publication depends on GitHub adapter and confirmation.

## Acceptance Criteria

- Every owned plugin has one product record and at least one repository.
- Repository health identifies the correct Git root before operations.
- Release claims map to tests or source evidence.
- A demo does not redefine product capabilities.
- Public publication cannot occur from dirty or unverified release state
  without an explicit accepted exception.
- Existing Git history and remotes remain intact during Studio migration.

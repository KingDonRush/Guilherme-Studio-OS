# Quality Gates

Status: normative gate catalog
Purpose: make completion and risk controls observable across domains

## Gate Model

A gate defines:

```yaml
gate_id:
owner:
applies_when:
risk:
inputs:
checks:
outcomes:
required_evidence:
override_authority:
failure_recovery:
```

Outcomes:

- `allow`;
- `warn`;
- `require_confirmation`;
- `block`.

A gate must prevent or expose a material failure. Gates without observable
effect are removed.

## Universal Entry Gate

Before material work:

- objective and expected outcome are explicit;
- owning entity and repository are resolved;
- current Git/runtime state is observed;
- existing user changes are classified;
- authority and risk are known;
- acceptance evidence is defined;
- dangerous unknowns are surfaced.

Failure: remain in orientation or planning. Do not mutate.

## Universal Completion Gate

Before `done`, `complete`, `approved`, or equivalent:

- acceptance criteria pass;
- actual entrypoint is verified;
- relevant diff or state is reviewed;
- evidence is registered;
- residual risk is disclosed;
- canonical state and next action are updated;
- no required process/session remains running;
- Git status is understood.

## Risk Tiers

### Low

Examples: local draft, reversible metadata, internal note.

Required:

- schema validation;
- local review;
- no secret;
- clear owner.

### Normal

Examples: scoped code change, case copy, local design implementation.

Required:

- entry and completion gates;
- focused tests or visual validation;
- diff review;
- handoff.

### High

Examples: data migration, client deliverable, public release, authentication,
financial record, repository move.

Required:

- explicit plan;
- backup or rollback;
- security review;
- broader integration verification;
- human confirmation where public/external;
- post-action reconciliation.

### Critical

Examples: production mutation, secret incident, destructive history rewrite,
contract acceptance, payment movement.

Required:

- dedicated runbook;
- explicit Guilherme approval;
- containment or rollback;
- independent evidence;
- audit record;
- recovery verification.

## Git Gate

Before:

- registered repository resolved;
- actual Git root matches;
- branch, remotes, upstream, and status inspected;
- unrelated changes preserved;
- target diff scope identified.

After:

- status inspected again;
- diff reviewed;
- tests linked;
- commit belongs to correct repository;
- push/publication authority evaluated;
- no valuable accidental untracked file remains.

Blocks:

- root mismatch;
- destructive command without explicit approval;
- mixed unrelated ownership;
- secret detection.

## Code Gate

Applies to plugins, themes, Studio packages, scripts, and adapters.

Checks:

- behavior contract is explicit;
- existing repository patterns inspected;
- module ownership remains coherent;
- no invented or hallucinated API;
- security invariants preserved;
- input validated and output escaped where applicable;
- error and recovery path exists;
- dependency justified;
- tests match blast radius;
- dead or duplicate paths reviewed;
- actual entrypoint smoke-tested.

Architecture warnings:

- file accumulates unrelated responsibilities;
- generic `utils` or `helpers`;
- domain logic inside UI/CLI handler;
- adapter imported by core;
- silent catch;
- duplicated validation;
- mutable global state;
- environment-specific hardcoding.

## WordPress Gate

Checks:

- no core edit;
- correct plugin/theme/mu-plugin ownership;
- capabilities checked;
- nonce used for CSRF protection, not authorization;
- input validated/sanitized;
- output escaped by context;
- database access prepared;
- REST/AJAX permission callback;
- Elementor editor and frontend behavior when applicable;
- activation/deactivation/uninstall behavior;
- compatibility target;
- actual WordPress runtime verification;
- backup before data migration.

## Design and Visual Gate

Checks:

- page intent and hierarchy;
- content density;
- target audience and action;
- implementation feasibility;
- asset source and approval;
- calibrated target viewport;
- browser and auth state;
- responsive recomposition;
- no overlap or inaccessible content;
- human visual approval.

Repeated spacing edits without causal diagnosis trigger the
[Visual Reality Loop](../workflows/02-visual-reality-loop.md).

## Asset Gate

Checks:

- owner and intended route;
- source/provenance;
- whether code-native or raster is appropriate;
- approved visual reference when fidelity matters;
- correct dimensions and crop;
- transparent edge/shadow fidelity where required;
- optimized derivative;
- SEO filename and metadata when published;
- WordPress media registration when required;
- manifest and distribution records;
- no sensitive content or metadata leak.

## Evidence and Portfolio Gate

Checks:

- claim-to-evidence mapping;
- role and contribution truthful;
- current feature versus roadmap separated;
- client permission and privacy;
- public links work;
- screenshots reflect actual behavior;
- no unsupported metric;
- case has an intended hiring or sales signal.

## Sales and Prospecting Gate

Checks:

- target fit;
- source and reason;
- offer relevance;
- message specific but truthful;
- claims evidenced;
- recipient and channel correct;
- bounded follow-up plan;
- exact payload confirmation.

Blocks:

- fabricated personalization;
- bulk send without approved policy;
- private evidence leakage;
- message sent without confirmation.

## Career Gate

Checks:

- role and constraints qualified;
- requirement-to-evidence map;
- no fabricated experience;
- materials versioned;
- confidential client details removed;
- exact recipient/platform and attachments;
- submission confirmation.

## Marketing and Publication Gate

Checks:

- audience, goal, offer, and CTA;
- source evidence;
- channel adaptation;
- privacy and metadata;
- final preview;
- exact publication confirmation;
- publication URL reconciliation.

## Finance and Contract Gate

Checks:

- correct client and engagement;
- exact proposal/contract/invoice version;
- currency and amount;
- due dates and obligations;
- expected versus confirmed value;
- provider evidence;
- human authority;
- retention.

Blocks:

- inferred payment confirmation;
- automated acceptance or money movement;
- deletion without retention handling.

## External Action Gate

Required prepared-action fields:

- actor;
- recipient;
- provider/channel;
- exact payload;
- attachments;
- claims and evidence;
- side effects;
- rollback limitations;
- expiration;
- checksum.

Execution requires matching confirmation. Reconciliation records provider result.

## Migration Gate

Checks:

- current-state inventory;
- backup and recovery path;
- dry-run output;
- ownership mapping;
- dirty work classification;
- path and script impact;
- rollback trigger;
- post-migration Git/runtime verification;
- no hidden destructive cleanup.

## Backup Gate

Checks:

- all registry components classified;
- database and volumes included;
- encrypted handling for confidential data;
- checksums and manifest;
- alternate-path restore;
- SQLite rebuild;
- representative WordPress verification;
- recovery evidence.

## Gate Override

Only an explicitly authorized actor may override a warning or overrideable
block. The override records:

- gate;
- reason;
- actor;
- risk accepted;
- scope;
- expiration;
- compensating verification.

Constitutional hard gates are not overrideable through ordinary commands.

## Gate Health

Review a gate when:

- it repeatedly blocks valid work;
- agents bypass it;
- it produces no meaningful decision;
- a failure passes through it;
- its evidence is impossible to obtain;
- its cost exceeds the risk without justification.

Gate changes require test fixture updates.

## Quality Acceptance Criteria

- Every lifecycle completion maps to at least one gate.
- Every high-risk gate has recovery behavior.
- Gate results are equivalent across CLI, MCP, and panel.
- Evidence is proportional and traceable.
- Overrides are auditable.
- Gates reduce repeated failure rather than accumulate ceremony.

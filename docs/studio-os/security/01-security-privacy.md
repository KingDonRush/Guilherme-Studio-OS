# Security and Privacy Specification

Status: normative security baseline
Scope: local data, agents, interfaces, repositories, providers, backup, and
public evidence

## Security Objective

Protect Guilherme, clients, prospects, employers, repositories, credentials,
commercial strategy, and public reputation without making the Studio unusable.

Security is implemented as architecture, classification, narrow authority,
validation, and recovery. It is not delegated to a final checklist.

## Trust Boundaries

```text
Guilherme
  |
local device
  ├── Studio Core and canonical repository
  ├── local panel and API
  ├── agents and MCP clients
  ├── independent Git repositories
  ├── Docker and WordPress runtimes
  ├── local secret store
  └── external providers
       ├── GitHub
       ├── email/WhatsApp
       ├── job platforms
       ├── hosting
       └── financial providers
```

Filesystem access does not imply business authority. A local agent is still an
untrusted caller outside its declared tool and task scope.

## Data Classification

### Public

Approved portfolio material, public repositories, published cases, public
contact information, released content.

### Internal

Non-public operational plans, repository health, task state, general product
roadmaps, non-sensitive decisions.

### Confidential

Client identity and context, proposals, contracts, invoices, payments,
communications, prospect research, application materials, unpublished
strategy, private repositories.

### Secret

Passwords, API tokens, OAuth secrets, private keys, recovery codes, session
cookies, financial authentication, production credentials.

Rules:

- public is an intentional state, not the absence of a label;
- confidential data may exist in the private coordinator repo when justified;
- secret values never enter canonical Git storage;
- projections, logs, exports, screenshots, and backups preserve or increase
  protection;
- classification changes require explicit authority.

## Threat Model

### Accidental secret disclosure

Vectors:

- pasted chat content;
- `.env` staged by Git;
- command output;
- screenshot;
- event payload;
- MCP response;
- debug log;
- backup manifest.

Controls:

- protected local secret entry;
- deny patterns and entropy scanning;
- schema fields that accept only references;
- pre-commit and pre-write scanning;
- output redaction;
- no raw secret MCP resource;
- screenshot review for credentials.

### Agent overreach

Vectors:

- broad filesystem access;
- arbitrary shell;
- using a provider session;
- changing a lower layer to bypass a gate;
- confusing draft with send.

Controls:

- task and capability scope;
- tool-specific contracts;
- prepared action flow;
- exact-payload confirmation;
- immutable audit;
- no self-confirmation;
- domain core enforcement.

### Path traversal and repository confusion

Vectors:

- `../` paths;
- symlinks;
- unexpected Git roots;
- nested repositories;
- malicious archive extraction;
- user-controlled filenames.

Controls:

- normalized registry resolution;
- `realpath` comparison;
- allowlisted roots;
- actual Git-root verification;
- safe archive extraction;
- no shell interpolation for paths;
- post-operation status evidence.

### Local panel exposure

Vectors:

- binding to all interfaces;
- DNS rebinding;
- permissive CORS;
- stale session;
- CSRF;
- unsafe file routes.

Controls:

- loopback-only binding;
- host and origin validation;
- per-launch random session;
- SameSite protection;
- no remote V1 mode;
- narrow API;
- body and rate limits;
- automatic session expiry.

### Canonical data corruption

Vectors:

- partial write;
- simultaneous mutation;
- schema drift;
- manual invalid edit;
- projection mistaken for truth.

Controls:

- atomic writes;
- revision checks;
- scoped locks;
- validation before promotion;
- transaction manifests;
- rebuildable SQLite;
- backups and restore rehearsal.

### Supply-chain compromise

Vectors:

- malicious npm package;
- compromised WordPress plugin;
- dependency install scripts;
- unpinned action or image;
- downloaded binary.

Controls:

- dependency decision rubric;
- lockfiles;
- minimal dependencies;
- package provenance and audit;
- review of install scripts;
- trusted registries;
- version and checksum evidence where practical;
- isolated evaluation of unfamiliar tools.

### Public evidence leakage

Vectors:

- client names in screenshots;
- internal URLs;
- admin email or token;
- contract values;
- private repository paths;
- false claims from draft roadmap.

Controls:

- claim-to-evidence review;
- asset classification;
- publication preview;
- metadata stripping;
- redaction/anonymization;
- explicit publication confirmation.

## Authentication and Actor Resolution

V1 is a single-operator local system, but actions still identify an actor.

- CLI defaults to the configured local operator only after root validation.
- MCP sessions identify client and requested actor.
- Panel session is created per local launch.
- Scheduled automation uses a distinct actor with narrow capabilities.
- External adapters never become the acting business authority.

Future multi-user support requires a new PRD and threat model.

## Authorization

Authorization evaluates:

- actor;
- capability;
- target entity;
- classification;
- lifecycle state;
- risk;
- interface;
- environment;
- confirmation;
- delegation and expiration.

Access is denied by default for:

- secret retrieval;
- destructive canonical deletion;
- production mutation;
- public send/publish;
- money movement;
- contract acceptance.

## Secret Management

### Valid design

Canonical record:

```yaml
credential_ref: secrets://github/kingdonrush
```

Runtime:

- resolve reference locally;
- provide value only to one adapter call;
- avoid environment inheritance beyond the process when possible;
- redact stdout/stderr;
- clear temporary files;
- return masked presence, never value.

### Invalid design

- token in YAML;
- token in `.env.example`;
- token passed through MCP response;
- base64 treated as encryption;
- encrypted secret committed beside its decryption key;
- command line argument visible in process history when avoidable.

Sensitive entry follows the `sensitive-secret-entry` protocol when available.

## External Action Security

Every external action is:

1. prepared from canonical context;
2. validated for recipient, claims, attachments, and classification;
3. assigned checksum and expiration;
4. reviewed and confirmed by Guilherme;
5. executed once through an idempotent adapter when possible;
6. reconciled with provider evidence.

Confirmation is invalid when:

- payload changes;
- recipient changes;
- attachment changes;
- provider changes;
- action expires;
- actor changes;
- source entity revision materially changes.

## Logging and Audit

Logs may include:

- command and event IDs;
- actor ID;
- target ID;
- gate outcome;
- timing;
- stable error code;
- adapter result category.

Logs must not include:

- raw secrets;
- complete confidential message bodies by default;
- unnecessary personal information;
- binary attachments;
- provider session data.

Audit events are canonical when they prove a material mutation. Debug logs are
runtime artifacts with retention limits.

## Git Security

- Coordinator remains private.
- Public product repos contain no Studio confidential records.
- Secret scanning occurs before write and commit.
- `.gitignore` is defense in depth, not the only control.
- Force push, history rewriting, branch deletion, and remote changes require
  explicit protected workflows.
- Git hooks cannot be the only enforcement because agents may bypass them.
- Every repository action verifies the actual root.

## WordPress Security Baseline

For owned WordPress work:

- no direct core edits;
- capabilities and nonces for privileged mutations;
- validate and sanitize input;
- escape output by context;
- prepared SQL or trusted query APIs;
- least-privilege REST/AJAX routes;
- safe file upload types and paths;
- dependency and compatibility review;
- no credentials in plugin/theme source;
- production debug output disabled;
- backups before data migrations;
- verify actual admin and frontend entrypoints.

Client-specific security requirements may strengthen this baseline.

## Backup Security

- Backups inherit source classification.
- Confidential backups are encrypted at rest.
- Secret-store backup is separate from canonical data backup.
- Manifests contain identifiers and checksums, not secret values.
- Restore occurs into an alternate path before promotion.
- Backup age without restore rehearsal is not sufficient evidence.
- Disposal follows retention policy.

## Incident Severity

| Severity | Example | Response |
|---|---|---|
| S1 | secret exposed, unauthorized external action, production compromise | immediate block, revoke, recover, audit |
| S2 | confidential data exposed locally or to wrong recipient | contain, assess replicas, notify decision owner |
| S3 | canonical corruption or unrecoverable local work risk | stop scoped writes, recover from checkpoint |
| S4 | policy warning or low-impact invalid attempt | record and correct |

## Incident Record

Must include:

- detected time and detector;
- affected entities, repositories, providers, and data classes;
- observed facts;
- unknowns;
- containment;
- credential revocation where applicable;
- recovery source;
- validation evidence;
- external notification decision;
- root cause;
- prevention change;
- closure authority.

Do not paste the compromised value into the incident record.

## Retention and Deletion

Retention is domain-specific:

- contracts, invoices, and payment records follow legal/accounting guidance
  defined outside this system;
- rejected prospects and applications retain only useful, justified data;
- debug logs expire quickly;
- communications store summaries or references when full bodies are not needed;
- deletion uses tombstones or corrective events where audit must remain;
- permanent deletion requires capability, confirmation, dependency analysis,
  and backup/retention check.

The Studio does not claim legal compliance merely because a field exists.

## Security Verification

Required automated tests:

- secret fixtures rejected at schema and storage boundaries;
- path traversal and symlink escape rejected;
- unauthorized actor blocked;
- stale and replayed confirmation rejected;
- local API rejects non-loopback and invalid origin;
- output redaction;
- malformed archive extraction;
- dependency boundary checks;
- canonical crash recovery;
- projection excludes secret fields.

Required manual exercises:

- secret rotation incident;
- restore from encrypted backup;
- public case privacy review;
- WordPress data migration rollback;
- external-action payload review.

## Security Acceptance Criteria

- No valid canonical schema accepts secret material.
- No interface can retrieve a raw secret.
- All external actions are exact-payload confirmed.
- Every repository and path mutation is boundary-checked.
- Panel remains local-only.
- Security incidents have a complete containment and recovery workflow.
- Backups can be restored without weakening classification.

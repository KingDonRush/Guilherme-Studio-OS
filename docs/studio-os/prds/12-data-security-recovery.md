# PRD 12: Data, Security, Backup, and Recovery

## Product Job

Keep Studio data private, valid, portable, recoverable, and auditable while
allowing human-readable versioned operations.

## Data Classes

### Public

Already public or intended for publication: public repositories, cases,
published content, public contact routes.

### Internal

Operational state whose disclosure would be inconvenient but not materially
harmful.

### Confidential

Client data, proposals, contracts, private communications, financial records,
application materials, and unpublished strategy.

### Secret

Passwords, tokens, OAuth secrets, private keys, recovery codes, cookies,
production credentials, and financial authentication data.

Secret values are prohibited from canonical Git storage.

## Capabilities

### Validation and classification

- Validate every canonical record against a versioned schema.
- Require field classification and reject secret-shaped content.
- Support explicit false-positive overrides through a decision and local
  secure reference, never inline secret storage.

### Atomic canonical storage

- Write via temporary file, validation, fsync where supported, and atomic
  rename.
- Preserve original content on failure.
- Record mutation event after successful commit.

### SQLite projection

- Build from canonical files and events.
- Store source path, entity ID, schema version, checksum, and projection time.
- Reject ambiguous duplicate IDs.
- Support full rebuild and incremental update.
- Never become the only copy of data.

### Backup

- Back up root canonical repository;
- back up registered private repositories not recoverable from remotes;
- back up WordPress databases and persistent uploads/volumes;
- back up local secret references through a separate encrypted process;
- create manifest and checksums.

### Recovery

- Restore into a clean alternate path first.
- validate schemas, repository health, references, and SQLite rebuild;
- verify at least one WordPress environment from database and volume backup;
- record recovery evidence.

### Security monitoring

- secret scan before commit;
- path traversal and symlink boundary checks;
- dependency and package audit;
- failed authorization logs;
- backup age and restore rehearsal alerts.

## Threat Model

- accidental secret commit;
- malicious or mistaken agent mutation;
- path escape through CLI or MCP;
- panel exposed beyond loopback;
- stale confirmation replay;
- corrupted canonical write;
- SQLite drift;
- nested Git confusion;
- lost Docker volume or database;
- private client data included in public evidence;
- supply-chain dependency compromise.

## Dependencies

- Foundational dependency for storage, CLI, MCP, panel, adapters, finance, and
  client modules.
- Secret storage is external and accessed only through protected references.

## Acceptance Criteria

- Secret fixtures are rejected before write and before commit.
- SQLite can be deleted and rebuilt deterministically.
- Invalid writes leave canonical files unchanged.
- Backup manifests identify all registered recoverable components.
- Restore rehearsal produces a healthy alternate Studio and at least one
  functioning WordPress environment.
- Panel is inaccessible through non-loopback binding by default.
- Confirmation replay and stale payload tests fail closed.

# Research Packets and Technology Decisions

Status: active research register
Research date: 2026-06-14
Rule: implementation decisions cite primary sources and close with a
reproducible spike when documentation alone is insufficient

## Packet Template

Each packet records:

- question;
- constraints;
- candidates;
- primary sources;
- observations;
- current inference;
- decision status;
- required spike;
- closing evidence.

`Recommended` is not `Decided`. A decision becomes normative only when its
closing evidence is attached to the decision register.

## RP-001: Shared Runtime and Type System

### Question

Can TypeScript support Studio Core, CLI, MCP, local API, and panel without
creating packaging or cognitive overhead that exceeds its contract-sharing
benefit?

### Sources

- [Node.js release status](https://nodejs.org/en/about/previous-releases)
- [npm workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces/)
- [npm package `bin` behavior](https://docs.npmjs.com/files/package.json/)
- [Zod documentation](https://zod.dev/)
- [Zod JSON Schema conversion](https://zod.dev/json-schema)

### Observations

- Node 24 is LTS on the research date; Node 26 is Current.
- npm workspaces provide native package linking for a local monorepo.
- Zod 4 supports TypeScript-first runtime schemas and native JSON Schema
  conversion, useful for CLI, MCP, and API contract generation.
- TypeScript does not solve architecture by itself; package boundaries and
  dependency tests remain required.

### Current recommendation

Use TypeScript, ESM, Node 24 LTS, npm workspaces, and Zod 4 for the initial
spike. Keep schemas as the lowest dependency layer.

### Closing spike

- build one entity schema;
- export JSON Schema;
- parse YAML;
- invoke one core use case from CLI, MCP test harness, and HTTP test;
- package a `studio` binary entry;
- measure cold start and install path.

Status: **recommended, not yet decided**.

## RP-002: Extensible CLI Architecture

### Question

Should Studio use oclif, Commander, or a custom parser?

### Sources

- [oclif features](https://oclif.io/docs/features)
- [oclif commands](https://oclif.github.io/docs/commands/)
- [oclif hooks](https://oclif.io/docs/hooks/)
- [Commander README](https://github.com/tj/commander.js/blob/master/Readme.md)
- [Commander release policy](https://github.com/tj/commander.js/blob/master/docs/release-policy.md)

### Observations

- oclif provides commands, plugins, hooks, help, and TypeScript conventions but
  introduces a framework lifecycle and plugin model.
- Commander provides strict parsing, help, and subcommands with a smaller
  surface.
- Studio extensibility primarily belongs in core domain modules and adapters,
  not third-party runtime CLI plugins.
- A custom parser would spend effort on solved argument and help behavior.

### Current recommendation

Spike Commander with an internal typed command registry. Do not adopt oclif
plugins unless a real external extension requirement appears.

### Closing spike

Implement:

```text
studio status --json
studio engagement transition <id> --to in_progress --dry-run
studio repo inspect <id>
```

Verify help generation, stable exit codes, machine mode, and command module
discovery without business logic in handlers.

Status: **recommended, not yet decided**.

## RP-003: SQLite Binding and Rebuild Safety

### Question

Which SQLite binding supports a portable local CLI while keeping SQLite fully
derived and rebuildable?

### Sources

- [Node `node:sqlite`](https://nodejs.org/api/sqlite.html)
- [SQLite atomic commit](https://sqlite.org/atomiccommit.html)
- [SQLite WAL](https://sqlite.org/wal.html)
- [SQLite pragmas](https://sqlite.org/pragma.html)
- [`better-sqlite3` repository](https://github.com/WiseLibs/better-sqlite3)

### Observations

- `node:sqlite` is release-candidate in current Node documentation, but Node 24
  LTS predates that stability change and requires compatibility validation.
- `better-sqlite3` supports transactions and publishes prebuilt binaries for
  supported LTS versions, but native packaging must be tested on target systems.
- SQLite atomicity protects the derived database; it does not make multi-file
  canonical filesystem writes transactional.
- WAL requires same-host filesystem semantics and is unnecessary until measured
  read concurrency justifies it.

### Current recommendation

Keep a narrow `ProjectionDatabase` interface. Spike both Node 24-compatible
`node:sqlite` and current `better-sqlite3`; choose from install reliability,
backup behavior, test support, and packaging.

Default journaling should remain conservative until concurrency tests justify
WAL. The projection is disposable either way.

### Closing spike

- install on the actual Linux workstation;
- package CLI;
- project 10,000 fixture entities;
- rebuild twice and compare logical checksums;
- simulate interrupted rebuild;
- verify prepared statements and integer handling;
- test Node upgrade.

Status: **open**.

## RP-004: MCP SDK and Confirmation Boundary

### Question

How should the Studio expose resources, tools, and prompts without coupling core
logic to an unstable SDK generation?

### Sources

- [Official MCP SDK overview](https://modelcontextprotocol.io/docs/sdk)
- [MCP resources specification](https://modelcontextprotocol.io/specification/2025-06-18/server/resources)
- [MCP tools specification](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
- [MCP prompts specification](https://modelcontextprotocol.io/specification/2025-06-18/server/prompts)
- [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)
- [Official TypeScript SDK repository](https://github.com/modelcontextprotocol/typescript-sdk)

### Observations

- MCP separates resources, tools, and prompts in a way that maps cleanly to
  Studio context, actions, and workflows.
- As of 2026-06-14, the official TypeScript SDK repository identifies v2 as
  pre-alpha and recommends v1.x for production until the expected v2 release.
- MCP metadata does not replace Studio authority; confirmation remains a domain
  contract.
- A local stdio server avoids unnecessary network exposure for V1.

### Current recommendation

Use the official MCP TypeScript SDK v1.x over stdio in V1. Place all SDK mapping
inside `packages/mcp`; expose SDK-independent application commands from core.
Re-evaluate v2 only after stable release and compatibility tests.

### Closing spike

- expose one resource, read tool, mutation dry-run tool, and workflow prompt;
- validate with MCP Inspector;
- prove a blocked core command remains blocked;
- prove secret fields are omitted;
- document SDK upgrade boundary.

Status: **recommended, time-sensitive**.

## RP-005: Local Panel Security

### Question

How can a browser panel remain convenient without becoming a network service or
a second authority layer?

### Sources

- [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP HTTP Headers](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html)
- [OWASP SSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)

### Observations

- Loopback binding reduces exposure but does not remove browser-origin attacks.
- Cookie-backed sessions require CSRF and origin controls.
- The panel does not need JWT, remote login, or public deployment in V1.
- Raw file and URL fetching surfaces would create unnecessary traversal and SSRF
  risk.

### Current recommendation

Launch the panel from CLI with a random per-launch token, bind to `127.0.0.1`,
validate Host and Origin, use SameSite session protection, and expose only
typed use-case routes.

### Closing spike

- prove non-loopback bind is rejected;
- test hostile Origin and Host;
- test expired session and CSRF;
- test arbitrary path and URL rejection;
- run browser workflow through actual `studio dashboard`.

Status: **recommended**.

## RP-006: Nested Git, Registry, and Submodules

### Question

How should the coordinator relate to independent plugin and WordPress
repositories?

### Sources

- [Git submodule command](https://git-scm.com/docs/git-submodule)
- [Git submodule model](https://git-scm.com/docs/gitsubmodules)
- [`.gitmodules` contract](https://git-scm.com/docs/gitmodules)

### Observations

- A submodule is a repository embedded in a superproject and introduces a
  committed pointer and update semantics.
- Current Studio needs discovery, health, ownership, and separate histories
  more than pinned dependency commits.
- Accidental nested Git staging is a boundary problem that a registry and
  precise ignore rules can solve.

### Current recommendation

Use registered independent repositories by default. Require a decision record
for every submodule.

### Closing spike

- register the current five nested repositories;
- detect actual Git roots;
- inspect status independently;
- prove coordinator cannot stage their contents;
- simulate path move and registry update;
- test a deliberately mismatched root.

Status: **recommended**.

## RP-007: Canonical Files and Private Data

### Question

Can Markdown/YAML in a private repo safely remain canonical for commercial
operations?

### Sources

- [Git user manual](https://git-scm.com/docs/user-manual)
- [Zod JSON Schema](https://zod.dev/json-schema)
- [WordPress security principles](https://developer.wordpress.org/apis/security/)

### Observations

- Git provides history and distribution, not field-level privacy or secret
  storage.
- A private repo still requires classification, least collection, secret
  rejection, backup, and public-export controls.
- Structured schemas can reject prohibited fields before write.

### Current recommendation

Allow justified internal and confidential records in the private coordinator.
Prohibit secrets. Minimize raw communication bodies and sensitive personal data.
Generate public exports through classification-aware projections.

### Closing spike

- define representative client, contract, and application fixtures;
- test secret and sensitive-field scanning;
- produce a public case export;
- confirm confidential fields cannot enter it.

Status: **recommended**.

## RP-008: Backup, Restore, and Portability

### Question

What constitutes a recoverable Studio and WordPress environment?

### Sources

- [Docker volumes and restore](https://docs.docker.com/engine/storage/volumes/)
- [Docker Desktop backup and restore](https://docs.docker.com/desktop/settings-and-maintenance/backup-and-restore/)
- [Docker container export limitation](https://docs.docker.com/reference/cli/docker/container/export/)
- [WP-CLI database export](https://developer.wordpress.org/cli/commands/db/export/)
- [WP-CLI database import](https://developer.wordpress.org/cli/commands/db/import/)
- [WordPress WP-CLI backup guidance](https://developer.wordpress.org/news/2024/09/website-security-checks-wp-cli-for-site-owners-and-administrators/)

### Observations

- Container image export does not include mounted volume content.
- WordPress WXR export does not include site configuration or attachment files.
- A useful WordPress recovery requires database plus persistent `wp-content`
  assets or volumes and custom code references.
- A backup without alternate-path restore evidence is unproven.

### Current recommendation

Create component-aware backup manifests and require periodic alternate-path
restore. Keep secret backup separate and encrypted.

### Closing spike

- back up the current portfolio WordPress database and persistent media;
- restore to alternate project/port;
- resolve registered plugin repos;
- validate admin and public routes;
- delete/rebuild Studio SQLite;
- record checksums.

Status: **recommended**.

## RP-009: WordPress and Docker Integration

### Question

Which operations should the Studio adapter own versus delegate to Docker,
Compose, WP-CLI, or repository scripts?

### Sources

- [Docker Compose](https://docs.docker.com/compose/)
- [Docker bind mounts](https://docs.docker.com/engine/storage/bind-mounts/)
- [WP-CLI command reference](https://developer.wordpress.org/cli/commands/)
- [WP-CLI search-replace](https://developer.wordpress.org/cli/commands/search-replace/)
- [WordPress plugin security](https://developer.wordpress.org/plugins/)

### Observations

- Compose already defines multi-service runtime state.
- Bind mounts are suitable for source development but can modify host files and
  obscure container paths.
- WP-CLI provides authoritative WordPress operations and safe serialized
  search/replace support.
- Studio should coordinate and validate these tools, not reimplement them.

### Current recommendation

Build a thin adapter around declared Compose and WP-CLI commands. Record
environment contracts, target paths, and evidence. Avoid a generic Docker shell
tool in MCP.

### Closing spike

- inspect/start/stop current WordPress;
- run a read-only WP-CLI health command;
- mount one registered plugin repository;
- back up and restore;
- prove commands cannot target an unregistered environment.

Status: **recommended**.

## RP-010: Minimum CRM for Freelance and Employment

### Question

What is the minimum model that improves conversion without recreating a general
CRM or applicant-tracking system?

### Evidence basis

This packet is driven first by Guilherme's actual workflows and will use
external product research only to compare patterns, not import a generic CRM
ontology.

### Current observations

Both pipelines require:

- person and organization identity;
- source;
- fit;
- stage;
- next action;
- deadline;
- communication;
- evidence;
- outcome and learning.

They differ in commercial object:

- freelance uses prospect, opportunity, proposal, client, engagement;
- employment uses role and job application.

### Current recommendation

Share identity, communication, task, evidence, and next-action primitives.
Keep Opportunity and JobApplication as different lifecycles. Do not add lead
scoring automation until enough real outcomes exist.

### Closing spike

Manually model:

- three real freelance pursuits;
- three real job applications;
- one conversion and one rejection in each pipeline;
- weekly review questions.

Remove every field that does not change a decision or next action.

Status: **requires real-data validation**.

## RP-011: External Automation Safety

### Question

How can GitHub, WhatsApp, email, job platforms, and future providers be useful
without permitting autonomous reputation or financial risk?

### Sources

- MCP tool and resource specifications from RP-004;
- OWASP sources from RP-005;
- provider-specific official API documentation, researched only when an adapter
  is scheduled.

### Current recommendation

Use a universal prepared-action contract and provider-specific execution
adapters. No provider adapter is part of core. Browser automation is treated as
an external action and must capture the exact target and visible result.

### Closing spike

- prepare one message without sending;
- confirm and execute in a non-production test channel;
- reject changed payload and expired confirmation;
- reconcile provider receipt;
- simulate ambiguous provider timeout without duplicate send.

Status: **recommended**.

## Research Priority

Before implementation Phase 0:

1. RP-001 runtime and schemas;
2. RP-003 SQLite binding;
3. RP-002 CLI;
4. RP-004 MCP version;
5. RP-006 repository model.

Before panel:

6. RP-005 local security.

Before migration and adapters:

7. RP-007 private data;
8. RP-008 backup;
9. RP-009 WordPress/Docker;
10. RP-010 CRM validation;
11. RP-011 external automation.

## Research Completion Gate

A packet closes only when:

- sources and date are recorded;
- competing options are compared;
- a representative local spike passes;
- operational cost and security impact are measured;
- the decision and rollback are registered;
- affected PRDs and architecture are updated.

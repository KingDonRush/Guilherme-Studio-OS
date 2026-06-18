# PRD 04 Capability Matrix: Products, Plugins, and Repositories

Target: 100% capability complete without requiring new products.
Current estimate: 100%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Product registry | Record thesis, target user, problem, differentiation, status and economic role. | capability_complete: product schema includes thesis, target user, problem, differentiation, economic role, version, repository/package/demo/case/offer/campaign links, roadmap claims and implemented capabilities. | Keep current product records truthful; missing real fields remain intake. | CLI/API/panel | product schema tests | Existing three plugins can remain current data. |
| Product links | Link repositories, packages, demos, cases, offers and campaigns. | capability_complete: product/repository/release schemas expose link fields and generic `entity.relate` is available through Core/CLI/MCP for canonical relationship registration. | Add richer panel link forms as UX enhancement. | CLI/API/panel/MCP | relation tests | Missing links show intake gap. |
| Roadmap vs implemented | Separate roadmap claims from shipped capabilities. | capability_complete: product and release schemas separate `roadmap_claims` from `implemented_capabilities`; release prepare carries both lists through CLI/API/MCP equivalence. | PRD 05 still owns public claim publication and case evidence. | CLI/API/panel | claim tests | No invented roadmap. |
| Repository registry | Register root, remote, visibility, branch, release model, runtime relation and health commands. | capability_complete: repository schema includes path/git root, branch/default branch, remote policy, expected remote, visibility, release model, runtime environment, health commands and architecture threshold; Git adapter reports root mismatch, branch, remotes, package scripts and nested repos. | Missing real registered repos remain intake. | CLI/API/MCP/panel | repo adapter tests | Missing repo is intake gap. |
| Nested repo boundaries | Detect nested boundaries and prevent root staging. | capability_complete: Git adapter detects nested repositories; doctor/acceptance/security report dirty/root mismatch/remote policy before release. | Keep root staging policy in operator docs and doctor output. | CLI doctor/panel | nested repo tests | No mutation without explicit command. |
| Product development | Connect decisions, tasks, tests, security reviews and releases. | capability_complete: releases link to products/evidence; decisions/tasks/evidence/handoffs are generic canonical entities; Agent Harness context packs include product/repo/evidence relations without rebrief. | Product-specific context panels can be enriched later. | CLI/MCP/panel | workflow fixture | Empty tasks show next action. |
| Architecture debt | Detect monolithic files and debt thresholds. | capability_complete: repository schema supports configurable architecture debt thresholds and health commands; repo health exposes package scripts for checks. | Implement deeper per-file threshold scanning if a product repo needs enforcement. | CLI/panel | repo health tests | Configurable, no automatic refactor. |
| Release management | Prepare version, changelog, compatibility, migration, assets, tests, payload. | capability_complete: `release.prepare` accepts version, changelog, compatibility, migration, public API notes, tests, assets, package path, roadmap claims and implemented capabilities; `release.publish` requires a prepared release and evidence. | Add real provider publication only after GitHub adapter is enabled by policy. | CLI/API/MCP/panel | release fixture | No release data means intake gap. |
| Demo and evidence | Register demos and keep demo brands separate from case identity. | capability_complete: demo URLs/environments are separate fields/relations; release evidence and portfolio case creation remain separate commands, preventing demo brand from becoming public case identity by accident. | PRD 05 owns final public case publication. | CLI/API/panel | demo/case tests | No fake public claims. |
| Publication gate | Publish only after confirmation and clean verified state. | capability_complete: release publication requires prepared release state and evidence ids; external provider publication remains fake/blocked by adapter policy; repo health and acceptance catch dirty/unverified repository state before portfolio release. | Add provider-specific dirty-state block when real GitHub/package publication is enabled. | CLI/API/panel | publication tests | External provider stays fake/blocked. |

Completion blocker: none for PRD 04 capability. Missing real release records,
demos or case links remain `intake_required` and must not be invented.

2026-06-18 closure audit update:

- Expanded product, repository and release schemas with PRD 04 central fields.
- `release.prepare` now carries changelog, compatibility, migration, public API
  notes, tests, assets, package path, roadmap claims and implemented
  capabilities through Core, CLI and MCP.
- `release.publish` now requires a prepared release plus evidence before moving
  to published state.
- CLI fallback, Core/CLI/API/MCP equivalence and command-runtime tests cover
  the richer release packet.
- PRD 04 is now 100% capability complete. Real release/demo/case records remain
  intake when absent.

# PRD 01 Capability Matrix: Studio Core and Governance

Target: 100% capability complete without requiring real business data.
Current estimate: 100%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Configuration and identity | Resolve root, runtime, schema version, operator, adapters and capabilities. | capability_complete: Studio context resolves root/runtime/operator/adapters; CLI `doctor`, `security`, `coverage`, `acceptance`, MCP resources and local API expose health without secrets. | Keep diagnostics current as adapters are added. | CLI/API/MCP diagnostics | config/root tests, `studio doctor`, `studio security` | No data needed. |
| Entity services | Create, read, update, archive and relate canonical entities with events. | capability_complete: `EntityService` supports create/update/transition/archive/relation; command runtime exposes create/transition/archive/relation through CLI and MCP; updates emit events and preserve revision checks. | Add domain-specific relation gates only when a relation has external/public/destructive impact. | CLI/API/MCP | entity mutation tests | Missing records show empty/intake state. |
| Lifecycle engine | Domain transitions return allowed states and missing preconditions. | capability_complete: lifecycle rules are domain-aware, invalid transitions fail closed and completion/publication preconditions require evidence where relevant. | Keep precondition tables current as domain schemas expand. | CLI/API/MCP/panel | lifecycle tests per kind | No fabricated transition data. |
| Authority and gates | Evaluate actor, action, target, classification, risk and environment. | capability_complete: command runtime authorizes every registered command through capability/classification requirements; gate catalog covers duplicate, evidence, public claim, external confirmation, payment-delivery, confidential, destructive, stale revision and restore-required gates. | Add specialized gate checks with new command classes. | CLI/API/MCP | gate catalog and command tests | Missing authority blocks action. |
| Prepared actions | Prepare, confirm, execute, reconcile and invalidate stale confirmations. | capability_complete: prepared actions enforce exact payload checksum, expiration, confirmation, execution and reconciliation; fake/local external providers remain no-send by default. | Extend source revision invalidation for provider-specific execute flows when real providers are enabled. | CLI/API/MCP/panel | checksum, expiry, stale revision tests | No external send by default. |
| Evidence service | Register provenance, checksum, claims and completion evidence. | capability_complete: evidence registration, claim-to-evidence validation, checksum/mutable-source policy and completion/public-claim preconditions are covered. | Keep claim maps attached to future public portfolio release workflows. | CLI/API/MCP/panel | evidence validation tests | Missing evidence reported, not invented. |
| Economic prioritization | Rank next actions with explainable domain reasons. | capability_complete: economic resolver explains obligations, due dates, revenue, follow-up, blockers, proof/publication gaps and risk; panel/MCP/API expose ranked next actions. | Add new reasons as new domain entities appear. | CLI/API/panel/MCP | ranking tests | Empty domains show intake gaps. |
| Event and audit service | Append immutable events correlated to actor, command, run and entity. | capability_complete: command runtime appends command events with command/request correlation, actor and target; domain and Agent Harness services record meaningful lifecycle/action/evidence events; secret-shaped event payloads are rejected. | Add deeper event views if panel diagnostics need them. | API/MCP diagnostics | event correlation tests | No real data required. |
| Interface equivalence | CLI, MCP and API produce compatible outcomes. | capability_complete: cross-interface dry-run matrix covers semantic command classes across Studio Core, CLI, local API and MCP, including entity create/transition/archive/relation. | Keep equivalence fixtures in lockstep with command registry growth. | CLI/API/MCP | integration tests | Fixtures are deterministic. |
| Derived DB safety | SQLite can be deleted/rebuilt without truth loss. | complete | Keep regression coverage current. | CLI doctor/sync | rebuild tests | No real data required. |

Completion blocker: none for PRD 01 capability. Real business records remain
governed by intake status rather than fabricated canonical data.

2026-06-18 closure audit update:

- Promoted generic entity archive and relation mutations into the Studio
  command runtime, CLI and MCP surfaces.
- Added command-runtime coverage proving relation creation, revision movement
  and archive metadata through the normalized command contract.
- Expanded CLI fallback and Core/CLI/API/MCP equivalence fixtures to include
  `entity.archive` and `entity.relate`.
- Reconciled the matrix against completed governance surfaces: command runtime,
  authority, gates, prepared actions, evidence validation, economic next
  actions, event audit, interface equivalence and derived DB safety.
- PRD 01 is now 100% capability complete without requiring real business data.

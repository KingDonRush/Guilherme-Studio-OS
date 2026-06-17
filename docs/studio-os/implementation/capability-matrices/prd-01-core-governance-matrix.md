# PRD 01 Capability Matrix: Studio Core and Governance

Target: 100% capability complete without requiring real business data.
Current estimate: 58%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Configuration and identity | Resolve root, runtime, schema version, operator, adapters and capabilities. | partial | Add explicit adapter capability report and invalid-root fixtures. | CLI/API/MCP diagnostics | config/root tests, `studio doctor` | No data needed. |
| Entity services | Create, read, update, archive and relate canonical entities with events. | partial | Add update/archive semantic commands and relation mutation gates. | CLI/API/MCP | entity mutation tests | Missing records show empty/intake state. |
| Lifecycle engine | Domain transitions return allowed states and missing preconditions. | partial | Move lifecycle rules into domain precondition tables; expose allowed transitions. | CLI/API/MCP/panel | lifecycle tests per kind | No fabricated transition data. |
| Authority and gates | Evaluate actor, action, target, classification, risk and environment. | partial | Attach gate evaluation to every mutable command, not only selected flows. | CLI/API/MCP | gate catalog and command tests | Missing authority blocks action. |
| Prepared actions | Prepare, confirm, execute, reconcile and invalidate stale confirmations. | partial | Add source revision invalidation and command-level gate mapping. | CLI/API/MCP/panel | checksum, expiry, stale revision tests | No external send by default. |
| Evidence service | Register provenance, checksum, claims and completion evidence. | partial | Complete claim-to-evidence validation and mutable-source policy. | CLI/API/MCP/panel | evidence validation tests | Missing evidence reported, not invented. |
| Economic prioritization | Rank next actions with explainable domain reasons. | partial | Add domain reason adapters for obligations, follow-up, proof, revenue and blockers. | CLI/API/panel/MCP | ranking tests | Empty domains show intake gaps. |
| Event and audit service | Append immutable events correlated to actor, command, run and entity. | partial | Attach AgentRun ID and redaction metadata to events. | API/MCP diagnostics | event correlation tests | No real data required. |
| Interface equivalence | CLI, MCP and API produce compatible outcomes. | partial | Expand equivalence fixtures across semantic commands. | CLI/API/MCP | integration tests | Fixtures are deterministic. |
| Derived DB safety | SQLite can be deleted/rebuilt without truth loss. | complete | Keep regression coverage current. | CLI doctor/sync | rebuild tests | No real data required. |

Completion blocker: gate and lifecycle behavior must become comprehensive, not
kind-presence based.


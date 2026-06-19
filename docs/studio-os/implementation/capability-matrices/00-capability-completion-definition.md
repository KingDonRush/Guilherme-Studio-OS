# Capability Completion Definition

Status: normative planning contract
Purpose: define what "100% PRD complete" means without requiring fabricated
real clients, jobs, campaigns or finance records.

## Definition

A PRD is 100% complete by capability when the Studio OS can execute every
required behavior, enforce every relevant gate, expose the behavior through the
required interfaces, verify it with deterministic tests or fixtures, and report
missing real-world data as `intake_required`.

Real data readiness is separate.

```text
capability_complete: true
canonical_data_ready: false is acceptable
intake_required: acceptable when real data is absent
missing_capability: 0
missing_behavior: 0
missing_interface: 0
missing_evidence: 0
```

## Row Status

Use these statuses in every PRD matrix:

| Status | Meaning |
|---|---|
| `capability_complete` | Behavior, interface, test and evidence path exist. |
| `complete` | Accepted synonym only for older matrix rows; prefer `capability_complete` in new updates. |
| `partial` | Some implementation exists, but the PRD behavior is not closed. |
| `missing` | Required capability has no meaningful implementation yet. |
| `deferred_by_decision` | Intentionally not implemented and linked to a decision. |
| `intake_required` | Capability exists, but no real data exists and must not be invented. |

## Capability Completion Columns

Every row must answer:

- PRD requirement;
- target capability;
- current state;
- implementation work;
- required interfaces;
- verification;
- real-data behavior.

## Done Rule

A row is complete only when:

- schema supports the required domain data without relying on generic catchall
  for core fields;
- core command/service enforces behavior;
- lifecycle/gate/evidence rule exists where applicable;
- CLI exposes deterministic fallback;
- API/MCP/panel expose the behavior when required by PRD 11;
- test or executable fixture proves the behavior;
- evidence registration path exists;
- absent real data is surfaced as `intake_required`, not hidden or fabricated.

## Interface Rule

CLI is mandatory for every mutable capability. API/MCP/panel are required when
the capability is part of agent context, human review, diagnostics, prepared
actions, or dashboard operation.

## Intake Rule

The system may be 100% complete while showing no clients, applications,
campaigns, invoices or payments. It must show the absence precisely and create
records only from provided real input or deterministic fixtures.

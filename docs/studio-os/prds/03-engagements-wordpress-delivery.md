# PRD 03: Engagements and WordPress Delivery

## Product Job

Turn an accepted commercial demand into controlled, independently trackable
WordPress deliverables with reproducible environments, approvals, evidence,
delivery, and payment awareness.

## Model

```text
Client
└── Engagement: one paid commercial unit
    ├── Deliverable: institutional site
    │   └── Project + WordPress repository
    └── Deliverable: campaign landing page
        └── Project + WordPress repository
```

## Capabilities

### Engagement initiation

- Create from won opportunity or direct approved demand.
- Capture scope, exclusions, commercial terms, schedule, stakeholders, and
  acceptance model.
- Require explicit basis before work starts.

### Deliverable planning

- Split one engagement into independently accepted outputs.
- Give each deliverable owner, stage, requirements, repository, environment,
  assets, approvals, and delivery record.
- Preserve shared commercial context without sharing technical state.

### WordPress project bootstrap

- Create or register an independent Git repository.
- Provision Dockerized WordPress from a versioned template.
- Record WordPress, PHP, database, theme, plugin, and Elementor assumptions.
- Separate tracked orchestration from generated core, uploads, caches, and
  dependencies.
- Produce environment health evidence.

### Requirement and decision control

- Link brief, scope, approved design, content, technical decisions, and change
  requests.
- Distinguish client request, interpretation, decision, and implementation.
- Calculate scope impact before accepting material changes.

### Production workflow

- Plan, implement, verify, review, approve, deliver, and support.
- Apply WordPress security gates: capabilities, nonces, sanitization, escaping,
  prepared queries, dependency boundaries, and upgrade safety.
- Apply visual reality calibration when design implementation is involved.

### Delivery and warranty

- Assemble deliverable package, access handoff, documentation, backups, and
  acceptance evidence.
- Start warranty only after delivery conditions are met.
- Keep maintenance as a new engagement or explicit recurring agreement.

## Canonical Structure

```text
clients/<client>/engagements/<engagement>/
├── engagement.yaml
├── scope/
├── commercial/
├── communications/
├── decisions/
├── evidence/
├── delivery/
├── assets/
└── deliverables/
    └── <deliverable>/
        ├── deliverable.yaml
        ├── project.yaml
        ├── docs/
        └── wordpress/   # independent Git repository
```

If a deliverable contains several coupled sites, use `sites/<site>/wordpress/`
and document why they share one deliverable.

## Public Interfaces

```text
createEngagement()
addDeliverable()
initializeWordPressProject()
recordRequirement()
recordDecision()
requestChange()
evaluateScopeChange()
transitionDeliverable()
prepareDelivery()
recordAcceptance()
closeEngagement()
```

## Dependencies

- Depends on client, opportunity, contract, finance, repository, asset,
  evidence, task, and adapter services.
- WordPress bootstrap depends on Docker and repository adapters.
- Closure depends on delivery and financial policy.

## Acceptance Criteria

- One engagement supports multiple sites without state collisions.
- Each WordPress project is reproducible from tracked configuration and
  registered private data backups.
- Technical completion, client acceptance, and payment remain distinct.
- Scope changes cannot silently mutate accepted commitments.
- Delivery is blocked when required backup, documentation, or approval is
  missing.
- Repository health is checked before and after agent work.

# Cross-Domain Journeys

Status: normative workflow specification
Purpose: prove that domain PRDs form one operating system

## Workflow Contract

Every workflow step declares:

- owner;
- input entities;
- command or human action;
- expected state transition;
- gate;
- evidence;
- failure path;
- next valid step.

The examples use intended CLI names. Exact flags may be refined during CLI
implementation, but semantics and authority boundaries are normative.

## Journey 1: Prospect to Client

### Goal

Convert a researched target into a qualified, consent-aware commercial
relationship without losing why the target was selected.

### Flow

| Step | Action | State | Gate | Evidence |
|---|---|---|---|---|
| 1 | create or resolve person/organization | identity exists | duplicate check | source URL or introduction |
| 2 | create prospect | `identified` | fit reason required | research note |
| 3 | research need, stack, timing, and contact route | `researched` | classification review | source evidence |
| 4 | qualify fit and offer | `qualified` or `disqualified` | explicit rationale | qualification scorecard |
| 5 | prepare outreach | `outreach_prepared` | claims require evidence | exact message payload |
| 6 | Guilherme confirms and sends | `contacted` | exact-payload confirmation | adapter/send receipt |
| 7 | record response | `engaged`, `nurture`, or `closed` | no inferred intent | communication reference |
| 8 | create opportunity | opportunity `discovery` | concrete need required | need and next action |
| 9 | prepare and confirm proposal | `proposal_sent` | commercial review | sent proposal version |
| 10 | record acceptance | `won` | explicit acceptance | communication or signed proposal |
| 11 | create client and engagement | client `active`, engagement `draft` | identity and terms valid | linked accepted proposal |

### Representative commands

```text
studio prospect create --organization <id> --source <url>
studio prospect qualify <id> --dry-run
studio communication prepare --prospect <id> --channel email
studio opportunity create --prospect <id>
studio proposal prepare --opportunity <id>
studio engagement create --from-opportunity <id>
```

### Failure paths

- Duplicate person or organization: merge references before continuing.
- Weak fit: move prospect to `nurture` or `disqualified`; do not generate
  generic outreach.
- No response: schedule a bounded follow-up; do not create infinite reminders.
- Material scope change after acceptance: amend explicitly or create a new
  opportunity.

## Journey 2: Client Engagement with Multiple Sites

### Goal

Deliver several sites under one paid demand while preserving independent
technical, approval, and delivery state.

### Entity graph

```text
Client
└── Engagement
    ├── Contract
    ├── Invoice
    ├── Deliverable: institutional site
    │   └── Project + WordPress repository
    ├── Deliverable: landing page
    │   └── Project + WordPress repository
    └── Deliverable: store
        └── Project + WordPress repository
```

### Flow

1. Create engagement from accepted opportunity.
2. Record scope, commercial terms, milestones, obligations, and exclusions.
3. Create one deliverable for each independently acceptable site or outcome.
4. Register repositories and environments per deliverable.
5. Confirm start conditions such as deposit, assets, access, and approved brief.
6. Transition engagement to `in_progress`.
7. Execute each deliverable through its own project lifecycle.
8. Register review evidence and client feedback per deliverable.
9. Mark each deliverable approved independently.
10. Prepare delivery only when contract and payment gates allow it.
11. Record final invoice and payment.
12. Close the engagement after obligations, handoff, and warranty state are
    explicit.

### Critical invariants

- One approved site does not mark sibling sites complete.
- Project completion does not imply payment.
- Payment does not prove technical acceptance.
- Shared repository use requires an explicit decision.
- Client profile stores relationship preferences, not project implementation
  truth.

### Required evidence

- accepted scope;
- repository health;
- environment setup;
- test and review results;
- client approvals;
- delivery receipt;
- invoice and payment references;
- final handoff.

## Journey 3: Completed Work to New Opportunity

### Goal

Turn real delivery into public proof and measurable distribution.

### Flow

```text
approved deliverable
→ evidence audit
→ claim-to-evidence map
→ case seed
→ case review
→ publication preparation
→ Guilherme confirmation
→ published case
→ campaign/content
→ attributed interaction
→ prospect or opportunity
```

### Gates

- client confidentiality and publication permission;
- removal or anonymization of private data;
- every public claim linked to A or B evidence;
- truthful role and contribution;
- exact publication preview;
- external publication confirmation.

### Outputs

- `PortfolioCase`;
- evidence manifest;
- public URLs;
- `Campaign`;
- `ContentItem` records;
- attribution links to resulting prospects or applications.

### Failure paths

- Evidence too weak: case remains `evidence_gap`; create a task to capture proof.
- Client cannot be named: use an approved anonymized narrative.
- Result cannot be quantified: describe observed behavior without invented
  metrics.
- Distribution has no audience or offer: do not publish generic content merely
  to satisfy a schedule.

## Journey 4: Plugin to Release, Demo, Case, and Prospecting

### Goal

Operate an owned WordPress plugin as both software product and hiring/sales
evidence.

### Flow

1. Product record identifies problem, audience, repository, and evidence goal.
2. Feature or fix is specified as a product task.
3. Repository is inspected from its own Git root.
4. Implementation follows plugin-specific quality gates.
5. Tests and installable artifact are verified through actual WordPress entry
   points.
6. Release is prepared with version, changelog, compatibility, and artifact.
7. Guilherme confirms public release.
8. GitHub release and repository state are reconciled into evidence.
9. Demo environment is updated and verified.
10. Case claims are derived from code, tests, editor behavior, and demo.
11. Case and demo are published through separate confirmation.
12. Campaign uses the product's implementation difference, not generic plugin
    claims.
13. Prospecting targets organizations where that evidence matches a real need.

### Critical invariants

- Product source, demo site, and case page are different owned objects.
- The demo cannot prove behavior not implemented by the plugin.
- A screenshot does not replace runtime verification.
- A release is not complete because a version number changed.
- Public claims must distinguish current behavior from roadmap.

## Journey 5: International Job Application

### Goal

Submit fewer, stronger applications whose claims map to actual evidence.

### Flow

| Step | Output |
|---|---|
| capture role | organization, role, source, deadline |
| qualify | fit, compensation, location, language, risks |
| map requirements | evidence matrix and gaps |
| decide | apply, nurture, or reject |
| prepare materials | tailored resume, note, case links |
| review | claim, grammar, recipient, attachments |
| confirm | exact application payload |
| submit | provider receipt or captured confirmation |
| follow up | scheduled action with reason |
| interview | notes, questions, evidence used |
| outcome | offer, rejected, withdrawn, no response |
| learn | reusable insight without overfitting |

### Gates

- no fabricated experience or metrics;
- no submission without explicit confirmation;
- confidential client material excluded;
- compensation and role constraints visible before time-intensive preparation;
- duplicate application detection.

### Evidence

- source job description snapshot or URL;
- requirements-to-evidence matrix;
- exact submitted material versions;
- submission confirmation;
- interview and outcome records.

## Journey 6: Visual Feedback to Validated Implementation

### Goal

Convert visual feedback into a causal, reproducible correction in the user's
real environment.

### Flow summary

```text
feedback
→ observation capture
→ environment calibration
→ causal hypothesis
→ smallest discriminating check
→ targeted implementation
→ dual-environment comparison
→ human approval
→ reusable learning when justified
```

The detailed protocol is defined in
[Visual Reality Loop](./02-visual-reality-loop.md).

### Required evidence

- user screenshot or direct observation;
- viewport and browser calibration;
- relevant computed layout facts;
- before and after captures from the same environment;
- explicit human approval for design completion.

## Journey 7: Security or Sensitive-Data Incident

### Goal

Stop exposure, preserve evidence, recover safely, and prevent recurrence.

### Flow

1. Detect suspected secret, unauthorized action, corrupted data, or exposed
   service.
2. Block affected mutation or adapter scope.
3. Classify incident severity without copying the sensitive value.
4. Preserve minimal forensic evidence with redaction.
5. Revoke or rotate affected credential through the provider.
6. Remove exposed material from current working state.
7. Assess Git history, remotes, logs, backups, and generated projections.
8. Recover from known-good canonical state or backup.
9. Validate system and affected integration.
10. Record incident decision, impact, recovery evidence, and prevention.
11. Strengthen schema, scanner, gate, workflow, or training fixture.

### Hard rules

- Do not ask Guilherme to paste secrets into chat.
- Do not print the secret during diagnosis.
- Deleting a file does not revoke a credential.
- Rewriting Git history requires a dedicated approved runbook.
- Recovery is incomplete until affected external credentials and replicas are
  addressed.

## Journey 8: New Agent Assumes Work

### Goal

Allow another agent to act correctly without Guilherme rebuilding the entire
context through conversation.

### Flow

1. Agent receives task or run ID.
2. Studio resolves objective, owner entities, repositories, authority, risks,
   and expected evidence.
3. Agent reads Constitution and only the owning domain contracts.
4. Agent inspects current Git and runtime reality.
5. Agent compares observations with the handoff and records contradictions.
6. Agent chooses the next valid action or blocks with a precise missing input.
7. Agent executes within scope, registers evidence, and updates task/run state.
8. Agent creates a compact handoff before stopping.

The detailed protocol is defined in
[Agent Execution and Handoff](./03-agent-execution-handoff.md).

## Cross-Journey System Test

The specification is coherent only if a fixture can execute:

```text
plugin implementation
→ release evidence
→ portfolio case
→ campaign
→ prospect
→ opportunity
→ engagement
→ multiple deliverables
→ payment
→ additional public evidence
```

Every arrow must resolve through an entity relation, command, state transition,
authority rule, and evidence record. Manual copying of identity or status
between domains fails the test.

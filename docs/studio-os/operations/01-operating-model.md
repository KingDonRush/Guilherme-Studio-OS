# Studio Operating Model

Status: normative operating model
Purpose: convert the specification into daily economic and production behavior

## Operating Thesis

The Studio OS is a decision and execution system, not a documentation archive.
Its daily job is to keep the shortest credible path between Guilherme's
capability and international income visible and executable.

The system therefore balances four queues:

1. **Obligations:** work, deadlines, payments, contracts, incidents.
2. **Revenue pursuit:** prospects, opportunities, proposals, applications.
3. **Evidence production:** products, releases, demos, cases, portfolio.
4. **System health:** repositories, backups, security, process repairs.

Queue 4 supports the first three. It must not consume the operation by default.

## Economic Priority Model

Candidate actions are scored from explicit factors:

```text
priority =
  obligation urgency
  + revenue proximity
  + expected strategic evidence
  + dependency unlock value
  + risk reduction
  + deadline pressure
  - estimated effort
  - uncertainty cost
  - context-switch cost
```

The implementation may use weighted normalized values, but must expose the
factors and allow Guilherme to override the recommendation.

Hard obligations are not demoted by low expected revenue. Forecast value is
never presented as confirmed revenue.

## Operating Horizons

### Today

Answers:

- What must not be missed?
- What can move money or a hiring process?
- What is blocked and by whom?
- What single evidence-producing action is worth doing?

### This week

Balances:

- delivery capacity;
- proposals and follow-ups;
- applications;
- portfolio/product evidence;
- payment collection;
- repository and backup health.

### This month

Evaluates:

- pipeline conversion;
- revenue and receivables;
- strongest and weakest market signals;
- product and case progress;
- repeated delivery failures;
- client and role segments worth pursuing.

### Quarter

Revisits:

- positioning;
- target markets and channels;
- service/product mix;
- portfolio gaps;
- operational architecture that has earned investment.

## Default Daily Loop

### 1. Inspect

```text
studio status
studio doctor --summary
```

Review:

- due obligations;
- awaiting confirmations;
- active work and blocked items;
- proposals, follow-ups, and applications;
- receivables;
- repository or backup warnings.

### 2. Select

Choose a bounded daily commitment:

- one primary revenue or obligation action;
- one supporting action when capacity allows;
- no hidden infrastructure project.

### 3. Execute

Create or resume a task/run with:

- objective;
- owner entity;
- repository;
- acceptance criteria;
- evidence;
- risk and authority.

### 4. Verify

Validate the actual entrypoint and record evidence.

### 5. Reconcile

Update:

- task and entity states;
- next action;
- communication;
- economic state;
- repository health;
- handoff.

### 6. Close the loop

Ask:

- Did the action move revenue, obligation, or evidence?
- Did reality contradict the process?
- Is the contradiction reusable enough to change a rule or test?

## Weekly Review

Required sections:

### Money

- confirmed receipts;
- issued and overdue invoices;
- proposal value;
- active engagement value;
- qualified opportunity value;
- forecast confidence.

### Delivery

- engagements by state;
- deliverables awaiting Guilherme, client, or external dependency;
- approaching deadlines;
- scope and payment risks.

### Sales

- new qualified prospects;
- outreach sent;
- replies;
- discovery;
- proposals;
- wins/losses;
- follow-ups due.

### Career

- qualified roles;
- applications submitted;
- interviews;
- follow-ups;
- evidence gaps recurring in role requirements.

### Evidence and distribution

- releases;
- case progress;
- published content;
- attributed opportunities;
- public claims lacking proof.

### System health

- repository mismatches;
- uncommitted valuable work;
- failing tests;
- stale backups;
- invalid records;
- repeated agent or visual failures.

The review outputs decisions and next actions, not only a report.

## Work Intake

Every incoming item is classified before execution:

```text
obligation
revenue opportunity
delivery work
product work
evidence work
marketing
career
incident
system improvement
idea
```

Intake determines:

- owning entity;
- lifecycle;
- priority;
- required repository;
- authority;
- evidence;
- retention.

Unclassified requests may be captured as inbox items but cannot remain there
indefinitely.

## Work Budget

System work requires a reason and budget:

- **repair:** fixes a current blocker or repeated failure;
- **enablement:** unlocks a defined revenue or delivery workflow;
- **scale:** justified by actual repeated volume;
- **exploration:** time-boxed and disposable.

Each system task declares which category applies and what event ends the
investment. “It may be useful later” is insufficient for a large implementation.

## Domain Routing

| Work | Primary owner | Required secondary checks |
|---|---|---|
| plugin/theme code | product or project | security, Git, runtime evidence |
| visual implementation | project/case | visual reality loop, human approval |
| outreach/proposal | sales | evidence, external confirmation |
| application | career | claim verification, external confirmation |
| content/publication | marketing | evidence, privacy, confirmation |
| contract/invoice/payment | finance | human authority, retention |
| repository migration | operations | backup, Git identity, recovery |
| incident | security | containment, audit, recovery |

## Communication Policy

The Studio distinguishes:

- raw communication source;
- operational summary;
- interpreted decision;
- prepared outbound action;
- executed external action.

An inbound message does not change contractual scope or lifecycle state until a
deliberate mutation interprets it.

Outbound communication always names:

- recipient;
- purpose;
- exact payload;
- attachments;
- owner entity;
- confirmation state.

## Decision Policy

Record a durable decision when the choice:

- affects several workflows;
- changes public positioning;
- creates migration cost;
- changes a data contract;
- changes repository ownership;
- accepts material risk;
- prevents future silent reopening.

Do not create decisions for ordinary code style or ephemeral task ordering.

## Documentation Policy

Documentation classes:

- normative specification;
- operating procedure;
- entity record;
- decision;
- evidence;
- handoff;
- historical context.

Every document declares its class or authority. Historical notes cannot silently
override current rules.

## Automation Policy

Automation is accepted when:

- inputs and outputs are defined;
- authority is narrow;
- failures are visible;
- it is idempotent or safely reconciled;
- manual fallback exists;
- evidence is emitted;
- the automation saves repeated effort or reduces material risk.

Automation is rejected when it obscures responsibility, creates external action
without confirmation, or exists only to demonstrate technical sophistication.

## Minimum Viable Operation Before Runtime

The documentation may be used manually before the Studio CLI exists:

- use canonical templates;
- maintain IDs and lifecycles;
- record repository registry;
- use checklists for gates;
- keep a manual weekly review;
- preserve exact prepared-action confirmation.

Manual operation is a prototype of behavior, not a parallel permanent system.
Implementation should replace repeated friction rather than encode untested
ceremony.

## Operating Acceptance Criteria

- The daily view identifies one next economically meaningful action.
- Obligations cannot disappear behind scoring.
- Every active item has owner and next action.
- System work declares economic or risk justification.
- Weekly review produces decisions or tasks.
- Communication, decisions, and state transitions remain distinct.
- Automation has a visible manual fallback.

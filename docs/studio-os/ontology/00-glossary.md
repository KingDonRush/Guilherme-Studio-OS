# Studio OS Glossary

Status: normative vocabulary

## Economic Terms

### Lead

An unqualified person or organization that may become economically relevant.
Leads are disposable until evidence justifies promotion.

### Prospect

A person or organization with a recorded reason to believe a commercial
conversation may be relevant.

### Opportunity

A concrete possibility of revenue with owner, source, fit, next action, and
stage. Opportunities cover freelance sales. Job applications use their own
lifecycle because their actors and evidence differ.

### Client

An organization or person with an active or historical commercial
relationship. A prospect becomes a client only after an accepted commercial
commitment, not after a friendly conversation.

### Engagement

One paid demand, contract, retainer period, or commercial package. An
engagement may contain one or several deliverables.

`Engagement` is the canonical replacement for the ambiguous word `trampo` when
referring to the commercial unit.

### Deliverable

One independently trackable outcome promised inside an engagement, such as a
WordPress site, landing page, plugin, audit, migration, or maintenance cycle.

### Project

The operational container used to produce a deliverable or product outcome. A
project links requirements, decisions, tasks, assets, repositories,
environments, evidence, and delivery.

A project is not automatically a commercial unit.

### Product

An owned reusable offering or software asset with an independent lifecycle,
such as Simple Budget Plugin or Elementor Implementation Toolkit.

### Offer

A packaged commercial promise: target customer, problem, outcome, boundaries,
price logic, proof, and call to action.

## Career Terms

### Job Opportunity

A role at an organization that may justify an application.

### Job Application

The tracked pursuit of one role, including fit analysis, materials, submission,
follow-up, interview, outcome, and lessons.

### Recruiter Contact

A person associated with one or more job opportunities or applications.

## Production Terms

### Repository

A Git ownership boundary with independent history, status, remote, release, or
delivery value.

### Workspace

A local filesystem location where one or more repositories and runtimes may be
operated.

### WordPress Environment

A reproducible WordPress runtime linked to a project or product, including
Docker configuration, database, uploads policy, active components, and
environment metadata.

### Asset

A source or output file used by a project, product, case, campaign, or
delivery. Assets have provenance, lifecycle, classification, approval, and
distribution state.

### Evidence

An artifact that supports a claim, decision, completion state, or historical
fact. Evidence is stronger when independently inspectable or reproducible.

### Portfolio Case

A public narrative derived from real product or project evidence. It is not a
second source of truth for the work.

## Operational Terms

### Canonical Record

Human-readable data in versioned Markdown, YAML, or append-only event files
that remains authoritative without the SQLite index.

### Projection

Derived data built from canonical records for search, filtering, aggregation,
or panel display.

### Prepared Action

An exact external action payload assembled for review but not yet sent,
published, submitted, signed, or executed.

### Gate

A policy decision that returns `allow`, `warn`, `require_confirmation`, or
`block`.

### Decision

An authorized choice with rationale, alternatives, impact, reversibility, and
evidence. Decisions must not be reopened silently.

### Task

A bounded unit of work with owner, objective, state, dependencies, expected
output, evidence, and completion criteria.

### Agent Run

One traceable execution session by an AI agent, connected to context, target
entities, actions, evidence, and handoff.

### Handoff

A continuity artifact that allows another actor to proceed without
reconstructing the complete history.

## Terms To Avoid Without Qualification

- `trampo`: use engagement, deliverable, project, task, or job application.
- `site`: specify client deliverable, demo site, portfolio surface, or runtime.
- `demanda`: use opportunity before sale and engagement after commitment.
- `produto`: distinguish owned product from client deliverable.
- `done`: specify delivered, accepted, paid, published, closed, or technically
  complete.
- `context`: specify canonical records, code paths, evidence, or communication.

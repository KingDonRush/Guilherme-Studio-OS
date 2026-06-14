# Entity Map

Status: normative domain ontology

## Identity Rules

Every entity has:

- a stable lowercase ID with type prefix and sortable time component;
- a schema version;
- creation and update timestamps;
- lifecycle state when applicable;
- owner;
- classification;
- canonical path;
- relation references by ID, never duplicated embedded truth;
- archive metadata;
- extension fields under a namespaced map.

Example IDs:

```text
per_20260614_guilherme-silva
org_20260614_example-agency
opp_20260614_example-wordpress-build
eng_20260614_example-redesign
del_20260614_example-institutional-site
repo_20260614_simple-budget-plugin
case_20260614_simple-budget-plugin
```

Human-readable slugs may change. IDs do not.

## Entity Catalog

### Person

- **Purpose:** one human identity across commercial, career, and communication
  contexts.
- **Canonical:** `data/people/<person-id>.yaml`
- **Classification:** internal by default; contact fields may be confidential.
- **Relations:** organizations, communications, opportunities, applications.
- **Events:** created, updated, merged, archived.

### Organization

- **Purpose:** company, agency, studio, recruiter organization, client, or
  community.
- **Canonical:** `data/organizations/<organization-id>.yaml`
- **Relations:** people, prospects, opportunities, clients, job applications.
- **Events:** created, qualified, relationship_changed, archived.

### Prospect

- **Purpose:** qualified commercial target before a concrete revenue
  opportunity exists.
- **Canonical:** `sales/prospects/<prospect-id>/prospect.yaml`
- **Relations:** person or organization, research, communications,
  opportunities.
- **Evidence:** reason for fit and source.

### Client

- **Purpose:** commercial relationship profile.
- **Canonical:** `clients/<client-slug>/client.yaml`
- **Relations:** people, organizations, engagements, communications,
  preferences, lessons.
- **Rule:** no technical project data is owned by the client profile.

### Opportunity

- **Purpose:** one freelance revenue pursuit.
- **Canonical:** `sales/opportunities/<opportunity-id>.yaml`
- **Relations:** prospect, offer, proposal, communications, eventual
  engagement.
- **Evidence:** fit analysis, need, next action, outcome.

### JobApplication

- **Purpose:** one pursuit of one role.
- **Canonical:** `career/applications/<application-id>/application.yaml`
- **Relations:** organization, role, people, evidence bundle,
  communications, interviews.
- **Evidence:** role source, submitted materials, submission confirmation,
  outcomes.

### Engagement

- **Purpose:** one paid commercial unit.
- **Canonical:** `clients/<client>/engagements/<engagement>/engagement.yaml`
- **Relations:** client, opportunity, proposal, contract, deliverables,
  invoices, payments.
- **Evidence:** accepted scope and commercial commitment.

### Deliverable

- **Purpose:** independently planned and accepted outcome inside an engagement.
- **Canonical:** `.../deliverables/<deliverable>/deliverable.yaml`
- **Relations:** project, approvals, assets, evidence, delivery.
- **Rule:** several deliverables may share one engagement but not technical
  state.

### Project

- **Purpose:** operational production container.
- **Canonical:** near its owned deliverable or product.
- **Relations:** repositories, environments, tasks, decisions, assets,
  evidence.
- **Rule:** project state cannot imply payment state.

### Repository

- **Purpose:** registered Git boundary.
- **Canonical:** `data/registry/repositories/<repository-id>.yaml`
- **Relations:** project, product, deliverable, remote, local path.
- **Evidence:** Git root, remote, branch, health inspection.

### Product

- **Purpose:** owned reusable software or service product.
- **Canonical:** `products/<product>/product.yaml`
- **Relations:** repositories, releases, demos, cases, campaigns.

### PortfolioCase

- **Purpose:** public proof narrative.
- **Canonical:** `portfolio/cases/<case>/case.yaml`
- **Relations:** products, projects, evidence, claims, publication URLs.

### Evidence

- **Purpose:** prove claims, states, approvals, or completion.
- **Canonical:** colocated manifest or `data/evidence/` for cross-domain proof.
- **Fields:** type, subject, claim, source, path or URL, captured_at,
  reliability, classification, checksum.

### Campaign

- **Purpose:** coordinated distribution toward a defined audience and goal.
- **Canonical:** `marketing/campaigns/<campaign>/campaign.yaml`
- **Relations:** content, cases, offers, channels, results.

### ContentItem

- **Purpose:** one draft or published communication artifact.
- **Canonical:** `marketing/content/<content-id>/content.yaml`
- **Relations:** campaign, evidence, channel, prepared action, publication.

### Proposal

- **Purpose:** exact commercial offer made for an opportunity.
- **Canonical:** under the opportunity and linked into engagement if accepted.
- **Evidence:** approved version, delivery, response.

### Contract

- **Purpose:** binding obligations.
- **Canonical:** client engagement confidential records.
- **Evidence:** signed or accepted document and effective dates.

### Invoice

- **Purpose:** receivable request.
- **Canonical:** engagement finance records.
- **Relations:** deliverables, payments, contract.

### Payment

- **Purpose:** actual financial settlement record.
- **Canonical:** engagement finance records.
- **Evidence:** provider receipt or confirmed transaction reference.

### Task

- **Purpose:** executable operational unit.
- **Canonical:** colocated with the owning project or operating domain.
- **Relations:** parent objective, dependencies, evidence, agent runs.

### Decision

- **Purpose:** prevent silent reopening of material choices.
- **Canonical:** domain decision log.
- **Fields:** context, decision, alternatives, rationale, authority, evidence,
  reversibility, consequences.

### Asset

- **Purpose:** governed source or output file.
- **Canonical:** asset manifest nearest the owner.
- **Relations:** provenance, approval, transformations, distributions.

### Communication

- **Purpose:** record relevant inbound or outbound interaction.
- **Canonical:** communication log linked by ID.
- **Rule:** avoid storing unnecessary message bodies; references and summaries
  are preferred when the channel remains authoritative.

### AgentRun

- **Purpose:** trace AI execution and continuity.
- **Canonical:** `operations/agent-runs/<date>/<run-id>.yaml`
- **Fields:** objective, entities, repositories, context, tools, actions,
  evidence, unresolved risks, handoff.

## Relationship Invariants

- An opportunity may create at most one engagement directly; renegotiated work
  creates a new engagement or explicit amendment.
- An engagement belongs to exactly one client.
- A deliverable belongs to exactly one engagement.
- A project belongs to one primary deliverable or product but may reference
  shared repositories.
- A repository has one ownership record even when several projects consume it.
- A case must reference at least one evidence source.
- A public claim must reference evidence.
- A payment must reference an invoice or a documented exception.
- An agent run must reference its target entities and repositories.

# Real Data Intake Packet

Status: operational intake template
Purpose: collect real business data without fabricating records to satisfy PRD
coverage.

## Rule

The Studio OS may report missing canonical data. It must not invent clients,
applications, finances, campaigns, communications, or evidence to make a view
look complete.

Use `studio coverage --json` to identify missing PRD data. Intake work creates
canonical records only from Guilherme-provided facts, files, URLs, screenshots,
repository state, or explicit decisions.

## Intake Order

1. **Identity and repositories**
   - people, organizations, owned repositories, environments.
2. **Products and proof**
   - products, releases, demos, repository health, evidence.
3. **Portfolio and distribution**
   - cases, assets, campaigns, content, public claims.
4. **Commercial pipeline**
   - prospects, opportunities, proposals, communications, clients.
5. **Delivery and obligations**
   - engagements, deliverables, projects, contracts, invoices, payments.
6. **Career pipeline**
   - organizations, job applications, role evidence, follow-ups.
7. **Knowledge and handoff**
   - decisions, tasks, agent runs, unresolved facts, next valid actions.

## Minimum Fields by Intake Block

### Prospect or Opportunity

- source URL or observed source;
- organization/person if known;
- reason for contact;
- expected need;
- confidence and freshness;
- next action and follow-up date;
- evidence or note explaining why this record exists.

### Client or Engagement

- client identity;
- scope basis;
- exclusions;
- commercial value if confirmed;
- repository/environment links;
- deliverables;
- acceptance criteria;
- evidence required before completion.

### Product or Portfolio Case

- product or project owner;
- implemented capability;
- demonstrated scenario;
- source evidence;
- public claims allowed;
- assets/screenshots;
- current publication status.

### Job Application

- source URL;
- organization;
- role title;
- location/timezone if known;
- required signals;
- matching evidence;
- submission status;
- follow-up window.

### Finance

- linked proposal/contract/engagement;
- expected amount and currency;
- invoice due date;
- payment status;
- provider or receipt evidence;
- unresolved obligations.

## Output

Each intake pass must produce:

- created or updated entity IDs;
- evidence IDs;
- unresolved facts;
- next action;
- verification command output;
- `studio coverage --json` before and after summary.

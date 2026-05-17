# Research And Analysis Protocol

## Separation Rule

Research collects evidence. Analysis turns evidence into decisions.

Do not mix them in one paragraph.

## Research Entry Contract

Every meaningful research item should answer:

- what question was researched;
- why it mattered;
- where the evidence came from;
- when it was checked;
- what was found;
- what can be reused;
- what risk remains;
- whether human validation is required;
- how this changes the plan.

Use:

- `.ai/templates/operational-planning/research-entry.template.json`

## What To Research

Research when the plan references facts that can change:

- WordPress versions;
- Elementor versions and APIs;
- plugin compatibility;
- framework versions;
- libraries;
- SDKs;
- APIs;
- official docs;
- open-source packages;
- builder limitations;
- browser support;
- deployment targets;
- security requirements;
- pricing or usage limits.

## Reuse-Before-Build Rule

Before proposing manual implementation, ask:

1. Is there a native platform feature?
2. Is there a stable official API?
3. Is there a mature plugin/library?
4. Is there a small adapter pattern instead of a full custom system?
5. Can the project reuse existing markup, data, templates, or builder controls?
6. Does reuse introduce unacceptable dependency or performance risk?

## Research Budget Rule

Each plan must state research budget:

- `none`: no volatile dependency;
- `light`: 1-3 targeted checks;
- `standard`: official docs plus 1-2 alternatives;
- `deep`: version matrix, compatibility, alternatives, risks, and evidence log.

Do not keep researching after the budget is spent unless the task is marked
`requires_human_validation: true`.

## Final Analysis Contract

After research, run analysis through these lenses:

- complexity: task size, vague subtasks, missing dependencies;
- encaixe: whether the plan matches the user's recognized direction;
- execution: whether another AI can execute without rebriefing;
- technical: whether decisions are justified and reuse was considered;
- scope: whether budgets and subplans prevent expansion;
- handoff: whether context, boundaries, and first action are clear.

Analysis must output:

- decisions made;
- plan changes made;
- risks accepted;
- risks deferred;
- human validation required;
- readiness status.

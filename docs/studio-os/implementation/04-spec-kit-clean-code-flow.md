# Spec Kit Clean Code Flow

Status: normative implementation workflow
Source: `Playbook Operacional de Clean Code.pdf`, read from
`/home/kingdonrush/Downloads/Playbook Operacional de Clean Code.pdf` on
2026-06-26 and transcribed in full at
[Playbook Operacional de Clean Code](./playbooks/playbook-operacional-clean-code.md).

## Purpose

This document adapts the full Clean Code playbook into Studio OS Spec Kit work.
The integral playbook remains available as the reference source. This flow does
not turn style preference into law. It turns maintainability, clarity, behavior
preservation, risk, exceptions and review into explicit Spec Kit questions.

Every material code-related feature that uses a `spec.md`, `plan.md` and
`tasks.md` flow must apply this lens proportionally to risk.

## Priority Order

When criteria conflict, use this order:

1. Correct behavior and data integrity.
2. Security and data protection.
3. Operational predictability.
4. Clarity and diagnosis.
5. Changeability.
6. Testability.
7. Consistency.
8. Reuse.
9. Elegance.
10. Personal preference.

Preference cannot override a measurable risk, cost or behavior concern.

## Orientation Classes

Spec Kit plans should classify each clean-code point as one of:

- **Principle**: apply by default; violating it needs justification.
- **Heuristic**: apply when local evidence shows it reduces risk or cost.
- **Contextual decision**: record why the domain, risk, scale, time or
  constraint changes the answer.
- **Preference**: follow local convention and do not block work with it.

## Spec Stage

The product spec must define behavior before implementation shape.

For code-bearing features, `spec.md` must make these explicit:

- the user or system problem;
- expected behavior change;
- behavior that must remain unchanged;
- constraints and non-goals;
- observable acceptance criteria;
- failure behavior where relevant;
- security, privacy, data and operational risks when material.

Do not choose a new abstraction, layer, dependency or framework in `spec.md`
unless it is itself a user-visible requirement or a hard constraint.

## Plan Stage

`plan.md` must include a concise Clean Code Lens for material implementation:

```text
Clean Code Lens
- Intention: what problem is this code change solving?
- Behavior contract: what changes, and what must not change?
- Responsibility boundary: which module owns the rule?
- Complexity budget: which paths, states or concepts can be removed or avoided?
- Dependency policy: what new dependency, if any, is justified?
- Error behavior: how do expected failures behave?
- Testability: what evidence proves behavior and catches regressions?
- Operational diagnosis: how will a future agent or human understand failure?
- Exception/debt: what rule is being bent, why, and when is it revisited?
```

Small, reversible changes may answer these in one or two lines. Shared,
security-sensitive, public, data-bearing or architecture-moving changes need
concrete answers.

## Task Stage

`tasks.md` must turn the lens into executable steps:

- characterize current behavior before risky refactors;
- keep changes small, reviewable and reversible;
- separate mechanical movement from behavior changes when possible;
- protect architecture boundaries and dependency direction;
- add verification proportional to risk;
- record exceptions, temporary compatibility and debt when relevant;
- include a stop condition when refactoring can expand indefinitely.

Tasks should not reward splitting files or adding layers by default. A split is
valid when it reduces an observed cost: fewer paths, clearer owner, smaller
contract, better isolation, more stable tests, easier diagnosis or lower change
risk.

## Review Gate

Before accepting a material code change, review in this order:

1. Intent and context: problem, changed behavior, unchanged behavior,
   constraints, risk and validation.
2. Clarity: names, flow, contracts, implicit decisions, effects and edge cases.
3. Responsibility: whether the rule lives at the owning boundary.
4. Complexity: paths, conditions, states, nesting, sequences and exceptions.
5. Dependencies: new dependencies, direction, transitives, shared state and
   external failure modes.
6. Error handling: propagation, context preservation, recovery, compensation,
   observability and sensitive data protection.
7. Testability: behavior coverage, relevant scenarios, stable tests and risk
   alignment.
8. Architecture impact: boundaries, contracts, compatibility, operational
   impact and precedent.
9. Maintenance cost: diagnosis, future change reach, coordination,
   specialized knowledge and reversibility.
10. Observation priority: blocker, important, improvement, preference or
    automation candidate.

Code review comments must name the impact, not just the taste violation.

## Refactor Gate

A refactor is justified by observed cost, not by "ugly code".

Before refactoring, record:

- the concrete problem and impact;
- current intended behavior;
- accidental behavior if known;
- consumers and edge cases;
- risk, reach, observability and reversibility;
- what will not change;
- what improvement is sufficient.

A rewrite needs stronger proof:

- bounded problem;
- characterized current behavior;
- migration strategy;
- compatibility decision;
- equivalence criteria;
- rollback or recovery path;
- observable milestones;
- objective stop condition for the old path.

## Acceptance Checklist

A change is acceptable when applicable items are true or explicitly marked not
material:

- intention is clear;
- expected behavior is defined;
- complexity is proportional to the problem;
- responsibilities are delimited;
- dependencies are necessary and explicit;
- relevant architecture boundaries are preserved;
- side effects are visible and controlled;
- failures are handled or propagated predictably;
- behavior can be validated;
- tests or checks are proportional to risk;
- no unnecessary coupling was added;
- shared rules were not duplicated accidentally;
- new abstractions have concrete need;
- operational diagnosis is possible;
- future change cost is acceptable;
- exceptions are justified;
- created debt is recorded;
- scope contains no unrelated changes without justification;
- change can be reverted or has recovery;
- no blocker remains open.

## Exception Record

Record an exception only when it has relevant impact or creates precedent.

Use this shape:

```yaml
decision:
orientation_excepted:
context:
accepted_risk:
mitigation:
scope:
review_trigger:
owner:
```

Do not create exception records for trivial, local and reversible choices.

## Anti-Dogma Rules

Do not:

- enforce universal line-count limits;
- split code to satisfy numeric targets;
- add abstractions because a pattern is familiar;
- treat all duplication as a defect;
- treat indirection as architecture;
- block work on preference;
- use "Clean Code" as an argument without naming risk, cost or behavior;
- refactor stable areas without observed benefit;
- evaluate quality by file count, function size, number of abstractions,
  isolated coverage, comment count or generic complexity score.

Track real trends instead:

- time to understand changes;
- regression frequency;
- average change reach;
- test instability;
- diagnosis time;
- incidents from unpredictable behavior;
- repeated review comments;
- architectural exception frequency;
- areas that create fear or dependence on one person;
- debt that repeatedly blocks delivery.

## Final Complexity Question

Before adding a new structure, abstraction, layer, dependency or pattern,
answer:

1. What concrete problem does it solve?
2. What risk does it reduce?
3. What permanent cost does it create?
4. Is there a more direct solution?
5. Does the need already exist, or is it only predicted?
6. How will we know the decision was correct?
7. How can the decision be reversed?

When the answers are unclear, defer the complexity.

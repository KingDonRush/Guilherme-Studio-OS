# Validation And Handoff

## Validation Rule

Validation must match the project type.

Examples:

- visual frame implementation: screenshot comparison, responsive viewports,
  console check, frame-drift notes;
- WordPress/Elementor: plugin activation, WP-CLI, editor check, frontend check,
  browser console, Elementor-specific behavior;
- backend/API: unit tests, integration tests, contract tests, logs;
- automation: dry run, retry behavior, failure path, monitoring evidence;
- strategy/research: source log, decision matrix, handoff quality check.

## Human Validation Gates

Require human validation when:

- the visual direction is not approved;
- a subplan crosses its scope boundary;
- research contradicts the user's assumption;
- a dependency introduces meaningful cost or lock-in;
- a task needs credentials, production access, or irreversible action;
- the plan changes public positioning or portfolio narrative.

## Acceptance Criteria Rule

Acceptance criteria must be observable.

Weak:

```text
Improve the admin UI.
```

Strong:

```text
The Filters admin screen matches the approved frame at 1440px and 390px, has no
horizontal overflow, has no console errors, and the inspector state changes are
captured in screenshots.
```

## Handoff Contract

Every handoff must include:

- role of the next AI;
- mission;
- context to preserve;
- what not to rethink;
- source files and templates used;
- current status;
- next concrete action;
- validation gaps;
- human decisions pending;
- prompt the next AI can use.

## Final Readiness Check

Before finalizing a plan, answer:

1. Can another AI identify the correct preset?
2. Can another AI execute the first three tasks without asking the user again?
3. Are research facts separate from analysis decisions?
4. Are subplans bounded?
5. Are budgets acting as stop conditions?
6. Are acceptance criteria testable?
7. Is the legacy plan integrated without controlling the new structure?
8. Does the handoff say what not to rethink?

# Roadmap

## V0: Pragmatic Foundation

Goal: prove the core idea without creating an atom engine or DSL.

Scope:

1. core with basic schemas;
2. CLI with `inspect`;
3. CLI with `init --non-destructive`;
4. CLI with `validate`;
5. CLI with `plan create`;
6. CLI with `research brief`;
7. MCP exposing essential resources, prompts, and tools;
8. `.agentic-ops/` layer;
9. basic presets;
10. basic `research_packet`;
11. basic task schema;
12. basic handoff.

Out of scope:

- atom engine;
- complex DSL;
- broad automatic execution;
- automatic `AGENTS.md` edits;
- advanced multi-agent orchestration;
- fully autonomous planner;
- deep CI/CD integration;
- visual UI.

Success:

The AI can plan without drifting by using a reusable, non-destructive,
auditable external layer.

## V1: Operational Depth

Adds:

- phases;
- subtasks;
- Matrioshka subplans;
- tests and subtests;
- multiple analysis report types;
- snapshots;
- diff;
- export;
- more presets;
- stricter validations;
- fuller handoff.

V1 proves the system can handle complex planning without becoming a huge prompt.

## V2: Ecosystem And Execution Assistance

Adds:

- remote repository integrations;
- external tool adapters;
- CI integration;
- optional visual panel;
- assisted task execution;
- drift metrics;
- readiness score;
- decision history;
- optional patch templates;
- documentation system integrations.

V2 should only start after V1 proves the contract model is useful.

## Anti-Goals

Agentic Ops must not:

- become loose prompts;
- require copying long instructions into every repository;
- overwrite user files by default;
- turn everything into a generic task;
- fake research;
- choose technology without justification;
- create infinite subplans;
- use presets as lazy defaults;
- make briefing performative;
- push methodology burden onto the user;
- confuse planning with execution;
- confuse research with analysis;
- confuse handoff with summary.

## Versioning

Recommended package versioning:

- core schema changes that break artifacts require minor or major version bump;
- CLI commands should remain backwards compatible within a minor version;
- MCP prompts and resources should declare compatible core schema versions;
- `.agentic-ops/manifest.json` should record schema version.

# PRD 10: Knowledge, Memory, and Agents

## Product Job

Give humans and agents enough durable context to act correctly without loading
the entire Studio or requiring Guilherme to repeat prior reasoning.

## Capabilities

### Knowledge placement

- Route information to Constitution, PRD, decision, entity record, workflow,
  evidence, lesson, or temporary note.
- Prevent `.ai/` or any replacement brain from becoming an unclassified dump.

### Decision memory

- Record material choices with context, alternatives, authority, impact,
  reversibility, and evidence.
- Detect contradictions with active decisions.
- Require amendment rather than silent override.

### Context packs

- Assemble minimal role-specific context for a task or agent.
- Include objective, entities, repositories, constraints, decisions, evidence,
  next action, and forbidden reconsiderations.
- Exclude unrelated confidential material and secrets.

### Agent-run governance

- Register objective, actor, risk, authorized tools, target repositories,
  actions, evidence, and handoff.
- Track whether execution is oriented, authorized, verifying, or blocked.
- Prevent an agent from claiming closure with unresolved required processes.

### Task and handoff

- Connect tasks to economic objectives, entity owner, dependencies, expected
  output, evidence, and budget.
- Produce a handoff with current state, next action, gaps, and what not to
  rethink.

### Learning and policy promotion

- Detect recurring failure classes.
- Propose a workflow, schema, test, or constitutional amendment.
- Keep one-off symptoms local.

## Canonical Structure

```text
operations/
├── decisions/
├── tasks/
├── agent-runs/
├── handoffs/
├── lessons/
└── context-packs/

docs/studio-os/
└── normative specifications
```

Generated context packs are disposable unless attached to an important run or
decision.

## Public Interfaces

```text
routeKnowledge()
recordDecision()
amendDecision()
buildContextPack()
startAgentRun()
authorizeAgentRun()
recordAgentAction()
completeVerification()
createHandoff()
proposeLearningPromotion()
```

## Dependencies

- Depends on all entity registries, authority, evidence, tasks, decisions, and
  classification.
- Does not own domain truth.

## Acceptance Criteria

- A new agent can execute the next task without broad rebrief.
- Context packs remain below configured scope and classification budgets.
- Contradictory active decisions are detected.
- Handoffs name unresolved facts and forbidden reopening.
- Repeated failures can be traced to a promoted system correction.

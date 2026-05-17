# Schemas And Contracts

This document describes the planned data contracts. Exact JSON Schema files
should live in `packages/core/schemas/` when implementation begins.

## Manifest

```json
{
  "agentic_ops_version": "0.1.0",
  "workspace_id": "",
  "initialized_at": "",
  "mode": "new | overlay | adopted",
  "detected_agent_files": [],
  "detected_stack": [],
  "active_preset": "",
  "artifacts": [],
  "compatibility_notes": [],
  "safety_notes": []
}
```

## Workspace Inspection

```json
{
  "root": "",
  "project_type": "",
  "detected_stack": [],
  "package_managers": [],
  "frameworks": [],
  "agentic_files": [],
  "docs": [],
  "has_agentic_ops": false,
  "overwrite_risks": [],
  "recommended_mode": "new | overlay | adopted",
  "notes": []
}
```

## Plan

```json
{
  "id": "",
  "objective": "",
  "scope": [],
  "out_of_scope": [],
  "preset": "",
  "briefing": {},
  "phases": [],
  "tasks": [],
  "research_packets": [],
  "decisions": [],
  "budgets": {},
  "tests": [],
  "analysis_reports": [],
  "validation_results": [],
  "handoff": {}
}
```

## Phase

```json
{
  "id": "",
  "title": "",
  "purpose": "",
  "entry_condition": "",
  "exit_condition": "",
  "required_outputs": [],
  "tasks": [],
  "acceptance_criteria": [],
  "validation_required": []
}
```

## Task

```json
{
  "id": "",
  "title": "",
  "description": "",
  "objective": "",
  "priority": "critical | high | medium | low",
  "complexity": "simple | moderate | complex | very_complex",
  "status": "pending | in_progress | blocked | done | deferred",
  "phase_id": "",
  "depends_on": [],
  "blocks": [],
  "inputs_required": [],
  "expected_outputs": [],
  "acceptance_criteria": [],
  "budgets": {},
  "risks": [],
  "research_required": false,
  "tests": [],
  "requires_human_validation": false,
  "subtasks": [],
  "subplans": []
}
```

## Research Packet

```json
{
  "id": "",
  "question": "",
  "reason": "",
  "decision_dependency": "",
  "allowed_scope": [],
  "forbidden_scope": [],
  "desired_sources": [],
  "update_policy": "",
  "reliability_signals": [],
  "alternatives_to_compare": [],
  "wheel_reinvention_risk": "",
  "plan_impact": "",
  "task_impact": "",
  "recommendation": "",
  "remaining_uncertainties": [],
  "validation_required": []
}
```

## Subplan

```json
{
  "id": "",
  "parent_task_id": "",
  "title": "",
  "purpose": "",
  "scope_boundary": "",
  "entry_condition": "",
  "exit_condition": "",
  "max_depth": 1,
  "allowed_expansion": [],
  "forbidden_expansion": [],
  "budgets": {},
  "tasks": [],
  "tests": [],
  "completion_criteria": [],
  "handoff_notes": ""
}
```

## Test

```json
{
  "id": "",
  "type": "acceptance_test | visual_test | functional_test | integration_test | regression_test | accessibility_test | performance_test | security_test | handoff_test | research_validation_test",
  "target": "",
  "objective": "",
  "preconditions": [],
  "steps": [],
  "expected_result": "",
  "pass_criteria": [],
  "evidence_required": [],
  "status": "pending | passed | failed | blocked | skipped",
  "severity": "critical | high | medium | low",
  "depends_on": [],
  "subtests": []
}
```

## Handoff Packet

```json
{
  "id": "",
  "current_state": "",
  "objective": "",
  "preset_used": "",
  "decisions_made": [],
  "pending_decisions": [],
  "plan_structure": {},
  "completed_tasks": [],
  "pending_tasks": [],
  "risks": [],
  "research_packets": [],
  "validations": [],
  "tests": [],
  "next_steps": [],
  "do_not_reopen": [],
  "how_to_continue_briefing_user": "",
  "first_recommended_cli_command": "",
  "first_recommended_mcp_prompt": ""
}
```

## Validation Result

```json
{
  "id": "",
  "target_type": "",
  "target_id": "",
  "status": "valid | invalid | warning",
  "errors": [],
  "warnings": [],
  "recommendations": [],
  "requires_human_validation": false
}
```

import { createStudioCommand, operatorActor } from "../authority.js";
import { executeStudioCommand } from "../command-runtime.js";
import { createStudioContext } from "../context.js";
import { PreparedActionService } from "../prepared-actions/service.js";
import { recordString } from "../record-utils.js";
import { verifyWorkflowCoverage } from "./coverage.js";
import { WORKFLOW_EXECUTORS } from "./executors/index.js";
import { WORKFLOW_REQUIREMENTS } from "./requirements.js";
import { createWorkflowFixtureRoot } from "./root.js";
import type { WorkflowExecutionReport, WorkflowExecutionStep } from "./types.js";

export async function executeWorkflowFixtures(input: { workflowId?: string } = {}): Promise<{
  ok: boolean;
  mode: "executed-fixtures";
  workflows: WorkflowExecutionReport[];
}> {
  const selected = input.workflowId
    ? WORKFLOW_REQUIREMENTS.filter((workflow) => workflow.id === input.workflowId)
    : WORKFLOW_REQUIREMENTS;
  if (selected.length === 0) {
    throw new Error(`Unknown workflow fixture: ${input.workflowId}`);
  }
  const workflows: WorkflowExecutionReport[] = [];
  for (const workflow of selected) {
    workflows.push(await executeSingleWorkflowFixture(workflow.id));
  }
  return {
    ok: workflows.every((workflow) => workflow.ok),
    mode: "executed-fixtures",
    workflows,
  };
}

async function executeSingleWorkflowFixture(workflowId: string): Promise<WorkflowExecutionReport> {
  const root = await createWorkflowFixtureRoot(workflowId);
  const context = await createStudioContext(root);
  const steps: WorkflowExecutionStep[] = [];
  const run = async (command: string, payload: Record<string, unknown>, targetId?: string) => {
    const result = await executeStudioCommand(
      context,
      createStudioCommand(context, {
        command,
        actor: operatorActor(context.config.operator_id),
        payload,
        ...(targetId ? { targetId } : {}),
        idempotencyKey: `${workflowId}:${steps.length + 1}:${command}`,
      }),
    );
    const resultObject =
      result.result && typeof result.result === "object"
        ? (result.result as Record<string, unknown>)
        : {};
    const entityId = recordString(resultObject, "entity_id");
    const preparedActionId = recordString(resultObject, "id");
    steps.push({
      command,
      status: result.status,
      ...(entityId ? { entity_id: entityId } : {}),
      ...(preparedActionId ? { prepared_action_id: preparedActionId } : {}),
    });
    if (!["ok", "warning", "confirmation_required"].includes(result.status)) {
      throw new Error(
        `Workflow fixture ${workflowId} command ${command} failed: ${result.error?.message}`,
      );
    }
    return result;
  };
  const executor = Reflect.get(WORKFLOW_EXECUTORS, workflowId);
  if (!executor) {
    throw new Error(`Workflow fixture executor is missing: ${workflowId}`);
  }
  await executor(run);
  const entities = (await context.entities.scan()).map((file) => file.entity);
  const coverage = verifyWorkflowCoverage(entities).find((entry) => entry.id === workflowId);
  if (!coverage) {
    throw new Error(`Workflow coverage not found after execution: ${workflowId}`);
  }
  const preparedActions = await new PreparedActionService(context).list();
  return {
    id: coverage.id,
    name: coverage.name,
    ok: coverage.ok && steps.every((step) => ["ok", "warning"].includes(step.status)),
    root,
    steps,
    entity_count: entities.length,
    event_count: (await context.events.list()).length,
    prepared_action_count: preparedActions.length,
    coverage,
  };
}

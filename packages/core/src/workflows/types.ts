import type { EntityKind, ResultEnvelope } from "@guilherme-studio/schemas";

export interface WorkflowRequirement {
  id: string;
  name: string;
  requiredKinds: EntityKind[];
  requiredGates: string[];
  requiredEvidence: string[];
}

export interface WorkflowVerification {
  id: string;
  name: string;
  ok: boolean;
  missingKinds: EntityKind[];
  requiredGates: string[];
  requiredEvidence: string[];
}

export interface WorkflowExecutionStep {
  command: string;
  status: ResultEnvelope["status"];
  entity_id?: string;
  prepared_action_id?: string;
}

export interface WorkflowExecutionReport {
  id: string;
  name: string;
  ok: boolean;
  root: string;
  steps: WorkflowExecutionStep[];
  entity_count: number;
  event_count: number;
  prepared_action_count: number;
  coverage: WorkflowVerification;
}

export type WorkflowRunCommand = (
  command: string,
  payload: Record<string, unknown>,
  targetId?: string,
) => Promise<ResultEnvelope>;

export type WorkflowRunner = (run: WorkflowRunCommand) => Promise<void>;

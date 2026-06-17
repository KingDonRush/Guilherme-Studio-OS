import type { StudioEntity } from "@guilherme-studio/schemas";
import type { StudioContext } from "../context.js";
import {
  AgentHarnessService,
  type AuthorizeAgentRunInput,
  type BuildContextPackInput,
  type CloseAgentRunInput,
  type CompleteVerificationInput,
  type CreateRunHandoffInput,
  type RecordAgentActionInput,
  type RecordAgentEvidenceInput,
  type RecordObservationInput,
  type StartAgentRunInput,
} from "../harness/index.js";
import { DomainServiceBase } from "./base.js";

export class AgentsDomainService extends DomainServiceBase {
  readonly harness: AgentHarnessService;

  constructor(context: StudioContext) {
    super(context);
    this.harness = new AgentHarnessService(this.context);
  }

  startAgentRun(input: StartAgentRunInput): Promise<StudioEntity> {
    return this.harness.startAgentRun(input);
  }

  buildContextPack(input: BuildContextPackInput): Promise<StudioEntity> {
    return this.harness.buildContextPack(input);
  }

  authorizeAgentRun(input: AuthorizeAgentRunInput): Promise<StudioEntity> {
    return this.harness.authorizeAgentRun(input);
  }

  recordObservation(input: RecordObservationInput): Promise<StudioEntity> {
    return this.harness.recordObservation(input);
  }

  recordAgentAction(input: RecordAgentActionInput): Promise<StudioEntity> {
    return this.harness.recordAgentAction(input);
  }

  recordAgentEvidence(input: RecordAgentEvidenceInput): Promise<StudioEntity> {
    return this.harness.recordAgentEvidence(input);
  }

  completeVerification(input: CompleteVerificationInput): Promise<StudioEntity> {
    return this.harness.completeVerification(input);
  }

  createRunHandoff(input: CreateRunHandoffInput): Promise<StudioEntity> {
    return this.harness.createRunHandoff(input);
  }

  closeAgentRun(input: CloseAgentRunInput): Promise<StudioEntity> {
    return this.harness.closeAgentRun(input);
  }

  async createHandoff(input: {
    taskId: string;
    title: string;
    objective: string;
    summary: string;
    repositoryIds?: string[];
  }): Promise<StudioEntity> {
    return this.harness.createLegacyHandoff(input);
  }
}

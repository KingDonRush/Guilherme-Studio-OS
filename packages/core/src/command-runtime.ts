import {
  type Capability,
  type Classification,
  type CommandEnvelope,
  createResultEnvelope,
  type EntityKind,
  type LifecycleState,
  type ResultEnvelope,
} from "@guilherme-studio/schemas";
import { StudioCommandService } from "./command-service.js";
import type { StudioContext } from "./index.js";

interface CommandRequirement {
  capability: Capability;
  classification?: Classification;
}

const REQUIREMENTS: Record<string, CommandRequirement> = {
  "entity.create": { capability: "entity.write" },
  "entity.transition": { capability: "entity.transition" },
  "prospect.qualify": { capability: "entity.transition" },
  "communication.prepare": { capability: "action.prepare" },
  "proposal.prepare": { capability: "entity.write" },
  "engagement.create-from-opportunity": { capability: "entity.write" },
  "evidence.register": { capability: "evidence.register" },
  "release.prepare": { capability: "entity.write" },
  "application.prepare": { capability: "entity.write" },
  "payment.reconcile": { capability: "finance.reconcile", classification: "confidential" },
  "case.create-from-evidence": { capability: "entity.write" },
  "project.register-repo": { capability: "repository.mutate" },
  "handoff.create": { capability: "entity.write" },
  "action.prepare": { capability: "action.prepare" },
  "action.confirm": { capability: "action.confirm" },
  "action.reconcile": { capability: "action.reconcile" },
};

function stringValue(payload: Record<string, unknown>, key: string): string {
  const value = payloadValue(payload, key);
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${key} is required`);
  }
  return value;
}

function optionalString(payload: Record<string, unknown>, key: string): string | undefined {
  const value = payloadValue(payload, key);
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function numberValue(payload: Record<string, unknown>, key: string): number {
  const value = payloadValue(payload, key);
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${key} is required`);
  }
  return value;
}

function payloadValue(payload: Record<string, unknown>, key: string): unknown {
  return payload[key];
}

export async function executeStudioCommand(
  context: StudioContext,
  command: CommandEnvelope,
): Promise<ResultEnvelope> {
  const requirement = REQUIREMENTS[command.command];
  if (!requirement) {
    return createResultEnvelope({
      requestId: command.request_id,
      status: "error",
      error: {
        code: "unknown_command",
        message: `Unknown Studio command: ${command.command}`,
        details: {},
      },
    });
  }

  return new StudioCommandService(context).execute(command, requirement, async () => {
    if (command.dry_run) {
      return createResultEnvelope({
        requestId: command.request_id,
        result: {
          dry_run: true,
          command: command.command,
          target_id: command.target_id ?? null,
          payload: command.payload,
        },
      });
    }

    const { DomainCommandService, EntityService, entityMutationResult, PreparedActionService } =
      await import("./index.js");
    const entities = new EntityService(context);
    const domains = new DomainCommandService(context);
    const actions = new PreparedActionService(context);
    const payload = command.payload;

    switch (command.command) {
      case "entity.create": {
        const summary = optionalString(payload, "summary");
        const entity = await entities.create({
          kind: stringValue(payload, "kind") as EntityKind,
          title: stringValue(payload, "title"),
          ...(summary ? { summary } : {}),
          classification:
            (optionalString(payload, "classification") as Classification | undefined) ?? "internal",
        });
        return entityMutationResult(command.command, entity);
      }
      case "entity.transition": {
        const entity = await entities.transition(
          command.target_id ?? stringValue(payload, "id"),
          stringValue(payload, "status") as LifecycleState,
        );
        return entityMutationResult(command.command, entity);
      }
      case "prospect.qualify": {
        const entity = await domains.qualifyProspect(
          command.target_id ?? stringValue(payload, "prospect_id"),
          {
            rationale: stringValue(payload, "rationale"),
            score: numberValue(payload, "score"),
            qualified: payloadValue(payload, "qualified") !== false,
          },
        );
        return entityMutationResult(command.command, entity);
      }
      case "communication.prepare": {
        const action = await domains.prepareCommunication({
          subjectId: stringValue(payload, "subject_id"),
          channel: stringValue(payload, "channel"),
          message: stringValue(payload, "message"),
        });
        return createResultEnvelope({ requestId: command.request_id, result: action });
      }
      case "proposal.prepare": {
        const entity = await domains.prepareProposal(
          stringValue(payload, "opportunity_id"),
          optionalString(payload, "title"),
        );
        return entityMutationResult(command.command, entity);
      }
      case "engagement.create-from-opportunity": {
        const entity = await domains.createEngagementFromOpportunity(
          stringValue(payload, "opportunity_id"),
          optionalString(payload, "title"),
        );
        return entityMutationResult(command.command, entity);
      }
      case "evidence.register": {
        const subjectId = optionalString(payload, "subject_id");
        const evidencePath = optionalString(payload, "path");
        const url = optionalString(payload, "url");
        const evidenceCommand = optionalString(payload, "command");
        const checksum = optionalString(payload, "checksum");
        const entity = await domains.registerEvidence({
          title: stringValue(payload, "title"),
          evidenceType: stringValue(payload, "evidence_type") as
            | "file"
            | "url"
            | "command"
            | "screenshot"
            | "backup"
            | "decision"
            | "manual",
          ...(subjectId ? { subjectId } : {}),
          ...(evidencePath ? { path: evidencePath } : {}),
          ...(url ? { url } : {}),
          ...(evidenceCommand ? { command: evidenceCommand } : {}),
          ...(checksum ? { checksum } : {}),
        });
        return entityMutationResult(command.command, entity);
      }
      case "release.prepare": {
        const entity = await domains.prepareRelease(
          stringValue(payload, "product_id"),
          stringValue(payload, "version"),
        );
        return entityMutationResult(command.command, entity);
      }
      case "application.prepare": {
        const organizationId = optionalString(payload, "organization_id");
        const entity = await domains.prepareApplication({
          title: stringValue(payload, "title"),
          sourceUrl: stringValue(payload, "source_url"),
          ...(organizationId ? { organizationId } : {}),
        });
        return entityMutationResult(command.command, entity);
      }
      case "payment.reconcile": {
        const entity = await domains.reconcilePayment(
          command.target_id ?? stringValue(payload, "payment_id"),
          { reference: stringValue(payload, "reference") },
        );
        return entityMutationResult(command.command, entity);
      }
      case "case.create-from-evidence": {
        const caseUrl = optionalString(payload, "case_url");
        const summary = optionalString(payload, "summary");
        const entity = await domains.createPortfolioCaseFromEvidence({
          evidenceId: stringValue(payload, "evidence_id"),
          title: stringValue(payload, "title"),
          ...(caseUrl ? { caseUrl } : {}),
          ...(summary ? { summary } : {}),
        });
        return entityMutationResult(command.command, entity);
      }
      case "project.register-repo": {
        const remotePolicy = optionalString(payload, "remote_policy");
        const branch = optionalString(payload, "branch");
        const result = await domains.registerProjectRepository({
          projectId: stringValue(payload, "project_id"),
          title: stringValue(payload, "title"),
          repositoryPath: stringValue(payload, "repository_path"),
          ...(branch ? { branch } : {}),
          ...(remotePolicy
            ? {
                remotePolicy: remotePolicy as "allowed" | "forbidden" | "no-remote-in-v1",
              }
            : {}),
        });
        return createResultEnvelope({ requestId: command.request_id, result });
      }
      case "handoff.create": {
        const repositoryIdValues = payloadValue(payload, "repository_ids");
        const repositoryIds = Array.isArray(repositoryIdValues)
          ? repositoryIdValues.filter((value): value is string => typeof value === "string")
          : [];
        const entity = await domains.createHandoff({
          taskId: stringValue(payload, "task_id"),
          title: stringValue(payload, "title"),
          objective: stringValue(payload, "objective"),
          summary: stringValue(payload, "summary"),
          repositoryIds,
        });
        return entityMutationResult(command.command, entity);
      }
      case "action.prepare": {
        const actionPayload = payloadValue(payload, "payload");
        if (!actionPayload || typeof actionPayload !== "object" || Array.isArray(actionPayload)) {
          throw new Error("payload is required");
        }
        const provider = optionalString(payload, "provider");
        const target = optionalString(payload, "target");
        const action = await actions.prepare({
          actionType: stringValue(payload, "action_type"),
          payload: actionPayload as Record<string, unknown>,
          ...(provider ? { provider } : {}),
          ...(target ? { target } : {}),
        });
        return createResultEnvelope({ requestId: command.request_id, result: action });
      }
      case "action.confirm": {
        const action = await actions.confirm(
          stringValue(payload, "action_id"),
          stringValue(payload, "payload_checksum"),
        );
        return createResultEnvelope({ requestId: command.request_id, result: action });
      }
      case "action.reconcile": {
        const result = payloadValue(payload, "result");
        if (!result || typeof result !== "object" || Array.isArray(result)) {
          throw new Error("result is required");
        }
        const action = await actions.reconcile(
          stringValue(payload, "action_id"),
          result as Record<string, unknown>,
        );
        return createResultEnvelope({ requestId: command.request_id, result: action });
      }
      default:
        throw new Error(`Unknown Studio command: ${command.command}`);
    }
  });
}

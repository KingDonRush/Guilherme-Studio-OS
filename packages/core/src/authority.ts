import {
  type Actor,
  type Capability,
  type CommandEnvelope,
  createActor,
  createCommandEnvelope,
} from "@guilherme-studio/schemas";
import type { StudioContext } from "./context.js";

const CAPABILITY_LEVEL: Record<string, number> = {
  public: 0,
  internal: 1,
  confidential: 2,
  secret: 3,
};

export class AuthorityService {
  assertCapability(actor: Actor, capability: Capability, classification = "internal"): void {
    if (actor.expires_at && Date.parse(actor.expires_at) <= Date.now()) {
      throw new Error(`Actor delegation expired: ${actor.id}`);
    }
    if (!actor.capabilities.includes(capability)) {
      throw new Error(`Actor ${actor.id} lacks capability ${capability}`);
    }
    const ceiling = CAPABILITY_LEVEL[actor.classification_ceiling] ?? -1;
    const requested = CAPABILITY_LEVEL[classification] ?? Number.POSITIVE_INFINITY;
    if (requested > ceiling) {
      throw new Error(`Actor ${actor.id} classification ceiling does not allow ${classification}`);
    }
  }
}

export function operatorActor(operatorId: string): Actor {
  return createActor({
    id: operatorId,
    type: "human",
    classification_ceiling: "confidential",
    capabilities: [
      "entity.read",
      "entity.write",
      "entity.transition",
      "evidence.register",
      "repository.inspect",
      "repository.mutate",
      "environment.inspect",
      "environment.mutate",
      "action.prepare",
      "action.confirm",
      "action.execute",
      "action.reconcile",
      "external.execute",
      "destructive.execute",
      "public.publish",
      "finance.reconcile",
    ],
  });
}

export function createStudioCommand(
  context: StudioContext,
  input: Omit<Parameters<typeof createCommandEnvelope>[0], "actor"> & { actor?: Actor },
): CommandEnvelope {
  return createCommandEnvelope({
    ...input,
    actor: input.actor ?? operatorActor(context.config.operator_id),
  });
}

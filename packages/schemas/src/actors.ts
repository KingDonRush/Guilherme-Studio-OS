import { type Actor, ActorSchema } from "./classification.js";

export function createActor(input: Partial<Actor> & Pick<Actor, "id" | "type">): Actor {
  return ActorSchema.parse({
    capabilities: [],
    classification_ceiling: "internal",
    ...input,
  });
}

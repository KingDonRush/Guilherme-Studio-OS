import { careerCommandDefinitions } from "./handlers/career.js";
import { crmCommandDefinitions } from "./handlers/crm.js";
import { deliveryCommandDefinitions } from "./handlers/delivery.js";
import { entityCommandDefinitions } from "./handlers/entity.js";
import { evidenceCommandDefinitions } from "./handlers/evidence.js";
import { financeCommandDefinitions } from "./handlers/finance.js";
import { governanceCommandDefinitions } from "./handlers/governance.js";
import { marketingCommandDefinitions } from "./handlers/marketing.js";
import { productCommandDefinitions } from "./handlers/products.js";
import { salesCommandDefinitions } from "./handlers/sales.js";
import type { StudioCommandDefinition } from "./types.js";

export const STUDIO_COMMAND_REGISTRY: Record<string, StudioCommandDefinition> = {
  ...crmCommandDefinitions,
  ...entityCommandDefinitions,
  ...salesCommandDefinitions,
  ...deliveryCommandDefinitions,
  ...evidenceCommandDefinitions,
  ...productCommandDefinitions,
  ...marketingCommandDefinitions,
  ...careerCommandDefinitions,
  ...financeCommandDefinitions,
  ...governanceCommandDefinitions,
};

export function getStudioCommandDefinition(command: string): StudioCommandDefinition | undefined {
  return Reflect.get(STUDIO_COMMAND_REGISTRY, command) as StudioCommandDefinition | undefined;
}

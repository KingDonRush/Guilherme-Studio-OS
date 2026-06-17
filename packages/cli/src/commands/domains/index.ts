import type { Command } from "commander";
import { registerBaseDomainCommands } from "./base.js";
import { registerCareerDomainCommands } from "./career.js";
import { registerCrmDomainCommands } from "./crm.js";
import { registerDeliveryDomainCommands } from "./delivery.js";
import { registerFinanceDomainCommands } from "./finance.js";
import { registerGovernanceDomainCommands } from "./governance.js";
import { registerPortfolioMarketingDomainCommands } from "./portfolio-marketing.js";
import { registerProductDomainCommands } from "./products.js";
import { registerSalesDomainCommands } from "./sales.js";

export function registerDomainCommands(program: Command): void {
  const domainCommands = registerBaseDomainCommands(program);
  registerCrmDomainCommands(program, domainCommands);
  registerSalesDomainCommands(domainCommands);
  registerDeliveryDomainCommands(domainCommands);
  registerProductDomainCommands(domainCommands);
  registerPortfolioMarketingDomainCommands(domainCommands);
  registerCareerDomainCommands(domainCommands);
  registerFinanceDomainCommands(domainCommands);
  registerGovernanceDomainCommands(program, domainCommands);
}

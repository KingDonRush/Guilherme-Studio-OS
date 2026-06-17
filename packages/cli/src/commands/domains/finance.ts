import type { Command } from "commander";
import { executeCliCommand, globalOptions } from "../../runtime.js";
import type { DomainCommandMap } from "./base.js";

export function registerFinanceDomainCommands(domainCommands: DomainCommandMap): void {
  domainCommands
    .get("contract")
    ?.command("create-from-engagement")
    .argument("<engagement-id>")
    .option("--title <title>")
    .option("--value-minor <amount>")
    .option("--currency <currency>")
    .action(async function action(this: Command, engagementId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { title?: string; valueMinor?: string; currency?: string };
      await executeCliCommand(options, "contract.create-from-engagement", {
        engagement_id: engagementId,
        ...(local.title ? { title: local.title } : {}),
        ...(local.valueMinor ? { value_minor: Number.parseInt(local.valueMinor, 10) } : {}),
        ...(local.currency ? { currency: local.currency } : {}),
      });
    });

  domainCommands
    .get("invoice")
    ?.command("create-for-contract")
    .argument("<contract-id>")
    .requiredOption("--amount-minor <amount>")
    .requiredOption("--currency <currency>")
    .option("--title <title>")
    .option("--due-at <iso-date>")
    .option("--reference <reference>")
    .action(async function action(this: Command, contractId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        amountMinor: string;
        currency: string;
        title?: string;
        dueAt?: string;
        reference?: string;
      };
      await executeCliCommand(options, "invoice.create-for-contract", {
        contract_id: contractId,
        amount_minor: Number.parseInt(local.amountMinor, 10),
        currency: local.currency,
        ...(local.title ? { title: local.title } : {}),
        ...(local.dueAt ? { due_at: local.dueAt } : {}),
        ...(local.reference ? { reference: local.reference } : {}),
      });
    });

  domainCommands
    .get("payment")
    ?.command("record-for-invoice")
    .argument("<invoice-id>")
    .requiredOption("--amount-minor <amount>")
    .requiredOption("--currency <currency>")
    .option("--title <title>")
    .option("--expected-at <iso-date>")
    .action(async function action(this: Command, invoiceId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        amountMinor: string;
        currency: string;
        title?: string;
        expectedAt?: string;
      };
      await executeCliCommand(options, "payment.record-for-invoice", {
        invoice_id: invoiceId,
        amount_minor: Number.parseInt(local.amountMinor, 10),
        currency: local.currency,
        ...(local.title ? { title: local.title } : {}),
        ...(local.expectedAt ? { expected_at: local.expectedAt } : {}),
      });
    });

  domainCommands
    .get("payment")
    ?.command("reconcile")
    .argument("<payment-id>")
    .requiredOption("--reference <reference>")
    .action(async function action(this: Command, paymentId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { reference: string };
      await executeCliCommand(
        options,
        "payment.reconcile",
        {
          payment_id: paymentId,
          reference: local.reference,
        },
        paymentId,
      );
    });
}

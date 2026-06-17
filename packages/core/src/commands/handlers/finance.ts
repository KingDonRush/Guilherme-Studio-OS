import { DomainCommandService } from "../../domains/commands.js";
import { entityMutationResult } from "../../entity-service.js";
import { numberValue, optionalNumber, optionalString, stringValue } from "../payload.js";
import type { StudioCommandDefinition } from "../types.js";

export const financeCommandDefinitions: Record<string, StudioCommandDefinition> = {
  "contract.create-from-engagement": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).createContractFromEngagement({
        engagementId: stringValue(payload, "engagement_id"),
        ...(optionalString(payload, "title") ? { title: stringValue(payload, "title") } : {}),
        ...(optionalNumber(payload, "value_minor") !== undefined
          ? { valueMinor: numberValue(payload, "value_minor") }
          : {}),
        ...(optionalString(payload, "currency")
          ? { currency: stringValue(payload, "currency") }
          : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "invoice.create-for-contract": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).createInvoiceForContract({
        contractId: stringValue(payload, "contract_id"),
        amountMinor: numberValue(payload, "amount_minor"),
        currency: stringValue(payload, "currency"),
        ...(optionalString(payload, "title") ? { title: stringValue(payload, "title") } : {}),
        ...(optionalString(payload, "due_at") ? { dueAt: stringValue(payload, "due_at") } : {}),
        ...(optionalString(payload, "reference")
          ? { reference: stringValue(payload, "reference") }
          : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "payment.record-for-invoice": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).recordPaymentForInvoice({
        invoiceId: stringValue(payload, "invoice_id"),
        amountMinor: numberValue(payload, "amount_minor"),
        currency: stringValue(payload, "currency"),
        ...(optionalString(payload, "title") ? { title: stringValue(payload, "title") } : {}),
        ...(optionalString(payload, "expected_at")
          ? { expectedAt: stringValue(payload, "expected_at") }
          : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "payment.reconcile": {
    requirement: { capability: "finance.reconcile", classification: "confidential" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).reconcilePayment(
        command.target_id ?? stringValue(payload, "payment_id"),
        { reference: stringValue(payload, "reference") },
      );
      return entityMutationResult(command.command, entity);
    },
  },
};

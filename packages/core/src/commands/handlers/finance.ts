import { createResultEnvelope } from "@guilherme-studio/schemas";
import { DomainCommandService } from "../../domains/commands.js";
import { entityMutationResult } from "../../entity-service.js";
import {
  numberValue,
  optionalNumber,
  optionalString,
  payloadValue,
  stringArray,
  stringValue,
} from "../payload.js";
import type { StudioCommandDefinition } from "../types.js";

function recordArray(payload: Record<string, unknown>, key: string): Record<string, unknown>[] {
  const value = payloadValue(payload, key);
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`${key} must be an array`);
  }
  return value.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`${key} entries must be objects`);
    }
    return entry as Record<string, unknown>;
  });
}

function optionalBoolean(payload: Record<string, unknown>, key: string): boolean | undefined {
  const value = payloadValue(payload, key);
  return typeof value === "boolean" ? value : undefined;
}

export const financeCommandDefinitions: Record<string, StudioCommandDefinition> = {
  "contract.create-from-engagement": {
    requirement: { capability: "entity.write" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).createContractFromEngagement({
        engagementId: stringValue(payload, "engagement_id"),
        ...(optionalString(payload, "title") ? { title: stringValue(payload, "title") } : {}),
        ...(optionalString(payload, "proposal_id")
          ? { proposalId: stringValue(payload, "proposal_id") }
          : {}),
        ...(optionalString(payload, "proposal_version_ref")
          ? { proposalVersionRef: stringValue(payload, "proposal_version_ref") }
          : {}),
        ...(optionalString(payload, "contract_version_ref")
          ? { contractVersionRef: stringValue(payload, "contract_version_ref") }
          : {}),
        ...(optionalString(payload, "signed_artifact_ref")
          ? { signedArtifactRef: stringValue(payload, "signed_artifact_ref") }
          : {}),
        ...(optionalNumber(payload, "value_minor") !== undefined
          ? { valueMinor: numberValue(payload, "value_minor") }
          : {}),
        ...(optionalString(payload, "currency")
          ? { currency: stringValue(payload, "currency") }
          : {}),
        ...(optionalString(payload, "effective_at")
          ? { effectiveAt: stringValue(payload, "effective_at") }
          : {}),
        ...(optionalString(payload, "ends_at") ? { endsAt: stringValue(payload, "ends_at") } : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "contract.register-terms": {
    requirement: { capability: "entity.write", classification: "confidential" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).registerCommercialTerms(
        command.target_id ?? stringValue(payload, "contract_id"),
        {
          ...(optionalString(payload, "proposal_id")
            ? { proposalId: stringValue(payload, "proposal_id") }
            : {}),
          ...(optionalString(payload, "proposal_version_ref")
            ? { proposalVersionRef: stringValue(payload, "proposal_version_ref") }
            : {}),
          ...(optionalString(payload, "contract_version_ref")
            ? { contractVersionRef: stringValue(payload, "contract_version_ref") }
            : {}),
          ...(optionalString(payload, "signed_artifact_ref")
            ? { signedArtifactRef: stringValue(payload, "signed_artifact_ref") }
            : {}),
          ...(optionalString(payload, "price_basis")
            ? { priceBasis: stringValue(payload, "price_basis") }
            : {}),
          ...(optionalNumber(payload, "total_minor") !== undefined
            ? { totalMinor: numberValue(payload, "total_minor") }
            : {}),
          ...(optionalString(payload, "currency")
            ? { currency: stringValue(payload, "currency") }
            : {}),
          ...(optionalNumber(payload, "deposit_minor") !== undefined
            ? { depositMinor: numberValue(payload, "deposit_minor") }
            : {}),
          ...(optionalString(payload, "deposit_due_at")
            ? { depositDueAt: stringValue(payload, "deposit_due_at") }
            : {}),
          installments: recordArray(payload, "installments").map((installment) => ({
            ...(optionalString(installment, "id") ? { id: stringValue(installment, "id") } : {}),
            title: stringValue(installment, "title"),
            amount_minor: numberValue(installment, "amount_minor"),
            ...(optionalString(installment, "due_at")
              ? { due_at: stringValue(installment, "due_at") }
              : {}),
            ...(optionalString(installment, "condition")
              ? { condition: stringValue(installment, "condition") }
              : {}),
          })),
          ...(optionalNumber(payload, "warranty_days") !== undefined
            ? { warrantyDays: numberValue(payload, "warranty_days") }
            : {}),
          ...(optionalString(payload, "warranty_starts_at")
            ? { warrantyStartsAt: stringValue(payload, "warranty_starts_at") }
            : {}),
          ...(optionalString(payload, "warranty_ends_at")
            ? { warrantyEndsAt: stringValue(payload, "warranty_ends_at") }
            : {}),
          ...(optionalString(payload, "maintenance_terms")
            ? { maintenanceTerms: stringValue(payload, "maintenance_terms") }
            : {}),
          ...(optionalString(payload, "expenses_policy")
            ? { expensesPolicy: stringValue(payload, "expenses_policy") }
            : {}),
          acceptanceConditions: stringArray(payload, "acceptance_conditions"),
        },
      );
      return entityMutationResult(command.command, entity);
    },
  },
  "contract.register-details": {
    requirement: { capability: "entity.write", classification: "confidential" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).registerContractDetails(
        command.target_id ?? stringValue(payload, "contract_id"),
        {
          obligations: recordArray(payload, "obligations").map((obligation) => ({
            ...(optionalString(obligation, "id") ? { id: stringValue(obligation, "id") } : {}),
            text: stringValue(obligation, "text"),
            source_ref: stringValue(obligation, "source_ref"),
            ...(optionalString(obligation, "owner")
              ? { owner: stringValue(obligation, "owner") }
              : {}),
            ...(optionalString(obligation, "due_at")
              ? { due_at: stringValue(obligation, "due_at") }
              : {}),
            ...(optionalString(obligation, "status")
              ? {
                  status: stringValue(obligation, "status") as
                    | "open"
                    | "satisfied"
                    | "waived"
                    | "blocked",
                }
              : {}),
            ...(optionalString(obligation, "authority")
              ? {
                  authority: stringValue(obligation, "authority") as
                    | "operational-reminder"
                    | "contract-text"
                    | "external-professional",
                }
              : {}),
            evidence_ids: stringArray(obligation, "evidence_ids"),
          })),
          ...(optionalString(payload, "termination_terms")
            ? { terminationTerms: stringValue(payload, "termination_terms") }
            : {}),
          ...(optionalString(payload, "confidentiality_terms")
            ? { confidentialityTerms: stringValue(payload, "confidentiality_terms") }
            : {}),
          ...(optionalString(payload, "ip_terms")
            ? { ipTerms: stringValue(payload, "ip_terms") }
            : {}),
          ...(optionalString(payload, "governing_reference")
            ? { governingReference: stringValue(payload, "governing_reference") }
            : {}),
          ...(optionalString(payload, "signed_artifact_ref")
            ? { signedArtifactRef: stringValue(payload, "signed_artifact_ref") }
            : {}),
          ...(optionalString(payload, "signed_at")
            ? { signedAt: stringValue(payload, "signed_at") }
            : {}),
          ...(optionalString(payload, "effective_at")
            ? { effectiveAt: stringValue(payload, "effective_at") }
            : {}),
          ...(optionalString(payload, "ends_at")
            ? { endsAt: stringValue(payload, "ends_at") }
            : {}),
        },
      );
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
        deliverableIds: stringArray(payload, "deliverable_ids"),
        ...(optionalString(payload, "source_term_id")
          ? { sourceTermId: stringValue(payload, "source_term_id") }
          : {}),
      });
      return entityMutationResult(command.command, entity);
    },
  },
  "invoice.issue": {
    requirement: { capability: "entity.write", classification: "confidential" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).issueInvoice(
        command.target_id ?? stringValue(payload, "invoice_id"),
        {
          ...(optionalString(payload, "issued_at")
            ? { issuedAt: stringValue(payload, "issued_at") }
            : {}),
          evidenceIds: stringArray(payload, "evidence_ids"),
        },
      );
      return entityMutationResult(command.command, entity);
    },
  },
  "invoice.update-lifecycle": {
    requirement: { capability: "entity.transition", classification: "confidential" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).updateInvoiceLifecycle(
        command.target_id ?? stringValue(payload, "invoice_id"),
        {
          stage: stringValue(payload, "stage") as
            | "draft"
            | "issued"
            | "viewed"
            | "partially_paid"
            | "overdue"
            | "disputed"
            | "settled"
            | "void",
          ...(optionalNumber(payload, "paid_amount_minor") !== undefined
            ? { paidAmountMinor: numberValue(payload, "paid_amount_minor") }
            : {}),
          ...(optionalString(payload, "reason") ? { reason: stringValue(payload, "reason") } : {}),
          evidenceIds: stringArray(payload, "evidence_ids"),
        },
      );
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
  "payment.confirm": {
    requirement: { capability: "finance.reconcile", classification: "confidential" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).confirmPayment(
        command.target_id ?? stringValue(payload, "payment_id"),
        {
          providerEvidenceId: stringValue(payload, "provider_evidence_id"),
          ...(optionalString(payload, "provider")
            ? { provider: stringValue(payload, "provider") }
            : {}),
          ...(optionalString(payload, "provider_reference")
            ? { providerReference: stringValue(payload, "provider_reference") }
            : {}),
        },
      );
      return entityMutationResult(command.command, entity);
    },
  },
  "payment.reconcile": {
    requirement: { capability: "finance.reconcile", classification: "confidential" },
    handler: async ({ context, command, payload }) => {
      const entity = await new DomainCommandService(context).reconcilePayment(
        command.target_id ?? stringValue(payload, "payment_id"),
        {
          reference: stringValue(payload, "reference"),
          ...(optionalString(payload, "evidence_id")
            ? { evidenceId: stringValue(payload, "evidence_id") }
            : {}),
        },
      );
      return entityMutationResult(command.command, entity);
    },
  },
  "payment.prepare-reminder": {
    requirement: { capability: "action.prepare", classification: "confidential" },
    handler: async ({ context, command, payload }) => {
      const action = await new DomainCommandService(context).preparePaymentReminder({
        invoiceId: command.target_id ?? stringValue(payload, "invoice_id"),
        message: stringValue(payload, "message"),
        ...(optionalString(payload, "channel") ? { channel: stringValue(payload, "channel") } : {}),
      });
      return createResultEnvelope({ requestId: command.request_id, result: action });
    },
  },
  "finance.resolve-obligations": {
    requirement: { capability: "entity.read", classification: "confidential" },
    handler: async ({ context, command, payload }) => {
      const result = await new DomainCommandService(context).resolveObligations({
        ...(optionalString(payload, "contract_id")
          ? { contractId: stringValue(payload, "contract_id") }
          : {}),
      });
      return createResultEnvelope({ requestId: command.request_id, result });
    },
  },
  "finance.reconciliation-report": {
    requirement: { capability: "entity.read", classification: "confidential" },
    handler: async ({ context, command }) => {
      const result = await new DomainCommandService(context).reconciliationReport();
      return createResultEnvelope({ requestId: command.request_id, result });
    },
  },
  "finance.obligation-calendar": {
    requirement: { capability: "entity.read", classification: "confidential" },
    handler: async ({ context, command }) => {
      const result = await new DomainCommandService(context).obligationCalendar();
      return createResultEnvelope({ requestId: command.request_id, result });
    },
  },
  "finance.economic-view": {
    requirement: { capability: "entity.read", classification: "confidential" },
    handler: async ({ context, command, payload }) => {
      const includeLegalTaxNote = optionalBoolean(payload, "include_legal_tax_note") ?? false;
      const result = await new DomainCommandService(context).calculateEconomicView();
      return createResultEnvelope({
        requestId: command.request_id,
        result: {
          ...result,
          ...(includeLegalTaxNote
            ? { note: "Operational record only; not legal, tax, accounting or banking advice." }
            : {}),
        },
      });
    },
  },
};

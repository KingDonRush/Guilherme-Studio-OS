import {
  createEntity,
  entityId,
  entityRevision,
  entityTitle,
  nowIso,
  type StudioEntity,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
import { DomainServiceBase } from "./base.js";
import { mergeRelations } from "./utils.js";

export class FinanceDomainService extends DomainServiceBase {
  async createContractFromEngagement(input: {
    engagementId: string;
    title?: string;
    valueMinor?: number;
    currency?: string;
  }): Promise<StudioEntity> {
    const engagement = await this.requireKind(input.engagementId, "engagement");
    const contract = createEntity({
      kind: "contract",
      title: input.title ?? `Contract for ${entityTitle(engagement)}`,
      status: "draft",
      relations: [{ type: "contracts_engagement", target_id: input.engagementId }],
      data: {
        engagement_id: input.engagementId,
        ...(input.valueMinor !== undefined ? { value_minor: input.valueMinor } : {}),
        ...(input.currency ? { currency: input.currency } : {}),
      },
    });
    const updatedEngagement = TypedEntitySchema.parse({
      ...engagement,
      metadata: {
        ...engagement.metadata,
        revision: entityRevision(engagement) + 1,
        updated_at: nowIso(),
      },
      spec: {
        ...engagement.spec,
        contract_id: entityId(contract),
      },
      relations: mergeRelations(engagement.relations, [
        { type: "governed_by_contract", target_id: entityId(contract) },
      ]),
    });
    await this.context.entities.putMany([
      { entity: contract },
      { entity: updatedEngagement, expectedRevision: entityRevision(engagement) },
    ]);
    await this.entities.recordEvent("contract.created", entityId(contract), {
      engagement_id: input.engagementId,
    });
    return contract;
  }

  async createInvoiceForContract(input: {
    contractId: string;
    title?: string;
    amountMinor: number;
    currency: string;
    dueAt?: string;
    reference?: string;
  }): Promise<StudioEntity> {
    const contract = await this.requireKind(input.contractId, "contract");
    return this.entities.create({
      kind: "invoice",
      title: input.title ?? `Invoice for ${entityTitle(contract)}`,
      status: "active",
      relations: [{ type: "bills_contract", target_id: input.contractId }],
      data: {
        contract_id: input.contractId,
        amount_minor: input.amountMinor,
        currency: input.currency,
        ...(input.dueAt ? { due_at: input.dueAt } : {}),
        ...(input.reference ? { reference: input.reference } : {}),
      },
    });
  }

  async recordPaymentForInvoice(input: {
    invoiceId: string;
    title?: string;
    amountMinor: number;
    currency: string;
    expectedAt?: string;
  }): Promise<StudioEntity> {
    const invoice = await this.requireKind(input.invoiceId, "invoice");
    return this.entities.create({
      kind: "payment",
      title: input.title ?? `Payment for ${entityTitle(invoice)}`,
      status: "waiting",
      relations: [{ type: "pays_invoice", target_id: input.invoiceId }],
      data: {
        invoice_id: input.invoiceId,
        amount_minor: input.amountMinor,
        currency: input.currency,
        ...(input.expectedAt ? { expected_at: input.expectedAt } : {}),
      },
    });
  }

  async reconcilePayment(id: string, input: { reference: string }): Promise<StudioEntity> {
    return this.entities.update(id, (entity) => {
      if (entity.kind !== "payment") {
        throw new Error(`Expected payment entity, got ${entity.kind}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "paid",
          reconciled_at: nowIso(),
          reconciliation_reference: input.reference,
        },
      };
    });
  }
}

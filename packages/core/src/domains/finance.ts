import {
  createEntity,
  entityId,
  entityRevision,
  entityStatus,
  entityTitle,
  nowIso,
  type PreparedAction,
  type StudioEntity,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
import { asRecord, recordString, recordStringArray } from "../record-utils.js";
import { DomainServiceBase } from "./base.js";
import { mergeRelations } from "./utils.js";

type InvoiceStage =
  | "draft"
  | "issued"
  | "viewed"
  | "partially_paid"
  | "overdue"
  | "disputed"
  | "settled"
  | "void";

interface MoneyInstallment {
  id?: string;
  title: string;
  amount_minor: number;
  due_at?: string;
  condition?: string;
}

interface ContractObligation {
  id?: string;
  text: string;
  source_ref: string;
  owner?: string;
  due_at?: string;
  status?: "open" | "satisfied" | "waived" | "blocked";
  authority?: "operational-reminder" | "contract-text" | "external-professional";
  evidence_ids?: string[];
}

interface FinanceObligationReportItem {
  type: "contract_obligation" | "invoice_due" | "expected_payment" | "warranty_window";
  source_id: string;
  source_ref: string;
  text: string;
  status: string;
  authority: "operational-reminder" | "contract-text" | "external-professional";
  owner?: string;
  due_at?: string;
}

function numberField(entity: StudioEntity, key: string): number | undefined {
  const value = Reflect.get(entity.spec, key);
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function appendUnique(existing: string[], value: string): string[] {
  return existing.includes(value) ? existing : [...existing, value];
}

export class FinanceDomainService extends DomainServiceBase {
  async createContractFromEngagement(input: {
    engagementId: string;
    title?: string;
    valueMinor?: number;
    currency?: string;
    proposalId?: string;
    proposalVersionRef?: string;
    contractVersionRef?: string;
    signedArtifactRef?: string;
    effectiveAt?: string;
    endsAt?: string;
  }): Promise<StudioEntity> {
    const engagement = await this.requireKind(input.engagementId, "engagement");
    if (input.proposalId) {
      await this.requireKind(input.proposalId, "proposal");
    }
    const contract = createEntity({
      kind: "contract",
      title: input.title ?? `Contract for ${entityTitle(engagement)}`,
      status: "draft",
      relations: [
        { type: "contracts_engagement", target_id: input.engagementId },
        ...(input.proposalId ? [{ type: "based_on_proposal", target_id: input.proposalId }] : []),
      ],
      data: {
        engagement_id: input.engagementId,
        ...(input.proposalId ? { proposal_id: input.proposalId } : {}),
        ...(input.proposalVersionRef ? { proposal_version_ref: input.proposalVersionRef } : {}),
        ...(input.contractVersionRef ? { contract_version_ref: input.contractVersionRef } : {}),
        ...(input.signedArtifactRef ? { signed_artifact_ref: input.signedArtifactRef } : {}),
        ...(input.valueMinor !== undefined ? { value_minor: input.valueMinor } : {}),
        ...(input.currency ? { currency: input.currency } : {}),
        ...(input.effectiveAt ? { effective_at: input.effectiveAt } : {}),
        ...(input.endsAt ? { ends_at: input.endsAt } : {}),
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

  async registerCommercialTerms(
    contractId: string,
    input: {
      proposalId?: string;
      proposalVersionRef?: string;
      contractVersionRef?: string;
      signedArtifactRef?: string;
      priceBasis?: string;
      totalMinor?: number;
      currency?: string;
      depositMinor?: number;
      depositDueAt?: string;
      installments?: MoneyInstallment[];
      warrantyDays?: number;
      warrantyStartsAt?: string;
      warrantyEndsAt?: string;
      maintenanceTerms?: string;
      expensesPolicy?: string;
      acceptanceConditions?: string[];
    },
  ): Promise<StudioEntity> {
    if (input.proposalId) {
      await this.requireKind(input.proposalId, "proposal");
    }
    return this.entities.update(contractId, (entity) => {
      if (entity.kind !== "contract") {
        throw new Error(`Expected contract entity, got ${entity.kind}`);
      }
      const relations = input.proposalId
        ? mergeRelations(entity.relations, [
            { type: "based_on_proposal", target_id: input.proposalId },
          ])
        : entity.relations;
      return {
        ...entity,
        relations,
        spec: {
          ...entity.spec,
          ...(input.proposalId ? { proposal_id: input.proposalId } : {}),
          ...(input.proposalVersionRef ? { proposal_version_ref: input.proposalVersionRef } : {}),
          ...(input.contractVersionRef ? { contract_version_ref: input.contractVersionRef } : {}),
          ...(input.signedArtifactRef ? { signed_artifact_ref: input.signedArtifactRef } : {}),
          ...(input.totalMinor !== undefined ? { value_minor: input.totalMinor } : {}),
          ...(input.currency ? { currency: input.currency } : {}),
          commercial_terms: {
            proposal_id: input.proposalId ?? recordString(entity.spec, "proposal_id"),
            proposal_version_ref:
              input.proposalVersionRef ?? recordString(entity.spec, "proposal_version_ref"),
            contract_version_ref:
              input.contractVersionRef ?? recordString(entity.spec, "contract_version_ref"),
            signed_artifact_ref:
              input.signedArtifactRef ?? recordString(entity.spec, "signed_artifact_ref"),
            ...(input.priceBasis ? { price_basis: input.priceBasis } : {}),
            ...(input.totalMinor !== undefined ? { total_minor: input.totalMinor } : {}),
            ...(input.currency ? { currency: input.currency } : {}),
            ...(input.depositMinor !== undefined ? { deposit_minor: input.depositMinor } : {}),
            ...(input.depositDueAt ? { deposit_due_at: input.depositDueAt } : {}),
            installments: input.installments ?? [],
            ...(input.warrantyDays !== undefined ? { warranty_days: input.warrantyDays } : {}),
            ...(input.warrantyStartsAt ? { warranty_starts_at: input.warrantyStartsAt } : {}),
            ...(input.warrantyEndsAt ? { warranty_ends_at: input.warrantyEndsAt } : {}),
            ...(input.maintenanceTerms ? { maintenance_terms: input.maintenanceTerms } : {}),
            ...(input.expensesPolicy ? { expenses_policy: input.expensesPolicy } : {}),
            acceptance_conditions: input.acceptanceConditions ?? [],
          },
        },
      };
    });
  }

  async registerContractDetails(
    contractId: string,
    input: {
      obligations?: ContractObligation[];
      terminationTerms?: string;
      confidentialityTerms?: string;
      ipTerms?: string;
      governingReference?: string;
      signedArtifactRef?: string;
      signedAt?: string;
      effectiveAt?: string;
      endsAt?: string;
    },
  ): Promise<StudioEntity> {
    const evidenceIds = (input.obligations ?? []).flatMap(
      (obligation) => obligation.evidence_ids ?? [],
    );
    await this.requireEvidenceIds(evidenceIds);
    return this.entities.update(contractId, (entity) => {
      if (entity.kind !== "contract") {
        throw new Error(`Expected contract entity, got ${entity.kind}`);
      }
      const obligations = (input.obligations ?? []).map((obligation, index) => ({
        id: obligation.id ?? `obl_${index + 1}`,
        text: obligation.text,
        source_ref: obligation.source_ref,
        ...(obligation.owner ? { owner: obligation.owner } : {}),
        ...(obligation.due_at ? { due_at: obligation.due_at } : {}),
        status: obligation.status ?? "open",
        authority: obligation.authority ?? "contract-text",
        evidence_ids: obligation.evidence_ids ?? [],
      }));
      return {
        ...entity,
        spec: {
          ...entity.spec,
          obligations,
          ...(input.terminationTerms ? { termination_terms: input.terminationTerms } : {}),
          ...(input.confidentialityTerms
            ? { confidentiality_terms: input.confidentialityTerms }
            : {}),
          ...(input.ipTerms ? { ip_terms: input.ipTerms } : {}),
          ...(input.governingReference ? { governing_reference: input.governingReference } : {}),
          ...(input.signedArtifactRef ? { signed_artifact_ref: input.signedArtifactRef } : {}),
          ...(input.signedAt ? { signed_at: input.signedAt, status: "active" } : {}),
          ...(input.effectiveAt ? { effective_at: input.effectiveAt } : {}),
          ...(input.endsAt ? { ends_at: input.endsAt } : {}),
        },
      };
    });
  }

  async createInvoiceForContract(input: {
    contractId: string;
    title?: string;
    amountMinor: number;
    currency: string;
    dueAt?: string;
    reference?: string;
    deliverableIds?: string[];
    sourceTermId?: string;
  }): Promise<StudioEntity> {
    const contract = await this.requireKind(input.contractId, "contract");
    for (const deliverableId of input.deliverableIds ?? []) {
      await this.requireKind(deliverableId, "deliverable");
    }
    const engagementId = recordString(contract.spec, "engagement_id");
    return this.entities.create({
      kind: "invoice",
      title: input.title ?? `Invoice for ${entityTitle(contract)}`,
      status: "draft",
      relations: [
        { type: "bills_contract", target_id: input.contractId },
        ...(engagementId ? [{ type: "bills_engagement", target_id: engagementId }] : []),
        ...(input.deliverableIds ?? []).map((deliverableId) => ({
          type: "bills_deliverable",
          target_id: deliverableId,
        })),
      ],
      data: {
        contract_id: input.contractId,
        ...(engagementId ? { engagement_id: engagementId } : {}),
        deliverable_ids: input.deliverableIds ?? [],
        amount_minor: input.amountMinor,
        currency: input.currency,
        stage: "draft",
        ...(input.dueAt ? { due_at: input.dueAt } : {}),
        ...(input.reference ? { reference: input.reference } : {}),
        ...(input.sourceTermId ? { source_term_id: input.sourceTermId } : {}),
      },
    });
  }

  async issueInvoice(
    id: string,
    input: { issuedAt?: string; evidenceIds?: string[] },
  ): Promise<StudioEntity> {
    await this.requireEvidenceIds(input.evidenceIds ?? []);
    return this.entities.update(id, (entity) => {
      if (entity.kind !== "invoice") {
        throw new Error(`Expected invoice entity, got ${entity.kind}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "active",
          stage: "issued",
          issued_at: input.issuedAt ?? nowIso(),
          evidence_ids: [
            ...recordStringArray(entity.spec, "evidence_ids"),
            ...(input.evidenceIds ?? []),
          ],
        },
      };
    });
  }

  async updateInvoiceLifecycle(
    id: string,
    input: {
      stage: InvoiceStage;
      paidAmountMinor?: number;
      reason?: string;
      evidenceIds?: string[];
    },
  ): Promise<StudioEntity> {
    await this.requireEvidenceIds(input.evidenceIds ?? []);
    return this.entities.update(id, (entity) => {
      if (entity.kind !== "invoice") {
        throw new Error(`Expected invoice entity, got ${entity.kind}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          stage: input.stage,
          status:
            input.stage === "settled" ? "paid" : input.stage === "void" ? "cancelled" : "active",
          ...(input.stage === "settled" ? { settled_at: nowIso() } : {}),
          ...(input.paidAmountMinor !== undefined
            ? { paid_amount_minor: input.paidAmountMinor }
            : {}),
          ...(input.stage === "disputed" && input.reason ? { disputed_reason: input.reason } : {}),
          ...(input.stage === "void" && input.reason ? { void_reason: input.reason } : {}),
          evidence_ids: [
            ...recordStringArray(entity.spec, "evidence_ids"),
            ...(input.evidenceIds ?? []),
          ],
        },
      };
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
    const contractId = recordString(invoice.spec, "contract_id");
    return this.entities.create({
      kind: "payment",
      title: input.title ?? `Payment for ${entityTitle(invoice)}`,
      status: "waiting",
      relations: [
        { type: "pays_invoice", target_id: input.invoiceId },
        ...(contractId ? [{ type: "pays_contract", target_id: contractId }] : []),
      ],
      data: {
        invoice_id: input.invoiceId,
        ...(contractId ? { contract_id: contractId } : {}),
        amount_minor: input.amountMinor,
        currency: input.currency,
        stage: "expected",
        ...(input.expectedAt ? { expected_at: input.expectedAt } : {}),
      },
    });
  }

  async confirmPayment(
    id: string,
    input: { providerEvidenceId: string; provider?: string; providerReference?: string },
  ): Promise<StudioEntity> {
    await this.requireKind(input.providerEvidenceId, "evidence");
    return this.entities.update(id, (entity) => {
      if (entity.kind !== "payment") {
        throw new Error(`Expected payment entity, got ${entity.kind}`);
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "active",
          stage: "confirmed",
          confirmed_at: nowIso(),
          provider_evidence_id: input.providerEvidenceId,
          evidence_ids: appendUnique(
            recordStringArray(entity.spec, "evidence_ids"),
            input.providerEvidenceId,
          ),
          ...(input.provider ? { provider: input.provider } : {}),
          ...(input.providerReference ? { provider_reference: input.providerReference } : {}),
        },
        relations: mergeRelations(entity.relations, [
          { type: "confirmed_by", target_id: input.providerEvidenceId },
        ]),
      };
    });
  }

  async reconcilePayment(
    id: string,
    input: { reference: string; evidenceId?: string },
  ): Promise<StudioEntity> {
    if (input.evidenceId) {
      await this.requireKind(input.evidenceId, "evidence");
    }
    return this.entities.update(id, (entity) => {
      if (entity.kind !== "payment") {
        throw new Error(`Expected payment entity, got ${entity.kind}`);
      }
      const providerEvidenceId = recordString(entity.spec, "provider_evidence_id");
      if (!providerEvidenceId && !input.evidenceId) {
        throw new Error("Payment reconciliation requires confirmed provider evidence.");
      }
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "paid",
          stage: "reconciled",
          reconciled_at: nowIso(),
          reconciliation_reference: input.reference,
          evidence_ids: input.evidenceId
            ? appendUnique(recordStringArray(entity.spec, "evidence_ids"), input.evidenceId)
            : recordStringArray(entity.spec, "evidence_ids"),
        },
        relations: input.evidenceId
          ? mergeRelations(entity.relations, [
              { type: "reconciled_by", target_id: input.evidenceId },
            ])
          : entity.relations,
      };
    });
  }

  async preparePaymentReminder(input: {
    invoiceId: string;
    message: string;
    channel?: string;
  }): Promise<PreparedAction> {
    const invoice = await this.requireKind(input.invoiceId, "invoice");
    if (entityStatus(invoice) === "paid") {
      throw new Error("Paid invoices do not need payment reminders.");
    }
    const contractId = recordString(invoice.spec, "contract_id");
    const sourceRevisions: Record<string, number> = {
      [input.invoiceId]: entityRevision(invoice),
    };
    if (contractId) {
      const contract = await this.context.entities.get(contractId);
      if (contract) {
        sourceRevisions[contractId] = entityRevision(contract.entity);
      }
    }
    return this.actions.prepare({
      actionType: "finance.payment-reminder.prepare",
      provider: "fake/local",
      target: input.invoiceId,
      sourceRevisions,
      payload: {
        invoice_id: input.invoiceId,
        ...(contractId ? { contract_id: contractId } : {}),
        channel: input.channel ?? "email",
        message: input.message,
        amount_minor: numberField(invoice, "amount_minor") ?? null,
        currency: recordString(invoice.spec, "currency") ?? null,
        due_at: recordString(invoice.spec, "due_at") ?? null,
        reference: recordString(invoice.spec, "reference") ?? null,
      },
    });
  }

  async resolveObligations(input: { contractId?: string } = {}): Promise<{
    generated_at: string;
    obligations: FinanceObligationReportItem[];
  }> {
    const files = await this.context.entities.scan();
    const source = files.map((file) => file.entity);
    const contractIds = input.contractId ? new Set([input.contractId]) : undefined;
    if (input.contractId) {
      await this.requireKind(input.contractId, "contract");
    }
    const obligations: FinanceObligationReportItem[] = [];

    for (const entity of source) {
      if (entity.kind === "contract" && (!contractIds || contractIds.has(entityId(entity)))) {
        const rawObligations = Reflect.get(entity.spec, "obligations");
        if (Array.isArray(rawObligations)) {
          for (const raw of rawObligations) {
            const obligation = asRecord(raw);
            if (!obligation) {
              continue;
            }
            const text = recordString(obligation, "text");
            const sourceRef = recordString(obligation, "source_ref");
            if (!text || !sourceRef) {
              continue;
            }
            const owner = recordString(obligation, "owner");
            const dueAt = recordString(obligation, "due_at");
            obligations.push({
              type: "contract_obligation",
              source_id: entityId(entity),
              source_ref: sourceRef,
              text,
              status: recordString(obligation, "status") ?? "open",
              authority:
                (recordString(
                  obligation,
                  "authority",
                ) as FinanceObligationReportItem["authority"]) ?? "contract-text",
              ...(owner ? { owner } : {}),
              ...(dueAt ? { due_at: dueAt } : {}),
            });
          }
        }
        const terms = asRecord(Reflect.get(entity.spec, "commercial_terms"));
        const warrantyEndsAt = recordString(terms, "warranty_ends_at");
        if (warrantyEndsAt) {
          obligations.push({
            type: "warranty_window",
            source_id: entityId(entity),
            source_ref: "commercial_terms.warranty_ends_at",
            text: "Warranty window end recorded in commercial terms.",
            status: "open",
            authority: "operational-reminder",
            due_at: warrantyEndsAt,
          });
        }
      }

      if (entity.kind === "invoice" && entityStatus(entity) !== "paid") {
        const contractId = recordString(entity.spec, "contract_id");
        if (contractIds && (!contractId || !contractIds.has(contractId))) {
          continue;
        }
        const dueAt = recordString(entity.spec, "due_at");
        if (dueAt) {
          obligations.push({
            type: "invoice_due",
            source_id: entityId(entity),
            source_ref: "invoice.due_at",
            text: `Invoice due: ${entityTitle(entity)}`,
            status: recordString(entity.spec, "stage") ?? entityStatus(entity),
            authority: "operational-reminder",
            due_at: dueAt,
          });
        }
      }

      if (entity.kind === "payment" && entityStatus(entity) !== "paid") {
        const contractId = recordString(entity.spec, "contract_id");
        if (contractIds && (!contractId || !contractIds.has(contractId))) {
          continue;
        }
        const expectedAt = recordString(entity.spec, "expected_at");
        if (expectedAt) {
          obligations.push({
            type: "expected_payment",
            source_id: entityId(entity),
            source_ref: "payment.expected_at",
            text: `Expected payment: ${entityTitle(entity)}`,
            status: recordString(entity.spec, "stage") ?? entityStatus(entity),
            authority: "operational-reminder",
            due_at: expectedAt,
          });
        }
      }
    }

    return {
      generated_at: nowIso(),
      obligations: obligations.sort((left, right) =>
        (left.due_at ?? "9999").localeCompare(right.due_at ?? "9999"),
      ),
    };
  }

  async reconciliationReport(): Promise<{
    generated_at: string;
    unmatched_invoices: string[];
    unmatched_payments: string[];
    open_payments: string[];
  }> {
    const entities = (await this.context.entities.scan()).map((file) => file.entity);
    const payments = entities.filter((entity) => entity.kind === "payment");
    const invoices = entities.filter((entity) => entity.kind === "invoice");
    const invoiceIds = new Set(invoices.map((invoice) => entityId(invoice)));
    const paidInvoiceIds = new Set(
      payments
        .filter((payment) => entityStatus(payment) === "paid")
        .map((payment) => recordString(payment.spec, "invoice_id"))
        .filter((id): id is string => typeof id === "string"),
    );
    return {
      generated_at: nowIso(),
      unmatched_invoices: invoices
        .filter(
          (invoice) => entityStatus(invoice) !== "paid" && !paidInvoiceIds.has(entityId(invoice)),
        )
        .map((invoice) => entityId(invoice)),
      unmatched_payments: payments
        .filter((payment) => {
          const invoiceId = recordString(payment.spec, "invoice_id");
          return !invoiceId || !invoiceIds.has(invoiceId);
        })
        .map((payment) => entityId(payment)),
      open_payments: payments
        .filter((payment) => entityStatus(payment) !== "paid")
        .map((payment) => entityId(payment)),
    };
  }

  async obligationCalendar(): Promise<{
    generated_at: string;
    items: FinanceObligationReportItem[];
  }> {
    const report = await this.resolveObligations();
    return {
      generated_at: report.generated_at,
      items: report.obligations.filter((item) => item.due_at),
    };
  }

  async calculateEconomicView(): Promise<{
    generated_at: string;
    expected_revenue_minor: number;
    confirmed_revenue_minor: number;
    reconciled_revenue_minor: number;
    overdue_receivable_minor: number;
    active_contract_value_minor: number;
  }> {
    const now = Date.now();
    const entities = (await this.context.entities.scan()).map((file) => file.entity);
    let expected = 0;
    let confirmed = 0;
    let reconciled = 0;
    let overdue = 0;
    let activeContractValue = 0;
    for (const entity of entities) {
      if (entity.kind === "contract" && !["cancelled", "archived"].includes(entityStatus(entity))) {
        activeContractValue += numberField(entity, "value_minor") ?? 0;
      }
      if (entity.kind === "invoice" && entityStatus(entity) !== "paid") {
        expected += numberField(entity, "amount_minor") ?? 0;
        const dueAt = recordString(entity.spec, "due_at");
        if (dueAt && Date.parse(dueAt) <= now) {
          overdue += numberField(entity, "amount_minor") ?? 0;
        }
      }
      if (entity.kind === "payment") {
        const amount = numberField(entity, "amount_minor") ?? 0;
        const stage = recordString(entity.spec, "stage");
        if (stage === "confirmed") {
          confirmed += amount;
        }
        if (entityStatus(entity) === "paid" || stage === "reconciled") {
          reconciled += amount;
        }
      }
    }
    return {
      generated_at: nowIso(),
      expected_revenue_minor: expected,
      confirmed_revenue_minor: confirmed,
      reconciled_revenue_minor: reconciled,
      overdue_receivable_minor: overdue,
      active_contract_value_minor: activeContractValue,
    };
  }
}

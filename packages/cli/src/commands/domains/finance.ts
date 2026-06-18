import type { Command } from "commander";
import { executeCliCommand, globalOptions } from "../../runtime.js";
import type { DomainCommandMap } from "./base.js";

function parseJsonArray(value: string | undefined, label: string): Record<string, unknown>[] {
  if (!value) {
    return [];
  }
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON array`);
  }
  return parsed.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error(`${label} entries must be JSON objects`);
    }
    return entry as Record<string, unknown>;
  });
}

export function registerFinanceDomainCommands(
  program: Command,
  domainCommands: DomainCommandMap,
): void {
  const finance = program.command("finance").description("Finance reports and operational views");
  finance
    .command("resolve-obligations")
    .option("--contract <id>")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as { contract?: string };
      await executeCliCommand(options, "finance.resolve-obligations", {
        ...(local.contract ? { contract_id: local.contract } : {}),
      });
    });
  finance.command("reconciliation-report").action(async function action(this: Command) {
    const options = globalOptions(this);
    await executeCliCommand(options, "finance.reconciliation-report", {});
  });
  finance.command("obligation-calendar").action(async function action(this: Command) {
    const options = globalOptions(this);
    await executeCliCommand(options, "finance.obligation-calendar", {});
  });
  finance
    .command("economic-view")
    .option("--include-note")
    .action(async function action(this: Command) {
      const options = globalOptions(this);
      const local = this.opts() as { includeNote?: boolean };
      await executeCliCommand(options, "finance.economic-view", {
        include_legal_tax_note: local.includeNote ?? false,
      });
    });

  domainCommands
    .get("contract")
    ?.command("create-from-engagement")
    .argument("<engagement-id>")
    .option("--title <title>")
    .option("--value-minor <amount>")
    .option("--currency <currency>")
    .option("--proposal <id>")
    .option("--proposal-version <ref>")
    .option("--contract-version <ref>")
    .option("--signed-artifact <ref>")
    .option("--effective-at <iso-date>")
    .option("--ends-at <iso-date>")
    .action(async function action(this: Command, engagementId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        title?: string;
        valueMinor?: string;
        currency?: string;
        proposal?: string;
        proposalVersion?: string;
        contractVersion?: string;
        signedArtifact?: string;
        effectiveAt?: string;
        endsAt?: string;
      };
      await executeCliCommand(options, "contract.create-from-engagement", {
        engagement_id: engagementId,
        ...(local.title ? { title: local.title } : {}),
        ...(local.valueMinor ? { value_minor: Number.parseInt(local.valueMinor, 10) } : {}),
        ...(local.currency ? { currency: local.currency } : {}),
        ...(local.proposal ? { proposal_id: local.proposal } : {}),
        ...(local.proposalVersion ? { proposal_version_ref: local.proposalVersion } : {}),
        ...(local.contractVersion ? { contract_version_ref: local.contractVersion } : {}),
        ...(local.signedArtifact ? { signed_artifact_ref: local.signedArtifact } : {}),
        ...(local.effectiveAt ? { effective_at: local.effectiveAt } : {}),
        ...(local.endsAt ? { ends_at: local.endsAt } : {}),
      });
    });

  domainCommands
    .get("contract")
    ?.command("register-terms")
    .argument("<contract-id>")
    .option("--proposal <id>")
    .option("--proposal-version <ref>")
    .option("--contract-version <ref>")
    .option("--signed-artifact <ref>")
    .option("--price-basis <text>")
    .option("--total-minor <amount>")
    .option("--currency <currency>")
    .option("--deposit-minor <amount>")
    .option("--deposit-due-at <iso-date>")
    .option("--installments-json <json-array>")
    .option("--warranty-days <days>")
    .option("--warranty-starts-at <iso-date>")
    .option("--warranty-ends-at <iso-date>")
    .option("--maintenance <text>")
    .option("--expenses <text>")
    .option("--acceptance <condition...>")
    .action(async function action(this: Command, contractId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        proposal?: string;
        proposalVersion?: string;
        contractVersion?: string;
        signedArtifact?: string;
        priceBasis?: string;
        totalMinor?: string;
        currency?: string;
        depositMinor?: string;
        depositDueAt?: string;
        installmentsJson?: string;
        warrantyDays?: string;
        warrantyStartsAt?: string;
        warrantyEndsAt?: string;
        maintenance?: string;
        expenses?: string;
        acceptance?: string[];
      };
      await executeCliCommand(
        options,
        "contract.register-terms",
        {
          contract_id: contractId,
          ...(local.proposal ? { proposal_id: local.proposal } : {}),
          ...(local.proposalVersion ? { proposal_version_ref: local.proposalVersion } : {}),
          ...(local.contractVersion ? { contract_version_ref: local.contractVersion } : {}),
          ...(local.signedArtifact ? { signed_artifact_ref: local.signedArtifact } : {}),
          ...(local.priceBasis ? { price_basis: local.priceBasis } : {}),
          ...(local.totalMinor ? { total_minor: Number.parseInt(local.totalMinor, 10) } : {}),
          ...(local.currency ? { currency: local.currency } : {}),
          ...(local.depositMinor ? { deposit_minor: Number.parseInt(local.depositMinor, 10) } : {}),
          ...(local.depositDueAt ? { deposit_due_at: local.depositDueAt } : {}),
          installments: parseJsonArray(local.installmentsJson, "installments"),
          ...(local.warrantyDays ? { warranty_days: Number.parseInt(local.warrantyDays, 10) } : {}),
          ...(local.warrantyStartsAt ? { warranty_starts_at: local.warrantyStartsAt } : {}),
          ...(local.warrantyEndsAt ? { warranty_ends_at: local.warrantyEndsAt } : {}),
          ...(local.maintenance ? { maintenance_terms: local.maintenance } : {}),
          ...(local.expenses ? { expenses_policy: local.expenses } : {}),
          acceptance_conditions: local.acceptance ?? [],
        },
        contractId,
      );
    });

  domainCommands
    .get("contract")
    ?.command("register-details")
    .argument("<contract-id>")
    .option("--obligations-json <json-array>")
    .option("--termination <text>")
    .option("--confidentiality <text>")
    .option("--ip <text>")
    .option("--governing <ref>")
    .option("--signed-artifact <ref>")
    .option("--signed-at <iso-date>")
    .option("--effective-at <iso-date>")
    .option("--ends-at <iso-date>")
    .action(async function action(this: Command, contractId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        obligationsJson?: string;
        termination?: string;
        confidentiality?: string;
        ip?: string;
        governing?: string;
        signedArtifact?: string;
        signedAt?: string;
        effectiveAt?: string;
        endsAt?: string;
      };
      await executeCliCommand(
        options,
        "contract.register-details",
        {
          contract_id: contractId,
          obligations: parseJsonArray(local.obligationsJson, "obligations"),
          ...(local.termination ? { termination_terms: local.termination } : {}),
          ...(local.confidentiality ? { confidentiality_terms: local.confidentiality } : {}),
          ...(local.ip ? { ip_terms: local.ip } : {}),
          ...(local.governing ? { governing_reference: local.governing } : {}),
          ...(local.signedArtifact ? { signed_artifact_ref: local.signedArtifact } : {}),
          ...(local.signedAt ? { signed_at: local.signedAt } : {}),
          ...(local.effectiveAt ? { effective_at: local.effectiveAt } : {}),
          ...(local.endsAt ? { ends_at: local.endsAt } : {}),
        },
        contractId,
      );
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
    .option("--deliverable <id...>")
    .option("--source-term <id>")
    .action(async function action(this: Command, contractId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        amountMinor: string;
        currency: string;
        title?: string;
        dueAt?: string;
        reference?: string;
        deliverable?: string[];
        sourceTerm?: string;
      };
      await executeCliCommand(options, "invoice.create-for-contract", {
        contract_id: contractId,
        amount_minor: Number.parseInt(local.amountMinor, 10),
        currency: local.currency,
        ...(local.title ? { title: local.title } : {}),
        ...(local.dueAt ? { due_at: local.dueAt } : {}),
        ...(local.reference ? { reference: local.reference } : {}),
        deliverable_ids: local.deliverable ?? [],
        ...(local.sourceTerm ? { source_term_id: local.sourceTerm } : {}),
      });
    });

  domainCommands
    .get("invoice")
    ?.command("issue")
    .argument("<invoice-id>")
    .option("--issued-at <iso-date>")
    .option("--evidence <id...>")
    .action(async function action(this: Command, invoiceId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { issuedAt?: string; evidence?: string[] };
      await executeCliCommand(
        options,
        "invoice.issue",
        {
          invoice_id: invoiceId,
          ...(local.issuedAt ? { issued_at: local.issuedAt } : {}),
          evidence_ids: local.evidence ?? [],
        },
        invoiceId,
      );
    });

  domainCommands
    .get("invoice")
    ?.command("update-lifecycle")
    .argument("<invoice-id>")
    .requiredOption("--stage <stage>")
    .option("--paid-amount-minor <amount>")
    .option("--reason <text>")
    .option("--evidence <id...>")
    .action(async function action(this: Command, invoiceId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        stage: string;
        paidAmountMinor?: string;
        reason?: string;
        evidence?: string[];
      };
      await executeCliCommand(
        options,
        "invoice.update-lifecycle",
        {
          invoice_id: invoiceId,
          stage: local.stage,
          ...(local.paidAmountMinor
            ? { paid_amount_minor: Number.parseInt(local.paidAmountMinor, 10) }
            : {}),
          ...(local.reason ? { reason: local.reason } : {}),
          evidence_ids: local.evidence ?? [],
        },
        invoiceId,
      );
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
    ?.command("confirm")
    .argument("<payment-id>")
    .requiredOption("--evidence <id>")
    .option("--provider <provider>")
    .option("--provider-reference <reference>")
    .action(async function action(this: Command, paymentId: string) {
      const options = globalOptions(this);
      const local = this.opts() as {
        evidence: string;
        provider?: string;
        providerReference?: string;
      };
      await executeCliCommand(
        options,
        "payment.confirm",
        {
          payment_id: paymentId,
          provider_evidence_id: local.evidence,
          ...(local.provider ? { provider: local.provider } : {}),
          ...(local.providerReference ? { provider_reference: local.providerReference } : {}),
        },
        paymentId,
      );
    });

  domainCommands
    .get("payment")
    ?.command("reconcile")
    .argument("<payment-id>")
    .requiredOption("--reference <reference>")
    .option("--evidence <id>")
    .action(async function action(this: Command, paymentId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { reference: string; evidence?: string };
      await executeCliCommand(
        options,
        "payment.reconcile",
        {
          payment_id: paymentId,
          reference: local.reference,
          ...(local.evidence ? { evidence_id: local.evidence } : {}),
        },
        paymentId,
      );
    });

  domainCommands
    .get("payment")
    ?.command("prepare-reminder")
    .argument("<invoice-id>")
    .requiredOption("--message <text>")
    .option("--channel <channel>")
    .action(async function action(this: Command, invoiceId: string) {
      const options = globalOptions(this);
      const local = this.opts() as { message: string; channel?: string };
      await executeCliCommand(
        options,
        "payment.prepare-reminder",
        {
          invoice_id: invoiceId,
          message: local.message,
          ...(local.channel ? { channel: local.channel } : {}),
        },
        invoiceId,
      );
    });
}

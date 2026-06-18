import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createCommandEnvelope } from "@guilherme-studio/schemas";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import { executeStudioCommand } from "./command-runtime.js";
import { createStudioContext, operatorActor } from "./index.js";

describe("Studio command runtime", () => {
  it("executes the same semantic command through the normalized command contract", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-runtime-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "Runtime test",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["operations"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47835 },
        adapters: {},
      }),
    );
    const context = await createStudioContext(root);
    const result = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "entity.create",
        actor: operatorActor(context.config.operator_id),
        payload: { kind: "task", title: "Runtime task" },
        idempotencyKey: "runtime-task-create",
      }),
    );

    expect(result).toMatchObject({
      status: "ok",
      result: {
        action: "entity.create",
        entity: { kind: "task" },
      },
    });
  });

  it("archives and relates canonical entities through the command runtime", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-runtime-entity-governance-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "Runtime entity governance test",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["operations"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47835 },
        adapters: {},
      }),
    );
    const context = await createStudioContext(root);
    const actor = operatorActor(context.config.operator_id);
    const task = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "entity.create",
        actor,
        payload: { kind: "task", title: "Governed source" },
      }),
    );
    const target = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "entity.create",
        actor,
        payload: { kind: "task", title: "Governed target" },
      }),
    );
    const taskId = entityIdFromResult(task);
    const targetId = entityIdFromResult(target);

    const related = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "entity.relate",
        actor,
        targetId: taskId,
        payload: {
          relation_type: "supports",
          target_id: targetId,
          note: "Runtime relation",
        },
      }),
    );
    const archived = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "entity.archive",
        actor,
        targetId: taskId,
        expectedRevision: 2,
        payload: {},
      }),
    );

    expect(related).toMatchObject({
      status: "ok",
      result: {
        action: "entity.relate",
        revision: 2,
        entity: {
          relations: [{ type: "supports", target_id: targetId, note: "Runtime relation" }],
        },
      },
    });
    expect(archived).toMatchObject({
      status: "ok",
      result: {
        action: "entity.archive",
        revision: 3,
        entity: {
          spec: { status: "archived" },
          metadata: { archived_at: expect.any(String) },
        },
      },
    });
  });

  it("prepares and publishes product releases with explicit evidence", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-runtime-release-governance-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "Runtime release governance test",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["products", "operations"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47835 },
        adapters: {},
      }),
    );
    const context = await createStudioContext(root);
    const actor = operatorActor(context.config.operator_id);
    const product = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "entity.create",
        actor,
        payload: { kind: "product", title: "Governed product" },
      }),
    );
    const productId = entityIdFromResult(product);
    const prepared = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "release.prepare",
        actor,
        payload: {
          product_id: productId,
          version: "1.0.0",
          changelog: "Initial release.",
          compatibility_notes: "Compatible with the local WordPress fixture.",
          migration_notes: "No migration required.",
          public_api_notes: "No public API break.",
          test_commands: ["npm run verify"],
          asset_ids: ["ast_fixture"],
          package_path: "products/governed/dist/plugin.zip",
          roadmap_claims: ["Future marketplace automation"],
          implemented_capabilities: ["Elementor widget"],
        },
      }),
    );
    const releaseId = entityIdFromResult(prepared);
    const evidence = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "evidence.register",
        actor,
        payload: {
          title: "Release verification",
          evidence_type: "command",
          command: "npm run verify",
          claims: ["Release verified"],
        },
      }),
    );
    const evidenceId = entityIdFromResult(evidence);
    const published = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "release.publish",
        actor,
        targetId: releaseId,
        payload: {
          release_id: releaseId,
          evidence_ids: [evidenceId],
          demo_url: "https://example.com/demo",
        },
      }),
    );

    expect(prepared).toMatchObject({
      status: "ok",
      result: {
        action: "release.prepare",
        entity: {
          spec: {
            version: "1.0.0",
            stage: "prepared",
            changelog: "Initial release.",
            compatibility_notes: "Compatible with the local WordPress fixture.",
            migration_notes: "No migration required.",
            test_commands: ["npm run verify"],
            asset_ids: ["ast_fixture"],
            roadmap_claims: ["Future marketplace automation"],
            implemented_capabilities: ["Elementor widget"],
          },
        },
      },
    });
    expect(published).toMatchObject({
      status: "ok",
      result: {
        action: "release.publish",
        entity: {
          spec: {
            status: "published",
            stage: "published",
            evidence_ids: [evidenceId],
            demo_url: "https://example.com/demo",
          },
          relations: expect.arrayContaining([{ type: "supported_by", target_id: evidenceId }]),
        },
      },
    });
  });

  it("runs governed sales from prospect research to accepted proposal conversion", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-runtime-sales-governance-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "Runtime sales governance test",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["data", "sales", "clients", "operations"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47835 },
        adapters: {},
      }),
    );
    const context = await createStudioContext(root);
    const actor = operatorActor(context.config.operator_id);
    const prospect = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "entity.create",
        actor,
        payload: { kind: "prospect", title: "Governed agency prospect" },
      }),
    );
    const prospectId = entityIdFromResult(prospect);
    const evidence = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "evidence.register",
        actor,
        payload: {
          title: "Prospect source evidence",
          evidence_type: "manual",
          claims: ["Prospect has a visible Elementor rebuild need"],
        },
      }),
    );
    const evidenceId = entityIdFromResult(evidence);
    const icp = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "sales.record-icp",
        actor,
        payload: {
          business_types: ["agency"],
          needs: ["Elementor implementation support"],
          budget_logic: "Fixed-scope implementation package",
          technologies: ["WordPress", "Elementor"],
          delivery_fit: ["async discovery", "bounded implementation"],
          offer_evidence_map: [
            {
              profile: "agency",
              offer: "WordPress implementation sprint",
              proof_claims: ["Elementor quote flow evidence"],
              evidence_ids: [evidenceId],
            },
          ],
        },
      }),
    );
    const researched = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "prospect.research",
        actor,
        targetId: prospectId,
        payload: {
          prospect_id: prospectId,
          source: "manual research",
          observed_situation: "Prospect shows public Elementor customization demand.",
          likely_need: "Implementation support for bounded WordPress work.",
          fit_evidence: ["Elementor", "WordPress"],
          reason_for_contact: "Public site signals a concrete implementation need.",
          evidence_ids: [evidenceId],
        },
      }),
    );
    const outreach = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "outreach.prepare",
        actor,
        payload: {
          subject_id: prospectId,
          recipient: "lead@example.com",
          channel: "email",
          message: "I noticed a concrete Elementor implementation need.",
          cta: "Would a fixed-scope implementation sprint help?",
          evidence_ids: [evidenceId],
        },
      }),
    );
    const outreachAction = preparedActionFromResult(outreach);
    await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "action.confirm",
        actor,
        payload: {
          action_id: outreachAction.id,
          payload_checksum: outreachAction.payload_checksum,
        },
      }),
    );
    const communication = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "outreach.record-result",
        actor,
        payload: {
          prepared_action_id: outreachAction.id,
          outcome: "sent-manually",
          response_summary: "Manual fixture send was recorded without external adapter execution.",
        },
      }),
    );
    const opportunity = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "opportunity.create",
        actor,
        payload: {
          title: "Governed WordPress sprint",
          prospect_id: prospectId,
          owner_id: context.config.operator_id,
          next_action: "Run discovery call",
          potential_value_minor: 250_000,
          currency: "USD",
        },
      }),
    );
    const opportunityId = entityIdFromResult(opportunity);
    const discovery = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "opportunity.record-discovery",
        actor,
        targetId: opportunityId,
        payload: {
          opportunity_id: opportunityId,
          summary: "Agency needs bounded Elementor implementation.",
          need: "Build a fixed WordPress implementation package.",
          urgency: "launch window in July",
          budget_signal: "budget owner discussed fixed scope",
          authority_signal: "owner is decision maker",
          competition: "internal team backlog",
          next_action: "Prepare proposal",
          owner_id: context.config.operator_id,
          probability: 60,
          probability_source: "operator-estimate",
          evidence_ids: [evidenceId],
        },
      }),
    );
    const proposal = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "proposal.prepare",
        actor,
        payload: {
          opportunity_id: opportunityId,
          title: "Governed implementation proposal",
          offer_ref: "wordpress-implementation-sprint",
          scope: ["Elementor implementation", "QA pass"],
          exclusions: ["Unbounded brand redesign"],
          schedule: "Two week sprint",
          assumptions: ["Client provides copy and access"],
          price_logic: "Fixed project fee",
          payment_terms: "50% upfront, 50% on acceptance",
          acceptance_criteria: ["Client accepts QA checklist"],
          value_minor: 250_000,
          currency: "USD",
          evidence_ids: [evidenceId],
        },
      }),
    );
    const proposalId = entityIdFromResult(proposal);
    const negotiation = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "opportunity.record-negotiation",
        actor,
        targetId: opportunityId,
        payload: {
          opportunity_id: opportunityId,
          requested_change: "Add one extra landing section.",
          scope_impact: "Adds one bounded section",
          price_impact: "No price change in fixture",
          risk_impact: "Low risk if copy is supplied",
          timing_impact: "No schedule change",
          decision: "accepted",
          evidence_ids: [evidenceId],
        },
      }),
    );
    const reviewed = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "proposal.review",
        actor,
        targetId: proposalId,
        payload: {
          proposal_id: proposalId,
          review_notes: "Claims, terms and attachments reviewed.",
          evidence_ids: [evidenceId],
        },
      }),
    );
    const preparedSend = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "proposal.prepare-send",
        actor,
        targetId: proposalId,
        payload: {
          proposal_id: proposalId,
          recipient: "lead@example.com",
          channel: "email",
          message: "Sending the reviewed implementation proposal.",
          artifact_ref: "sales/proposals/governed-implementation-v1.pdf",
          artifact_checksum: "b".repeat(64),
        },
      }),
    );
    const sendAction = preparedActionFromResult(preparedSend);
    await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "action.confirm",
        actor,
        payload: {
          action_id: sendAction.id,
          payload_checksum: sendAction.payload_checksum,
        },
      }),
    );
    const sent = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "proposal.mark-sent",
        actor,
        targetId: proposalId,
        payload: {
          proposal_id: proposalId,
          prepared_action_id: sendAction.id,
        },
      }),
    );
    const acceptance = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "evidence.register",
        actor,
        payload: {
          title: "Proposal acceptance evidence",
          evidence_type: "manual",
          claims: ["Prospect accepted proposal terms"],
        },
      }),
    );
    const acceptanceId = entityIdFromResult(acceptance);
    const accepted = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "proposal.record-response",
        actor,
        targetId: proposalId,
        payload: {
          proposal_id: proposalId,
          response: "accepted",
          evidence_id: acceptanceId,
        },
      }),
    );
    const converted = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "opportunity.convert",
        actor,
        payload: {
          opportunity_id: opportunityId,
          client_title: "Governed agency client",
          engagement_title: "Governed WordPress sprint engagement",
        },
      }),
    );
    const lostOpportunity = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "opportunity.create",
        actor,
        payload: {
          title: "Governed lost opportunity",
          owner_id: context.config.operator_id,
          next_action: "Close cleanly",
        },
      }),
    );
    const lostOpportunityId = entityIdFromResult(lostOpportunity);
    const closedLost = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "opportunity.close-lost",
        actor,
        targetId: lostOpportunityId,
        payload: {
          opportunity_id: lostOpportunityId,
          reason: "Budget mismatch",
          lesson: "Qualify budget signal earlier.",
        },
      }),
    );

    expect(icp).toMatchObject({
      status: "ok",
      result: { entity: { spec: { decision_type: "sales_icp_strategy" } } },
    });
    expect(researched).toMatchObject({
      status: "ok",
      result: {
        entity: {
          spec: {
            stage: "researched",
            reason_for_contact: "Public site signals a concrete implementation need.",
          },
        },
      },
    });
    expect(communication).toMatchObject({
      status: "ok",
      result: { entity: { kind: "communication", spec: { external_send: false } } },
    });
    expect(discovery).toMatchObject({
      status: "ok",
      result: { entity: { spec: { stage: "discovery_recorded", probability: 60 } } },
    });
    expect(negotiation).toMatchObject({
      status: "ok",
      result: { entity: { spec: { stage: "negotiation" } } },
    });
    expect(reviewed).toMatchObject({
      status: "ok",
      result: { entity: { spec: { review_status: "reviewed" } } },
    });
    expect(preparedSend).toMatchObject({
      status: "ok",
      result: {
        action_type: "proposal.send",
        status: "awaiting_confirmation",
        provider: "fake-local",
        source_revisions: { [proposalId]: expect.any(Number), [opportunityId]: expect.any(Number) },
      },
    });
    expect(sent).toMatchObject({
      status: "ok",
      result: {
        entity: {
          spec: {
            stage: "sent",
            sent_artifact_checksum: "b".repeat(64),
            immutable_from_revision: expect.any(Number),
          },
        },
      },
    });
    expect(accepted).toMatchObject({
      status: "ok",
      result: {
        entity: {
          spec: {
            stage: "accepted",
            acceptance_evidence_id: acceptanceId,
          },
        },
      },
    });
    expect(converted).toMatchObject({
      status: "ok",
      result: {
        opportunity: { spec: { status: "won", accepted_proposal_id: proposalId } },
        client: { kind: "client" },
        engagement: { kind: "engagement", spec: { proposal_id: proposalId } },
      },
    });
    expect(closedLost).toMatchObject({
      status: "ok",
      result: {
        entity: { spec: { status: "lost", lost_reason: "Budget mismatch" } },
      },
    });
  });

  it("keeps finance terms, obligations, reminders and payment evidence distinct", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-runtime-finance-governance-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "Runtime finance governance test",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["clients", "operations"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47835 },
        adapters: {},
      }),
    );
    const context = await createStudioContext(root);
    const actor = operatorActor(context.config.operator_id);
    const engagement = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "entity.create",
        actor,
        payload: { kind: "engagement", title: "Governed engagement" },
      }),
    );
    const engagementId = entityIdFromResult(engagement);
    const contract = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "contract.create-from-engagement",
        actor,
        payload: {
          engagement_id: engagementId,
          title: "Governed contract",
          value_minor: 120_000,
          currency: "USD",
        },
      }),
    );
    const contractId = entityIdFromResult(contract);
    const terms = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "contract.register-terms",
        actor,
        targetId: contractId,
        payload: {
          contract_id: contractId,
          total_minor: 120_000,
          currency: "USD",
          deposit_minor: 40_000,
          deposit_due_at: "2026-07-01T12:00:00.000Z",
          installments: [
            {
              id: "milestone-1",
              title: "Milestone 1",
              amount_minor: 80_000,
              due_at: "2026-08-01T12:00:00.000Z",
            },
          ],
          warranty_ends_at: "2026-09-01T12:00:00.000Z",
          acceptance_conditions: ["Client signs delivery acceptance"],
        },
      }),
    );
    const details = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "contract.register-details",
        actor,
        targetId: contractId,
        payload: {
          contract_id: contractId,
          obligations: [
            {
              id: "obl-delivery",
              text: "Deliver accepted website package.",
              source_ref: "contract.section.delivery",
              owner: "studio",
              due_at: "2026-08-05T12:00:00.000Z",
            },
          ],
          confidentiality_terms: "Keep client materials confidential.",
          ip_terms: "Transfer implementation rights after settlement.",
        },
      }),
    );
    const invoice = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "invoice.create-for-contract",
        actor,
        payload: {
          contract_id: contractId,
          title: "Governed invoice",
          amount_minor: 40_000,
          currency: "USD",
          due_at: "2026-07-01T12:00:00.000Z",
          reference: "deposit",
        },
      }),
    );
    const invoiceId = entityIdFromResult(invoice);
    const issued = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "invoice.issue",
        actor,
        targetId: invoiceId,
        payload: { invoice_id: invoiceId },
      }),
    );
    const expectedPayment = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "payment.record-for-invoice",
        actor,
        payload: {
          invoice_id: invoiceId,
          title: "Expected deposit",
          amount_minor: 40_000,
          currency: "USD",
          expected_at: "2026-07-02T12:00:00.000Z",
        },
      }),
    );
    const paymentId = entityIdFromResult(expectedPayment);
    const reminder = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "payment.prepare-reminder",
        actor,
        targetId: invoiceId,
        payload: {
          invoice_id: invoiceId,
          channel: "email",
          message: "Reminder text for exact-payload review.",
        },
      }),
    );
    const evidence = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "evidence.register",
        actor,
        payload: {
          title: "Provider payment evidence",
          evidence_type: "manual",
          claims: ["Provider confirmed deposit payment"],
        },
      }),
    );
    const evidenceId = entityIdFromResult(evidence);
    const confirmed = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "payment.confirm",
        actor,
        targetId: paymentId,
        payload: {
          payment_id: paymentId,
          provider_evidence_id: evidenceId,
          provider: "manual",
          provider_reference: "provider-123",
        },
      }),
    );
    const reconciled = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "payment.reconcile",
        actor,
        targetId: paymentId,
        payload: {
          payment_id: paymentId,
          reference: "bank-ledger-123",
        },
      }),
    );
    const obligations = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "finance.resolve-obligations",
        actor,
        payload: { contract_id: contractId },
      }),
    );
    const report = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "finance.reconciliation-report",
        actor,
        payload: {},
      }),
    );
    const economic = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "finance.economic-view",
        actor,
        payload: { include_legal_tax_note: true },
      }),
    );

    expect(terms).toMatchObject({
      status: "ok",
      result: {
        entity: {
          spec: {
            commercial_terms: {
              total_minor: 120_000,
              deposit_minor: 40_000,
              acceptance_conditions: ["Client signs delivery acceptance"],
            },
          },
        },
      },
    });
    expect(details).toMatchObject({
      status: "ok",
      result: {
        entity: {
          spec: {
            obligations: [
              {
                id: "obl-delivery",
                authority: "contract-text",
                status: "open",
              },
            ],
          },
        },
      },
    });
    expect(issued).toMatchObject({
      status: "ok",
      result: { entity: { spec: { status: "active", stage: "issued" } } },
    });
    expect(reminder).toMatchObject({
      status: "ok",
      result: {
        action_type: "finance.payment-reminder.prepare",
        provider: "fake/local",
        target: invoiceId,
        status: "awaiting_confirmation",
        source_revisions: { [invoiceId]: expect.any(Number), [contractId]: expect.any(Number) },
      },
    });
    expect(confirmed).toMatchObject({
      status: "ok",
      result: {
        entity: {
          spec: {
            status: "active",
            stage: "confirmed",
            provider_evidence_id: evidenceId,
          },
        },
      },
    });
    expect(reconciled).toMatchObject({
      status: "ok",
      result: {
        entity: {
          spec: {
            status: "paid",
            stage: "reconciled",
            reconciliation_reference: "bank-ledger-123",
          },
        },
      },
    });
    expect(obligations).toMatchObject({
      status: "ok",
      result: {
        obligations: expect.arrayContaining([
          expect.objectContaining({ source_ref: "contract.section.delivery" }),
          expect.objectContaining({ type: "invoice_due", source_id: invoiceId }),
        ]),
      },
    });
    expect(report).toMatchObject({
      status: "ok",
      result: {
        unmatched_payments: [],
        open_payments: [],
      },
    });
    expect(economic).toMatchObject({
      status: "ok",
      result: {
        active_contract_value_minor: 120_000,
        reconciled_revenue_minor: 40_000,
        note: "Operational record only; not legal, tax, accounting or banking advice.",
      },
    });
  });

  it("operates the LinkedIn career pipeline with evidence-backed submission gates", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-runtime-career-governance-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "Runtime career governance test",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["career", "data", "operations"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47835 },
        adapters: {},
      }),
    );
    const context = await createStudioContext(root);
    const actor = operatorActor(context.config.operator_id);
    const organization = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "entity.create",
        actor,
        payload: { kind: "organization", title: "Remote Studio" },
      }),
    );
    const organizationId = entityIdFromResult(organization);
    const evidence = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "evidence.register",
        actor,
        payload: {
          title: "Portfolio evidence",
          evidence_type: "manual",
          claims: ["Elementor implementation evidence exists"],
        },
      }),
    );
    const evidenceId = entityIdFromResult(evidence);
    const strategy = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "career.record-strategy",
        actor,
        payload: {
          role_families: ["WordPress Developer"],
          employment_types: ["remote"],
          geographies: ["US", "EU"],
          timezone: "America/Sao_Paulo overlap",
          unacceptable_constraints: ["unpaid tests"],
          evidence_map: [
            {
              role_family: "WordPress Developer",
              required_signal: "Elementor implementation",
              evidence_ids: [evidenceId],
            },
          ],
        },
      }),
    );
    const opportunity = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "application.register-opportunity",
        actor,
        payload: {
          title: "LinkedIn Elementor role",
          source_url: "https://www.linkedin.com/jobs/view/123",
          organization_id: organizationId,
          role_family: "WordPress Developer",
          requirements: [
            { text: "Elementor implementation", type: "explicit" },
            { text: "WordPress plugin development", type: "explicit" },
          ],
          deadline_at: "2026-07-01T12:00:00.000Z",
        },
      }),
    );
    const opportunityId = entityIdFromResult(opportunity);
    const fit = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "application.analyze-fit",
        actor,
        targetId: opportunityId,
        payload: {
          application_id: opportunityId,
          verified_signals: ["Elementor implementation", "WordPress plugin development"],
          evidence_ids: [evidenceId],
        },
      }),
    );
    const application = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "application.prepare",
        actor,
        payload: {
          title: "LinkedIn Elementor role application",
          source_url: "https://www.linkedin.com/jobs/view/123",
          organization_id: organizationId,
          role_family: "WordPress Developer",
          resume_ref: "career/materials/resume-wordpress.pdf",
          cover_message: "Evidence-backed cover message.",
          portfolio_links: ["https://portfolio.example/cases/elementor"],
          evidence_ids: [evidenceId],
        },
      }),
    );
    const applicationId = entityIdFromResult(application);
    const validated = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "application.validate",
        actor,
        targetId: applicationId,
        payload: { application_id: applicationId },
      }),
    );
    const preparedSubmission = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "application.prepare-submission",
        actor,
        targetId: applicationId,
        payload: {
          application_id: applicationId,
          channel: "linkedin",
        },
      }),
    );
    const action = preparedActionFromResult(preparedSubmission);
    const confirmedAction = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "action.confirm",
        actor,
        payload: {
          action_id: action.id,
          payload_checksum: action.payload_checksum,
        },
      }),
    );
    const submitted = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "application.record-submission",
        actor,
        targetId: applicationId,
        payload: {
          application_id: applicationId,
          prepared_action_id: action.id,
          reference: "manual-linkedin-submit",
        },
      }),
    );
    const interview = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "application.record-interview",
        actor,
        targetId: applicationId,
        payload: {
          application_id: applicationId,
          interview_at: "2026-07-05T12:00:00.000Z",
          notes: "Recruiter screen scheduled.",
        },
      }),
    );
    const contextRun = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "application.interview-context",
        actor,
        targetId: applicationId,
        payload: {
          application_id: applicationId,
          next_action: "Prepare concise evidence-backed interview answers.",
        },
      }),
    );
    const outcome = await executeStudioCommand(
      context,
      createCommandEnvelope({
        command: "application.record-outcome",
        actor,
        targetId: applicationId,
        payload: {
          application_id: applicationId,
          outcome: "rejected",
          reason: "Role required enterprise React depth.",
          learning_notes: "Add React proof only after enough repeated signal.",
          sample_size: 1,
          evidence_ids: [evidenceId],
        },
      }),
    );

    expect(strategy).toMatchObject({
      status: "ok",
      result: { entity: { kind: "decision", spec: { decision_type: "career_role_strategy" } } },
    });
    expect(fit).toMatchObject({
      status: "ok",
      result: {
        entity: {
          spec: {
            stage: "analyzed",
            fit_analysis: { recommendation: "apply", gaps: [] },
          },
        },
      },
    });
    expect(validated).toMatchObject({
      status: "ok",
      result: {
        entity: {
          spec: { stage: "validated", validation: { status: "valid", missing: [] } },
        },
      },
    });
    expect(preparedSubmission).toMatchObject({
      status: "ok",
      result: {
        action_type: "career.application-submit.prepare",
        provider: "fake/local",
        target: applicationId,
        status: "awaiting_confirmation",
      },
    });
    expect(confirmedAction).toMatchObject({ status: "ok", result: { status: "confirmed" } });
    expect(submitted).toMatchObject({
      status: "ok",
      result: {
        entity: {
          spec: {
            stage: "submitted",
            submission_prepared_action_id: action.id,
            submission_payload_checksum: action.payload_checksum,
          },
        },
      },
    });
    expect(interview).toMatchObject({
      status: "ok",
      result: { entity: { spec: { stage: "interview" } } },
    });
    expect(contextRun).toMatchObject({
      status: "ok",
      result: {
        entity: {
          kind: "agentRun",
          spec: {
            state: "oriented",
            context_pack: {
              included_entity_ids: expect.arrayContaining([applicationId]),
            },
          },
        },
      },
    });
    expect(outcome).toMatchObject({
      status: "ok",
      result: {
        entity: {
          spec: {
            stage: "rejected",
            outcome: "rejected",
            sample_size_warning: expect.stringContaining("Tiny sample"),
          },
        },
      },
    });
  });
});

function entityIdFromResult(result: { result?: unknown }): string {
  const payload = result.result as { entity_id?: unknown };
  if (typeof payload?.entity_id !== "string") {
    throw new Error(`Missing entity_id in result: ${JSON.stringify(result)}`);
  }
  return payload.entity_id;
}

function preparedActionFromResult(result: { result?: unknown }): {
  id: string;
  payload_checksum: string;
} {
  const payload = result.result as { id?: unknown; payload_checksum?: unknown };
  if (typeof payload?.id !== "string" || typeof payload.payload_checksum !== "string") {
    throw new Error(`Missing prepared action in result: ${JSON.stringify(result)}`);
  }
  return { id: payload.id, payload_checksum: payload.payload_checksum };
}

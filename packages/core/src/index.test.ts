import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createActor } from "@guilherme-studio/schemas";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import {
  AuthorityService,
  createStudioContext,
  createWorkflowFixtureEntities,
  DomainCommandService,
  EntityService,
  EvidenceClaimService,
  executeWorkflowFixtures,
  gateCatalogIds,
  LifecycleEngine,
  operatorActor,
  PreparedActionService,
  type StudioContext,
  verifyWorkflowCoverage,
} from "./index.js";

describe("core governance", () => {
  it("rejects invalid terminal lifecycle transitions", () => {
    const lifecycle = new LifecycleEngine();

    expect(lifecycle.canTransition("opportunity", "active", "won")).toBe(true);
    expect(() => lifecycle.assertTransition("opportunity", "won", "active")).toThrow(
      /Invalid opportunity lifecycle transition/,
    );
  });

  it("confirms and executes only the exact prepared payload", async () => {
    const runtime = await mkdtemp(path.join(os.tmpdir(), "studio-core-test-"));
    const context = {
      config: { operator_id: "per_20260614_guilherme-silva" },
      paths: { runtime },
    } as StudioContext;
    const service = new PreparedActionService(context);
    const prepared = await service.prepare({
      actionType: "communication.send",
      payload: { channel: "whatsapp", message: "Hello" },
    });

    await expect(service.confirm(prepared.id, "0".repeat(64))).rejects.toThrow(
      /payload checksum mismatch/,
    );
    const confirmed = await service.confirm(prepared.id, prepared.payload_checksum);
    expect(confirmed.status).toBe("confirmed");

    const executed = await service.execute(prepared.id, async () => ({ message_id: "local-test" }));
    expect(executed.status).toBe("executed");
    expect(executed.reconciliation).toEqual({ message_id: "local-test" });

    const reconciled = await service.reconcile(prepared.id, { delivered: true });
    expect(reconciled.status).toBe("reconciled");
    expect(reconciled.reconciliation).toMatchObject({
      message_id: "local-test",
      delivered: true,
    });
  });

  it("uses default deny when an actor lacks a required capability", () => {
    const actor = operatorActor("per_20260614_guilherme-silva");
    const restricted = createActor({
      ...actor,
      capabilities: ["entity.read"],
    });

    expect(() => new AuthorityService().assertCapability(restricted, "external.execute")).toThrow(
      /lacks capability/,
    );
  });

  it("creates an engagement only from a won opportunity", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-domain-test-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "Domain test",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["sales", "clients"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47832 },
        adapters: {},
      }),
    );
    const context = await createStudioContext(root);
    const entities = new EntityService(context);
    const commands = new DomainCommandService(context);
    const opportunity = await entities.create({
      kind: "opportunity",
      title: "Qualified WordPress build",
    });

    await expect(commands.createEngagementFromOpportunity(opportunity.metadata.id)).rejects.toThrow(
      /won opportunities/,
    );
    await entities.transition(opportunity.metadata.id, "won");
    const engagement = await commands.createEngagementFromOpportunity(opportunity.metadata.id);
    expect(engagement.kind).toBe("engagement");
    expect(engagement.relations[0]?.target_id).toBe(opportunity.metadata.id);
  });

  it("covers all eight normative journeys with canonical fixtures", () => {
    const verification = verifyWorkflowCoverage(createWorkflowFixtureEntities());

    expect(verification).toHaveLength(8);
    expect(verification.every((workflow) => workflow.ok)).toBe(true);
  });

  it("executes all eight normative journeys through Studio commands", async () => {
    const report = await executeWorkflowFixtures();

    expect(report).toMatchObject({
      ok: true,
      mode: "executed-fixtures",
    });
    expect(report.workflows).toHaveLength(8);
    expect(report.workflows.every((workflow) => workflow.steps.length > 0)).toBe(true);
    expect(
      report.workflows.every((workflow) => workflow.event_count >= workflow.steps.length),
    ).toBe(true);
  });

  it("creates cases, repository links and handoffs through semantic commands", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-semantic-test-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "Semantic test",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["portfolio", "operations", "data"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47834 },
        adapters: {},
      }),
    );
    const context = await createStudioContext(root);
    const entities = new EntityService(context);
    const commands = new DomainCommandService(context);
    const project = await entities.create({ kind: "project", title: "Portfolio site" });
    const task = await entities.create({ kind: "task", title: "Implement portfolio site" });
    const evidence = await commands.registerEvidence({
      title: "Approved implementation",
      evidenceType: "manual",
      subjectId: project.metadata.id,
    });

    const portfolioCase = await commands.createPortfolioCaseFromEvidence({
      evidenceId: evidence.metadata.id,
      title: "Portfolio implementation case",
    });
    const linked = await commands.registerProjectRepository({
      projectId: project.metadata.id,
      title: "Portfolio repository",
      repositoryPath: "wordpress",
      branch: "main",
    });
    const handoff = await commands.createHandoff({
      taskId: task.metadata.id,
      title: "Portfolio continuation handoff",
      objective: "Continue implementation from approved evidence.",
      summary: "Read the case evidence and verify repository health first.",
      repositoryIds: [linked.repository.metadata.id],
    });

    expect(portfolioCase.kind).toBe("portfolioCase");
    expect(linked.project.spec.repository_id).toBe(linked.repository.metadata.id);
    expect(handoff.kind).toBe("agentRun");
  });

  it("runs cross-domain semantic commands without fabricating external records", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-prd-domain-test-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "PRD domain test",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["data", "sales", "clients", "marketing", "operations"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47836 },
        adapters: {},
      }),
    );
    const context = await createStudioContext(root);
    const entities = new EntityService(context);
    const commands = new DomainCommandService(context);
    await entities.create({
      kind: "organization",
      title: "Acme Studio",
      data: { website: "https://acme.test" },
    });
    const opportunity = await entities.create({
      kind: "opportunity",
      title: "Acme WordPress build",
    });

    const duplicates = await commands.reviewDuplicates({
      title: "Acme",
      website: "https://acme.test/",
    });
    expect(duplicates.candidates[0]).toMatchObject({
      kind: "organization",
      reasons: expect.arrayContaining(["website"]),
    });

    const converted = await commands.convertOpportunity({
      opportunityId: opportunity.metadata.id,
      clientTitle: "Acme Studio",
    });
    expect(converted.opportunity.spec.status).toBe("won");
    expect(converted.client.kind).toBe("client");
    expect(converted.engagement.spec.client_id).toBe(converted.client.metadata.id);

    const contract = await commands.createContractFromEngagement({
      engagementId: converted.engagement.metadata.id,
      valueMinor: 120_000,
      currency: "USD",
    });
    const invoice = await commands.createInvoiceForContract({
      contractId: contract.metadata.id,
      amountMinor: 120_000,
      currency: "USD",
      reference: "INV-001",
    });
    const payment = await commands.recordPaymentForInvoice({
      invoiceId: invoice.metadata.id,
      amountMinor: 120_000,
      currency: "USD",
    });
    const reconciled = await commands.reconcilePayment(payment.metadata.id, {
      reference: "bank-confirmation-001",
    });
    expect(reconciled.spec.status).toBe("paid");
    expect(reconciled.spec.reconciliation_reference).toBe("bank-confirmation-001");
  });

  it("requires evidence for completion and publication preconditions", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "studio-precondition-test-"));
    await writeFile(
      path.join(root, "studio.config.yaml"),
      YAML.stringify({
        api_version: "studio.guilherme.dev/config-v1",
        root_name: "Precondition test",
        operator_id: "per_20260614_guilherme-silva",
        canonical_roots: ["clients", "products", "operations", "marketing"],
        runtime_path: "runtime",
        panel: { host: "127.0.0.1", port: 47837 },
        adapters: {},
      }),
    );
    const context = await createStudioContext(root);
    const entities = new EntityService(context);
    const commands = new DomainCommandService(context);
    const deliverable = await entities.create({ kind: "deliverable", title: "Template QA" });
    const evidence = await commands.registerEvidence({
      title: "Acceptance screenshot",
      evidenceType: "screenshot",
      subjectId: deliverable.metadata.id,
      checksum: "f".repeat(64),
      claims: ["Evidence-backed WordPress delivery"],
    });

    await expect(entities.transition(deliverable.metadata.id, "done")).rejects.toThrow(
      /preconditions/,
    );
    const completed = await commands.completeDeliverable({
      deliverableId: deliverable.metadata.id,
      evidenceIds: [evidence.metadata.id],
    });
    expect(completed.spec.status).toBe("done");

    const campaign = await entities.create({ kind: "campaign", title: "Proof campaign" });
    const content = await commands.prepareContent({
      campaignId: campaign.metadata.id,
      title: "Case announcement",
      channel: "linkedin",
      publicClaims: ["Evidence-backed WordPress delivery"],
      evidenceIds: [evidence.metadata.id],
    });
    const decision = await commands.recordDecision({
      title: "Keep portfolio frozen",
      decision: "Portfolio remains frozen until PRD gate is green.",
      evidenceIds: [evidence.metadata.id],
    });
    expect(content.kind).toBe("contentItem");
    expect(decision.spec.evidence_ids).toContain(evidence.metadata.id);
  });

  it("exposes the normative gate catalog and validates claim evidence", async () => {
    expect(gateCatalogIds()).toEqual(
      expect.arrayContaining([
        "duplicate-check",
        "missing-evidence",
        "public-claim",
        "external-confirmation",
        "payment-delivery",
        "confidential-data",
        "destructive",
        "stale-revision",
        "restore-required",
      ]),
    );

    const evidence = await new DomainCommandService(
      await createContextFixture("studio-evidence-claims-", ["operations"]),
    ).registerEvidence({
      title: "Immutable claim proof",
      evidenceType: "file",
      checksum: "a".repeat(64),
      claims: ["Claim with proof"],
      sourceMutability: "immutable",
    });

    const valid = new EvidenceClaimService().validate({
      claims: ["Claim with proof"],
      evidence: [evidence],
      publicClaim: true,
    });
    const invalid = new EvidenceClaimService().validate({
      claims: ["Unsupported claim"],
      evidence: [evidence],
      publicClaim: true,
    });

    expect(valid.ok).toBe(true);
    expect(invalid).toMatchObject({
      ok: false,
      issues: [expect.objectContaining({ code: "missing-claim" })],
    });
  });
});

async function createContextFixture(
  name: string,
  canonicalRoots: string[],
): Promise<StudioContext> {
  const root = await mkdtemp(path.join(os.tmpdir(), name));
  await writeFile(
    path.join(root, "studio.config.yaml"),
    YAML.stringify({
      api_version: "studio.guilherme.dev/config-v1",
      root_name: "Core fixture",
      operator_id: "per_20260614_guilherme-silva",
      canonical_roots: canonicalRoots,
      runtime_path: "runtime",
      panel: { host: "127.0.0.1", port: 47838 },
      adapters: {},
    }),
  );
  return createStudioContext(root);
}

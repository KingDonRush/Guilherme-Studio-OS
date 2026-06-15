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
});

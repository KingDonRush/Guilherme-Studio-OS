import {
  createEntity,
  entityId,
  entityRevision,
  entityTitle,
  nowIso,
  type StudioEntity,
  TypedEntitySchema,
} from "@guilherme-studio/schemas";
import { recordStringArray } from "../record-utils.js";
import { DomainServiceBase } from "./base.js";
import { mergeRelations, uniqueStrings } from "./utils.js";

export class ProductsDomainService extends DomainServiceBase {
  async prepareRelease(input: {
    productId: string;
    version: string;
    changelog?: string;
    compatibilityNotes?: string;
    migrationNotes?: string;
    publicApiNotes?: string;
    testCommands?: string[];
    assetIds?: string[];
    packagePath?: string;
    roadmapClaims?: string[];
    implementedCapabilities?: string[];
  }): Promise<StudioEntity> {
    const product = await this.requireKind(input.productId, "product");
    return this.entities.create({
      kind: "release",
      title: `${entityTitle(product)} ${input.version}`,
      status: "draft",
      relations: [{ type: "releases", target_id: input.productId }],
      data: {
        product_id: input.productId,
        version: input.version,
        stage: "prepared",
        prepared_at: nowIso(),
        ...(input.changelog ? { changelog: input.changelog } : {}),
        ...(input.compatibilityNotes ? { compatibility_notes: input.compatibilityNotes } : {}),
        ...(input.migrationNotes ? { migration_notes: input.migrationNotes } : {}),
        ...(input.publicApiNotes ? { public_api_notes: input.publicApiNotes } : {}),
        ...(input.packagePath ? { package_path: input.packagePath } : {}),
        test_commands: input.testCommands ?? [],
        asset_ids: input.assetIds ?? [],
        roadmap_claims: input.roadmapClaims ?? [],
        implemented_capabilities: input.implementedCapabilities ?? [],
      },
    });
  }

  async publishRelease(input: {
    releaseId: string;
    evidenceIds: string[];
    demoUrl?: string;
  }): Promise<StudioEntity> {
    if (input.evidenceIds.length === 0) {
      throw new Error("At least one evidence id is required to publish a release.");
    }
    await this.requireEvidenceIds(input.evidenceIds);
    return this.entities.update(input.releaseId, (entity) => {
      if (entity.kind !== "release") {
        throw new Error(`Expected release entity, got ${entity.kind}`);
      }
      if (entity.spec.stage !== "prepared" && entity.spec.stage !== "published") {
        throw new Error("Release must be prepared before publication.");
      }
      const evidenceIds = uniqueStrings([
        ...recordStringArray(entity.spec as Record<string, unknown>, "evidence_ids"),
        ...input.evidenceIds,
      ]);
      return {
        ...entity,
        spec: {
          ...entity.spec,
          status: "published",
          stage: "published",
          evidence_ids: evidenceIds,
          published_at: nowIso(),
          ...(input.demoUrl ? { demo_url: input.demoUrl } : {}),
        },
        relations: mergeRelations(
          entity.relations,
          input.evidenceIds.map((targetId) => ({ type: "supported_by", target_id: targetId })),
        ),
      };
    });
  }

  async registerProjectRepository(input: {
    projectId: string;
    title: string;
    repositoryPath: string;
    branch?: string;
    remotePolicy?: "allowed" | "forbidden" | "no-remote-in-v1";
  }): Promise<{ project: StudioEntity; repository: StudioEntity }> {
    const project = await this.requireKind(input.projectId, "project");
    const repository = createEntity({
      kind: "repository",
      title: input.title,
      relations: [{ type: "repository_for", target_id: input.projectId }],
      data: {
        path: input.repositoryPath,
        ...(input.branch ? { branch: input.branch } : {}),
        remote_policy: input.remotePolicy ?? "allowed",
      },
    });
    if (await this.context.entities.get(entityId(repository))) {
      throw new Error(`Repository entity already exists: ${entityId(repository)}`);
    }
    const updatedProject = TypedEntitySchema.parse({
      ...project,
      metadata: {
        ...project.metadata,
        revision: entityRevision(project) + 1,
        updated_at: nowIso(),
      },
      spec: {
        ...project.spec,
        repository_id: entityId(repository),
      },
      relations: [
        ...project.relations.filter((relation) => relation.type !== "uses_repository"),
        { type: "uses_repository", target_id: entityId(repository) },
      ],
    });
    await this.context.entities.putMany([
      { entity: repository },
      { entity: updatedProject, expectedRevision: entityRevision(project) },
    ]);
    await this.entities.recordEvent("repository.registered", entityId(repository), {
      project_id: input.projectId,
      path: input.repositoryPath,
    });
    return { project: updatedProject, repository };
  }
}

import { createEntity, nowIso, type StudioEntity } from "@guilherme-studio/schemas";
import { EvidenceClaimService } from "../evidence/claims.js";
import { DomainServiceBase } from "./base.js";

export class EvidenceDomainService extends DomainServiceBase {
  async registerEvidence(input: {
    title: string;
    evidenceType: "file" | "url" | "command" | "screenshot" | "backup" | "decision" | "manual";
    subjectId?: string;
    path?: string;
    url?: string;
    command?: string;
    checksum?: string;
    claims?: string[];
    sourceMutability?: "immutable" | "mutable" | "operator-observed";
  }): Promise<StudioEntity> {
    if (input.subjectId) {
      await this.requireEntity(input.subjectId);
    }
    const validation = new EvidenceClaimService().validate({
      claims: input.claims ?? [],
      evidence: [
        createEntity({
          kind: "evidence",
          title: input.title,
          data: {
            evidence_type: input.evidenceType,
            ...(input.subjectId ? { subject_id: input.subjectId } : {}),
            ...(input.path ? { path: input.path } : {}),
            ...(input.url ? { url: input.url } : {}),
            ...(input.command ? { command: input.command } : {}),
            ...(input.checksum ? { checksum: input.checksum } : {}),
            claims: input.claims ?? [],
            source_mutability: input.sourceMutability ?? "operator-observed",
          },
        }),
      ],
      ...(input.subjectId ? { subjectId: input.subjectId } : {}),
      publicClaim: (input.claims ?? []).length > 0,
    });
    if (!validation.ok) {
      throw new Error(
        `Evidence validation failed: ${validation.issues.map((issue) => issue.message).join("; ")}`,
      );
    }
    return this.entities.create({
      kind: "evidence",
      title: input.title,
      relations: input.subjectId ? [{ type: "supports", target_id: input.subjectId }] : [],
      data: {
        evidence_type: input.evidenceType,
        ...(input.subjectId ? { subject_id: input.subjectId } : {}),
        ...(input.path ? { path: input.path } : {}),
        ...(input.url ? { url: input.url } : {}),
        ...(input.command ? { command: input.command } : {}),
        ...(input.checksum ? { checksum: input.checksum } : {}),
        claims: input.claims ?? [],
        source_mutability: input.sourceMutability ?? "operator-observed",
        validated_at: nowIso(),
        observed_at: nowIso(),
      },
    });
  }
}

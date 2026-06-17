import { entityId, type StudioEntity } from "@guilherme-studio/schemas";
import { uniqueStrings } from "../domains/utils.js";
import { recordString, recordStringArray } from "../record-utils.js";

export interface EvidenceValidationIssue {
  code:
    | "missing-evidence"
    | "missing-claim"
    | "missing-checksum"
    | "mutable-source"
    | "subject-mismatch";
  evidence_id?: string;
  claim?: string;
  message: string;
}

export interface EvidenceValidationResult {
  ok: boolean;
  issues: EvidenceValidationIssue[];
}

export class EvidenceClaimService {
  validate(input: {
    claims?: string[];
    evidence: StudioEntity[];
    subjectId?: string;
    publicClaim?: boolean;
  }): EvidenceValidationResult {
    const claims = uniqueStrings(input.claims ?? []);
    const issues: EvidenceValidationIssue[] = [];
    if ((input.publicClaim || claims.length > 0) && input.evidence.length === 0) {
      issues.push({
        code: "missing-evidence",
        message: "Public claims require at least one evidence record.",
      });
    }
    const evidenceClaims = new Set(
      input.evidence.flatMap((entity) =>
        recordStringArray(entity.spec as Record<string, unknown>, "claims").filter(
          (claim) => claim.length > 0,
        ),
      ),
    );
    for (const claim of claims) {
      if (!evidenceClaims.has(claim)) {
        issues.push({
          code: "missing-claim",
          claim,
          message: `No evidence record explicitly supports claim: ${claim}`,
        });
      }
    }
    for (const entity of input.evidence) {
      const spec = entity.spec as Record<string, unknown>;
      const type = recordString(spec, "evidence_type");
      const checksum = recordString(spec, "checksum");
      const mutability = recordString(spec, "source_mutability");
      const subjectId = recordString(spec, "subject_id");
      if (["file", "screenshot", "backup"].includes(type ?? "") && typeof checksum !== "string") {
        issues.push({
          code: "missing-checksum",
          evidence_id: entityId(entity),
          message: `Evidence ${entityId(entity)} requires a checksum.`,
        });
      }
      if (mutability === "mutable" && typeof checksum !== "string") {
        issues.push({
          code: "mutable-source",
          evidence_id: entityId(entity),
          message: `Mutable evidence ${entityId(entity)} requires a checksum or snapshot.`,
        });
      }
      if (input.subjectId && subjectId && subjectId !== input.subjectId) {
        issues.push({
          code: "subject-mismatch",
          evidence_id: entityId(entity),
          message: `Evidence ${entityId(entity)} is attached to ${subjectId}, not ${input.subjectId}.`,
        });
      }
    }
    return { ok: issues.length === 0, issues };
  }
}

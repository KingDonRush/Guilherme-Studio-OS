import type { Actor, Capability, GateDecision } from "@guilherme-studio/schemas";
import { AuthorityService } from "../authority.js";

export class GateEngine {
  evaluate(input: {
    action: string;
    classification?: string;
    external?: boolean;
    destructive?: boolean;
    publicClaim?: boolean;
    expectedRevision?: number;
    actualRevision?: number;
    evidenceIds?: string[];
    requiredEvidence?: string[];
    paymentStatus?: string;
    deliveryStatus?: string;
    actor?: Actor;
    capability?: Capability;
  }): GateDecision {
    if (input.actor && input.capability) {
      try {
        new AuthorityService().assertCapability(
          input.actor,
          input.capability,
          input.classification ?? "internal",
        );
      } catch (error) {
        return {
          gate: "authority",
          result: "block",
          reason: error instanceof Error ? error.message : String(error),
          capability_required: input.capability,
          evidence_required: [],
        };
      }
    }
    if (input.classification === "secret") {
      return {
        gate: "confidential-data",
        result: "block",
        reason: "Secret material cannot be written to canonical Studio files.",
        evidence_required: [],
      };
    }
    if (
      input.expectedRevision !== undefined &&
      input.actualRevision !== undefined &&
      input.expectedRevision !== input.actualRevision
    ) {
      return {
        gate: "stale-revision",
        result: "block",
        reason: "The entity changed after the command was prepared.",
        evidence_required: ["fresh entity revision"],
      };
    }
    const missingEvidence = (input.requiredEvidence ?? []).filter(
      (required) => !(input.evidenceIds ?? []).includes(required),
    );
    if (missingEvidence.length > 0) {
      return {
        gate: "missing-evidence",
        result: "block",
        reason: `Required evidence is missing: ${missingEvidence.join(", ")}`,
        evidence_required: missingEvidence,
      };
    }
    if (input.deliveryStatus === "done" && input.paymentStatus && input.paymentStatus !== "paid") {
      return {
        gate: "payment-delivery",
        result: "warn",
        reason: "Delivery is complete while payment is still pending.",
        evidence_required: ["invoice status", "delivery acceptance"],
      };
    }
    if (input.external || input.destructive) {
      return {
        gate: input.destructive ? "destructive" : "external-confirmation",
        result: "require_confirmation",
        reason: "External or destructive actions must be prepared, confirmed and reconciled.",
        evidence_required: ["prepared action", "human confirmation", "reconciliation result"],
        confirmation_scope: input.action,
      };
    }
    if (input.publicClaim || input.action.includes("publish") || input.action.includes("send")) {
      return {
        gate: "public-claim",
        result: "require_confirmation",
        reason: "Public communication requires explicit confirmation.",
        evidence_required: ["final content", "target channel", "confirmation"],
        confirmation_scope: input.action,
      };
    }
    return {
      gate: "local-reversible",
      result: "allow",
      reason: "Local reversible action within canonical files.",
      evidence_required: [],
    };
  }
}

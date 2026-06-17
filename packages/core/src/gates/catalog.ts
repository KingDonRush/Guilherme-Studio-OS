export type StudioGateId =
  | "duplicate-check"
  | "missing-evidence"
  | "public-claim"
  | "external-confirmation"
  | "payment-delivery"
  | "confidential-data"
  | "destructive"
  | "stale-revision"
  | "restore-required";

export interface StudioGateDefinition {
  id: StudioGateId;
  owner: string;
  applies_when: string;
  risk: "normal" | "high" | "critical";
  required_evidence: string[];
  failure_recovery: string;
}

export const GATE_CATALOG: StudioGateDefinition[] = [
  {
    id: "duplicate-check",
    owner: "CRM and sales",
    applies_when: "Creating or qualifying relationship, prospect, client or application records.",
    risk: "normal",
    required_evidence: ["duplicate review result"],
    failure_recovery: "Review candidates and link or reuse the existing record.",
  },
  {
    id: "missing-evidence",
    owner: "Studio Core",
    applies_when: "Completing, publishing or publicly claiming work.",
    risk: "high",
    required_evidence: ["supporting evidence id"],
    failure_recovery: "Register evidence before advancing the lifecycle.",
  },
  {
    id: "public-claim",
    owner: "Marketing and portfolio",
    applies_when: "Publishing claims or preparing outbound public communication.",
    risk: "high",
    required_evidence: ["claim map", "proof evidence", "exact payload confirmation"],
    failure_recovery: "Remove unsupported claims or attach supporting evidence.",
  },
  {
    id: "external-confirmation",
    owner: "Adapters",
    applies_when: "Any action that may send, publish or mutate outside the local Studio root.",
    risk: "high",
    required_evidence: ["prepared action", "human confirmation", "reconciliation result"],
    failure_recovery: "Keep the action local until exact payload confirmation exists.",
  },
  {
    id: "payment-delivery",
    owner: "Finance and delivery",
    applies_when: "Delivery completes while payment, contract or invoice state is unresolved.",
    risk: "high",
    required_evidence: ["invoice status", "delivery acceptance"],
    failure_recovery: "Rank the unresolved obligation as an economic next action.",
  },
  {
    id: "confidential-data",
    owner: "Security",
    applies_when: "A mutation touches confidential or secret classified material.",
    risk: "critical",
    required_evidence: ["classification review"],
    failure_recovery: "Redact or lower scope before writing or preparing a payload.",
  },
  {
    id: "destructive",
    owner: "Operations",
    applies_when: "A command deletes, restores, overwrites or changes external state.",
    risk: "critical",
    required_evidence: ["backup", "explicit confirmation", "reconciliation result"],
    failure_recovery: "Stop and require a prepared destructive action with recovery evidence.",
  },
  {
    id: "stale-revision",
    owner: "Storage",
    applies_when: "A command has an expected revision and the canonical record changed.",
    risk: "high",
    required_evidence: ["fresh entity revision"],
    failure_recovery: "Reload the entity and re-run the dry-run before confirming.",
  },
  {
    id: "restore-required",
    owner: "Recovery",
    applies_when: "Acceptance depends on backup or restore rehearsal freshness.",
    risk: "high",
    required_evidence: ["backup manifest", "restore rehearsal result"],
    failure_recovery: "Run backup and restore-check before release or portfolio work.",
  },
];

export function gateCatalogIds(): StudioGateId[] {
  return GATE_CATALOG.map((gate) => gate.id);
}

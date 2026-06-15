import {
  type EntityKind,
  EntityKindSchema,
  entityId,
  type StudioEntity,
} from "@guilherme-studio/schemas";

export type PrdCoverageStatus = "covered" | "needs-intake" | "missing-capability";

export interface PrdCoverageRequirement {
  id: string;
  title: string;
  entityKinds: EntityKind[];
  acceptanceFocus: string;
}

export interface PrdCoverageReport {
  ok: boolean;
  summary: {
    covered: number;
    needs_intake: number;
    missing_capability: number;
  };
  by_kind: Record<string, number>;
  prds: Array<{
    id: string;
    title: string;
    status: PrdCoverageStatus;
    capability_ready: boolean;
    canonical_data_ready: boolean;
    required_kinds: EntityKind[];
    present_kinds: EntityKind[];
    missing_canonical_kinds: EntityKind[];
    missing_schema_kinds: string[];
    acceptance_focus: string;
  }>;
  intake_required: Array<{
    prd_id: string;
    title: string;
    missing_kinds: EntityKind[];
  }>;
}

export const PRD_COVERAGE_REQUIREMENTS: PrdCoverageRequirement[] = [
  {
    id: "prd-01-core-governance",
    title: "Studio Core and Governance",
    entityKinds: ["task", "evidence", "decision", "agentRun"],
    acceptanceFocus: "Core state, evidence, decisions, agent runs and audited mutations exist.",
  },
  {
    id: "prd-02-clients-crm-profiles",
    title: "Clients, CRM, and Profiles",
    entityKinds: ["person", "organization", "prospect", "client", "communication"],
    acceptanceFocus:
      "Identity, prospects, clients, relationship history and next action inputs exist.",
  },
  {
    id: "prd-03-engagements-wordpress-delivery",
    title: "Engagements and WordPress Delivery",
    entityKinds: ["client", "engagement", "deliverable", "project", "environment"],
    acceptanceFocus:
      "Delivery work links clients, projects, environments, deliverables and acceptance evidence.",
  },
  {
    id: "prd-04-products-plugins-repositories",
    title: "Products, Plugins, and Repositories",
    entityKinds: ["product", "repository", "release", "evidence"],
    acceptanceFocus: "Owned products, repositories, releases and proof records are registered.",
  },
  {
    id: "prd-05-portfolio-cases-evidence",
    title: "Portfolio, Cases, and Evidence",
    entityKinds: ["portfolioCase", "evidence", "asset", "product", "project"],
    acceptanceFocus: "Public claims can resolve to evidence, assets and owned work records.",
  },
  {
    id: "prd-06-marketing-content-campaigns",
    title: "Marketing, Content, and Campaigns",
    entityKinds: ["campaign", "contentItem", "portfolioCase", "evidence", "communication"],
    acceptanceFocus: "Campaigns and content have audience, proof, CTA and confirmation boundaries.",
  },
  {
    id: "prd-07-prospecting-sales-proposals",
    title: "Prospecting, Sales, and Proposals",
    entityKinds: ["prospect", "opportunity", "proposal", "communication", "client", "engagement"],
    acceptanceFocus:
      "Sales flow preserves reason-for-contact, proposal version and conversion links.",
  },
  {
    id: "prd-08-international-career",
    title: "International Career Pipeline",
    entityKinds: ["organization", "jobApplication", "communication", "portfolioCase", "evidence"],
    acceptanceFocus:
      "Applications preserve role source, claims, materials, follow-up and evidence gaps.",
  },
  {
    id: "prd-09-finance-contracts-obligations",
    title: "Finance, Contracts, and Obligations",
    entityKinds: ["contract", "invoice", "payment", "engagement", "evidence"],
    acceptanceFocus: "Expected, invoiced, confirmed and reconciled money remain distinct.",
  },
  {
    id: "prd-10-knowledge-memory-agents",
    title: "Knowledge, Memory, and Agents",
    entityKinds: ["decision", "task", "agentRun", "evidence"],
    acceptanceFocus: "Handoffs, decisions, tasks and learning evidence can replace oral rebrief.",
  },
  {
    id: "prd-11-cli-mcp-panel",
    title: "Studio CLI, MCP, and Local Panel",
    entityKinds: ["task", "evidence", "agentRun", "repository"],
    acceptanceFocus: "Interfaces share the same core outcomes and repository health context.",
  },
  {
    id: "prd-12-data-security-recovery",
    title: "Data, Security, Backup, and Recovery",
    entityKinds: ["evidence", "repository", "environment", "decision"],
    acceptanceFocus:
      "Recovery, backups, security decisions and registered components are evidenced.",
  },
];

export function evaluatePrdCoverage(entities: StudioEntity[]): PrdCoverageReport {
  const supportedKinds = new Set<string>(EntityKindSchema.options);
  const byKind: Record<string, number> = {};
  for (const entity of entities) {
    byKind[entity.kind] = (byKind[entity.kind] ?? 0) + 1;
  }

  const prds = PRD_COVERAGE_REQUIREMENTS.map((requirement) => {
    const missingSchemaKinds = requirement.entityKinds.filter((kind) => !supportedKinds.has(kind));
    const presentKinds = requirement.entityKinds.filter((kind) => (byKind[kind] ?? 0) > 0);
    const missingCanonicalKinds = requirement.entityKinds.filter(
      (kind) => !presentKinds.includes(kind),
    );
    const capabilityReady = missingSchemaKinds.length === 0;
    const canonicalDataReady = missingCanonicalKinds.length === 0;
    const status: PrdCoverageStatus = !capabilityReady
      ? "missing-capability"
      : canonicalDataReady
        ? "covered"
        : "needs-intake";
    return {
      id: requirement.id,
      title: requirement.title,
      status,
      capability_ready: capabilityReady,
      canonical_data_ready: canonicalDataReady,
      required_kinds: requirement.entityKinds,
      present_kinds: presentKinds,
      missing_canonical_kinds: missingCanonicalKinds,
      missing_schema_kinds: missingSchemaKinds,
      acceptance_focus: requirement.acceptanceFocus,
    };
  });

  return {
    ok: prds.every((prd) => prd.status === "covered"),
    summary: {
      covered: prds.filter((prd) => prd.status === "covered").length,
      needs_intake: prds.filter((prd) => prd.status === "needs-intake").length,
      missing_capability: prds.filter((prd) => prd.status === "missing-capability").length,
    },
    by_kind: Object.fromEntries(
      Object.entries(byKind).sort(([left], [right]) => left.localeCompare(right)),
    ),
    prds,
    intake_required: prds
      .filter((prd) => prd.missing_canonical_kinds.length > 0)
      .map((prd) => ({
        prd_id: prd.id,
        title: prd.title,
        missing_kinds: prd.missing_canonical_kinds,
      })),
  };
}

export function coverageEntityIds(entities: StudioEntity[], kind: EntityKind): string[] {
  return entities.filter((entity) => entity.kind === kind).map((entity) => entityId(entity));
}

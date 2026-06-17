import { z } from "zod";
import { STUDIO_SCHEMA_VERSION } from "../versions.js";
import { EntityKindSchema } from "./kinds.js";
import { EntityMetadataSchema } from "./metadata.js";
import { RelationSchema } from "./relations.js";
import { GenericSpecSchema } from "./specs/base.js";
import { JobApplicationSpecSchema } from "./specs/career.js";
import {
  ClientSpecSchema,
  CommunicationSpecSchema,
  OrganizationSpecSchema,
  PersonSpecSchema,
  ProspectSpecSchema,
} from "./specs/crm.js";
import {
  DeliverableSpecSchema,
  EngagementSpecSchema,
  EnvironmentSpecSchema,
  ProjectSpecSchema,
} from "./specs/delivery.js";
import { ContractSpecSchema, InvoiceSpecSchema, PaymentSpecSchema } from "./specs/finance.js";
import {
  AgentRunExtendedSpecSchema,
  DecisionSpecSchema,
  EvidenceSpecSchema,
  TaskSpecSchema,
} from "./specs/governance.js";
import { CampaignSpecSchema, ContentItemSpecSchema } from "./specs/marketing.js";
import { AssetSpecSchema, PortfolioCaseSpecSchema } from "./specs/portfolio.js";
import { ProductSpecSchema, ReleaseSpecSchema, RepositorySpecSchema } from "./specs/products.js";
import { OpportunitySpecSchema, ProposalSpecSchema } from "./specs/sales.js";

const BaseCanonicalEntitySchema = z
  .object({
    api_version: z.literal(STUDIO_SCHEMA_VERSION).default(STUDIO_SCHEMA_VERSION),
    kind: EntityKindSchema,
    metadata: EntityMetadataSchema,
    spec: GenericSpecSchema,
    relations: z.array(RelationSchema).default([]),
    extensions: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();
export const TypedEntitySchema = z.discriminatedUnion("kind", [
  BaseCanonicalEntitySchema.extend({ kind: z.literal("evidence"), spec: EvidenceSpecSchema }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("task"), spec: TaskSpecSchema }),
  BaseCanonicalEntitySchema.extend({
    kind: z.literal("agentRun"),
    spec: AgentRunExtendedSpecSchema,
  }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("person"), spec: PersonSpecSchema }),
  BaseCanonicalEntitySchema.extend({
    kind: z.literal("organization"),
    spec: OrganizationSpecSchema,
  }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("prospect"), spec: ProspectSpecSchema }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("client"), spec: ClientSpecSchema }),
  BaseCanonicalEntitySchema.extend({
    kind: z.literal("opportunity"),
    spec: OpportunitySpecSchema,
  }),
  BaseCanonicalEntitySchema.extend({
    kind: z.literal("jobApplication"),
    spec: JobApplicationSpecSchema,
  }),
  BaseCanonicalEntitySchema.extend({
    kind: z.literal("engagement"),
    spec: EngagementSpecSchema,
  }),
  BaseCanonicalEntitySchema.extend({
    kind: z.literal("deliverable"),
    spec: DeliverableSpecSchema,
  }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("project"), spec: ProjectSpecSchema }),
  BaseCanonicalEntitySchema.extend({
    kind: z.literal("repository"),
    spec: RepositorySpecSchema,
  }),
  BaseCanonicalEntitySchema.extend({
    kind: z.literal("environment"),
    spec: EnvironmentSpecSchema,
  }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("product"), spec: ProductSpecSchema }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("release"), spec: ReleaseSpecSchema }),
  BaseCanonicalEntitySchema.extend({
    kind: z.literal("portfolioCase"),
    spec: PortfolioCaseSpecSchema,
  }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("campaign"), spec: CampaignSpecSchema }),
  BaseCanonicalEntitySchema.extend({
    kind: z.literal("contentItem"),
    spec: ContentItemSpecSchema,
  }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("proposal"), spec: ProposalSpecSchema }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("contract"), spec: ContractSpecSchema }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("invoice"), spec: InvoiceSpecSchema }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("payment"), spec: PaymentSpecSchema }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("decision"), spec: DecisionSpecSchema }),
  BaseCanonicalEntitySchema.extend({ kind: z.literal("asset"), spec: AssetSpecSchema }),
  BaseCanonicalEntitySchema.extend({
    kind: z.literal("communication"),
    spec: CommunicationSpecSchema,
  }),
]);
export type StudioEntity = z.infer<typeof TypedEntitySchema>;

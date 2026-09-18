# Studio Control Plane documentation

[Product overview](../../README.md) · [Implementation and verification guide](reviewer-guide.md)

The runtime coordinates commercial operations, delivery, products, evidence and
agent continuity for a solo or small software studio. WordPress/Docker is an
implemented delivery specialization within that system.

## Reading the documentation

Start with the implementation guide for executable behavior and source entry points.
The PRDs, ontology and workflow documents below describe the broader normative
design; their requirements are not a checklist of already implemented UI flows.
In particular, detailed client-memory/briefing models and complete site provisioning
extend beyond the current runtime. Historical names and personal workspace paths
in design records remain context, not installation requirements.

## Document Authority

Read documents in this order when rules conflict:

1. [Constitution](./01-constitution.md)
2. [Master RPG PRD](./02-master-prd-rpg.md)
3. Domain PRD that owns the capability
4. Architecture and schema contracts
5. Workflow definition
6. Decision record
7. Operational guide
8. Historical documentation

Existing `.ai/`, `docs/`, WordPress files, and repository conventions are
inputs to migration. They do not override this specification.

## Canonical Map

### Foundation

- [Constitution](./01-constitution.md)
- [Master RPG PRD](./02-master-prd-rpg.md)
- [Glossary](./ontology/00-glossary.md)
- [Entity map](./ontology/01-entity-map.md)
- [Lifecycles](./ontology/02-lifecycles.md)
- [Authority and evidence](./ontology/03-authority-evidence.md)

### Domain PRDs

1. [Studio Core and governance](./prds/01-studio-core-governance.md)
2. [Clients, CRM, and profiles](./prds/02-clients-crm-profiles.md)
3. [Engagements and WordPress delivery](./prds/03-engagements-wordpress-delivery.md)
4. [Products, plugins, and repositories](./prds/04-products-plugins-repositories.md)
5. [Portfolio, cases, and evidence](./prds/05-portfolio-cases-evidence.md)
6. [Marketing, content, and campaigns](./prds/06-marketing-content-campaigns.md)
7. [Prospecting, sales, and proposals](./prds/07-prospecting-sales-proposals.md)
8. [International career pipeline](./prds/08-international-career.md)
9. [Finance, contracts, and obligations](./prds/09-finance-contracts-obligations.md)
10. [Knowledge, memory, and agents](./prds/10-knowledge-memory-agents.md)
11. [CLI, MCP, and local panel](./prds/11-cli-mcp-panel.md)
12. [Data, security, backup, and recovery](./prds/12-data-security-recovery.md)

### Architecture

- [System architecture](./architecture/01-system-architecture.md)
- [Storage and registry](./architecture/02-storage-registry.md)
- [CLI, MCP, and panel contracts](./architecture/03-cli-mcp-panel.md)
- [Repository and WordPress topology](./architecture/04-repository-wordpress-topology.md)

### Workflows

- [Cross-domain journeys](./workflows/01-cross-domain-journeys.md)
- [Visual feedback and implementation](./workflows/02-visual-reality-loop.md)
- [Agent execution and handoff](./workflows/03-agent-execution-handoff.md)
- [Image-first mockup production](./workflows/04-image-first-mockup-production.md)

### Implementation Execution

- [Parallel PRD execution strategy](./implementation/00-parallel-execution-strategy.md)
- [Cross-PRD integration map](./implementation/01-cross-prd-integration-map.md)
- [Operating north star](./implementation/02-codebase-north-star.md)
- [Self-build harness bootstrap](./implementation/03-self-build-harness-bootstrap.md)
- [Spec Kit clean code flow](./implementation/04-spec-kit-clean-code-flow.md)
- [Clean Code playbook, integral](./implementation/playbooks/playbook-operacional-clean-code.md)
- [PRD subagent packets](./implementation/subagents/README.md)
- [PRD 01 implementation plan](./implementation/prd-01-core-governance-plan.md)
- [PRD 02 implementation plan](./implementation/prd-02-clients-crm-profiles-plan.md)
- [PRD 03 implementation plan](./implementation/prd-03-engagements-wordpress-delivery-plan.md)
- [PRD 04 implementation plan](./implementation/prd-04-products-plugins-repositories-plan.md)
- [PRD 05 implementation plan](./implementation/prd-05-portfolio-cases-evidence-plan.md)
- [PRD 06 implementation plan](./implementation/prd-06-marketing-content-campaigns-plan.md)
- [PRD 07 implementation plan](./implementation/prd-07-prospecting-sales-proposals-plan.md)
- [PRD 08 implementation plan](./implementation/prd-08-international-career-plan.md)
- [PRD 09 implementation plan](./implementation/prd-09-finance-contracts-obligations-plan.md)
- [PRD 10 implementation plan](./implementation/prd-10-knowledge-memory-agents-plan.md)
- [PRD 11 implementation plan](./implementation/prd-11-cli-mcp-panel-plan.md)
- [PRD 12 implementation plan](./implementation/prd-12-data-security-recovery-plan.md)
- [Capability completion definition](./implementation/capability-matrices/00-capability-completion-definition.md)
- [Capability matrices](./implementation/capability-matrices/README.md)

### Control

- [Schema contracts](./schemas/01-core-contracts.md)
- [Security and privacy](./security/01-security-privacy.md)
- [Operating model](./operations/01-operating-model.md)
- [Quality gates](./operations/02-quality-gates.md)
- [Research packets](./operations/03-research-packets.md)
- [Topological implementation backlog](./operations/04-implementation-backlog.md)
- [V1 completion matrix](./operations/05-v1-completion-matrix.md)
- [Real data intake packet](./operations/06-real-data-intake.md)
- [Current-state inventory](./migration/01-current-state-inventory.md)
- [Migration plan](./migration/02-migration-plan.md)
- [Decision register](./decisions/00-decision-register.md)

# PRD Subagent Packets

Status: execution prep
Purpose: provide copy-ready packets for parallel PRD agents without relying on
oral context.

## What This Folder Is

This folder turns the PRD completion plan into agent-operable handoffs.

It does not mean twelve implementation agents should start from the current
monolithic source shape. The first executable lane is still Phase 0
modularization. After Phase 0 is green, PRD agents can work in waves with
bounded write sets.

## Order Of Use

1. Read `../00-parallel-execution-strategy.md`.
2. Read `../01-cross-prd-integration-map.md`.
3. Read `00-agent-orchestration-contract.md`.
4. Execute `00-phase-0-modularization-packets.md`.
5. Start PRD agents by wave:
   - Wave 1: PRD 01, PRD 10, PRD 11, PRD 12.
   - Wave 2: PRD 02, PRD 07, PRD 08, PRD 09.
   - Wave 3: PRD 03, PRD 04, PRD 05, PRD 06.

## Packet Index

| Packet | Wave | Purpose |
|---|---:|---|
| `00-agent-orchestration-contract.md` | all | shared operating rules for every agent |
| `00-phase-0-modularization-packets.md` | 0 | anti-conflict extraction work before PRD agents |
| `01-current-surface-audit.md` | 0 | audited hot files and conflict risks from planning subagents |
| `prd-01-core-governance-agent.md` | 1 | core governance, gates, lifecycle, acceptance semantics |
| `prd-02-clients-crm-profiles-agent.md` | 2 | identity, CRM, duplicate review, communication records |
| `prd-03-engagements-wordpress-delivery-agent.md` | 3 | engagement, deliverables, WordPress delivery and health |
| `prd-04-products-plugins-repositories-agent.md` | 3 | products, releases, repositories and repo health |
| `prd-05-portfolio-cases-evidence-agent.md` | 3 | portfolio freeze, cases, public claims and evidence |
| `prd-06-marketing-content-campaigns-agent.md` | 3 | content, campaigns, publication prepared actions |
| `prd-07-prospecting-sales-proposals-agent.md` | 2 | prospects, opportunities, proposals, sales follow-up |
| `prd-08-international-career-agent.md` | 2 | LinkedIn/jobs, applications, interviews, follow-up |
| `prd-09-finance-contracts-obligations-agent.md` | 2 | contracts, invoices, payments, obligations |
| `prd-10-knowledge-memory-agents-agent.md` | 1 | Agent Harness Loop, context packs, handoff closure |
| `prd-11-cli-mcp-panel-agent.md` | 1 | CLI, API, MCP and panel interface completeness |
| `prd-12-data-security-recovery-agent.md` | 1 | security, backup, restore, recovery and path safety |

## Global Rule

The target is 100% capability completion. Missing real clients, jobs,
campaigns, applications or finance records are represented as
`intake_required`; they are not fabricated and they do not block capability
completion when the system can correctly show the gap.

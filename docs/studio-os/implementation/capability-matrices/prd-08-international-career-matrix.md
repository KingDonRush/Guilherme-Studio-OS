# PRD 08 Capability Matrix: International Career Pipeline

Target: 100% capability complete without requiring active applications.
Current estimate: 100%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Role strategy | Define role families, employment type, geography, timezone, salary and unacceptable constraints. | capability_complete: `career.record-strategy` creates a decision-backed role strategy with role families, employment types, geography, timezone, salary expectation, unacceptable constraints and evidence map. | Keep real strategy values as intake until supplied. | CLI/API/MCP | runtime test + dry-run equivalence | Missing strategy is intake gap. |
| Evidence map | Map role families to required signals and existing evidence. | capability_complete: strategy records and application packages carry evidence maps/evidence ids; fit analysis records matched requirements, gaps and supporting evidence. | PRD 05 remains owner of public claim policy. | CLI/API/MCP | runtime test | Missing evidence listed as gap. |
| Job discovery | Register source URL, organization, role, location, compensation, requirements, deadline and contact. | capability_complete: `application.register-opportunity` records discovered LinkedIn/job opportunities as `jobApplication` with `stage: discovered`, source freshness, requirements and deadline/contact fields. | Real job facts must come from supplied source; no browsing or invention. | CLI/API/MCP/panel | runtime test + panel smoke | LinkedIn URL/details required. |
| Deduplicate roles | Deduplicate reposted roles and archive expired roles. | capability_complete: duplicate keys normalize source URL, organization and title; `application.review-duplicates` reports candidates; expired source freshness archives the role without deletion. | Merge remains a human-reviewed relation/update, not automatic deletion. | CLI/API/MCP | dry-run equivalence | Expired roles retained. |
| Fit analysis | Compare requirements with verified skills, products, cases and gaps. | capability_complete: `application.analyze-fit` compares recorded requirements with verified signals/evidence and stores apply/research/defer recommendation plus gaps. | Future PRD 05 claim engine can enrich verified signal sourcing. | CLI/API/MCP | runtime test | Recommendation can be apply/research/defer. |
| Application preparation | Assemble resume, cover, portfolio links, repos, answers and evidence bundle. | capability_complete: `application.prepare` stores resume ref, cover message, portfolio links, repositories, answers and evidence ids without inventing materials. | Missing materials remain validation blockers. | CLI/API/MCP/panel | runtime test + equivalence | No material invented. |
| Application validation | Validate language, claims, URLs, metadata and file versions. | capability_complete: `application.validate` checks source URL, resume ref, cover message, portfolio links and material evidence ids, recording valid/blocked status, missing fields, warnings and checked URLs. | Deeper file metadata checks can be added when real files are supplied. | CLI/API/MCP/panel | runtime test | Missing files block submission. |
| Submission confirmation | Require confirmation before submission. | capability_complete: `application.prepare-submission` creates fake/local prepared action with exact payload/checksum/source revision; `application.record-submission` requires confirmed prepared action before marking submitted. | No external LinkedIn submit by default. | CLI/API/MCP/panel | runtime test + prepared-action assertion | No external submit by default. |
| Follow-up | Track submission, contacts, windows and channel policy. | capability_complete: `application.follow-up` records follow-up window, channel and policy, and optional message becomes prepared communication through the existing fake/local boundary. | Follow-up policy remains tied to real submission state. | CLI/API/MCP/panel | equivalence + panel smoke | Follow-up only from real submission. |
| Interview context | Create interview context packs without unrelated confidential data. | capability_complete: `application.interview-context` starts an AgentRun scoped to the application and builds a PRD 10 context pack with forbidden invention/unrelated-confidential-data reopening. | Interview details remain intake until supplied. | CLI/API/MCP | runtime test | Missing interview data is intake gap. |
| Learning | Record rejection, no-response, withdrawal, offer and sufficient evidence before strategy update. | capability_complete: `application.record-outcome` records outcome, reason, learning notes, sample size and evidence; sample sizes under 3 get an explicit tiny-sample warning. | Strategy updates still require explicit decision. | CLI/API/MCP/panel | runtime test | Tiny sample warning required. |

2026-06-18 closure update:

- Expanded career schema for role discovery, requirements, fit analysis,
  application materials, validation, prepared submission, follow-up, interview
  context and outcome learning.
- Added semantic commands for role strategy, job opportunity registration,
  duplicate review, fit analysis, application package, validation, prepared
  submission, submission record, follow-up, interview context, outcome and next
  actions.
- Exposed the career flow through CLI, API command runtime, MCP tools and panel
  forms.
- Added runtime coverage proving LinkedIn submission cannot be recorded without
  confirmed prepared action and interview context uses Agent Harness context
  packs.
- PRD 08 is now 100% capability complete. Real applications remain
  `intake_required` until supplied.

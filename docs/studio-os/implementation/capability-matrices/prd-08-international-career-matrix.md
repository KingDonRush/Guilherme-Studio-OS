# PRD 08 Capability Matrix: International Career Pipeline

Target: 100% capability complete without requiring active applications.
Current estimate: 30%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Role strategy | Define role families, employment type, geography, timezone, salary and unacceptable constraints. | missing | Add role strategy records and commands. | CLI/API/panel | role strategy tests | Missing strategy is intake gap. |
| Evidence map | Map role families to required signals and existing evidence. | missing | Integrate claim/evidence map with career. | CLI/panel | evidence map tests | Missing evidence listed as gap. |
| Job discovery | Register source URL, organization, role, location, compensation, requirements, deadline and contact. | partial | Add job opportunity entity or stage distinct from application. | CLI/API/MCP/panel | discovery tests | LinkedIn URL/details required. |
| Deduplicate roles | Deduplicate reposted roles and archive expired roles. | missing | Add role duplicate and expiry logic. | CLI/API/panel | dedupe/expiry tests | Expired roles retained. |
| Fit analysis | Compare requirements with verified skills, products, cases and gaps. | missing | Add analyzeRoleFit command and recommendation output. | CLI/MCP/panel | fit analysis fixture | Recommendation can be defer/reject. |
| Application preparation | Assemble resume, cover, portfolio links, repos, answers and evidence bundle. | partial | Expand application package and material refs. | CLI/API/MCP/panel | application fixture | No material invented. |
| Application validation | Validate language, claims, URLs, metadata and file versions. | missing | Add validateApplication command. | CLI/API/panel | validation tests | Missing files block submission. |
| Submission confirmation | Require confirmation before submission. | partial | Add prepared action for LinkedIn/job submissions. | CLI/API/panel | confirmation tests | No external submit by default. |
| Follow-up | Track submission, contacts, windows and channel policy. | partial | Harden follow-up policy and next action. | CLI/API/panel | follow-up tests | Follow-up only from real submission. |
| Interview context | Create interview context packs without unrelated confidential data. | missing | Integrate PRD 10 context packs. | CLI/MCP/panel | context redaction tests | Missing interview data is intake gap. |
| Learning | Record rejection, no-response, withdrawal, offer and sufficient evidence before strategy update. | missing | Add outcome and lesson promotion commands. | CLI/API/panel | learning tests | Tiny sample warning required. |

Completion blocker: career needs role opportunity, fit analysis and submission
confirmation as first-class flows.


# PRD 06 Capability Matrix: Marketing, Content, and Campaigns

Target: 100% capability complete without requiring active campaigns.
Current estimate: 20%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Audience/channel strategy | Define audience, problem, action, channel, language and proof. | missing | Add audience/channel strategy records. | CLI/API/panel | strategy tests | Missing audience is intake gap. |
| Channel constraints | Maintain formats and prevent generic reuse across incompatible audiences. | missing | Add channel constraints and reuse guard. | CLI/panel | channel tests | No generated spam. |
| Campaign planning | Define goal, offer, evidence, schedule, CTA, measurement and stop condition. | missing | Expand campaign schema and create command. | CLI/API/MCP/panel | campaign tests | No campaign data means intake gap. |
| Content briefing | Produce briefs from canonical product, case, project or market evidence. | missing | Add brief generator and prompt. | CLI/MCP/panel | brief fixture | Missing evidence blocks brief. |
| Claim verification | Mark claims requiring fresh verification. | partial | Integrate PRD 05 claim engine. | CLI/API/panel | content claim tests | Unsupported claims blocked. |
| Content production | Draft, revise, verify, approve, schedule, publish and repurpose. | missing | Add content lifecycle and commands. | CLI/API/panel | content workflow tests | Drafts from real input only. |
| Identity policy | Preserve Guilherme Silva and kingdonrush identity distinction. | missing | Add brand identity guard. | CLI/panel | identity tests | No invented attribution. |
| Asset pipeline | Generate media only through asset governance. | partial | Require asset manifest references for media. | CLI/panel | asset reference tests | Missing asset is blocker. |
| Publication | Prepare exact payload, require confirmation, record URL/date/channel/response. | partial | Add publication prepared-action lifecycle. | CLI/API/panel | publication tests | External send blocked by default. |
| Learning | Connect replies/leads/views only when evidence exists. | missing | Add campaign signal and lesson records. | CLI/API/panel | signal tests | Inference labeled explicitly. |

Completion blocker: marketing is mostly schema-level today; lifecycle and
publication behavior must be implemented.


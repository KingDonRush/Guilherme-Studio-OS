# PRD 05 Capability Matrix: Portfolio, Cases, and Evidence

Target: 100% capability complete without requiring finished public cases.
Current estimate: 30%.

| Requirement | Target capability | Current state | Implementation work | Interfaces | Verification | Real-data behavior |
|---|---|---|---|---|---|---|
| Portfolio strategy | Define audiences, roles, offers, proof tracks and evidence gaps. | missing | Add strategy records and gap report. | CLI/API/panel | strategy tests | Missing strategy is intake gap. |
| Economic action | Connect every surface to contact, case, repo, demo or application support. | missing | Add surface CTA/economic action validation. | CLI/panel | CTA tests | No fake contact route. |
| Case seeding | Seed case from product, deliverable, repo, release or evidence bundle. | partial | Expand source types and reference validation. | CLI/API/MCP/panel | case seed fixture | No copied truth. |
| Claim map | Record claim, evidence, reliability and allowed copy. | missing | Implement claim-to-evidence map engine. | CLI/API/MCP/panel | claim map tests | Unsupported claim blocks publication. |
| Claim classification | Distinguish implemented, demo, roadmap and opinion. | missing | Add claim type enum and copy rules. | CLI/API/panel | claim type tests | Roadmap allowed only as roadmap. |
| Case production | Move through problem, decision, implementation, evidence, design, build, publication. | missing | Add case lifecycle and readiness command. | CLI/API/panel | case workflow fixture | Empty case remains draft. |
| Visual proof | Require approved imagery or real captures when visuals carry proof. | partial | Tie asset approval and screenshot evidence to claims. | CLI/panel | asset/evidence tests | Generated visuals labeled correctly. |
| Portfolio site | Manage home, archive, cases, contact, SEO metadata and navigation. | partial | Add public site health and metadata checks. | CLI/panel | portfolio health smoke | Missing public URL is intake gap. |
| Public evidence health | Detect broken URLs and stale claims after product changes. | missing | Add URL/stale evidence inspector. | CLI/API/panel | stale claim tests | No automatic rewrite. |
| Asset governance | Promote approved assets as optimized WebP/SEO/manifest/checksum. | partial | Add WordPress asset promotion policy and command. | CLI/panel | asset optimize tests | Source raster remains out of Git. |

Completion blocker: claim-to-evidence map is the core missing capability.


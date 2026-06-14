# PRD 05: Portfolio, Cases, and Evidence

## Product Job

Convert real technical and delivery evidence into clear hiring and sales
signals without inventing outcomes or duplicating project truth.

## Capabilities

### Portfolio strategy

- Define target audiences, desired roles, offers, proof tracks, and current
  evidence gaps.
- Connect every surface to an economic action: contact, case inspection,
  repository inspection, demo, or application support.

### Case seeding

- Create a case seed from product, deliverable, repository, release, or
  evidence bundle.
- Import references, not copied truth.
- Identify unsupported claims before narrative work begins.

### Claim-to-evidence map

- Record each public claim, evidence reference, reliability, and allowed copy.
- Distinguish implemented capability, demonstrated scenario, roadmap, and
  opinion.
- Block unsupported metrics, clients, awards, or compatibility claims.

### Case production

- Move through problem, decision, implementation, evidence, visual design,
  public build, and publication.
- Preserve separation between portfolio case and fictional demo site.
- Require approved imagery or real captures when visuals carry proof.

### Portfolio site

- Manage home, work archive, cases, contact routes, SEO metadata, and public
  navigation.
- Keep curated home selection separate from complete work archive.
- Link products and sites dynamically through canonical project records.

### Public evidence health

- Detect broken repository, demo, case, or contact URLs.
- Detect stale claims after product changes.
- Record update need without rewriting public content automatically.

## Canonical Structure

```text
portfolio/
├── portfolio.yaml
├── strategy/
├── cases/<case>/
│   ├── case.yaml
│   ├── claims.yaml
│   ├── evidence.yaml
│   ├── narrative/
│   ├── design/
│   └── publication/
├── site/
└── evidence-index/
```

## Public Interfaces

```text
seedCase()
mapClaimEvidence()
evaluateCaseReadiness()
approveVisualDirection()
registerCaseImplementation()
prepareCasePublication()
publishCase()
inspectPublicEvidenceHealth()
```

## Dependencies

- Depends on products, projects, repositories, evidence, assets, decisions,
  marketing, and external publication gates.
- Visual implementation depends on calibrated target-environment evidence.

## Acceptance Criteria

- Every public capability claim resolves to evidence.
- Demo-site content never explains the plugin or portfolio unless explicitly
  designed as a case surface.
- Portfolio home can curate work without changing canonical projects.
- Cases survive product updates by reporting stale evidence.
- Publication payload includes URL, metadata, assets, claims, and confirmation.

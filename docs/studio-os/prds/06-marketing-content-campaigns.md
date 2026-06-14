# PRD 06: Marketing, Content, and Campaigns

## Product Job

Turn validated expertise and offers into consistent distribution that reaches
international WordPress buyers, agencies, recruiters, and technical peers.

## Capabilities

### Audience and channel strategy

- Define audience, problem, desired action, channel, language, and proof.
- Maintain channel constraints and content formats.
- Prevent one generic message from being reused across incompatible audiences.

### Campaign planning

- Define goal, audience, offer, evidence, content set, schedule, CTA, and
  measurement.
- Link campaigns to revenue or evidence objectives.
- Set a stop condition before production.

### Content briefing

- Produce briefs from canonical product, case, project, or market evidence.
- Separate hook, thesis, proof, CTA, and channel adaptation.
- Mark claims requiring fresh verification.

### Content production

- Draft, revise, verify, approve, schedule, publish, and repurpose.
- Preserve Guilherme Silva as commercial identity and `kingdonrush` as
  supporting technical identity.
- Generate media only through the asset governance pipeline.

### Publication and performance

- Prepare exact payload and assets.
- Require confirmation before publication.
- Record public URL, date, channel, campaign, and observed response.
- Avoid invented attribution when analytics are incomplete.

### Learning

- Connect replies, leads, profile visits, case views, and opportunities when
  evidence exists.
- Record content lessons separately from universal brand policy.

## Canonical Structure

```text
marketing/
├── strategy/
├── audiences/
├── channels/
├── campaigns/<campaign>/
├── content/<content-id>/
├── calendar/
└── analytics/
```

## Public Interfaces

```text
createCampaign()
createContentBrief()
draftContent()
verifyContentClaims()
preparePublication()
confirmPublication()
recordPublication()
recordCampaignSignal()
closeCampaign()
```

## Dependencies

- Depends on evidence, portfolio, products, offers, assets, communications, and
  prepared-action gates.
- Analytics adapters remain optional and may not override canonical outcomes.

## Acceptance Criteria

- Every campaign has audience, economic goal, CTA, evidence, and stop date.
- Every public claim is verified.
- Publication cannot occur without exact-payload confirmation.
- Repurposed content links to the same evidence instead of copying facts.
- Performance summaries distinguish observed signals from inferred impact.

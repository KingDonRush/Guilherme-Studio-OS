# PRD 08: International Career Pipeline

## Product Job

Systematically identify, qualify, pursue, and learn from international
WordPress employment opportunities using evidence-backed applications.

## Capabilities

### Role strategy

- Define target role families, employment types, geography, timezone,
  language, salary expectations, and unacceptable constraints.
- Map each role family to required signals and existing evidence.

### Job discovery

- Register source URL, organization, role, location, compensation when known,
  requirements, deadline, and contact.
- Deduplicate reposted roles.
- Archive expired roles without deleting intelligence.

### Fit analysis

- Compare role requirements with verified skills, products, cases, and gaps.
- Distinguish explicit requirement, inferred preference, and optional signal.
- Recommend apply, research, defer, or reject with explanation.

### Application preparation

- Assemble resume variant, cover message, portfolio links, repositories,
  answers, and evidence bundle.
- Validate language, claims, URLs, metadata, and file versions.
- Require confirmation before submission.

### Follow-up and interview

- Track submission, recruiter contact, follow-up windows, interview stages,
  preparation, questions, evidence, and outcomes.
- Create interview context packs without exposing unrelated confidential data.

### Learning and pipeline health

- Record rejection, no-response, withdrawal, offer, and acceptance.
- Identify recurring evidence gaps and weak role fit.
- Do not derive market truths from tiny samples without qualification.

## Canonical Structure

```text
career/
├── strategy/
├── role-families/
├── organizations/
├── opportunities/
├── applications/<application>/
│   ├── application.yaml
│   ├── role-snapshot.md
│   ├── fit-analysis.md
│   ├── materials/
│   ├── communications/
│   └── interviews/
└── analytics/
```

## Public Interfaces

```text
registerJobOpportunity()
analyzeRoleFit()
prepareApplication()
validateApplication()
confirmSubmission()
recordApplicationSubmission()
scheduleFollowUp()
recordInterview()
recordOutcome()
resolveCareerNextActions()
```

## Dependencies

- Depends on identity, organizations, portfolio, evidence, communications,
  assets, tasks, and confirmation gates.
- Public job facts may require web research and freshness metadata.

## Acceptance Criteria

- Every submitted application preserves the exact role snapshot and materials.
- Claims resolve to evidence.
- Submission cannot happen without confirmation.
- Follow-up respects channel and timing policy.
- Pipeline views distinguish discovered roles from submitted applications.
- Lessons update strategy only after sufficient evidence or explicit decision.

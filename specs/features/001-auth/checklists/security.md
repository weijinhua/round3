# Security Checklist — Auth (001-auth)

Purpose: Validate the QUALITY of security-related requirements in the feature spec/plan.
Created: 2026-05-04

## Requirement Completeness
- [ ] CHK001 - Are authentication and authorization requirements specified for all protected resources? [Completeness, Spec §FR-003]
- [ ] CHK002 - Are error response formats and messages defined for all auth failure modes (invalid credentials, expired token, unverified account)? [Completeness, Spec §FR-005]
- [ ] CHK003 - Are rate-limiting requirements for signup, login, and password-reset endpoints quantified? [Completeness, Spec §FR-008]

## Requirement Clarity
- [ ] CHK004 - Is the session lifetime (1 hour) explicitly documented and unambiguous across spec and plan? [Clarity, Spec §FR-002]
- [ ] CHK005 - Are password strength rules (min length, composition) defined with exact validation criteria and examples? [Clarity, Spec §FR-007]
- [ ] CHK006 - Is the behavior for accounts that attempt actions while unverified clearly specified (e.g., login attempts, resend verification)? [Clarity, Spec §FR-002, FR-010]

## Requirement Consistency
- [ ] CHK007 - Do token TTLs in the plan/research (verification 24h, reset 1h) match the acceptance criteria and implementation notes? [Consistency, Plan §Phase0]
- [ ] CHK008 - Are refresh token storage and rotation requirements consistent with the constitution's Redis key patterns (`refresh:{userId}:{tokenId}`)? [Consistency, Constitution §III]

## Acceptance Criteria Quality
- [ ] CHK009 - Are measurable delivery SLAs for verification and reset emails specified or referenced for monitoring? [Measurability, Spec §SC-002]
- [ ] CHK010 - Is the success criteria for password-reset flows (e.g., 99% success before expiry) linked to observable logs/metrics? [Measurability, Spec §SC-003]

## Scenario & Edge Case Coverage
- [ ] CHK011 - Are account-existence disclosure rules specified for endpoints that could leak user existence (signup, password-reset)? [Coverage, Spec §Edge Cases]
- [ ] CHK012 - Are rate-limit and abuse mitigation recovery paths and user-facing messages defined for locked or throttled users? [Edge Case, Spec §Edge Cases]
- [ ] CHK013 - Are handling requirements for bounced/deliverability-failed verification or reset emails specified? [Edge Case, Spec §Edge Cases]

## Non-Functional & Operational Requirements
- [ ] CHK014 - Are logging and audit requirements for security-relevant events (failed logins, token issuance, password resets) specified with retention/monitoring guidance? [Non-Functional, Spec §FR-009]
- [ ] CHK015 - Are operational runbooks or quickstart steps defined for local testing of email delivery and worker failure modes? [Operational, Plan §Phase1, Quickstart]

## Dependencies & Assumptions
- [ ] CHK016 - Are external dependency requirements (email provider, Redis availability) documented along with fallback or degraded-mode behavior? [Dependency, Research]
- [ ] CHK017 - Are assumptions about single vs. multi-instance deployments and how rate-limits persist across instances documented? [Assumption, Constitution §III]

## Ambiguities & Conflicts
- [ ] CHK018 - Are any ambiguous terms (e.g., "short-lived", "fast") used in security-related requirements quantified or flagged for clarification? [Ambiguity]


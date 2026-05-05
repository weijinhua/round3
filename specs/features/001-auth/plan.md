# Auth feature implementation plan

## Context
- Feature spec: [f:/sdd/tutorial/round3/specs/features/001-auth/spec.md](f:/sdd/tutorial/round3/specs/features/001-auth/spec.md)
- Constitution: [f:/sdd/tutorial/round3/.specify/memory/constitution.md](f:/sdd/tutorial/round3/.specify/memory/constitution.md)

## Outcome
Create: `specs/features/001-auth/plan.md`, plus `research.md`, `data-model.md`, `/contracts/`, and `quickstart.md` under `specs/features/001-auth/`.

## Plan (phased, concise)

Phase 0 — Research (resolve NEEDS CLARIFICATION)
- Investigate email delivery options (SMTP vs provider), delivery SLA, and retry/backoff patterns.
- Decide verification/reset token TTL and token format (opaque vs signed JWT) consistent with constitution (Redis TTL patterns).
- Select password breach/blocklist strategy (local list vs HaveIBeenPwned API) and rate-limit thresholds.
- Confirm background worker / job queue pattern available in repo for sending emails.

Phase 1 — Design & Contracts
- Produce `data-model.md`: User, Session, VerificationToken, PasswordResetToken entities with fields, indexes, and validation rules.
- Confirm session/token model: adopt JWT access token (15m) + refresh token (7d stored in Redis) and record decisions in `data-model.md`.
- Define API contracts under `/contracts/` for endpoints: POST /api/v1/auth/register, POST /auth/verify, POST /auth/login, POST /auth/logout, POST /auth/password-reset/request, POST /auth/password-reset/confirm.
- Quickstart: developer runbook to run migrations, seed email templates, and run local worker/SMTP (docker-compose config).
- Run agent-context update script to add auth decisions to agent context (manual step in pipeline).

Phase 2 — Implementation checklist (high-level)
- Generate TypeORM entities and migration files for the data model.
- Implement NestJS `auth` module: controllers, services, dtos, and entities; apply ValidationPipe rules and JWT guards per constitution.
- Implement email sender worker integration and templates; add rate-limiting middleware on auth endpoints.
- Add unit tests for DTO validation, service logic, and integration tests for registration→verification and password reset flows.
- Add logging for security events and Redis refresh-token storage following key patterns (`refresh:{userId}:{tokenId}`).

## Success gates
- All NEEDS_CLARIFICATION resolved in `research.md`.
- Migrations created and runnable locally.
- Tests covering success and failure paths for core flows (signup+verify, login, reset).
- CI passes lint, typecheck, and tests.

## Files to produce (absolute paths)
- `f:/sdd/tutorial/round3/specs/features/001-auth/plan.md` (this plan)
- `f:/sdd/tutorial/round3/specs/features/001-auth/research.md`
- `f:/sdd/tutorial/round3/specs/features/001-auth/data-model.md`
- `f:/sdd/tutorial/round3/specs/features/001-auth/contracts/` (API contract files)
- `f:/sdd/tutorial/round3/specs/features/001-auth/quickstart.md`


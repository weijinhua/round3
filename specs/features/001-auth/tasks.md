# Tasks — Auth feature (001-auth)

## Phase 0 — Research (pre-foundational)

- [X] T000 Decide token storage/format (opaque vs signed JWT), TTLs, and Redis vs DB storage; write `data-model.md` capturing decision and TTLs. Acceptance: `data-model.md` exists and `plan.md` updated.

## Phase 1 — Setup

- [X] T001 Create docker-compose entry for postgres, redis, mailhog at f:/sdd/tutorial/round3/docker-compose.yml
- [X] T002 [P] Add / update f:/sdd/tutorial/round3/.env.local.example with DATABASE_URL, REDIS_URL, MAILER_PROVIDER, MAILER_URL, MAILER_FROM, JWT_SECRET
- [X] T003 Add migration run scripts to f:/sdd/tutorial/round3/apps/api/package.json (scripts: migrate, typeorm:migration:run)
- [X] T004 Create initial SQL migration for auth tables at f:/sdd/tutorial/round3/apps/api/migrations/001_create_auth_tables.sql

## Phase 2 — Foundational

- [X] T005 Create data model doc at f:/sdd/tutorial/round3/specs/features/001-auth/data-model.md (User, Session/RefreshToken, VerificationToken, PasswordResetToken)
- [X] T006 Create API contract file at f:/sdd/tutorial/round3/specs/features/001-auth/contracts/openapi-auth.yaml defining endpoints for register, verify, login, logout, password-reset/request, password-reset/confirm
- [X] T007 [P] Add TypeORM entity: f:/sdd/tutorial/round3/apps/api/src/auth/entities/user.entity.ts (email, passwordHash, verified, createdAt, updatedAt)
- [X] T008 [P] Add TypeORM entity: f:/sdd/tutorial/round3/apps/api/src/auth/entities/session.entity.ts (userId, sessionId, issuedAt, expiresAt)
- [X] T009 [P] Add TypeORM entity: f:/sdd/tutorial/round3/apps/api/src/auth/entities/verification-token.entity.ts (userId, token, expiresAt)
- [X] T010 [P] Add TypeORM entity: f:/sdd/tutorial/round3/apps/api/src/auth/entities/password-reset-token.entity.ts (userId, token, expiresAt)
- [X] T011 Create auth NestJS module scaffold at f:/sdd/tutorial/round3/apps/api/src/auth/auth.module.ts (controllers, providers exports)
- [X] T012 Create DTOs and validation rules at f:/sdd/tutorial/round3/apps/api/src/auth/dto/*.ts (register.dto.ts, login.dto.ts, verify.dto.ts, password-reset-request.dto.ts, password-reset-confirm.dto.ts)

## Phase 3 — User Stories (priority order)

### User Story 1 — Sign up and verify email (P1)

- [X] T013 [US1] Implement AuthService.register in f:/sdd/tutorial/round3/apps/api/src/auth/auth.service.ts (create user pending, hash password with bcrypt, create verification token in DB/Redis, enqueue verification email)
- [X] T014 [US1] Implement POST /api/v1/auth/register controller in f:/sdd/tutorial/round3/apps/api/src/auth/auth.controller.ts (validate DTO, call register)
- [X] T015 [US1] Implement email worker integration to send verification email using templates at f:/sdd/tutorial/round3/specs/features/001-auth/email-templates/verification.html (worker: f:/sdd/tutorial/round3/apps/worker/src/worker.ts)
- [X] T016 [US1] Add verification endpoint POST /api/v1/auth/verify in f:/sdd/tutorial/round3/apps/api/src/auth/auth.controller.ts (consume token, mark user verified)
- [X] T017 [US1] [P] Add DTO validation unit tests for register and verify in f:/sdd/tutorial/round3/apps/api/src/auth/auth.service.spec.ts
- [X] T018 [US1] Add end-to-end story test for signup→verify at f:/sdd/tutorial/round3/specs/features/001-auth/quickstart-tests/signup-verify.test.ts
- [X] T035 [US1] Implement POST /api/v1/auth/verification/resend controller + DTO + service to send a new verification email for expired/invalid tokens; add unit + e2e tests at f:/sdd/tutorial/round3/specs/features/001-auth/quickstart-tests/resend-verification.test.ts

### User Story 2 — Login and session management (P1)

- [X] T019 [US2] Implement AuthService.login in f:/sdd/tutorial/round3/apps/api/src/auth/auth.service.ts (verify credentials, check verified flag, issue access token (15m) and refresh token (7d) and persist refresh token in Redis)
- [X] T020 [US2] Implement POST /api/v1/auth/login controller in f:/sdd/tutorial/round3/apps/api/src/auth/auth.controller.ts (validate DTO, call login)
- [X] T021 [US2] Implement session storage with Redis keys pattern `refresh:{userId}:{tokenId}` and session invalidation in f:/sdd/tutorial/round3/apps/api/src/auth/session.service.ts
- [X] T022 [US2] Add unit tests for login success/failure and session handling in f:/sdd/tutorial/round3/apps/api/src/auth/auth.service.spec.ts
- [X] T023 [US2] Add end-to-end story test for login→session→logout at f:/sdd/tutorial/round3/specs/features/001-auth/quickstart-tests/login-session.test.ts

### User Story 3 — Password reset (P2)

- [X] T024 [US3] Implement password reset request flow in f:/sdd/tutorial/round3/apps/api/src/auth/auth.service.ts (create password-reset token, enqueue reset email using password_reset.html template)
- [X] T025 [US3] Implement POST /api/v1/auth/password-reset/request and /confirm controllers in f:/sdd/tutorial/round3/apps/api/src/auth/auth.controller.ts
- [X] T026 [US3] Add end-to-end test for password reset flow at f:/sdd/tutorial/round3/specs/features/001-auth/quickstart-tests/password-reset.test.ts
- [X] T027 [US3] Add unit tests for password reset token validation and password strength rules in f:/sdd/tutorial/round3/apps/api/src/auth/auth.service.spec.ts

### User Story 4 — Logout and session expiry (P2)

- [X] T028 [US4] Implement logout endpoint POST /api/v1/auth/logout in f:/sdd/tutorial/round3/apps/api/src/auth/auth.controller.ts to invalidate session/token
- [X] T029 [US4] Add background job or TTL enforcement test for session expiry in f:/sdd/tutorial/round3/apps/api/src/auth/session.service.spec.ts

- ## Final Phase — Polish & Cross-Cutting

- [X] T030 Add rate-limiting middleware configuration for auth routes at f:/sdd/tutorial/round3/apps/api/src/common/middleware/rate-limit.middleware.ts and enable for auth endpoints
- [X] T031 Add security logging for failed logins, password resets, and verification attempts in f:/sdd/tutorial/round3/apps/api/src/common/logging/security.logger.ts
- [X] T032 Update CI (GitHub Actions) workflow to run auth unit and integration tests (file: f:/sdd/tutorial/round3/.github/workflows/auth-tests.yml)
- [X] T033 Document local quickstart steps in f:/sdd/tutorial/round3/specs/features/001-auth/quickstart.md (ensure migrations, docker-compose, and MailHog steps are present)
- [X] T034 [P] Run migration generation and verify migrations at f:/sdd/tutorial/round3/apps/api/migrations/ (follow TypeORM project scripts)
- [X] T036 Instrument email delivery: log send/accepted/delivered timestamps and emit metric `auth.email.delivery_latency_seconds` (histogram); add verification test asserting logs/metrics exist.
- [X] T037 Implement breached-password blocklist or add explicit backlog TODO with rationale and tests (e.g., integrate HaveIBeenPwned or local list).

## Dependencies

- Story order: Phase1 → Phase2 → [US1, US2] (can proceed in parallel after foundational completed) → [US3, US4] → Final Phase

## Parallel execution suggestions

- Work that can be done in parallel (mark [P]): DTOs, entity files, and contract docs (T006, T007, T008, T009, T010, T012) can be done in parallel by different engineers/agents.
- Tests can be added in parallel with implementation of their corresponding services once DTOs/entities exist.

## Notes

- All tasks include explicit target paths. Implementations MUST follow project stack: NestJS, TypeORM, class-validator, bcrypt, Redis for sessions, and Mail worker for emails.


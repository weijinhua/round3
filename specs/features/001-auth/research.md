# research.md — Authentication (001-auth)

## Decision: Email delivery
- Choice: Use a provider-backed SMTP transport (default: SendGrid/SES) for production; use MailHog or local SMTP for developer environment.
- Rationale: Provider SMTP gives reliable deliverability and simpler retry/backoff; local MailHog enables offline development and deterministic tests.
- Implementation notes:
  - Configure via env: `MAILER_PROVIDER` (sendgrid|ses|smtp), `MAILER_URL` / provider-specific keys.
  - Send emails asynchronously via a Redis-backed queue `mail:queue`.

## Decision: Token format and TTL
- Choice: Use opaque, single-use tokens (cryptographically-random 32 bytes, base64url) stored as hashed values (SHA-256) in Redis or DB. Do NOT encode user data in the token.
- TTLs:
  - Verification token: 24 hours
  - Password reset token: 1 hour
- Rationale: Opaque tokens are revocable, safe to rotate, and avoid long-lived bearer JWTs for verification workflows.
- Implementation notes:
  - Store tokenHash = sha256(token) and compare hashes at consumption time.
  - Keep metadata (userId, issuedAt, expiresAt) alongside tokenHash in Redis with TTL.

## Decision: Password breach/blocklist strategy
- Choice: Ship with an offline local blocklist (top N commonly breached passwords) for immediate enforcement; add optional HaveIBeenPwned (k-Anonymity) background checks as a non-blocking enhancement.
- Rationale: Offline blocklist avoids external network dependency for the main request path and satisfies initial security requirements; HIBP can be added later for extra coverage.
- Implementation notes:
  - Validate password strength: min length 8, must include letters and numbers (per spec).
  - Reject passwords if present in local blocklist (maintain as a package asset or seeded DB table).

## Decision: Rate limiting and abuse mitigation
- Choice: Enforce per-IP and per-account rate limits on auth endpoints. Recommended thresholds (initial):
  - Login attempts: 5 per 15 minutes per IP / account
  - Signup attempts: 5 per hour per IP
  - Password-reset requests: 3 per hour per account
- Implementation notes:
  - Use NestJS Throttler or an equivalent Redis-backed rate limiter so limits persist across instances.
  - Log and surface suspicious activity to security logs.

## Decision: Background worker pattern for email delivery
- Choice: Implement a simple worker process that reads jobs from Redis list/stream `mail:queue` and sends via configured SMTP transport. Worker runs as a separate Docker service (`worker`) in development and production.
- Rationale: Keeps API request latency low and isolates transient provider failures into a retryable worker process.
- Implementation notes:
  - Job schema: { type: 'verification'|'reset', userId, email, templateName, payload, attempt }
  - Worker should implement exponential backoff with max attempts and move failed jobs to `mail:failed` for inspection.
  - Local dev: use MailHog service in docker-compose and a lightweight worker in `apps/worker`.

## Open questions / assumptions (explicit)
- Assumption: A Redis instance is available for token and queue storage (constitution mandates Redis in stack).
- Assumption: A background worker service is acceptable in the monorepo; if the repo already has a worker pattern, integrate with it instead of adding a new implementation.
- If the team prefers signed tokens (JWT) for verification/reset, we can change approach — but opaque tokens are recommended for revocation and simplicity.

## Deliverables from research
- This file: `specs/features/001-auth/research.md`
- Action items:
  - Add local breached-password blocklist asset (top 100k) and lookup helper.
  - Add env keys to `.env.example`: MAILER_PROVIDER, MAILER_URL, MAILER_FROM, MAILER_API_KEY.
  - Add `worker` service to `docker-compose.yml` reading `mail:queue`.


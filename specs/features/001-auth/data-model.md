# Auth Data Model — Decision Record

Decision: Adopt a hybrid JWT + refresh-token model aligned with project constitution.

Summary
- Access Token: signed JWT, short TTL (15 minutes). Contains minimal claims (sub: userId, iat, exp, jti optional).
- Refresh Token: opaque random token ID stored in Redis with key pattern `refresh:{userId}:{tokenId}` and TTL 7 days. Refresh token rotation is recommended on use.

Entities
- User
  - id (UUID)
  - email (string, unique, indexed)
  - passwordHash (string)
  - verified (boolean)
  - createdAt, updatedAt

- VerificationToken
  - userId (UUID)
  - token (string, time-limited)
  - expiresAt (timestamp)

- PasswordResetToken
  - userId (UUID)
  - token (string, time-limited)
  - expiresAt (timestamp)

- RefreshToken (Redis-backed)
  - stored as Redis key: `refresh:{userId}:{tokenId}` => JSON { tokenId, issuedAt, expiresAt, meta }
  - TTL managed by Redis (7 days)

Notes & Rationale
- Using signed JWTs for access tokens allows stateless validation at 15m TTL for performance.
- Storing refresh tokens in Redis enables server-side revocation and rotation, satisfying governance requirements.
- Refresh tokens are opaque IDs (not JWTs) to limit exposure of server-side state in tokens.
- Alternative (opaque refresh tokens in DB) considered but Redis chosen for speed and alignment with constitution key patterns.

Next steps
- Implement token generation and storage in auth service.
- Add tests for token rotation, revocation, and TTL enforcement.

# Auth data model\n+\n+## User\n+- Table: `auth_users`\n+- Fields:\n+  - `id: UUID` (PK, gen_random_uuid())\n+  - `email: string` (unique, validated, max 320)\n+  - `passwordHash: string` (bcrypt hashed)\n+  - `verified: boolean` (default false)\n+  - `createdAt: timestamptz`\n+  - `updatedAt: timestamptz`\n+\n+Indexes:\n+- unique index on `email`\n+\n+Validation rules:\n+- Email must be a valid RFC email\n+- Passwords: min 8, max 128, must include letters and numbers\n+\n+## Session\n+- Table: `auth_sessions`\n+- Fields:\n+  - `id: UUID` (PK)\n+  - `userId: UUID` (FK -> auth_users.id)\n+  - `sessionId / token: string` (opaque ID for refresh token storage)\n+  - `issuedAt: timestamptz`\n+  - `expiresAt: timestamptz`\n+  - `createdAt: timestamptz`\n+\n+Storage and TTL:\n+- Refresh tokens stored in Redis under key `refresh:{userId}:{tokenId}` with TTL matching `expiresAt`.\n+- Access tokens are short-lived JWTs (stateless).\n+\n+Notes:\n+- Verification and password-reset tokens are signed JWTs (stateless) — no DB tables for tokens per feature decision.\n*** End Patch```json
# data-model.md — Authentication (001-auth)

## Entities

### User
- Table: auth_users
- Fields:
  - id: UUID (primary key), default gen_random_uuid()
  - email: varchar(255), unique, not null
  - passwordHash: varchar(255), not null
  - verified: boolean, not null, default false
  - createdAt: timestamptz, not null, default now()
  - updatedAt: timestamptz, not null, default now()
- Validation:
  - email: valid email format
  - password: hashed with bcrypt cost factor 12 (never store plaintext)

### Session
- Table: auth_sessions
- Fields:
  - id: UUID (primary key)
  - userId: UUID (FK -> auth_users.id), not null
  - sessionId: varchar(128), not null, unique (opaque random id exposed to client)
  - issuedAt: timestamptz, not null
  - expiresAt: timestamptz, not null
  - createdAt: timestamptz, not null, default now()
- Notes:
  - Refresh tokens are stored in Redis per constitution using key pattern `refresh:{userId}:{tokenId}` with 7 day TTL.

### VerificationToken (Redis)
- Store ephemeral verification tokens in Redis as key `verify:{tokenHash}` -> { userId, issuedAt, expiresAt }
- Token format: opaque random 32 bytes (base64url); store only sha256(token) as key or field.
- TTL: 24 hours

### PasswordResetToken (Redis)
- Same pattern as VerificationToken.
- TTL: 1 hour

## Indexes & Constraints
- `auth_users.email` unique index
- `auth_sessions.sessionId` unique index
- FK constraint `auth_sessions.userId` -> `auth_users.id`

## Migration notes
- Provide SQL migration to create `auth_users` and `auth_sessions` tables (see migrations folder).
- Do not store verification/reset tokens in the database — use Redis for token storage to enable fast expiry and revocation.

## Implementation checklist (data layer)
- Create TypeORM entities under `apps/api/src/auth/entities/` for `User` and `Session`.
- Add migration SQL under `apps/api/migrations/` and register with project migration tooling.
- Seed a minimal breached-password blocklist or provide lookup helper referencing a packaged asset.


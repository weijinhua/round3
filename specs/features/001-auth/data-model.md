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


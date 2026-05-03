# Feature: Auth (Email + Password)

## 0. Version
See `../001-auth/version.md`

## 1. Scope
- Email registration, password login, session cookie (HTTP-only), basic validation and error flows.

## 2. Out of Scope
- OAuth/social login, 2FA, passwordless.

## 3. Interfaces
- POST /api/auth/register { email, password } -> 201 / errors
- POST /api/auth/login { email, password } -> 200 { token } / 401
- GET /api/auth/me -> 200 { user } / 401

## 4. Data Model
- User { id, email, passwordHash, createdAt }

## 5. Dependencies
- 000-ui-foundation (components for forms)
- PostgreSQL (users table), Redis (session)

## 6. Acceptance Criteria
- Successful register/login flows with validation tests.
- Protected endpoints return 401 when unauthenticated.

## 7. UI Specification
- Use Form primitives from `specs/ui/components.md`. Follow i18n text tokens.

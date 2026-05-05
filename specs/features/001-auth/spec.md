# Feature Specification: Authentication (001-auth)

**Feature Branch**: `001-auth`  
**Created**: 2026-05-04  
**Status**: Draft  
**Input**: User description: "@specs/features/001-auth"

## User Scenarios & Testing

### User Story 1 - Sign up and verify email (Priority: P1)

An end user can create an account with email and password, receive a verification email, and confirm their email address.

**Why this priority**: Core onboarding flow required to access protected features.

**Independent Test**: Create account with valid email and password → receive verification email → click verification link → account marked verified and able to sign in.

**Acceptance Scenarios**:
1. **Given** an unauthenticated user, **When** they submit a valid email and password, **Then** an account is created in a pending state and an email verification is sent.
2. **Given** a user with a pending account, **When** they click the verification link within the valid window, **Then** the account becomes verified and user can sign in.
3. **Given** an expired or invalid verification link, **When** the user attempts to verify, **Then** an informative error is shown and the user can request a new verification email.

---

### User Story 2 - Login and session management (Priority: P1)

End users can sign in using email and password (only verified accounts allowed). Successful login issues a short-lived access token and a longer-lived refresh token to manage authentication sessions. Access tokens expire after 15 minutes; refresh tokens expire after 7 days and are stored server-side (Redis) for revocation and lifecycle management. No persistent "remember me" sessions at launch.

**Why this priority**: Allows authenticated use of product features.

**Independent Test**: With a verified account, sign in with correct credentials, verify session persists for expected duration, and logout ends the session.

**Acceptance Scenarios**:
1. **Given** a verified account, **When** correct credentials are submitted, **Then** the user is authenticated, an access token valid for 15 minutes and an associated refresh token valid for 7 days are issued, and the user is redirected to their dashboard.
2. **Given** incorrect credentials, **When** a login is attempted, **Then** a clear error is returned and no session is created.
3. **Given** an authenticated session, **When** user logs out, **Then** the session is invalidated and subsequent requests require re-authentication.
4. **Given** an access token older than its TTL (15 minutes), **When** the user makes a request, **Then** the access token is rejected and the client may use a valid refresh token to obtain a new access token. Refresh tokens invalidated on logout must be rejected.

---

### User Story 3 - Password reset (Priority: P2)

Users who forgot their password can request a password reset link by email and set a new password.

**Why this priority**: Reduces support overhead and is standard user expectation.

**Independent Test**: Request password reset for an existing account → receive reset email → use link to set new password → login with new password succeeds.

**Acceptance Scenarios**:
1. **Given** a registered email, **When** the user requests a password reset, **Then** a time-limited reset link is emailed.
2. **Given** a valid reset link, **When** the user sets a new password meeting strength rules, **Then** the password is updated and the user can sign in.
3. **Given** an invalid or expired reset link, **When** used, **Then** the system shows an error and allows requesting a new link.

---

### User Story 4 - Logout and session expiry (Priority: P2)

Users can explicitly log out; inactive sessions expire automatically.

**Independent Test**: After logout or expiry, requests return 401/redirect to login.

---

### Edge Cases

- Attempts to sign up with an email already in use: show non-revealing message that avoids confirming existence of account where appropriate.
- Rate limits on signup, login attempts and password reset requests to mitigate abuse.
- Handling of bounced or undeliverable verification/reset emails.
- Multiple concurrent sessions for same user (allowed, but provide session listing in future).

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow end users to create accounts with email and password.
- **FR-002**: System MUST send a verification email after account creation and mark accounts unverified until verification completes.
- **FR-003**: System MUST allow only verified accounts to sign in.
- **FR-004**: System MUST allow users to request a password reset and set a new password via a time-limited link.
- **FR-005**: System MUST provide clear, non-sensitive error messages for authentication failures (bad credentials, expired tokens).
- **FR-006**: System MUST support user-initiated logout and invalidate corresponding sessions.
- **FR-007**: System MUST enforce password strength rules: minimum length 8 and must include both letters and numbers. The system SHOULD also block commonly breached/compromised passwords.
- **FR-008**: System MUST rate-limit authentication-related endpoints to reduce brute force and abuse.
- **FR-009**: System MUST log security-relevant events (failed logins, password resets, verification attempts) for audit and monitoring.
- **FR-010**: System MUST allow users to request a new verification email if the previous one expired.

### Key Entities

- **User**: Represents an end user account. Attributes: email, passwordHash, verified (boolean), createdAt, updatedAt.
- **Session**: Represents an active authentication session. Attributes: userId, issuedAt, expiresAt, sessionId.
- **VerificationToken**: Time-limited token used to verify email ownership. Attributes: userId, token, expiresAt.
- **PasswordResetToken**: Time-limited token used for password reset. Attributes: userId, token, expiresAt.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can complete account creation and email verification in under 2 minutes (end-to-end).
- **SC-002**: 95% of verification and reset emails are delivered within 2 minutes of request (monitored in logs).
- **SC-003**: 99% of valid password reset flows succeed when used before token expiry.
- **SC-004**: Authentication error messages do not reveal account existence and support team reports reduced password-related tickets after rollout (baseline to be measured).

## Assumptions

- Only end users are in scope for v1 (no admin or service accounts at launch).
- Auth method at launch: Email + password with verification and password reset. No social logins or passwordless for v1.
- Multi-factor authentication (MFA) is out of scope for v1 and may be added as P2/P3.
- An email delivery service (SMTP or provider) and background worker to send emails are available.
 - Authentication will follow the constitution-required model: JWT access tokens (15 minute TTL) and refresh tokens (7 day TTL) stored in Redis for revocation and session management. Implementation details (opaque vs signed refresh tokens, whether refresh tokens are JWTs or opaque IDs) are to be decided in research and recorded in `data-model.md`. No persistent "remember me" sessions at launch.
- Security best practices (hashed passwords, rate limits, token entropy) will be followed; exact mechanisms are determined during planning.
- Password policy summary: minimum length 8, must include both letters and numbers; commonly breached passwords SHOULD be blocked.


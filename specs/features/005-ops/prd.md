# Feature: Ops (Local dev & CI)

## 0. Version
See `../005-ops/version.md`

## 1. Scope
- docker-compose for Postgres 16, Redis 7, API, and Web services; CI checklist for build/test/lint.

## 2. Out of Scope
- Production infra or Kubernetes manifests.

## 3. Interfaces
- Dev scripts: `pnpm install`, `pnpm dev`, `docker-compose up`.

## 4. Data Model
- N/A

## 5. Dependencies
- Cross-cutting: supports all features.

## 6. Acceptance Criteria
- Local dev environment boots with Postgres/Redis; CI pipeline runs tests and typecheck.

## 7. UI Specification
- N/A

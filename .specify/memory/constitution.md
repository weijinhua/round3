<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0 (initial ratification)
Added:
  - Principle I: Code Quality & Type Safety
  - Principle II: Test-First Development
  - Principle III: UX Consistency via Design System
  - Principle IV: Performance by Default
  - Principle V: Simplicity & Minimal Footprint
  - Section: UI Governance & AI Generation Constraints
  - Section: Development Workflow & Quality Gates
  - Section: Governance
Removed: All placeholder tokens
Modified principles: N/A (initial version)
Templates requiring updates:
  - .specify/templates/plan-template.md    ✅ reviewed — Constitution Check gate is generic, no change needed
  - .specify/templates/spec-template.md    ✅ reviewed — no new mandatory sections added
  - .specify/templates/tasks-template.md   ✅ reviewed — task categories align with principles
  - Command files                          ✅ reviewed — no commands/ subfolder exists in this repo
Deferred TODOs: None
-->

# Charts Generator Constitution

## Core Principles

### I. Code Quality & Type Safety

All TypeScript code MUST compile with `strict: true`; no `@ts-ignore` or `any` except where
explicitly justified in a code comment. ESLint `no-restricted-imports` MUST block direct
imports from `packages/design-system/**` — all application code MUST import exclusively from
`@charts-gen/ui`. Raw `style={{}}` attributes are forbidden in all files outside
`packages/design-system/`. Hard-coded color, spacing, or font-size values (magic numbers) are
forbidden everywhere — all visual constants MUST reference design tokens. All component visual
variants MUST be defined via `cva()` — no ad-hoc conditional class strings. Raw HTML block
elements (`<div>`, `<span>`, `<button>`) are forbidden in `app/` and `features/` files; only
design-system components may be used. A component or pattern MUST exist in the design-system
before any page or feature code may reference it.

**Rationale**: Consistent enforcement boundaries make AI-generated code predictable and
auditable. Type safety eliminates entire categories of runtime errors across the full-stack
TypeScript monorepo.

### II. Test-First Development

TDD is mandatory for all design-system components and all backend service/controller code:
tests MUST be written and reviewed, confirmed to FAIL, before implementation begins
(Red-Green-Refactor). Every design-system component folder MUST contain a co-located
`*.test.tsx` unit test file. Every NestJS module MUST have contract tests covering its API
endpoints and integration tests covering inter-module communication. Tests MUST NOT be written
after the fact to satisfy coverage metrics — the failing test is the specification.

**Rationale**: Test-first discipline ensures that the design-system public API and backend
contracts are explicitly defined before implementation, reducing rework and preventing
regression as the codebase grows.

### III. UX Consistency via Design System

All UI imports in application code MUST come from `@charts-gen/ui` — no exceptions. Every
page layout MUST use a named pattern from `packages/design-system/patterns/`; pages MUST NOT
define their own layout grids or flex structures. `<StateShell>` MUST wrap every component
that renders asynchronous data, providing loading skeleton, empty state, and error banner
states consistently. All user-visible strings MUST be wrapped in `t()` from next-intl; no
string literals may appear directly in JSX (default locale: `zh-CN`). New UI elements MUST be
added to `packages/design-system/` first and reviewed before any product page consumes them.
Existing public APIs of components and patterns MUST only be extended additively — new props
MUST be optional with sensible defaults; breaking changes are forbidden.

**Rationale**: A single enforced import boundary and mandatory pattern/state model ensures
every page behaves and looks consistently regardless of which developer or AI agent generates
the code, removing layout reinvention and ad-hoc state handling as failure modes.

### IV. Performance by Default

LLM responses MUST be cached in Redis keyed by the SHA-256 hash of the normalized prompt with
a 1-hour TTL, eliminating duplicate LLM calls for identical inputs. Static assets MUST be
served via CDN with cache headers of at minimum 30 days. The NestJS backend MUST remain
stateless — all shared state (sessions, refresh tokens, LLM cache) MUST reside in Redis,
enabling horizontal scaling without session affinity. LLM generation calls MUST enforce a
30-second timeout; if P99 latency exceeds acceptable thresholds the endpoint MUST migrate to
an async BullMQ job pattern before scaling. Access tokens MUST have a maximum lifetime of
15 minutes. Tailwind CSS JIT mode MUST be used with full content path coverage to ensure
unused utility classes are purged at build time.

**Rationale**: Performance constraints are architectural decisions that become expensive to
retrofit. Caching, statelessness, and token TTL are established at constitution level so they
are non-negotiable implementation requirements, not afterthoughts.

### V. Simplicity & Minimal Footprint

YAGNI applies unconditionally: no infrastructure component is introduced before it is
required. The async BullMQ job queue MUST NOT be activated until synchronous LLM calls
demonstrably fail P99 latency requirements. Adding a new chart type MUST touch exactly two
files (`ai.service.ts` and `ChartCanvas.tsx`) — any change requiring more files is a design
violation. The LLM provider MUST be swappable by changing environment variables only, with
zero code changes. Deprecated public API members MUST be marked `@deprecated` and retained
for exactly one release cycle before removal. Complexity deviations from this constitution
MUST be documented in the `Complexity Tracking` table of the relevant `plan.md` with
justification.

**Rationale**: Complexity compounds. Every pre-emptive abstraction or infrastructure addition
incurs ongoing maintenance cost and increases the surface area for AI-generated code to make
incorrect assumptions. Explicit simplicity rules bound that surface.

## UI Governance & AI Generation Constraints

The following Cursor rules MUST be active in `.cursor/rules/` and MUST be enforced by CI on
every pull request:

| Rule | What It Enforces |
|------|-----------------|
| `no-inline-styles` | Flags `style={{}}` in all files outside `packages/design-system/` |
| `design-system-imports` | Flags any UI import not sourced from `@charts-gen/ui` |
| `no-page-level-css` | Flags `.module.css` files and `className=` with utility strings in `app/` |
| `state-shell-required` | Flags data-fetching components that render without `<StateShell>` |
| `pattern-first` | Flags page files that define layout via raw `div`/flex instead of a named pattern |
| `i18n-strings` | Flags string literals appearing directly in JSX outside `t()` calls |

All pull requests MUST pass a UI review checklist verifying that no rule above is violated
before merge is permitted. AI agents generating frontend code are bound by all six rules
without exception; a rule violation in agent-generated code is treated identically to a
human-authored violation.

## Development Workflow & Quality Gates

The CI pipeline MUST run in this order and MUST be fully green before any merge to the main
branch:

1. **Lint** — ESLint (including `no-restricted-imports`) and Prettier format check
2. **Type-check** — `tsc --noEmit` with `strict: true` across all workspaces
3. **Unit tests** — co-located `*.test.tsx` for design-system; `*.spec.ts` for NestJS units
4. **Integration tests** — API module contract tests and inter-module integration tests
5. **Build** — production build for both `apps/web` and `apps/api`

When using the `/speckit.plan` workflow, the Constitution Check gate in `plan.md` MUST be
completed before Phase 0 research begins and MUST be re-verified after Phase 1 design is
complete. Any deviations from this constitution discovered during planning MUST be documented
in the `Complexity Tracking` table with explicit justification before implementation proceeds.

## Governance

This constitution supersedes all other coding standards, style guides, and ad-hoc conventions
in the Charts Generator project. When this document conflicts with any other guidance, this
document takes precedence.

**Amendment procedure**:
1. Open a pull request that modifies `.specify/memory/constitution.md`.
2. State the rationale for the change and the version bump type (MAJOR / MINOR / PATCH) per
   the semantic versioning policy below.
3. Include a migration plan for any principle removal or redefinition (MAJOR bump).
4. The amendment takes effect only after the pull request is merged.

**Versioning policy**:
- MAJOR: Backward-incompatible governance change — principle removal, redefinition, or
  relaxation of a NON-NEGOTIABLE constraint.
- MINOR: New principle or section added, or material expansion of existing guidance.
- PATCH: Clarifications, wording improvements, or non-semantic refinements.

**Compliance review**: All pull requests and all agent sessions MUST verify compliance against
this document. The runtime development guidance file, if present, is
`.specify/memory/agent-context.md`.

**Version**: 1.0.0 | **Ratified**: 2026-04-28 | **Last Amended**: 2026-04-28

<!--
SYNC IMPACT REPORT
==================
Version change: 1.1.0 -> 1.2.0
Added principles:
  - I.   Sub-path imports from @charts-gen/ui are forbidden
  - II.  Components MUST NOT expose a raw className prop
  - II.  Patterns MUST use Component Layer items only — no raw HTML elements
  - II.  tailwind.preset.ts in design-system is the sole shared Tailwind config
  - II.  Co-located tests required for ALL new components unconditionally
  - III. bcrypt cost factor MUST be 12
  - III. JWT access token TTL 15 min; refresh token TTL 7 days
  - III. Redis key patterns with explicit TTLs and SHA-256 prompt hash
  - III. Allowed chart types are exactly: bar, line, pie, scatter
  - III. Global ValidationPipe with transform:true, whitelist:true
  - III. response.interceptor.ts enforces { data, error } envelope globally
  - III. New backend modules MUST be registered in app.module.ts
  - IV.  react-hook-form + zod added to frontend stack
  - IV.  openai SDK is the required LLM client
  - IV.  Redis 7 and echarts-for-react made explicit
  - V.   globals.css contains CSS custom properties for tokens only
  - V.   Feature slices MUST follow components/hooks/services/types.ts structure
  - V.   shared/ MUST contain hooks/, lib/, types/ only
  - V.   design-system hooks/ MUST NOT call application API
Modified principles:
  - III. Auth: "bcrypt password hashing" -> "bcrypt with cost factor 12"
  - III. Auth: "JWT access tokens" -> "JWT access tokens (15 min TTL), refresh tokens (7 day TTL)"
  - III. AI: cache key now explicitly SHA-256 of normalized prompt, TTL 1h
  - II.  Tests: "when new or behavior changes" -> unconditional for all new components
Removed rules:
  - None
-->
# Charts Generator Constitution

## Core Principles

### I. Frontend Layering & UI Boundary
All frontend code lives in `apps/web` and follows the Next.js App Router scaffold from `specs/03-scaffold.md`.

`app/` page files compose patterns and feature components. They MUST NOT define layouts with `style={{}}`, CSS Modules, or Tailwind utility strings, and they MUST use named patterns for page structure when a suitable pattern exists.

Application code MUST import UI only from `@charts-gen/ui`. Direct imports from `packages/design-system/**` or `packages/ui/**` are forbidden. `packages/ui` is the only public gate to the design system.

Sub-path imports from `@charts-gen/ui` are forbidden — only the top-level alias is allowed. `import { Button } from '@charts-gen/ui/components/Button'` is disallowed; the correct form is `import { Button } from '@charts-gen/ui'`.

Route groups and page locations are fixed by scaffold:
- `apps/web/app/(auth)/login/page.tsx`
- `apps/web/app/(auth)/register/page.tsx`
- `apps/web/app/(dashboard)/dashboard/page.tsx`

### II. Design System as Sole UI Source
`packages/design-system` is the only place where visual primitives, tokens, and layout patterns are defined.

The design system uses a strict dependency order: `tokens` -> `components` -> `patterns`. No layer may import upward, and no design-system file may import from `apps/web`, `apps/api`, or `packages/ui`.

Tokens, components, patterns, hooks, and utils remain inside the design-system package. Application code only consumes them through `@charts-gen/ui`.

All components MUST:
- use tokens for visual values,
- define variants with `cva()`,
- NOT expose a raw `className` prop on the public interface — styles are fully encapsulated via CVA,
- export through a folder-local `index.ts`,
- include a co-located test file (`Component.test.tsx`) unconditionally for every new component.

Patterns MUST:
- be named generically,
- accept `ReactNode` slots or props,
- use design-system components rather than raw HTML elements (`<div>`, `<span>`, `<button>` are forbidden inside pattern files),
- not import page or feature code.

`packages/design-system/tailwind.preset.ts` is the sole shared Tailwind configuration. `apps/web/tailwind.config.ts` extends it via `presets`. No other package defines its own Tailwind configuration.

`packages/design-system/hooks/` contains shared UI hooks (e.g. `useMediaQuery`). These hooks MUST NOT call any application API.

Pages and feature components that render async data MUST wrap it in `<StateShell>`.

All user-visible strings in frontend app and feature code MUST go through `t()` from `next-intl`. The default locale is `zh-CN`.

### III. Backend Module & API Boundary
`apps/api` is a NestJS application with modules at:
- `auth/`
- `charts/`
- `ai/`
- `export/`
- `common/`

The backend exposes REST endpoints under `/api/v1/` and returns the standard JSON envelope `{ data, error }`. The `common/interceptors/response.interceptor.ts` is responsible for wrapping every response in this envelope — it is the enforcement mechanism, not convention.

The global `ValidationPipe` MUST be configured with `transform: true, whitelist: true` in `main.ts`. New backend modules MUST be imported and registered in `apps/api/src/app.module.ts`.

Backend code MUST be stateless. Sessions, refresh tokens, and LLM cache live in Redis. PostgreSQL is the primary database.

Auth MUST use email/password registration, bcrypt password hashing with cost factor 12, JWT access tokens (15 min TTL), and refresh tokens (7 day TTL, stored in Redis). Protected routes MUST use JWT guards.

Redis key patterns:
- `refresh:{userId}:{tokenId}` — TTL 7 days (refresh token store)
- `llm:cache:{promptHash}` — TTL 1 hour (LLM response deduplication)

`promptHash` is the SHA-256 hash of the normalized prompt string.

The AI module MUST call an OpenAI-compatible provider through environment variables using the `openai` SDK — direct HTTP calls to the LLM provider are forbidden. It MUST use structured output (JSON mode) and cache repeated prompt results keyed by `llm:cache:{promptHash}` (SHA-256 of normalized prompt, TTL 1h).

Allowed chart types are exactly: `bar`, `line`, `pie`, `scatter`. Any other value MUST be rejected by the AI module's allow-list.

Chart export MUST run server-side.

### IV. Stack Constraints
Frontend stack:
- Next.js 14 App Router
- React 18
- TypeScript with `strict: true`
- Tailwind CSS v3, but only inside `packages/design-system`
- shadcn/ui components copied into the repo
- CVA for variants
- `clsx` + `tailwind-merge` via the `cn()` helper
- Apache ECharts via `echarts-for-react` (no direct ECharts DOM mounting)
- `next-intl` for i18n
- React built-in state plus SWR for server state
- `react-hook-form` + `zod` for form handling
- No Redux

Backend stack:
- NestJS
- TypeORM
- `class-validator` and `class-transformer`
- `@nestjs/jwt` + Passport
- `openai` SDK as the LLM client (OpenAI-compatible)
- Redis 7 for cache and refresh-token storage
- PostgreSQL 16

Infra and workspace:
- pnpm workspaces
- Docker
- GitHub Actions for CI/CD

### V. Monorepo Scaffold & Naming
The monorepo structure MUST match the scaffold:
- `apps/web/`
- `apps/api/`
- `packages/design-system/`
- `packages/ui/`
- `packages/config/`

`apps/web` MUST keep application logic separated into `app/`, `features/`, `shared/`, `locales/`, and `public/`.

`apps/web/app/globals.css` contains CSS custom properties for tokens only. No other styles may appear in this file.

Feature slices under `apps/web/features/<feature>/` MUST follow the sub-structure: `components/`, `hooks/`, `services/`, `types.ts`.

`apps/web/shared/` MUST contain `hooks/`, `lib/`, and `types/` sub-directories. No business logic belongs here — only cross-feature, non-UI utilities.

`packages/design-system` MUST keep:
- `tokens/`
- `components/`
- `patterns/`
- `hooks/`
- `utils/`
- a single barrel export at `index.ts`
- `tailwind.preset.ts` (shared Tailwind configuration)

`packages/ui` MUST re-export the design system and serve as the sole application import boundary.

Component and pattern folders MUST use the scaffolded folder-per-export shape. New pattern names MUST be abstract, not product-feature names.

Backend modules MUST follow the scaffolded NestJS layout:
- `<module>.module.ts`
- `<module>.controller.ts`
- `<module>.service.ts`
- `entities/`
- `dto/`

### VI. Tests & Quality Gates
TypeScript MUST compile with `strict: true`. New code MUST not introduce `any` or `@ts-ignore` unless the exception is justified inline.

New design-system components MUST have co-located tests unconditionally. Backend endpoints and module behavior MUST be covered by tests appropriate to the module boundary.

The project CI gate MUST pass lint, type-check, unit tests, integration tests, and build before merge.

### VII. Extensibility & Change Rules
New UI capabilities MUST be added to the design system before application code consumes them. Public component APIs SHOULD be additive only; breaking changes require deprecation and migration.

Any new chart type MUST be added to the AI allow-list (`bar`, `line`, `pie`, `scatter` plus the new type) and to the frontend chart renderer map. Chart-type-only changes MUST NOT introduce new architectural layers or API shapes.

The LLM provider MUST remain swappable through environment variables only.

## Governance
This constitution supersedes conflicting ad hoc conventions in the Charts Generator project.

Amendment procedure:
1. Open a pull request that modifies `.specify/memory/constitution.md`.
2. State the rationale and version bump type.
3. Include a migration plan for any breaking change.
4. The amendment takes effect only after merge.

Versioning policy:
- MAJOR: backward-incompatible governance change
- MINOR: new principle or material expansion
- PATCH: clarification or wording improvement

Compliance review: all pull requests and agent sessions MUST verify compliance against this document.

Version: 1.2.0 | Ratified: 2026-04-29 | Last Amended: 2026-04-29

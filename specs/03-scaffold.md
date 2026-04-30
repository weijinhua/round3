# Project Scaffold — Charts Generator

> Generated from: `specs/01-architecture.md` + `specs/02-stack.md`  
> Stack: Next.js 14 · NestJS · Tailwind CSS · shadcn/ui · CVA · pnpm workspaces

---

## 1. Monorepo Structure

```
charts-generator/
├── apps/
│   ├── web/                          # Next.js 14 frontend (App Router)
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── register/
│   │   │   │       └── page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   └── dashboard/
│   │   │   │       └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── globals.css           # Token CSS custom properties only
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── charts/
│   │   │   └── export/
│   │   ├── shared/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   └── types/
│   │   ├── locales/
│   │   │   ├── zh-CN.json
│   │   │   └── en.json
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── api/                          # NestJS backend
│       ├── src/
│       │   ├── auth/
│       │   ├── charts/
│       │   ├── ai/
│       │   ├── export/
│       │   ├── common/
│       │   └── main.ts
│       ├── test/
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   ├── design-system/                # Source of all UI — tokens, components, patterns
│   │   ├── tokens/
│   │   │   ├── colors.ts
│   │   │   ├── spacing.ts
│   │   │   ├── typography.ts
│   │   │   ├── radius.ts
│   │   │   ├── shadow.ts
│   │   │   └── index.ts
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Badge/
│   │   │   ├── Avatar/
│   │   │   ├── Dialog/
│   │   │   ├── Select/
│   │   │   ├── Skeleton/
│   │   │   └── StateShell/
│   │   ├── patterns/
│   │   │   ├── AppLayout/
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   └── index.ts
│   │   │   ├── SplitLayout/
│   │   │   ├── ChatInputPattern/
│   │   │   ├── CardListPattern/
│   │   │   ├── FormPattern/
│   │   │   ├── EmptyPattern/
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   └── useMediaQuery.ts
│   │   ├── utils/
│   │   │   └── cn.ts                 # clsx + tailwind-merge
│   │   ├── index.ts                  # Single public barrel export
│   │   ├── tailwind.preset.ts        # Shared Tailwind preset (tokens → config)
│   │   └── package.json
│   │
│   ├── ui/                           # Re-export gate — app code imports from here
│   │   ├── index.ts                  # re-exports everything from design-system
│   │   └── package.json
│   │
│   └── config/                       # Shared tooling config
│       ├── eslint/
│       │   ├── base.js
│       │   └── next.js
│       ├── tsconfig/
│       │   ├── base.json
│       │   ├── nextjs.json
│       │   └── nestjs.json
│       └── package.json
│
├── docker-compose.yml                # PostgreSQL + Redis + API + Web
├── .env.example
├── .env.local.example
├── pnpm-workspace.yaml
├── turbo.json                        # Turborepo pipeline (optional)
└── package.json                      # Root — workspace scripts only
```

---

## 2. Design System Structure

### Location: `packages/design-system/`

The design-system is the **sole source of UI truth**. No application code may define visual styles outside this package. It is organized into four strict layers with one-directional dependency rules.

---

### 2.1 Token Layer — `tokens/`

**Purpose:** Define every visual constant as a named value. Tokens are the only place where raw values (hex colors, pixel sizes, font weights) are allowed to appear.

```
tokens/
├── colors.ts      # Brand palette, semantic roles (primary, destructive, muted…)
├── spacing.ts     # 4px base scale: 1=4px, 2=8px, 3=12px, 4=16px, 6=24px, 8=32px…
├── typography.ts  # Font families, size scale, weight scale, line-height scale
├── radius.ts      # Border radius scale: sm=4px, md=8px, lg=12px, full=9999px
├── shadow.ts      # Elevation scale: sm, md, lg (as Tailwind shadow values)
└── index.ts       # Barrel export: export * from './colors'; …
```

Tokens are exported as TypeScript constants **and** registered in `tailwind.preset.ts` so all Tailwind utility classes (`bg-primary`, `text-sm`, `p-4`) resolve to token values — never Tailwind's defaults.

```typescript
// tokens/colors.ts
export const colors = {
  primary: 'hsl(221 83% 53%)',
  primaryForeground: 'hsl(0 0% 100%)',
  secondary: 'hsl(210 40% 96%)',
  destructive: 'hsl(0 84% 60%)',
  muted: 'hsl(210 40% 96%)',
  mutedForeground: 'hsl(215 16% 47%)',
  background: 'hsl(0 0% 100%)',
  foreground: 'hsl(222 47% 11%)',
  border: 'hsl(214 32% 91%)',
} as const;
```

CSS custom properties are declared in `apps/web/app/globals.css` using the token values, making them available to Tailwind's CSS variable references at runtime.

**Dependency rule:** Tokens MUST NOT import from any other layer or from application code.

---

### 2.2 Component Layer — `components/`

**Purpose:** Provide reusable, accessible, stateless UI building blocks. Each component is a shadcn/ui primitive copied into the repo and customized against design tokens via CVA.

Every component folder follows this structure:

```
components/Button/
├── Button.tsx      # Component implementation + CVA variants
├── Button.test.tsx # Unit tests
└── index.ts        # Named export only
```

**Rules:**
- Components MUST use tokens (via Tailwind classes that resolve to token values).
- Components MUST define all variants via `cva()` — no ad-hoc conditional class strings.
- Components MUST NOT accept a raw `className` prop on the exported interface (styles are encapsulated).
- Components are stateless by default; state only enters for accessibility patterns (open/closed, focused).
- No business logic; no API calls; no routing.

```typescript
// components/Button/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:   'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:     'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-sm',
        md: 'h-10 px-4 text-base rounded-md',
        lg: 'h-12 px-6 text-lg rounded-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }))} {...props} />;
}
```

**Dependency rule:** Components MUST use tokens. Components MUST NOT depend on patterns or application code.

---

### 2.3 Pattern Layer — `patterns/`

**Purpose:** Compose components into abstract, reusable layout structures. Patterns define spatial grammar — they know nothing about Charts Generator specifically.

| Pattern | Slots / Props | Use in Product |
|---------|---------------|----------------|
| `AppLayout` | `sidebar`, `children`, `sidebarCollapsed?` | Dashboard shell |
| `SplitLayout` | `top`, `bottom` or `left`, `right`, `ratio?` | Chart + prompt area |
| `ChatInputPattern` | `onSend`, `placeholder?`, `loading?` | Prompt input bar |
| `CardListPattern` | `items`, `renderItem`, `onSelect?` | Chart history list |
| `FormPattern` | `fields`, `onSubmit`, `submitLabel?` | Login / Register |
| `EmptyPattern` | `title`, `description?`, `action?` | Empty states |

**Rules:**
- Patterns MUST use Component Layer items only — no raw HTML elements.
- Patterns are slot-based (accept `ReactNode` props) — they define structure, not content.
- Patterns are named generically — never named after a product feature.
- Pages import patterns; patterns NEVER import page code or feature code.

**Dependency rule:** Patterns MUST use components. Patterns MUST NOT depend on application code.

---

### 2.4 Hooks Layer — `hooks/`

Shared UI hooks that belong to the design-system (e.g. `useMediaQuery`, `useControllable`). Must not call any application API.

---

### 2.5 Utils Layer — `utils/`

Utility functions used within the design-system:

```typescript
// utils/cn.ts — the standard class-name merge utility
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### 2.6 Public API — `index.ts`

Single barrel export. All tokens, components, patterns, hooks, and utils are exported here. Nothing in application code may import from a sub-path inside `packages/design-system/`.

```typescript
// packages/design-system/index.ts
export * from './tokens';
export * from './components/Button';
export * from './components/Input';
export * from './components/Card';
export * from './components/StateShell';
// … all components
export * from './patterns/AppLayout';
export * from './patterns/SplitLayout';
// … all patterns
export * from './hooks/useMediaQuery';
export * from './utils/cn';
```

---

### 2.7 Layer Dependency Rules (STRICT)

```
tokens  ←  components  ←  patterns  ←  (application code via @charts-gen/ui)
  ↑              ↑              ↑
  └──────── No reverse deps ────┘

design-system  MUST NOT  import from:  apps/web, apps/api, packages/ui
```

---

## 3. UI Export Layer — `packages/ui`

### Purpose

`packages/ui` is a **thin re-export gate**. It is the single import boundary between application code and the design-system.

```typescript
// packages/ui/index.ts
export * from '@charts-gen/design-system';
```

### Why a separate export layer?

| Reason | Detail |
|--------|--------|
| **Single entry point** | All application code uses `@charts-gen/ui`. The physical location of the design-system can change without touching any feature file. |
| **Selective exposure** | Internals not ready for production can be withheld from the public API by omitting them from this re-export. |
| **UI control enforcement** | Linting rules target `@charts-gen/ui` as the only allowed import source. One rule covers every file. |
| **Future extensibility** | If the team later adds a second component library (e.g. for a mobile app), `packages/ui` can merge both sources without changing any import in feature code. |

### Import discipline

```typescript
// ✅ ALLOWED everywhere in application code
import { Button, AppLayout, tokens } from '@charts-gen/ui';

// ❌ FORBIDDEN — direct path into design-system
import { Button } from '../../packages/design-system/components/Button';

// ❌ FORBIDDEN — direct path into packages/ui internals
import { Button } from '@charts-gen/ui/components/Button';
```

---

## 4. Frontend App Structure — `apps/web`

### Directory Layout

```
apps/web/
├── app/                              # Next.js App Router root
│   ├── (auth)/                       # Route group — no layout wrapper
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/                  # Route group — AppLayout wrapper
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── layout.tsx                    # Root layout: fonts, providers, i18n
│   ├── globals.css                   # CSS custom properties for tokens only
│   └── not-found.tsx
│
├── features/                         # Feature slices (colocated logic)
│   ├── auth/
│   │   ├── components/               # Feature-specific compositions (use @charts-gen/ui)
│   │   ├── hooks/
│   │   ├── services/                 # API call functions (fetch wrappers)
│   │   └── types.ts
│   ├── charts/
│   │   ├── components/
│   │   │   ├── ChartCanvas.tsx
│   │   │   ├── ChartHistorySidebar.tsx
│   │   │   └── PromptInput.tsx
│   │   ├── hooks/
│   │   │   ├── useCharts.ts          # SWR fetcher for chart list
│   │   │   └── useGenerateChart.ts
│   │   ├── services/
│   │   └── types.ts
│   └── export/
│       ├── hooks/
│       └── services/
│
├── shared/                           # Cross-feature, non-UI utilities
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── api.ts                    # Base fetch client with auth headers
│   │   └── i18n.ts                   # next-intl setup
│   └── types/
│       └── api.ts                    # Shared response envelope types
│
├── locales/
│   ├── zh-CN.json                    # Default locale (all UI strings)
│   └── en.json
│
├── public/
│   └── favicon.ico
│
├── next.config.ts
├── tailwind.config.ts                # Extends packages/design-system/tailwind.preset.ts
└── package.json
```

### UI Usage Rules

These are hard rules enforced by Cursor rules and ESLint:

| Rule | Enforcement |
|------|-------------|
| Feature components MUST import from `@charts-gen/ui` only | ESLint `no-restricted-imports` + Cursor rule |
| MUST NOT import from `packages/design-system` directly | Cursor rule `design-system-imports` |
| MUST NOT use `style={{}}` | Cursor rule `no-inline-styles` |
| MUST NOT write Tailwind classes in `app/` or `features/` files | Cursor rule `no-page-level-css` |
| MUST use `<StateShell>` for any async data render | Cursor rule `state-shell-required` |
| MUST use a named pattern for any page layout | Cursor rule `pattern-first` |
| All user-visible strings MUST use `t()` from next-intl | Cursor rule flags string literals in JSX |

### i18n Setup

```typescript
// apps/web/app/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  return (
    <html lang="zh-CN">
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

Default locale: `zh-CN`. All locale files live in `apps/web/locales/`. No hardcoded UI strings anywhere in `app/` or `features/`.

### Page Composition Example

```tsx
// apps/web/app/(dashboard)/dashboard/page.tsx
// Zero styles. Zero layout logic. Zero Tailwind classes.
import { AppLayout, SplitLayout, ChatInputPattern, StateShell } from '@charts-gen/ui';
import { ChartHistorySidebar } from '@/features/charts/components/ChartHistorySidebar';
import { ChartCanvas } from '@/features/charts/components/ChartCanvas';
import { useGenerateChart } from '@/features/charts/hooks/useGenerateChart';

export default function DashboardPage() {
  const { generate, loading } = useGenerateChart();
  return (
    <AppLayout sidebar={<ChartHistorySidebar />}>
      <SplitLayout
        top={<ChartCanvas />}
        bottom={<ChatInputPattern onSend={generate} loading={loading} />}
      />
    </AppLayout>
  );
}
```

---

## 5. Backend App Structure — `apps/api`

### Directory Layout

```
apps/api/src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts          # POST /auth/register, /login, /refresh, /logout
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── dto/
│       ├── register.dto.ts
│       └── login.dto.ts
│
├── charts/
│   ├── charts.module.ts
│   ├── charts.controller.ts        # GET/POST/DELETE /charts, POST /charts/generate
│   ├── charts.service.ts
│   ├── entities/
│   │   └── chart.entity.ts         # TypeORM entity
│   └── dto/
│       ├── create-chart.dto.ts
│       └── generate-chart.dto.ts
│
├── ai/
│   ├── ai.module.ts
│   ├── ai.service.ts               # LLM orchestration, structured output
│   ├── prompts/
│   │   └── system.prompt.ts        # Version-controlled system prompt
│   └── dto/
│       └── chart-config.dto.ts     # Zod/class-validator schema for LLM output
│
├── export/
│   ├── export.module.ts
│   ├── export.controller.ts        # POST /export/:id
│   └── export.service.ts           # Server-side chart-to-image rendering
│
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   └── response.interceptor.ts  # Wraps all responses in { data, error } envelope
│   ├── pipes/
│   │   └── validation.pipe.ts
│   ├── guards/
│   └── config/
│       └── app.config.ts
│
├── app.module.ts
└── main.ts
```

### Module Responsibilities

| Module | Responsibility |
|--------|----------------|
| `AuthModule` | Registration, login, JWT issue/refresh, password hashing (bcrypt cost 12), logout |
| `ChartModule` | CRUD for saved charts, history per user, ownership checks |
| `AIModule` | Prompt ingestion, LLM client (OpenAI-compatible), structured JSON output, prompt hash caching |
| `ExportModule` | Server-side chart-to-PNG rendering |
| `CommonModule` | Guards, interceptors, filters, pipes, global response envelope |

### API Versioning

All routes are prefixed `/api/v1/` via a global prefix in `main.ts`:

```typescript
// main.ts
app.setGlobalPrefix('api/v1');
app.useGlobalFilters(new HttpExceptionFilter());
app.useGlobalInterceptors(new ResponseInterceptor());
app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
```

---

## 6. Config Setup

### 6.1 Tailwind Configuration

Tailwind is configured **only** in `apps/web` and `packages/design-system`. Feature files and page files have no Tailwind config.

```typescript
// apps/web/tailwind.config.ts
import type { Config } from 'tailwindcss';
import { tailwindPreset } from '@charts-gen/design-system/tailwind.preset';

const config: Config = {
  presets: [tailwindPreset],           // All token-to-utility mappings live here
  content: [
    './app/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    '../../packages/design-system/**/*.{ts,tsx}',
  ],
};
export default config;
```

```typescript
// packages/design-system/tailwind.preset.ts
import { colors, spacing, typography, radius, shadow } from './tokens';

export const tailwindPreset = {
  theme: {
    colors,
    spacing,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize,
    borderRadius: radius,
    boxShadow: shadow,
  },
};
```

### 6.2 TypeScript Config

```json
// packages/config/tsconfig/base.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true
  }
}
```

```json
// packages/config/tsconfig/nextjs.json — extends base
{
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@charts-gen/ui": ["../../packages/ui/index.ts"],
      "@/*": ["./*"]
    }
  }
}
```

```json
// packages/config/tsconfig/nestjs.json — extends base
{
  "extends": "./base.json",
  "compilerOptions": {
    "module": "CommonJS",
    "target": "ES2021",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### 6.3 ESLint Config

```javascript
// packages/config/eslint/base.js
module.exports = {
  rules: {
    // Enforce UI import boundary
    'no-restricted-imports': ['error', {
      patterns: [
        { group: ['**/design-system/**'], message: 'Import from @charts-gen/ui instead.' },
        { group: ['**/packages/ui/**'], message: 'Import from @charts-gen/ui package alias.' },
      ],
    }],
  },
};
```

### 6.4 pnpm Workspace

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

## 7. Environment Design

### 7.1 `.env.example` (committed — values omitted)

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/charts_generator

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# LLM Provider (OpenAI-compatible)
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_API_KEY=

# App
PORT=3001
NODE_ENV=development
```

### 7.2 `.env.local.example` (frontend — committed, values omitted)

```bash
# API base URL consumed by Next.js
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

# next-intl default locale
NEXT_PUBLIC_DEFAULT_LOCALE=zh-CN
```

### 7.3 Environment Separation

| File | Purpose | Committed? |
|------|---------|------------|
| `.env.example` | Template with all keys, no values | Yes |
| `.env.local` | Developer overrides (backend) | No (gitignored) |
| `.env.production` | Production secrets (CI/CD injected) | No |
| `.env.local.example` | Frontend template | Yes |

**Rule:** `NEXT_PUBLIC_` prefix variables are safe to expose to the browser. All secrets stay server-side in `apps/api`.

---

## 8. Dependency Rules

### Allowed Import Graph

```
apps/web (features, pages)
  → @charts-gen/ui               (only allowed UI source)
    → packages/ui
      → packages/design-system   (tokens, components, patterns)

apps/api
  → NestJS modules               (no UI dependencies ever)

packages/design-system
  → tokens only (within itself)
  → NO dependency on apps/ or packages/ui

packages/ui
  → packages/design-system only
```

### Forbidden Imports

| From | To | Reason |
|------|----|--------|
| `apps/web/features/` | `packages/design-system/**` | Must go through `@charts-gen/ui` |
| `packages/design-system/` | `apps/**` | Design-system is business-logic-free |
| `packages/design-system/tokens/` | `packages/design-system/components/` | Tokens are a leaf — no upward deps |
| `apps/api/` | `packages/ui` or `packages/design-system` | Backend has no UI |
| `apps/web/app/**/page.tsx` | Any direct style definition | Pages contain zero styles |

---

## 9. UI Governance Integration

### 9.1 Design System Enforcement

The scaffold enforces the design-system boundary structurally and via tooling:

| Mechanism | What it enforces |
|-----------|-----------------|
| `packages/ui` gate | Single import alias; one ESLint rule covers all violations |
| `no-restricted-imports` ESLint rule | Blocks direct imports from `packages/design-system/**` |
| Cursor rule `design-system-imports` | Flags any UI import not from `@charts-gen/ui` in agent-generated code |
| TypeScript path aliases | `@charts-gen/ui` resolves to `packages/ui/index.ts` — no relative path hacks |
| Cursor rule `no-inline-styles` | Flags `style={{}}` in all files outside `packages/design-system/` |
| Cursor rule `no-page-level-css` | Flags `className=` with utility strings in `app/` files |

All pages and features express UI **only through semantic props** (`variant="primary"`, `size="md"`) — raw style values are structurally impossible to reach.

### 9.2 Pattern Usage

The pattern layer prevents layout reinvention:

| Mechanism | What it enforces |
|-----------|-----------------|
| Cursor rule `pattern-first` | Flags page files that define layout via `div/flex` instead of a named pattern |
| Pattern slot interface | Pages can only pass `ReactNode` — structure is owned by the pattern |
| Pattern naming convention | Abstract names (not `DashboardLayout`) prevent product-specific coupling |
| Architecture spec §2.4 | Documents every pattern and its intended use — AI agents can select by name |

### 9.3 AI Code Generation Constraints

The scaffold structure prevents AI agents from generating uncontrolled UI:

| Risk | Structural Prevention | Rule Prevention |
|------|-----------------------|-----------------|
| AI writes `style={{color:'red'}}` | No mechanism accepts raw styles in page layer | `no-inline-styles` Cursor rule |
| AI imports directly from file paths | TypeScript paths only expose `@charts-gen/ui` | `design-system-imports` Cursor rule |
| AI writes Tailwind in page files | Page files have no Tailwind content paths configured | `no-page-level-css` Cursor rule |
| AI invents new layout structures | Pattern layer owns all layout — pages cannot define flex grids | `pattern-first` Cursor rule |
| AI skips loading/error states | `<StateShell>` is the only way to render async data safely | `state-shell-required` Cursor rule |
| AI hardcodes UI strings | All string literals in JSX must be wrapped in `t()` | i18n lint rule |

---

## 10. Extensibility

### 10.1 Adding a New Component

1. Create `packages/design-system/components/NewComponent/` with `NewComponent.tsx`, `NewComponent.test.tsx`, `index.ts`.
2. Define all variants with `cva()` — reference tokens only via Tailwind class names.
3. Export from `packages/design-system/index.ts`.
4. The component is immediately available via `@charts-gen/ui` — no other file changes needed.

**Rule:** A component MUST exist in the design-system before any page or feature may use it. AI agents are instructed to request a component addition before generating code that needs it.

### 10.2 Adding a New Pattern

1. Create `packages/design-system/patterns/NewPattern/` with `NewPattern.tsx` and `index.ts`.
2. Use only Component Layer items — no raw HTML elements.
3. Accept layout content via `ReactNode` slot props.
4. Name the pattern generically (not after a product feature).
5. Export from `packages/design-system/patterns/index.ts` and `packages/design-system/index.ts`.
6. Document the pattern in `specs/01-architecture.md` §2.4 before any page consumes it.

### 10.3 Evolving Tokens

1. Update the value in `packages/design-system/tokens/<file>.ts`.
2. If adding a new token: also add to `tailwind.preset.ts` theme mapping.
3. If renaming a token: add a `@deprecated` alias for the old name and keep it for one release cycle.
4. Tokens are the **only** place where raw values appear — never update a color by finding usages; update the token and all usages resolve automatically.

### 10.4 Adding a New Backend Module

1. Create `apps/api/src/<module>/` with `<module>.module.ts`, `.controller.ts`, `.service.ts`, `entities/`, `dto/`.
2. Import the module in `apps/api/src/app.module.ts`.
3. All new endpoints must be versioned under `/api/v1/` and return the standard `{ data, error }` envelope.

### 10.5 Adding a New Chart Type

Two files only — no structural change:
1. `apps/api/src/ai/ai.service.ts` — add the new type to the `allowedChartTypes` array.
2. `apps/web/features/charts/components/ChartCanvas.tsx` — add the type to the ECharts renderer map.

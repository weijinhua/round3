# Tech Stack Selection — Charts Generator

## 1. Stack Options

---

### Option A — Next.js + Tailwind CSS + shadcn/ui + CVA

#### Overview

| Layer    | Choice                                                        |
|----------|---------------------------------------------------------------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript                 |
| Styling  | Tailwind CSS (utility-first, encapsulated in design-system)   |
| Components | shadcn/ui (copy-in components built on Radix UI primitives) |
| Variants | class-variance-authority (CVA)                                |
| Charts   | Apache ECharts (via echarts-for-react)                        |
| Backend  | NestJS, REST, TypeScript                                      |
| Database | PostgreSQL + Redis                                            |
| Infra    | Docker, GitHub Actions CI/CD                                  |

#### UI Strategy

- **Styling approach:** Tailwind CSS utility classes, but **strictly encapsulated inside `packages/design-system/`**. Pages and features never write Tailwind directly — they import components.
- **Component strategy:** Hybrid — shadcn/ui components are copied into the design-system, then customized to match design tokens. This gives full ownership of the component source while accelerating baseline.
- **Design-system implementation approach:** shadcn/ui components become the Component Layer. CVA manages all visual variants (size, color, state) in a typed, token-bound way. Radix UI primitives handle behavior and accessibility underneath.
- **Pattern support:** Pattern components (`AppLayout`, `SplitLayout`, etc.) are pure layout shells composed from design-system primitives. No Tailwind leaks into page code.
- **AI UI generation friendliness:** Highest. LLMs have abundant training data on Next.js App Router + Tailwind + shadcn + CVA. AI agents can reliably name components and patterns without guessing.

---

### Option B — Next.js + CSS Modules + Fully Custom Components

#### Overview

| Layer    | Choice                                              |
|----------|-----------------------------------------------------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript       |
| Styling  | CSS Modules, CSS custom properties for tokens       |
| Components | Hand-rolled component library                     |
| Variants | Manual prop-to-className mapping                    |
| Charts   | Apache ECharts (via echarts-for-react)              |
| Backend  | NestJS, REST, TypeScript                            |
| Database | PostgreSQL + Redis                                  |
| Infra    | Docker, GitHub Actions CI/CD                        |

#### UI Strategy

- **Styling approach:** CSS Modules scoped to each component. Design tokens defined as CSS custom properties in a global `tokens.css`.
- **Component strategy:** Fully custom — every Button, Input, Card, etc. is hand-written. Maximum control, maximum build time.
- **Design-system implementation approach:** Tokens in `tokens/`, components in `components/`, patterns in `patterns/` — all hand-crafted. No third-party component API dependencies.
- **Pattern support:** Straightforward to implement; layout patterns are CSS Module-styled wrapper components.
- **AI UI generation friendliness:** Medium. AI must learn the custom component API. Without well-known naming conventions (like shadcn), AI frequently invents props or misuses components. Requires more explicit prompting.

---

### Option C — Next.js + Ant Design (antd 5.x)

#### Overview

| Layer    | Choice                                              |
|----------|-----------------------------------------------------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript       |
| Styling  | antd CSS-in-JS (Design Token system built-in)       |
| Components | antd component library                            |
| Variants | antd's internal variant/size props                  |
| Charts   | Apache ECharts (via echarts-for-react)              |
| Backend  | NestJS, REST, TypeScript                            |
| Database | PostgreSQL + Redis                                  |
| Infra    | Docker, GitHub Actions CI/CD                        |

#### UI Strategy

- **Styling approach:** antd's CSS-in-JS with its own token system (`theme.token`). Customized via `ConfigProvider`.
- **Component strategy:** antd provides a comprehensive component library. Patterns are built by composing antd components.
- **Design-system implementation approach:** The antd `ConfigProvider` token system serves as the Token Layer. Components are antd's — no custom Component Layer needed.
- **Pattern support:** Layout patterns compose antd `Layout`, `Sider`, etc. Achievable but pattern/component boundary is blurry when antd provides layout components directly.
- **AI UI generation friendliness:** Medium. AI knows antd well but the large, frequently-changing API surface makes it prone to using deprecated props. antd's token override system is complex to constrain through rules.

---

## 2. Comparison Table

| Dimension                  | Option A (Tailwind + shadcn + CVA) | Option B (CSS Modules + Custom) | Option C (antd)          |
|----------------------------|------------------------------------|----------------------------------|--------------------------|
| Dev speed                  | High — shadcn primitives ready      | Low — all components hand-built  | High — antd has everything|
| Scalability                | High                               | High                             | High                     |
| Cost                       | Low (all OSS)                      | Low (all OSS)                    | Low (all OSS)            |
| AI friendliness            | **Highest**                        | Medium                           | Medium                   |
| UI consistency control     | **Highest** — CVA enforces variants | High — full control              | Medium — antd overrides leak |
| Design-system compatibility| **Excellent** — shadcn is composable| Excellent — fully custom         | Moderate — antd is opinionated|
| Pattern implementation     | Easy                               | Easy                             | Moderate (antd Layout blurs boundaries)|
| i18n support               | via next-intl                      | via next-intl                    | antd + next-intl         |
| Token enforcement          | CVA + Tailwind config              | CSS custom properties            | antd ConfigProvider      |
| Bundle size                | Moderate (Tailwind purges well)    | Small                            | Large (antd is heavy)    |
| a11y out of the box        | High (Radix UI)                    | Manual effort                    | High (antd handles it)   |

---

## 3. Final Selection

**Selected: Option A — Next.js 14 + Tailwind CSS + shadcn/ui + CVA**

### Why Option A for MVP speed

shadcn/ui provides immediately usable, production-quality accessible components (Button, Input, Dialog, Select, etc.) without any build time. The team copies components into the design-system and owns them completely — there is no version lock-in to an upstream library. Compared to Option B, this saves weeks of base component development.

### Why Option A for long-term scalability

Tailwind CSS purges unused styles at build time, resulting in minimal CSS bundles at any scale. The design-system package is independently versioned in the monorepo; teams can consume specific versions. CVA's typed variant system means adding new visual variants never requires hunting through CSS files — it is a single prop addition.

### Why Option A for AI-driven development

LLMs (GPT-4, Claude, Gemini) have extensive coverage of:
- Next.js App Router patterns
- Tailwind CSS utility names
- shadcn/ui component APIs
- CVA `cva()` variant definitions
- Radix UI primitive composition

This means AI-generated code is more likely to produce correct component names, correct prop shapes, and correct layout structures on the first attempt — reducing iteration cycles significantly.

### Why Option A for Design System enforcement

Tailwind utility classes are invisible to page code because they are encapsulated inside `packages/design-system/`. CVA binds variants to token-aligned class sets. The result: a page component can only express UI through named semantic props (`variant="primary"`, `size="md"`) — never through raw style values. This is the hardest constraint to violate accidentally, which makes it the safest foundation for AI code generation.

---

## 4. Final Stack

### Frontend

| Concern            | Technology                                         |
|--------------------|----------------------------------------------------|
| Framework          | Next.js 14 (App Router, TypeScript)                |
| Styling system     | Tailwind CSS v3 (encapsulated in design-system)    |
| Component base     | shadcn/ui (Radix UI primitives, copied into repo)  |
| Variant system     | class-variance-authority (CVA)                     |
| Class utilities    | clsx + tailwind-merge (cn utility)                 |
| Charts             | Apache ECharts via echarts-for-react               |
| i18n               | next-intl (default locale: zh-CN)                  |
| State management   | React built-in (useState, useContext) + SWR for server state; no Redux |
| Form handling      | react-hook-form + zod validation                   |

### Backend

| Concern            | Technology                          |
|--------------------|-------------------------------------|
| Framework          | NestJS (TypeScript)                 |
| API style          | REST, versioned at `/api/v1/`       |
| ORM                | TypeORM                             |
| Auth               | @nestjs/jwt + Passport, bcrypt      |
| Validation         | class-validator + class-transformer |
| LLM client         | openai SDK (OpenAI-compatible API)  |
| Job queue          | BullMQ + Redis (async jobs, future) |

### Database

| Concern  | Technology                         |
|----------|------------------------------------|
| Primary  | PostgreSQL 16                      |
| Cache    | Redis 7                            |

### Infra

| Concern    | Technology                                         |
|------------|----------------------------------------------------|
| Container  | Docker + Docker Compose (local dev)                |
| CI/CD      | GitHub Actions                                     |
| Monorepo   | pnpm workspaces                                    |

---

## 5. UI System Implementation Plan

### 5.1 Design System

**Token Layer — `packages/design-system/tokens/`**

Tokens are defined in two forms:
1. CSS custom properties in `globals.css` (consumed at runtime)
2. TypeScript constants in `tokens.ts` (consumed by CVA and any TS-side logic)

```
packages/design-system/tokens/
├── colors.ts       # Brand, semantic, neutral palette
├── spacing.ts      # 4px base scale (4, 8, 12, 16, 24, 32, 48, 64)
├── typography.ts   # Font families, sizes, weights, line-heights
├── radius.ts       # Border radius scale
├── shadow.ts       # Elevation/shadow scale
└── index.ts        # Barrel export
```

These tokens are registered in `tailwind.config.ts` to replace Tailwind's default scale. All Tailwind utilities (e.g. `text-sm`, `p-4`, `bg-primary`) resolve to token values — not Tailwind defaults.

**Component Layer — `packages/design-system/components/`**

Components are shadcn/ui primitives, copied and customized:
- Each component uses `cn()` (clsx + tailwind-merge) for class composition
- All variants defined via CVA — no ad-hoc conditionals
- Props expose semantic variant names; no raw className prop on exported components

```typescript
// Example: Button.tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);
```

**Pattern Layer — `packages/design-system/patterns/`**

Patterns are React components that compose Component Layer items into layout structures:

```
packages/design-system/patterns/
├── AppLayout.tsx        # Sidebar shell + main content
├── SplitLayout.tsx      # Top/bottom or left/right split
├── ChatInputPattern.tsx # Sticky bottom input bar
├── CardListPattern.tsx  # Scrollable selectable list
├── FormPattern.tsx      # Labeled field rows with validation
├── EmptyPattern.tsx     # Centered empty state
└── index.ts
```

### 5.2 Pattern Support

Layout abstraction is implemented via slot-based React composition. Patterns accept ReactNode slots — they define structure, not content:

```tsx
// AppLayout.tsx
interface AppLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  sidebarCollapsed?: boolean;
}

export function AppLayout({ sidebar, children, sidebarCollapsed }: AppLayoutProps) {
  return (
    <div className={cn('flex h-screen overflow-hidden', ...)}>
      <aside className={cn('flex-shrink-0 transition-all', sidebarCollapsed ? 'w-0' : 'w-64')}>
        {sidebar}
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
```

Pages compose patterns without knowing their internals:

```tsx
// app/dashboard/page.tsx — zero styles, zero layout logic
export default function DashboardPage() {
  return (
    <AppLayout sidebar={<ChartHistorySidebar />}>
      <SplitLayout
        top={<ChartCanvas />}
        bottom={<ChatInputPattern onSend={handleSend} />}
      />
    </AppLayout>
  );
}
```

### 5.3 AI Constraints Support

| Risk | Prevention Mechanism |
|------|----------------------|
| AI writes `style={{color:'red'}}` | Cursor rule `no-inline-styles` flags all `style=` in app code |
| AI imports directly from relative paths | Cursor rule `design-system-imports` requires `@charts-gen/ui` |
| AI writes Tailwind classes in pages | Cursor rule `no-page-level-css` flags `className=` with utility strings in `app/` |
| AI invents new layout | Cursor rule `pattern-first` flags any div/flex layout in page files not using a named pattern |
| AI skips loading/error states | Cursor rule `state-shell-required` flags async data without `<StateShell>` |
| AI uses raw HTML elements | ESLint rule flags `<div>` / `<span>` / `<button>` directly in page files (must use design-system components) |

---

## 6. Risks & Trade-offs

### UI System Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| shadcn/ui component APIs change upstream | Low | Components are copied into repo — no upstream version dependency after copy |
| Tailwind config diverges from tokens | Medium | Tokens are the single source; `tailwind.config.ts` imports from `tokens.ts` directly |
| Pattern layer grows too large | Low | Patterns are abstract; product-specific composition stays in pages |
| CSS purge removes needed classes | Low | JIT mode + safelist for dynamic CVA classes |

### AI Generation Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| AI generates Tailwind classes in pages | High | Cursor rules + ESLint enforce boundary; CI fails on violation |
| AI uses a component that doesn't exist yet | Medium | Architecture spec mandates design-system-first; AI instructed to stop and request component addition |
| AI ignores i18n (hardcodes strings) | Medium | Cursor rule flags string literals in JSX outside `t()` calls |
| AI mixes pattern and page concerns | Medium | Pattern-first rule flags layout structures in page files |

### Complexity vs Control Trade-off

The chosen stack (Tailwind + shadcn + CVA) introduces one deliberate tension: Tailwind is a utility-first system, which is inherently permissive. The control mechanism — encapsulating Tailwind inside the design-system and forbidding it in page code — adds a discipline layer that must be enforced through rules, not the language itself.

The trade-off is accepted because:
1. The enforcement mechanism (Cursor rules + ESLint + CI) is reliable and automatable.
2. The AI-friendliness gain from Tailwind + shadcn patterns outweighs the governance cost.
3. Option B (CSS Modules) would require 4–6 additional weeks of base component work with no AI-friendliness advantage.
4. Option C (antd) trades control for speed but makes design-system boundary enforcement significantly harder — antd's own layout components blur the pattern/component distinction.

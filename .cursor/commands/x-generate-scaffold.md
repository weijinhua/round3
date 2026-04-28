You are a senior fullstack engineer.

Input:
- @specs/01-architecture.md
- @specs/02-stack.md

Task:
Generate a production-ready project scaffold.

The scaffold MUST support:
- Design System driven UI
- AI-generated UI with strict constraints
- scalable monorepo structure

---

Output to: @specs/03-scaffold.md

Include:

# 1. Monorepo Structure

Provide a full directory tree.

Must include:

- apps/
  - web (frontend)
  - api (backend)

- packages/
  - design-system (CRITICAL)
  - ui (shared UI export layer)
  - config (eslint / tsconfig)

---

# 2. Design System Structure (MANDATORY)

Inside packages/design-system:

## Required structure:

- tokens/
  - color.ts
  - spacing.ts
  - typography.ts
  - radius.ts

- components/
  - Button/
  - Input/
  - Card/

- patterns/
  - AppLayout/
  - SplitLayout/
  - FormPattern/

- hooks/
- utils/
- index.ts

Explain:
- purpose of each layer
- dependency rules

---

## Layer Responsibilities

- tokens:
  define all visual variables (color, spacing, typography)

- components:
  provide reusable UI building blocks

- patterns:
  define layout structures and page composition rules

---

## Dependency Rules (STRICT)

- components MUST use tokens
- patterns MUST use components
- tokens MUST NOT depend on any other layer

- design-system MUST NOT depend on business code

---

## Design Principles

- UI must be token-driven
- UI must be component-based
- UI must be pattern-based

# 3. UI Export Layer (CRITICAL)

packages/ui:

- re-export design-system

Explain:
- why UI must go through a single entry point
- how it enforces UI control

---

# 4. Frontend App Structure (apps/web)

Must include:

- app/
- pages/ or app router
- features/
- shared/

Explain:

## UI Usage Rules:
- features MUST use packages/ui
- MUST NOT import design-system directly (optional strict mode)

---

# 5. Backend App Structure (apps/api)

- modules/
- services/
- controllers/

---

# 6. Config Setup

Include:

- Tailwind config location
- tsconfig (monorepo paths)
- eslint rules

---

# 7. Environment Design

- .env structure
- separation (dev / prod)

---

# 8. Dependency Rules (VERY IMPORTANT)

Define allowed imports:

- feature → ui → design-system
- design-system → NO business code

---

# 9. UI Governance Integration (CRITICAL)

Explain how scaffold supports:

## 9.1 Design System enforcement
- central UI layer
- no direct styling

## 9.2 Pattern usage
- layout abstraction ready

## 9.3 AI constraints
- structure prevents free-style UI

---

# 10. Extensibility

Explain how to:

- add new component
- add new pattern
- evolve tokens

---

Constraints:
- clean architecture
- scalable
- monorepo-friendly
- MUST align with architecture UI system

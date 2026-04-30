You are a senior software architect.

Input: @specs/00-prd.md

Task:
Convert the PRD into a production-ready architecture spec.

Constraints:
- prefer simple design
- avoid over-engineering
- MUST design a scalable UI system (Design System driven)
- MUST support AI-generated UI with strict constraints

---

Output to: @specs/01-architecture.md

Include:

# 1. System Architecture
- system architecture diagram (text)
- frontend/backend split
- service boundaries
- system modules

---

# 2. Frontend Architecture (IMPORTANT)

## 2.1 UI Architecture Model (MANDATORY)

Define a layered UI system:

- Page Layer (business pages)
- Pattern Layer (layout abstraction)
- Component Layer (reusable UI components)
- Token Layer (design tokens: color, spacing, typography)

Explain responsibilities and boundaries for each layer.

---

## 2.2 Design System Strategy (MANDATORY)

- UI MUST be driven by a centralized design-system
- design-system MUST include:
  - tokens
  - components
  - patterns

Define:
- where design-system lives (directory)
- how it is consumed (shared/ui)
- how it evolves (extensibility rules)

---

## 2.3 UI Control Boundaries (CRITICAL)

Define strict rules:

- business code MUST NOT define styles
- UI must only come from design-system
- new UI must be added to design-system first

---

## 2.4 Pattern Strategy (MANDATORY)

Define a set of reusable layout patterns (abstract, NOT product-specific):

Examples:
- AppLayout (navigation + content)
- SplitLayout (vertical/horizontal split)
- FormPattern
- TablePattern

Explain:
- why patterns are required
- how pages compose patterns

---

## 2.5 UI State Model (MANDATORY)

All UI must support:

- loading state
- empty state
- error state

Explain how states are standardized across components.

---

## 2.6 AI UI Generation Constraints (CRITICAL)

Define rules for AI-generated UI:

- MUST use design-system components
- MUST use patterns for layout
- MUST NOT generate custom styles
- MUST NOT invent layout structures

---

# 3. Backend Architecture

- API style (REST / GraphQL)
- service modules
- authentication strategy
- AI service integration

---

# 4. Data Storage Design

- database choice
- schema design (high level)
- chart data storage
- user data storage

---

# 5. API Design

- API style
- major endpoints
- request/response pattern

---

# 6. Data Flow

- user input → AI → chart generation → storage → UI rendering

---

# 7. AI Integration

- LLM usage
- prompt processing
- data extraction logic
- chart type decision logic

---

# 8. Scalability Strategy

- handling 10k users
- caching strategy
- async processing (if needed)

---

# 9. Dev & Governance (IMPORTANT)

## 9.1 Code Generation Rules
- all code must follow spec + rules

## 9.2 UI Governance
- enforced via cursor rules
- UI must pass UI review checks

## 9.3 Extensibility
- system must support adding new UI patterns without breaking existing ones
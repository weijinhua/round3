---
name: chart-generation
overview: "Implement the chart-generation workflow end to end: prompt input, chart preview, chart-type selection, and the supporting backend charts module."
todos:
  - id: task-1
    content: Lock down the dashboard feature slice
    status: completed
  - id: task-2
    content: Add the charts backend module
    status: completed
  - id: task-3
    content: Connect the dashboard to chart generation APIs
    status: completed
  - id: task-4
    content: Verify feature readiness
    status: completed
isProject: false
---

# Chart Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the chart-generation experience on the dashboard so an authenticated user can enter a data prompt, review a generated chart, and override the chart type.

**Architecture:** Reuse the existing dashboard slice in `apps/web/features/charts/` and keep the dashboard page as a thin composition layer in `apps/web/app/dashboard/page.tsx`. Add a NestJS `charts` module under `apps/api/src/charts/` for prompt interpretation and chart-result handling, and keep the web UI focused on user interactions and state rendering.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, `next-intl`, `StateShell` and other UI primitives from `@charts-gen/ui`, NestJS, TypeORM, `class-validator`, and `class-transformer`.

---

### Task 1: Lock down the dashboard feature slice

**Files:**
- Modify: [`apps/web/app/dashboard/page.tsx`](apps/web/app/dashboard/page.tsx)
- Modify: [`apps/web/features/charts/components/PromptBar.tsx`](apps/web/features/charts/components/PromptBar.tsx)
- Modify: [`apps/web/features/charts/components/ChartArea.tsx`](apps/web/features/charts/components/ChartArea.tsx)
- Modify: [`apps/web/locales/en.json`](apps/web/locales/en.json)
- Modify: [`apps/web/locales/zh-CN.json`](apps/web/locales/zh-CN.json)
- Test: add or update co-located component tests where needed

- [ ] **Step 1: Write the failing tests**
  - Cover prompt submission, empty/error states, and chart-type override.
  - Assert the dashboard page still composes `AppLayout`, `SplitLayout`, `ChartArea`, and `PromptBar`.

- [ ] **Step 2: Implement the minimal UI behavior**
  - Replace the placeholder `console.log` flow in `PromptBar` with real prompt submission state.
  - Render a generated chart preview in `ChartArea` and keep the empty state when no chart exists.
  - Keep the dashboard focused on prompt input and chart preview.
  - Add the required user-facing strings to both locale files.

- [ ] **Step 3: Run focused UI tests**
  - Verify the chart slice tests pass and that the dashboard page still renders the expected composition.

### Task 2: Add the charts backend module

**Files:**
- Create: [`apps/api/src/charts/charts.module.ts`](apps/api/src/charts/charts.module.ts)
- Create: [`apps/api/src/charts/charts.controller.ts`](apps/api/src/charts/charts.controller.ts)
- Create: [`apps/api/src/charts/charts.service.ts`](apps/api/src/charts/charts.service.ts)
- Create: [`apps/api/src/charts/dto/generate-chart.dto.ts`](apps/api/src/charts/dto/generate-chart.dto.ts)
- Create: [`apps/api/src/charts/dto/update-chart-type.dto.ts`](apps/api/src/charts/dto/update-chart-type.dto.ts)
- Create: [`apps/api/src/charts/entities/chart.entity.ts`](apps/api/src/charts/entities/chart.entity.ts)
- Modify: [`apps/api/src/app.module.ts`](apps/api/src/app.module.ts)
- Test: create co-located module/service/controller specs

- [ ] **Step 1: Write the failing tests**
  - Cover valid prompt generation, invalid prompt rejection, allowed chart-type overrides, and authenticated history/save behavior.
  - Include at least one success path and one failure path for the charts service and controller.

- [ ] **Step 2: Implement the module**
  - Register the `charts` module in the root app module.
  - Validate prompt input at the API boundary.
  - Return a chart result payload the web app can render.
  - Return a chart result payload the web app can render.

- [ ] **Step 3: Run API tests**
  - Verify the new module tests pass and the app module still compiles with the new registration.

### Task 3: Connect the dashboard to chart generation APIs

**Files:**
- Modify: [`apps/web/features/charts/components/PromptBar.tsx`](apps/web/features/charts/components/PromptBar.tsx)
- Modify: [`apps/web/features/charts/components/ChartArea.tsx`](apps/web/features/charts/components/ChartArea.tsx)
- Modify: [`apps/web/features/charts/components/DashboardSidebar.tsx`](apps/web/features/charts/components/DashboardSidebar.tsx)
- Create or modify: chart feature service/hooks under `apps/web/features/charts/services/` and `apps/web/features/charts/hooks/`

- [ ] **Step 1: Write the failing integration-style UI tests**
  - Verify the prompt flow calls the charts endpoint, shows generated data, updates chart type, and surfaces error/empty states.

- [ ] **Step 2: Implement the client flow**
  - Add a feature service for chart generation and chart-type updates.
  - Keep the UI responsive while awaiting results.
  - Use the returned chart result for preview, export, and history display.

- [ ] **Step 3: Run the dashboard flow tests**
  - Confirm the end-to-end feature slice behaves as expected with mocked API responses.

### Task 4: Verify feature readiness

**Files:**
- Create or modify: [`specs/002-chart-generation/quickstart.md`](specs/002-chart-generation/quickstart.md)
- Create or modify: [`specs/002-chart-generation/research.md`](specs/002-chart-generation/research.md)
- Create or modify: [`specs/002-chart-generation/data-model.md`](specs/002-chart-generation/data-model.md)

- [ ] **Step 1: Document the model and flow**
  - Capture the chart prompt, generated chart, chart type, export artifact, and saved history relationships.

- [ ] **Step 2: Add a short quickstart**
  - Show how to exercise the dashboard flow locally and confirm the generated chart, export, and history behaviors.

- [ ] **Step 3: Run the final verification pass**
  - Re-check the spec, plan, and tests for coverage gaps before moving to task breakdown or implementation.

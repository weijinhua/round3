# Tasks: Chart Generation

**Input**: Design documents from `specs/features/002-chart-generation/`
**Prerequisites**: `plan.md` and `spec.md`

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 [P] Seed shared chart test fixtures and mock prompt payloads in `apps/web/features/charts/test-utils.ts` and `apps/api/src/charts/test-utils.ts`
- [ ] T002 [P] Align chart-facing locale keys for prompt, preview, error, and retry copy in `apps/web/locales/en.json` and `apps/web/locales/zh-CN.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T003 [P] Define and validate the chart request DTOs and result shapes in `apps/api/src/charts/dto/generate-chart.dto.ts`, `apps/api/src/charts/dto/update-chart-type.dto.ts`, and `apps/api/src/charts/entities/chart.entity.ts`
- [ ] T004 [P] Register the charts module boundary in `apps/api/src/charts/charts.module.ts` and `apps/api/src/app.module.ts`
- [ ] T005 [P] Add baseline service/controller coverage for chart generation success and failure paths in `apps/api/src/charts/charts.service.spec.ts` and `apps/api/src/charts/charts.controller.spec.ts`

**Checkpoint**: the shared chart contract and API boundary are ready for feature work.

---

## Phase 3: User Story 1 - Generate a chart from a prompt (Priority: P1) 🎯 MVP

**Goal**: Turn a natural-language prompt into a readable chart preview that reflects the extracted labels and values.

**Independent Test**: Enter a prompt with clear labels and numbers and verify that a chart preview appears with the expected data represented.

- [ ] T006 [P] [US1] Add failing UI tests for prompt submission, generated preview, and empty/error states in `apps/web/features/charts/components/PromptBar.spec.tsx`, `apps/web/features/charts/components/ChartArea.spec.tsx`, and `apps/web/features/charts/components/ChartDashboard.spec.tsx`
- [ ] T007 [US1] Implement prompt submission state and generated preview rendering in `apps/web/features/charts/components/PromptBar.tsx`, `apps/web/features/charts/components/ChartArea.tsx`, and `apps/web/features/charts/components/ChartDashboard.tsx`
- [ ] T008 [P] [US1] Add prompt parsing and preview generation coverage in `apps/web/features/charts/services/chart-generator.spec.ts` and `apps/web/features/charts/services/chart-generator.ts`

**Checkpoint**: the MVP chart preview flow works end to end.

---

## Phase 4: User Story 2 - Choose or override the chart type (Priority: P2)

**Goal**: Let the user accept a suggested chart type or switch to another chart type before viewing the final chart.

**Independent Test**: Generate a chart from the same prompt using two different chart types and verify that the displayed result changes accordingly.

- [ ] T009 [P] [US2] Add failing tests for suggested-versus-selected chart type behavior in `apps/web/features/charts/components/PromptBar.spec.tsx`, `apps/web/features/charts/components/ChartArea.spec.tsx`, and `apps/web/features/charts/services/chart-generator.spec.ts`
- [ ] T010 [US2] Preserve the underlying chart data when chart type changes in `apps/web/features/charts/services/chart-generator.ts`, `apps/web/features/charts/types.ts`, and `apps/web/features/charts/components/PromptBar.tsx`
- [ ] T011 [US2] Update the preview copy and visual state for alternate chart types in `apps/web/features/charts/components/ChartArea.tsx`

**Checkpoint**: chart type selection changes presentation without changing the extracted data.

---

## Phase 5: User Story 3 - Recover from unclear prompts (Priority: P3)

**Goal**: Show clear feedback when the prompt does not contain enough usable data and let the user revise it without losing their place.

**Independent Test**: Submit a prompt without enough usable chart information and verify that the system explains what is missing and allows a corrected prompt.

- [ ] T012 [P] [US3] Add failing tests for unclear-prompt recovery and retry behavior in `apps/web/features/charts/components/PromptBar.spec.tsx` and `apps/web/features/charts/services/chart-generator.spec.ts`
- [ ] T013 [US3] Implement missing-data detection and user-friendly recovery messaging in `apps/web/features/charts/services/chart-generator.ts` and `apps/web/features/charts/components/PromptBar.tsx`
- [ ] T014 [US3] Keep the prompt draft in place after validation failure so the user can retry without restarting in `apps/web/features/charts/components/ChartDashboard.tsx`

**Checkpoint**: incomplete prompts can be corrected without resetting the flow.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T015 [P] Re-run and stabilize the chart slice regression coverage in `apps/web/features/charts/services/chart-generator.spec.ts`, `apps/web/features/charts/services/charts-api.spec.ts`, `apps/api/src/charts/charts.service.spec.ts`, and `apps/api/src/charts/charts.controller.spec.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
  - US1 is the MVP and should ship first.
  - US2 and US3 can start after the shared contract is in place, but delivery should follow P1 → P2 → P3.
- **Polish (Final Phase)**: Depends on the chosen user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories; starts after Foundational.
- **User Story 2 (P2)**: No dependency on other stories; starts after Foundational and reuses the same chart preview contract.
- **User Story 3 (P3)**: No dependency on other stories; starts after Foundational and reuses the same prompt-handling flow.

### Parallel Opportunities

- Setup tasks `T001` and `T002` can run in parallel.
- Foundational tasks `T003`, `T004`, and `T005` can run in parallel.
- In US1, `T006` and `T008` can run in parallel once the task scope is clear.
- In US2, `T009` can be prepared alongside `T010` and `T011` because the tests and implementation touch different files.
- In US3, `T012` can be prepared alongside `T013` and `T014` because the tests and implementation touch different files.

---

## Parallel Example: User Story 1

- `T006` Add failing UI tests in `PromptBar.spec.tsx`, `ChartArea.spec.tsx`, and `ChartDashboard.spec.tsx`
- `T008` Add prompt parsing and preview generation coverage in `chart-generator.spec.ts`

---

## Implementation Strategy

### MVP First

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate the chart preview independently before moving on.

### Incremental Delivery

1. Ship the prompt-to-preview flow from US1 first.
2. Add chart type override behavior from US2 without changing the underlying chart data.
3. Add unclear-prompt recovery from US3 last.
4. Finish with the regression pass in Phase 6.


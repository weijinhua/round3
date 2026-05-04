# Implementation Plan: UI Foundation

Feature Branch: [000-ui-foundation]
Plan Path: F:/sdd/tutorial/round3/specs/features/000-ui-foundation/plan.md

## Technical Context
- Purpose: Provide canonical design tokens, core components, and layout patterns for web (desktop).
- Stack constraints: Next.js 14 (App Router), React 18, TypeScript strict, Tailwind v3 inside design-system, CVA, next-intl.
- Outputs required: tokens (design-tokens.json + CSS vars + JS/TS exports), component catalogue, patterns with slot guidance, light/dark themes, CI accessibility checks.
- Known decisions:
  - Token publication: Option A — canonical JSON source + generated CSS vars, JS/TS exports, and an NPM package.
  - Accessibility validation: Option A — automated axe checks in CI (gating) + periodic manual audits.
- Unknowns / NEEDS CLARIFICATION:
  - Exact NPM package name and versioning policy for tokens (research task).
  - CI integration details for axe (runner, thresholds, baselines) (research task).

## Constitution Check (summary)
- Frontend layering & UI boundary: MUST implement inside `packages/design-system` and export through `packages/ui` (`@charts-gen/ui`) — OK / compliant.
- Design-system layering: tokens -> components -> patterns enforced — OK.
- Tests & quality gates: components require co-located tests and CI gates (axe) — OK but requires CI config work (action item).

## Gates
- No gate violations identified that block Phase 0. Any breaking governance must be raised before Phase 1.

## Phase 0 — Outline & Research (tasks)
1. Research "tokens packaging & publishing" — outputs: package name convention, build script, publishing workflow, versioning strategy.
2. Research "axe CI integration" — outputs: recommended GitHub Action, threshold config, failure policy, example jobs.
3. Research "token exports (CSS vars, JS/TS)" — outputs: toolchain (style-dictionary / custom), examples, build steps.

Deliverable: research.md (resolve all NEEDS CLARIFICATION)

## Phase 1 — Design & Contracts
Artifacts to produce:
- data-model.md — Not applicable (UI-only); include rationale.
- contracts/ — UI contract documents (component API contracts, prop schemas for public components).
- quickstart.md — How feature teams consume tokens, install package, import components via `@charts-gen/ui`.
- component-catalogue.md — list of components, acceptance criteria, accessibility checklist.
- patterns/ — page shell, split layout, card list pattern with slot examples.
- tests: co-located Component.test.tsx for each new component and example accessibility tests.

Phase 1 Agent Context Update:
- Run agent context update script after research docs are final (automation step).

## Phase 2 — Implementation (high level)
- Implement tokens package, build outputs, and publish workflow.
- Implement core components with CVA variants, tests, and docs.
- Implement layout patterns and example pages.
- Add CI jobs for accessibility and component build/test.

## Outputs created by this plan
- F:/sdd/tutorial/round3/specs/features/000-ui-foundation/research.md (to generate)
- F:/sdd/tutorial/round3/specs/features/000-ui-foundation/component-catalogue.md (to generate)
- F:/sdd/tutorial/round3/specs/features/000-ui-foundation/quickstart.md (to generate)
- F:/sdd/tutorial/round3/specs/features/000-ui-foundation/contracts/ (to generate)

Prepared-by: speckit.plan


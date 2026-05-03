# Feature: 000-ui-foundation

## 0. Version
See `version.md` in this folder.

## 1. Scope
- Provide design-system baseline: tokens, core components, patterns, StateShell, and i18n wiring.
- Export public API `@charts-gen/ui` for use by pages and features.

## 2. Out of Scope
- Any feature-level pages or business logic (charts generation, auth, export).

## 3. Interfaces
- Design-system public API surface (TS barrel) described in `components.md` and `layout.md`.
- i18n: provide locale loader utilities and example `zh-CN` translations.

## 4. Data Model
- No persistent data. Token files and component props typed in TypeScript.

## 5. Dependencies
- None (foundational).

## 6. Acceptance Criteria
- tokens.md, components.md, layout.md, design-system.md exist under `specs/ui/`.
- `packages/design-system/` scaffold (placeholder) created in repo (implementation task).
- Components compile and export types.
- All components support `StateProps` model.

## 7. UI Specification
- Use components: Button, Input, Card, Modal, StateShell, AppLayout, SplitLayout, ChatInputPattern, CardListPattern, FormPattern, EmptyPattern.
- All strings must be i18n keys; no hardcoded UI text.
- Follow tokens in `specs/ui/tokens.md`.


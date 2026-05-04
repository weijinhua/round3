# Component Catalogue — Pages

For each component in `packages/design-system/src/components`, add a documentation page with:
- Purpose and accessibility notes
- Props and variants
- Usage examples (code + rendered)
- Acceptance criteria and tests

Example:

```md
## Button

- Purpose: Primary action button with focus/keyboard support.
- Props: `variant`, native button attributes.
- Example:

```tsx
<Button variant="primary">Save</Button>
```

Acceptance: Examples must pass automated axe checks in CI.
```


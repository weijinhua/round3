# Tokens — Usage Examples

This page demonstrates how to consume `design-tokens.json` and the generated outputs.

## Using CSS variables (generated)

1. Build tokens:

```
pnpm --filter @charts-gen/design-system run build:tokens
```

2. Include the generated CSS (`packages/design-system/dist/tokens.css`) in your app global CSS.

3. Example:

```html
<style>
  @import "packages/design-system/dist/tokens.css";
  .card { background: var(--color-surface); padding: var(--spacing-scale-4); border-radius: var(--radius-md); }
</style>
<div class="card">Token styled card</div>
```

## Using TypeScript exports (generated)

Import tokens from the generated TS module:

```ts
import { tokens } from '@charts-gen/design-system/dist/tokens';
console.log(tokens.color.primary);
```

## Guidance
- Prefer semantic token names from `specs/ui/tokens.md` where possible.  
- Provide fallbacks in components when a token is not present.


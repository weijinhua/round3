Test harness and example tests

1. Unit test approach
 - Use Vitest or Jest in workspace; keep tests lightweight and deterministic.
 - Example test file: `packages/design-system/src/__tests__/Button.test.tsx`

2. Accessibility checks
 - Use `axe-core` and `@testing-library/react` in unit tests to assert basic rules.
 - Example snippet:

```js
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Button } from '../components';

test('button is accessible', async () => {
  const { container } = render(<Button>Ok</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

3. Developer trial
 - Create `examples/developer-trial` that composes `PageShell`, `CardList`, and core components into a simple dashboard.
 - Provide a small README with steps to run the example locally.


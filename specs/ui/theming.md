# Theming — Light & Dark

Baseline themes are implemented by switching CSS classes and are driven by tokens.

Usage:

1. Include generated tokens: `@import "@charts-gen/design-system/dist/tokens.css";`
2. Include the theme: `@import "@charts-gen/design-system/theme/light.css";` or dark.css
3. Toggle root class on <body> with `theme-light` or `theme-dark`.

Notes:
- Keep theme changes token-driven; avoid hardcoded color usage in components.
- Document token differences in `specs/ui/tokens.md` for maintainers.


Release checklist — Design System v1

1. Ensure `pnpm --filter @charts-gen/design-system run build:tokens` completes and `dist/` contains `tokens.css` and `tokens.ts`.
2. Build and verify example developer trial in `examples/developer-trial/`.
3. Verify component documentation pages under `specs/ui/` are present for each exported component.
4. Update package.json version and publish process (internal registry) as required by org policy.
5. Run CI and ensure accessibility workflow passes.


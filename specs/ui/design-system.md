# Design System

Style: Modern, clean, enterprise-friendly.

Principles:
- Consistency: use tokens for color, spacing, typography.
- Accessibility: follow WCAG AA for color contrast and keyboard navigation.
- Composability: small primitives (Button, Input, Card) composed into patterns.
- Theming: support light/dark via tokens.

Tooling:
- TailwindCSS v3 + shadcn/ui primitives.
- Use CVA + `cn()` helper inside design-system only.

# Design System — Charts Generator

## Purpose
提供统一的视觉与交互基线，确保产品一致性、可组合性和可复用性。所有应用代码必须通过 `@charts-gen/ui` 引入设计系统组件与模式。

## Style Principles
- Modern, clean, enterprise-friendly
- Accessible by default (ARIA, keyboard focus, color contrast)
- Token-driven: 不允许页面或 feature 直接使用硬编码颜色/间距/字体

## Technology
- Tailwind/CSS-in-JS allowed only inside `packages/design-system/`
- React 18 + TypeScript
- Expose components and patterns via `packages/design-system/index.ts` → alias `@charts-gen/ui`

## Design Governance
- 新组件/模式必须添加到 design-system，并通过审查后才可被 feature 使用
- 破坏性变更须走 MAJOR 版本

## State Model
使用统一的 `StateProps`：`{ loading?: boolean; empty?: boolean; error?: string | null }`。组件应支持 skeleton/empty/error 渲染。

## References
- tokens: `specs/ui/tokens.md`
- components catalogue: `specs/ui/components.md`
- layout & patterns: `specs/ui/layout.md`


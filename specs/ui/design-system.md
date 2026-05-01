# Design System

## Version
引用 specs/ui/version.md — Current: 1.0.0

## Style
- 风格：现代简洁（Modern Minimal）
- 定位：数据可视化工具，专业、克制
- 色调：深色主题优先，支持浅色切换

## Design Principles
1. **数据优先** — UI 服务于数据可视化，不与内容争夺注意力
2. **一致性** — 所有组件来自同一 token 体系，禁止一次性样式
3. **可访问性** — WCAG AA 对比度，键盘可导航
4. **i18n 优先** — 所有文案走 `next-intl`，禁止硬编码
5. **状态完整** — 每个交互组件必须覆盖 loading / empty / error 状态

## Technology Constraints
- Tailwind CSS v3（utility-first）
- shadcn/ui 组件库（Radix UI 底层）
- CVA（class-variance-authority）管理变体
- `cn()` 合并类名
- 包位置：`packages/ui`（`@charts-gen/ui`）

## Icon System
- 使用 `lucide-react`，统一大小规格：16 / 20 / 24px

## Motion
- 微动效：Tailwind `transition` 工具类
- 复杂动画：`framer-motion`（按需引入）

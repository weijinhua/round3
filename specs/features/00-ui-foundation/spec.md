# Feature: UI Foundation

## 0. Version
引用 specs/features/00-ui-foundation/version.md — Current: 1.0.0

## 1. Scope
- 在 `packages/ui`（`@charts-gen/ui`）中实现设计 token、基础组件、布局模式
- 配置 Tailwind CSS v3、shadcn/ui、CVA、`cn()` 工具
- 搭建 `next-intl` i18n 基础结构（消息加载、locale 路由）
- 默认语言：`zh-CN`，支持扩展至多语言

## 2. Out of Scope
- 产品业务逻辑（认证、图表生成等）
- 具体页面实现
- 后端 API

## 3. Interfaces

### 导出 API（`@charts-gen/ui`）
```ts
// 布局
export { AppLayout, SidebarLayout, WorkspaceLayout, AuthLayout }

// 基础组件
export { Button, Input, Textarea, Card, CardHeader, CardContent, CardFooter }
export { Modal, Dialog, DialogHeader, DialogBody, DialogFooter }
export { Sidebar, SidebarHeader, SidebarList, SidebarItem }
export { EmptyState, LoadingSpinner, Skeleton }
export { Toast, Badge, Avatar, Tooltip }

// 图表渲染
export { ChartRenderer }
export type { ChartData, ChartType }

// 工具
export { cn }
```

### i18n 接口
```ts
// apps/web/messages/zh-CN.json  ← 消息文件根
// 通过 next-intl useTranslations() 访问
// 禁止硬编码任何 UI 文字
```

## 4. Data Model

### ChartData（前端数据结构）
```ts
interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter'
  title?: string
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    color?: string
  }>
}
```

## 5. Dependencies
- 无产品 Feature 依赖
- 外部依赖：
  - `tailwindcss@^3`
  - `shadcn/ui`（Radix UI 底层）
  - `class-variance-authority`
  - `clsx` + `tailwind-merge`（`cn()`）
  - `next-intl@^3`
  - `recharts@^2`
  - `lucide-react`

## 6. Acceptance Criteria
- [ ] `@charts-gen/ui` 可被 `apps/web` 和 `apps/api`（类型）正确导入
- [ ] Button、Input、Textarea、Card、Modal 组件通过 Storybook 或单元测试验证所有状态
- [ ] AppLayout / SidebarLayout / WorkspaceLayout / AuthLayout 渲染正确
- [ ] `zh-CN` 消息文件加载，`useTranslations()` 返回正确文案
- [ ] ChartRenderer 可渲染 bar / line / pie / area 类型图表
- [ ] EmptyState / LoadingSpinner / Skeleton 在各使用场景中正确显示
- [ ] 所有组件通过 TypeScript 类型检查（`tsc --noEmit`）

## 7. UI Specification
- 引用 specs/ui/design-system.md
- 引用 specs/ui/tokens.md
- 引用 specs/ui/components.md
- 引用 specs/ui/layout.md

### 使用组件
本 feature 是所有组件的**定义来源**，不消费其他 feature 的 UI。

### 约束
- 禁止在 feature 层自定义样式，所有样式通过 token 实现
- 组件变体通过 CVA 定义，不允许内联 Tailwind 特殊逻辑
- 颜色仅使用 tokens.md 中定义的语义 token

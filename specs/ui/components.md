# UI Components

## Version
引用 specs/ui/version.md — Current: 1.0.0

## 规范
- 所有组件来自 `@charts-gen/ui`（`packages/ui`）
- 使用 shadcn/ui 作为底层，CVA 管理变体
- 所有组件必须覆盖：default / hover / focus / disabled / loading / error 状态
- 禁止在 feature 层自定义 UI，只允许组合使用

---

## Button

| Variant | Usage |
|---------|-------|
| `primary` | 主操作（发送、保存、导出） |
| `secondary` | 次要操作（取消、返回） |
| `ghost` | 轻量操作（侧边栏条目、图标按钮） |
| `destructive` | 破坏性操作（删除） |

| Size | Usage |
|------|-------|
| `sm` | 紧凑区域 |
| `md` | 默认 |
| `lg` | 主 CTA |
| `icon` | 纯图标按钮 |

```tsx
<Button variant="primary" size="md" loading={isLoading}>
  发送
</Button>
```

---

## Input / Textarea

- `Input`：单行文本输入，支持 prefix/suffix 插槽
- `Textarea`：多行文本输入，支持 `autoResize`
- 状态：default / focus / error / disabled

```tsx
<Textarea
  placeholder="输入提示词..."
  autoResize
  error={error?.message}
/>
```

---

## Card

- `Card`：通用容器，含 `CardHeader`、`CardContent`、`CardFooter`
- 用于图表展示区域、历史列表条目

```tsx
<Card>
  <CardContent>...</CardContent>
</Card>
```

---

## Modal / Dialog

- 基于 Radix UI `Dialog`
- 包含：`DialogHeader`、`DialogBody`、`DialogFooter`
- 用于：确认操作、保存图表命名

---

## Sidebar

- 固定宽度：`240px`（可折叠至 `48px`）
- 包含：`SidebarHeader`、`SidebarList`、`SidebarItem`
- `SidebarItem` 支持 active / hover 状态

---

## EmptyState

- 用于历史列表为空、图表区域未生成时
- 包含：图标、标题、描述、可选 CTA

```tsx
<EmptyState
  icon={<BarChart2 />}
  title="暂无图表"
  description="输入提示词生成您的第一张图表"
/>
```

---

## LoadingSpinner / Skeleton

- `LoadingSpinner`：全屏或区域加载指示
- `Skeleton`：内容占位骨架屏（图表区域、列表条目）

---

## Toast / Notification

- 基于 Radix UI `Toast`
- 变体：`success` / `error` / `info`
- 位置：右下角

---

## Badge

- 用于图表类型标签（bar / line / pie 等）
- 变体：`default` / `outline`

---

## Avatar

- 用于用户头像（导航栏用户区域）
- 支持 fallback（首字母）

---

## Tooltip

- 基于 Radix UI `Tooltip`
- 用于图标按钮提示、侧边栏折叠态

---

## ChartRenderer（专用组件）

- 封装图表渲染逻辑，接受标准化 `ChartData` prop
- 支持类型：`bar` / `line` / `pie` / `area` / `scatter`
- 底层：`recharts`
- 状态：loading / error / empty

```tsx
<ChartRenderer
  type="bar"
  data={chartData}
  loading={isGenerating}
/>
```

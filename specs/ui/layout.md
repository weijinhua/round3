# Layout System

## Version
引用 specs/ui/version.md — Current: 1.0.0

## 页面结构

```
┌─────────────────────────────────────────────┐
│                  AppHeader                  │  h-14, z-header
├──────────────┬──────────────────────────────┤
│              │                              │
│   Sidebar    │       MainContent            │
│   w-60       │       flex-1                 │
│              │  ┌──────────────────────┐    │
│  历史图表列表  │  │   ChartDisplay       │    │
│              │  │   flex-1             │    │
│              │  └──────────────────────┘    │
│              │  ┌──────────────────────┐    │
│              │  │   PromptInput        │    │
│              │  │   h-auto (min 80px)  │    │
│              │  └──────────────────────┘    │
└──────────────┴──────────────────────────────┘
```

## Layout Patterns（来自 `@charts-gen/ui`）

### AppLayout
- 根布局，包含 Header + 主体区域
- 使用：所有需要登录的页面

```tsx
<AppLayout>
  <SidebarLayout sidebar={<ChartSidebar />}>
    {children}
  </SidebarLayout>
</AppLayout>
```

### SidebarLayout
- 左固定侧边栏 + 右侧弹性内容区
- 侧边栏宽度：`240px`，可折叠
- 内容区：`flex-1 overflow-hidden`

### WorkspaceLayout
- 内容区内部垂直分割：上部图表展示区 + 下部输入区
- 图表区：`flex-1 overflow-auto`
- 输入区：`shrink-0`，最小高度 `80px`，最大 `200px`

### AuthLayout
- 居中卡片，不含侧边栏
- 最大宽度：`400px`

## 栅格系统
- 基于 Tailwind CSS Flexbox / Grid
- 断点：`sm(640)` / `md(768)` / `lg(1024)` / `xl(1280)`
- 移动端：侧边栏默认折叠，通过抽屉展开

## 响应式策略
| 断点 | 侧边栏 | 布局 |
|------|--------|------|
| `< md` | 隐藏（抽屉） | 单列 |
| `>= md` | 折叠态（icon） | 双列 |
| `>= lg` | 展开态（完整） | 双列 |

## Header 内容
- 左：Logo + 产品名"Charts Generator"
- 右：用户头像 + 下拉菜单（设置、登出）
- 高度：`56px`（`h-14`）

## 禁止
- 禁止 feature 层定义新的布局容器
- 禁止在页面层使用 `fixed` 定位（除 Header/Sidebar）
- 禁止 pattern 层导入 page 层代码

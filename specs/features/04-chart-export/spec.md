# Feature: Chart Export

## 0. Version
引用 specs/features/04-chart-export/version.md — Current: 1.0.0

## 1. Scope
- 将当前图表区域渲染为 PNG 或 SVG 文件并触发下载
- 导出操作纯客户端执行，无需后端 API
- 支持格式：PNG（默认）、SVG
- 导出文件名：`{chart-title}-{timestamp}.png`

## 2. Out of Scope
- 服务端渲染导出（后续迭代）
- PDF 导出
- 批量导出
- 自定义导出尺寸/分辨率（后续迭代）
- 导出历史图表（需先加载至当前视图）

## 3. Interfaces

### Frontend Only（无后端 API）

#### useChartExport() hook
```ts
interface UseChartExport {
  exportPng: (title?: string) => Promise<void>
  exportSvg: (title?: string) => Promise<void>
  isExporting: boolean
  error: string | null
}
```

#### 实现方式
```ts
// PNG：使用 html-to-image 库将图表 DOM 节点转为 PNG dataURL，触发 <a> 下载
// SVG：从 recharts 渲染的 <svg> 节点序列化为 SVG 文件，触发下载

import { toPng, toSvg } from 'html-to-image'

async function exportPng(chartRef: RefObject<HTMLElement>, title: string) {
  const dataUrl = await toPng(chartRef.current, { pixelRatio: 2 })
  triggerDownload(dataUrl, `${title}-${Date.now()}.png`)
}
```

#### ExportButton 组件
```tsx
<ExportButton
  chartRef={chartContainerRef}
  title={currentChart?.title}
  disabled={!hasChart}
/>
```
- 包含下拉菜单：PNG / SVG 两个选项
- 位置：图表区域右上角工具栏

## 4. Data Model

- 无新增数据模型
- 读取当前内存中的 `ChartData`（来自 02-ai-chart-generation 或 03-chart-history 加载）

## 5. Dependencies
- **Feature**: 00-ui-foundation（Button、Tooltip、Toast）
- **Feature**: 02-ai-chart-generation（当前图表 DOM ref + ChartData）
- **External library**: `html-to-image`（客户端 DOM 转图片）

## 6. Acceptance Criteria
- [ ] 当图表区域有内容时，"导出"按钮可用
- [ ] 点击"导出 PNG"，浏览器下载 `{title}-{timestamp}.png`，像素比 2x（清晰）
- [ ] 点击"导出 SVG"，浏览器下载 `{title}-{timestamp}.svg`
- [ ] 导出中：按钮显示 loading 态，禁止重复点击
- [ ] 无图表时：导出按钮 disabled 并有 Tooltip 提示
- [ ] 导出失败（如 DOM 捕获异常）：Toast[error] 提示
- [ ] 导出不依赖任何后端 API
- [ ] 导出文件包含完整图表（含标题、坐标轴、图例）

## 7. UI Specification
- 引用 specs/ui/design-system.md
- 引用 specs/ui/tokens.md
- 引用 specs/ui/components.md（Button、Tooltip、Toast）
- 引用 specs/ui/layout.md（导出按钮位于图表区工具栏，不独占布局）

### 使用组件
| 组件 | 用途 |
|------|------|
| `Button[ghost][icon]` | 导出触发按钮（含下拉） |
| `Tooltip` | 无图表时 disabled 原因提示 |
| `Toast[success]` | 导出成功提示 |
| `Toast[error]` | 导出失败提示 |
| `LoadingSpinner` | 导出中按钮内 loading 图标 |

### 状态覆盖
- disabled：无当前图表，Tooltip 提示"请先生成图表"
- loading：导出进行中，按钮禁用 + spinner
- success：Toast "导出成功"（可选，避免打扰）
- error：Toast[error] "导出失败，请重试"

### 约束
- 导出按钮不独占行，嵌入图表区工具栏
- 所有文案通过 `useTranslations('export')` 获取
- 导出逻辑封装在 `useChartExport` hook 中，不散落在组件内

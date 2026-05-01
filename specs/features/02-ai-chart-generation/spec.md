# Feature: AI Chart Generation

## 0. Version
引用 specs/features/02-ai-chart-generation/version.md — Current: 1.0.0

## 1. Scope
- 用户在输入框输入自然语言提示词
- 后端 `ai` 模块调用 LLM（服务端，禁止前端直接调用）
- LLM 从提示词中提取结构化数据和最优图表类型
- 如用户在提示词中指定图表类型，则强制使用该类型
- 前端 `ChartRenderer` 渲染返回的图表数据
- 渲染结果展示在主内容区上半部分

## 2. Out of Scope
- 图表保存（属于 03-chart-history）
- 图表导出（属于 04-chart-export）
- 图表编辑/修改（后续迭代）
- 多轮对话上下文（后续迭代）
- 流式响应（后续迭代）

## 3. Interfaces

### REST API（NestJS `ai` 模块）

#### POST /api/ai/generate
```ts
// Authorization: Bearer <accessToken>  （需登录）

// Request Body
class GenerateChartDto {
  @IsString() @MaxLength(2000) prompt: string
}

// Response 200
interface GenerateChartResponse {
  requestId: string
  chartData: ChartData      // 见 Data Model
  rawExtraction: {          // LLM 提取的原始结构，供调试
    title: string
    chartType: ChartType
    datasets: Array<{ label: string; data: number[] }>
    labels: string[]
  }
}

// Errors
// 400 Bad Request: prompt 为空或超长
// 401 Unauthorized: 未登录
// 422 Unprocessable: LLM 无法从提示词提取有效数据
// 429 Too Many Requests: 速率限制
// 500 Internal: LLM 调用失败
```

### LLM Prompt Contract（服务端内部）
```
System: 你是一个数据提取和图表选择专家。从用户输入中提取数据，输出严格的 JSON。
        支持的图表类型：bar | line | pie | area | scatter
        规则：
        1. 如用户指定图表类型，严格使用该类型
        2. 否则根据数据特征选择最优类型（时间序列→line/area，分类对比→bar，占比→pie）
        3. 输出 JSON，不包含任何额外说明

Output Schema:
{
  "title": string,
  "chartType": "bar" | "line" | "pie" | "area" | "scatter",
  "labels": string[],
  "datasets": [{ "label": string, "data": number[] }]
}
```

### Frontend
- `PromptInput` 组件：多行输入框 + 发送按钮
- `ChartDisplay` 区域：包裹 `ChartRenderer`，处理 loading/error/empty 状态
- `useChartGeneration()` hook：
  ```ts
  interface UseChartGeneration {
    generate: (prompt: string) => Promise<void>
    chartData: ChartData | null
    isGenerating: boolean
    error: string | null
    reset: () => void
  }
  ```

## 4. Data Model

### ChartData（前端 + API 共享类型，来自 `@charts-gen/ui`）
```ts
type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'scatter'

interface ChartData {
  type: ChartType
  title?: string
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    color?: string  // 若为空，使用 tokens.md 中的 Chart Palette 顺序分配
  }>
}
```

### GenerationSession（Redis，短期缓存）
```
Key:   gen-session:{userId}:{requestId}
Value: { prompt, chartData, createdAt }
TTL:   1 hour
```

## 5. Dependencies
- **Feature**: 00-ui-foundation（ChartRenderer、WorkspaceLayout、Textarea、Button、EmptyState、LoadingSpinner）
- **Feature**: 01-auth（JWT 守卫保护 `/api/ai/generate`）
- **Infrastructure**:
  - LLM Provider（OpenAI / 兼容 API）— 仅服务端访问，密钥存 `.env`
  - Redis：generation session 缓存
  - `@nestjs/throttler`：速率限制（10 req/min/user）

## 6. Acceptance Criteria
- [ ] 用户输入提示词（含数字数据）后，API 返回结构化 `ChartData`
- [ ] 前端正确渲染 bar / line / pie / area 四种基本图表类型
- [ ] 用户在提示词中指定"折线图"/"柱状图"等，系统使用对应类型
- [ ] 生成中：输入框和发送按钮禁用，图表区显示 Skeleton
- [ ] LLM 无法提取数据时：显示友好错误信息，不崩溃
- [ ] API 速率限制：超过 10 req/min 返回 429
- [ ] LLM 密钥不暴露在前端 bundle 或网络请求中
- [ ] 所有 API 调用通过 TypeScript 类型检查

## 7. UI Specification
- 引用 specs/ui/design-system.md
- 引用 specs/ui/tokens.md
- 引用 specs/ui/components.md（ChartRenderer、Textarea、Button、EmptyState、Skeleton）
- 引用 specs/ui/layout.md（WorkspaceLayout：上部图表区 + 下部输入区）

### 使用组件
| 组件 | 用途 |
|------|------|
| `WorkspaceLayout` | 主内容区布局容器 |
| `Textarea[autoResize]` | 提示词输入框 |
| `Button[primary][icon]` | 发送按钮 |
| `ChartRenderer` | 图表渲染 |
| `Skeleton` | 生成中占位 |
| `EmptyState` | 首次进入无图表时 |
| `Toast[error]` | 生成失败提示 |

### 状态覆盖
- empty：`EmptyState`（"输入提示词生成图表"）
- loading：输入区禁用 + 图表区 `Skeleton`
- success：渲染图表，输入框恢复可用
- error：`Toast[error]` + 图表区保持上次内容（若有）

### 约束
- 禁止前端直接调用 LLM Provider
- 所有文案通过 `useTranslations('chart')` 获取
- 图表颜色使用 `tokens.md` 中的 Chart Palette

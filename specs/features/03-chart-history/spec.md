# Feature: Chart History

## 0. Version
引用 specs/features/03-chart-history/version.md — Current: 1.0.0

## 1. Scope
- 用户可将当前生成的图表保存到历史记录（命名后存入 PostgreSQL）
- 左侧侧边栏展示当前用户的历史图表列表（按时间倒序）
- 点击侧边栏条目，在右侧图表区加载对应图表
- 删除历史图表

## 2. Out of Scope
- 图表编辑/更新（后续迭代）
- 图表分类/标签（后续迭代）
- 图表分享（后续迭代）
- 跨用户查看他人图表

## 3. Interfaces

### REST API（NestJS `charts` 模块）

#### GET /api/charts
```ts
// Authorization: Bearer <accessToken>
// Query: ?page=1&limit=20

// Response 200
interface ChartListResponse {
  items: ChartSummary[]
  total: number
  page: number
  limit: number
}

interface ChartSummary {
  id: string
  title: string
  chartType: ChartType
  createdAt: string  // ISO 8601
}
```

#### GET /api/charts/:id
```ts
// Authorization: Bearer <accessToken>
// Response 200
interface ChartDetailResponse {
  id: string
  title: string
  prompt: string
  chartData: ChartData
  createdAt: string
  updatedAt: string
}
// 403 Forbidden: 不属于当前用户
// 404 Not Found
```

#### POST /api/charts
```ts
// Authorization: Bearer <accessToken>

// Request Body
class SaveChartDto {
  @IsString() @MinLength(1) @MaxLength(100) title: string
  @IsString() @MaxLength(2000) prompt: string
  @IsObject() chartData: ChartData
}

// Response 201
{ id: string, title: string, createdAt: string }

// Errors
// 400 Bad Request: 验证失败
// 401 Unauthorized
```

#### DELETE /api/charts/:id
```ts
// Authorization: Bearer <accessToken>
// Response 204 No Content
// 403 Forbidden: 不属于当前用户
// 404 Not Found
```

### Frontend
- `ChartSidebar` 组件：渲染 `SidebarList`，每条用 `SidebarItem`
- `useSaveChart()` hook：
  ```ts
  interface UseSaveChart {
    save: (title: string, prompt: string, chartData: ChartData) => Promise<void>
    isSaving: boolean
    error: string | null
  }
  ```
- `useChartHistory()` hook：
  ```ts
  interface UseChartHistory {
    charts: ChartSummary[]
    isLoading: boolean
    loadChart: (id: string) => Promise<ChartData>
    deleteChart: (id: string) => Promise<void>
    refresh: () => void
  }
  ```
- 保存时弹出 `Dialog`（输入图表名称）

## 4. Data Model

### Chart Entity（PostgreSQL）
```ts
@Entity('charts')
class Chart {
  @PrimaryGeneratedColumn('uuid') id: string
  @ManyToOne(() => User) @JoinColumn() user: User
  @Column() userId: string
  @Column() title: string
  @Column({ type: 'text' }) prompt: string
  @Column({ type: 'jsonb' }) chartData: ChartData  // JSONB 存储
  @CreateDateColumn() createdAt: Date
  @UpdateDateColumn() updatedAt: Date
  @Index(['userId', 'createdAt']) // 用于列表查询排序
}
```

### 侧边栏缓存（Redis，可选优化）
```
Key:   chart-list:{userId}
Value: ChartSummary[]（序列化）
TTL:   5 minutes
写穿策略：保存/删除后立即失效
```

## 5. Dependencies
- **Feature**: 00-ui-foundation（SidebarLayout、SidebarItem、Dialog、Button、Toast）
- **Feature**: 01-auth（JWT 守卫，userId 关联）
- **Feature**: 02-ai-chart-generation（ChartData 类型，当前图表状态）
- **Infrastructure**:
  - PostgreSQL：`charts` 表
  - Redis：列表缓存（可选）

## 6. Acceptance Criteria
- [ ] 用户可保存当前图表（弹窗输入名称，POST /api/charts）
- [ ] 保存成功后侧边栏列表立即更新（乐观更新或重新拉取）
- [ ] 侧边栏按 `createdAt` 倒序展示历史图表列表（最多 20 条/页）
- [ ] 点击历史条目，图表区加载并渲染对应图表数据
- [ ] 用户只能查看/删除自己的图表（403 保护）
- [ ] 删除成功后侧边栏条目移除
- [ ] 侧边栏空状态：显示 `EmptyState`（"暂无保存图表"）
- [ ] 侧边栏加载中：显示 `Skeleton` 列表占位
- [ ] `chartData` 以 JSONB 存储，读取后前端可直接渲染

## 7. UI Specification
- 引用 specs/ui/design-system.md
- 引用 specs/ui/tokens.md
- 引用 specs/ui/components.md（Sidebar、SidebarItem、Dialog、Button、EmptyState、Skeleton、Toast）
- 引用 specs/ui/layout.md（SidebarLayout，侧边栏 240px）

### 使用组件
| 组件 | 用途 |
|------|------|
| `SidebarLayout` | 整体左右布局容器 |
| `SidebarHeader` | 侧边栏标题区（"历史图表"） |
| `SidebarList` | 图表条目列表容器 |
| `SidebarItem` | 单条历史图表（含标题、类型 Badge、删除按钮） |
| `EmptyState` | 无历史图表时 |
| `Skeleton` | 列表加载中 |
| `Dialog` | 保存图表命名弹窗 |
| `Button[ghost][icon]` | 侧边栏删除按钮 |
| `Badge` | 图表类型标签（bar/line/pie...） |
| `Toast[success]` | 保存成功提示 |
| `Toast[error]` | 操作失败提示 |

### 状态覆盖
- loading（列表）：`Skeleton` × 5 条占位
- empty：`EmptyState`（"暂无保存图表，生成后保存"）
- saving：Dialog 内 Button loading 态
- active（当前加载项）：`SidebarItem` active 样式

### 约束
- 所有文案通过 `useTranslations('history')` 获取
- 侧边栏条目最多显示 20 字标题，超出省略
- 删除需二次确认（`Dialog` 或 `Tooltip` 提示，具体实现时决定）

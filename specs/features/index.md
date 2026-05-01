# Feature Map

| ID | Feature | Description | Dependency | Priority | Version |
|----|---------|-------------|------------|----------|---------|
| 00 | ui-foundation | 设计系统基础：token、组件库、布局模式、i18n 脚手架 | 无 | P0 | 1.0.0 |
| 01 | auth | 邮箱注册 + 用户名密码登录/登出，JWT 认证 | 00 | P0 | 1.0.0 |
| 02 | ai-chart-generation | 提示词输入 → LLM 提取数据 → 自动选型 → 图表渲染 | 00, 01 | P0 | 1.0.0 |
| 03 | chart-history | 保存图表、侧边栏历史列表、点击加载历史图表 | 00, 01 | P1 | 1.0.0 |
| 04 | chart-export | 将当前图表导出为 PNG/SVG 图片 | 00, 02 | P2 | 1.0.0 |

## Dependency Graph

```
00-ui-foundation
    ├── 01-auth
    │       ├── 02-ai-chart-generation ──► 04-chart-export
    │       └── 03-chart-history       ──► 04-chart-export
    └── (所有 feature 均依赖)
```

## Iteration Plan

### Week 1（基础能力）
- [ ] `00-ui-foundation`：搭建设计系统、布局、i18n
- [ ] `01-auth`：注册、登录、JWT 守卫

### Week 2（核心产品）
- [ ] `02-ai-chart-generation`：AI 生成图表主流程
- [ ] `03-chart-history`：保存与历史管理

### Week 3（完善）
- [ ] `04-chart-export`：图表导出

## Version Evolution Strategy

| 阶段 | Feature | 版本目标 | 说明 |
|------|---------|---------|------|
| MVP | 00, 01, 02 | 1.0.0 | 最小可用产品 |
| Beta | 03 | 1.0.0 | 持久化与历史 |
| GA | 04 | 1.0.0 | 导出功能 |
| 后续迭代 | 全部 | 1.1.0+ | 多图表类型、协作、分享 |

UI 设计系统（`specs/ui/`）独立版本管理，Feature 变更不影响 UI 版本号，除非涉及新增/修改组件。

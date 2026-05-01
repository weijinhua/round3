# Design Tokens

## Version
引用 specs/ui/version.md — Current: 1.0.0

## Color Tokens

### Semantic Colors
| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-bg-base` | `#ffffff` | `#0f1117` | 页面背景 |
| `--color-bg-surface` | `#f8f9fa` | `#1a1d27` | 卡片/面板背景 |
| `--color-bg-sidebar` | `#f1f3f5` | `#13161f` | 侧边栏背景 |
| `--color-bg-input` | `#ffffff` | `#1e2130` | 输入框背景 |
| `--color-border` | `#e2e8f0` | `#2d3148` | 通用边框 |
| `--color-text-primary` | `#0f172a` | `#f1f5f9` | 主要文字 |
| `--color-text-secondary` | `#64748b` | `#94a3b8` | 次要文字/描述 |
| `--color-text-muted` | `#94a3b8` | `#475569` | 占位符/禁用 |
| `--color-brand` | `#6366f1` | `#818cf8` | 主品牌色（Indigo） |
| `--color-brand-hover` | `#4f46e5` | `#6366f1` | 品牌色悬停 |
| `--color-success` | `#22c55e` | `#4ade80` | 成功状态 |
| `--color-warning` | `#f59e0b` | `#fbbf24` | 警告状态 |
| `--color-error` | `#ef4444` | `#f87171` | 错误状态 |

### Chart Palette（图表专用色序列）
```
#6366f1  #06b6d4  #f59e0b  #22c55e  #f43f5e  #a855f7  #14b8a6  #f97316
```

## Typography Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | `Inter, "Noto Sans SC", sans-serif` | 正文 |
| `--font-mono` | `"JetBrains Mono", monospace` | 代码/数据 |
| `--text-xs` | `0.75rem / 1rem` | 标签、辅助 |
| `--text-sm` | `0.875rem / 1.25rem` | 正文小 |
| `--text-base` | `1rem / 1.5rem` | 正文 |
| `--text-lg` | `1.125rem / 1.75rem` | 小标题 |
| `--text-xl` | `1.25rem / 1.75rem` | 标题 |
| `--text-2xl` | `1.5rem / 2rem` | 大标题 |
| `--font-normal` | `400` | 正文 |
| `--font-medium` | `500` | 强调 |
| `--font-semibold` | `600` | 标题 |
| `--font-bold` | `700` | 重点标题 |

## Spacing Tokens

基础单位：`4px`（Tailwind 默认）

| Token | Value | Usage |
|-------|-------|-------|
| `spacing-1` | `4px` | 紧凑间距 |
| `spacing-2` | `8px` | 小间距 |
| `spacing-3` | `12px` | 元素内边距 |
| `spacing-4` | `16px` | 标准间距 |
| `spacing-6` | `24px` | 区块间距 |
| `spacing-8` | `32px` | 大间距 |
| `spacing-12` | `48px` | 节间距 |

## Border Radius
| Token | Value |
|-------|-------|
| `radius-sm` | `4px` |
| `radius-md` | `8px` |
| `radius-lg` | `12px` |
| `radius-xl` | `16px` |
| `radius-full` | `9999px` |

## Shadow
| Token | Value |
|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` |

## Z-Index
| Token | Value | Usage |
|-------|-------|-------|
| `z-sidebar` | `10` | 侧边栏 |
| `z-header` | `20` | 顶部导航 |
| `z-modal` | `50` | 模态框 |
| `z-toast` | `60` | 通知 |

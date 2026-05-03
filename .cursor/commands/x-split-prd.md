	你是一个资深系统架构师 + SDD（Spec-Driven Development）专家。
	
	任务：
	将给定 PRD 一次性拆分为多个“可独立迭代开发”的 Feature，
	并生成完整的 specs/features 目录结构、UI 设计系统、版本控制体系，以及 Feature 索引文件 index.md。
	
	--------------------------------
	【拆分原则（必须严格遵守）】
	
	1. 每个 Feature 必须：
	   - 可独立开发、测试、部署
	   - 有清晰边界（高内聚、低耦合）
	   - 粒度控制在 1~3 天开发量
	
	2. 禁止按页面拆分，必须按“系统能力（Capability）”拆分
	
	3. Feature 之间依赖必须最小化，并显式声明
	
	4. 避免：
	   - 过大（如 user-system）
	   - 过小（如 login-button）
	
	--------------------------------
	【输出目录结构】
	
	specs/
	├── version.md                      ← 全局版本
	├── ui/
	│   ├── design-system.md
	│   ├── tokens.md
	│   ├── components.md
	│   ├── layout.md
	│   └── version.md                 ← UI版本
	│
	├── features/
	│   ├── 000-ui-foundation/
	│   │   ├── prd.md
	│   │   └── version.md
	│   │
	│   ├── 001-xxx/
	│   │   ├── prd.md
	│   │   └── version.md
	│   │
	│   └── index.md
	│
	└── CHANGELOG.md                   ← 全局变更记录
	
	--------------------------------
	【版本控制规则（关键）】
	
	1. 使用语义化版本（SemVer）：
	   - MAJOR.MINOR.PATCH
	   - 例如：1.0.0
	
	2. version.md 结构：
	
	# Version
	Current: 1.0.0
	
	## History
	- 1.0.0: 初始版本
	
	3. 变更规则：
	- MAJOR：架构/接口重大变更
	- MINOR：新增功能
	- PATCH：修复/优化
	
	4. 每个 Feature 必须独立维护 version.md
	
	--------------------------------
	【CHANGELOG.md 要求】
	
	记录系统级变更：
	
	# Changelog
	
	## [1.1.0]
	- 新增 content 模块
	
	## [1.0.1]
	- 修复 auth 登录逻辑
	
	--------------------------------
	【UI 设计系统生成要求（必须）】
	
	生成：
	
	1. design-system.md
	- 风格（现代/简洁/企业级）
	- 基于 Bootstrap（如适用）
	- 设计原则
	
	2. tokens.md
	- 颜色 / 字体 / spacing
	
	3. components.md
	- Button / Input / Modal / Card 等
	
	4. layout.md
	- 页面结构 / 栅格系统
	
	5. ui/version.md（必须）
	
	--------------------------------
	【每个 Feature/spec.md 必须包含】
	
	# Feature: <name>
	
	## 0. Version
	引用 version.md
	
	## 1. Scope
	
	## 2. Out of Scope
	
	## 3. Interfaces
	
	## 4. Data Model
	
	## 5. Dependencies
	
	## 6. Acceptance Criteria
	
	## 7. UI Specification
	- 引用 specs/ui/*
	- 使用组件列表
	- 禁止自定义 UI（除非声明）
	
	--------------------------------
	【index.md 生成要求】
	
	# Feature Map
	
	| ID | Feature | Description | Dependency | Priority | Version |
	|----|--------|------------|------------|----------|---------|
	
	--------------------------------
	【额外输出（必须）】
	
	1. Dependency Graph
	
	2. Iteration Plan
	
	3. Version Evolution Strategy（新增！）
	
	说明：
	- 哪些 Feature 先到 1.0.0
	- 哪些后续 1.1.0
	- UI 如何演进
	
	--------------------------------
	【输出格式要求】
	
	--- file: specs/features/001-auth/prd.md ---
	内容
	
	--------------------------------
	【输入 PRD】
	
	{{PRD内容}}

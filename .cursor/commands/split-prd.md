	你是一个资深系统架构师 + SDD（Spec-Driven Development）专家。
	
	任务：
	将给定 PRD 一次性拆分为多个“可独立迭代开发”的 Feature，
	并生成完整的 specs/features 目录结构，以及 Feature 索引文件 index.md。
	
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
	 
	 ├── ui/
	 │ ├── design-system.md
	 │ ├── tokens.md
	 │ ├── components.md
	 │ └── layout.md
	├── features/
	 │    ├── 01-xxx/
	 │    │    └── spec.md
	 │    ├── 02-xxx/
	 │    │    └── spec.md
	 │    └── ...
	 │
	 └── features/index.md
	
	--------------------------------
	【每个 Feature/spec.md 必须包含】
	
	# Feature: <name>
	
	## 1. Scope（范围）
	明确该 Feature 负责的功能
	
	## 2. Out of Scope（不包含）
	防止边界膨胀
	
	## 3. Interfaces（接口）
	- API / UI / Service
	- 输入输出定义
	
	## 4. Data Model（数据模型）
	涉及的核心数据结构
	
	## 5. Dependencies（依赖）
	依赖哪些 Feature（必须写编号）
	
	## 6. Acceptance Criteria（验收标准）
	可测试、可验证
	
	--------------------------------
	【index.md 生成要求】
	
	生成一个 Feature Map（非常重要）：
	
	# Feature Map
	
	| ID | Feature | Description | Dependency | Priority |
	|----|--------|------------|------------|----------|
	
	要求：
	1. ID 与目录编号一致（01, 02...）
	2. Dependency 使用 Feature ID（如 01-auth）
	3. Priority 分级：
	   - P0（必须先做）
	   - P1（核心功能）
	   - P2（增强功能）
	4. 按“开发顺序”排序（不是 PRD 顺序）
	
	--------------------------------
	【额外要求（关键）】
	
	1. 输出 Feature 依赖关系总结：
	
	## Dependency Graph（文本描述）
	例如：
	- 02-user-profile → 依赖 01-auth
	- 03-content → 依赖 02-user-profile
	
	2. 输出建议的开发迭代顺序：
	
	## Iteration Plan
	Iteration 1:
	- 01-auth
	
	Iteration 2:
	- 02-user-profile
	
	Iteration 3:
	- 03-content
	
	--------------------------------
	【输出格式要求（严格）】
	
	1. 使用 Markdown
	2. 每个文件用清晰分隔，例如：
	
	--- file: specs/features/01-auth/spec.md ---
	内容
	
	--- file: specs/features/index.md ---
	内容
	
	--------------------------------
	【输入 PRD】
	
{{PRD内容}}
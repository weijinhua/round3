	You are an expert engineer.
	
	Input:
	- @specs/01-architecture.md
	- @specs/02-stack.md
	- @specs/03-scaffold.md
	
	
	Task:
	Create a runnable project with a fully initialized UI foundation.
	
	The system MUST be:
	- runnable
	- production-ready (structure)
	- design-system driven (MANDATORY)
	
	Execute step by step.
	
	---
	
	# Step 1: Project Setup
	
	- initialize monorepo (if required)
	- setup package manager (pnpm recommended)
	- create apps:
	  - apps/web
	  - apps/api
	- create packages:
	  - design-system
	  - ui
	  - config
	
	---
	
	# Step 2: Frontend Setup
	
	- setup framework (e.g. Next.js / Vite)
	- setup Tailwind CSS (if in stack)
	- configure tsconfig paths for monorepo
	- setup base App
	
	---
	
	# Step 3: Design System Initialization (CRITICAL)
	
	Initialize a minimal but functional design-system.
	
	## 3.1 Tokens
	
	Create:
	
	- color.ts
	- spacing.ts
	- typography.ts
	- radius.ts
	
	Requirements:
	- map to Tailwind (if used)
	- no hardcoded values in components
	
	---
	
	## 3.2 Core Components
	
	Implement minimal components:
	
	- Button
	- Input
	- Card
	
	Requirements:
	- use variant system (CVA if available)
	- no inline styles
	- use tokens
	
	---
	
	## 3.3 Patterns (MANDATORY)
	
	Implement layout patterns:
	
	- AppLayout (navigation + content)
	- SplitLayout (vertical or horizontal split)
	- FormPattern
	
	Requirements:
	- patterns must compose components
	- patterns define layout structure (NOT pages)
	
	---
	
	## 3.4 UI Export Layer
	
	Implement:
	
	packages/ui
	
	- re-export all components and patterns
	- enforce single entry point for UI
	
	---
	
	# Step 4: Base Layout Integration
	
	- implement base layout using patterns
	- use AppLayout (or equivalent)
	- DO NOT implement product-specific UI
	- demonstrate pattern usage
	
	---
	
	# Step 5: Backend Setup
	
	- setup backend framework (Fastify / NestJS)
	- create health check API:
	  - GET /health → returns OK
	
	---
	
	# Step 6: Infra Setup
	
	Create:
	
	- Dockerfile (web + api)
	- docker-compose.yml
	- .env.example
	
	---
	
	# Step 7: Example Page (IMPORTANT)
	
	Create a minimal demo page to verify UI system:
	
	- use AppLayout
	- use Button / Input
	- show loading / empty state (optional)
	
	---
	
	# Step 8: Constraints Enforcement
	
	Ensure:
	
	- no raw HTML styling
	- all UI uses design-system
	- patterns are used for layout
	
	---
	
	# Step 9: Output
	
	Provide:
	
	- directory tree
	- key files (code)
	- explanation of:
	  - how design-system works
	  - how to extend it
	
	---
	
	Rules:
	- write real code
	- minimal but runnable
	- MUST follow architecture UI system
	- MUST implement design-system (NOT optional)
	- avoid over-engineering

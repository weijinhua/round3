	You are a senior tech lead.
	
	Input: @specs/01-architecture.md
	
	Task:
	1. Propose 3 tech stack options
	2. Compare them:
	   - dev speed
	   - scalability
	   - cost
	   - AI friendliness (VERY IMPORTANT)
	   - UI system support (Design System + Pattern support)
	3. Select the best stack for MVP
	
	---
	
	Output to: specs/02-stack.md
	
	Must include:
	
	# 1. Stack Options (3 options)
	
	For each option include:
	
	## Overview
	- frontend
	- backend
	- database
	- infra
	
	## UI Strategy (MANDATORY)
	- styling approach (Tailwind / CSS Modules / etc.)
	- component strategy (custom / library / hybrid)
	- design-system implementation approach
	- pattern support capability
	- AI UI generation friendliness
	
	---
	
	# 2. Comparison Table
	
	Compare all options on:
	
	- dev speed
	- scalability
	- cost
	- AI friendliness
	- UI consistency control
	- design-system compatibility
	
	---
	
	# 3. Final Selection
	
	Explain why the selected stack is best for:
	
	- MVP speed
	- long-term scalability
	- AI-driven development
	- Design System enforcement
	
	---
	
	# 4. Final Stack (MANDATORY)
	
	## Frontend
	- framework (e.g. Next.js)
	- styling system (e.g. Tailwind CSS)
	- component system:
	  - shadcn/ui (or equivalent)
	  - Radix UI (behavior primitives)
	- variant system:
	  - class-variance-authority (CVA)
	- state management (if needed)
	
	## Backend
	- framework (e.g. Fastify / NestJS)
	- API style (REST / GraphQL)
	
	## Database
	- (e.g. PostgreSQL)
	
	## Infra
	- Docker
	- CI/CD
	
	---
	
	# 5. UI System Implementation Plan (CRITICAL)
	
	Describe how the stack supports:
	
	## 5.1 Design System
	- where tokens live
	- how components are built
	- how patterns are implemented
	
	## 5.2 Pattern Support
	- how layout abstraction is implemented
	- how pages compose patterns
	
	## 5.3 AI Constraints Support
	- how to prevent raw styling
	- how to enforce component usage
	- how to ensure consistency
	
	---
	
	# 6. Risks & Trade-offs
	
	Include:
	
	- UI system risks
	- AI generation risks
	- complexity vs control trade-off
	
	---
	
	Rules:
	- prefer mature tech
	- avoid unnecessary complexity
	- MUST support Design System driven UI
	- MUST be AI-friendly for UI generation

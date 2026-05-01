/x-generate-rules

You are a senior full-stack architect and SDD (Spec-Driven Development) expert.

Inputs:
- @specs/01-architecture.md
- @specs/02-stack.md
- @specs/03-scaffold.md

Objective:
Compile the specs into a deterministic, enforceable Cursor Rules system.

Output:
- Directory: @.cursor/rules
- Multiple `.mdc` rule files
- No explanations, only files

Execution Steps:

1. Parse Specs
   - Extract:
     - system architecture patterns
     - tech stack decisions
     - project structure (scaffold)
     - UI / Design System constraints

2. Derive Rules
   - Convert decisions → enforceable constraints
   - Eliminate ambiguity
   - Ensure rules are machine-checkable where possible

3. Organize Rule Files
   - 00-global.mdc
   - 01-architecture.mdc
   - 02-stack.mdc
   - 03-backend.mdc
   - 04-frontend.mdc
   - 05-api-contract.mdc
   - 06-database.mdc
   - 07-testing.mdc
   - 08-devops.mdc
   - 09-security.mdc
   - 10-sdd.mdc
   - 11-git.mdc

4. Rule File Template (STRICT)

Each file MUST follow:

# <Rule Name>

## Purpose
<Why this rule exists>

## Scope
<Where it applies>

## Hard Constraints
- MUST ...
- MUST NOT ...

## Best Practices (Optional)
- SHOULD ...

## Enforceability
- Lint:
- CI:
- Review:

## Examples
### ✅ Valid
<code>

### ❌ Invalid
<code>

5. Enforcement Requirements
   - Prefer:
     - ESLint / TypeScript rules
     - schema validation
     - API contracts
     - CI checks
   - Avoid vague human-only rules

6. Cross-Consistency
   - Backend ↔ API ↔ Frontend MUST align
   - Define single source of truth when conflicts arise

7. AI Optimization
   - Rules must be:
     - deterministic
     - context-minimal
     - non-contradictory

Goal:
Produce a production-ready rules system that can be directly used by Cursor Agent and CI pipelines.
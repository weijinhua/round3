# Charts Generator

AI-powered chart generation app built with Next.js 14 + NestJS monorepo.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS v3 (encapsulated in design-system) |
| Components | shadcn/ui style via CVA |
| Charts | Apache ECharts |
| i18n | next-intl (default: zh-CN) |
| Backend | NestJS, REST API |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Package manager | pnpm workspaces |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker + Docker Compose (for local database)

### Local Development

```bash
# Install dependencies
pnpm install

# Start PostgreSQL + Redis
docker-compose up postgres redis -d

# Copy env files
cp .env.example .env.local
cp .env.local.example apps/web/.env.local

# Run all apps in dev mode
pnpm dev
```

API: http://localhost:3001/api/v1/health  
Web: http://localhost:3000

### Full Stack with Docker

```bash
docker-compose up --build
```

## Project Structure

```
charts-generator/
├── apps/
│   ├── web/          # Next.js 14 frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── design-system/ # Tokens, components, patterns
│   ├── ui/            # Re-export gate (@charts-gen/ui)
│   └── config/        # Shared tsconfig + eslint
└── docker-compose.yml
```

## UI System

All UI is design-system driven. App code only imports from `@charts-gen/ui`:

```tsx
import { Button, AppLayout, SplitLayout } from '@charts-gen/ui';
```

Never import directly from `packages/design-system`.

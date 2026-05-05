# Auth quickstart\n+\n+Local quickstart for the Auth feature:\n+\n+1. Start dependencies:\n+\n+```bash\n+docker-compose up -d postgres redis mailhog\n+```\n+\n+2. Configure environment (copy example):\n+\n+```bash\n+cp .env.local.example apps/api/.env.local\n+```\n+\n+3. Run migrations for the API (from repo root):\n+\n+```bash\n+cd apps/api\n+npm run migrate\n+```\n+\n+4. Start the API and worker in development:\n+\n+```bash\n+pnpm --filter @charts-gen/api dev\n+node apps/worker/dist/worker.js\n+```\n+\n+5. Use MailHog UI at http://localhost:8025 to inspect outgoing emails.\n+\n+Notes: ensure `JWT_SECRET` and other env vars are set in `apps/api/.env.local` before running in non-dev environments.\n*** End PatchApplyingPATCH_ERRORNELJSON ***!
# Quickstart — Auth (001-auth)

简要步骤在本地运行认证功能（开发环境）。

先决条件
- pnpm (工作区依赖管理)
- Docker (Postgres, Redis, MailHog 本地服务)

1) 启动基础服务（在仓库根目录）

```bash
docker-compose up -d postgres redis mailhog
```

2) 安装依赖

```bash
pnpm install
```

3) 准备环境变量
- 复制 `.env.example` 到 `.env.local` 并设置以下至少需要的键：
  - DATABASE_URL（Postgres 连接）
  - REDIS_URL（Redis 连接）
  - MAILER_PROVIDER / MAILER_URL / MAILER_FROM
  - JWT_SECRET（用于短期访问 token）

4) 运行数据库迁移
- 使用项目中 `apps/api` 的迁移脚本。例如（以项目脚本为准）：

```bash
# 示例命令；请参考 apps/api/package.json 中的 scripts
pnpm --filter ./apps/api run migrate
# 或（TypeORM 示例）
pnpm --filter ./apps/api run typeorm:migration:run
```

5) 启动 API 服务 与 邮件 worker

```bash
pnpm --filter ./apps/api run dev
pnpm --filter ./apps/worker run start
```

6) 本地验收流程（示例）
- 在 MailHog UI 查看邮件： http://localhost:8025
- 注册账户（示例）：

```bash
curl.exe -s -X POST http://localhost:3001/api/v1/auth/register   -H "Content-Type: application/json" -d '{"email":"alice@example.com","password":"Password1"}'
```
```bash
curl.exe -s -X POST "http://localhost:3001/api/v1/auth/register" -H "Content-Type: application/json" --data-raw '{\"email\":\"alice@example.com\",\"password\":\"Password1\"}'
```

- 登录（示例）：

```bash
curl.exe -s -X POST http://localhost:3001/api/v1/auth/login   -H "Content-Type: application/json"   --data-raw '{\"email\":\"alice@example.com\",\"password\":\"Password1\"}'
```

备注
- 如果仓库已有不同的 service 名称或脚本，请以 `apps/api` 与 `apps/worker` 中实际 scripts 为准；上面命令为通用示例。


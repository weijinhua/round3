# Feature: Auth

## 0. Version
引用 specs/features/01-auth/version.md — Current: 1.0.0

## 1. Scope
- 用户邮箱注册（email + username + password）
- 用户名 + 密码登录
- JWT access token（短期）+ refresh token（长期，服务端 Redis 存储）
- 登出（invalidate refresh token）
- 路由守卫（未登录重定向至登录页）
- 前端登录状态管理

## 2. Out of Scope
- OAuth / 第三方登录
- 邮箱验证（验证码/链接）
- 密码找回
- 多因素认证（MFA）
- 用户资料编辑

## 3. Interfaces

### REST API（NestJS `auth` 模块）

#### POST /api/auth/register
```ts
// Request Body (DTO)
class RegisterDto {
  @IsEmail() email: string
  @IsString() @MinLength(3) @MaxLength(30) username: string
  @IsString() @MinLength(8) password: string  // bcrypt hash 后存储
}

// Response 201
{ userId: string, username: string, email: string }

// Errors
// 409 Conflict: email or username already exists
// 400 Bad Request: validation failure
```

#### POST /api/auth/login
```ts
// Request Body
class LoginDto {
  @IsString() username: string
  @IsString() password: string
}

// Response 200
{ accessToken: string, expiresIn: number }
// Set-Cookie: refreshToken=<token>; HttpOnly; Secure; SameSite=Strict

// Errors
// 401 Unauthorized: invalid credentials
```

#### POST /api/auth/refresh
```ts
// Cookie: refreshToken
// Response 200
{ accessToken: string, expiresIn: number }
// 403 Forbidden: invalid/expired refresh token
```

#### POST /api/auth/logout
```ts
// Authorization: Bearer <accessToken>
// Response 204 No Content
// 使 Redis 中的 refresh token 失效
```

#### GET /api/auth/me
```ts
// Authorization: Bearer <accessToken>
// Response 200
{ userId: string, username: string, email: string }
```

### Frontend（Next.js App Router）
- `/login`：登录页（使用 AuthLayout）
- `/register`：注册页（使用 AuthLayout）
- `middleware.ts`：检查 access token，未登录重定向 `/login`
- `useAuth()` hook：返回 `{ user, login, logout, isLoading }`

## 4. Data Model

### User Entity（PostgreSQL）
```ts
@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column({ unique: true }) email: string
  @Column({ unique: true }) username: string
  @Column() passwordHash: string  // bcrypt
  @CreateDateColumn() createdAt: Date
  @UpdateDateColumn() updatedAt: Date
}
```

### Refresh Token（Redis）
```
Key:   refresh:{userId}:{tokenId}
Value: { token, userId, expiresAt }
TTL:   7 days
```

### JWT Payload
```ts
interface JwtPayload {
  sub: string   // userId
  username: string
  iat: number
  exp: number   // 15 minutes
}
```

## 5. Dependencies
- **Feature**: 00-ui-foundation（登录/注册页面使用 AuthLayout、Button、Input、Toast）
- **Infrastructure**:
  - PostgreSQL：User 表
  - Redis：refresh token 存储
  - `@nestjs/jwt`、`passport-jwt`
  - `bcrypt`（密码哈希，≥ 10 rounds）
  - `class-validator`、`class-transformer`（DTO 验证）

## 6. Acceptance Criteria
- [ ] 注册：新用户可用邮箱 + 用户名 + 密码成功注册
- [ ] 注册：重复邮箱或用户名返回 409
- [ ] 注册：密码以 bcrypt 哈希存储，数据库中无明文
- [ ] 登录：正确凭据返回 access token + HttpOnly refresh token cookie
- [ ] 登录：错误凭据返回 401
- [ ] Refresh：有效 refresh token 返回新 access token
- [ ] 登出：refresh token 从 Redis 中失效，后续刷新返回 403
- [ ] 守卫：未携带有效 token 访问受保护路由返回 401
- [ ] 前端：登录后跳转至主页，登出后清除状态跳转至 `/login`
- [ ] 前端：`/login`、`/register` 页面通过 TypeScript 类型检查

## 7. UI Specification
- 引用 specs/ui/design-system.md
- 引用 specs/ui/tokens.md
- 引用 specs/ui/components.md（AuthLayout、Button、Input、Toast）
- 引用 specs/ui/layout.md（AuthLayout：居中卡片，max-w-400px）

### 使用组件
| 组件 | 用途 |
|------|------|
| `AuthLayout` | 登录/注册页面外框 |
| `Input` | 邮箱、用户名、密码输入 |
| `Button[primary]` | 提交按钮 |
| `Toast[error]` | 登录/注册失败提示 |
| `LoadingSpinner` | 表单提交中状态 |

### 状态覆盖
- loading：提交按钮 loading 态，禁止重复提交
- error：表单字段级验证错误 + Toast 全局错误
- success：注册成功 Toast + 自动跳转登录页

### 约束
- 禁止在页面层自定义 UI 样式
- 所有文案通过 `useTranslations('auth')` 获取

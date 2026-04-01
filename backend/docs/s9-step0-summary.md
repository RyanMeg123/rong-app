# S9 Step 0 Summary

## Working Assumption

- [推断] 当前实际后端 worktree 使用 `/Users/ryansmacmini/Documents/rong-app`。
- 原请求中的 `/Users/ryansmacmini/Documents/rong-app/codex-s9-backend` 在本机不存在。
- 为避免影响现有 Expo 工程，后端初始化在仓库子目录 `backend/` 中进行。

## Technical Selection

From PRD Chapter 5 and backend architecture:

- Runtime: Node.js 20 + TypeScript
- Framework: Express
- Database: PostgreSQL
- ORM: Prisma
- Auth: Access Token + Refresh Token
- Cache: Redis optional in v1, reserved for rate limit and blacklist
- Error tracking: Sentry
- API prefix: `/api/v1`

## P0 Module Order

1. Auth
2. Role and Home
3. Conversations and Messages
4. Memory Cards
5. Me / Privacy / Boundary

## P0 API List

- `GET /api/v1/health`
- `POST /api/v1/auth/guest`
- `POST /api/v1/auth/apple`
- `POST /api/v1/auth/email/request-code`
- `POST /api/v1/auth/email/verify-code`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/me`
- `PATCH /api/v1/me`
- `DELETE /api/v1/me`
- `GET /api/v1/roles`
- `POST /api/v1/me/role`
- `GET /api/v1/me/role-state`
- `GET /api/v1/home`
- `POST /api/v1/conversations`
- `GET /api/v1/conversations/current`
- `GET /api/v1/conversations/:id/messages`
- `POST /api/v1/conversations/:id/messages`
- `GET /api/v1/memory/cards`
- `POST /api/v1/memory/cards`
- `DELETE /api/v1/memory/cards/:id`
- `GET /api/v1/privacy/summary`
- `GET /api/v1/safety/boundary`

## Response Contract

Success:

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "meta": {}
}
```

Failure:

```json
{
  "code": 40001,
  "message": "参数错误",
  "data": null
}
```

Error codes:

- `40001` validation error
- `40100` unauthorized
- `40101` token expired
- `40300` forbidden
- `40400` not found
- `40900` binding conflict
- `42900` rate limited
- `50000` internal error

## Core Tables

- `users`
- `auth_identities`
- `roles`
- `user_role_states`
- `conversations`
- `messages`
- `memory_cards`
- `safety_events`
- `refresh_tokens`

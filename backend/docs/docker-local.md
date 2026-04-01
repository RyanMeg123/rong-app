# Docker Local Backend

## Included Services

- `backend`: Node.js + Express + Prisma service
- `postgres`: PostgreSQL 16
- `redis`: Redis 7

## Start

```bash
cd backend
docker compose up --build
```

Backend:

- API: `http://localhost:4000`
- Health: `http://localhost:4000/api/v1/health`

Datastores:

- PostgreSQL: `localhost:5434`
- Redis: `localhost:6380`

## Stop

```bash
cd backend
docker compose down
```

## Reset Volumes

```bash
cd backend
docker compose down -v
```

## Notes

- Container startup waits for PostgreSQL and Redis before starting the backend.
- Startup runs `prisma generate` and `prisma db push`.
- Data is stored in named Docker volumes: `postgres_data` and `redis_data`.

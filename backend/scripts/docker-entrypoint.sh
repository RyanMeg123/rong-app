#!/bin/sh
set -eu

echo "[backend] waiting for postgres..."
until nc -z postgres 5432; do
  sleep 1
done

echo "[backend] waiting for redis..."
until nc -z redis 6379; do
  sleep 1
done

echo "[backend] generating prisma client..."
npx prisma generate

echo "[backend] syncing schema..."
npx prisma db push --accept-data-loss

echo "[backend] starting service..."
node dist/server.js

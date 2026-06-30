#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

# Install dependencies if needed
echo "Installing dependencies..."
pnpm install --frozen-lockfile

# Build backend
echo "Building backend..."
cd "$ROOT/api-server" && pnpm run build
cd "$ROOT"

# Build frontend (static files -> ga-que-dien-khanh/dist/public)
echo "Building frontend..."
pnpm --filter @workspace/ga-que-dien-khanh run build

# Start backend — serves both /api and the built frontend
PORT=${PORT:-5000}
echo "Starting server on port $PORT..."
PORT=$PORT NODE_ENV=production node --enable-source-maps api-server/dist/index.mjs

#!/bin/bash

# Build backend
echo "Building backend..."
cd /home/runner/workspace/api-server && node ./build.mjs
cd /home/runner/workspace

# Start backend in background
echo "Starting backend on port 3000..."
PORT=3000 NODE_ENV=production node --enable-source-maps api-server/dist/index.mjs &

# Start frontend dev server
echo "Starting frontend on port 5000..."
PORT=5000 BASE_PATH=/ pnpm --filter @workspace/ga-que-dien-khanh run dev

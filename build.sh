#!/bin/bash
set -e

echo "Installing dependencies..."
pnpm install

echo "Building backend..."
cd api-server && node ./build.mjs
cd ..

echo "Building frontend..."
PORT=5000 BASE_PATH=/ pnpm --filter @workspace/ga-que-dien-khanh run build

echo "Build complete!"

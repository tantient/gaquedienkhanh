#!/bin/bash
set -e

echo "Starting server on port 5000..."
PORT=5000 NODE_ENV=production node --enable-source-maps api-server/dist/index.mjs

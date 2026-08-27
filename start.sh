#!/bin/sh
echo "Running database migrations..."
timeout 60 npx drizzle-kit push 2>&1 || echo "Migration skipped or timed out"
echo "Starting server..."
npm start

#!/bin/bash

echo "Starting development server with clean environment..."

# Kill any existing processes
pkill -f "next dev" 2>/dev/null || true

# Clean cache directories
rm -rf .next .turbo node_modules/.cache 2>/dev/null || true

# Create .next directory with proper permissions
mkdir -p .next
chmod -R 755 .next

# Clear npm cache if needed
# npm cache clean --force 2>/dev/null || true

echo "Starting Next.js development server..."
npm run dev
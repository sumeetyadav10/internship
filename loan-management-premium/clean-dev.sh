#!/bin/bash

echo "Cleaning Next.js development files..."

# Kill any running Next.js processes
pkill -f "next dev" || true

# Clean Next.js cache and temp files
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

# Create fresh .next directory
mkdir -p .next

echo "Cleaned successfully! You can now run 'npm run dev' to start the development server."
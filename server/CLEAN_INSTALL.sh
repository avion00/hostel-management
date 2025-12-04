#!/bin/bash
# Clean install script for WSL

echo "🧹 Cleaning up..."

# Remove node_modules and lock files
rm -rf node_modules
rm -f package-lock.json

# Clear npm cache
npm cache clean --force

echo "📦 Installing dependencies..."
npm install

echo "✅ Done! Now run: npm run dev"

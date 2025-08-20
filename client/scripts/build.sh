#!/bin/bash

# Production build script for Kiccksy
echo "🚀 Starting production build..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the client directory."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Run linting
echo "🔍 Running linting..."
npm run lint

# Build the application
echo "🏗️ Building application..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Output directory: dist/"
    echo "📊 Build size:"
    du -sh dist/
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Ready for deployment!"

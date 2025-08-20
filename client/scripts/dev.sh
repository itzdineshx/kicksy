#!/bin/bash

# Development setup script for Kiccksy
echo "🚀 Setting up Kiccksy development environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the client directory."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Please copy env.example to .env and fill in your environment variables:"
    echo "   cp env.example .env"
    echo ""
    echo "Required variables:"
    echo "  - VITE_SUPABASE_URL"
    echo "  - VITE_SUPABASE_ANON_KEY"
    echo "  - VITE_CLERK_PUBLISHABLE_KEY"
    echo "  - VITE_RAZORPAY_KEY_ID"
    echo "  - VITE_ML_SERVICE_URL"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies!"
    exit 1
fi

# Run linting
echo "🔍 Running linting..."
npm run lint

# Start development server
echo "🌐 Starting development server..."
echo "📱 Your app will be available at: http://localhost:5173"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

npm run dev

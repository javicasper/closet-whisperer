#!/bin/bash

set -e

echo "🚀 Setting up Closet Whisperer..."

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "⚠️  Please edit backend/.env and add your OPENROUTER_API_KEY"
fi

if [ ! -f frontend/.env.local ]; then
    echo "📝 Creating frontend .env.local file..."
    cp frontend/.env.example frontend/.env.local
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Start infrastructure
echo "🐳 Starting infrastructure services (postgres, redis, minio)..."
docker-compose up -d postgres redis minio

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 5

# Run migrations
echo "🗃️  Running database migrations..."
cd backend
npx prisma migrate deploy || npx prisma db push
npx prisma generate
cd ..

echo "✅ Setup complete!"
echo ""
echo "To start developing:"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Or run everything with Docker:"
echo "  docker-compose up -d"

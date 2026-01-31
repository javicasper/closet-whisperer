# 👗 Closet Whisperer

[![CI](https://github.com/javicasper/closet-whisperer/actions/workflows/ci.yml/badge.svg)](https://github.com/javicasper/closet-whisperer/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)](https://nodejs.org/)

AI-powered virtual closet for smart outfit recommendations. Single-user application that helps you manage your wardrobe and get intelligent outfit suggestions.

<p align="center">
  <img src="https://img.shields.io/badge/🎨-Fashion-ff69b4" alt="Fashion" />
  <img src="https://img.shields.io/badge/🤖-AI%20Powered-blueviolet" alt="AI" />
  <img src="https://img.shields.io/badge/🐳-Docker-blue" alt="Docker" />
</p>

## ✨ Features

- 📸 **Smart Garment Analysis**: Upload photos of your clothes and let AI automatically identify type, color, and style
- 🎨 **Outfit Generation**: AI creates personalized outfit combinations from your wardrobe
- 🧺 **Laundry Tracking**: Mark items as in laundry/unavailable
- 🔍 **Smart Filtering**: Search by type, color, season, occasion
- 🎯 **MCP-Powered AI**: AI queries your wardrobe efficiently using Model Context Protocol tools

## Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS + shadcn/ui
- Zustand for state management
- Playwright for E2E testing

### Backend
- Node.js + Fastify
- TypeScript
- Prisma ORM
- PostgreSQL (database)
- Redis (caching)
- MinIO (S3-compatible storage)
- Vitest for testing

### AI
- OpenRouter API (GPT-4o, Claude 3 Opus, etc.)
- Vision models for garment analysis
- MCP tools for efficient wardrobe queries

### Infrastructure
- Docker + Docker Compose
- All services containerized

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)
- OpenRouter API key (get one at https://openrouter.ai/)

### 🚀 Automated Setup

Run the setup script:
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Then add your OpenRouter API key to `backend/.env`:
```
OPENROUTER_API_KEY=sk-or-v1-your_key_here
```

### 🐳 Start with Docker

```bash
docker-compose up -d
```

Wait ~30 seconds for services to initialize, then access:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **MinIO Console**: http://localhost:9001 (minioadmin / minioadmin)

### 🛠️ Manual Setup

1. Clone the repository:
```bash
git clone https://github.com/javicasper/closet-whisperer.git
cd closet-whisperer
```

2. Create environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

3. Add your OpenRouter API key to `backend/.env`:
```
OPENROUTER_API_KEY=sk-or-v1-your_key_here
```

4. Start infrastructure services:
```bash
docker-compose up -d postgres redis minio
```

5. Install dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```

6. Run database migrations:
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

7. Start backend (in one terminal):
```bash
cd backend
npm run dev
```

8. Start frontend (in another terminal):
```bash
cd frontend
npm run dev
```

9. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Run Tests
```bash
# Backend tests
cd backend
npm run test

# E2E tests
cd frontend
npm run test:e2e
```

## Architecture

### MCP Tools for AI
The AI doesn't receive your entire wardrobe. Instead, it uses MCP tools to query efficiently:

- `searchGarments({ type, color, season, occasion, status })` - Filter available garments
- `getGarmentById(id)` - Get specific garment details
- `getAvailableGarments()` - All garments not in laundry

### Database Schema
- **Garments**: id, image_url, type, color, season, occasion, status, metadata
- **Outfits**: id, name, garment_ids, ai_suggestion, created_at
- **LaundryQueue**: garment_id, added_at, estimated_available_at

## API Documentation

### Garments
- `POST /api/garments` - Upload new garment (with image)
- `GET /api/garments` - List garments (with filters)
- `GET /api/garments/:id` - Get garment details
- `PUT /api/garments/:id` - Update garment
- `DELETE /api/garments/:id` - Delete garment
- `POST /api/garments/:id/laundry` - Mark as in laundry

### Outfits
- `POST /api/outfits/generate` - AI generates outfit suggestions
- `GET /api/outfits` - List saved outfits
- `POST /api/outfits` - Save outfit
- `DELETE /api/outfits/:id` - Delete outfit

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://closet:closet@postgres:5432/closet
REDIS_URL=redis://redis:6379
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=garments
OPENROUTER_API_KEY=your_key_here
OPENROUTER_MODEL=openai/gpt-4o
PORT=4000
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## License

MIT

## Author

Created with ❤️ by javicasper

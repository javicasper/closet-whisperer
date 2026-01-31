# Development Guide

## Prerequisites

- Docker and Docker Compose
- Node.js 20+
- npm
- OpenRouter API key (get one at https://openrouter.ai/)

## Initial Setup

1. **Clone the repository**
```bash
git clone https://github.com/javicasper/closet-whisperer.git
cd closet-whisperer
```

2. **Set up environment variables**

Backend:
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and add your OpenRouter API key:
```
OPENROUTER_API_KEY=your_actual_api_key_here
```

Frontend:
```bash
cp frontend/.env.example frontend/.env.local
```

3. **Install dependencies**

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

## Running with Docker (Recommended)

The easiest way to run the entire application:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- MinIO Console: http://localhost:9001 (minioadmin / minioadmin)

## Running Locally (Development)

If you want to develop without Docker:

### 1. Start infrastructure services
```bash
docker-compose up -d postgres redis minio
```

### 2. Run backend
```bash
cd backend
npm run dev
```

### 3. Run frontend (in another terminal)
```bash
cd frontend
npm run dev
```

### 4. Run Prisma migrations
```bash
cd backend
npx prisma migrate dev
```

## Database Management

Generate Prisma client:
```bash
cd backend
npm run prisma:generate
```

Create a migration:
```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

Open Prisma Studio (database GUI):
```bash
cd backend
npm run prisma:studio
```

## Testing

### Backend Tests
```bash
cd backend
npm test              # Run tests
npm run test:ui       # Run with UI
npm run test:coverage # Generate coverage report
```

### Frontend E2E Tests
```bash
cd frontend
npm run test:e2e      # Run Playwright tests
npm run test:e2e:ui   # Run with UI
```

## Project Structure

```
closet-whisperer/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── __tests__/          # Unit tests
│   │   ├── mcp/
│   │   │   └── tools.ts        # MCP tools for AI queries
│   │   ├── routes/
│   │   │   ├── garments.routes.ts
│   │   │   └── outfits.routes.ts
│   │   ├── services/
│   │   │   ├── ai.service.ts   # OpenRouter integration
│   │   │   └── storage.service.ts  # MinIO integration
│   │   ├── utils/
│   │   │   └── prisma.ts
│   │   ├── config.ts
│   │   └── index.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── app/                    # Next.js pages
│   │   ├── closet/
│   │   ├── builder/
│   │   ├── outfits/
│   │   ├── laundry/
│   │   └── page.tsx
│   ├── components/             # React components
│   │   ├── GarmentCard.tsx
│   │   ├── UploadGarment.tsx
│   │   └── OutfitBuilder.tsx
│   ├── lib/
│   │   └── api.ts             # API client
│   ├── store/
│   │   └── garments.store.ts  # Zustand state
│   ├── types/
│   │   └── index.ts
│   ├── tests/                 # Playwright tests
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Garments
- `POST /api/garments` - Upload new garment (multipart/form-data)
- `GET /api/garments` - List garments (with filters)
- `GET /api/garments/:id` - Get garment details
- `PUT /api/garments/:id` - Update garment
- `DELETE /api/garments/:id` - Delete garment
- `POST /api/garments/:id/laundry` - Mark as in laundry
- `DELETE /api/garments/:id/laundry` - Remove from laundry
- `GET /api/laundry` - Get laundry queue

### Outfits
- `POST /api/outfits/generate` - Generate outfit with AI
- `GET /api/outfits` - List saved outfits
- `GET /api/outfits/:id` - Get outfit details
- `POST /api/outfits` - Save outfit
- `DELETE /api/outfits/:id` - Delete outfit

## How the AI Works

The AI uses **Model Context Protocol (MCP)** tools to query your wardrobe efficiently:

1. **User asks for outfit** → "I need something casual for a coffee date"

2. **AI queries wardrobe** using MCP tools:
   - `searchGarments({ occasion: 'casual', status: 'AVAILABLE' })`
   - `getGarmentsByType('TOP')`
   - `getGarmentsByType('BOTTOM')`

3. **AI receives only relevant items** (not entire closet)

4. **AI generates 2-3 outfit combinations** with reasoning

5. **User can save favorite outfits**

This approach is:
- ✅ Efficient (doesn't overload context with all garments)
- ✅ Scalable (works with large wardrobes)
- ✅ Smart (AI only fetches what it needs)

## Troubleshooting

### Docker issues
```bash
# Clean slate
docker-compose down -v
docker-compose up -d --build
```

### Backend not connecting to database
Check that Postgres is running:
```bash
docker-compose ps postgres
docker-compose logs postgres
```

### Frontend can't reach backend
Make sure `NEXT_PUBLIC_API_URL` in `frontend/.env.local` is correct:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### MinIO images not loading
Check MinIO bucket permissions and public policy is set correctly.

### AI not working
Verify your OpenRouter API key is set in `backend/.env`:
```
OPENROUTER_API_KEY=sk-or-v1-...
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests if needed
4. Commit with conventional commits: `feat:`, `fix:`, `docs:`, etc.
5. Push and create a pull request

## License

MIT

.PHONY: help setup start stop restart logs clean test build

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup: ## Initial setup (install dependencies, start infrastructure)
	@echo "🚀 Setting up Closet Whisperer..."
	@chmod +x scripts/setup.sh
	@./scripts/setup.sh

start: ## Start all services with Docker
	@echo "🐳 Starting all services..."
	@docker-compose up -d

stop: ## Stop all services
	@echo "🛑 Stopping all services..."
	@docker-compose down

restart: stop start ## Restart all services

logs: ## Show logs from all services
	@docker-compose logs -f

clean: ## Clean all containers, volumes, and build artifacts
	@echo "🧹 Cleaning up..."
	@docker-compose down -v
	@rm -rf backend/node_modules frontend/node_modules
	@rm -rf backend/dist frontend/.next

test-backend: ## Run backend tests
	@echo "🧪 Running backend tests..."
	@cd backend && npm test

test-frontend: ## Run frontend E2E tests
	@echo "🧪 Running frontend E2E tests..."
	@cd frontend && npm run test:e2e

test: test-backend test-frontend ## Run all tests

build: ## Build all services
	@echo "🔨 Building services..."
	@docker-compose build

dev-backend: ## Start backend in development mode
	@echo "🔧 Starting backend..."
	@cd backend && npm run dev

dev-frontend: ## Start frontend in development mode
	@echo "🔧 Starting frontend..."
	@cd frontend && npm run dev

migrate: ## Run database migrations
	@echo "🗃️  Running migrations..."
	@cd backend && npx prisma migrate deploy

migrate-dev: ## Create new migration
	@echo "🗃️  Creating migration..."
	@cd backend && npx prisma migrate dev

studio: ## Open Prisma Studio
	@echo "📊 Opening Prisma Studio..."
	@cd backend && npm run prisma:studio

install: ## Install dependencies
	@echo "📦 Installing dependencies..."
	@cd backend && npm install
	@cd frontend && npm install

format: ## Format code with Prettier
	@echo "✨ Formatting code..."
	@cd backend && npm run format || true
	@cd frontend && npx prettier --write . || true

lint: ## Lint code
	@echo "🔍 Linting code..."
	@cd backend && npm run lint || true
	@cd frontend && npm run lint || true

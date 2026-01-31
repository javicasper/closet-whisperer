import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { config } from './config.js';
import { storageService } from './services/storage.service.js';
import { garmentRoutes } from './routes/garments.routes.js';
import { outfitRoutes } from './routes/outfits.routes.js';

const fastify = Fastify({
  logger: true,
});

// Register plugins
await fastify.register(cors, {
  origin: true,
});

await fastify.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register routes
await fastify.register(garmentRoutes, { prefix: '/api' });
await fastify.register(outfitRoutes, { prefix: '/api' });

// Initialize storage
await storageService.init();

// Start server
try {
  await fastify.listen({ port: config.PORT, host: '0.0.0.0' });
  console.log(`🚀 Server running on http://localhost:${config.PORT}`);
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

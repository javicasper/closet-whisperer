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

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\n${signal} received, shutting down gracefully...`);
    await fastify.close();
    process.exit(0);
  });
});

async function start() {
  try {
    // Register plugins
    await fastify.register(cors, {
      origin: config.NODE_ENV === 'production' 
        ? ['https://closet.loopylab.app'] 
        : true,
      credentials: true,
    });

    await fastify.register(multipart, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 1,
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
    await fastify.listen({ port: config.PORT, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${config.PORT}`);
    console.log(`📝 Environment: ${config.NODE_ENV}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();

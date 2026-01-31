import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';
import { storageService } from '../services/storage.service.js';
import { aiService } from '../services/ai.service.js';
import { GarmentStatus } from '@prisma/client';

const garmentSchema = z.object({
  type: z.enum(['TOP', 'BOTTOM', 'DRESS', 'OUTERWEAR', 'SHOES', 'ACCESSORY']),
  color: z.string(),
  season: z.array(z.enum(['SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL_SEASON'])),
  occasion: z.array(z.string()),
  description: z.string().optional(),
  brand: z.string().optional(),
});

export async function garmentRoutes(fastify: FastifyInstance) {
  // Upload and create garment with AI analysis
  fastify.post('/garments', async (request, reply) => {
    const data = await request.file();
    
    if (!data) {
      return reply.code(400).send({ error: 'No file uploaded' });
    }

    try {
      const buffer = await data.toBuffer();
      const { url, key } = await storageService.uploadImage(buffer, data.mimetype);

      // Use AI to analyze the garment
      const analysis = await aiService.analyzeGarmentImage(url);

      // Create garment in database
      const garment = await prisma.garment.create({
        data: {
          imageUrl: url,
          type: analysis.type as any,
          color: analysis.color,
          season: analysis.season as any[],
          occasion: analysis.occasion,
          description: analysis.description,
          brand: analysis.brand || undefined,
          status: GarmentStatus.AVAILABLE,
          metadata: { aiAnalysis: analysis as any, storageKey: key },
        },
      });

      return reply.code(201).send(garment);
    } catch (error) {
      console.error('Error creating garment:', error);
      return reply.code(500).send({ error: 'Failed to create garment' });
    }
  });

  // List garments with filters
  fastify.get('/garments', async (request, reply) => {
    const querySchema = z.object({
      type: z.enum(['TOP', 'BOTTOM', 'DRESS', 'OUTERWEAR', 'SHOES', 'ACCESSORY']).optional(),
      color: z.string().optional(),
      season: z.enum(['SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL_SEASON']).optional(),
      occasion: z.string().optional(),
      status: z.enum(['AVAILABLE', 'IN_LAUNDRY', 'UNAVAILABLE']).optional(),
    });

    try {
      const params = querySchema.parse(request.query);
      const where: any = {};

      if (params.type) where.type = params.type;
      if (params.color) where.color = { contains: params.color, mode: 'insensitive' };
      if (params.season) where.season = { has: params.season };
      if (params.occasion) where.occasion = { has: params.occasion };
      if (params.status) where.status = params.status;

      const garments = await prisma.garment.findMany({
        where,
        include: {
          laundryQueue: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      return reply.send(garments);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: error.errors });
      }
      console.error('Error listing garments:', error);
      return reply.code(500).send({ error: 'Failed to list garments' });
    }
  });

  // Get single garment
  fastify.get('/garments/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const garment = await prisma.garment.findUnique({
      where: { id },
      include: {
        laundryQueue: true,
        outfits: {
          include: {
            outfit: true,
          },
        },
      },
    });

    if (!garment) {
      return reply.code(404).send({ error: 'Garment not found' });
    }

    return reply.send(garment);
  });

  // Update garment
  fastify.put('/garments/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const body = garmentSchema.partial().parse(request.body);

      const garment = await prisma.garment.update({
        where: { id },
        data: body,
      });

      return reply.send(garment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: error.errors });
      }
      console.error('Error updating garment:', error);
      return reply.code(500).send({ error: 'Failed to update garment' });
    }
  });

  // Delete garment
  fastify.delete('/garments/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const garment = await prisma.garment.findUnique({ where: { id } });
      if (!garment) {
        return reply.code(404).send({ error: 'Garment not found' });
      }

      // Delete from storage
      const storageKey = (garment.metadata as any)?.storageKey;
      if (storageKey) {
        await storageService.deleteImage(storageKey);
      }

      // Delete from database (cascades to laundryQueue and outfitGarments)
      await prisma.garment.delete({ where: { id } });

      return reply.code(204).send();
    } catch (error) {
      console.error('Error deleting garment:', error);
      return reply.code(500).send({ error: 'Failed to delete garment' });
    }
  });

  // Mark garment as in laundry
  fastify.post('/garments/:id/laundry', async (request, reply) => {
    const { id } = request.params as { id: string };
    const bodySchema = z.object({
      estimatedAvailableAt: z.string().datetime().optional(),
    });

    try {
      const body = bodySchema.parse(request.body);

      // Update garment status
      await prisma.garment.update({
        where: { id },
        data: { status: GarmentStatus.IN_LAUNDRY },
      });

      // Add to laundry queue
      const laundryItem = await prisma.laundryQueue.create({
        data: {
          garmentId: id,
          estimatedAvailableAt: body.estimatedAvailableAt 
            ? new Date(body.estimatedAvailableAt) 
            : undefined,
        },
        include: {
          garment: true,
        },
      });

      return reply.send(laundryItem);
    } catch (error) {
      console.error('Error adding to laundry:', error);
      return reply.code(500).send({ error: 'Failed to add to laundry' });
    }
  });

  // Remove from laundry
  fastify.delete('/garments/:id/laundry', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      // Update garment status
      await prisma.garment.update({
        where: { id },
        data: { status: GarmentStatus.AVAILABLE },
      });

      // Remove from laundry queue
      await prisma.laundryQueue.delete({
        where: { garmentId: id },
      });

      return reply.code(204).send();
    } catch (error) {
      console.error('Error removing from laundry:', error);
      return reply.code(500).send({ error: 'Failed to remove from laundry' });
    }
  });

  // Get laundry queue
  fastify.get('/laundry', async (_request, reply) => {
    const laundryItems = await prisma.laundryQueue.findMany({
      include: {
        garment: true,
      },
      orderBy: { addedAt: 'desc' },
    });

    return reply.send(laundryItems);
  });
}

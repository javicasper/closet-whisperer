import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';
import { aiService } from '../services/ai.service.js';
import { mcpTools } from '../mcp/tools.js';

const generateOutfitSchema = z.object({
  prompt: z.string().min(1),
  occasion: z.string().optional(),
  season: z.enum(['SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL_SEASON']).optional(),
});

const createOutfitSchema = z.object({
  name: z.string().min(1),
  garmentIds: z.array(z.string()).min(1),
  aiSuggestion: z.boolean().optional().default(false),
  prompt: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export async function outfitRoutes(fastify: FastifyInstance) {
  // Generate outfit suggestions using AI
  fastify.post('/outfits/generate', async (request, reply) => {
    try {
      const body = generateOutfitSchema.parse(request.body);

      // Generate outfit using AI with MCP tools
      const result = await aiService.generateOutfitSuggestions(
        body.prompt,
        mcpTools
      );

      // Validate that all suggested garments exist and are available
      const validatedSuggestions = [];
      for (const suggestion of result.suggestions) {
        const garments = await prisma.garment.findMany({
          where: {
            id: { in: suggestion.garmentIds },
            status: 'AVAILABLE',
          },
        });

        if (garments.length === suggestion.garmentIds.length) {
          validatedSuggestions.push({
            ...suggestion,
            garments,
          });
        }
      }

      return reply.send({
        suggestions: validatedSuggestions,
        reasoning: result.reasoning,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: error.errors });
      }
      console.error('Error generating outfit:', error);
      return reply.code(500).send({ error: 'Failed to generate outfit suggestions' });
    }
  });

  // Create/save outfit
  fastify.post('/outfits', async (request, reply) => {
    try {
      const body = createOutfitSchema.parse(request.body);

      // Verify all garments exist
      const garments = await prisma.garment.findMany({
        where: { id: { in: body.garmentIds } },
      });

      if (garments.length !== body.garmentIds.length) {
        return reply.code(400).send({ error: 'Some garments not found' });
      }

      // Create outfit
      const outfit = await prisma.outfit.create({
        data: {
          name: body.name,
          aiSuggestion: body.aiSuggestion,
          prompt: body.prompt,
          metadata: body.metadata || {},
          garments: {
            create: body.garmentIds.map(garmentId => ({
              garmentId,
            })),
          },
        },
        include: {
          garments: {
            include: {
              garment: true,
            },
          },
        },
      });

      return reply.code(201).send(outfit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: error.errors });
      }
      console.error('Error creating outfit:', error);
      return reply.code(500).send({ error: 'Failed to create outfit' });
    }
  });

  // List outfits
  fastify.get('/outfits', async (request, reply) => {
    const outfits = await prisma.outfit.findMany({
      include: {
        garments: {
          include: {
            garment: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reply.send(outfits);
  });

  // Get single outfit
  fastify.get('/outfits/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const outfit = await prisma.outfit.findUnique({
      where: { id },
      include: {
        garments: {
          include: {
            garment: true,
          },
        },
      },
    });

    if (!outfit) {
      return reply.code(404).send({ error: 'Outfit not found' });
    }

    return reply.send(outfit);
  });

  // Delete outfit
  fastify.delete('/outfits/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.outfit.delete({ where: { id } });
      return reply.code(204).send();
    } catch (error) {
      console.error('Error deleting outfit:', error);
      return reply.code(500).send({ error: 'Failed to delete outfit' });
    }
  });
}

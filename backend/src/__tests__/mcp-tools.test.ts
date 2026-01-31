import { describe, it, expect, beforeAll } from 'vitest';
import { MCPTools } from '../mcp/tools.js';
import { GarmentType, GarmentSeason, GarmentStatus } from '@prisma/client';
import { prisma } from '../utils/prisma.js';

describe('MCP Tools', () => {
  const tools = new MCPTools();

  beforeAll(async () => {
    // Clean up test data
    await prisma.garment.deleteMany({});
  });

  it('should search garments by type', async () => {
    // Create test garments
    await prisma.garment.create({
      data: {
        imageUrl: 'http://test.com/shirt.jpg',
        type: GarmentType.TOP,
        color: 'blue',
        season: [GarmentSeason.SPRING],
        occasion: ['casual'],
        status: GarmentStatus.AVAILABLE,
      },
    });

    const results = await tools.searchGarments({ type: GarmentType.TOP });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].type).toBe(GarmentType.TOP);
  });

  it('should get available garments only', async () => {
    await prisma.garment.create({
      data: {
        imageUrl: 'http://test.com/pants.jpg',
        type: GarmentType.BOTTOM,
        color: 'black',
        season: [GarmentSeason.ALL_SEASON],
        occasion: ['casual'],
        status: GarmentStatus.IN_LAUNDRY,
      },
    });

    const available = await tools.getAvailableGarments();
    expect(available.every(g => g.status === undefined || g.status === 'AVAILABLE')).toBe(true);
  });

  it('should search by season', async () => {
    const results = await tools.getGarmentsBySeason(GarmentSeason.SPRING);
    expect(results.length).toBeGreaterThan(0);
  });

  it('should get garment by id', async () => {
    const created = await prisma.garment.create({
      data: {
        imageUrl: 'http://test.com/jacket.jpg',
        type: GarmentType.OUTERWEAR,
        color: 'gray',
        season: [GarmentSeason.WINTER],
        occasion: ['casual'],
        status: GarmentStatus.AVAILABLE,
      },
    });

    const found = await tools.getGarmentById(created.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(created.id);
  });
});

import { prisma } from '../utils/prisma.js';
import { GarmentStatus, GarmentType, GarmentSeason } from '@prisma/client';

export interface SearchGarmentsParams {
  type?: GarmentType;
  color?: string;
  season?: GarmentSeason;
  occasion?: string;
  status?: GarmentStatus;
}

/**
 * MCP Tools for AI to query the wardrobe efficiently
 * These tools allow the AI to search and retrieve garments without loading everything
 */
export class MCPTools {
  /**
   * Search garments with filters
   */
  async searchGarments(params: SearchGarmentsParams) {
    const where: any = {};

    if (params.type) where.type = params.type;
    if (params.color) where.color = { contains: params.color, mode: 'insensitive' };
    if (params.season) where.season = { has: params.season };
    if (params.occasion) where.occasion = { has: params.occasion };
    if (params.status) {
      where.status = params.status;
    } else {
      where.status = GarmentStatus.AVAILABLE;
    }

    const garments = await prisma.garment.findMany({
      where,
      select: {
        id: true,
        type: true,
        color: true,
        season: true,
        occasion: true,
        status: true,
        description: true,
        imageUrl: true,
      },
    });

    return garments;
  }

  /**
   * Get a specific garment by ID
   */
  async getGarmentById(id: string) {
    const garment = await prisma.garment.findUnique({
      where: { id },
      include: {
        laundryQueue: true,
      },
    });

    return garment;
  }

  /**
   * Get all available garments (not in laundry)
   */
  async getAvailableGarments() {
    const garments = await prisma.garment.findMany({
      where: {
        status: GarmentStatus.AVAILABLE,
      },
      select: {
        id: true,
        type: true,
        color: true,
        season: true,
        occasion: true,
        description: true,
        imageUrl: true,
        brand: true,
      },
    });

    return garments;
  }

  /**
   * Get garments by type (useful for building outfits)
   */
  async getGarmentsByType(type: GarmentType) {
    return this.searchGarments({ type, status: GarmentStatus.AVAILABLE });
  }

  /**
   * Get garments suitable for a specific occasion
   */
  async getGarmentsByOccasion(occasion: string) {
    return this.searchGarments({ occasion, status: GarmentStatus.AVAILABLE });
  }

  /**
   * Get garments suitable for a specific season
   */
  async getGarmentsBySeason(season: GarmentSeason) {
    const garments = await prisma.garment.findMany({
      where: {
        status: GarmentStatus.AVAILABLE,
        OR: [
          { season: { has: season } },
          { season: { has: GarmentSeason.ALL_SEASON } },
        ],
      },
      select: {
        id: true,
        type: true,
        color: true,
        season: true,
        occasion: true,
        description: true,
        imageUrl: true,
      },
    });

    return garments;
  }
}

export const mcpTools = new MCPTools();

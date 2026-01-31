export type GarmentType = 'TOP' | 'BOTTOM' | 'DRESS' | 'OUTERWEAR' | 'SHOES' | 'ACCESSORY';
export type GarmentSeason = 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER' | 'ALL_SEASON';
export type GarmentStatus = 'AVAILABLE' | 'IN_LAUNDRY' | 'UNAVAILABLE';

export interface Garment {
  id: string;
  imageUrl: string;
  type: GarmentType;
  color: string;
  season: GarmentSeason[];
  occasion: string[];
  status: GarmentStatus;
  description?: string;
  brand?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  laundryQueue?: LaundryQueue;
}

export interface LaundryQueue {
  id: string;
  garmentId: string;
  addedAt: string;
  estimatedAvailableAt?: string;
}

export interface Outfit {
  id: string;
  name: string;
  aiSuggestion: boolean;
  prompt?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  garments: OutfitGarment[];
}

export interface OutfitGarment {
  id: string;
  outfitId: string;
  garmentId: string;
  garment: Garment;
}

export interface OutfitSuggestion {
  name: string;
  garmentIds: string[];
  reasoning: string;
  garments?: Garment[];
}

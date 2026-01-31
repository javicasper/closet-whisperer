export type GarmentType = 'TOP' | 'BOTTOM' | 'DRESS' | 'OUTERWEAR' | 'SHOES' | 'ACCESSORY';
export type GarmentSeason = 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER' | 'ALL_SEASON';
export type GarmentStatus = 'AVAILABLE' | 'IN_LAUNDRY' | 'UNAVAILABLE';

export interface Garment {
  id: string;
  image_url: string;
  type: GarmentType;
  color?: string;
  season?: GarmentSeason;
  occasion?: string;
  status: GarmentStatus;
  description?: string;
  brand?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  laundry_queue?: LaundryQueue;
}

export interface LaundryQueue {
  id: string;
  garment_id: string;
  added_at: string;
  estimated_available_at?: string;
}

export interface Outfit {
  id: string;
  name: string;
  ai_suggestion: boolean;
  prompt?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  garment_ids: string[];
  garments?: OutfitGarment[];
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

import axios from 'axios';
import { Garment, Outfit, OutfitSuggestion } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

// Garments
export const uploadGarment = async (file: File): Promise<Garment> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post('/garments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getGarments = async (filters?: {
  type?: string;
  color?: string;
  season?: string;
  occasion?: string;
  status?: string;
}): Promise<Garment[]> => {
  const { data } = await api.get('/garments', { params: filters });
  return data;
};

export const getGarment = async (id: string): Promise<Garment> => {
  const { data } = await api.get(`/garments/${id}`);
  return data;
};

export const updateGarment = async (id: string, updates: Partial<Garment>): Promise<Garment> => {
  const { data } = await api.put(`/garments/${id}`, updates);
  return data;
};

export const deleteGarment = async (id: string): Promise<void> => {
  await api.delete(`/garments/${id}`);
};

export const addToLaundry = async (id: string, estimatedAvailableAt?: string): Promise<void> => {
  await api.post(`/garments/${id}/laundry`, { estimatedAvailableAt });
};

export const removeFromLaundry = async (id: string): Promise<void> => {
  await api.delete(`/garments/${id}/laundry`);
};

export const getLaundryQueue = async () => {
  const { data } = await api.get('/laundry');
  return data;
};

// Outfits
export const generateOutfit = async (
  prompt: string,
  filters?: { occasion?: string; season?: string }
): Promise<{ suggestions: OutfitSuggestion[]; reasoning: string }> => {
  const { data } = await api.post('/outfits/generate', { prompt, ...filters });
  return data;
};

export const createOutfit = async (outfit: {
  name: string;
  garmentIds: string[];
  aiSuggestion?: boolean;
  prompt?: string;
  metadata?: any;
}): Promise<Outfit> => {
  const { data } = await api.post('/outfits', outfit);
  return data;
};

export const getOutfits = async (): Promise<Outfit[]> => {
  const { data } = await api.get('/outfits');
  return data;
};

export const getOutfit = async (id: string): Promise<Outfit> => {
  const { data } = await api.get(`/outfits/${id}`);
  return data;
};

export const deleteOutfit = async (id: string): Promise<void> => {
  await api.delete(`/outfits/${id}`);
};

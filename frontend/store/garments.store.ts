import { create } from 'zustand';
import { Garment } from '@/types';

interface GarmentStore {
  garments: Garment[];
  selectedGarments: string[];
  filters: {
    type?: string;
    color?: string;
    season?: string;
    occasion?: string;
    status?: string;
  };
  setGarments: (garments: Garment[]) => void;
  addGarment: (garment: Garment) => void;
  removeGarment: (id: string) => void;
  updateGarment: (id: string, updates: Partial<Garment>) => void;
  toggleSelectGarment: (id: string) => void;
  clearSelection: () => void;
  setFilters: (filters: any) => void;
  clearFilters: () => void;
}

export const useGarmentStore = create<GarmentStore>((set) => ({
  garments: [],
  selectedGarments: [],
  filters: {},
  
  setGarments: (garments) => set({ garments }),
  
  addGarment: (garment) =>
    set((state) => ({ garments: [garment, ...state.garments] })),
  
  removeGarment: (id) =>
    set((state) => ({
      garments: state.garments.filter((g) => g.id !== id),
      selectedGarments: state.selectedGarments.filter((gid) => gid !== id),
    })),
  
  updateGarment: (id, updates) =>
    set((state) => ({
      garments: state.garments.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
    })),
  
  toggleSelectGarment: (id) =>
    set((state) => ({
      selectedGarments: state.selectedGarments.includes(id)
        ? state.selectedGarments.filter((gid) => gid !== id)
        : [...state.selectedGarments, id],
    })),
  
  clearSelection: () => set({ selectedGarments: [] }),
  
  setFilters: (filters) => set({ filters }),
  
  clearFilters: () => set({ filters: {} }),
}));

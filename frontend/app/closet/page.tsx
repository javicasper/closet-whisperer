'use client';

import { useEffect, useState } from 'react';
import { getGarments, deleteGarment, addToLaundry } from '@/lib/api';
import { useGarmentStore } from '@/store/garments.store';
import GarmentCard from '@/components/GarmentCard';
import UploadGarment from '@/components/UploadGarment';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';

export default function ClosetPage() {
  const { garments, setGarments, removeGarment, updateGarment, filters, setFilters } = useGarmentStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGarments();
  }, [filters]);

  const loadGarments = async () => {
    setLoading(true);
    try {
      const response = await getGarments(filters);
      // Handle new pagination response format
      const data = Array.isArray(response) ? response : response.data || [];
      setGarments(data);
    } catch (error) {
      console.error('Load error:', error);
      toast.error('Failed to load garments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this garment? This action cannot be undone.')) return;
    
    try {
      await deleteGarment(id);
      removeGarment(id);
      toast.success('Garment deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete garment');
    }
  };

  const handleLaundry = async (id: string) => {
    try {
      await addToLaundry(id);
      updateGarment(id, { status: 'IN_LAUNDRY' });
      toast.success('Added to laundry! 🧺');
    } catch (error) {
      console.error('Laundry error:', error);
      toast.error('Failed to add to laundry');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Closet</h1>
        <Button onClick={loadGarments}>Refresh</Button>
      </div>

      <UploadGarment />

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <select
            value={filters.type || ''}
            onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
            className="border rounded-lg p-2"
          >
            <option value="">All Types</option>
            <option value="TOP">Tops</option>
            <option value="BOTTOM">Bottoms</option>
            <option value="DRESS">Dresses</option>
            <option value="OUTERWEAR">Outerwear</option>
            <option value="SHOES">Shoes</option>
            <option value="ACCESSORY">Accessories</option>
          </select>

          <select
            value={filters.season || ''}
            onChange={(e) => setFilters({ ...filters, season: e.target.value || undefined })}
            className="border rounded-lg p-2"
          >
            <option value="">All Seasons</option>
            <option value="SPRING">Spring</option>
            <option value="SUMMER">Summer</option>
            <option value="FALL">Fall</option>
            <option value="WINTER">Winter</option>
            <option value="ALL_SEASON">All Season</option>
          </select>

          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
            className="border rounded-lg p-2"
          >
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="IN_LAUNDRY">In Laundry</option>
            <option value="UNAVAILABLE">Unavailable</option>
          </select>

          <input
            type="text"
            placeholder="Color..."
            value={filters.color || ''}
            onChange={(e) => setFilters({ ...filters, color: e.target.value || undefined })}
            className="border rounded-lg p-2"
          />

          <Button variant="secondary" onClick={() => setFilters({})}>
            Clear Filters
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading garments...</p>
        </div>
      ) : garments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No garments found. Upload some clothes!</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">{garments.length} garments</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {garments.map((garment) => (
              <GarmentCard
                key={garment.id}
                garment={garment}
                onDelete={handleDelete}
                onLaundry={handleLaundry}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

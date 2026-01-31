'use client';

import { useEffect, useState } from 'react';
import { getOutfits, deleteOutfit } from '@/lib/api';
import { Outfit } from '@/types';
import GarmentCard from '@/components/GarmentCard';
import { Button } from '@/components/ui/button';

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOutfits();
  }, []);

  const loadOutfits = async () => {
    setLoading(true);
    try {
      const data = await getOutfits();
      setOutfits(data);
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this outfit?')) return;

    try {
      await deleteOutfit(id);
      setOutfits(outfits.filter((o) => o.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete outfit');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Outfits</h1>
        <Button onClick={loadOutfits}>Refresh</Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading outfits...</p>
        </div>
      ) : outfits.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No saved outfits yet.</p>
          <p className="text-gray-400 mt-2">
            Use the AI Builder to create your first outfit!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {outfits.map((outfit) => (
            <div key={outfit.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{outfit.name}</h2>
                  {outfit.aiSuggestion && (
                    <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      ✨ AI Suggested
                    </span>
                  )}
                  {outfit.prompt && (
                    <p className="text-sm text-gray-600 mt-2">
                      Prompt: {outfit.prompt}
                    </p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(outfit.id)}
                >
                  Delete
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {outfit.garments.map((og) => (
                  <GarmentCard key={og.id} garment={og.garment} />
                ))}
              </div>

              {outfit.metadata?.reasoning && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">AI Reasoning:</span>{' '}
                    {outfit.metadata.reasoning}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

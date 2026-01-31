'use client';

import { useEffect, useState } from 'react';
import { getLaundryQueue, removeFromLaundry } from '@/lib/api';
import GarmentCard from '@/components/GarmentCard';
import { Button } from '@/components/ui/button';

export default function LaundryPage() {
  const [laundryItems, setLaundryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLaundry();
  }, []);

  const loadLaundry = async () => {
    setLoading(true);
    try {
      const data = await getLaundryQueue();
      setLaundryItems(data);
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (garmentId: string) => {
    try {
      await removeFromLaundry(garmentId);
      setLaundryItems(laundryItems.filter((item) => item.garmentId !== garmentId));
      alert('Removed from laundry!');
    } catch (error) {
      console.error('Remove error:', error);
      alert('Failed to remove from laundry');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🧺 Laundry Queue</h1>
        <Button onClick={loadLaundry}>Refresh</Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading laundry...</p>
        </div>
      ) : laundryItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No items in laundry!</p>
        </div>
      ) : (
        <>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              {laundryItems.length} item(s) in laundry. These items won't appear
              in outfit suggestions until you mark them as available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {laundryItems.map((item) => (
              <div key={item.id} className="relative">
                <GarmentCard garment={item.garment} />
                <Button
                  size="sm"
                  className="absolute top-2 left-2"
                  onClick={() => handleRemove(item.garmentId)}
                >
                  Mark Clean
                </Button>
                {item.estimatedAvailableAt && (
                  <div className="mt-2 text-xs text-gray-600 text-center">
                    Available: {new Date(item.estimatedAvailableAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

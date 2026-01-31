'use client';

import { useEffect } from 'react';
import { getGarments } from '@/lib/api';
import { useGarmentStore } from '@/store/garments.store';
import OutfitBuilder from '@/components/OutfitBuilder';

export default function BuilderPage() {
  const setGarments = useGarmentStore((s) => s.setGarments);

  useEffect(() => {
    loadGarments();
  }, []);

  const loadGarments = async () => {
    try {
      const data = await getGarments({ status: 'AVAILABLE' });
      setGarments(data);
    } catch (error) {
      console.error('Load error:', error);
    }
  };

  return (
    <div>
      <OutfitBuilder />
    </div>
  );
}

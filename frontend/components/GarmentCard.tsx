'use client';

import Image from 'next/image';
import { Garment } from '@/types';
import { useGarmentStore } from '@/store/garments.store';

interface GarmentCardProps {
  garment: Garment;
  selectable?: boolean;
  onDelete?: (id: string) => void;
  onLaundry?: (id: string) => void;
}

export default function GarmentCard({
  garment,
  selectable = false,
  onDelete,
  onLaundry,
}: GarmentCardProps) {
  const { selectedGarments, toggleSelectGarment } = useGarmentStore();
  const isSelected = selectedGarments.includes(garment.id);

  return (
    <div
      className={`relative border rounded-lg overflow-hidden transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${garment.status === 'IN_LAUNDRY' ? 'opacity-50' : ''}`}
      onClick={() => selectable && toggleSelectGarment(garment.id)}
    >
      <div className="relative h-64 w-full bg-gray-100">
        <Image
          src={garment.imageUrl}
          alt={garment.description || garment.type}
          fill
          className="object-cover"
          unoptimized
        />
        {garment.status === 'IN_LAUNDRY' && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
            In Laundry
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg capitalize">
              {garment.type.toLowerCase()}
            </h3>
            <p className="text-sm text-gray-600 capitalize">{garment.color}</p>
          </div>
          {garment.brand && (
            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
              {garment.brand}
            </span>
          )}
        </div>
        
        {garment.description && (
          <p className="text-sm text-gray-700 mb-2 line-clamp-2">
            {garment.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-1 mb-3">
          {garment.season.map((s) => (
            <span key={s} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {s}
            </span>
          ))}
          {garment.occasion.map((o) => (
            <span key={o} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {o}
            </span>
          ))}
        </div>
        
        <div className="flex gap-2">
          {onLaundry && garment.status === 'AVAILABLE' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLaundry(garment.id);
              }}
              className="flex-1 text-xs bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              To Laundry
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(garment.id);
              }}
              className="flex-1 text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

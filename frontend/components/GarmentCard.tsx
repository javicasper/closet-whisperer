'use client';

import Image from 'next/image';
import { useState } from 'react';
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
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (selectable) {
      toggleSelectGarment(garment.id);
    }
  };

  const altText = garment.description 
    ? `${garment.color} ${garment.type.toLowerCase()} - ${garment.description}`
    : `${garment.color} ${garment.type.toLowerCase()}`;

  return (
    <div
      className={`relative border rounded-lg overflow-hidden transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${garment.status === 'IN_LAUNDRY' ? 'opacity-50' : ''} ${
        selectable ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
      role={selectable ? 'button' : undefined}
      tabIndex={selectable ? 0 : undefined}
      onKeyDown={(e) => {
        if (selectable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={selectable ? `Select ${altText}` : undefined}
    >
      <div className="relative h-64 w-full bg-gray-100">
        {imageError ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Image unavailable</p>
            </div>
          </div>
        ) : (
          <Image
            src={garment.imageUrl}
            alt={altText}
            fill
            className="object-cover"
            unoptimized
            onError={() => setImageError(true)}
          />
        )}
        {garment.status === 'IN_LAUNDRY' && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
            🧺 In Laundry
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

'use client';

import { Tile, Tag, OverflowMenu, OverflowMenuItem } from '@carbon/react';
import { TrashCan } from '@carbon/icons-react';
import { Garment } from '@/types';
import Image from 'next/image';

interface GarmentTileProps {
  garment: Garment;
  onDelete?: (id: string) => void;
  onLaundry?: (id: string) => void;
  onClick?: (garment: Garment) => void;
  selected?: boolean;
}

export default function GarmentTile({
  garment,
  onDelete,
  onLaundry,
  onClick,
  selected = false,
}: GarmentTileProps) {
  const isAvailable = garment.status === 'AVAILABLE';

  return (
    <Tile
      className="relative cursor-pointer hover:shadow-lg transition-shadow"
      style={{
        padding: 0,
        overflow: 'hidden',
        border: selected ? '2px solid var(--cds-border-interactive)' : undefined,
        opacity: !isAvailable ? 0.6 : 1,
      }}
      onClick={() => onClick?.(garment)}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '100%', background: 'var(--cds-layer-01)' }}>
        {garment.image_url ? (
          <Image
            src={garment.image_url}
            alt={garment.type}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cds-text-secondary)',
          }}>
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1rem' }}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              {garment.type}
            </h4>
            {garment.color && (
              <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
                {garment.color}
              </p>
            )}
          </div>
          {(onDelete || onLaundry) && (
            <OverflowMenu size="sm" flipped>
              {onLaundry && isAvailable && (
                <OverflowMenuItem
                  itemText="Add to Laundry"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLaundry(garment.id);
                  }}
                />
              )}
              {onDelete && (
                <OverflowMenuItem
                  itemText="Delete"
                  isDelete
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(garment.id);
                  }}
                />
              )}
            </OverflowMenu>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {garment.season && (
            <Tag type="blue" size="sm">
              {garment.season}
            </Tag>
          )}
          {garment.occasion && (
            <Tag type="purple" size="sm">
              {garment.occasion}
            </Tag>
          )}
          {garment.status && garment.status !== 'AVAILABLE' && (
            <Tag type="red" size="sm">
              {garment.status.replace('_', ' ')}
            </Tag>
          )}
        </div>
      </div>
    </Tile>
  );
}

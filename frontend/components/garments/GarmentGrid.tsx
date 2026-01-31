'use client';

import { Grid, Column } from '@carbon/react';
import GarmentTile from './GarmentTile';
import { Garment } from '@/types';

interface GarmentGridProps {
  garments: Garment[];
  onDelete?: (id: string) => void;
  onLaundry?: (id: string) => void;
  onClick?: (garment: Garment) => void;
  selectedIds?: string[];
}

export default function GarmentGrid({
  garments,
  onDelete,
  onLaundry,
  onClick,
  selectedIds = [],
}: GarmentGridProps) {
  return (
    <Grid fullWidth narrow>
      {garments.map((garment) => (
        <Column key={garment.id} lg={4} md={4} sm={4} className="mb-4">
          <GarmentTile
            garment={garment}
            onDelete={onDelete}
            onLaundry={onLaundry}
            onClick={onClick}
            selected={selectedIds.includes(garment.id)}
          />
        </Column>
      ))}
    </Grid>
  );
}

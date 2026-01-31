'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Select,
  SelectItem,
  TextInput,
  Tile,
  InlineNotification,
  Loading,
  Grid,
  Column,
} from '@carbon/react';
import { Upload, Renew, Filter } from '@carbon/icons-react';
import { getGarments, deleteGarment, addToLaundry } from '@/lib/api';
import { useGarmentStore } from '@/store/garments.store';
import GarmentGrid from '@/components/garments/GarmentGrid';
import UploadModal from '@/components/garments/UploadModal';

export default function ClosetPage() {
  const { garments, setGarments, removeGarment, updateGarment, filters, setFilters } = useGarmentStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  useEffect(() => {
    loadGarments();
  }, [filters]);

  const loadGarments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getGarments(filters);
      const data = Array.isArray(response) ? response : (response as any).data || [];
      setGarments(data);
    } catch (error) {
      console.error('Load error:', error);
      setError('Failed to load garments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this garment? This action cannot be undone.')) return;

    try {
      await deleteGarment(id);
      removeGarment(id);
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete garment.');
    }
  };

  const handleLaundry = async (id: string) => {
    try {
      await addToLaundry(id);
      updateGarment(id, { status: 'IN_LAUNDRY' });
    } catch (error) {
      console.error('Laundry error:', error);
      setError('Failed to add to laundry.');
    }
  };

  return (
    <div>
      {/* Header */}
      <Grid fullWidth narrow className="mb-6">
        <Column lg={12} md={6} sm={4}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            My Closet
          </h1>
          <p style={{ color: 'var(--cds-text-secondary)' }}>
            Manage your wardrobe and keep track of your garments
          </p>
        </Column>
        <Column lg={4} md={2} sm={4} className="flex items-end justify-end">
          <div className="flex gap-2">
            <Button
              kind="secondary"
              renderIcon={Renew}
              onClick={loadGarments}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              renderIcon={Upload}
              onClick={() => setUploadModalOpen(true)}
            >
              Upload Garment
            </Button>
          </div>
        </Column>
      </Grid>

      {/* Error Notification */}
      {error && (
        <Grid fullWidth narrow className="mb-4">
          <Column lg={16} md={8} sm={4}>
            <InlineNotification
              kind="error"
              title="Error"
              subtitle={error}
              onCloseButtonClick={() => setError(null)}
            />
          </Column>
        </Grid>
      )}

      {/* Filters */}
      <Grid fullWidth narrow className="mb-6">
        <Column lg={16} md={8} sm={4}>
          <Tile>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
              <Filter style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Filters
            </h2>
            <Grid fullWidth narrow>
              <Column lg={3} md={4} sm={4} className="mb-4">
                <Select
                  id="type-filter"
                  labelText="Type"
                  value={filters.type || ''}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
                >
                  <SelectItem value="" text="All Types" />
                  <SelectItem value="TOP" text="Tops" />
                  <SelectItem value="BOTTOM" text="Bottoms" />
                  <SelectItem value="DRESS" text="Dresses" />
                  <SelectItem value="OUTERWEAR" text="Outerwear" />
                  <SelectItem value="SHOES" text="Shoes" />
                  <SelectItem value="ACCESSORY" text="Accessories" />
                </Select>
              </Column>

              <Column lg={3} md={4} sm={4} className="mb-4">
                <Select
                  id="season-filter"
                  labelText="Season"
                  value={filters.season || ''}
                  onChange={(e) => setFilters({ ...filters, season: e.target.value || undefined })}
                >
                  <SelectItem value="" text="All Seasons" />
                  <SelectItem value="SPRING" text="Spring" />
                  <SelectItem value="SUMMER" text="Summer" />
                  <SelectItem value="FALL" text="Fall" />
                  <SelectItem value="WINTER" text="Winter" />
                  <SelectItem value="ALL_SEASON" text="All Season" />
                </Select>
              </Column>

              <Column lg={3} md={4} sm={4} className="mb-4">
                <Select
                  id="status-filter"
                  labelText="Status"
                  value={filters.status || ''}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                >
                  <SelectItem value="" text="All Status" />
                  <SelectItem value="AVAILABLE" text="Available" />
                  <SelectItem value="IN_LAUNDRY" text="In Laundry" />
                  <SelectItem value="UNAVAILABLE" text="Unavailable" />
                </Select>
              </Column>

              <Column lg={3} md={4} sm={4} className="mb-4">
                <TextInput
                  id="color-filter"
                  labelText="Color"
                  placeholder="e.g., blue, red..."
                  value={filters.color || ''}
                  onChange={(e) => setFilters({ ...filters, color: e.target.value || undefined })}
                />
              </Column>

              <Column lg={4} md={4} sm={4} className="mb-4 flex items-end">
                <Button
                  kind="secondary"
                  onClick={() => setFilters({})}
                >
                  Clear All Filters
                </Button>
              </Column>
            </Grid>
          </Tile>
        </Column>
      </Grid>

      {/* Results */}
      <Grid fullWidth narrow className="mb-4">
        <Column lg={16} md={8} sm={4}>
          <p style={{ color: 'var(--cds-text-secondary)' }}>
            {loading ? 'Loading...' : `${garments.length} garment${garments.length !== 1 ? 's' : ''} found`}
          </p>
        </Column>
      </Grid>

      {/* Garments Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading description="Loading garments..." withOverlay={false} />
        </div>
      ) : garments.length === 0 ? (
        <Grid fullWidth narrow>
          <Column lg={16} md={8} sm={4}>
            <Tile className="text-center py-12">
              <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem' }}>
                No garments found. Upload some clothes to get started!
              </p>
              <Button onClick={() => setUploadModalOpen(true)} renderIcon={Upload}>
                Upload Your First Garment
              </Button>
            </Tile>
          </Column>
        </Grid>
      ) : (
        <GarmentGrid
          garments={garments}
          onDelete={handleDelete}
          onLaundry={handleLaundry}
        />
      )}

      {/* Upload Modal */}
      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={(garment) => {
          setGarments([...garments, garment]);
        }}
      />
    </div>
  );
}

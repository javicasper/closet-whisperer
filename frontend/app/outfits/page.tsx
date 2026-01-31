'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Tile,
  InlineNotification,
  Loading,
  Grid,
  Column,
  Tag,
  Modal,
} from '@carbon/react';
import { Renew, TrashCan, View } from '@carbon/icons-react';
import { getOutfits, deleteOutfit, getGarment } from '@/lib/api';
import { Outfit, Garment } from '@/types';
import Link from 'next/link';

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [outfitGarments, setOutfitGarments] = useState<Garment[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    loadOutfits();
  }, []);

  const loadOutfits = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOutfits();
      setOutfits(Array.isArray(data) ? data : (data as any).outfits || []);
    } catch (error) {
      console.error('Load error:', error);
      setError('Failed to load outfits.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this outfit?')) return;

    try {
      await deleteOutfit(id);
      setOutfits(outfits.filter((o) => o.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete outfit.');
    }
  };

  const handleViewDetails = async (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    setViewModalOpen(true);

    // Load garment details
    try {
      const garmentPromises = (outfit.garment_ids || []).map((id) => getGarment(id));
      const garments = await Promise.all(garmentPromises);
      setOutfitGarments(garments);
    } catch (error) {
      console.error('Failed to load garment details:', error);
    }
  };

  return (
    <div>
      {/* Header */}
      <Grid fullWidth narrow className="mb-6">
        <Column lg={12} md={6} sm={4}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            My Outfits
          </h1>
          <p style={{ color: 'var(--cds-text-secondary)' }}>
            Your saved outfit combinations
          </p>
        </Column>
        <Column lg={4} md={2} sm={4} className="flex items-end justify-end gap-2">
          <Button
            kind="secondary"
            renderIcon={Renew}
            onClick={loadOutfits}
            disabled={loading}
          >
            Refresh
          </Button>
          <Link href="/builder">
            <Button>Create New Outfit</Button>
          </Link>
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

      {/* Stats */}
      <Grid fullWidth narrow className="mb-6">
        <Column lg={16} md={8} sm={4}>
          <Tag type="blue" size="md">
            {outfits.length} outfit{outfits.length !== 1 ? 's' : ''} saved
          </Tag>
        </Column>
      </Grid>

      {/* Outfits Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading description="Loading outfits..." withOverlay={false} />
        </div>
      ) : outfits.length === 0 ? (
        <Grid fullWidth narrow>
          <Column lg={16} md={8} sm={4}>
            <Tile className="text-center py-12">
              <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '1rem', fontSize: '1.125rem' }}>
                No outfits saved yet
              </p>
              <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '2rem' }}>
                Create your first outfit using the builder!
              </p>
              <Link href="/builder">
                <Button>Go to Builder</Button>
              </Link>
            </Tile>
          </Column>
        </Grid>
      ) : (
        <Grid fullWidth narrow>
          {outfits.map((outfit) => (
            <Column key={outfit.id} lg={4} md={4} sm={4} className="mb-4">
              <Tile className="p-4">
                <div className="mb-4">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {outfit.name}
                  </h3>
                  <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                    {outfit.garment_ids?.length || 0} item{outfit.garment_ids?.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {outfit.ai_suggestion && (
                    <Tag type="purple" size="sm">
                      AI Suggested
                    </Tag>
                  )}
                  {outfit.created_at && (
                    <Tag type="gray" size="sm">
                      {new Date(outfit.created_at).toLocaleDateString()}
                    </Tag>
                  )}
                </div>

                {outfit.prompt && (
                  <p
                    style={{
                      color: 'var(--cds-text-secondary)',
                      fontSize: '0.875rem',
                      fontStyle: 'italic',
                      marginBottom: '1rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    "{outfit.prompt}"
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    kind="tertiary"
                    renderIcon={View}
                    onClick={() => handleViewDetails(outfit)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    kind="danger--tertiary"
                    renderIcon={TrashCan}
                    onClick={() => handleDelete(outfit.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Tile>
            </Column>
          ))}
        </Grid>
      )}

      {/* View Details Modal */}
      <Modal
        open={viewModalOpen}
        onRequestClose={() => setViewModalOpen(false)}
        modalHeading={selectedOutfit?.name || 'Outfit Details'}
        passiveModal
      >
        {selectedOutfit && (
          <div>
            <div className="mb-4">
              <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>
                <strong>Created:</strong>{' '}
                {selectedOutfit.created_at
                  ? new Date(selectedOutfit.created_at).toLocaleString()
                  : 'Unknown'}
              </p>
              {selectedOutfit.prompt && (
                <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>
                  <strong>Prompt:</strong> {selectedOutfit.prompt}
                </p>
              )}
              {selectedOutfit.ai_suggestion && (
                <Tag type="purple" size="sm">
                  AI Suggested
                </Tag>
              )}
            </div>

            <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>
              Garments ({selectedOutfit.garment_ids?.length || 0}):
            </h4>

            {outfitGarments.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
                {outfitGarments.map((garment) => (
                  <div key={garment.id} style={{ textAlign: 'center' }}>
                    {garment.image_url && (
                      <img
                        src={garment.image_url}
                        alt={garment.type}
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          marginBottom: '0.25rem',
                        }}
                      />
                    )}
                    <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>
                      {garment.type}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <Loading description="Loading garments..." withOverlay={false} small />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

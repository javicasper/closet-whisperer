'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  TextArea,
  Tile,
  InlineNotification,
  Loading,
  Grid,
  Column,
  Tag,
  Modal,
  TextInput,
} from '@carbon/react';
import { WatsonHealth3DCursor, Save, Renew } from '@carbon/icons-react';
import { getGarments, generateOutfit, createOutfit } from '@/lib/api';
import { Garment, OutfitSuggestion } from '@/types';
import GarmentGrid from '@/components/garments/GarmentGrid';

export default function BuilderPage() {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [reasoning, setReasoning] = useState('');
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [outfitName, setOutfitName] = useState('');

  useEffect(() => {
    loadGarments();
  }, []);

  const loadGarments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getGarments({ status: 'AVAILABLE' });
      const data = Array.isArray(response) ? response : (response as any).data || [];
      setGarments(data);
    } catch (error) {
      console.error('Load error:', error);
      setError('Failed to load garments.');
    } finally {
      setLoading(false);
    }
  };

  const handleGarmentClick = (garment: Garment) => {
    setSelectedIds((prev) =>
      prev.includes(garment.id)
        ? prev.filter((id) => id !== garment.id)
        : [...prev, garment.id]
    );
  };

  const handleGenerateAI = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for AI outfit generation.');
      return;
    }

    setGenerating(true);
    setError(null);
    setSuggestions([]);
    setReasoning('');

    try {
      const result = await generateOutfit(prompt);
      setSuggestions(result.suggestions || []);
      setReasoning(result.reasoning || '');
      
      // Auto-select first suggestion if available
      if (result.suggestions && result.suggestions.length > 0) {
        const firstSuggestion = result.suggestions[0];
        setSelectedIds(firstSuggestion.garmentIds);
      }
    } catch (error: any) {
      console.error('Generate error:', error);
      setError(error.response?.data?.message || 'Failed to generate outfit. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveOutfit = async () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one garment.');
      return;
    }

    if (!outfitName.trim()) {
      setError('Please enter an outfit name.');
      return;
    }

    try {
      await createOutfit({
        name: outfitName,
        garmentIds: selectedIds,
        aiSuggestion: suggestions.length > 0,
        prompt: prompt || undefined,
      });

      setSaveModalOpen(false);
      setOutfitName('');
      setSelectedIds([]);
      setPrompt('');
      setSuggestions([]);
      setReasoning('');
      setError(null);

      // Show success (you could add a success notification here)
      alert('Outfit saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      setError('Failed to save outfit.');
    }
  };

  return (
    <div>
      {/* Header */}
      <Grid fullWidth narrow className="mb-6">
        <Column lg={16} md={8} sm={4}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Outfit Builder
          </h1>
          <p style={{ color: 'var(--cds-text-secondary)' }}>
            Create custom outfits or let AI suggest combinations for you
          </p>
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

      {/* AI Generation Section */}
      <Grid fullWidth narrow className="mb-6">
        <Column lg={16} md={8} sm={4}>
          <Tile>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
              <WatsonHealth3DCursor style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              AI Outfit Generator
            </h2>
            <TextArea
              id="ai-prompt"
              labelText="Describe your occasion or style"
              placeholder="e.g., 'Casual outfit for a summer picnic' or 'Professional look for a business meeting'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              disabled={generating}
            />
            <div className="flex gap-2 mt-4">
              <Button
                renderIcon={WatsonHealth3DCursor}
                onClick={handleGenerateAI}
                disabled={generating || !prompt.trim()}
              >
                {generating ? 'Generating...' : 'Generate with AI'}
              </Button>
              <Button
                kind="secondary"
                onClick={() => {
                  setPrompt('');
                  setSuggestions([]);
                  setReasoning('');
                }}
                disabled={generating}
              >
                Clear
              </Button>
            </div>

            {generating && (
              <div className="mt-4">
                <Loading description="AI is analyzing your wardrobe..." withOverlay={false} small />
              </div>
            )}

            {reasoning && (
              <div className="mt-4 p-4" style={{ background: 'var(--cds-layer-02)', borderRadius: '4px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  AI Reasoning:
                </h3>
                <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                  {reasoning}
                </p>
              </div>
            )}
          </Tile>
        </Column>
      </Grid>

      {/* Selected Garments Summary */}
      <Grid fullWidth narrow className="mb-4">
        <Column lg={12} md={6} sm={4}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Tag type={selectedIds.length > 0 ? 'blue' : 'gray'} size="md">
              {selectedIds.length} garment{selectedIds.length !== 1 ? 's' : ''} selected
            </Tag>
          </div>
        </Column>
        <Column lg={4} md={2} sm={4} className="flex items-center justify-end gap-2">
          <Button
            kind="secondary"
            renderIcon={Renew}
            onClick={() => setSelectedIds([])}
            disabled={selectedIds.length === 0}
            size="sm"
          >
            Clear Selection
          </Button>
          <Button
            renderIcon={Save}
            onClick={() => setSaveModalOpen(true)}
            disabled={selectedIds.length === 0}
            size="sm"
          >
            Save Outfit
          </Button>
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
              <p style={{ color: 'var(--cds-text-secondary)' }}>
                No available garments found. Upload some clothes first!
              </p>
            </Tile>
          </Column>
        </Grid>
      ) : (
        <GarmentGrid
          garments={garments}
          onClick={handleGarmentClick}
          selectedIds={selectedIds}
        />
      )}

      {/* Save Outfit Modal */}
      <Modal
        open={saveModalOpen}
        onRequestClose={() => setSaveModalOpen(false)}
        modalHeading="Save Outfit"
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        onRequestSubmit={handleSaveOutfit}
        onSecondarySubmit={() => setSaveModalOpen(false)}
      >
        <TextInput
          id="outfit-name"
          labelText="Outfit name"
          placeholder="e.g., 'Summer Picnic Look'"
          value={outfitName}
          onChange={(e) => setOutfitName(e.target.value)}
        />
        <p style={{ marginTop: '1rem', color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
          This outfit includes {selectedIds.length} garment{selectedIds.length !== 1 ? 's' : ''}.
        </p>
      </Modal>
    </div>
  );
}

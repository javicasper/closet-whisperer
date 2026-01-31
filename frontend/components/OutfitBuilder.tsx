'use client';

import { useState, useRef, useEffect } from 'react';
import { generateOutfit, createOutfit } from '@/lib/api';
import { useGarmentStore } from '@/store/garments.store';
import GarmentCard from './GarmentCard';
import { OutfitSuggestion } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast';

export default function OutfitBuilder() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [reasoning, setReasoning] = useState('');
  const { garments } = useGarmentStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.warning('Please enter a description for your outfit');
      return;
    }

    // Cancel previous request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setSuggestions([]);
    setReasoning('');

    try {
      const result = await generateOutfit(prompt);
      setSuggestions(result.suggestions);
      setReasoning(result.reasoning);
      
      if (result.suggestions.length === 0) {
        toast.info('No suitable outfit combinations found. Try adding more garments or adjusting your request.');
      } else {
        toast.success(`Generated ${result.suggestions.length} outfit suggestion(s)! ✨`);
      }
    } catch (error) {
      console.error('Generate error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate outfit suggestions';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleSave = async (suggestion: OutfitSuggestion) => {
    try {
      await createOutfit({
        name: suggestion.name,
        garmentIds: suggestion.garmentIds,
        aiSuggestion: true,
        prompt,
        metadata: { reasoning: suggestion.reasoning },
      });
      toast.success('Outfit saved successfully! 💾');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save outfit');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">✨ AI Outfit Builder</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              What do you need an outfit for?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., 'A casual outfit for a coffee date' or 'Something formal for a wedding'"
              className="w-full border rounded-lg p-3 h-24 resize-none"
              disabled={loading}
            />
          </div>
          
          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full h-12"
            aria-label={loading ? 'Generating outfit suggestions' : 'Generate outfit suggestions'}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating suggestions...
              </span>
            ) : (
              '✨ Generate Outfit'
            )}
          </Button>
        </div>
      </div>

      {reasoning && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">AI Reasoning:</h3>
          <p className="text-sm text-gray-700">{reasoning}</p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Suggestions:</h3>
          
          {suggestions.map((suggestion, idx) => {
            const suggestionGarments = garments.filter(g =>
              suggestion.garmentIds.includes(g.id)
            );

            return (
              <div key={idx} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{suggestion.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {suggestion.reasoning}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => handleSave(suggestion)}
                  >
                    Save Outfit
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {suggestionGarments.map((garment) => (
                    <GarmentCard key={garment.id} garment={garment} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

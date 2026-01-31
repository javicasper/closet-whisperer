'use client';

import { useState } from 'react';
import { generateOutfit, createOutfit } from '@/lib/api';
import { useGarmentStore } from '@/store/garments.store';
import GarmentCard from './GarmentCard';
import { OutfitSuggestion } from '@/types';

export default function OutfitBuilder() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [reasoning, setReasoning] = useState('');
  const { garments } = useGarmentStore();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const result = await generateOutfit(prompt);
      setSuggestions(result.suggestions);
      setReasoning(result.reasoning);
    } catch (error) {
      console.error('Generate error:', error);
      alert('Failed to generate outfit suggestions');
    } finally {
      setLoading(false);
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
      alert('Outfit saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save outfit');
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
          
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating suggestions...' : 'Generate Outfit'}
          </button>
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
                  <button
                    onClick={() => handleSave(suggestion)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Save Outfit
                  </button>
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

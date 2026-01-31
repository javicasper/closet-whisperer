import { config } from '../config.js';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{ type: 'text' | 'image_url'; text?: string; image_url?: { url: string } }>;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface GarmentAnalysis {
  type: string;
  color: string;
  season: string[];
  occasion: string[];
  description: string;
  brand?: string;
}

export class AIService {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://openrouter.ai/api/v1';

  constructor() {
    this.apiKey = config.OPENROUTER_API_KEY;
    this.model = config.OPENROUTER_MODEL;
  }

  async analyzeGarmentImage(imageUrl: string): Promise<GarmentAnalysis> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `You are a fashion expert AI. Analyze clothing images and return structured data in JSON format.
        
Response format:
{
  "type": "TOP|BOTTOM|DRESS|OUTERWEAR|SHOES|ACCESSORY",
  "color": "primary color name",
  "season": ["SPRING", "SUMMER", "FALL", "WINTER", "ALL_SEASON"],
  "occasion": ["casual", "formal", "sport", "business", "party"],
  "description": "brief description of the item",
  "brand": "brand name if visible, otherwise null"
}

Be accurate and concise. Only return valid JSON.`,
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Analyze this garment and return the structured data.',
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl },
          },
        ],
      },
    ];

    const response = await this.makeRequest(messages);
    const content = response.choices[0].message.content;
    
    // Extract JSON from response (might be wrapped in markdown code blocks)
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, content];
    const jsonStr = jsonMatch[1] || content;
    
    return JSON.parse(jsonStr.trim());
  }

  async generateOutfitSuggestions(
    prompt: string,
    mcpTools: any
  ): Promise<{ suggestions: any[]; reasoning: string }> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: `You are a personal stylist AI. Help users create outfits from their wardrobe.

You have access to tools to query the user's wardrobe:
- searchGarments({ type, color, season, occasion, status }): Search for garments matching criteria
- getGarmentById(id): Get details of a specific garment
- getAvailableGarments(): Get all available garments (not in laundry)

When creating outfit suggestions:
1. First understand what the user wants (occasion, weather, style preference)
2. Query the wardrobe using the tools (don't assume what's available)
3. Create 2-3 outfit combinations that work well together
4. Explain your reasoning for each outfit

Return your response in JSON format:
{
  "suggestions": [
    {
      "name": "outfit name",
      "garmentIds": ["id1", "id2", "id3"],
      "reasoning": "why this works"
    }
  ],
  "reasoning": "overall thought process"
}`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    // For now, we'll simulate tool calls by including available garments in context
    // In a full MCP implementation, this would be done via function calling
    const availableGarments = await mcpTools.getAvailableGarments();
    
    messages.push({
      role: 'system',
      content: `Available garments in wardrobe:\n${JSON.stringify(availableGarments, null, 2)}`,
    });

    const response = await this.makeRequest(messages);
    const content = response.choices[0].message.content;
    
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, content];
    const jsonStr = jsonMatch[1] || content;
    
    return JSON.parse(jsonStr.trim());
  }

  private async makeRequest(messages: OpenRouterMessage[]): Promise<OpenRouterResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://github.com/javicasper/closet-whisperer',
        'X-Title': 'Closet Whisperer',
      },
      body: JSON.stringify({
        model: this.model,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
    }

    return response.json();
  }
}

export const aiService = new AIService();

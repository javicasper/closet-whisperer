import { config } from '../config.js';

interface OpenRouterTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };
}

interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | Array<{ type: 'text' | 'image_url'; text?: string; image_url?: { url: string } }>;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content?: string;
      tool_calls?: ToolCall[];
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

    const tools: OpenRouterTool[] = [
      {
        type: 'function',
        function: {
          name: 'searchGarments',
          description: 'Search garments with filters (returns available garments by default)',
          parameters: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['TOP', 'BOTTOM', 'DRESS', 'OUTERWEAR', 'SHOES', 'ACCESSORY'] },
              color: { type: 'string' },
              season: { type: 'string', enum: ['SPRING', 'SUMMER', 'FALL', 'WINTER', 'ALL_SEASON'] },
              occasion: { type: 'string' },
              status: { type: 'string', enum: ['AVAILABLE', 'IN_LAUNDRY', 'UNAVAILABLE'] },
            },
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'getGarmentById',
          description: 'Get a specific garment by ID',
          parameters: {
            type: 'object',
            properties: {
              id: { type: 'string' },
            },
            required: ['id'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'getAvailableGarments',
          description: 'Get all available garments (not in laundry)',
          parameters: {
            type: 'object',
            properties: {},
          },
        },
      },
    ];

    for (let i = 0; i < 4; i++) {
      const response = await this.makeRequest(messages, tools);
      const message = response.choices[0].message;

      if (message.tool_calls && message.tool_calls.length > 0) {
        messages.push({
          role: 'assistant',
          content: message.content || '',
          tool_calls: message.tool_calls,
        });

        for (const call of message.tool_calls) {
          const args = call.function.arguments ? JSON.parse(call.function.arguments) : {};
          let result: any;

          switch (call.function.name) {
            case 'searchGarments':
              result = await mcpTools.searchGarments(args);
              break;
            case 'getGarmentById':
              result = await mcpTools.getGarmentById(args.id);
              break;
            case 'getAvailableGarments':
              result = await mcpTools.getAvailableGarments();
              break;
            default:
              result = { error: 'Unknown tool' };
          }

          messages.push({
            role: 'tool',
            tool_call_id: call.id,
            content: JSON.stringify(result),
          });
        }

        continue;
      }

      if (!message.content) {
        throw new Error('No content returned from OpenRouter');
      }

      const content = message.content;
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, content];
      const jsonStr = jsonMatch[1] || content;

      return JSON.parse(jsonStr.trim());
    }

    throw new Error('OpenRouter did not return a final response');
  }

  private async makeRequest(
    messages: OpenRouterMessage[],
    tools?: OpenRouterTool[]
  ): Promise<OpenRouterResponse> {
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
        tools,
        tool_choice: tools ? 'auto' : undefined,
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

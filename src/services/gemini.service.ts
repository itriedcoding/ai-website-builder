import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, GenerateContentParameters, Part, Tool } from '@google/genai';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI;
  readonly MODEL_NAME = 'gemini-2.5-flash';

  constructor() {
    if (!process.env.API_KEY) {
      console.error('API_KEY environment variable is not set. Please ensure it is configured.');
      throw new Error('Gemini API Key is missing. Cannot initialize service.');
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateContent(params: {
    model: string;
    contents: string | Part[];
    config?: GenerateContentParameters['config'];
    tools?: GenerateContentParameters['tools'];
  }): Promise<GenerateContentResponse> {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: params.model,
        contents: params.contents,
        config: params.config,
        tools: params.tools,
      });
      return response;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get response from Gemini API.');
    }
  }
}
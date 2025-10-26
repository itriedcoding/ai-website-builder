
import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI;
  private readonly MODEL_NAME = 'gemini-2.5-flash';

  constructor() {
    if (!process.env.API_KEY) {
      console.error('API_KEY environment variable is not set. Please ensure it is configured.');
      // Fallback or throw error if API key is critical for app startup
      throw new Error('Gemini API Key is missing. Cannot initialize service.');
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.MODEL_NAME,
        contents: prompt,
        config: {
          temperature: 0.7,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 2048,
          thinkingConfig: { thinkingBudget: 500 } // Reserve tokens for thinking
        },
      });
      return response.text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get response from Gemini API.');
    }
  }
}

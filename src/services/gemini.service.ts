import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, GenerateContentParameters, Part, Tool, Chat } from '@google/genai';

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
      const adjustedConfig = { ...params.config };
      // If google search is enabled, responseMimeType and responseSchema are not allowed.
      // Also systemInstruction is typically handled by chat.create, not generateContent with tools.
      if (params.tools?.some(tool => 'googleSearch' in tool)) {
        adjustedConfig.responseMimeType = undefined;
        adjustedConfig.responseSchema = undefined;
        // systemInstruction is also not allowed with tools for generateContent directly
        adjustedConfig.systemInstruction = undefined;
      }

      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: params.model,
        contents: params.contents,
        config: adjustedConfig,
        tools: params.tools,
      });
      return response;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to get response from Gemini API.');
    }
  }

  /**
   * Creates a new chat instance with the given configuration and tools.
   *
   * @param params - Parameters for creating the chat, including model, config, and tools.
   * @returns A new Chat object.
   */
  createChat(params: {
    model: string;
    config?: GenerateContentParameters['config'];
    tools?: GenerateContentParameters['tools'];
  }): Chat {
    const adjustedConfig = { ...params.config };
    // If google search is enabled, responseMimeType and responseSchema are not allowed for chat.create.
    if (params.tools?.some(tool => 'googleSearch' in tool)) {
      adjustedConfig.responseMimeType = undefined;
      adjustedConfig.responseSchema = undefined;
    }

    return this.ai.chats.create({
      model: params.model,
      config: adjustedConfig,
      tools: params.tools,
    });
  }
}
import { ChangeDetectionStrategy, Component, signal, WritableSignal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneratorFormComponent } from '../generator-form/generator-form.component';
import { WebsitePreviewComponent } from '../website-preview/website-preview.component';
import { WebsiteChatComponent } from '../website-chat/website-chat.component'; // New import
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';
import { GenerateContentResponse, GenerateContentParameters, Part, Tool, Chat } from '@google/genai';
import { GeminiService } from '../../services/gemini.service';

interface GeneratedWebsiteOutput {
  htmlContent: string;
  groundingUrls: { uri: string; title?: string }[];
  isJson: boolean;
  isStreaming?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, GeneratorFormComponent, WebsitePreviewComponent, WebsiteChatComponent, ScrollAnimationDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  generatedOutput: WritableSignal<GeneratedWebsiteOutput | null> = signal(null);
  isLoading: WritableSignal<boolean> = signal(false);
  errorMessage: WritableSignal<string | null> = signal(null);

  chatInstance: WritableSignal<Chat | null> = signal(null);
  chatHistory: WritableSignal<{ role: 'user' | 'model'; text: string }[]> = signal([]);

  private geminiService = inject(GeminiService);

  async generateWebsite(formData: any) {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.generatedOutput.set(null); // Clear previous content
    this.chatHistory.set([]); // Clear chat history for a new generation
    this.chatInstance.set(null); // Clear previous chat instance

    try {
      const { systemInstruction, initialChatPrompt, geminiConfig, geminiTools } = this.constructGeminiRequest(formData);

      const chat = this.geminiService.createChat({
        model: this.geminiService.MODEL_NAME,
        config: { ...geminiConfig, systemInstruction: systemInstruction },
        tools: geminiTools,
      });
      this.chatInstance.set(chat);
      this.chatHistory.update(history => [...history, { role: 'user', text: initialChatPrompt }]);

      let fullResponseText = '';
      const stream = await chat.sendMessageStream({ message: initialChatPrompt });
      this.generatedOutput.set({ htmlContent: '', groundingUrls: [], isJson: formData.responseOutputMimeType === 'application/json', isStreaming: true });

      for await (const chunk of stream) {
        fullResponseText += chunk.text;
        this.generatedOutput.update(output => ({
          ...output!,
          htmlContent: fullResponseText,
        }));
      }

      const groundingUrls = stream.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title,
      })) || [];

      this.generatedOutput.set({
        htmlContent: fullResponseText,
        groundingUrls: groundingUrls,
        isJson: formData.responseOutputMimeType === 'application/json',
        isStreaming: false
      });
      this.chatHistory.update(history => [...history, { role: 'model', text: fullResponseText }]);

    } catch (error: any) {
      console.error('Initial generation failed:', error);
      this.errorMessage.set(`Failed to generate website: ${error.message || 'Unknown error'}. Please try again.`);
      this.chatInstance.set(null); // Reset chat instance on error
    } finally {
      this.isLoading.set(false);
    }
  }

  async sendMessage(userMessage: string) {
    const chat = this.chatInstance();
    if (!chat || !userMessage.trim()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.chatHistory.update(history => [...history, { role: 'user', text: userMessage }]);
    this.generatedOutput.update(output => ({ ...output!, isStreaming: true }));

    try {
      let fullResponseText = '';
      const stream = await chat.sendMessageStream({ message: userMessage });

      for await (const chunk of stream) {
        fullResponseText += chunk.text;
        this.generatedOutput.update(output => ({
          ...output!,
          htmlContent: fullResponseText,
        }));
      }

      const groundingUrls = stream.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title,
      })) || [];

      this.generatedOutput.set({
        htmlContent: fullResponseText,
        groundingUrls: groundingUrls,
        isJson: this.generatedOutput()?.isJson || false, // Maintain original JSON preference
        isStreaming: false
      });
      this.chatHistory.update(history => [...history, { role: 'model', text: fullResponseText }]);

    } catch (error: any) {
      console.error('Chat message generation failed:', error);
      this.errorMessage.set(`Failed to refine website: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      this.isLoading.set(false);
    }
  }

  private constructGeminiRequest(formData: any): {
    systemInstruction: string;
    initialChatPrompt: string;
    geminiConfig: GenerateContentParameters['config'];
    geminiTools: GenerateContentParameters['tools'];
  } {
    // 1. Construct System Instruction (AI's persona and persistent rules)
    let systemInstruction = `You are an expert web developer and AI assistant specializing in generating website outlines and content. Your task is to generate a comprehensive, modern, and responsive website structure, including HTML-like outlines and detailed content suggestions, adhering to user requirements.`;
    systemInstruction += ` You will iteratively refine the website based on user feedback.`;
    systemInstruction += ` Always regenerate the full website structure and content based on ALL requirements given in the conversation history, not just the latest message.`;
    systemInstruction += ` Use modern web design principles and Tailwind CSS classes for styling, including sophisticated hover animations for interactive elements (e.g., hover:scale-105, hover:shadow-xl, hover:bg-blue-600, hover:text-white, hover:translate-y-[-4px]) and smooth transition classes (e.g., transition duration-300 ease-in-out).`;
    systemInstruction += ` Incorporate scroll animations for major sections or components using classes similar to 'scroll-fade-in'.`;

    if (formData.brandTone) {
      systemInstruction += ` The overall brand tone should be "${formData.brandTone}".`;
    }
    if (formData.animationIntensity) {
      systemInstruction += ` The animation style should be ${formData.animationIntensity.toLowerCase()}.`;
      if (formData.animationIntensity === 'Energetic') {
        systemInstruction += ` Include dark mode considerations.`;
      }
    }
    if (formData.languagePreference) {
      systemInstruction += ` The generated content should be primarily in ${formData.languagePreference}.`;
    }
    if (formData.responsiveDesign) {
      systemInstruction += ` Ensure the website is inherently responsive and mobile-first.`;
    }
    if (formData.accessibilityAudit) {
      systemInstruction += ` Provide suggestions for improving website accessibility.`;
    }
    if (formData.performanceTips) {
      systemInstruction += ` Offer tips for enhancing site loading speed and performance.`;
    }

    // 2. Construct Initial Chat Prompt (details of the first generation request)
    let initialChatPrompt = `Generate a website outline and content for a ${formData.websiteType} website.
    The website idea is: "${formData.websiteIdea}".
    The website is for the industry "${formData.industry}" and targets "${formData.targetAudience}".
    Key pages to include are: ${formData.keyPages.join(', ')}.
    Design preferences: primary color ${formData.primaryColor}, accent color ${formData.accentColor}, font style ${formData.fontStyle}, layout ${formData.layoutPreference}, icon style ${formData.iconStyle}.
    The homepage should have around ${formData.numberOfSections} sections.`;

    if (formData.generateSampleContent) {
      initialChatPrompt += ` Generate detailed sample content for these sections.`;
    }
    if (formData.generateContentStrategy) {
      initialChatPrompt += ` Also, provide a brief content strategy for each major section.`;
    }
    if (formData.includeStructuredData) {
      initialChatPrompt += ` Suggest relevant Schema.org structured data markup examples.`;
    }
    if (formData.includeSEOKeywords && formData.seoKeywords) {
      initialChatPrompt += ` Incorporate these SEO keywords: ${formData.seoKeywords}.`;
    }
    if (formData.includeCTA) {
      initialChatPrompt += ` Include a strong Call-to-Action with text "${formData.ctaText}" linking to "${formData.ctaLink}".`;
    }
    if (formData.includeTestimonials) {
      initialChatPrompt += ` Add a testimonials section with ${formData.numberOfTestimonials} examples.`;
    }
    if (formData.includeBlogPosts) {
      initialChatPrompt += ` Include a blog section with ${formData.numberOfBlogPosts} post ideas/summaries.`;
    }
    if (formData.footerContent) {
      initialChatPrompt += ` The footer should include: ${formData.footerContent}.`;
    }
    if (formData.imageGenerationPrompt) {
      initialChatPrompt += ` For images, consider: ${formData.imageGenerationPrompt}.`;
    }
    if (formData.videoGenerationPrompt) {
      initialChatPrompt += ` For videos, consider: ${formData.videoGenerationPrompt}.`;
    }
    if (formData.includePreloader) {
      initialChatPrompt += ` Include a simple preloader/loading animation suggestion.`;
    }
    if (formData.includeCookieConsent) {
      initialChatPrompt += ` Add a cookie consent banner suggestion.`;
    }
    if (formData.integrateSocialMedia) {
      initialChatPrompt += ` Integrate social media links.`;
    }
    if (formData.includeContactForm) {
      initialChatPrompt += ` Include a contact form.`;
    }
    if (formData.requireUserAuth) {
      initialChatPrompt += ` Require user authentication features.`;
    }
    if (formData.includeAnalytics) {
      initialChatPrompt += ` Integrate analytics.`;
    }
    if (formData.enablePaymentGatewaySuggestions) {
      initialChatPrompt += ` Suggest payment gateway integration for e-commerce sites.`;
    }
    if (formData.enableCrmIntegrationSuggestions) {
      initialChatPrompt += ` Suggest CRM integrations for the contact form.`;
    }
    if (formData.enableEmailMarketingSuggestions) {
      initialChatPrompt += ` Suggest email marketing platform integrations.`;
    }
    if (formData.customCssSnippets) {
      initialChatPrompt += ` Include custom CSS snippets: ${formData.customCssSnippets}.`;
    }
    if (formData.customJsSnippets) {
      initialChatPrompt += ` Include custom JS snippets: ${formData.customJsSnippets}.`;
    }

    // 3. Construct Gemini Config
    const geminiConfig: GenerateContentParameters['config'] = {
      temperature: formData.temperature,
      topP: formData.topP,
      topK: formData.topK,
      maxOutputTokens: formData.maxOutputTokens,
      thinkingConfig: { thinkingBudget: formData.thinkingBudget },
      responseMimeType: formData.responseOutputMimeType,
    };

    // 4. Construct Gemini Tools
    const geminiTools: GenerateContentParameters['tools'] = [];
    if (formData.enableGoogleSearch) {
      geminiTools.push({ googleSearch: {} } as Tool);
      // When Google Search is enabled, responseMimeType and responseSchema are not allowed.
      geminiConfig.responseMimeType = undefined;
      geminiConfig.responseSchema = undefined; // Ensure no schema is sent
    } else if (formData.responseOutputMimeType === 'application/json' && formData.jsonSchemaDescription) {
      // If JSON output is requested without Google Search, instruct AI in prompt
      initialChatPrompt += ` The output must be valid JSON matching this described structure: ${formData.jsonSchemaDescription}.`;
      // We rely on prompt guidance for JSON structure, not `responseSchema` object for free-text descriptions.
    }

    return { systemInstruction, initialChatPrompt, geminiConfig, geminiTools };
  }
}
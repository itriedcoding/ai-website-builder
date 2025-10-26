import { ChangeDetectionStrategy, Component, signal, WritableSignal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneratorFormComponent } from '../generator-form/generator-form.component';
import { WebsitePreviewComponent } from '../website-preview/website-preview.component';
import { WebsiteChatComponent } from '../website-chat/website-chat.component';
import { ScrollAnimationDirective } from '../../directives/scroll-animation.directive';
import { GenerateContentResponse, GenerateContentParameters, Part, Tool, Chat, Type } from '@google/genai';
import { GeminiService } from '../../services/gemini.service';

interface GeneratedFile {
  filePath: string;
  fileContent: string;
}

interface GeneratedWebsiteOutput {
  htmlContent: string; // Used for text/plain output (e.g., markdown description)
  files?: GeneratedFile[]; // Used for application/json output (structured files)
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
    this.generatedOutput.set(null);
    this.chatHistory.set([]);
    this.chatInstance.set(null);

    try {
      const { systemInstruction, initialChatPrompt, geminiConfig, geminiTools, responseSchemaForJson } = this.constructGeminiRequest(formData);

      // If JSON output is requested and not using Google Search, apply the responseSchema
      if (formData.responseOutputMimeType === 'application/json' && !formData.enableGoogleSearch) {
        geminiConfig.responseSchema = responseSchemaForJson;
        // The service automatically sets responseMimeType to 'application/json' if responseSchema is present
        // It also handles `systemInstruction = undefined` if tools are present.
      }

      const chat = this.geminiService.createChat({
        model: this.geminiService.MODEL_NAME,
        config: { ...geminiConfig, systemInstruction: systemInstruction }, // System instruction is passed here for chat.create
        tools: geminiTools,
      });
      this.chatInstance.set(chat);
      this.chatHistory.update(history => [...history, { role: 'user', text: initialChatPrompt }]);

      let fullResponseText = '';
      const stream = await chat.sendMessageStream({ message: initialChatPrompt });
      const isJsonOutput = formData.responseOutputMimeType === 'application/json';

      this.generatedOutput.set({
        htmlContent: '', // Use htmlContent for markdown-like text description
        files: isJsonOutput ? [] : undefined, // Initialize files for JSON output
        groundingUrls: [],
        isJson: isJsonOutput,
        isStreaming: true
      });

      for await (const chunk of stream) {
        fullResponseText += chunk.text;
        // Update the output signal as content streams
        this.generatedOutput.update(output => ({
          ...output!,
          htmlContent: fullResponseText, // Always update htmlContent for streaming progress
        }));
      }

      const groundingUrls = stream.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title,
      })) || [];

      let finalGeneratedContent: GeneratedWebsiteOutput;
      if (isJsonOutput) {
        try {
          // Attempt to parse the fullResponseText as JSON files
          const files: GeneratedFile[] = JSON.parse(fullResponseText);
          finalGeneratedContent = {
            htmlContent: '', // Clear htmlContent as files are available
            files: files,
            groundingUrls: groundingUrls,
            isJson: true,
            isStreaming: false
          };
        } catch (e: any) {
          console.error('Failed to parse JSON output:', e);
          this.errorMessage.set(`AI provided invalid JSON. Raw output: ${fullResponseText}. Error: ${e.message}`);
          this.isLoading.set(false);
          return;
        }
      } else {
        // For text/plain, the fullResponseText is the final content
        finalGeneratedContent = {
          htmlContent: fullResponseText,
          files: undefined,
          groundingUrls: groundingUrls,
          isJson: false,
          isStreaming: false
        };
      }

      this.generatedOutput.set(finalGeneratedContent);
      this.chatHistory.update(history => [...history, { role: 'model', text: fullResponseText }]); // Store raw text for chat history

    } catch (error: any) {
      console.error('Initial generation failed:', error);
      this.errorMessage.set(`Failed to generate Next.js project: ${error.message || 'Unknown error'}. Please try again.`);
      this.chatInstance.set(null);
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
    this.generatedOutput.update(output => ({ ...output!, isStreaming: true, htmlContent: '' })); // Clear previous streamed content, keep files/isJson

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

      let finalGeneratedContent: GeneratedWebsiteOutput;
      const originalIsJson = this.generatedOutput()?.isJson || false;

      if (originalIsJson) {
        try {
          const files: GeneratedFile[] = JSON.parse(fullResponseText);
          finalGeneratedContent = {
            htmlContent: '', // Clear htmlContent as files are available
            files: files,
            groundingUrls: groundingUrls,
            isJson: true,
            isStreaming: false
          };
        } catch (e: any) {
          console.error('Failed to parse JSON output during refinement:', e);
          this.errorMessage.set(`AI provided invalid JSON during refinement. Raw output: ${fullResponseText}. Error: ${e.message}`);
          this.isLoading.set(false);
          return;
        }
      } else {
        finalGeneratedContent = {
          htmlContent: fullResponseText,
          files: undefined,
          groundingUrls: groundingUrls,
          isJson: false,
          isStreaming: false
        };
      }

      this.generatedOutput.set(finalGeneratedContent);
      this.chatHistory.update(history => [...history, { role: 'model', text: fullResponseText }]);

    } catch (error: any) {
      console.error('Chat message generation failed:', error);
      this.errorMessage.set(`Failed to refine Next.js project: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      this.isLoading.set(false);
    }
  }

  private constructGeminiRequest(formData: any): {
    systemInstruction: string;
    initialChatPrompt: string;
    geminiConfig: GenerateContentParameters['config'];
    geminiTools: GenerateContentParameters['tools'];
    responseSchemaForJson?: GenerateContentParameters['config']['responseSchema'];
  } {
    // 1. Construct System Instruction (AI's persona and persistent rules)
    let systemInstruction = `You are an expert Next.js developer and architect. Your task is to generate comprehensive and production-ready Next.js project structures and code, including pages, components, API routes, and configuration files.`;
    systemInstruction += ` You will iteratively refine the Next.js project based on user feedback.`;
    systemInstruction += ` Always regenerate the full relevant Next.js code or structure based on ALL requirements given in the conversation history, not just the latest message.`;
    systemInstruction += ` Use the latest Next.js features, React 18+ best practices (functional components, hooks), and Tailwind CSS for styling.`;
    systemInstruction += ` Incorporate sophisticated hover animations (e.g., hover:scale-105, hover:shadow-xl, hover:bg-purple-700, hover:text-white, hover:translate-y-[-4px]) and smooth transition classes (e.g., transition duration-300 ease-in-out).`;
    systemInstruction += ` Use the provided primary and accent colors in the Tailwind config and components.`;
    systemInstruction += ` For responsive design, leverage Tailwind's responsive utility classes.`;

    if (formData.brandTone) {
      systemInstruction += ` The overall brand tone should be "${formData.brandTone}".`;
    }
    if (formData.animationIntensity) {
      systemInstruction += ` The animation style should be ${formData.animationIntensity.toLowerCase()}. Suggest appropriate libraries like Framer Motion or simple CSS animations.`;
    }
    if (formData.languagePreference) {
      systemInstruction += ` All generated code should be in ${formData.languagePreference}.`;
    }
    if (formData.responsiveDesign) { // This is always true
      systemInstruction += ` Ensure all generated components and pages are inherently responsive and mobile-first.`;
    }
    if (formData.accessibilityAudit) {
      systemInstruction += ` Provide accessibility considerations and ARIA attributes in JSX where appropriate.`;
    }
    if (formData.performanceTips) {
      systemInstruction += ` Include performance optimization strategies (e.g., next/image, lazy loading, optimal data fetching with getServerSideProps/getStaticProps/ISR).`;
    }

    // 2. Construct Initial Chat Prompt (details of the first generation request)
    let initialChatPrompt = `Generate a Next.js project.
    The project idea is: "${formData.websiteIdea}".
    It should be a ${formData.websiteType} for the industry "${formData.industry}" and targets "${formData.targetAudience}".
    Key pages to include are: ${formData.keyPages.join(', ')}.
    Design preferences: primary color ${formData.primaryColor}, accent color ${formData.accentColor}, font style ${formData.fontStyle}, layout ${formData.layoutPreference}, icon style ${formData.iconStyle}.
    The homepage should have around ${formData.numberOfSections} sections, implemented as React components.`;

    if (formData.generateSampleContent) {
      initialChatPrompt += ` Generate detailed placeholder content and data for these sections and pages.`;
    }
    if (formData.generateContentStrategy) {
      initialChatPrompt += ` Also, provide a brief content strategy within the comments for each major page/component.`;
    }
    if (formData.includeStructuredData) {
      initialChatPrompt += ` Suggest relevant Schema.org structured data markup examples within pages or a dedicated SEO component.`;
    }
    if (formData.includeSEOKeywords && formData.seoKeywords) {
      initialChatPrompt += ` Incorporate these SEO keywords: ${formData.seoKeywords} using Next.js Head or next-seo.`;
    }
    if (formData.includeCTA) {
      initialChatPrompt += ` Include a strong Call-to-Action React component with text "${formData.ctaText}" linking to "${formData.ctaLink}".`;
    }
    if (formData.includeTestimonials) {
      initialChatPrompt += ` Add a testimonials React component with ${formData.numberOfTestimonials} examples.`;
    }
    if (formData.includeBlogPosts) {
      initialChatPrompt += ` Include a blog section with ${formData.numberOfBlogPosts} post ideas/summaries, using dynamic routing for individual posts.`;
    }
    if (formData.footerContent) {
      initialChatPrompt += ` The footer component should include: ${formData.footerContent}.`;
    }
    if (formData.imageGenerationPrompt) {
      initialChatPrompt += ` For image placeholders, consider: "${formData.imageGenerationPrompt}". Use next/image.`;
    }
    if (formData.videoGenerationPrompt) {
      initialChatPrompt += ` For video placeholders, consider: "${formData.videoGenerationPrompt}".`;
    }
    if (formData.includePreloader) {
      initialChatPrompt += ` Include a simple preloader/loading animation React component.`;
    }
    if (formData.includeCookieConsent) {
      initialChatPrompt += ` Add a cookie consent banner React component.`;
    }
    if (formData.integrateSocialMedia) {
      initialChatPrompt += ` Integrate social media links in the footer and/or contact section.`;
    }
    if (formData.includeContactForm) {
      initialChatPrompt += ` Include a contact form React component with an API route for submission.`;
    }
    if (formData.requireUserAuth) {
      initialChatPrompt += ` Implement basic user authentication features using NextAuth.js boilerplate.`;
    }
    if (formData.includeAnalytics) {
      initialChatPrompt += ` Include analytics integration (e.g., Vercel Analytics or Google Analytics snippet in _app.tsx).`;
    }
    if (formData.enablePaymentGatewaySuggestions) {
      initialChatPrompt += ` Suggest and provide boilerplate code for Stripe payment gateway integration in an API route.`;
    }
    if (formData.enableCrmIntegrationSuggestions) {
      initialChatPrompt += ` Suggest CRM integrations (e.g., Salesforce, HubSpot) via API routes.`;
    }
    if (formData.enableEmailMarketingSuggestions) {
      initialChatPrompt += ` Suggest email marketing platform integrations (e.g., Mailchimp, SendGrid) via API routes.`;
    }
    if (formData.databasePreference) {
      initialChatPrompt += ` Integrate a ${formData.databasePreference} database. Provide relevant schema and basic CRUD API routes.`;
    }
    if (formData.customCssSnippets) {
      initialChatPrompt += ` Include custom CSS snippets in a globals.css or component style: ${formData.customCssSnippets}.`;
    }
    if (formData.customJsSnippets) {
      initialChatPrompt += ` Include custom JS/TS snippets in _app.tsx or a utility hook: ${formData.customJsSnippets}.`;
    }

    // Explicitly request Vercel deployment hints
    initialChatPrompt += ` Also, include considerations for Vercel deployment, like necessary environment variables or config.`;


    // 3. Construct Gemini Config
    const geminiConfig: GenerateContentParameters['config'] = {
      temperature: formData.temperature,
      topP: formData.topP,
      topK: formData.topK,
      maxOutputTokens: formData.maxOutputTokens,
      thinkingConfig: { thinkingBudget: formData.thinkingBudget },
      responseMimeType: formData.responseOutputMimeType,
      seed: 42, // Consistent results for initial output if needed
    };

    // 4. Construct Gemini Tools
    const geminiTools: GenerateContentParameters['tools'] = [];
    if (formData.enableGoogleSearch) {
      geminiTools.push({ googleSearch: {} } as Tool);
      // When Google Search is enabled, responseMimeType and responseSchema are not allowed
      // The GeminiService already handles setting these to undefined.
    }

    // 5. Construct responseSchema for JSON output if applicable
    let responseSchemaForJson: GenerateContentParameters['config']['responseSchema'] | undefined = undefined;
    if (formData.responseOutputMimeType === 'application/json' && !formData.enableGoogleSearch) {
      responseSchemaForJson = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            filePath: {
              type: Type.STRING,
              description: 'The path and filename for the generated Next.js code, e.g., "pages/index.tsx", "components/Header.tsx", "api/auth/[...nextauth].ts", "tailwind.config.js".',
            },
            fileContent: {
              type: Type.STRING,
              description: 'The full content of the file, including imports, JSX, TypeScript, and exports.',
            },
          },
          propertyOrdering: ["filePath", "fileContent"],
        },
      };
      // If a custom schema description is provided, it can be added to the initial prompt.
      if (formData.jsonFileSchemaDescription) {
        initialChatPrompt += ` The output should be valid JSON as an array of objects, each with 'filePath' and 'fileContent' properties. Follow this general structure description: ${formData.jsonFileSchemaDescription}.`;
      } else {
        initialChatPrompt += ` The output should be valid JSON as an array of objects, each with 'filePath' (string, e.g., pages/index.tsx) and 'fileContent' (string) properties, representing the full Next.js project files.`;
      }
    }


    return { systemInstruction, initialChatPrompt, geminiConfig, geminiTools, responseSchemaForJson };
  }
}